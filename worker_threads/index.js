const { Worker, isMainThread, parentPort, workerData, MessageChannel } = require('worker_threads');
const path = require('path');
const fs = require('fs');

console.log('=== Node.js worker_threads 模块学习案例 ===\n');

/**
 * worker_threads 模块允许使用并行执行 JavaScript 的线程
 * 与 child_process 不同，worker_threads 可以共享内存
 * 适用于 CPU 密集型任务
 */

if (isMainThread) {
    console.log('主线程开始执行...');
    
    /**
     * 1. 基本的 Worker 创建和使用
     */
    function basicWorkerExample() {
        console.log('\n1. 基本 Worker 示例:');
        
        // 创建 worker 脚本
        const workerScript = `
const { parentPort } = require('worker_threads');

// 监听主线程消息
parentPort.on('message', (data) => {
    console.log('Worker 收到消息:', data);
    
    // 执行计算任务
    const result = data.number * data.number;
    
    // 发送结果回主线程
    parentPort.postMessage({
        type: 'result',
        result: result,
        message: '计算完成'
    });
});

console.log('Worker 线程已启动');
`;
        
        fs.writeFileSync(path.join(__dirname, 'basic-worker.js'), workerScript);
        
        const worker = new Worker(path.join(__dirname, 'basic-worker.js'));
        
        // 发送消息给 worker
        worker.postMessage({ number: 10 });
        
        // 监听 worker 消息
        worker.on('message', (data) => {
            console.log('主线程收到结果:', data);
            worker.terminate();
            workerDataExample();
        });
        
        // 监听 worker 错误
        worker.on('error', (err) => {
            console.error('Worker 错误:', err);
        });
        
        // 监听 worker 退出
        worker.on('exit', (code) => {
            console.log(`Worker 退出，退出码: ${code}`);
        });
    }
    
    /**
     * 2. 使用 workerData 传递初始数据
     */
    function workerDataExample() {
        console.log('\n2. workerData 示例:');
        
        const workerScript = `
const { parentPort, workerData } = require('worker_threads');

console.log('Worker 接收到初始数据:', workerData);

// 使用初始数据进行计算
const result = workerData.numbers.reduce((sum, num) => sum + num, 0);

parentPort.postMessage({
    type: 'sum',
    result: result,
    originalData: workerData
});
`;
        
        fs.writeFileSync(path.join(__dirname, 'data-worker.js'), workerScript);
        
        const worker = new Worker(path.join(__dirname, 'data-worker.js'), {
            workerData: {
                numbers: [1, 2, 3, 4, 5],
                operation: 'sum'
            }
        });
        
        worker.on('message', (data) => {
            console.log('计算结果:', data);
            worker.terminate();
            cpuIntensiveExample();
        });
    }
    
    /**
     * 3. CPU 密集型任务示例
     */
    function cpuIntensiveExample() {
        console.log('\n3. CPU 密集型任务示例:');
        
        const workerScript = `
const { parentPort, workerData } = require('worker_threads');

// 计算斐波那契数列（CPU 密集型任务）
function fibonacci(n) {
    if (n < 2) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

// 计算质数（CPU 密集型任务）
function isPrime(n) {
    if (n < 2) return false;
    for (let i = 2; i <= Math.sqrt(n); i++) {
        if (n % i === 0) return false;
    }
    return true;
}

const { task, data } = workerData;

let result;
const startTime = Date.now();

switch (task) {
    case 'fibonacci':
        result = fibonacci(data);
        break;
    case 'prime':
        result = isPrime(data);
        break;
    case 'primes':
        result = [];
        for (let i = 2; i <= data; i++) {
            if (isPrime(i)) result.push(i);
        }
        break;
}

const endTime = Date.now();

parentPort.postMessage({
    task,
    result,
    executionTime: endTime - startTime,
    data
});
`;
        
        fs.writeFileSync(path.join(__dirname, 'cpu-worker.js'), workerScript);
        
        // 创建多个 worker 处理不同任务
        const tasks = [
            { task: 'fibonacci', data: 35 },
            { task: 'prime', data: 982451653 },
            { task: 'primes', data: 10000 }
        ];
        
        let completedTasks = 0;
        
        tasks.forEach((taskData, index) => {
            const worker = new Worker(path.join(__dirname, 'cpu-worker.js'), {
                workerData: taskData
            });
            
            worker.on('message', (result) => {
                console.log(`任务 ${index + 1} 完成:`, result);
                worker.terminate();
                
                completedTasks++;
                if (completedTasks === tasks.length) {
                    messageChannelExample();
                }
            });
        });
    }
    
    /**
     * 4. MessageChannel 示例
     */
    function messageChannelExample() {
        console.log('\n4. MessageChannel 示例:');
        
        const workerScript = `
const { parentPort } = require('worker_threads');

parentPort.on('message', ({ port }) => {
    // 使用传递过来的 MessagePort
    port.on('message', (data) => {
        console.log('Worker 通过 MessageChannel 收到:', data);
        port.postMessage({ response: 'Worker 响应: ' + data.message });
    });
    
    port.start();
});
`;
        
        fs.writeFileSync(path.join(__dirname, 'channel-worker.js'), workerScript);
        
        const { port1, port2 } = new MessageChannel();
        const worker = new Worker(path.join(__dirname, 'channel-worker.js'));
        
        // 将 port2 传递给 worker
        worker.postMessage({ port: port2 }, [port2]);
        
        // 使用 port1 与 worker 通信
        port1.on('message', (data) => {
            console.log('主线程通过 MessageChannel 收到:', data);
            port1.close();
            worker.terminate();
            sharedArrayBufferExample();
        });
        
        port1.postMessage({ message: 'Hello from MessageChannel!' });
    }
    
    /**
     * 5. SharedArrayBuffer 示例（共享内存）
     */
    function sharedArrayBufferExample() {
        console.log('\n5. SharedArrayBuffer 示例:');
        
        const workerScript = `
const { parentPort, workerData } = require('worker_threads');

const { sharedBuffer } = workerData;
const sharedArray = new Int32Array(sharedBuffer);

// 修改共享内存
for (let i = 0; i < sharedArray.length; i++) {
    sharedArray[i] = i * i; // 存储平方值
}

parentPort.postMessage({ message: 'SharedArrayBuffer 已更新' });
`;
        
        fs.writeFileSync(path.join(__dirname, 'shared-worker.js'), workerScript);
        
        // 创建共享内存
        const sharedBuffer = new SharedArrayBuffer(40); // 10 个 int32
        const sharedArray = new Int32Array(sharedBuffer);
        
        console.log('共享内存初始值:', Array.from(sharedArray));
        
        const worker = new Worker(path.join(__dirname, 'shared-worker.js'), {
            workerData: { sharedBuffer }
        });
        
        worker.on('message', (data) => {
            console.log(data.message);
            console.log('共享内存更新后:', Array.from(sharedArray));
            worker.terminate();
            workerPoolExample();
        });
    }
    
    /**
     * 6. Worker 池示例
     */
    function workerPoolExample() {
        console.log('\n6. Worker 池示例:');
        
        class WorkerPool {
            constructor(workerScript, poolSize = 4) {
                this.workerScript = workerScript;
                this.poolSize = poolSize;
                this.workers = [];
                this.queue = [];
                this.activeWorkers = 0;
                
                this.initializeWorkers();
            }
            
            initializeWorkers() {
                for (let i = 0; i < this.poolSize; i++) {
                    this.workers.push(this.createWorker());
                }
            }
            
            createWorker() {
                const worker = new Worker(this.workerScript);
                worker.busy = false;
                
                worker.on('message', (result) => {
                    worker.busy = false;
                    this.activeWorkers--;
                    
                    if (worker.currentResolve) {
                        worker.currentResolve(result);
                        worker.currentResolve = null;
                    }
                    
                    this.processQueue();
                });
                
                return worker;
            }
            
            execute(data) {
                return new Promise((resolve, reject) => {
                    this.queue.push({ data, resolve, reject });
                    this.processQueue();
                });
            }
            
            processQueue() {
                if (this.queue.length === 0) return;
                
                const availableWorker = this.workers.find(w => !w.busy);
                if (!availableWorker) return;
                
                const { data, resolve, reject } = this.queue.shift();
                availableWorker.busy = true;
                availableWorker.currentResolve = resolve;
                this.activeWorkers++;
                
                availableWorker.postMessage(data);
            }
            
            terminate() {
                this.workers.forEach(worker => worker.terminate());
            }
        }
        
        // 创建 worker 脚本
        const poolWorkerScript = `
const { parentPort } = require('worker_threads');

parentPort.on('message', (data) => {
    // 模拟一些计算工作
    const result = Math.pow(data.number, 2) + Math.random() * 1000;
    
    // 模拟异步工作
    setTimeout(() => {
        parentPort.postMessage({
            workerId: process.pid,
            input: data.number,
            result: Math.floor(result)
        });
    }, Math.random() * 1000);
});
`;
        
        fs.writeFileSync(path.join(__dirname, 'pool-worker.js'), poolWorkerScript);
        
        const pool = new WorkerPool(path.join(__dirname, 'pool-worker.js'), 3);
        
        // 提交多个任务
        const tasks = Array.from({ length: 10 }, (_, i) => 
            pool.execute({ number: i + 1 })
        );
        
        Promise.all(tasks).then(results => {
            console.log('所有任务完成:');
            results.forEach((result, index) => {
                console.log(`任务 ${index + 1}:`, result);
            });
            
            pool.terminate();
            performanceComparisonExample();
        });
    }
    
    /**
     * 7. 性能对比示例
     */
    function performanceComparisonExample() {
        console.log('\n7. 性能对比示例:');
        
        // CPU 密集型任务
        function heavyComputation(n) {
            let result = 0;
            for (let i = 0; i < n; i++) {
                result += Math.sqrt(i) * Math.sin(i);
            }
            return result;
        }
        
        const workerScript = `
const { parentPort, workerData } = require('worker_threads');

function heavyComputation(n) {
    let result = 0;
    for (let i = 0; i < n; i++) {
        result += Math.sqrt(i) * Math.sin(i);
    }
    return result;
}

const result = heavyComputation(workerData.n);
parentPort.postMessage({ result, workerId: process.pid });
`;
        
        fs.writeFileSync(path.join(__dirname, 'perf-worker.js'), workerScript);
        
        const n = 5000000;
        
        // 单线程执行
        console.log('开始单线程计算...');
        const singleThreadStart = Date.now();
        const singleResult = heavyComputation(n);
        const singleThreadTime = Date.now() - singleThreadStart;
        console.log(`单线程结果: ${singleResult}, 耗时: ${singleThreadTime}ms`);
        
        // 多线程执行
        console.log('开始多线程计算...');
        const multiThreadStart = Date.now();
        
        const workers = [];
        const results = [];
        const workerCount = 4;
        const chunkSize = Math.floor(n / workerCount);
        
        let completedWorkers = 0;
        
        for (let i = 0; i < workerCount; i++) {
            const worker = new Worker(path.join(__dirname, 'perf-worker.js'), {
                workerData: { n: chunkSize }
            });
            
            worker.on('message', (data) => {
                results.push(data.result);
                completedWorkers++;
                
                if (completedWorkers === workerCount) {
                    const multiResult = results.reduce((sum, r) => sum + r, 0);
                    const multiThreadTime = Date.now() - multiThreadStart;
                    
                    console.log(`多线程结果: ${multiResult}, 耗时: ${multiThreadTime}ms`);
                    console.log(`性能提升: ${((singleThreadTime / multiThreadTime) * 100).toFixed(2)}%`);
                    
                    workers.forEach(w => w.terminate());
                    cleanupFiles();
                }
            });
            
            workers.push(worker);
        }
    }
    
    /**
     * 清理临时文件
     */
    function cleanupFiles() {
        console.log('\n清理临时文件...');
        const files = [
            'basic-worker.js',
            'data-worker.js',
            'cpu-worker.js',
            'channel-worker.js',
            'shared-worker.js',
            'pool-worker.js',
            'perf-worker.js'
        ];
        
        files.forEach(file => {
            const filePath = path.join(__dirname, file);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        });
        
        console.log('临时文件已清理');
        console.log('\n=== worker_threads 模块学习完成 ===');
    }
    
    // 开始执行示例
    basicWorkerExample();
    
} else {
    // 这部分代码在 worker 线程中执行
    console.log('Worker 线程代码区域');
    console.log('Worker 数据:', workerData);
    
    // 向主线程发送消息
    if (parentPort) {
        parentPort.postMessage({
            message: 'Hello from worker thread!',
            pid: process.pid,
            threadId: require('worker_threads').threadId
        });
    }
}

console.log('\n=== worker_threads 模块学习要点 ===');
console.log('1. worker_threads 提供真正的多线程支持');
console.log('2. 适用于 CPU 密集型任务，可以并行处理');
console.log('3. 支持 SharedArrayBuffer 共享内存');
console.log('4. 使用 MessageChannel 进行高级通信');
console.log('5. Worker 池可以有效管理线程资源');
console.log('6. 比 child_process 更轻量，启动更快');
console.log('7. 可以传递 workerData 作为初始数据');
console.log('8. 注意线程安全和内存管理');
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

console.log('=== Node.js cluster 模块学习案例 ===\n');

/**
 * cluster模块允许创建共享服务器端口的子进程
 * 主要用于充分利用多核CPU系统
 */

if (cluster.isMaster) {
    console.log(`主进程 ${process.pid} 正在运行`);
    console.log(`CPU 核心数: ${numCPUs}`);
    
    // 记录工作进程信息
    const workers = {};
    
    /**
     * 1. 基本的集群创建
     */
    console.log('\n1. 创建工作进程:');
    
    // 根据CPU核心数创建工作进程
    for (let i = 0; i < Math.min(numCPUs, 4); i++) {
        const worker = cluster.fork();
        workers[worker.process.pid] = worker;
        console.log(`工作进程 ${worker.process.pid} 已启动`);
    }
    
    /**
     * 2. 监听工作进程事件
     */
    cluster.on('online', (worker) => {
        console.log(`工作进程 ${worker.process.pid} 已上线`);
    });
    
    cluster.on('exit', (worker, code, signal) => {
        console.log(`工作进程 ${worker.process.pid} 已退出，退出码: ${code}, 信号: ${signal}`);
        delete workers[worker.process.pid];
        
        // 自动重启死掉的工作进程
        if (!worker.exitedAfterDisconnect) {
            console.log('重启工作进程...');
            const newWorker = cluster.fork();
            workers[newWorker.process.pid] = newWorker;
        }
    });
    
    /**
     * 3. 主进程与工作进程通信
     */
    cluster.on('message', (worker, message) => {
        console.log(`主进程收到来自工作进程 ${worker.process.pid} 的消息:`, message);
        
        // 广播消息给所有工作进程
        if (message.type === 'broadcast') {
            Object.values(workers).forEach(w => {
                if (w.process.pid !== worker.process.pid) {
                    w.send({
                        type: 'broadcast_message',
                        from: worker.process.pid,
                        data: message.data
                    });
                }
            });
        }
    });
    
    /**
     * 4. 优雅关闭集群
     */
    process.on('SIGTERM', () => {
        console.log('主进程收到 SIGTERM 信号，开始优雅关闭...');
        
        Object.values(workers).forEach(worker => {
            worker.disconnect();
        });
        
        setTimeout(() => {
            console.log('强制退出所有工作进程');
            Object.values(workers).forEach(worker => {
                worker.kill();
            });
            process.exit(0);
        }, 5000);
    });
    
    /**
     * 5. 集群状态监控
     */
    setInterval(() => {
        const activeWorkers = Object.keys(workers).length;
        console.log(`\n集群状态 - 活跃工作进程数: ${activeWorkers}`);
        
        Object.values(workers).forEach(worker => {
            worker.send({ type: 'ping', timestamp: Date.now() });
        });
    }, 10000);
    
    /**
     * 6. 负载均衡演示
     */
    setTimeout(() => {
        console.log('\n开始负载测试...');
        console.log('可以访问 http://localhost:3000 来测试负载均衡');
        console.log('每次刷新页面会由不同的工作进程处理请求');
    }, 2000);
    
    // 30秒后优雅关闭演示
    setTimeout(() => {
        console.log('\n演示即将结束，开始关闭集群...');
        Object.values(workers).forEach(worker => {
            worker.disconnect();
        });
        
        setTimeout(() => {
            process.exit(0);
        }, 3000);
    }, 30000);
    
} else {
    /**
     * 工作进程代码
     */
    console.log(`工作进程 ${process.pid} 开始工作`);
    
    // 创建HTTP服务器
    const server = http.createServer((req, res) => {
        // 模拟一些处理时间
        const processingTime = Math.random() * 100;
        
        setTimeout(() => {
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({
                message: '请求处理完成',
                worker: process.pid,
                timestamp: new Date().toISOString(),
                processingTime: `${processingTime.toFixed(2)}ms`,
                url: req.url,
                method: req.method
            }, null, 2));
            
            // 发送统计信息给主进程
            process.send({
                type: 'request_handled',
                worker: process.pid,
                url: req.url,
                processingTime: processingTime
            });
            
        }, processingTime);
    });
    
    // 监听端口
    server.listen(3000, () => {
        console.log(`工作进程 ${process.pid} 的HTTP服务器在端口 3000 上运行`);
    });
    
    /**
     * 工作进程消息处理
     */
    process.on('message', (message) => {
        switch (message.type) {
            case 'ping':
                process.send({
                    type: 'pong',
                    worker: process.pid,
                    timestamp: Date.now(),
                    uptime: process.uptime()
                });
                break;
                
            case 'broadcast_message':
                console.log(`工作进程 ${process.pid} 收到广播消息，来自 ${message.from}:`, message.data);
                break;
                
            default:
                console.log(`工作进程 ${process.pid} 收到未知消息:`, message);
        }
    });
    
    /**
     * 工作进程错误处理
     */
    process.on('uncaughtException', (err) => {
        console.error(`工作进程 ${process.pid} 发生未捕获异常:`, err);
        process.send({
            type: 'error',
            worker: process.pid,
            error: err.message
        });
        process.exit(1);
    });
    
    /**
     * 优雅关闭工作进程
     */
    process.on('disconnect', () => {
        console.log(`工作进程 ${process.pid} 与主进程断开连接，开始优雅关闭...`);
        
        server.close(() => {
            console.log(`工作进程 ${process.pid} HTTP服务器已关闭`);
            process.exit(0);
        });
        
        // 如果5秒内无法优雅关闭，强制退出
        setTimeout(() => {
            console.log(`工作进程 ${process.pid} 强制退出`);
            process.exit(1);
        }, 5000);
    });
    
    // 定期发送心跳和状态信息
    setInterval(() => {
        process.send({
            type: 'heartbeat',
            worker: process.pid,
            memory: process.memoryUsage(),
            uptime: process.uptime()
        });
    }, 5000);
    
    // 模拟工作进程之间的通信
    setTimeout(() => {
        process.send({
            type: 'broadcast',
            data: `来自工作进程 ${process.pid} 的广播消息`
        });
    }, Math.random() * 10000 + 5000);
}

/**
 * 集群配置选项说明:
 * 
 * cluster.setupMaster({
 *   exec: 'worker.js',        // 工作进程执行的文件
 *   args: ['--use', 'https'], // 传递给工作进程的参数
 *   silent: false,            // 是否静默模式
 *   stdio: ['pipe', 'pipe', 'pipe', 'ipc'] // 标准输入输出配置
 * });
 * 
 * 负载均衡策略:
 * - cluster.SCHED_RR: 轮询调度（默认，除了Windows）
 * - cluster.SCHED_NONE: 由操作系统调度（Windows默认）
 */

console.log('\n=== cluster 模块学习要点 ===');
console.log('1. cluster 模块用于创建多进程应用，充分利用多核CPU');
console.log('2. 主进程负责管理工作进程，工作进程处理实际业务');
console.log('3. 所有工作进程共享同一个端口');
console.log('4. 支持进程间通信（IPC）');
console.log('5. 自动负载均衡请求分发');
console.log('6. 支持工作进程的自动重启');
console.log('7. 适用于CPU密集型应用的性能优化');
const { spawn, exec, execSync, execFile, fork } = require("child_process");
const path = require("path");

console.log('=== Node.js child_process 模块学习案例 ===\n');

/**
 * 1. spawn() 方法 - 启动子进程执行命令
 * 适用于需要处理大量数据或长时间运行的进程
 */
function spawnExample() {
    console.log('1. spawn() 示例:');

    // 在Windows上使用dir命令列出当前目录
    const ls = spawn('cmd', ['/c', 'dir'], { cwd: __dirname });

    // 监听标准输出
    ls.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    // 监听标准错误
    ls.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    // 监听进程关闭
    ls.on('close', (code) => {
        console.log(`子进程退出，退出码: ${code}\n`);
        execExample();
    });
}

/**
 * 2. exec() 方法 - 执行shell命令
 * 适用于简单的命令执行，会缓冲输出
 */
function execExample() {
    console.log('2. exec() 示例:');

    exec('echo "Hello from exec!"', (error, stdout, stderr) => {
        if (error) {
            console.error(`执行错误: ${error}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);

        execFileExample();
    });
}

/**
 * 3. execFile() 方法 - 直接执行文件
 * 比exec更安全，不会通过shell执行
 */
function execFileExample() {
    console.log('3. execFile() 示例:');
    
    // 在Windows上执行node命令
    execFile('node', ['--version'], (error, stdout, stderr) => {
        if (error) {
            console.error(`执行错误: ${error}`);
            return;
        }
        console.log(`Node.js 版本: ${stdout}`);
        
        // 执行批处理文件示例
        execBatFileExample();
    });
}

/**
 * 执行批处理文件示例
 */
function execBatFileExample() {
    console.log('4. 执行批处理文件示例:');
    
    // 方式1: 使用 cmd.exe 执行
    execFile(
        "cmd.exe",
        ["/c", path.resolve(__dirname, "./bat.cmd")],
        (error, stdout, stderr) => {
            if (error) {
                console.error(`执行错误: ${error}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
            
            // 继续执行其他示例
            execFileWithShellExample();
        }
    );
}

/**
 * 使用 shell: true 的方式执行批处理文件
 */
function execFileWithShellExample() {
    console.log('5. 使用 shell: true 方式执行批处理文件:');
    
    execFile(
        path.resolve(__dirname, "./bat.cmd"),
        [],
        { shell: true },
        (error, stdout, stderr) => {
            if (error) {
                console.error(`执行错误: ${error}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
            
            // 继续执行网络状态示例
            netstatExample();
        }
    );
}

/**
 * 网络状态查看示例
 */
function netstatExample() {
    console.log('6. 网络状态查看示例 (netstat):');
    
    // 通过spawn执行netstat命令，实时打印到控制台
    const netstat = spawn("netstat", ["-an"]);

    // 监听标准输出
    netstat.stdout.on("data", (data) => {
        console.log(`netstat输出: ${data.toString().substring(0, 200)}...`); // 只显示前200个字符
    });

    // 监听标准错误
    netstat.stderr.on("data", (data) => {
        console.error(`netstat错误: ${data}`);
    });

    // 监听进程关闭
    netstat.on("close", (code) => {
        console.log(`netstat子进程退出，退出码: ${code}\n`);
        createChildScript();
    });
}

/**
 * 创建一个子脚本用于fork示例
 */
function createChildScript() {
    console.log('7. 创建子脚本文件:');
    
    const fs = require('fs');
    const childScriptPath = path.join(__dirname, 'child.js');

    const childScript = `
// child.js - 子进程脚本
process.on('message', (msg) => {
    console.log('子进程收到消息:', msg);

    // 执行一些计算
    const result = msg.number * 2;

    // 发送结果回父进程
    process.send({ result: result, message: '计算完成' });
});

console.log('子进程已启动，PID:', process.pid);
`;

    fs.writeFileSync(childScriptPath, childScript);
    console.log('子脚本文件创建完成');
    forkExample();
}

/**
 * 4. fork() 方法 - 创建Node.js子进程
 * 专门用于创建Node.js子进程，支持IPC通信
 */
function forkExample() {
    console.log('8. fork() 示例:');

    const childPath = path.join(__dirname, 'child.js');
    const child = fork(childPath);

    // 发送消息给子进程
    child.send({ number: 10, message: '请计算这个数字的2倍' });

    // 监听子进程消息
    child.on('message', (msg) => {
        console.log('父进程收到消息:', msg);
        child.kill(); // 结束子进程

        spawnWithOptionsExample();
    });

    // 监听子进程退出
    child.on('exit', (code, signal) => {
        console.log(`子进程退出，退出码: ${code}, 信号: ${signal}\n`);
    });
}

/**
 * 5. spawn() 高级选项示例
 */

function spawnWithOptionsExample() {
    console.log('9. spawn() 高级选项示例:');

    const child = spawn('node', ['--version'], {
        stdio: ['pipe', 'pipe', 'pipe'], // 标准输入输出配置
        env: { ...process.env, CUSTOM_VAR: 'hello' }, // 环境变量
        cwd: __dirname, // 工作目录
        detached: false // 是否分离进程
    });

    child.stdout.on('data', (data) => {
        console.log(`版本信息: ${data}`);
    });

    child.on('close', (code) => {
        console.log(`进程退出码: ${code}\n`);
        processManagementExample();
    });
}

/**
 * 6. 进程管理示例
 */
function processManagementExample() {
    console.log('10. 进程管理示例:');

    // 创建一个长时间运行的进程
    const longRunning = spawn('node', ['-e', 'setInterval(() => console.log("运行中..."), 1000)']);

    longRunning.stdout.on('data', (data) => {
        console.log(`长时间进程输出: ${data.toString().trim()}`);
    });

    // 3秒后终止进程
    setTimeout(() => {
        console.log('正在终止长时间运行的进程...');
        longRunning.kill('SIGTERM');
    }, 3000);

    longRunning.on('exit', (code, signal) => {
        console.log(`长时间进程已终止，退出码: ${code}, 信号: ${signal}\n`);
        errorHandlingExample();
    });
}

/**
 * 7. 错误处理示例
 */
function errorHandlingExample() {
    console.log('11. 错误处理示例:');

    // 尝试执行不存在的命令
    const child = spawn('nonexistent-command');

    child.on('error', (err) => {
        console.log('进程启动失败:', err.message);
    });

    child.on('close', (code) => {
        console.log(`错误处理示例完成\n`);
        console.log('=== child_process 模块学习完成 ===');
    });
}

// 开始执行示例
spawnExample();

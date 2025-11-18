
// child.js - 子进程脚本
process.on('message', (msg) => {
    console.log('子进程收到消息:', msg);

    // 执行一些计算
    const result = msg.number * 2;

    // 发送结果回父进程
    process.send({ result: result, message: '计算完成' });
});

console.log('子进程已启动，PID:', process.pid);

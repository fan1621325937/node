// process 对象是一个全局变量，它提供了有关当前 Node.js 进程的信息并对其进行控制。

// 1. process.argv
// 返回一个数组，其中包含启动 Node.js 进程时传递的命令行参数。
// 第一个元素是 process.execPath (node 可执行文件的路径)
// 第二个元素是正在执行的 JavaScript 文件的路径。
// 其余元素是任何其他命令行参数。
console.log('命令行参数 (process.argv):', process.argv);
// 运行方式: node process/index.js arg1 arg2=test
// 输出:
// [
//   'C:\\Program Files\\nodejs\\node.exe',
//   'E:\\项目示例\\nodejs-learning\\process\\index.js',
//   'arg1',
//   'arg2=test'
// ]

// 2. process.env
// 返回一个包含用户环境的对象。
console.log('\n部分环境变量 (process.env):');
console.log('PATH:', process.env.PATH.substring(0, 50) + '...'); // 打印部分 PATH 环境变量
console.log('OS:', process.env.OS); // 在 Windows 上会打印 'Windows_NT'

// 3. process.cwd()
// 返回 Node.js 进程的当前工作目录。
console.log('\n当前工作目录 (process.cwd()):', process.cwd());

// 4. process.exit([code])
// 使用指定的 `code` 指示 Node.js 进程同步终止。
// 如果省略 `code`，则退出使用“成功”代码 `0`。
console.log('\n代码将在2秒后以代码 0 退出...');
setTimeout(() => {
  console.log('正在退出...');
  process.exit(0);
}, 2000);

// 这行代码将不会被执行，因为 process.exit() 会立即终止进程。
console.log('这行代码不会被打印。');
const readline = require("readline");

// 创建一个接口，用于从 stdin 读取数据，并将数据写入 stdout
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// 提问并等待用户响应
rl.question("你叫什么名字? ", (answer) => {
  // 打印用户的回答
  console.log(`你好, ${answer}!`);

  // 关闭 readline 接口
  rl.close();
});

// 也可以监听 'close' 事件
rl.on("close", () => {
  process.exit(0);
});

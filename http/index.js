// 引入 http 模块
const http = require("http");
const url = require("url");

// 定义主机名和端口
const hostname = "127.0.0.1"; // 本地主机
const port = 3000;

// 创建一个 HTTP 服务器
// req: 请求对象，包含了来自客户端的所有信息，如 URL、请求头、请求体等。
// res: 响应对象，用于向客户端发送数据，如状态码、响应头、响应体等。
const server = http.createServer((req, res) => {
  const {pathname,query} = url.parse(req.url,true);
  console.log(pathname,'pathname');
  console.log(query,'query');
  
  // console.log(req, "req");

  // 设置响应头
  // 状态码 200 表示成功
  // 内容类型为 text/plain
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain; charset=utf-8");

  // 结束响应，并发送内容
  res.end("你好，世界！\n这是一个简单的 Node.js HTTP 服务器。\n");
});

// 让服务器监听指定的端口和主机名
server.listen(port, hostname, () => {
  console.log(`服务器运行在 http://${hostname}:${port}/`);
  console.log("在浏览器中打开该地址，或使用 Ctrl+C 停止服务器。");
});

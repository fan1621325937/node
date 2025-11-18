// 引入 net 模块
const net = require('net');

// 创建一个 TCP 服务器实例
const server = net.createServer((socket) => {
  console.log('客户端已连接');

  // 监听数据接收事件
  socket.on('data', (data) => {
    console.log(`接收到来自客户端的数据: ${data.toString()}`);
    // 接收到数据后，回复客户端
    socket.write(`Server received: ${data.toString()}`);
  });

  // 监听连接关闭事件
  socket.on('end', () => {
    console.log('客户端连接已断开');
  });

  // 监听错误事件
  socket.on('error', (err) => {
    console.error('发生错误:', err.message);
  });
});

// 服务器监听的端口和地址
const PORT = 3000;
const HOST = '127.0.0.1';

// 启动服务器监听指定端口
server.listen(PORT, HOST, () => {
  console.log(`TCP 服务器运行在 http://${HOST}:${PORT}`);
  console.log('请使用 telnet 127.0.0.1 3000 或其他 TCP 客户端进行连接测试。');
});

// 监听服务器错误
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`端口 ${PORT} 已经被占用，请更换端口或关闭占用进程。`);
  } else {
    console.error('服务器启动错误:', err);
  }
});
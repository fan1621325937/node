// 引入 net 模块
const net = require('net');

// 客户端连接的服务器信息
const PORT = 3000;
const HOST = '127.0.0.1';

// 创建一个 TCP 客户端实例
const client = new net.Socket();

// 连接到服务器
client.connect(PORT, HOST, () => {
  console.log(`成功连接到服务器: ${HOST}:${PORT}`);

  // 发送数据给服务器
  const message = 'Hello Server! This is the client.';
  client.write(message);
});

// 监听从服务器接收到的数据
client.on('data', (data) => {
  console.log(`从服务器接收到数据: ${data.toString()}`);
  // 接收到回复后，关闭连接
  client.destroy();
});

// 监听连接关闭事件
client.on('close', () => {
  console.log('连接已关闭');
});

// 监听错误事件
client.on('error', (err) => {
  console.error('连接错误:', err.message);
});
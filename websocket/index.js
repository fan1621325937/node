const WebSocket = require('ws');

// 创建 WebSocket 服务器，监听 8080 端口
const wss = new WebSocket.Server({ port: 8080 });

console.log('WebSocket 服务器已启动，正在监听 8080 端口...');

// 监听连接事件
wss.on('connection', (ws) => {
  console.log('客户端已连接');

  // 监听来自客户端的消息
  ws.on('message', (message) => {
    console.log(`收到客户端消息: ${message}`);

    // 将收到的消息广播给所有连接的客户端
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(`[广播] ${message}`);
      }
    });
  });

  // 监听连接关闭事件
  ws.on('close', () => {
    console.log('客户端已断开连接');
  });

  // 监听错误事件
  ws.on('error', (error) => {
    console.error('发生错误:', error);
  });

  // 向新连接的客户端发送欢迎消息
  ws.send('欢迎连接到 WebSocket 服务器！');
});

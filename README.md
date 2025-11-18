# Node.js 学习教程

欢迎来到Node.js学习之旅！这个项目将带你从零开始学习Node.js的核心概念和实际应用。

## 📚 学习目录

### 1. Node.js 简介

Node.js是一个基于Chrome V8引擎的JavaScript运行时环境，让JavaScript可以在服务器端运行。

**主要特点：**
- 事件驱动
- 非阻塞I/O
- 单线程但高并发
- 跨平台
- 丰富的包管理生态系统(npm)

### 2. 环境准备

**安装Node.js：**
1. 访问 [Node.js官网](https://nodejs.org/)
2. 下载LTS版本
3. 安装完成后，在命令行输入以下命令验证：
```bash
node --version
npm --version
```

### 3. 基础概念

#### 3.1 模块系统

Node.js使用CommonJS模块系统：

```javascript
// 引入内置模块
const fs = require('fs');
const path = require('path');

// 引入第三方模块
const express = require('express');

// 引入自定义模块
const myModule = require('./myModule');
```

#### 3.2 核心模块

- **fs (文件系统)**: 文件读写操作
- **http**: 创建HTTP服务器和客户端
- **path**: 处理文件路径
- **os**: 操作系统相关信息
- **crypto**: 加密功能
- **events**: 事件发射器

#### 3.3 异步编程

Node.js大量使用异步编程：

```javascript
// 回调函数
fs.readFile('file.txt', 'utf8', (err, data) => {
    if (err) throw err;
    console.log(data);
});

// Promise
const fsPromises = require('fs').promises;
fsPromises.readFile('file.txt', 'utf8')
    .then(data => console.log(data))
    .catch(err => console.error(err));

// async/await
async function readFileAsync() {
    try {
        const data = await fsPromises.readFile('file.txt', 'utf8');
        console.log(data);
    } catch (err) {
        console.error(err);
    }
}
```

### 4. 实践练习

#### 4.1 运行基础示例

```bash
# 进入项目目录
cd nodejs-learning

# 运行基础示例
node index.js

# 运行HTTP服务器示例
node index.js --server
```

#### 4.2 安装依赖

```bash
# 安装项目依赖
npm install

# 安装特定包
npm install express\n# 或者全局安装
npm install -g nodemon
```

### 5. 进阶主题

#### 5.1 Express.js 框架

Express是Node.js最流行的Web框架：

```javascript
const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Hello Express!');
});

app.listen(3000, () => {
    console.log('服务器运行在端口3000');
});
```

#### 5.2 中间件

```javascript
// 自定义中间件
app.use((req, res, next) => {
    console.log('请求时间:', new Date());
    next();
});

// 内置中间件
app.use(express.json()); // 解析JSON
app.use(express.static('public')); // 静态文件服务
```

#### 5.3 路由

```javascript
// GET路由
app.get('/users', (req, res) => {
    res.json({ users: [] });
});

// POST路由
app.post('/users', (req, res) => {
    const user = req.body;
    res.json({ message: '用户创建成功', user });
});

// 路由参数
app.get('/users/:id', (req, res) => {
    const userId = req.params.id;
    res.json({ userId });
});
```

### 6. 常用工具和包

- **nodemon**: 自动重启开发服务器
- **lodash**: 实用工具库
- **moment**: 日期处理
- **axios**: HTTP客户端
- **joi**: 数据验证
- **bcrypt**: 密码加密
- **jsonwebtoken**: JWT令牌

### 7. 最佳实践

1. **错误处理**: 始终处理错误，避免程序崩溃
2. **环境变量**: 使用.env文件管理配置
3. **日志记录**: 使用winston等日志库
4. **代码规范**: 使用ESLint和Prettier
5. **测试**: 编写单元测试和集成测试
6. **安全**: 验证输入，防止注入攻击

### 8. 学习资源

- [Node.js官方文档](https://nodejs.org/docs/)
- [Express.js官方文档](https://expressjs.com/)
- [npm官网](https://www.npmjs.com/)
- [Node.js最佳实践](https://github.com/goldbergyoni/nodebestpractices)

## 🚀 开始学习

1. 克隆或下载这个项目
2. 运行 `npm install` 安装依赖
3. 运行 `node index.js` 查看基础示例
4. 查看各个示例文件，理解代码
5. 尝试修改代码，实验不同功能

## 📝 练习建议

1. 创建一个简单的文件管理器
2. 构建一个基础的REST API
3. 实现用户认证系统
4. 创建一个实时聊天应用
5. 构建一个简单的博客系统

祝你学习愉快！🎉
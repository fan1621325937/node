# Node.js 学习指南

## 📚 项目概述

这是一个全面的 Node.js 学习项目，包含了从基础到高级的各种模块和实践案例。通过本项目，你可以系统地学习 Node.js 的核心概念、内置模块、高级特性以及实际应用。每个模块都配有独立的、可运行的示例代码，旨在帮助你更好地理解和掌握 Node.js。

## 🎯 学习目标

- 掌握 Node.js 基础概念和运行机制。
- 熟练使用 Node.js 内置核心模块。
- 理解异步编程、事件驱动模型、多进程与多线程。
- 学会文件系统操作、网络编程和流式数据处理。
- 掌握进程管理、集群应用和性能优化。
- 了解如何结合 Node.js 进行图像、视频等多媒体处理。

## 🚀 快速开始

### 环境要求

- Node.js v16.0 或更高版本
- npm v8.0 或更高版本

### 如何使用

1.  **克隆项目**到本地。
2.  进入你感兴趣的模块目录，例如 `cd fs`。
3.  查看 `index.js` 文件中的示例代码。
4.  运行示例：`node index.js`。
5.  观察输出结果，并结合代码进行学习。

---

## 📖 模块详解

### 1. 核心基础 (Core Fundamentals)

#### 1.1 全局对象 (Global Objects)
- **`global`**: `global/index.js` - Node.js 的全局命名空间。
- **`globalThis`**: `globalThis/index.js` - 在不同环境中（浏览器、Node.js）均可访问的全局 `this` 对象。
- **`process`**: `process/index.js` - 提供有关当前 Node.js 进程的信息和控制功能，如环境变量、命令行参数等。

#### 1.2 模块系统 (Module System)
- **`module`**: `module/index.js` - 探索 Node.js 的模块封装、`exports` 和 `module.exports` 的区别。
- **`require`**: `require/index.js` - 深入理解 `require` 函数如何加载模块、缓存机制以及如何加载 JSON 文件。

#### 1.3 事件发射器 (EventEmitter)
- **`event-emitter`**: `event-emitter/index.js` - Node.js 事件驱动模型的核心。学习如何创建、监听和触发自定义事件。

### 2. 数据处理 (Data Handling)

#### 2.1 Buffer
- **位置**: `buffer/index.js`
- **描述**: 用于处理二进制数据。在处理文件、网络请求等场景中至关重要。

#### 2.2 Stream (流)
- **位置**: `stream/index.js`
- **描述**: 用于高效处理流式数据的抽象接口，支持大数据量的高效读写。

#### 2.3 Crypto (加密)
- **位置**: `crypto/index.js`
- **描述**: 提供加密功能，包括哈希（MD5, SHA）、HMAC、对称/非对称加密（AES, RSA）等。

### 3. 文件与路径 (File System & Path)

#### 3.1 File System (fs)
- **位置**: `fs/index.js`
- **描述**: 提供了与文件系统交互的 API，支持同步和异步的文件读写、目录操作、状态查询等。

#### 3.2 Path (路径)
- **位置**: `path/index.js`
- **描述**: 提供处理文件和目录路径的实用工具，如路径拼接、解析和规范化。

### 4. 网络与通信 (Networking)

#### 4.1 HTTP
- **位置**: `http/index.js`
- **描述**: 用于创建 HTTP 服务器和客户端，是构建 Web 应用的基础。

#### 4.2 Net
- **位置**: `net/index.js`
- **描述**: 用于创建底层的 TCP 服务器和客户端，适用于需要更高灵活性的网络通信场景。

#### 4.3 URL
- **位置**: `url/index.js`
- **描述**: 提供 URL 解析和构建的实用工具，方便处理网址和查询参数。

#### 4.4 WebSocket
- **位置**: `websocket/index.js`
- **描述**: 实现了 WebSocket 服务器和客户端，用于创建实时的、双向的通信连接。

### 5. 并发与性能 (Concurrency & Performance)

#### 5.1 Child Process (子进程)
- **位置**: `child_process/index.js`
- **描述**: 允许执行外部命令和程序，是实现多进程编程、利用多核 CPU 的关键。

#### 5.2 Cluster (集群)
- **位置**: `cluster/index.js`
- **描述**: 允许创建共享服务器端口的子进程，轻松实现负载均衡和高可用性。

#### 5.3 Worker Threads (工作线程)
- **位置**: `worker_threads/index.js`
- **描述**: Node.js 中用于执行 CPU 密集型任务的多线程解决方案，避免阻塞主线程。

### 6. 系统与工具 (System & Utilities)

#### 6.1 OS (操作系统)
- **位置**: `os/index.js`
- **描述**: 提供与操作系统相关的信息，如 CPU 架构、内存、网络接口等。

#### 6.2 Util (工具)
- **位置**: `util/index.js`
- **描述**: 提供一系列实用函数，如 `util.promisify` 用于将回调函数转换为 Promise。

#### 6.3 Readline
- **位置**: `readline/index.js`
- **描述**: 用于从可读流（如 `process.stdin`）中逐行读取数据，常用于构建交互式命令行工具。

#### 6.4 CLI (命令行界面)
- **位置**: `cli/README.md`
- **描述**: 介绍了如何构建功能丰富的命令行工具。

### 7. 实战应用案例 (Practical Applications)

#### 7.1 FFmpeg 视频处理
- **位置**: `ffmpeg/index.js`
- **描述**: 展示如何结合强大的 `ffmpeg` 工具进行视频格式转换、裁剪、加水印等多种操作。

#### 7.2 Pngquant 图像压缩
- **位置**: `pngquant/index.js`
- **描述**: 一个使用 `pngquant-bin` 库进行 PNG 图片无损压缩的示例。

#### 7.3 Markdown 转换
- **位置**: `markdown/index.js`
- **描述**: 将 Markdown 文件转换为 HTML 页面的示例。

#### 7.4 JSDOM 服务端渲染 (SSR)
- **位置**: `jsDomSSR/index.js`
- **描述**: 在 Node.js 环境中使用 `jsdom` 模拟浏览器环境，实现服务端渲染。

---

## 🎓 学习路径建议

### 初级阶段 (1-2周)
1.  **基础概念**: 理解 Node.js 的特点，学习**核心基础**模块。
2.  **核心模块**: 学习 `fs`, `http`, `path` 模块。
3.  **异步编程**: 掌握回调、Promise 和 async/await。
4.  **实践**: 创建简单的文件操作工具和 HTTP 服务器。

### 中级阶段 (2-3周)
1.  **数据处理**: 深入学习 `Buffer`, `Stream`, `Crypto`。
2.  **网络编程**: 掌握 `Net` 和 `URL` 模块。
3.  **工具模块**: 学习 `os`, `util`, `readline`。
4.  **实践**: 开发文件上传、数据加密、命令行工具等。

### 高级阶段 (3-4周)
1.  **并发编程**: 学习 `child_process`, `cluster`, `worker_threads`，理解其应用场景。
2.  **性能优化**: 了解内存管理和性能监控。
3.  **实战应用**: 学习 `FFmpeg`、`Pngquant` 等高级应用。
4.  **实践**: 开发多进程应用、媒体处理服务。

## 🤝 贡献

欢迎通过提交 Issue 或 Pull Request 来改进这个项目。

## 📄 许可证

本项目采用 MIT 许可证。

---

*最后更新时间: 2025年11月13日*
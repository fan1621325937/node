const zlib = require("zlib");
const fs = require("fs");
const { pipeline } = require("stream");
const http = require("http");
/**
 * 压缩 text.txt 到 text.txt.gz（每次调用都创建全新的流）
 */

/**
 * pipeline
 * pipeline的使用 ：将多个流连接起来，每个流的输出作为下一个流的输入，最后一个流的输出作为回调函数的参数
 * 第一个参数：源流（读取数据的流）
 * 第二个参数：中间流（数据处理的流）
 * 第三个参数：目标流（写入数据的流）
 * 第四个参数：回调函数（处理流完成或出错时调用）
 */

// const compress = (done) => {
//   const source = fs.createReadStream("./text.txt");
//   const gzip = zlib.createGzip();
//   const target = fs.createWriteStream("./text.txt.gz");
//   pipeline(source, gzip, target, (err) => {
//     if (err) {
//       console.log("压缩失败:", err);
//       done && done(err);
//       return;
//     }
//     console.log("压缩完成: text.txt.gz");
//     done && done();
//   });
// };

// // 首次压缩一次
// compress();

// // 开启监听：当 text.txt 内容变化时，重新压缩
// let debounceTimer;
// fs.watchFile("./text.txt", { interval: 500 }, () => {
//   console.log("text.txt 文件内容变化，触发重新压缩");
//   if (fs.existsSync("./text.txt.gz")) {
//     try {
//       console.log("text.txt.gz 文件存在，触发删除");
//       fs.unlinkSync("./text.txt.gz");
//     } catch (e) {
//       console.log("删除旧压缩文件失败:", e);
//     }
//   }
//   clearTimeout(debounceTimer);
//   debounceTimer = setTimeout(() => compress(), 200);
// });

// 使用deflate压缩
// const deflate = (done) => {
//   const source = fs.createReadStream("./text.txt");
//   const deflate = zlib.createDeflate();
//   const target = fs.createWriteStream("./text.txt.deflate");
//   pipeline(source, deflate, target, (err) => {
//     if (err) {
//       console.log("压缩失败:", err);
//       done && done(err);
//       return;
//     }
//     console.log("压缩完成: text.txt.deflate");
//     done && done();
//   });
// };

// deflate();
// 解压
// const inflate = (done) => {
//   const source = fs.createReadStream("./text.txt.deflate");
//   const inflate = zlib.createInflate();
//   const target = fs.createWriteStream("./text.txt.deflate.inflate");
//   pipeline(source, inflate, target, (err) => {
//     if (err) {
//       console.log("解压失败:", err);
//       done && done(err);
//       return;
//     }
//     console.log("解压完成: text.txt.deflate.inflate");
//     done && done();
//   });
// };

// inflate();

// 使用deflate压缩和createGzip的区别
// 1. createGzip 是基于 deflate 算法的压缩，而 deflate 是一种压缩算法
// 2. createGzip 压缩后的文件后缀是 .gz，而 deflate 压缩后的文件后缀是 .deflate

//正常返回
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  const text = "text".repeat(1000000);
  res.end(text);
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000/");
});
//压缩返回
const server2 = http.createServer((req, res) => {
  const text = "text".repeat(1000000);
  res.setHeader("Content-Encoding", "deflate");
  res.setHeader("Content-Type", "text/plain;charset=utf-8");
  const compressedText = zlib.deflateSync(text);
  res.end(compressedText);
  // const compressedText = zlib.gzipSync(text);
  // res.end(compressedText);
});

server2.listen(3001, () => {
  console.log("Server running at http://localhost:3001/");
});

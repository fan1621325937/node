// // 引入 fs (File System) 模块
const fs = require("fs");
const path = require("path");

// // __dirname 表示当前文件所在的目录的绝对路径
// // path.resolve 用于将路径或路径片段的序列解析为绝对路径。
const filePath = path.resolve(__dirname, "../test.txt");

// // --- 异步读取文件 ---
// // 异步读取文件，这是推荐的方式，因为它不会阻塞事件循环。
// console.log("开始异步读取文件...");
// fs.readFile(filePath, "utf8", (err, data) => {
//   if (err) {
//     console.error("异步读取文件时出错:", err);
//     return;
//   }
//   console.log("异步读取文件内容:", data);
// });
// console.log("异步读取文件请求已发送，代码继续执行...");

// // --- 同步读取文件 ---
// // 同步读取文件会阻塞代码的执行，直到文件读取完成。
// try {
//   console.log("\n开始同步读取文件...");
//   const data = fs.readFileSync(filePath, "utf8");
//   console.log("同步读取文件内容:", data);
//   console.log("同步读取完成。");
// } catch (err) {
//   console.error("同步读取文件时出错:", err);
// }

// // --- 写入文件 ---
// const newFilePath = path.resolve(__dirname, "newFile.txt");
// const content = "这是通过 fs.writeFile 写入的新内容。";

// fs.writeFile(newFilePath, content, "utf8", (err) => {
//   if (err) {
//     console.error("写入文件时出错:", err);
//     return;
//   }
//   console.log("\n文件已成功写入到:", newFilePath);

//   // 验证写入的内容
//   fs.readFile(newFilePath, "utf8", (err, data) => {
//     console.log(`读取新文件内容: ${data}`);
//   });
// });

// // 处理大文件
// // 当处理大文件时，应该使用流（stream）来避免内存溢出。
// // 例如，使用 fs.createReadStream 来读取大文件，使用 fs.createWriteStream 来写入大文件。
// // 读取大文件
// const readStream = fs.createReadStream(filePath);
// readStream.on("data", (chunk) => {
//   console.log(`读取到 ${chunk.length} 字节的数据`);
// });
// readStream.on("end", () => {
//   console.log("大文件读取完成");
// });

// // 写入大文件
// const writeStream = fs.createWriteStream(newFilePath);
// writeStream.write(content);
// writeStream.end();
// writeStream.on("finish", () => {
//   console.log("大文件写入完成");
// });

// // 创建多层文件夹
// const folderPath = path.resolve(__dirname, "newFolder");
// fs.mkdir(folderPath, { recursive: true }, (err) => {
//   if (err) {
//     console.error("创建文件夹时出错:", err);
//     return;
//   }
//   console.log("\n文件夹已成功创建:", folderPath);
// });

// // 删除文件夹
// fs.rmdir(folderPath, (err) => {
//   if (err) {
//     console.error("删除文件夹时出错:", err);
//     return;
//   }
//   console.log("\n文件夹已成功删除:", folderPath);
// });

// // 监听文件夹变化
// fs.watch(folderPath, (eventType, filename) => {
//   console.log(`检测到 ${eventType} 事件，文件: ${filename}`);
// });

// 持续写入大文件
// const content = "这是持续写入的内容。";
// const writeStream = fs.createWriteStream(filePath);
// writeStream.write(content);
// writeStream.end();
// writeStream.on("finish", () => {
//   console.log("大文件写入完成");
//   // 读取写入的内容
//   fs.readFile(filePath, "utf8", (err, data) => {
//     if (err) {
//       console.error("读取文件时出错:", err);
//       return;
//     }
//     console.log("读取写入的内容:", data);
//   });
// });

/**
 * 安全删除文件（如果存在）
 * @param {string} filePath - 要删除的文件路径
 * @param {function} callback - 回调函数
 */
function safeDeleteFile(filePath, callback) {
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // 文件不存在，直接调用回调
      callback(null);
    } else {
      // 文件存在，删除它
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) {
          console.log(`⚠️  删除已存在文件失败: ${filePath}`, unlinkErr.message);
        } else {
          console.log(`🗑️  已删除已存在的文件: ${path.basename(filePath)}`);
        }
        callback(unlinkErr);
      });
    }
  });
}

/**
 * 创建硬链接的辅助函数
 * @param {string} sourcePath - 源文件路径
 * @param {string} targetPath - 目标文件路径
 */
function createHardLink(sourcePath, targetPath) {
  safeDeleteFile(targetPath, (deleteErr) => {
    if (deleteErr) {
      console.error("❌ 无法删除已存在的硬链接文件:", deleteErr);
      return;
    }
    
    fs.link(sourcePath, targetPath, (linkErr) => {
      if (linkErr) {
        if (linkErr.code === 'EEXIST') {
          console.error("❌ 硬链接文件仍然存在，无法创建新的硬链接");
        } else {
          console.error("❌ 硬链接创建失败:", linkErr.message);
        }
        return;
      }
      
      console.log("✅ 硬链接已成功创建:", targetPath);
      
      // 验证硬链接
      fs.readFile(targetPath, "utf8", (readErr, data) => {
        if (readErr) {
          console.error("读取硬链接文件时出错:", readErr);
          return;
        }
        console.log("📄 硬链接文件内容:", data.trim());
      });
    });
  });
}

/**
 * 创建符号链接的辅助函数
 * @param {string} sourcePath - 源文件路径
 * @param {string} targetPath - 目标文件路径
 */
function createSymLink(sourcePath, targetPath) {
  safeDeleteFile(targetPath, (deleteErr) => {
    if (deleteErr) {
      console.error("❌ 无法删除已存在的符号链接文件:", deleteErr);
      return;
    }
    
    fs.symlink(sourcePath, targetPath, (symlinkErr) => {
      if (symlinkErr) {
        if (symlinkErr.code === 'EPERM') {
          console.log("❌ 符号链接创建失败：需要管理员权限");
          console.log("💡 提示：在 Windows 上创建符号链接需要以管理员身份运行");
          console.log("🔄 正在尝试创建硬链接作为替代方案...");
          
          // 尝试创建硬链接作为替代方案
          const hardlinkPath = path.resolve(__dirname, "hardlink.txt");
          createHardLink(sourcePath, hardlinkPath);
        } else {
          console.error("❌ 创建符号链接时出现其他错误:", symlinkErr.message);
        }
        return;
      }
      
      console.log("✅ 符号链接已成功创建:", targetPath);
      
      // 验证符号链接
      fs.readFile(targetPath, "utf8", (readErr, data) => {
        if (readErr) {
          console.error("读取符号链接文件时出错:", readErr);
          return;
        }
        console.log("📄 符号链接文件内容:", data.trim());
      });
    });
  });
}

/**
 * 创建文件链接（符号链接或硬链接）
 * 在 Windows 系统上，符号链接需要管理员权限，因此提供硬链接作为替代方案
 */
function createFileLink() {
  const symlinkPath = path.resolve(__dirname, "symlink.txt");
  
  console.log("\n🔗 开始创建文件链接...");
  console.log("📁 源文件:", filePath);
  
  // 首先检查源文件是否存在
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error("❌ 源文件不存在:", filePath);
      return;
    }
    
    console.log("✅ 源文件存在，尝试创建符号链接...");
    createSymLink(filePath, symlinkPath);
  });
}

/**
 * 检查并显示系统信息
 */
function showSystemInfo() {
  console.log("\n=== 系统信息 ===");
  console.log("操作系统:", process.platform);
  console.log("Node.js 版本:", process.version);
  console.log("当前用户权限:", process.getuid ? process.getuid() : "Windows 系统");
  
  if (process.platform === 'win32') {
    console.log("⚠️  Windows 系统提示：");
    console.log("   - 符号链接需要管理员权限或开发者模式");
    console.log("   - 硬链接不需要特殊权限，但只能用于文件（不能用于目录）");
  }
}

// 显示系统信息
showSystemInfo();

// 创建文件链接
createFileLink();

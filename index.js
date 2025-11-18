// ES模块中获取__dirname和__filename ,Buffer , process ,的必要导入
// import { fileURLToPath } from "url";
// import { dirname } from "path";
// import { Buffer } from "buffer";
// import process from "process";

// 1.学习require的使用,设置package.json中type为commonjs
// require("./require");

// 2.学习import的使用,设置package.json中type为module
// import module, { a,b } from "./module/index.js";
// console.log(module);
// console.log(a,'1');
// console.log(b,'2');

// 3.学习全局对象global
// global.glob = '全局对象';
// (() => {
//   import("./global/index.js").then((res) => {
//     console.log(res);
//   });
// })();

// 全局适配函数globalThis
// globalThis.glob = '全局适配对象';
// (() => {
//   import("./globalThis/index.js").then((res) => {
//     console.log(res);
//   });
// })();

// 全局变量__dirname,__filename ,buffer,process (ES模块中的替代方案)
/**
 * 在ES模块中获取当前文件的目录路径
 * 等价于CommonJS中的__dirname
 */
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// console.log("__dirname (ES模块版本):", __dirname);
// console.log("__filename (ES模块版本):", __filename);
// console.log(Buffer);
// process进程
// console.log(process.argv); //argv表示进程后的参数
// console.log(process.cwd()); //cwd表示当前进程的工作目录
// console.log(process.env); //env表示环境变量
// console.log(process.platform); //platform表示当前平台
// console.log(process.version); //version表示当前node版本
// console.log(process.exit()); //表示退出当前进程

// 在es模块中获取__dirname,__filename,buffer
//  __dirname
//  __filename
//  buffer
// console.log(__dirname);
// console.log(__filename);
// console.log(Buffer);

// 引入jsDomSSR模块
// require('./jsDomSSR/index.js');

// path模块
// require("./path/index");

// os模块
// const {
//   getSystemInfo,
//   getCPUInfo,
//   getMemoryInfo,
//   getNetworkInfo,
//   getUserInfo,
//   getLoadAverage,
//   getUptime,
//   platformSpecificFeatures,
//   formatBytes,
//   monitorSystemResources,
// } = require("./os/index");
// getSystemInfo(); // 获取系统信息
// getCPUInfo(); // 获取CPU信息
// getMemoryInfo(); // 获取内存信息
// getNetworkInfo(); // 获取网络信息
// getUserInfo(); // 获取用户信息
// getLoadAverage(); // 获取系统负载信息
// getUptime(); // 获取系统运行时间
// platformSpecificFeatures(); // 平台特定功能演示
// monitorSystemResources(); // 监控系统资源
<<<<<<< HEAD

// Util模块学习案例
const { objectInspectionDemo } = require("./util/index.js");
objectInspectionDemo();
=======
>>>>>>> 9dbcd88133c428bd4db7e958e192b725e909ef48

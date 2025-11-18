/**
 * Node.js OS 模块学习案例
 * os 模块提供了与操作系统相关的实用方法和属性
 */

const os = require("os");

/**
 * 获取系统基本信息
 */
function getSystemInfo() {
  console.log("=== 系统基本信息 ===");
  console.log("操作系统平台:", os.platform());
  console.log("操作系统架构:", os.arch());
  console.log("操作系统类型:", os.type());
  console.log("操作系统版本:", os.release());
  console.log("主机名:", os.hostname());
  console.log("用户主目录:", os.homedir());
  console.log("临时目录:", os.tmpdir());
  console.log("");
}

/**
 * 获取 CPU 信息
 */
function getCPUInfo() {
  console.log("=== CPU 信息 ===");
  const cpus = os.cpus();
  console.log("CPU 信息:", cpus);
  console.log("CPU 核心数:", cpus.length);
  console.log("CPU 型号:", cpus[0].model);
  console.log("CPU 速度:", cpus[0].speed + " MHz");
  //       {
  //     model: 'Intel(R) Core(TM) i5-10400F CPU @ 2.90GHz', // 型号
  //     speed: 2904, // 速度 MHz
  //     times: {
  //       user: 2874609, // 用户模式下的 CPU 时间（毫秒）
  //       nice: 0, //  nice 模式下的 CPU 时间（毫秒）
  //       sys: 1869484, // 系统模式下的 CPU 时间（毫秒）
  //       idle: 101238890, // 空闲时间（毫秒）
  //       irq: 35593 // 中断请求时间（毫秒）
  //     }
  //   },
  // 计算 CPU 使用率 计算公式：(1 - 空闲时间 / 总时间) * 100%
  const totalTime = cpus.reduce((acc, cpu) => {
    const times = Object.values(cpu.times);
    return acc + times.reduce((sum, time) => sum + time, 0);
  }, 0);

  const idleTime = cpus.reduce((acc, cpu) => acc + cpu.times.idle, 0);
  const usage = (((totalTime - idleTime) / totalTime) * 100).toFixed(2);
  console.log("CPU 使用率:", usage + "%");
  console.log("");
}

/**
 * 获取内存信息
 */
function getMemoryInfo() {
  console.log("=== 内存信息 ===");
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  const usedMemory = totalMemory - freeMemory;

  console.log("总内存:", formatBytes(totalMemory));
  console.log("空闲内存:", formatBytes(freeMemory));
  console.log("已用内存:", formatBytes(usedMemory));
  console.log(
    "内存使用率:",
    ((usedMemory / totalMemory) * 100).toFixed(2) + "%"
  );
  console.log("");
}

/**
 * 获取网络接口信息
 */
function getNetworkInfo() {
  console.log("=== 网络接口信息 ===");
  const networkInterfaces = os.networkInterfaces();
  //   {
  //   address: '127.0.0.1', // 本地回环地址
  //   netmask: '255.0.0.0', // 子网掩码
  //   family: 'IPv4', // 协议族
  //   mac: '00:00:00:00:00:00', // 物理地址
  //   internal: true, // 是否为内部接口（如回环接口）
  //   cidr: '127.0.0.1/8' // 组合地址和子网掩码
  //    }
  Object.keys(networkInterfaces).forEach((interfaceName) => {
    console.log(`接口名称: ${interfaceName}`);
    networkInterfaces[interfaceName].forEach((interface) => {
      if (interface.family === "IPv4" && !interface.internal) {
        console.log(`  IPv4 地址: ${interface.address}`);
        console.log(`  子网掩码: ${interface.netmask}`);
        console.log(`  MAC 地址: ${interface.mac}`);
      }
    });
    console.log("");
  });
}

/**
 * 获取用户信息
 */
function getUserInfo() {
  console.log("=== 用户信息 ===");
  const userInfo = os.userInfo();
  console.log("用户名:", userInfo.username);
  console.log("用户 ID:", userInfo.uid);
  console.log("用户组 ID:", userInfo.gid);
  console.log("用户主目录:", userInfo.homedir);
  console.log("用户 Shell:", userInfo.shell);
  console.log("");
}

/**
 * 获取系统负载信息（仅在 Unix 系统上可用）
 */
function getLoadAverage() {
  console.log("=== 系统负载信息 ===");
  const loadAvg = os.loadavg();
  if (os.platform() !== "win32") {
    console.log("1分钟平均负载:", loadAvg[0].toFixed(2));
    console.log("5分钟平均负载:", loadAvg[1].toFixed(2));
    console.log("15分钟平均负载:", loadAvg[2].toFixed(2));
  } else {
    console.log("Windows 系统不支持负载平均值");
  }
  console.log("");
}

/**
 * 获取系统运行时间
 */
function getUptime() {
  console.log("=== 系统运行时间 ===");
  const uptime = os.uptime();
  const days = Math.floor(uptime / 86400);
  const hours = Math.floor((uptime % 86400) / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);

  console.log(
    `系统运行时间: ${days}天 ${hours}小时 ${minutes}分钟 ${seconds}秒`
  );
  console.log("");
}

/**
 * 平台特定功能演示
 */
function platformSpecificFeatures() {
  console.log("=== 平台特定功能 ===");
  const platform = os.platform();

  switch (platform) {
    case "win32":
      console.log("当前运行在 Windows 系统上");
      console.log("行结束符:", JSON.stringify(os.EOL));
      break;
    case "darwin":
      console.log("当前运行在 macOS 系统上");
      break;
    case "linux":
      console.log("当前运行在 Linux 系统上");
      break;
    default:
      console.log("当前运行在", platform, "系统上");
  }
  console.log("");
}

/**
 * 格式化字节数为可读格式
 * @param {number} bytes - 字节数
 * @returns {string} 格式化后的字符串
 */
function formatBytes(bytes) {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "0 Bytes";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
}

/**
 * 监控系统资源变化
 */
function monitorSystemResources() {
  console.log("=== 系统资源监控 (5秒) ===");
  let count = 0;
  const maxCount = 5;

  const monitor = setInterval(() => {
    count++;
    console.log(`第 ${count} 次检查:`);
    console.log("  空闲内存:", formatBytes(os.freemem()));
    console.log(
      "  负载平均:",
      os
        .loadavg()
        .map((load) => load.toFixed(2))
        .join(", ")
    );

    if (count >= maxCount) {
      clearInterval(monitor);
      console.log("监控结束\n");
    }
  }, 1000);
}

// 主函数：执行所有演示
function main() {
  console.log("Node.js OS 模块学习案例\n");

  getSystemInfo();
  getCPUInfo();
  getMemoryInfo();
  getNetworkInfo();
  getUserInfo();
  getLoadAverage();
  getUptime();
  platformSpecificFeatures();

  // 启动资源监控
  monitorSystemResources();
}

// 如果直接运行此文件，则执行主函数
if (require.main === module) {
  main();
}

// 导出函数供其他模块使用
module.exports = {
  getSystemInfo,
  getCPUInfo,
  getMemoryInfo,
  getNetworkInfo,
  getUserInfo,
  getLoadAverage,
  getUptime,
  platformSpecificFeatures,
  formatBytes,
  monitorSystemResources,
};

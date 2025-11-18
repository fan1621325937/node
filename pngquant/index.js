const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

/**
 * pngquant图片压缩学习案例
 * 演示如何使用pngquant进行PNG图片压缩
 */

console.log("=== pngquant图片压缩学习案例 ===\n");

/**
 * 基础压缩功能 - 压缩单个PNG图片
 * @param {string} inputPath - 输入图片路径
 * @param {string} outputPath - 输出图片路径
 * @param {number} quality - 压缩质量 (0-100)
 */
function compressPNG(inputPath, outputPath, quality = 80) {
    return new Promise((resolve, reject) => {
        // 检查输入文件是否存在
        if (!fs.existsSync(inputPath)) {
            reject(new Error(`输入文件不存在: ${inputPath}`));
            return;
        }

        const command = `pngquant --quality=0-${quality} --output "${outputPath}" "${inputPath}"`;
        
        console.log(`正在压缩: ${inputPath}`);
        console.log(`命令: ${command}\n`);
        
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`压缩失败: ${error.message}`);
                reject(error);
                return;
            }
            
            if (stderr) {
                console.warn(`警告: ${stderr}`);
            }
            
            console.log(`压缩成功: ${outputPath}`);
            resolve(outputPath);
        });
    });
}

/**
 * 获取文件大小信息
 * @param {string} filePath - 文件路径
 * @returns {Object} 文件大小信息
 */
function getFileSize(filePath) {
    if (!fs.existsSync(filePath)) {
        return { bytes: 0, kb: 0, mb: 0 };
    }
    
    const stats = fs.statSync(filePath);
    const bytes = stats.size;
    const kb = (bytes / 1024).toFixed(2);
    const mb = (bytes / (1024 * 1024)).toFixed(2);
    
    return { bytes, kb, mb };
}

/**
 * 比较压缩前后的文件大小
 * @param {string} originalPath - 原始文件路径
 * @param {string} compressedPath - 压缩后文件路径
 */
function compareFileSize(originalPath, compressedPath) {
    const original = getFileSize(originalPath);
    const compressed = getFileSize(compressedPath);
    
    const reduction = ((original.bytes - compressed.bytes) / original.bytes * 100).toFixed(2);
    
    console.log("\n=== 压缩结果对比 ===");
    console.log(`原始文件: ${original.kb} KB (${original.bytes} bytes)`);
    console.log(`压缩文件: ${compressed.kb} KB (${compressed.bytes} bytes)`);
    console.log(`压缩率: ${reduction}%`);
    console.log(`节省空间: ${(original.kb - compressed.kb).toFixed(2)} KB\n`);
}

/**
 * 批量压缩PNG图片
 * @param {string} inputDir - 输入目录
 * @param {string} outputDir - 输出目录
 * @param {number} quality - 压缩质量
 */
async function batchCompress(inputDir, outputDir, quality = 80) {
    console.log(`=== 批量压缩PNG图片 ===`);
    console.log(`输入目录: ${inputDir}`);
    console.log(`输出目录: ${outputDir}`);
    console.log(`压缩质量: ${quality}%\n`);
    
    // 确保输出目录存在
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // 读取输入目录中的所有PNG文件
    const files = fs.readdirSync(inputDir).filter(file => 
        path.extname(file).toLowerCase() === '.png'
    );
    
    if (files.length === 0) {
        console.log("未找到PNG文件");
        return;
    }
    
    console.log(`找到 ${files.length} 个PNG文件`);
    
    let totalOriginalSize = 0;
    let totalCompressedSize = 0;
    
    for (const file of files) {
        const inputPath = path.join(inputDir, file);
        const outputPath = path.join(outputDir, `compressed_${file}`);
        
        try {
            await compressPNG(inputPath, outputPath, quality);
            
            const originalSize = getFileSize(inputPath);
            const compressedSize = getFileSize(outputPath);
            
            totalOriginalSize += originalSize.bytes;
            totalCompressedSize += compressedSize.bytes;
            
            compareFileSize(inputPath, outputPath);
        } catch (error) {
            console.error(`处理文件 ${file} 时出错:`, error.message);
        }
    }
    
    // 显示总体统计
    const totalReduction = ((totalOriginalSize - totalCompressedSize) / totalOriginalSize * 100).toFixed(2);
    console.log("=== 批量压缩总结 ===");
    console.log(`总原始大小: ${(totalOriginalSize / 1024).toFixed(2)} KB`);
    console.log(`总压缩大小: ${(totalCompressedSize / 1024).toFixed(2)} KB`);
    console.log(`总压缩率: ${totalReduction}%`);
    console.log(`总节省空间: ${((totalOriginalSize - totalCompressedSize) / 1024).toFixed(2)} KB`);
}

// 演示用法
async function demo() {
    try {
        // 创建测试目录
        const testDir = path.join(__dirname, 'test-images');
        const outputDir = path.join(__dirname, 'compressed-images');
        
        console.log("pngquant图片压缩工具演示\n");
        console.log("注意: 需要先安装pngquant工具");
        console.log("Windows: 下载pngquant.exe并添加到PATH");
        console.log("macOS: brew install pngquant");
        console.log("Linux: sudo apt-get install pngquant\n");
        
        // 检查是否有测试图片
        if (fs.existsSync(testDir)) {
            await batchCompress(testDir, outputDir, 80);
        } else {
            console.log(`测试目录不存在: ${testDir}`);
            console.log("请在该目录下放置一些PNG图片进行测试");
            
            // 创建测试目录
            fs.mkdirSync(testDir, { recursive: true });
            console.log(`已创建测试目录: ${testDir}`);
        }
        
    } catch (error) {
        console.error("演示过程中出错:", error.message);
    }
}

// 如果直接运行此文件，则执行演示
if (require.main === module) {
    demo();
}

// 导出功能供其他模块使用
module.exports = {
    compressPNG,
    getFileSize,
    compareFileSize,
    batchCompress
};

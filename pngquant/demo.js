const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

/**
 * pngquant完整演示案例
 * 包含错误处理、功能检测和模拟压缩功能
 */

console.log("=== pngquant完整演示案例 ===\n");

/**
 * 检查pngquant是否已安装
 * @returns {Promise<boolean>} 是否已安装pngquant
 */
function checkPngquantInstalled() {
    return new Promise((resolve) => {
        exec('pngquant --version', (error, stdout, stderr) => {
            if (error) {
                resolve(false);
            } else {
                console.log(`检测到pngquant版本: ${stdout.trim()}`);
                resolve(true);
            }
        });
    });
}

/**
 * 模拟PNG压缩功能（当pngquant未安装时使用）
 * @param {string} inputPath - 输入文件路径
 * @param {string} outputPath - 输出文件路径
 * @param {number} quality - 压缩质量
 */
function simulateCompression(inputPath, outputPath, quality) {
    return new Promise((resolve, reject) => {
        try {
            // 读取原始文件
            const inputData = fs.readFileSync(inputPath);
            
            // 模拟压缩过程（实际上只是复制文件并添加一些随机性）
            const compressionRatio = quality / 100;
            const simulatedSize = Math.floor(inputData.length * (0.3 + compressionRatio * 0.4));
            
            // 创建模拟的压缩数据
            const compressedData = Buffer.alloc(simulatedSize);
            inputData.copy(compressedData, 0, 0, Math.min(simulatedSize, inputData.length));
            
            // 写入输出文件
            fs.writeFileSync(outputPath, compressedData);
            
            console.log(`模拟压缩完成: ${path.basename(inputPath)} -> ${path.basename(outputPath)}`);
            console.log(`原始大小: ${inputData.length} bytes`);
            console.log(`压缩大小: ${compressedData.length} bytes`);
            console.log(`压缩率: ${((1 - compressedData.length / inputData.length) * 100).toFixed(2)}%\n`);
            
            resolve(outputPath);
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * 真实的pngquant压缩功能
 * @param {string} inputPath - 输入文件路径
 * @param {string} outputPath - 输出文件路径
 * @param {number} quality - 压缩质量
 */
function realPngquantCompress(inputPath, outputPath, quality) {
    return new Promise((resolve, reject) => {
        const command = `pngquant --quality=0-${quality} --output "${outputPath}" "${inputPath}"`;
        
        console.log(`执行命令: ${command}`);
        
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`pngquant压缩失败: ${error.message}`);
                reject(error);
                return;
            }
            
            if (stderr) {
                console.warn(`警告: ${stderr}`);
            }
            
            console.log(`pngquant压缩成功: ${outputPath}\n`);
            resolve(outputPath);
        });
    });
}

/**
 * 智能压缩功能 - 自动选择真实或模拟压缩
 * @param {string} inputPath - 输入文件路径
 * @param {string} outputPath - 输出文件路径
 * @param {number} quality - 压缩质量
 * @param {boolean} usePngquant - 是否使用真实的pngquant
 */
async function smartCompress(inputPath, outputPath, quality, usePngquant) {
    try {
        if (usePngquant) {
            await realPngquantCompress(inputPath, outputPath, quality);
        } else {
            await simulateCompression(inputPath, outputPath, quality);
        }
        return true;
    } catch (error) {
        console.error(`压缩失败: ${error.message}`);
        return false;
    }
}

/**
 * 获取文件详细信息
 * @param {string} filePath - 文件路径
 */
function getFileInfo(filePath) {
    if (!fs.existsSync(filePath)) {
        return null;
    }
    
    const stats = fs.statSync(filePath);
    const sizeKB = (stats.size / 1024).toFixed(2);
    const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
    
    return {
        path: filePath,
        name: path.basename(filePath),
        size: stats.size,
        sizeKB: parseFloat(sizeKB),
        sizeMB: parseFloat(sizeMB),
        modified: stats.mtime
    };
}

/**
 * 显示压缩结果对比
 * @param {string} originalPath - 原始文件路径
 * @param {string} compressedPath - 压缩文件路径
 */
function showCompressionResults(originalPath, compressedPath) {
    const original = getFileInfo(originalPath);
    const compressed = getFileInfo(compressedPath);
    
    if (!original || !compressed) {
        console.log("无法获取文件信息进行对比");
        return;
    }
    
    const reduction = ((original.size - compressed.size) / original.size * 100).toFixed(2);
    const savedKB = (original.sizeKB - compressed.sizeKB).toFixed(2);
    
    console.log("📊 压缩结果对比");
    console.log("=" .repeat(50));
    console.log(`📁 原始文件: ${original.name}`);
    console.log(`   大小: ${original.sizeKB} KB (${original.size.toLocaleString()} bytes)`);
    console.log(`📁 压缩文件: ${compressed.name}`);
    console.log(`   大小: ${compressed.sizeKB} KB (${compressed.size.toLocaleString()} bytes)`);
    console.log(`📈 压缩效果:`);
    console.log(`   压缩率: ${reduction}%`);
    console.log(`   节省空间: ${savedKB} KB`);
    console.log(`   压缩比: ${(original.size / compressed.size).toFixed(2)}:1`);
    console.log("=" .repeat(50) + "\n");
}

/**
 * 批量处理文件
 * @param {string} inputDir - 输入目录
 * @param {string} outputDir - 输出目录
 * @param {number} quality - 压缩质量
 * @param {boolean} usePngquant - 是否使用真实pngquant
 */
async function batchProcess(inputDir, outputDir, quality, usePngquant) {
    console.log(`🚀 开始批量处理`);
    console.log(`📂 输入目录: ${inputDir}`);
    console.log(`📂 输出目录: ${outputDir}`);
    console.log(`🎯 压缩质量: ${quality}%`);
    console.log(`🔧 使用工具: ${usePngquant ? 'pngquant' : '模拟压缩'}\n`);
    
    // 确保输出目录存在
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // 查找所有图片文件
    const imageExtensions = ['.png', '.bmp', '.jpg', '.jpeg'];
    const files = fs.readdirSync(inputDir).filter(file => {
        const ext = path.extname(file).toLowerCase();
        return imageExtensions.includes(ext);
    });
    
    if (files.length === 0) {
        console.log("❌ 未找到支持的图片文件");
        return;
    }
    
    console.log(`📋 找到 ${files.length} 个图片文件\n`);
    
    let successCount = 0;
    let totalOriginalSize = 0;
    let totalCompressedSize = 0;
    
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const inputPath = path.join(inputDir, file);
        const outputName = `compressed_${path.parse(file).name}.png`;
        const outputPath = path.join(outputDir, outputName);
        
        console.log(`📷 处理文件 ${i + 1}/${files.length}: ${file}`);
        
        const success = await smartCompress(inputPath, outputPath, quality, usePngquant);
        
        if (success) {
            successCount++;
            showCompressionResults(inputPath, outputPath);
            
            const originalInfo = getFileInfo(inputPath);
            const compressedInfo = getFileInfo(outputPath);
            
            if (originalInfo && compressedInfo) {
                totalOriginalSize += originalInfo.size;
                totalCompressedSize += compressedInfo.size;
            }
        } else {
            console.log(`❌ 处理失败: ${file}\n`);
        }
    }
    
    // 显示总体统计
    console.log("🎉 批量处理完成！");
    console.log("=" .repeat(60));
    console.log(`✅ 成功处理: ${successCount}/${files.length} 个文件`);
    console.log(`📊 总原始大小: ${(totalOriginalSize / 1024).toFixed(2)} KB`);
    console.log(`📊 总压缩大小: ${(totalCompressedSize / 1024).toFixed(2)} KB`);
    
    if (totalOriginalSize > 0) {
        const totalReduction = ((totalOriginalSize - totalCompressedSize) / totalOriginalSize * 100).toFixed(2);
        const totalSaved = ((totalOriginalSize - totalCompressedSize) / 1024).toFixed(2);
        console.log(`📈 总压缩率: ${totalReduction}%`);
        console.log(`💾 总节省空间: ${totalSaved} KB`);
    }
    
    console.log("=" .repeat(60));
}

/**
 * 显示使用帮助
 */
function showHelp() {
    console.log(`
🎨 pngquant图片压缩演示工具

📖 使用方法:
   node demo.js [选项]

🔧 选项:
   --help, -h          显示此帮助信息
   --quality, -q       设置压缩质量 (0-100, 默认: 80)
   --input, -i         指定输入目录 (默认: ./test-images)
   --output, -o        指定输出目录 (默认: ./compressed-images)
   --simulate, -s      使用模拟压缩 (当pngquant未安装时)

📝 示例:
   node demo.js                           # 使用默认设置
   node demo.js --quality 60              # 设置压缩质量为60%
   node demo.js --simulate                # 强制使用模拟压缩
   node demo.js -i ./my-images -o ./out   # 指定输入输出目录

💡 提示:
   - 支持PNG、BMP、JPG、JPEG格式
   - 压缩质量越低，文件越小，但质量也越低
   - 建议质量设置在60-90之间
    `);
}

/**
 * 解析命令行参数
 */
function parseArgs() {
    const args = process.argv.slice(2);
    const options = {
        quality: 80,
        inputDir: path.join(__dirname, 'test-images'),
        outputDir: path.join(__dirname, 'compressed-images'),
        simulate: false,
        help: false
    };
    
    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        
        switch (arg) {
            case '--help':
            case '-h':
                options.help = true;
                break;
            case '--quality':
            case '-q':
                if (i + 1 < args.length) {
                    options.quality = parseInt(args[++i]);
                }
                break;
            case '--input':
            case '-i':
                if (i + 1 < args.length) {
                    options.inputDir = args[++i];
                }
                break;
            case '--output':
            case '-o':
                if (i + 1 < args.length) {
                    options.outputDir = args[++i];
                }
                break;
            case '--simulate':
            case '-s':
                options.simulate = true;
                break;
        }
    }
    
    return options;
}

/**
 * 主函数
 */
async function main() {
    const options = parseArgs();
    
    if (options.help) {
        showHelp();
        return;
    }
    
    console.log("🎨 pngquant图片压缩演示工具");
    console.log("=" .repeat(40));
    
    // 检查pngquant是否已安装
    let usePngquant = false;
    if (!options.simulate) {
        console.log("🔍 检查pngquant安装状态...");
        usePngquant = await checkPngquantInstalled();
        
        if (!usePngquant) {
            console.log("⚠️  未检测到pngquant，将使用模拟压缩功能");
            console.log("💡 要安装pngquant，请访问: https://pngquant.org/");
        }
    } else {
        console.log("🔧 强制使用模拟压缩模式");
    }
    
    console.log("");
    
    // 检查输入目录
    if (!fs.existsSync(options.inputDir)) {
        console.log(`❌ 输入目录不存在: ${options.inputDir}`);
        console.log("💡 请先运行 'node png-generator.js' 创建测试图片");
        return;
    }
    
    // 开始批量处理
    await batchProcess(options.inputDir, options.outputDir, options.quality, usePngquant);
    
    console.log("\n🎉 演示完成！");
    console.log("📁 压缩后的文件保存在:", options.outputDir);
}

// 如果直接运行此文件，则执行主函数
if (require.main === module) {
    main().catch(error => {
        console.error("❌ 程序执行出错:", error.message);
        process.exit(1);
    });
}

module.exports = {
    checkPngquantInstalled,
    simulateCompression,
    realPngquantCompress,
    smartCompress,
    getFileInfo,
    showCompressionResults,
    batchProcess
};
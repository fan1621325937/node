const fs = require('fs');
const path = require('path');

/**
 * 简单的PNG图片生成器
 * 使用纯JavaScript生成PNG图片数据用于测试pngquant压缩
 */

/**
 * 创建一个简单的PNG图片（使用Canvas API的模拟实现）
 * 注意：这是一个简化的实现，实际项目中建议使用canvas或sharp库
 */
class SimplePNGGenerator {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.data = new Uint8Array(width * height * 4); // RGBA
        this.fill(255, 255, 255, 255); // 默认白色背景
    }

    /**
     * 填充整个画布
     * @param {number} r - 红色值 (0-255)
     * @param {number} g - 绿色值 (0-255)
     * @param {number} b - 蓝色值 (0-255)
     * @param {number} a - 透明度值 (0-255)
     */
    fill(r, g, b, a) {
        for (let i = 0; i < this.data.length; i += 4) {
            this.data[i] = r;     // Red
            this.data[i + 1] = g; // Green
            this.data[i + 2] = b; // Blue
            this.data[i + 3] = a; // Alpha
        }
    }

    /**
     * 设置像素颜色
     * @param {number} x - X坐标
     * @param {number} y - Y坐标
     * @param {number} r - 红色值
     * @param {number} g - 绿色值
     * @param {number} b - 蓝色值
     * @param {number} a - 透明度值
     */
    setPixel(x, y, r, g, b, a = 255) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) return;
        
        const index = (y * this.width + x) * 4;
        this.data[index] = r;
        this.data[index + 1] = g;
        this.data[index + 2] = b;
        this.data[index + 3] = a;
    }

    /**
     * 绘制矩形
     * @param {number} x - 起始X坐标
     * @param {number} y - 起始Y坐标
     * @param {number} width - 宽度
     * @param {number} height - 高度
     * @param {number} r - 红色值
     * @param {number} g - 绿色值
     * @param {number} b - 蓝色值
     * @param {number} a - 透明度值
     */
    drawRect(x, y, width, height, r, g, b, a = 255) {
        for (let dy = 0; dy < height; dy++) {
            for (let dx = 0; dx < width; dx++) {
                this.setPixel(x + dx, y + dy, r, g, b, a);
            }
        }
    }

    /**
     * 绘制圆形
     * @param {number} centerX - 圆心X坐标
     * @param {number} centerY - 圆心Y坐标
     * @param {number} radius - 半径
     * @param {number} r - 红色值
     * @param {number} g - 绿色值
     * @param {number} b - 蓝色值
     * @param {number} a - 透明度值
     */
    drawCircle(centerX, centerY, radius, r, g, b, a = 255) {
        for (let y = -radius; y <= radius; y++) {
            for (let x = -radius; x <= radius; x++) {
                if (x * x + y * y <= radius * radius) {
                    this.setPixel(centerX + x, centerY + y, r, g, b, a);
                }
            }
        }
    }

    /**
     * 绘制渐变背景
     * @param {Object} startColor - 起始颜色 {r, g, b, a}
     * @param {Object} endColor - 结束颜色 {r, g, b, a}
     * @param {string} direction - 渐变方向 'horizontal' | 'vertical' | 'diagonal'
     */
    drawGradient(startColor, endColor, direction = 'horizontal') {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                let ratio;
                
                switch (direction) {
                    case 'horizontal':
                        ratio = x / this.width;
                        break;
                    case 'vertical':
                        ratio = y / this.height;
                        break;
                    case 'diagonal':
                        ratio = (x + y) / (this.width + this.height);
                        break;
                    default:
                        ratio = x / this.width;
                }
                
                const r = Math.round(startColor.r + (endColor.r - startColor.r) * ratio);
                const g = Math.round(startColor.g + (endColor.g - startColor.g) * ratio);
                const b = Math.round(startColor.b + (endColor.b - startColor.b) * ratio);
                const a = Math.round(startColor.a + (endColor.a - startColor.a) * ratio);
                
                this.setPixel(x, y, r, g, b, a);
            }
        }
    }

    /**
     * 生成PNG数据（简化版本）
     * 注意：这是一个非常简化的PNG编码实现，仅用于演示
     * 实际项目中应该使用专业的图像处理库
     */
    toPNG() {
        // 这里返回一个模拟的PNG数据结构
        // 实际实现需要完整的PNG编码算法
        return {
            width: this.width,
            height: this.height,
            data: this.data,
            format: 'RGBA'
        };
    }
}

/**
 * 创建测试PNG图片的数据
 * @param {string} type - 图片类型
 * @param {number} width - 宽度
 * @param {number} height - 高度
 */
function createTestPNGData(type, width, height) {
    const generator = new SimplePNGGenerator(width, height);
    
    switch (type) {
        case 'gradient':
            generator.drawGradient(
                { r: 255, g: 100, b: 100, a: 255 },
                { r: 100, g: 100, b: 255, a: 255 },
                'diagonal'
            );
            break;
            
        case 'shapes':
            generator.fill(240, 240, 240, 255); // 浅灰背景
            generator.drawRect(50, 50, 200, 100, 255, 0, 0, 255); // 红色矩形
            generator.drawCircle(300, 150, 80, 0, 255, 0, 200); // 半透明绿色圆
            generator.drawRect(100, 200, 300, 50, 0, 0, 255, 180); // 半透明蓝色矩形
            break;
            
        case 'pattern':
            generator.fill(255, 255, 255, 255); // 白色背景
            // 创建棋盘图案
            const squareSize = 20;
            for (let y = 0; y < height; y += squareSize) {
                for (let x = 0; x < width; x += squareSize) {
                    const isBlack = ((x / squareSize) + (y / squareSize)) % 2 === 0;
                    const color = isBlack ? 0 : 255;
                    generator.drawRect(x, y, squareSize, squareSize, color, color, color, 255);
                }
            }
            break;
            
        default:
            generator.drawGradient(
                { r: 200, g: 200, b: 255, a: 255 },
                { r: 255, g: 200, b: 200, a: 255 },
                'horizontal'
            );
    }
    
    return generator.toPNG();
}

/**
 * 将图片数据保存为BMP格式（用于测试，因为BMP格式简单）
 * @param {Object} imageData - 图片数据
 * @param {string} outputPath - 输出路径
 */
function saveBMP(imageData, outputPath) {
    const { width, height, data } = imageData;
    
    // BMP文件头（54字节）+ 像素数据
    const pixelDataSize = width * height * 3; // RGB，每像素3字节
    const fileSize = 54 + pixelDataSize;
    
    const buffer = Buffer.alloc(fileSize);
    let offset = 0;
    
    // BMP文件头
    buffer.write('BM', offset); offset += 2; // 文件类型
    buffer.writeUInt32LE(fileSize, offset); offset += 4; // 文件大小
    buffer.writeUInt32LE(0, offset); offset += 4; // 保留字段
    buffer.writeUInt32LE(54, offset); offset += 4; // 像素数据偏移
    
    // DIB头
    buffer.writeUInt32LE(40, offset); offset += 4; // DIB头大小
    buffer.writeUInt32LE(width, offset); offset += 4; // 图片宽度
    buffer.writeUInt32LE(height, offset); offset += 4; // 图片高度
    buffer.writeUInt16LE(1, offset); offset += 2; // 颜色平面数
    buffer.writeUInt16LE(24, offset); offset += 2; // 每像素位数
    buffer.writeUInt32LE(0, offset); offset += 4; // 压缩方式
    buffer.writeUInt32LE(pixelDataSize, offset); offset += 4; // 像素数据大小
    buffer.writeUInt32LE(2835, offset); offset += 4; // 水平分辨率
    buffer.writeUInt32LE(2835, offset); offset += 4; // 垂直分辨率
    buffer.writeUInt32LE(0, offset); offset += 4; // 调色板颜色数
    buffer.writeUInt32LE(0, offset); offset += 4; // 重要颜色数
    
    // 像素数据（BMP是从下到上存储的）
    for (let y = height - 1; y >= 0; y--) {
        for (let x = 0; x < width; x++) {
            const pixelIndex = (y * width + x) * 4;
            buffer[offset++] = data[pixelIndex + 2]; // B
            buffer[offset++] = data[pixelIndex + 1]; // G
            buffer[offset++] = data[pixelIndex];     // R
        }
        // BMP行需要4字节对齐
        while (offset % 4 !== 0) {
            buffer[offset++] = 0;
        }
    }
    
    fs.writeFileSync(outputPath, buffer);
    console.log(`已创建BMP测试图片: ${outputPath}`);
}

/**
 * 创建多个测试图片
 */
function createTestImages() {
    const testDir = path.join(__dirname, 'test-images');
    
    // 确保测试目录存在
    if (!fs.existsSync(testDir)) {
        fs.mkdirSync(testDir, { recursive: true });
    }
    
    console.log('正在创建测试图片...\n');
    
    // 创建不同类型的测试图片
    const testImages = [
        { name: 'gradient-test.bmp', type: 'gradient', width: 400, height: 300 },
        { name: 'shapes-test.bmp', type: 'shapes', width: 500, height: 400 },
        { name: 'pattern-test.bmp', type: 'pattern', width: 320, height: 240 }
    ];
    
    testImages.forEach(img => {
        const outputPath = path.join(testDir, img.name);
        const imageData = createTestPNGData(img.type, img.width, img.height);
        saveBMP(imageData, outputPath);
    });
    
    console.log('\n测试图片创建完成！');
    console.log('注意: 创建的是BMP格式图片，如果要测试PNG压缩，需要：');
    console.log('1. 将BMP图片转换为PNG格式');
    console.log('2. 或者直接下载一些PNG图片放到 test-images 目录');
    console.log('3. 然后运行: node index.js');
    
    // 创建使用说明
    const instructionPath = path.join(testDir, '使用说明.txt');
    const instructions = `测试图片使用说明
===================

1. 当前目录包含了几个BMP格式的测试图片
2. 要测试pngquant压缩功能，需要PNG格式的图片
3. 你可以：
   - 使用在线工具将BMP转换为PNG
   - 下载一些PNG图片放到这个目录
   - 使用图像编辑软件创建PNG图片

4. 准备好PNG图片后，返回上级目录运行：
   node index.js

5. 压缩后的图片会保存在 compressed-images 目录中

测试图片说明：
- gradient-test.bmp: 渐变背景图片
- shapes-test.bmp: 包含几何形状的图片
- pattern-test.bmp: 棋盘图案图片

建议的PNG测试图片特征：
- 包含渐变色彩
- 有透明度效果
- 包含重复图案
- 不同的颜色复杂度
`;
    
    fs.writeFileSync(instructionPath, instructions, 'utf8');
    console.log(`已创建使用说明: ${instructionPath}`);
}

// 如果直接运行此文件，则创建测试图片
if (require.main === module) {
    createTestImages();
}

module.exports = {
    SimplePNGGenerator,
    createTestPNGData,
    saveBMP,
    createTestImages
};
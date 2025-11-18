const fs = require('fs');
const path = require('path');

/**
 * 创建测试PNG图片的脚本
 * 生成一个简单的SVG图片并转换为PNG用于测试
 */

/**
 * 创建一个简单的SVG测试图片
 * @param {string} outputPath - 输出SVG文件路径
 * @param {number} width - 图片宽度
 * @param {number} height - 图片高度
 */
function createTestSVG(outputPath, width = 800, height = 600) {
    const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <!-- 背景渐变 -->
    <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#ff6b6b;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#4ecdc4;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#45b7d1;stop-opacity:1" />
        </linearGradient>
        <radialGradient id="circleGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style="stop-color:#ffffff;stop-opacity:0.8" />
            <stop offset="100%" style="stop-color:#000000;stop-opacity:0.2" />
        </radialGradient>
    </defs>
    
    <!-- 背景 -->
    <rect width="100%" height="100%" fill="url(#bgGradient)"/>
    
    <!-- 装饰圆圈 -->
    <circle cx="200" cy="150" r="80" fill="url(#circleGradient)" opacity="0.7"/>
    <circle cx="600" cy="300" r="60" fill="url(#circleGradient)" opacity="0.5"/>
    <circle cx="400" cy="450" r="100" fill="url(#circleGradient)" opacity="0.6"/>
    
    <!-- 文字 -->
    <text x="400" y="100" font-family="Arial, sans-serif" font-size="48" font-weight="bold" 
          text-anchor="middle" fill="#ffffff" stroke="#000000" stroke-width="2">
        pngquant测试图片
    </text>
    
    <text x="400" y="200" font-family="Arial, sans-serif" font-size="24" 
          text-anchor="middle" fill="#ffffff" opacity="0.9">
        这是一个用于测试PNG压缩的示例图片
    </text>
    
    <text x="400" y="250" font-family="Arial, sans-serif" font-size="18" 
          text-anchor="middle" fill="#ffffff" opacity="0.8">
        包含渐变、透明度和文字元素
    </text>
    
    <!-- 装饰矩形 -->
    <rect x="100" y="350" width="600" height="4" fill="#ffffff" opacity="0.6" rx="2"/>
    <rect x="150" y="380" width="500" height="2" fill="#ffffff" opacity="0.4" rx="1"/>
    
    <!-- 底部信息 -->
    <text x="400" y="520" font-family="Arial, sans-serif" font-size="16" 
          text-anchor="middle" fill="#ffffff" opacity="0.7">
        尺寸: ${width}x${height} | 格式: SVG → PNG
    </text>
    
    <text x="400" y="550" font-family="Arial, sans-serif" font-size="14" 
          text-anchor="middle" fill="#ffffff" opacity="0.6">
        Node.js pngquant学习案例
    </text>
</svg>`;

    fs.writeFileSync(outputPath, svgContent, 'utf8');
    console.log(`已创建SVG测试图片: ${outputPath}`);
}

/**
 * 创建多个不同尺寸的测试SVG图片
 */
function createMultipleTestImages() {
    const testDir = path.join(__dirname, 'test-images');
    
    // 确保测试目录存在
    if (!fs.existsSync(testDir)) {
        fs.mkdirSync(testDir, { recursive: true });
    }
    
    // 创建不同尺寸的测试图片
    const testImages = [
        { name: 'large-test.svg', width: 1200, height: 800 },
        { name: 'medium-test.svg', width: 800, height: 600 },
        { name: 'small-test.svg', width: 400, height: 300 }
    ];
    
    console.log('正在创建测试SVG图片...\n');
    
    testImages.forEach(img => {
        const outputPath = path.join(testDir, img.name);
        createTestSVG(outputPath, img.width, img.height);
    });
    
    console.log('\n测试图片创建完成！');
    console.log('注意: 这些是SVG格式的图片，如果要测试PNG压缩，需要：');
    console.log('1. 使用在线工具将SVG转换为PNG');
    console.log('2. 或者使用其他工具生成PNG图片');
    console.log('3. 将PNG图片放到 test-images 目录中');
    console.log('\n然后运行: node index.js');
}

// 如果直接运行此文件，则创建测试图片
if (require.main === module) {
    createMultipleTestImages();
}

module.exports = {
    createTestSVG,
    createMultipleTestImages
};
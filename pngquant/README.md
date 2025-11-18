# pngquant图片压缩学习案例

这是一个使用pngquant进行PNG图片压缩的Node.js学习案例，演示了如何在Node.js中调用pngquant工具来压缩PNG图片。

## 功能特性

- ✅ 单个PNG图片压缩
- ✅ 批量PNG图片压缩
- ✅ 压缩前后文件大小对比
- ✅ 压缩率统计
- ✅ 自定义压缩质量
- ✅ 错误处理和日志输出

## 安装要求

### 1. 安装pngquant工具

**Windows:**
1. 从 [pngquant官网](https://pngquant.org/) 下载pngquant.exe
2. 将pngquant.exe放到系统PATH中，或放到项目目录下

**macOS:**
```bash
brew install pngquant
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install pngquant
```

### 2. 验证安装
```bash
pngquant --version
```

## 使用方法

### 1. 运行演示程序
```bash
cd pngquant
node index.js
```

### 2. 准备测试图片
程序会自动创建 `test-images` 目录，请在该目录下放置一些PNG图片进行测试。

### 3. 查看压缩结果
压缩后的图片会保存在 `compressed-images` 目录中。

## API使用

### 压缩单个图片
```javascript
const { compressPNG } = require('./index.js');

// 压缩单个PNG图片
compressPNG('input.png', 'output.png', 80)
    .then(outputPath => {
        console.log('压缩成功:', outputPath);
    })
    .catch(error => {
        console.error('压缩失败:', error.message);
    });
```

### 批量压缩图片
```javascript
const { batchCompress } = require('./index.js');

// 批量压缩目录中的所有PNG图片
batchCompress('./input-dir', './output-dir', 80)
    .then(() => {
        console.log('批量压缩完成');
    })
    .catch(error => {
        console.error('批量压缩失败:', error.message);
    });
```

### 获取文件大小信息
```javascript
const { getFileSize } = require('./index.js');

const sizeInfo = getFileSize('image.png');
console.log(`文件大小: ${sizeInfo.kb} KB`);
```

### 比较压缩前后大小
```javascript
const { compareFileSize } = require('./index.js');

compareFileSize('original.png', 'compressed.png');
```

## 参数说明

### 压缩质量参数
- `quality`: 压缩质量，范围0-100
  - 0-50: 高压缩率，文件更小，质量较低
  - 50-80: 平衡压缩率和质量（推荐）
  - 80-100: 低压缩率，文件较大，质量较高

## 输出示例

```
=== pngquant图片压缩学习案例 ===

pngquant图片压缩工具演示

注意: 需要先安装pngquant工具
Windows: 下载pngquant.exe并添加到PATH
macOS: brew install pngquant
Linux: sudo apt-get install pngquant

=== 批量压缩PNG图片 ===
输入目录: E:\项目示例\nodejs-learning\pngquant\test-images
输出目录: E:\项目示例\nodejs-learning\pngquant\compressed-images
压缩质量: 80%

找到 3 个PNG文件
正在压缩: E:\项目示例\nodejs-learning\pngquant\test-images\image1.png
命令: pngquant --quality=0-80 --output "E:\项目示例\nodejs-learning\pngquant\compressed-images\compressed_image1.png" "E:\项目示例\nodejs-learning\pngquant\test-images\image1.png"

压缩成功: E:\项目示例\nodejs-learning\pngquant\compressed-images\compressed_image1.png

=== 压缩结果对比 ===
原始文件: 245.67 KB (251,568 bytes)
压缩文件: 123.45 KB (126,412 bytes)
压缩率: 49.73%
节省空间: 122.22 KB

=== 批量压缩总结 ===
总原始大小: 756.89 KB
总压缩大小: 378.45 KB
总压缩率: 50.01%
总节省空间: 378.44 KB
```

## 注意事项

1. **pngquant工具必须已安装**：确保系统中已安装pngquant工具并可在命令行中访问
2. **文件格式**：只支持PNG格式的图片文件
3. **文件权限**：确保有读取输入文件和写入输出文件的权限
4. **输出目录**：程序会自动创建不存在的输出目录
5. **文件覆盖**：如果输出文件已存在，会被覆盖

## 学习要点

通过这个案例，你可以学习到：

1. **Node.js子进程调用**：使用`child_process.exec()`调用外部命令
2. **Promise异步处理**：将回调函数转换为Promise
3. **文件系统操作**：使用`fs`模块进行文件和目录操作
4. **路径处理**：使用`path`模块处理文件路径
5. **错误处理**：完善的错误处理和用户友好的错误信息
6. **模块导出**：使用CommonJS模块系统导出功能
7. **批量处理**：实现批量文件处理的设计模式

## 扩展功能建议

- 支持更多图片格式（JPEG、WebP等）
- 添加图片质量检测
- 实现进度条显示
- 添加配置文件支持
- 实现GUI界面
- 添加图片预览功能
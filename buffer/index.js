console.log('=== Node.js Buffer 模块学习案例 ===\n');

/**
 * Buffer 是 Node.js 中用于处理二进制数据的类
 * 在 Node.js v6.0 之前，Buffer 实例是通过 Buffer 构造函数创建的
 * 现在推荐使用 Buffer.from()、Buffer.alloc() 和 Buffer.allocUnsafe() 方法
 */

/**
 * 1. Buffer 创建方法
 */
function bufferCreation() {
    console.log('1. Buffer 创建方法:');
    
    // 创建一个长度为 10 的 Buffer，并用 0 填充
    const buf1 = Buffer.alloc(10);
    console.log('Buffer.alloc(10):', buf1);
    
    // 创建一个长度为 10 的 Buffer，并用指定值填充
    const buf2 = Buffer.alloc(10, 1);
    console.log('Buffer.alloc(10, 1):', buf2);
    
    // 创建一个未初始化的 Buffer（性能更好，但可能包含敏感数据）
    const buf3 = Buffer.allocUnsafe(10);
    console.log('Buffer.allocUnsafe(10):', buf3);
    
    // 从字符串创建 Buffer
    const buf4 = Buffer.from('hello world', 'utf8');
    console.log('Buffer.from("hello world"):', buf4);
    
    // 从数组创建 Buffer
    const buf5 = Buffer.from([1, 2, 3, 4, 5]);
    console.log('Buffer.from([1,2,3,4,5]):', buf5);
    
    // 从另一个 Buffer 创建
    const buf6 = Buffer.from(buf4);
    console.log('Buffer.from(buf4):', buf6);
    
    console.log();
}

/**
 * 2. Buffer 与字符串转换
 */
function bufferStringConversion() {
    console.log('2. Buffer 与字符串转换:');
    
    const str = 'Hello 世界! 🌍';
    console.log('原始字符串:', str);
    
    // 字符串转 Buffer（不同编码）
    const bufUtf8 = Buffer.from(str, 'utf8');
    const bufBase64 = Buffer.from(str, 'utf8').toString('base64');
    const bufHex = Buffer.from(str, 'utf8').toString('hex');
    
    console.log('UTF-8 Buffer:', bufUtf8);
    console.log('Base64 编码:', bufBase64);
    console.log('Hex 编码:', bufHex);
    
    // Buffer 转字符串
    console.log('Buffer 转 UTF-8:', bufUtf8.toString('utf8'));
    console.log('Buffer 转 Base64:', bufUtf8.toString('base64'));
    console.log('Buffer 转 Hex:', bufUtf8.toString('hex'));
    
    // 从 Base64 解码
    const decodedFromBase64 = Buffer.from(bufBase64, 'base64').toString('utf8');
    console.log('Base64 解码:', decodedFromBase64);
    
    console.log();
}

/**
 * 3. Buffer 操作方法
 */
function bufferOperations() {
    console.log('3. Buffer 操作方法:');
    
    const buf = Buffer.from('Hello World');
    console.log('原始 Buffer:', buf);
    console.log('Buffer 长度:', buf.length);
    
    // 读取字节
    console.log('第一个字节:', buf[0]);
    console.log('最后一个字节:', buf[buf.length - 1]);
    
    // 修改字节
    buf[0] = 72; // 'H' 的 ASCII 码
    console.log('修改后:', buf.toString());
    
    // 切片操作
    const slice = buf.slice(0, 5);
    console.log('切片 buf.slice(0, 5):', slice.toString());
    
    // 复制操作
    const target = Buffer.alloc(5);
    buf.copy(target, 0, 0, 5);
    console.log('复制到新 Buffer:', target.toString());
    
    // 填充操作
    const fillBuf = Buffer.alloc(10);
    fillBuf.fill('ab');
    console.log('填充 "ab":', fillBuf.toString());
    
    console.log();
}

/**
 * 4. Buffer 比较和搜索
 */
function bufferComparison() {
    console.log('4. Buffer 比较和搜索:');
    
    const buf1 = Buffer.from('ABC');
    const buf2 = Buffer.from('ABC');
    const buf3 = Buffer.from('BCD');
    
    // Buffer 比较
    console.log('buf1.equals(buf2):', buf1.equals(buf2));
    console.log('buf1.equals(buf3):', buf1.equals(buf3));
    console.log('buf1.compare(buf3):', buf1.compare(buf3));
    
    // 搜索
    const searchBuf = Buffer.from('Hello World Hello');
    console.log('原始 Buffer:', searchBuf.toString());
    console.log('indexOf("World"):', searchBuf.indexOf('World'));
    console.log('indexOf("Hello", 1):', searchBuf.indexOf('Hello', 1));
    console.log('lastIndexOf("Hello"):', searchBuf.lastIndexOf('Hello'));
    console.log('includes("World"):', searchBuf.includes('World'));
    
    console.log();
}

/**
 * 5. Buffer 拼接
 */
function bufferConcatenation() {
    console.log('5. Buffer 拼接:');
    
    const buf1 = Buffer.from('Hello ');
    const buf2 = Buffer.from('World');
    const buf3 = Buffer.from('!');
    
    // 使用 Buffer.concat()
    const concatenated = Buffer.concat([buf1, buf2, buf3]);
    console.log('Buffer.concat():', concatenated.toString());
    
    // 指定总长度
    const concatenatedWithLength = Buffer.concat([buf1, buf2], 10);
    console.log('指定长度拼接:', concatenatedWithLength.toString());
    
    console.log();
}

/**
 * 6. 数值读写操作
 */
function bufferNumericOperations() {
    console.log('6. 数值读写操作:');
    
    const buf = Buffer.allocUnsafe(8);
    
    // 写入不同类型的数值
    buf.writeInt8(127, 0);           // 8位有符号整数
    buf.writeUInt8(255, 1);          // 8位无符号整数
    buf.writeInt16BE(0x1234, 2);     // 16位大端序
    buf.writeInt16LE(0x5678, 4);     // 16位小端序
    buf.writeInt32BE(0x12345678, 6); // 32位大端序（会溢出到下一个位置）
    
    console.log('写入数值后的 Buffer:', buf);
    
    // 读取数值
    console.log('readInt8(0):', buf.readInt8(0));
    console.log('readUInt8(1):', buf.readUInt8(1));
    console.log('readInt16BE(2):', buf.readInt16BE(2));
    console.log('readInt16LE(4):', buf.readInt16LE(4));
    
    // 浮点数操作
    const floatBuf = Buffer.allocUnsafe(8);
    floatBuf.writeFloatBE(3.14159, 0);
    floatBuf.writeDoubleBE(2.718281828, 4);
    
    console.log('Float BE:', floatBuf.readFloatBE(0));
    console.log('Double BE:', floatBuf.readDoubleBE(4));
    
    console.log();
}

/**
 * 7. JSON 序列化
 */
function bufferJSON() {
    console.log('7. Buffer JSON 序列化:');
    
    const buf = Buffer.from('Hello World');
    console.log('原始 Buffer:', buf);
    
    // Buffer 转 JSON
    const json = JSON.stringify(buf);
    console.log('JSON 字符串:', json);
    
    // JSON 转 Buffer
    const parsed = JSON.parse(json);
    const restored = Buffer.from(parsed.data);
    console.log('恢复的 Buffer:', restored);
    console.log('恢复的字符串:', restored.toString());
    
    console.log();
}

/**
 * 8. Buffer 性能考虑
 */
function bufferPerformance() {
    console.log('8. Buffer 性能考虑:');
    
    // 测试 Buffer.alloc vs Buffer.allocUnsafe
    console.time('Buffer.alloc(1000000)');
    for (let i = 0; i < 1000; i++) {
        Buffer.alloc(1000);
    }
    console.timeEnd('Buffer.alloc(1000000)');
    
    console.time('Buffer.allocUnsafe(1000000)');
    for (let i = 0; i < 1000; i++) {
        Buffer.allocUnsafe(1000);
    }
    console.timeEnd('Buffer.allocUnsafe(1000000)');
    
    // 字符串拼接 vs Buffer 拼接
    const iterations = 10000;
    
    console.time('字符串拼接');
    let str = '';
    for (let i = 0; i < iterations; i++) {
        str += 'a';
    }
    console.timeEnd('字符串拼接');
    
    console.time('Buffer 拼接');
    const buffers = [];
    for (let i = 0; i < iterations; i++) {
        buffers.push(Buffer.from('a'));
    }
    Buffer.concat(buffers);
    console.timeEnd('Buffer 拼接');
    
    console.log();
}

/**
 * 9. 实际应用示例
 */
function bufferPracticalExamples() {
    console.log('9. 实际应用示例:');
    
    // 文件头检测
    function detectFileType(buffer) {
        const header = buffer.slice(0, 4);
        
        if (header.equals(Buffer.from([0xFF, 0xD8, 0xFF, 0xE0]))) {
            return 'JPEG';
        } else if (header.equals(Buffer.from([0x89, 0x50, 0x4E, 0x47]))) {
            return 'PNG';
        } else if (header.equals(Buffer.from([0x47, 0x49, 0x46, 0x38]))) {
            return 'GIF';
        } else {
            return 'Unknown';
        }
    }
    
    // 模拟文件头
    const jpegHeader = Buffer.from([0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10]);
    const pngHeader = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A]);
    
    console.log('JPEG 文件类型:', detectFileType(jpegHeader));
    console.log('PNG 文件类型:', detectFileType(pngHeader));
    
    // 简单的数据加密（XOR）
    function xorEncrypt(buffer, key) {
        const result = Buffer.alloc(buffer.length);
        for (let i = 0; i < buffer.length; i++) {
            result[i] = buffer[i] ^ key;
        }
        return result;
    }
    
    const originalData = Buffer.from('Secret Message');
    const key = 0x5A;
    const encrypted = xorEncrypt(originalData, key);
    const decrypted = xorEncrypt(encrypted, key);
    
    console.log('原始数据:', originalData.toString());
    console.log('加密后:', encrypted);
    console.log('解密后:', decrypted.toString());
    
    console.log();
}

/**
 * 10. Buffer 常用工具函数
 */
function bufferUtilities() {
    console.log('10. Buffer 常用工具函数:');
    
    // 检查是否为 Buffer
    const buf = Buffer.from('test');
    const str = 'test';
    console.log('Buffer.isBuffer(buf):', Buffer.isBuffer(buf));
    console.log('Buffer.isBuffer(str):', Buffer.isBuffer(str));
    
    // 获取字符串的字节长度
    const text = 'Hello 世界';
    console.log('字符串长度:', text.length);
    console.log('UTF-8 字节长度:', Buffer.byteLength(text, 'utf8'));
    console.log('UTF-16 字节长度:', Buffer.byteLength(text, 'utf16le'));
    
    // 检查编码是否支持
    console.log('支持 utf8:', Buffer.isEncoding('utf8'));
    console.log('支持 gbk:', Buffer.isEncoding('gbk'));
    
    console.log();
}

// 执行所有示例
bufferCreation();
bufferStringConversion();
bufferOperations();
bufferComparison();
bufferConcatenation();
bufferNumericOperations();
bufferJSON();
bufferPerformance();
bufferPracticalExamples();
bufferUtilities();

console.log('=== Buffer 模块学习要点 ===');
console.log('1. Buffer 用于处理二进制数据，是 Uint8Array 的子类');
console.log('2. 推荐使用 Buffer.from()、Buffer.alloc() 创建 Buffer');
console.log('3. Buffer.allocUnsafe() 性能更好但可能包含敏感数据');
console.log('4. Buffer 支持多种字符编码转换');
console.log('5. Buffer 提供了丰富的数值读写方法');
console.log('6. Buffer 在文件操作、网络通信中广泛使用');
console.log('7. 注意 Buffer 的内存管理和性能优化');
console.log('8. Buffer 操作是同步的，适合处理二进制数据流');
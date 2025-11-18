/**
 * Node.js Stream 模块学习案例
 * stream 模块提供了用于处理流数据的 API
 * 流是一种处理读写文件、网络通信或任何类型端到端信息交换的抽象接口
 */

import { Readable, Writable, Transform, Duplex, pipeline } from 'stream';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { fileURLToPath } from 'url';

// ES 模块中获取 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 可读流演示
 */
function readableStreamDemo() {
    console.log('=== 可读流演示 ===');
    
    // 创建自定义可读流
    class NumberStream extends Readable {
        constructor(options) {
            super(options);
            this.current = 1;
            this.max = 5;
        }
        
        _read() {
            if (this.current <= this.max) {
                this.push(`数字: ${this.current}\n`);
                this.current++;
            } else {
                this.push(null); // 结束流
            }
        }
    }
    
    const numberStream = new NumberStream();
    
    console.log('自定义可读流输出:');
    numberStream.on('data', (chunk) => {
        process.stdout.write(`接收到数据: ${chunk}`);
    });
    
    numberStream.on('end', () => {
        console.log('可读流结束');
    });
    
    numberStream.on('error', (err) => {
        console.error('可读流错误:', err);
    });
    
    // 使用 Readable.from() 创建流
    setTimeout(() => {
        console.log('\n使用 Readable.from() 创建流:');
        const arrayStream = Readable.from(['苹果', '香蕉', '橙子', '葡萄']);
        
        arrayStream.on('data', (chunk) => {
            console.log('水果:', chunk.toString());
        });
        
        arrayStream.on('end', () => {
            console.log('水果流结束\n');
        });
    }, 100);
}

/**
 * 可写流演示
 */
function writableStreamDemo() {
    console.log('=== 可写流演示 ===');
    
    // 创建自定义可写流
    class LogStream extends Writable {
        constructor(options) {
            super(options);
            this.logs = [];
        }
        
        _write(chunk, encoding, callback) {
            const log = {
                timestamp: new Date().toISOString(),
                data: chunk.toString()
            };
            this.logs.push(log);
            console.log(`[${log.timestamp}] ${log.data}`);
            callback();
        }
        
        getLogs() {
            return this.logs;
        }
    }
    
    const logStream = new LogStream();
    
    // 写入数据到流
    logStream.write('第一条日志消息');
    logStream.write('第二条日志消息');
    logStream.write('第三条日志消息');
    
    logStream.on('finish', () => {
        console.log('可写流完成');
        console.log('所有日志:', logStream.getLogs());
        console.log('');
    });
    
    logStream.end('最后一条消息');
}

/**
 * 转换流演示
 */
function transformStreamDemo() {
    console.log('=== 转换流演示 ===');
    
    // 创建大写转换流
    class UpperCaseTransform extends Transform {
        _transform(chunk, encoding, callback) {
            const upperCased = chunk.toString().toUpperCase();
            this.push(upperCased);
            callback();
        }
    }
    
    // 创建 JSON 转换流
    class JsonTransform extends Transform {
        constructor(options) {
            super(options);
            this.objectMode = true;
        }
        
        _transform(chunk, encoding, callback) {
            try {
                const obj = {
                    timestamp: Date.now(),
                    data: chunk.toString().trim(),
                    length: chunk.length
                };
                this.push(JSON.stringify(obj) + '\n');
                callback();
            } catch (err) {
                callback(err);
            }
        }
    }
    
    const upperCaseTransform = new UpperCaseTransform();
    const jsonTransform = new JsonTransform();
    
    // 创建输入流
    const inputStream = Readable.from(['hello world', 'node.js streams', 'transform demo']);
    
    console.log('转换流处理结果:');
    
    // 链式处理
    inputStream
        .pipe(upperCaseTransform)
        .pipe(jsonTransform)
        .on('data', (chunk) => {
            console.log('转换结果:', chunk.toString());
        })
        .on('end', () => {
            console.log('转换流处理完成\n');
        });
}

/**
 * 双工流演示
 */
function duplexStreamDemo() {
    console.log('=== 双工流演示 ===');
    
    // 创建回声双工流
    class EchoDuplex extends Duplex {
        constructor(options) {
            super(options);
            this.data = [];
        }
        
        _read() {
            if (this.data.length > 0) {
                const item = this.data.shift();
                this.push(`回声: ${item}\n`);
            } else {
                this.push(null);
            }
        }
        
        _write(chunk, encoding, callback) {
            const data = chunk.toString().trim();
            console.log(`接收到: ${data}`);
            this.data.push(data);
            callback();
        }
    }
    
    const echoDuplex = new EchoDuplex();
    
    // 写入数据
    echoDuplex.write('Hello');
    echoDuplex.write('World');
    echoDuplex.write('Duplex Stream');
    echoDuplex.end();
    
    // 读取数据
    echoDuplex.on('data', (chunk) => {
        process.stdout.write(chunk);
    });
    
    echoDuplex.on('end', () => {
        console.log('双工流结束\n');
    });
}

/**
 * 文件流操作演示
 */
function fileStreamDemo() {
    console.log('=== 文件流操作演示 ===');
    
    const sourceFile = path.join(__dirname, 'source.txt');
    const destFile = path.join(__dirname, 'destination.txt');
    const processedFile = path.join(__dirname, 'processed.txt');
    
    // 创建源文件
    const sourceContent = `这是第一行内容
这是第二行内容
这是第三行内容
包含中文字符的测试
Node.js Stream 文件操作演示`;
    
    fs.writeFileSync(sourceFile, sourceContent, 'utf8');
    console.log('创建源文件:', sourceFile);
    
    // 简单文件复制
    const readStream = fs.createReadStream(sourceFile, { encoding: 'utf8' });
    const writeStream = fs.createWriteStream(destFile);
    
    readStream.pipe(writeStream);
    
    writeStream.on('finish', () => {
        console.log('文件复制完成:', destFile);
        
        // 带转换的文件处理
        const processReadStream = fs.createReadStream(sourceFile, { encoding: 'utf8' });
        const processWriteStream = fs.createWriteStream(processedFile);
        
        // 创建行号转换流
        class LineNumberTransform extends Transform {
            constructor(options) {
                super(options);
                this.lineNumber = 1;
                this.buffer = '';
            }
            
            _transform(chunk, encoding, callback) {
                this.buffer += chunk;
                const lines = this.buffer.split('\n');
                this.buffer = lines.pop(); // 保留最后一个不完整的行
                
                const numberedLines = lines.map(line => 
                    `${this.lineNumber++}: ${line}\n`
                ).join('');
                
                this.push(numberedLines);
                callback();
            }
            
            _flush(callback) {
                if (this.buffer) {
                    this.push(`${this.lineNumber}: ${this.buffer}\n`);
                }
                callback();
            }
        }
        
        const lineNumberTransform = new LineNumberTransform();
        
        processReadStream
            .pipe(lineNumberTransform)
            .pipe(processWriteStream);
        
        processWriteStream.on('finish', () => {
            console.log('处理后的文件创建完成:', processedFile);
            
            // 读取并显示处理后的内容
            const processedContent = fs.readFileSync(processedFile, 'utf8');
            console.log('处理后的内容:');
            console.log(processedContent);
            
            // 清理文件
            [sourceFile, destFile, processedFile].forEach(file => {
                if (fs.existsSync(file)) {
                    fs.unlinkSync(file);
                }
            });
            console.log('清理临时文件完成\n');
        });
    });
}

/**
 * Pipeline 演示
 */
function pipelineDemo() {
    console.log('=== Pipeline 演示 ===');
    
    const pipelineAsync = promisify(pipeline);
    
    // 创建数据源
    const dataSource = Readable.from([
        '原始数据 1',
        '原始数据 2', 
        '原始数据 3',
        '原始数据 4',
        '原始数据 5'
    ]);
    
    // 创建处理流
    class ProcessTransform extends Transform {
        _transform(chunk, encoding, callback) {
            const processed = `[处理] ${chunk.toString().toUpperCase()}`;
            this.push(processed + '\n');
            callback();
        }
    }
    
    // 创建输出流
    class OutputWritable extends Writable {
        constructor(options) {
            super(options);
            this.results = [];
        }
        
        _write(chunk, encoding, callback) {
            const data = chunk.toString().trim();
            this.results.push(data);
            console.log('输出:', data);
            callback();
        }
        
        getResults() {
            return this.results;
        }
    }
    
    const processTransform = new ProcessTransform();
    const outputWritable = new OutputWritable();
    
    // 使用 pipeline 连接流
    pipeline(
        dataSource,
        processTransform,
        outputWritable,
        (err) => {
            if (err) {
                console.error('Pipeline 错误:', err);
            } else {
                console.log('Pipeline 完成');
                console.log('所有结果:', outputWritable.getResults());
                console.log('');
            }
        }
    );
}

/**
 * 流的错误处理演示
 */
function errorHandlingDemo() {
    console.log('=== 流的错误处理演示 ===');
    
    // 创建会产生错误的转换流
    class ErrorProneTransform extends Transform {
        constructor(options) {
            super(options);
            this.count = 0;
        }
        
        _transform(chunk, encoding, callback) {
            this.count++;
            
            // 模拟在第3个数据时出错
            if (this.count === 3) {
                callback(new Error('模拟的转换错误'));
                return;
            }
            
            this.push(`处理: ${chunk.toString()}\n`);
            callback();
        }
    }
    
    const errorProneTransform = new ErrorProneTransform();
    const inputStream = Readable.from(['数据1', '数据2', '数据3', '数据4', '数据5']);
    
    // 错误处理
    errorProneTransform.on('error', (err) => {
        console.error('转换流错误:', err.message);
    });
    
    inputStream.on('error', (err) => {
        console.error('输入流错误:', err.message);
    });
    
    // 使用 pipeline 进行错误处理
    pipeline(
        inputStream,
        errorProneTransform,
        process.stdout,
        (err) => {
            if (err) {
                console.error('\nPipeline 错误处理:', err.message);
            } else {
                console.log('Pipeline 成功完成');
            }
            console.log('');
        }
    );
}

/**
 * 流的性能优化演示
 */
function performanceDemo() {
    console.log('=== 流的性能优化演示 ===');
    
    // 高水位标记演示
    class HighWaterMarkDemo extends Readable {
        constructor(options) {
            super(options);
            this.count = 0;
            this.maxCount = 1000;
        }
        
        _read() {
            if (this.count < this.maxCount) {
                this.push(`数据${this.count++}\n`);
            } else {
                this.push(null);
            }
        }
    }
    
    // 不同高水位标记的性能对比
    const startTime = Date.now();
    let dataCount = 0;
    
    const highWaterMarkStream = new HighWaterMarkDemo({ 
        highWaterMark: 16 * 1024 // 16KB 缓冲区
    });
    
    highWaterMarkStream.on('data', (chunk) => {
        dataCount++;
        // 模拟处理时间
        if (dataCount % 100 === 0) {
            process.stdout.write('.');
        }
    });
    
    highWaterMarkStream.on('end', () => {
        const endTime = Date.now();
        console.log(`\n处理 ${dataCount} 条数据，耗时: ${endTime - startTime}ms`);
        console.log('');
    });
}

/**
 * 实用的流工具函数
 */
function streamUtilities() {
    console.log('=== 实用的流工具函数 ===');
    
    /**
     * 将流转换为 Promise
     * @param {Stream} stream - 要转换的流
     * @returns {Promise} Promise 对象
     */
    function streamToPromise(stream) {
        return new Promise((resolve, reject) => {
            const chunks = [];
            
            stream.on('data', (chunk) => {
                chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk.toString()));
            });
            
            stream.on('end', () => {
                resolve(Buffer.concat(chunks));
            });
            
            stream.on('error', reject);
        });
    }
    
    /**
     * 创建延迟流
     * @param {number} delay - 延迟时间（毫秒）
     * @returns {Transform} 延迟转换流
     */
    function createDelayStream(delay) {
        return new Transform({
            transform(chunk, encoding, callback) {
                setTimeout(() => {
                    this.push(chunk);
                    callback();
                }, delay);
            }
        });
    }
    
    /**
     * 创建批处理流
     * @param {number} batchSize - 批处理大小
     * @returns {Transform} 批处理转换流
     */
    function createBatchStream(batchSize) {
        return new Transform({
            objectMode: true,
            transform(chunk, encoding, callback) {
                if (!this.batch) {
                    this.batch = [];
                }
                
                this.batch.push(chunk);
                
                if (this.batch.length >= batchSize) {
                    this.push(this.batch);
                    this.batch = [];
                }
                
                callback();
            },
            flush(callback) {
                if (this.batch && this.batch.length > 0) {
                    this.push(this.batch);
                }
                callback();
            }
        });
    }
    
    // 演示工具函数
    const testStream = Readable.from(['a', 'b', 'c', 'd', 'e', 'f']);
    const delayStream = createDelayStream(100);
    const batchStream = createBatchStream(3);
    
    console.log('批处理流演示:');
    testStream
        .pipe(batchStream)
        .on('data', (batch) => {
            console.log('批次:', batch);
        })
        .on('end', () => {
            console.log('批处理完成');
            
            // 演示流转 Promise
            const promiseStream = Readable.from(['Hello', ' ', 'World', '!']);
            streamToPromise(promiseStream)
                .then((buffer) => {
                    console.log('流转 Promise 结果:', buffer.toString());
                    console.log('');
                })
                .catch(console.error);
        });
}

// 主函数：执行所有演示
function main() {
    console.log('Node.js Stream 模块学习案例\n');
    
    readableStreamDemo();
    
    setTimeout(() => {
        writableStreamDemo();
        transformStreamDemo();
        duplexStreamDemo();
        fileStreamDemo();
        pipelineDemo();
        errorHandlingDemo();
        performanceDemo();
        streamUtilities();
    }, 200);
}

// 直接执行主函数
main();

// 导出函数供其他模块使用
export {
    readableStreamDemo,
    writableStreamDemo,
    transformStreamDemo,
    duplexStreamDemo,
    fileStreamDemo,
    pipelineDemo,
    errorHandlingDemo,
    performanceDemo,
    streamUtilities
};
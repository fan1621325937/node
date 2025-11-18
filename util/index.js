/**
 * Node.js Util 模块学习案例
 * util 模块提供了一系列实用工具函数，主要用于支持 Node.js 内部 API 的需求
 */

const util = require('util');
const fs = require('fs');
const { EventEmitter } = require('events');

/**
 * 字符串格式化演示
 */
function stringFormattingDemo() {
    console.log('=== 字符串格式化演示 ===');
    
    // util.format() - 类似 printf 的格式化 用法%s表示字符串,%d表示整数,%f表示浮点数,%j表示JSON
    const name = '张三';
    const age = 25;
    const score = 95.5;
    
    console.log('基本格式化:');
    console.log(util.format('姓名: %s, 年龄: %d, 分数: %f', name, age, score));
    console.log(util.format('JSON 格式: %j', { name, age, score }));
    console.log(util.format('百分号: %%'));
    
    // 使用模板字符串替代
    console.log('\n模板字符串对比:');
    console.log(`姓名: ${name}, 年龄: ${age}, 分数: ${score}`);
    
    // 复杂对象格式化
    const complexObj = {
        user: { name, age },
        scores: [95, 87, 92],
        metadata: { created: new Date(), active: true }
    };
    
    console.log('\n复杂对象格式化:');
    console.log(util.format('对象: %j', complexObj));
    console.log('');
}

/**
 * 对象检查和类型判断演示
 */
function objectInspectionDemo() {
    console.log('=== 对象检查和类型判断演示 ===');
    
    const testObjects = [
        null,
        undefined,
        42,
        'hello',
        true,
        [],
        {},
        new Date(),
        /regex/,
        function() {},
        Symbol('test'),
        new Map(),
        new Set(),
        Buffer.from('test')
    ];
    
    testObjects.forEach(obj => {
        console.log(`值: ${util.inspect(obj, { colors: false })}`);
        console.log(`  类型: ${typeof obj}`);
        console.log(`  是否为 null: ${util.isNull(obj)}`);
        console.log(`  是否为 undefined: ${util.isUndefined(obj)}`);
        console.log(`  是否为 null 或 undefined: ${util.isNullOrUndefined(obj)}`);
        // console.log(`  是否为数组: ${util.isArray(obj)}`);
        console.log(`  是否为日期: ${util.isDate(obj)}`);
        console.log(`  是否为正则表达式: ${util.isRegExp(obj)}`);
        console.log(`  是否为函数: ${typeof obj === 'function'}`);
        console.log('');
    });
}

/**
 * util.inspect() 深度检查演示
 */
function inspectDemo() {
    console.log('=== util.inspect() 深度检查演示 ===');
    
    const complexObject = {
        name: '复杂对象',
        nested: {
            level1: {
                level2: {
                    level3: {
                        deep: '深层数据',
                        array: [1, 2, { inner: 'value' }]
                    }
                }
            }
        },
        circular: null,
        func: function testFunction() { return 'test'; },
        date: new Date(),
        regex: /test/gi,
        buffer: Buffer.from('hello'),
        map: new Map([['key1', 'value1'], ['key2', 'value2']]),
        set: new Set([1, 2, 3, 3, 4])
    };
    
    // 创建循环引用
    complexObject.circular = complexObject;
    
    console.log('默认检查:');
    console.log(util.inspect(complexObject));
    
    console.log('\n自定义检查选项:');
    console.log(util.inspect(complexObject, {
        depth: 3,           // 检查深度
        colors: false,      // 是否使用颜色
        showHidden: false,  // 是否显示隐藏属性
        maxArrayLength: 5,  // 数组最大显示长度
        breakLength: 60,    // 换行长度
        compact: false      // 是否紧凑显示
    }));
    
    console.log('\n紧凑模式:');
    console.log(util.inspect(complexObject, { compact: true, depth: 2 }));
    console.log('');
}

/**
 * 继承演示
 */
function inheritanceDemo() {
    console.log('=== 继承演示 ===');
    
    // 传统的 util.inherits() 方式（已废弃，但仍可用）
    function Animal(name) {
        this.name = name;
        EventEmitter.call(this);
    }
    
    // 使用 util.inherits 实现继承
    util.inherits(Animal, EventEmitter);
    
    Animal.prototype.speak = function() {
        console.log(`${this.name} 发出声音`);
        this.emit('speak', this.name);
    };
    
    function Dog(name, breed) {
        Animal.call(this, name);
        this.breed = breed;
    }
    
    util.inherits(Dog, Animal);
    
    Dog.prototype.speak = function() {
        console.log(`${this.name} (${this.breed}) 汪汪叫`);
        this.emit('speak', this.name);
    };
    
    Dog.prototype.wagTail = function() {
        console.log(`${this.name} 摇尾巴`);
    };
    
    // 测试继承
    const dog = new Dog('旺财', '金毛');
    
    dog.on('speak', (name) => {
        console.log(`监听到 ${name} 发出声音的事件`);
    });
    
    console.log('传统继承方式:');
    dog.speak();
    dog.wagTail();
    
    // 现代 ES6 类继承方式
    class ModernAnimal extends EventEmitter {
        constructor(name) {
            super();
            this.name = name;
        }
        
        speak() {
            console.log(`${this.name} 发出声音`);
            this.emit('speak', this.name);
        }
    }
    
    class ModernDog extends ModernAnimal {
        constructor(name, breed) {
            super(name);
            this.breed = breed;
        }
        
        speak() {
            console.log(`${this.name} (${this.breed}) 汪汪叫`);
            this.emit('speak', this.name);
        }
        
        wagTail() {
            console.log(`${this.name} 摇尾巴`);
        }
    }
    
    const modernDog = new ModernDog('小白', '哈士奇');
    modernDog.on('speak', (name) => {
        console.log(`监听到 ${name} 发出声音的事件 (ES6)`);
    });
    
    console.log('\nES6 类继承方式:');
    modernDog.speak();
    modernDog.wagTail();
    console.log('');
}

/**
 * Promisify 演示 - 将回调函数转换为 Promise
 */
function promisifyDemo() {
    console.log('=== Promisify 演示 ===');
    
    // 传统的回调函数
    function traditionalCallback(data, callback) {
        setTimeout(() => {
            if (data === 'error') {
                callback(new Error('模拟错误'), null);
            } else {
                callback(null, `处理结果: ${data}`);
            }
        }, 100);
    }
    
    // 使用 util.promisify 转换为 Promise
    const promisifiedFunction = util.promisify(traditionalCallback);
    
    console.log('传统回调方式:');
    traditionalCallback('测试数据', (err, result) => {
        if (err) {
            console.log('错误:', err.message);
        } else {
            console.log('成功:', result);
        }
    });
    
    console.log('\nPromise 方式:');
    promisifiedFunction('测试数据')
        .then(result => console.log('Promise 成功:', result))
        .catch(err => console.log('Promise 错误:', err.message));
    
    // async/await 方式
    async function asyncDemo() {
        try {
            const result = await promisifiedFunction('异步测试');
            console.log('Async/Await 成功:', result);
        } catch (err) {
            console.log('Async/Await 错误:', err.message);
        }
    }
    
    setTimeout(() => {
        console.log('\nAsync/Await 方式:');
        asyncDemo();
    }, 200);
    
    // 文件系统 promisify 示例
    const readFileAsync = util.promisify(fs.readFile);
    const writeFileAsync = util.promisify(fs.writeFile);
    
    async function fileOperationDemo() {
        try {
            const testFile = 'test-util.txt';
            const content = '这是 util.promisify 的文件操作演示';
            
            await writeFileAsync(testFile, content, 'utf8');
            console.log('\n文件写入成功');
            
            const readContent = await readFileAsync(testFile, 'utf8');
            console.log('文件读取成功:', readContent);
            
            // 清理文件
            fs.unlinkSync(testFile);
            console.log('清理测试文件完成');
        } catch (err) {
            console.log('文件操作错误:', err.message);
        }
    }
    
    setTimeout(() => {
        fileOperationDemo();
    }, 300);
    console.log('');
}

/**
 * callbackify 演示 - 将 Promise 转换为回调函数
 */
function callbackifyDemo() {
    console.log('=== Callbackify 演示 ===');
    
    // Promise 函数
    function promiseFunction(data) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (data === 'error') {
                    reject(new Error('Promise 错误'));
                } else {
                    resolve(`Promise 结果: ${data}`);
                }
            }, 100);
        });
    }
    
    // 使用 util.callbackify 转换为回调函数
    const callbackFunction = util.callbackify(promiseFunction);
    
    console.log('原始 Promise 方式:');
    promiseFunction('测试数据')
        .then(result => console.log('Promise 成功:', result))
        .catch(err => console.log('Promise 错误:', err.message));
    
    setTimeout(() => {
        console.log('\n转换为回调方式:');
        callbackFunction('测试数据', (err, result) => {
            if (err) {
                console.log('回调错误:', err.message);
            } else {
                console.log('回调成功:', result);
            }
        });
    }, 200);
    console.log('');
}

/**
 * 调试和开发工具演示
 */
function debuggingDemo() {
    console.log('=== 调试和开发工具演示 ===');
    
    // util.debuglog() - 条件调试日志
    const debug = util.debuglog('myapp');
    
    console.log('设置环境变量 NODE_DEBUG=myapp 来启用调试日志');
    debug('这是一条调试信息');
    debug('只有在 NODE_DEBUG 包含 "myapp" 时才会显示');
    
    // util.deprecate() - 标记废弃函数
    const deprecatedFunction = util.deprecate(
        function oldFunction() {
            return '这是一个废弃的函数';
        },
        'oldFunction() 已废弃，请使用 newFunction() 替代'
    );
    
    console.log('\n调用废弃函数:');
    console.log(deprecatedFunction());
    
    // 自定义检查函数
    function customInspect() {
        return {
            name: '自定义对象',
            [util.inspect.custom]: function(depth, options) {
                return `CustomObject { name: "${this.name}" }`;
            }
        };
    }
    
    const customObj = customInspect();
    console.log('\n自定义检查函数:');
    console.log('默认:', util.inspect(customObj));
    console.log('');
}

/**
 * 实用工具函数集合
 */
function utilityFunctions() {
    console.log('=== 实用工具函数集合 ===');
    
    /**
     * 深度克隆对象
     * @param {any} obj - 要克隆的对象
     * @returns {any} 克隆后的对象
     */
    function deepClone(obj) {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }
        
        if (obj instanceof Date) {
            return new Date(obj.getTime());
        }
        
        if (obj instanceof Array) {
            return obj.map(item => deepClone(item));
        }
        
        if (typeof obj === 'object') {
            const cloned = {};
            Object.keys(obj).forEach(key => {
                cloned[key] = deepClone(obj[key]);
            });
            return cloned;
        }
    }
    
    /**
     * 对象差异比较
     * @param {Object} obj1 - 第一个对象
     * @param {Object} obj2 - 第二个对象
     * @returns {Object} 差异对象
     */
    function objectDiff(obj1, obj2) {
        const diff = {};
        
        // 检查 obj1 中的属性
        Object.keys(obj1).forEach(key => {
            if (!(key in obj2)) {
                diff[key] = { type: 'removed', value: obj1[key] };
            } else if (obj1[key] !== obj2[key]) {
                diff[key] = { type: 'changed', from: obj1[key], to: obj2[key] };
            }
        });
        
        // 检查 obj2 中新增的属性
        Object.keys(obj2).forEach(key => {
            if (!(key in obj1)) {
                diff[key] = { type: 'added', value: obj2[key] };
            }
        });
        
        return diff;
    }
    
    // 演示工具函数
    const original = {
        name: '张三',
        age: 25,
        hobbies: ['读书', '游泳'],
        address: { city: '北京', district: '朝阳' }
    };
    
    const cloned = deepClone(original);
    cloned.age = 26;
    cloned.hobbies.push('跑步');
    cloned.address.district = '海淀';
    
    console.log('原始对象:', util.inspect(original, { depth: null }));
    console.log('克隆对象:', util.inspect(cloned, { depth: null }));
    
    const modified = {
        name: '张三',
        age: 26,
        hobbies: ['读书', '游泳', '跑步'],
        email: 'zhangsan@example.com'
    };
    
    const diff = objectDiff(original, modified);
    console.log('对象差异:', util.inspect(diff, { depth: null }));
    console.log('');
}

// 主函数：执行所有演示
function main() {
    console.log('Node.js Util 模块学习案例\n');
    
    stringFormattingDemo();
    objectInspectionDemo();
    inspectDemo();
    inheritanceDemo();
    promisifyDemo();
    
    // 延迟执行异步演示
    setTimeout(() => {
        callbackifyDemo();
        debuggingDemo();
        utilityFunctions();
    }, 500);
}

// 如果直接运行此文件，则执行主函数
if (require.main === module) {
    main();
}

// 导出函数供其他模块使用
module.exports = {
    stringFormattingDemo,
    objectInspectionDemo,
    inspectDemo,
    inheritanceDemo,
    promisifyDemo,
    callbackifyDemo,
    debuggingDemo,
    utilityFunctions
};
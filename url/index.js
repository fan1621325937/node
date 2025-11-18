/**
 * Node.js URL 模块学习案例
 * url 模块提供了 URL 解析和构建的实用工具
 */

const url = require('url');
const { URL, URLSearchParams } = require('url');

/**
 * 基本 URL 解析演示
 */
function basicUrlParsing() {
    console.log('=== 基本 URL 解析 ===');
    
    const testUrl = 'https://www.example.com:8080/path/to/page?name=张三&age=25&city=北京#section1';
    
    // 使用传统的 url.parse() 方法
    const parsedUrl = url.parse(testUrl, true);
    console.log('使用 url.parse() 解析:');
    console.log('  协议:', parsedUrl.protocol);
    console.log('  主机名:', parsedUrl.hostname);
    console.log('  端口:', parsedUrl.port);
    console.log('  路径:', parsedUrl.pathname);
    console.log('  查询参数:', parsedUrl.query);
    console.log('  锚点:', parsedUrl.hash);
    console.log('');
    
    // 使用现代的 URL 构造函数
    const urlObj = new URL(testUrl);
    console.log('使用 URL 构造函数解析:');
    console.log('  协议:', urlObj.protocol);
    console.log('  主机名:', urlObj.hostname);
    console.log('  端口:', urlObj.port);
    console.log('  路径:', urlObj.pathname);
    console.log('  搜索参数:', urlObj.search);
    console.log('  锚点:', urlObj.hash);
    console.log('  完整 URL:', urlObj.href);
    console.log('');
}

/**
 * URL 构建演示
 */
function urlBuilding() {
    console.log('=== URL 构建 ===');
    
    // 使用 url.format() 构建 URL
    const urlComponents = {
        protocol: 'https:',
        hostname: 'api.example.com',
        port: 443,
        pathname: '/v1/users',
        query: {
            page: 1,
            limit: 10,
            sort: 'name'
        }
    };
    
    const formattedUrl = url.format(urlComponents);
    console.log('使用 url.format() 构建:', formattedUrl);
    
    // 使用 URL 构造函数构建
    const baseUrl = 'https://api.example.com';
    const newUrl = new URL('/v1/users', baseUrl);
    newUrl.port = '443';
    newUrl.searchParams.set('page', '1');
    newUrl.searchParams.set('limit', '10');
    newUrl.searchParams.set('sort', 'name');
    
    console.log('使用 URL 构造函数构建:', newUrl.href);
    console.log('');
}

/**
 * URLSearchParams 使用演示
 */
function urlSearchParamsDemo() {
    console.log('=== URLSearchParams 使用演示 ===');
    
    // 创建 URLSearchParams 对象
    const params = new URLSearchParams();
    
    // 添加参数
    params.append('name', '张三');
    params.append('age', '25');
    params.append('city', '北京');
    params.append('hobby', '读书');
    params.append('hobby', '游泳'); // 同名参数
    
    console.log('构建的查询字符串:', params.toString());
    
    // 获取参数
    console.log('获取 name 参数:', params.get('name'));
    console.log('获取所有 hobby 参数:', params.getAll('hobby'));
    
    // 检查参数是否存在
    console.log('是否存在 age 参数:', params.has('age'));
    console.log('是否存在 email 参数:', params.has('email'));
    
    // 修改参数
    params.set('age', '26'); // 设置单个值
    console.log('修改 age 后:', params.get('age'));
    
    // 删除参数
    params.delete('city');
    console.log('删除 city 后:', params.toString());
    
    // 遍历参数
    console.log('遍历所有参数:');
    for (const [key, value] of params) {
        console.log(`  ${key}: ${value}`);
    }
    console.log('');
}

/**
 * URL 解析和验证
 */
function urlValidation() {
    console.log('=== URL 解析和验证 ===');
    
    const testUrls = [
        'https://www.example.com',
        'http://localhost:3000/api',
        'ftp://files.example.com/download',
        'mailto:test@example.com',
        'file:///C:/Users/Documents/file.txt',
        'invalid-url',
        'https://用户名:密码@example.com:8080/路径?参数=值#锚点'
    ];
    
    testUrls.forEach(testUrl => {
        try {
            const urlObj = new URL(testUrl);
            console.log(`✓ 有效 URL: ${testUrl}`);
            console.log(`  协议: ${urlObj.protocol}`);
            console.log(`  主机: ${urlObj.host}`);
            if (urlObj.username) console.log(`  用户名: ${urlObj.username}`);
            if (urlObj.password) console.log(`  密码: ${urlObj.password}`);
        } catch (error) {
            console.log(`✗ 无效 URL: ${testUrl} - ${error.message}`);
        }
        console.log('');
    });
}

/**
 * 相对 URL 解析
 */
function relativeUrlResolution() {
    console.log('=== 相对 URL 解析 ===');
    
    const baseUrl = 'https://www.example.com/path/to/current/page.html';
    const relativeUrls = [
        'image.jpg',
        './image.jpg',
        '../image.jpg',
        '/absolute/path.html',
        '//other.example.com/page.html',
        'https://external.com/page.html'
    ];
    
    console.log('基础 URL:', baseUrl);
    console.log('');
    
    relativeUrls.forEach(relativeUrl => {
        try {
            const resolvedUrl = new URL(relativeUrl, baseUrl);
            console.log(`相对 URL: ${relativeUrl}`);
            console.log(`解析结果: ${resolvedUrl.href}`);
        } catch (error) {
            console.log(`解析失败: ${relativeUrl} - ${error.message}`);
        }
        console.log('');
    });
}

/**
 * URL 编码和解码
 */
function urlEncodingDecoding() {
    console.log('=== URL 编码和解码 ===');
    
    const testStrings = [
        '张三',
        'hello world',
        'user@example.com',
        'a=1&b=2',
        '特殊字符: !@#$%^&*()'
    ];
    
    testStrings.forEach(str => {
        const encoded = encodeURIComponent(str);
        const decoded = decodeURIComponent(encoded);
        
        console.log(`原始字符串: ${str}`);
        console.log(`编码后: ${encoded}`);
        console.log(`解码后: ${decoded}`);
        console.log('');
    });
}

/**
 * 实用的 URL 工具函数
 */
function urlUtilities() {
    console.log('=== 实用的 URL 工具函数 ===');
    
    /**
     * 从 URL 中提取域名
     * @param {string} urlString - URL 字符串
     * @returns {string} 域名
     */
    function extractDomain(urlString) {
        try {
            const urlObj = new URL(urlString);
            return urlObj.hostname;
        } catch (error) {
            return null;
        }
    }
    
    /**
     * 检查两个 URL 是否来自同一域名
     * @param {string} url1 - 第一个 URL
     * @param {string} url2 - 第二个 URL
     * @returns {boolean} 是否同域
     */
    function isSameDomain(url1, url2) {
        return extractDomain(url1) === extractDomain(url2);
    }
    
    /**
     * 向 URL 添加查询参数
     * @param {string} urlString - 原始 URL
     * @param {Object} params - 要添加的参数
     * @returns {string} 新的 URL
     */
    function addQueryParams(urlString, params) {
        const urlObj = new URL(urlString);
        Object.keys(params).forEach(key => {
            urlObj.searchParams.set(key, params[key]);
        });
        return urlObj.href;
    }
    
    /**
     * 从 URL 中移除查询参数
     * @param {string} urlString - 原始 URL
     * @param {Array} paramsToRemove - 要移除的参数名数组
     * @returns {string} 新的 URL
     */
    function removeQueryParams(urlString, paramsToRemove) {
        const urlObj = new URL(urlString);
        paramsToRemove.forEach(param => {
            urlObj.searchParams.delete(param);
        });
        return urlObj.href;
    }
    
    // 演示工具函数
    const testUrl = 'https://www.example.com/page?existing=value';
    const anotherUrl = 'https://www.example.com/other';
    const differentDomainUrl = 'https://other.com/page';
    
    console.log('提取域名:');
    console.log(`  ${testUrl} -> ${extractDomain(testUrl)}`);
    console.log(`  ${differentDomainUrl} -> ${extractDomain(differentDomainUrl)}`);
    
    console.log('检查同域:');
    console.log(`  ${testUrl} 和 ${anotherUrl} -> ${isSameDomain(testUrl, anotherUrl)}`);
    console.log(`  ${testUrl} 和 ${differentDomainUrl} -> ${isSameDomain(testUrl, differentDomainUrl)}`);
    
    console.log('添加查询参数:');
    const urlWithParams = addQueryParams(testUrl, { name: '张三', age: 25 });
    console.log(`  ${urlWithParams}`);
    
    console.log('移除查询参数:');
    const urlWithoutParams = removeQueryParams(urlWithParams, ['existing', 'age']);
    console.log(`  ${urlWithoutParams}`);
    console.log('');
}

/**
 * URL 路径操作
 */
function urlPathOperations() {
    console.log('=== URL 路径操作 ===');
    
    const testUrl = 'https://www.example.com/api/v1/users/123/profile';
    const urlObj = new URL(testUrl);
    
    console.log('原始路径:', urlObj.pathname);
    
    // 分割路径
    const pathSegments = urlObj.pathname.split('/').filter(segment => segment);
    console.log('路径段:', pathSegments);
    
    // 获取文件名（最后一段）
    const filename = pathSegments[pathSegments.length - 1];
    console.log('文件名:', filename);
    
    // 获取目录路径
    const directory = '/' + pathSegments.slice(0, -1).join('/');
    console.log('目录路径:', directory);
    
    // 构建新路径
    const newPath = '/api/v2/users/456/settings';
    urlObj.pathname = newPath;
    console.log('修改后的 URL:', urlObj.href);
    console.log('');
}

// 主函数：执行所有演示
function main() {
    console.log('Node.js URL 模块学习案例\n');
    
    basicUrlParsing();
    urlBuilding();
    urlSearchParamsDemo();
    urlValidation();
    relativeUrlResolution();
    urlEncodingDecoding();
    urlUtilities();
    urlPathOperations();
}

// 如果直接运行此文件，则执行主函数
if (require.main === module) {
    main();
}

// 导出函数供其他模块使用
module.exports = {
    basicUrlParsing,
    urlBuilding,
    urlSearchParamsDemo,
    urlValidation,
    relativeUrlResolution,
    urlEncodingDecoding,
    urlUtilities,
    urlPathOperations
};
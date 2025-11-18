// 引入 path 模块
const path = require("path");

const myPath = "/foo/bar/baz/asdf/quux.html";

// 1. path.basename(path[, ext])
// 返回路径的最后一部分
// console.log('文件名:', path.basename(myPath)); // quux.html
// console.log('文件名 (无扩展名):', path.basename(myPath, '.html')); // quux

// 2. path.dirname(path)
// 返回路径的目录名
// console.log('目录名:', path.dirname(myPath)); // /foo/bar/baz/asdf

// 3. path.extname(path)
// 返回路径的扩展名
// console.log('扩展名:', path.extname(myPath)); // .html

// 4. path.join([...paths])
// 使用特定于平台的分隔符作为定界符将所有给定的 path 片段连接在一起
// const joinedPath = path.join('/', 'users', 'test', 'files', 'notes.txt');
// console.log('拼接后的路径:', joinedPath); // 在 Windows 上是 \users\test\files\notes.txt, 在 POSIX 上是 /users/test/files/notes.txt

// 5. path.resolve([...paths])
// 将路径或路径片段的序列解析为绝对路径。
// 它通过从右到左处理路径序列来工作，预先处理每个路径，直到构造一个绝对路径。
// const resolvedPath = path.resolve("path", "index.js"); // E:\项目示例\nodejs-learning\path\index.js
// const resolvedPath = path.resolve(__dirname, "b.js"); // E:\项目示例\nodejs-learning\child_process\b.js
// const resolvedPath = path.resolve( "b.js");
console.log("解析后的绝对路径:", resolvedPath); // 将会输出类似 E:\项目示例\nodejs-learning\app\files 的路径

// 6. path.parse(path)
// 将路径字符串转换为对象
// const pathObject = path.parse(myPath);
// console.log('路径对象:', pathObject);
/*
{
  root: '/', // 根目录
  dir: '/foo/bar/baz/asdf', // 目录名
  base: 'quux.html', // 文件名
  ext: '.html', // 扩展名
  name: 'quux' // 文件名 (无扩展名)
}
*/

// 7. path.format(pathObject)
// 从对象返回路径字符串
// const formattedPath = path.format({
//   dir: '/home/user/dir',
//   base: 'file.txt'
// });
// console.log('从对象格式化的路径:', formattedPath); // /home/user/dir/file.txt

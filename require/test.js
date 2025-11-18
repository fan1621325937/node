console.log("hello world");
//  commonjs 导出的使用
// 注意事项
// 1. commonjs 导出的使用 只能在 commonjs 模块中使用
// 2. 导出的内容可以是任意类型，包括对象、函数、字符串、数字等但是只能导出一个内容
// 3. 导出的内容可以在其他模块中使用 require 引入
// 4. 导出的内容可以在其他模块中使用解构赋值的方式引入

// module.exports = {
//   name: "nodejs-learning",
// };

// module.exports = ()=>{
//     console.log("hello world");
// }

// module.exports = 1

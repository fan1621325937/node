const ejs = require("ejs");
const fs = require("fs");
const marked = require("marked");
const browserSync = require("browser-sync").create();

/**
 * 渲染 Markdown 到 HTML 并输出到 index.html
 */
const build = (done) => {
  try {
    const mdContent = fs.readFileSync("./Node.js学习指南.md", "utf-8");
    const htmlBody = marked.parse(mdContent);
    ejs.renderFile(
      "./index.ejs",
      { title: "Node.js学习指南", content: htmlBody },
      (err, html) => {
        if (err) {
          console.log(err);
          done && done(err);
          return;
        }
        fs.writeFileSync("./index.html", html);
        console.log(browserSync.active,'browserSync.active2');
        
        if (browserSync.active) {
          browserSync.reload();
        }
        done && done();
      }
    );
  } catch (error) {
    console.log(error);
    done && done(error);
  }
};

/**
 * 启动一次本地预览服务（只初始化一次）
 */
const initPreview = () => {
  if (!browserSync.active) {
    console.log(browserSync.active,'browserSync.active1');
    
    browserSync.init({ server: "./" });    
  }
};

/**
 * 监听 Markdown 和 EJS 文件变化并触发增量刷新
 */
const setupWatchers = () => {
  fs.watchFile("./Node.js学习指南.md", { interval: 500 }, () => {
    build();
  });
  fs.watchFile("./index.ejs", { interval: 500 }, () => {
    build();
  });
};

// 首次启动：初始化服务并完成一次构建
initPreview();
build();

// 启动文件监听，仅刷新浏览器不重启服务
setupWatchers();

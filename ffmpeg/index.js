const { execSync } = require("child_process");
const fs = require("fs");
// 使用ffmpeg实现
// 1.基本视频格式转换
// 表示将video.mp4文件转换为video.gif文件
// -i 指定输入文件
// -vf "fps=10,scale=320:-1:flags=lanczos" 设置帧率为10fps，宽度320px，高度自适应
// -y 覆盖输出文件（如果存在）
// try {
//   console.log("开始转换视频为GIF...");
//   execSync(
//     'ffmpeg -i video.mp4 -vf "fps=10,scale=320:-1:flags=lanczos" -y video.gif',
//     { stdio: "inherit" }
//   );
//   console.log("转换完成！");
// } catch (error) {
//   console.error("转换失败:", error.message);
// }
// 2.提取视频中的音频
// -i 指定输入文件
// -vn 禁用视频输出
// -acodec copy 直接复制音频流
// -y 覆盖输出文件（如果存在）
// try {
//   console.log("开始提取视频音频...");
//   execSync("ffmpeg -i video.mp4 -vn -acodec copy -y audio.aac", {
//     stdio: "inherit",
//   });
//   console.log("提取完成！");
// } catch (error) {
//   console.error("提取失败:", error.message);
// }

// 3.裁剪视频
// -i 指定输入文件
// -ss 开始时间（格式：时:分:秒.毫秒）
// -to 结束时间（格式：时:分:秒.毫秒）
// -c:v libx264 使用H.264编码器重新编码视频（避免关键帧问题）
// -c:a aac 使用AAC编码器重新编码音频
// -y 覆盖输出文件（如果存在）
// try {
//   console.log("开始裁剪视频...");
//   execSync(
//     "ffmpeg -i video.mp4 -ss 00:00:02.000 -to 00:00:06.000 -c:v libx264 -c:a aac -y cropped.mp4",
//     { stdio: "inherit" }
//   );
//   console.log("裁剪完成！");
// } catch (error) {
//   console.error("裁剪失败:", error.message);
// }

// 4.合并视频 要先裁剪视频生成一个txt，然后 再合并视频
// -f concat 使用concat协议合并视频
// -safe 0 禁用安全模式（允许使用相对路径）
// -y 覆盖输出文件（如果存在）
// 合并video.mp4和cropped.mp4，生成merged.mp4文件

// try {
//   console.log("开始合并视频...");

//   // 创建文件列表文件
//   const fileList = `file 'video.mp4'\nfile 'cropped.mp4'`;
//   fs.writeFileSync("filelist.txt", fileList);

//   // 使用concat协议合并视频
//   execSync("ffmpeg -f concat -safe 0 -i filelist.txt -c copy -y merged.mp4", {
//     stdio: "inherit",
//   });

//   // 清理临时文件
//   fs.unlinkSync("filelist.txt");

//   console.log("合并完成！");
// } catch (error) {
//   console.error("合并失败:", error.message);
//   // 确保清理临时文件
//   if (fs.existsSync("filelist.txt")) {
//     fs.unlinkSync("filelist.txt");
//   }
// }

// 5. 视频添加水印功能详解
// ==========================================
// 功能：给合并后的视频(merged.mp4)添加透明水印，生成带水印的视频文件(watermarked.mp4)
// 
// FFmpeg命令参数详细说明：
// -i merged.mp4                    : 指定第一个输入文件（主视频）
// -i watermark.png                 : 指定第二个输入文件（水印图片）
// 
// -filter_complex 复合滤镜链详解：
// "[1:v]"                          : 选择第二个输入文件的视频流（即水印图片）
// "format=rgba"                    : 将水印图片转换为RGBA格式，确保支持透明通道
// "colorchannelmixer=aa=0.6"       : 调整Alpha通道（透明度），0.6表示60%透明度（40%不透明）
// "scale=iw*0.1:ih*0.1"           : 缩放水印尺寸为原始大小的10%（iw=输入宽度，ih=输入高度）
// "[watermark]"                    : 将处理后的水印流标记为"watermark"
// 
// "[0:v][watermark]"               : 选择主视频流和处理后的水印流
// "overlay="                       : 叠加滤镜，将水印叠加到主视频上
// "main_w-overlay_w-10"            : 水印X坐标 = 主视频宽度 - 水印宽度 - 10像素边距（右下角定位）
// "main_h-overlay_h-10"            : 水印Y坐标 = 主视频高度 - 水印高度 - 10像素边距（右下角定位）
// 
// -y                               : 自动覆盖输出文件（如果已存在）
// watermarked.mp4                  : 输出文件名
// 
// 水印效果特点：
// ✓ 位置：右下角，距离边缘10像素
// ✓ 大小：原水印图片的10%
// ✓ 透明度：60%透明，不会完全遮挡视频内容
// ✓ 格式：支持透明背景的PNG水印
// try {
//   console.log("开始添加水印...");
//   // 使用透明水印，设置位置在右下角，降低透明度避免遮挡
//   execSync(
//     'ffmpeg -i merged.mp4 -i watermark.png -filter_complex "[1:v]format=rgba,colorchannelmixer=aa=0.6,scale=iw*0.1:ih*0.1[watermark];[0:v][watermark]overlay=main_w-overlay_w-10:main_h-overlay_h-10" -y watermarked.mp4',
//     { stdio: "inherit" }
//   );
//   console.log("水印添加完成！");
// } catch (error) {
//   console.error("添加水印失败:", error.message);
// }

// 6. 视频删除水印功能详解（增强版）
// ==========================================
// 功能：使用多种方法移除视频中的水印，提供不同强度的去除效果
// 
// 水印删除难点分析：
// ✗ 问题1：位置不准确 - 水印位置可能与预设不符
// ✗ 问题2：区域太小 - 水印边缘未完全覆盖
// ✗ 问题3：背景复杂 - 简单插值无法很好恢复背景
// ✗ 问题4：水印透明度 - 半透明水印更难完全去除
// 
// 解决方案：
// 方法1：显示边框定位 - 准确找到水印位置
// 方法2：扩大处理区域 - 确保完全覆盖水印
// 方法3：多重滤镜处理 - 先模糊再去除，效果更好
// 
// FFmpeg参数详细说明：
// 
// 方法1 - 边框显示定位：
// -vf "delogo=...show=1"           : show=1显示红色边框，用于确认位置
// -t 3                             : 只处理前3秒，快速预览
// 
// 方法2 - 增强去除效果：
// "x=1150:y=590"                   : 向左上偏移20像素，扩大覆盖范围
// "w=140:h=140"                    : 增大处理区域（原100x100 → 140x140）
// 
// 方法3 - 多重滤镜处理：
// "boxblur=5:1"                    : 先对指定区域进行模糊处理
//   5 = 模糊半径
//   1 = 模糊强度
// "cr=0:ar=0"                      : 不处理色度通道，只处理亮度
// "x=1150:y=590:w=140:h=140"       : 模糊处理的区域坐标
// ","                              : 滤镜链分隔符
// "delogo=..."                     : 然后再进行去水印处理
// 
// 效果对比：
// ✓ 定位测试：红色边框显示处理区域
// ✓ 增强效果：更大区域，更好覆盖
// ✓ 多重处理：模糊+去除，适合复杂背景
// try {
//     console.log('开始删除水印...');
    
//     // 方法1：先显示水印区域边框，帮助定位准确位置
//     console.log('步骤1: 显示水印区域边框，用于定位...');
//     execSync('ffmpeg -i watermarked.mp4 -vf "delogo=x=1100:y=580:w=120:h=120:show=1" -t 3 -y watermark_location_test.mp4', { stdio: 'inherit' });
    
//     // 方法2：使用合适的区域删除水印（基于1280x720分辨率）
//     console.log('步骤2: 使用正确参数删除水印...');
//     execSync('ffmpeg -i watermarked.mp4 -vf "delogo=x=1100:y=580:w=120:h=120:show=0" -y no_watermark_enhanced.mp4', { stdio: 'inherit' });
    
//     // 方法3：使用更保守的参数，确保在视频范围内
//     console.log('步骤3: 使用保守参数处理...');
//     execSync('ffmpeg -i watermarked.mp4 -vf "delogo=x=1050:y=550:w=150:h=150:show=0" -y no_watermark_safe.mp4', { stdio: 'inherit' });
    
//     // 方法4：如果水印在右下角，使用相对定位
//     console.log('步骤4: 使用右下角相对定位...');
//     execSync('ffmpeg -i watermarked.mp4 -vf "delogo=x=1160:y=600:w=100:h=100:show=0" -y no_watermark_corner.mp4', { stdio: 'inherit' });
    
//     console.log('水印删除完成！生成了4个测试文件：');
//     console.log('- watermark_location_test.mp4 (显示边框，用于确认位置)');
//     console.log('- no_watermark_enhanced.mp4 (标准去除效果)');
//     console.log('- no_watermark_safe.mp4 (保守参数处理)');
//     console.log('- no_watermark_corner.mp4 (右下角定位)');
// } catch (error) {
//     console.error('删除水印失败:', error.message);
// }

// 7. 视频压缩功能详解
// ==========================================
// 功能：压缩视频文件大小，降低码率和分辨率，生成压缩后的视频文件(compressed.mp4)
// 
// FFmpeg命令参数详细说明：
// -i video.mp4                     : 指定输入文件（原始视频）
// 
// 视频编码参数详解：
// -c:v libx264                     : 使用H.264视频编码器
// -crf 28                          : 恒定质量因子（0-51，数值越大压缩率越高，质量越低）
// -preset medium                   : 编码预设（ultrafast/fast/medium/slow/veryslow）
// -c:a aac                         : 使用AAC音频编码器
// -b:a 128k                        : 音频码率设置为128kbps
// 
// 分辨率缩放参数：
// -vf "scale=854:480"              : 将视频缩放到854x480分辨率（480p）
// 
// -y                               : 自动覆盖输出文件（如果已存在）
// compressed.mp4                   : 输出文件名
// 
// 压缩效果特点：
// ✓ 文件大小：显著减小（通常减少50-80%）
// ✓ 分辨率：从原始分辨率降至480p
// ✓ 质量：CRF 28提供良好的质量/大小平衡
// ✓ 兼容性：H.264编码确保广泛兼容
// try {
//     console.log('开始压缩视频...');
//     // 使用H.264编码器压缩视频，降低分辨率和码率
//     execSync('ffmpeg -i video.mp4 -c:v libx264 -crf 28 -preset medium -c:a aac -b:a 128k -vf "scale=854:480" -y compressed.mp4', { stdio: 'inherit' });
//     console.log('视频压缩完成！');
// } catch (error) {
//     console.error('视频压缩失败:', error.message);
// }

// 8. 视频旋转功能详解
// ==========================================
// 功能：旋转视频画面，支持90度、180度、270度旋转，生成旋转后的视频文件(rotated.mp4)
// 
// FFmpeg命令参数详细说明：
// -i video.mp4                     : 指定输入文件（原始视频）
// 
// -vf 视频滤镜详解：
// "transpose=1"                    : 旋转滤镜参数
//   0 = 逆时针旋转90度并垂直翻转
//   1 = 顺时针旋转90度
//   2 = 逆时针旋转90度
//   3 = 顺时针旋转90度并垂直翻转
// 
// 其他旋转选项：
// "transpose=2,transpose=2"        : 旋转180度（两次90度旋转）
// "hflip"                          : 水平翻转
// "vflip"                          : 垂直翻转
// 
// -c:a copy                        : 音频流直接复制（不重新编码）
// -y                               : 自动覆盖输出文件（如果已存在）
// rotated.mp4                      : 输出文件名
// 
// 旋转效果特点：
// ✓ 方向：顺时针旋转90度
// ✓ 质量：无损旋转（仅改变方向）
// ✓ 音频：保持原始音频不变
// ✓ 速度：处理速度快
// try {
//     console.log('开始旋转视频...');
//     // 顺时针旋转90度
//     execSync('ffmpeg -i video.mp4 -vf "transpose=1" -c:a copy -y rotated.mp4', { stdio: 'inherit' });
//     console.log('视频旋转完成！');
// } catch (error) {
//     console.error('视频旋转失败:', error.message);
// }

// 9. 视频添加字幕功能详解
// ==========================================
// 功能：在视频底部添加文字字幕，支持自定义字体、颜色、位置，生成带字幕的视频文件(subtitled.mp4)
// 
// FFmpeg命令参数详细说明：
// -i video.mp4                     : 指定输入文件（原始视频）
// 
// -vf drawtext滤镜详解：
// "drawtext="                      : 绘制文字滤镜
// "text='Hello World'"             : 要显示的文字内容
// "fontsize=24"                    : 字体大小（像素）
// "fontcolor=white"                : 字体颜色（支持颜色名称或十六进制）
// "x=(w-text_w)/2"                 : X坐标 = (视频宽度-文字宽度)/2 （水平居中）
// "y=h-text_h-20"                  : Y坐标 = 视频高度-文字高度-20像素 （底部边距20像素）
// "box=1"                          : 启用文字背景框
// "boxcolor=black@0.5"             : 背景框颜色（黑色，50%透明度）
// "boxborderw=5"                   : 背景框边距（像素）
// 
// 字体相关参数：
// "fontfile=arial.ttf"             : 指定字体文件（可选）
// "enable='between(t,0,10)'"       : 时间控制（可选，0-10秒显示）
// 
// -c:a copy                        : 音频流直接复制
// -y                               : 自动覆盖输出文件
// subtitled.mp4                    : 输出文件名
// 
// 字幕效果特点：
// ✓ 位置：底部居中，距离底边20像素
// ✓ 样式：白色字体，黑色半透明背景
// ✓ 大小：24像素字体
// ✓ 持续：整个视频时长
// try {
//     console.log('开始添加字幕...');
//     // 在视频底部添加居中的白色字幕
//     execSync('ffmpeg -i video.mp4 -vf "drawtext=text=\'Hello World\':fontsize=24:fontcolor=white:x=(w-text_w)/2:y=h-text_h-20:box=1:boxcolor=black@0.5:boxborderw=5" -c:a copy -y subtitled.mp4', { stdio: 'inherit' });
//     console.log('字幕添加完成！');
// } catch (error) {
//     console.error('添加字幕失败:', error.message);
// }
// 10. 视频截取截图功能详解
// ==========================================
// 功能：从视频中截取指定时间点的静态图片，生成高质量截图文件(screenshot.jpg)
// 
// FFmpeg命令参数详细说明：
// -i video.mp4                     : 指定输入文件（原始视频）
// 
// 时间定位参数：
// -ss 00:00:05                     : 跳转到指定时间点（5秒处）
//   格式支持：HH:MM:SS 或 秒数
//   示例：-ss 10 (10秒) 或 -ss 00:01:30 (1分30秒)
// 
// 截图参数详解：
// -vframes 1                       : 只提取1帧图像
// -q:v 2                           : 设置图像质量（1-31，数值越小质量越高）
// -f image2                        : 指定输出格式为图像
// 
// 可选参数：
// -vf "scale=1920:1080"            : 调整截图分辨率（可选）
// -y                               : 自动覆盖输出文件（如果已存在）
// screenshot.jpg                   : 输出文件名
// 
// 截图效果特点：
// ✓ 时间点：视频第5秒处
// ✓ 质量：高质量JPEG格式
// ✓ 分辨率：保持原视频分辨率
// ✓ 速度：快速截取，无需处理整个视频
// try {
//     console.log('开始截取视频截图...');
//     // 在视频第5秒处截取一张高质量截图
//     execSync('ffmpeg -i video.mp4 -ss 00:00:05 -vframes 1 -q:v 2 -f image2 -y screenshot.jpg', { stdio: 'inherit' });
//     console.log('视频截图完成！');
// } catch (error) {
//     console.error('截取截图失败:', error.message);
// }

// 11. 视频添加背景音乐功能详解
// ==========================================
// 功能：为视频添加背景音乐，支持音量调节和音频混合，生成带背景音乐的视频文件(with_bgm.mp4)
// 
// FFmpeg命令参数详细说明：
// -i video.mp4                     : 指定输入视频文件
// -i background.mp3                : 指定背景音乐文件
// 
// 音频滤镜详解：
// -filter_complex                  : 复合滤镜，处理多个输入流
// "[0:a]volume=0.8[a0]"            : 原视频音频音量调节
//   [0:a] = 第一个输入的音频流
//   volume=0.8 = 将音量调节到80%
//   [a0] = 输出标签
// 
// "[1:a]volume=0.3[a1]"            : 背景音乐音量调节
//   [1:a] = 第二个输入的音频流
//   volume=0.3 = 将音量调节到30%
//   [a1] = 输出标签
// 
// "[a0][a1]amix=inputs=2[aout]"    : 音频混合
//   amix = 音频混合滤镜
//   inputs=2 = 混合2个音频流
//   [aout] = 最终音频输出
// 
// -map 0:v                         : 映射原视频的视频流
// -map "[aout]"                    : 映射混合后的音频流
// -c:v copy                        : 视频流直接复制（不重新编码）
// -c:a aac                         : 音频编码为AAC格式
// -shortest                        : 以最短的流为准（防止音频过长）
// -y                               : 自动覆盖输出文件
// with_bgm.mp4                     : 输出文件名
// 
// 背景音乐效果特点：
// ✓ 原音频：保留80%音量
// ✓ 背景音乐：30%音量混合
// ✓ 时长：以视频时长为准
// ✓ 质量：无损视频，高质量音频混合
// try {
//     console.log('开始添加背景音乐...');
//     // 混合原音频和背景音乐，调节各自音量
//     execSync('ffmpeg -i video.mp4 -i background.mp3 -filter_complex "[0:a]volume=0.8[a0];[1:a]volume=0.3[a1];[a0][a1]amix=inputs=2[aout]" -map 0:v -map "[aout]" -c:v copy -c:a aac -shortest -y with_bgm.mp4', { stdio: 'inherit' });
//     console.log('背景音乐添加完成！');
// } catch (error) {
//     console.error('添加背景音乐失败:', error.message);
// }

// 12. 视频合并音频和视频功能详解
// ==========================================
// 功能：将独立的视频文件和音频文件合并，替换原视频音轨，生成新的视频文件(merged.mp4)
// 
// FFmpeg命令参数详细说明：
// -i video_no_audio.mp4            : 指定输入视频文件（无音频或需要替换音频）
// -i audio.mp3                     : 指定要合并的音频文件
// 
// 流映射参数：
// -map 0:v                         : 映射第一个输入的视频流
// -map 1:a                         : 映射第二个输入的音频流
// 
// 编码参数：
// -c:v copy                        : 视频流直接复制（不重新编码，速度快）
// -c:a aac                         : 音频编码为AAC格式
// 
// 时长控制：
// -shortest                        : 以最短的流为准
//   如果音频比视频长，在视频结束时停止
//   如果视频比音频长，在音频结束时停止
// 
// -y                               : 自动覆盖输出文件（如果已存在）
// merged.mp4                       : 输出文件名
// 
// 合并效果特点：
// ✓ 视频：保持原始质量（无重新编码）
// ✓ 音频：替换为新的音频轨道
// ✓ 同步：自动音视频同步
// ✓ 时长：以较短的流为准
// try {
//     console.log('开始合并音频和视频...');
//     // 将视频流和音频流合并成新的视频文件
//     execSync('ffmpeg -i video_no_audio.mp4 -i audio.mp3 -map 0:v -map 1:a -c:v copy -c:a aac -shortest -y merged.mp4', { stdio: 'inherit' });
//     console.log('音视频合并完成！');
// } catch (error) {
//     console.error('合并音视频失败:', error.message);
// }

// 13. 视频添加时间戳功能详解
// ==========================================
// 功能：在视频上实时显示当前播放时间戳，支持自定义格式和位置，生成带时间戳的视频文件(timestamped.mp4)
// 
// FFmpeg命令参数详细说明：
// -i video.mp4                     : 指定输入文件（原始视频）
// 
// -vf drawtext滤镜详解：
// "drawtext="                      : 绘制文字滤镜
// "text='%{pts\\:hms}'"            : 时间戳格式
//   %{pts\\:hms} = 以时:分:秒格式显示当前播放时间
//   其他格式：%{pts\\:flt} (浮点秒数)
// 
// 字体样式参数：
// "fontsize=20"                    : 字体大小（像素）
// "fontcolor=yellow"               : 字体颜色（黄色，醒目易读）
// 
// 位置参数：
// "x=10"                           : X坐标（距离左边10像素）
// "y=10"                           : Y坐标（距离顶部10像素）
// 
// 背景样式参数：
// "box=1"                          : 启用文字背景框
// "boxcolor=black@0.8"             : 背景框颜色（黑色，80%不透明度）
// "boxborderw=3"                   : 背景框内边距（3像素）
// 
// 其他位置选项：
// "x=w-text_w-10:y=10"             : 右上角
// "x=10:y=h-text_h-10"             : 左下角
// "x=w-text_w-10:y=h-text_h-10"    : 右下角
// 
// -c:a copy                        : 音频流直接复制
// -y                               : 自动覆盖输出文件
// timestamped.mp4                  : 输出文件名
// 
// 时间戳效果特点：
// ✓ 位置：左上角，距离边缘10像素
// ✓ 格式：HH:MM:SS 时间格式
// ✓ 样式：黄色字体，黑色半透明背景
// ✓ 实时：随视频播放实时更新
// try {
//     console.log('开始添加时间戳...');
//     // 在视频左上角添加实时时间戳显示
//     execSync('ffmpeg -i video.mp4 -vf "drawtext=text=\'%{pts\\:hms}\':fontsize=20:fontcolor=yellow:x=10:y=10:box=1:boxcolor=black@0.8:boxborderw=3" -c:a copy -y timestamped.mp4', { stdio: 'inherit' });
//     console.log('时间戳添加完成！');
// } catch (error) {
//     console.error('添加时间戳失败:', error.message);
// }

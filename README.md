# 付昕 · 作品集网站（fuxin-portfolio）

工业设计 × AI 产品两个方向的作品集网站。纯静态站点（HTML / CSS / 原生 JS），部署在 GitHub Pages。

线上地址：https://fux5063-eng.github.io/fuxin-portfolio/

## 结构

```
index.html                  单页应用外壳（导航 / 页脚 / 灯箱）
assets/css/style.css        样式
assets/js/data.js           所有项目文案（唯一内容源，改这里就改全站）
assets/js/app.js            hash 路由与渲染：/ · #ai · #id · #ai/<项目> · #about · #download
assets/img/                 从作品集 PDF 导出的页面图（每项目 2–5 张）+ 头像
demo/games/                 可在线玩的网页原型（俄罗斯方块 / 切西瓜 / 打方块）
demo/designdna/             DesignDNA 界面走查（真实工具截图分步浏览）
download/                   完整作品集与简历 PDF（页面里的下载入口指向这里）
```

## 改内容

- 改文案 / 增删项目：只改 `assets/js/data.js`。
- 换图：把新图放进 `assets/img/<方向>/`，文件名对应即可；或改 `data.js` 里的路径。
- 本地预览：`python -m http.server 8765` 后打开 http://127.0.0.1:8765/

## 内容边界

- 所有项目事实来自本人作品集（2026-09 终审版）与 `career/master-profile.md`，未新增未经验证的说法。
- 商业项目（落水报警终端、智能锁系列）已按公开边界匿名化，页面内保留「边界说明」段落。
- 网页原型玩法并非原创，页面已标注为「借助 AI 的交互原型练习」。
- 公开页面只放邮箱，不含手机号。

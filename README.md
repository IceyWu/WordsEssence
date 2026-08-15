<p align="center">
  <br>
  <img width="96" src="./public/file.svg" alt="言摘 WordsEssence" />
  <br>
  <br>
</p>

<h1 align="center">言摘 · WordsEssence</h1>

<p align="center">
  <em>字里行间 — a commonplace book</em>
  <br>
  随时收存、分享那些值得反复品读的文字片段。
</p>

<p align="center">
  <a href="https://wd.levwu.me">🌐 正式地址</a>
  &nbsp;·&nbsp;
  <a href="https://wordsessence.netlify.app">🪂 备用地址</a>
</p>

<p align="center">
  <b>简体中文</b> &nbsp;|&nbsp; <a href="./README.en.md">English</a>
</p>

<p align="center">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-16-000000?logo=next.js&logoColor=white">
  <img alt="React" src="https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white">
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?logo=tailwindcss&logoColor=white">
  <img alt="pnpm" src="https://img.shields.io/badge/pnpm-11-F69220?logo=pnpm&logoColor=white">
</p>

---

## ✨ 简介

阅读或生活的旅途中，我们常会遇见那些令人心动、引人深思的句子 —— 一段深刻的哲理、一句动人的表达，或一幅富有诗意的描绘。可惜它们往往只在脑海中短暂停留，随时间慢慢淡忘。

**言摘** 想做的，就是为这些只言片语留一处安放之地：把每一段文字呈现为书桌上的一张「纸」（笔记纸 / 卡片 / 便利贴），用真实手写体书写，带着胶带、回形针、纸张纹理与轻微的倾斜，让美好的文字以另一种方式延续与传播。

> 走「淡雅艺术 / 手绘拟物」风格的个人摘抄本（commonplace book）。所有条目都可直接新增、修改、删除，不区分身份，降低记录门槛。

## 🎯 特性

- 🖋️ **手绘拟物界面** —— 纸张纹理、和纸胶带、回形针、立体投影与轻微倾斜，纯 CSS 生成，无位图。
- 🎨 **淡雅水墨配色** —— 以 `@theme` 设计令牌统一管理墨色、纸色、印泥红与青瓷绿。
- ✒️ **真实手写体** —— 自托管「新叶念体」，所有可见文字皆用手写呈现；墨色随条目轮换，模拟不同的笔。
- 📷 **图片转文字** —— 支持上传或 `Ctrl/⌘+V` 粘贴图片，经 OCR 识别后自动追加到正文。
- ⚡ **服务端取数 + 缓存** —— 基于 RSC 与 Cache Components（`use cache`），首页预渲染为静态壳并按标签失效刷新。
- 🔒 **统一服务端出口** —— 浏览器不直接调用第三方接口，所有读写都经由 Server Actions / RSC，规避 CORS 并隐藏上游。

## 🛠️ 技术栈

| 层 | 选型 |
|----|------|
| 框架 | Next.js 16（App Router）+ React 19 |
| 语言 | TypeScript |
| 样式 | Tailwind CSS v4（`@theme` 设计令牌）|
| 数据获取 | RSC 服务端取数 + Cache Components（`use cache`）|
| 数据写入 | Server Actions（`app/actions/`）|
| 字体 | `next/font`：Inter（界面）+ 本地「新叶念体」（手写）|
| 图标 | lucide-react |
| 包管理 | pnpm |

## 🚀 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务器 → http://localhost:5005
pnpm dev

# 生产构建（校验类型 + 预渲染）
pnpm build

# 运行生产构建
pnpm start
```

### 环境变量

两者均**仅在服务端**读取（`lib/env.ts`），不会进入客户端包。

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `API_BASE_URL` | `http://127.0.0.1:6002` | Essays API 上游（文字数据）|
| `AI_BASE_URL` | `https://api.lpalette.cn` | OCR API 上游（图片转文字）|

## 🧭 架构概览

```
浏览器
  │  读：RSC 服务端直接取数（lib/api.ts，use cache）
  │  写：Server Action（app/actions/*）
  ▼
Next.js 服务端（唯一对外出口，server-only）
  ├─ lib/api.ts  → Essays API（文字数据）
  └─ lib/ocr.ts  → OCR API（图片转文字）
```

所有写操作（增 / 改 / 删）结束后调用 `updateTag("essays")` 即时刷新页面数据，实现 read-your-own-writes 语义。

## 📁 目录结构

```
app/
├─ actions/            # Server Actions（数据写入 / OCR）
├─ _components/        # 页面组件（书桌、纸张、书写台、页头…）
├─ fonts/xinye.otf     # 自托管手写体「新叶念体」
├─ globals.css         # 设计令牌（@theme）与拟物样式
├─ layout.tsx          # 根布局与字体注入
└─ page.tsx            # 首页（服务端取数 + Suspense 流式）
lib/
├─ api.ts              # Essays 服务端数据访问层（CRUD）
├─ ocr.ts              # OCR 任务封装（提交 + 轮询）
├─ format.ts           # 内容分行、日期格式化等
├─ paper-style.ts      # 由 id 推导每条纸张样式
├─ env.ts              # 集中读取上游 Base URL
└─ types.ts            # Essay 及 API 响应类型
docs/项目说明.md        # 完整的设计与接口文档
```

> 更详尽的设计风格、数据模型与接口说明，见 [`docs/项目说明.md`](./docs/项目说明.md)。

## 🗺️ Roadmap

- [x] 项目初始化
- [x] 页面构建
- [x] 前端页面设计与开发
- [x] 图片识别（OCR）接入
- [x] 项目部署
- [ ] 更多纸张 / 装饰风格
- [ ] 主题与配色切换

## 📄 License

仅用于学习与个人记录用途。

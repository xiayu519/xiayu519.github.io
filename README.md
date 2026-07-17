# xiayu519.github.io

xiayu519 的个人技术站点 —— 游戏开发、Cocos Creator、AI 工程化与长期工程实践。

线上：<https://xiayu519.github.io/>

## 技术栈

- **Astro 7** + TypeScript（静态站点生成）
- **Content Collections** 管理文章
- **MDX / Markdown** 写作，Shiki 代码高亮（亮/暗双主题）
- **Pagefind** 站内静态搜索
- **RSS / Sitemap** 自动生成
- 亮/暗主题、移动端适配、SEO（Open Graph / Twitter Card / canonical）
- **GitHub Actions** 自动构建并部署到 GitHub Pages

## 本地开发

```sh
npm install
npm run dev       # 本地预览 http://localhost:4321
npm run build     # 类型检查 + 生产构建 + Pagefind 索引
npm run preview   # 预览生产构建
```

构建产物在 `dist/`。`npm run build` 会依次执行 `astro check`、`astro build`、`pagefind --site dist`。

## 写新文章

在 `src/content/blog/` 下按主题目录新建 Markdown（`.md`）或 MDX（`.mdx`）：

```
src/content/blog/
├── ai-codex/          # AI 工程化、Codex、模型工作流
├── cocos-creator/     # Cocos Creator、客户端框架
├── game-development/  # 游戏开发
├── engineering/       # 工程实践
└── notes/             # 随手笔记
```

Frontmatter 模板：

```yaml
---
title: '文章标题'
description: '一句话摘要，用于列表、SEO 与分享卡片'
pubDate: 'Jul 17 2026'
updatedDate: 'Jul 18 2026'   # 可选
heroImage: '../../assets/xxx.jpg'  # 可选
category: 'AI 工程化'
tags: ['Tyou', 'Codex']
draft: false            # true 时不会发布
featured: true          # 是否在首页“精选”展示
project: 'Tyou'         # 可选，关联的项目名
slug: 'my-post'         # 可选，自定义 URL（默认用文件名）
---

正文内容……
```

提交 Markdown 后，GitHub Actions 会自动构建并部署。

## 项目结构

```
├── .github/workflows/deploy.yml   # Pages 部署工作流
├── public/                        # 静态资源（favicon、robots、社交卡）
├── src/
│   ├── components/                # Header / Footer / PostCard 等
│   ├── content/blog/              # 文章内容（按主题分目录）
│   ├── data/projects.ts           # 项目展示数据
│   ├── layouts/                   # BlogPost / PageLayout
│   ├── pages/                     # 路由（首页 / 文章 / 分类 / 标签 / 归档 / 项目 / 搜索 / 关于）
│   ├── styles/global.css          # 设计 token + 亮/暗主题 + 正文排版
│   ├── consts.ts                  # 站点常量与导航
│   └── content.config.ts          # Content Collections schema
└── astro.config.mjs
```

## 部署

推送到 `main` 分支即触发 `.github/workflows/deploy.yml`：
构建 → 上传产物 → 部署到 GitHub Pages。

需要在仓库 **Settings → Pages → Source** 选择 **GitHub Actions**。

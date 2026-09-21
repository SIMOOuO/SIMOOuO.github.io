# SIMO — 精选工具与资源合集

**[English](README.md)**

一个精选的有用网站、工具和资源合集，涵盖学习、生产力和娱乐——使用纯 HTML、CSS 和 JavaScript 构建。

## 在线演示

托管在 GitHub Pages：[https://simoouo.github.io](https://simoouo.github.io)

## 功能特性

- **首页** — 60+ 个精选网站，按类别分类（工具、学习、游戏、其他），支持搜索和分页
- **API 工具** — 图书搜索（Open Library）、货币转换器、宝可梦查询、国家信息
- **食谱搜索** — 按食材、菜系或餐类搜索食谱（由 TheMealDB API 提供支持）
- **动漫** — 动漫搜索与发现（由 Jikan API 提供支持）
- **游戏** — 游戏精彩片段和嵌入式视频
- **天气组件** — 实时天气与城市搜索（由 Open-Meteo API 提供支持）
- **深色/浅色主题** — 主题切换，设置自动保存
- **背景音乐** — 可配置的 BGM，支持音量控制和淡入效果
- **设置面板** — 自定义音频、UI 音效和偏好设置
- **响应式设计** — 适配桌面、平板和手机
- **双语支持** — 全站中英文内容

## 技术栈

| 技术 | 用途 |
|---|---|
| HTML5 | 页面结构 |
| CSS3 | 样式（使用 CSS 自定义属性/变量） |
| 原生 JavaScript | 所有交互逻辑——无框架 |
| TheMealDB API | 食谱搜索 |
| Open-Meteo API | 天气与地理编码 |
| Jikan API | 动漫数据（非官方 MyAnimeList） |
| Open Library API | 图书搜索 |
| PokéAPI | 宝可梦数据 |
| REST Countries API | 国家信息 |
| GitHub Pages | 免费托管 |

## 项目结构

```
web_simo-3.0/
├── index.html          # 首页 — 精选工具列表（带分页）
├── tools.html          # API 工具（图书、货币、宝可梦、国家）
├── food.html           # 食谱搜索
├── anime.html          # 动漫搜索
├── game.html           # 游戏回放
├── about.html          # 关于页面（双语）
├── 404.html            # 自定义 404 页面
├── README.md           # 英文文档
├── README.zh-CN.md     # 本文件（中文）
├── css/
│   ├── style.css       # 主样式表
│   ├── tools.css       # 工具页样式
│   ├── anime.css       # 动漫页样式
│   └── settings.css    # 设置面板样式
├── js/
│   ├── main.js         # 核心逻辑（导航、主题、工具、搜索、食谱、天气）
│   ├── tools.js        # API 工具逻辑
│   ├── anime.js        # 动漫页逻辑
│   ├── SPA.js          # SPA 工具
│   ├── lib/
│   │   ├── jikan.js    # Jikan API 封装
│   │   └── util/
│   │       ├── Request.js
│   │       └── Settings.js
│   └── settings/
│       ├── AudioManager.js    # 背景音乐播放与 UI 音效
│       ├── SettingsPanel.js   # 设置界面
│       ├── SettingsStorage.js # LocalStorage 持久化
│       └── settings-init.js   # 设置初始化
├── audio/
│   └── Prod-by-24T.mp3       # 背景音乐（by 24T）
└── image/
    ├── home.png
    ├── food.png
    ├── game.png
    ├── Pikachu.jpg
    └── ...
```

## 快速开始

### 本地开发

1. 克隆仓库：
   ```bash
   git clone https://github.com/SIMOOuO/SIMOOuO.github.io.git
   cd web_simo
   ```

2. 在浏览器中打开 `index.html` — 无需构建步骤。

### 部署到 GitHub Pages

1. 推送到你的 GitHub 仓库
2. 进入 **Settings > Pages**
3. 选择分支和根目录
4. 你的网站将在 `https://<username>.github.io` 上线

## 使用的 API

| API | 费用 | 用途 |
|---|---|---|
| [TheMealDB](https://www.themealdb.com/) | 免费 | 按食材/菜系搜索食谱 |
| [Open-Meteo](https://open-meteo.com/) | 免费 | 天气预报与地理编码 |
| [Jikan](https://jikan.moe/) | 免费 | 动漫搜索与数据 |
| [Open Library](https://openlibrary.org/) | 免费 | 图书搜索 |
| [PokéAPI](https://pokeapi.co/) | 免费 | 宝可梦数据 |
| [REST Countries](https://restcountries.com/) | 免费 | 国家信息 |

## 致谢

- **背景音乐**: [Prod by 24T](https://space.bilibili.com/252024287) — 所有权利归原创作者所有。编曲/后缀: Prod by 24T
- **字体**：[Fraunces](https://fonts.google.com/specimen/Fraunces)、[DM Sans](https://fonts.google.com/specimen/DM+Sans)、[JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono)（来自 Google Fonts）
- **API**：TheMealDB、Open-Meteo、Jikan、Open Library、PokéAPI、REST Countries

## 许可证

版权所有 &copy; 2026 SIMOOuO 保留所有权利。

本项目仅供个人学习和非商业用途。所有第三方 API、图片和音乐均为其各自所有者的财产。使用前请自行确认相关授权许可。

---

<p align="center">
  由 <a href="https://github.com/SIMOOuO">SIMO</a> 用 ❤️ 构建
</p>

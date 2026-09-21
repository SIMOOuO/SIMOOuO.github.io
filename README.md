# SIMO — Curated Tools & Resources

**[中文文档](README.zh-CN.md)**

A curated collection of useful websites, tools, and resources for learning, productivity, and fun — built with pure HTML, CSS, and JavaScript.

![SIMO Preview](image/home.png)

## Live Demo

Hosted on GitHub Pages: [https://simooouo.github.io/web_simo/](https://simooouo.github.io/web_simo/)

## Features

- **Home** — 60+ curated websites organized by category (Tool, Study, Game, Other) with search and pagination
- **API Tools** — Book search (Open Library), currency converter, Pokémon lookup, country info
- **Recipe Finder** — Search recipes by ingredient, cuisine, or meal type (powered by TheMealDB API)
- **Anime** — Anime search and discovery (powered by Jikan API)
- **Games** — Gaming highlights and embedded video clips
- **Weather Widget** — Real-time weather with city search (powered by Open-Meteo API)
- **Dark/Light Theme** — Toggle between themes with persistence
- **Background Music** — Configurable BGM with volume control and fade-in
- **Settings Panel** — Customize audio, UI sounds, and preferences
- **Responsive Design** — Works on desktop, tablet, and mobile
- **Bilingual Support** — English and 中文 content throughout

## Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 | Structure |
| CSS3 | Styling with custom properties (CSS variables) |
| Vanilla JavaScript | All interactivity — no frameworks |
| TheMealDB API | Recipe search |
| Open-Meteo API | Weather & geocoding |
| Jikan API | Anime data (unofficial MyAnimeList) |
| Open Library API | Book search |
| PokéAPI | Pokémon data |
| REST Countries API | Country information |
| GitHub Pages | Free hosting |

## Project Structure

```
web_simo-3.0/
├── index.html          # Home — curated tool list with pagination
├── tools.html          # API-powered tools (books, currency, Pokémon, countries)
├── food.html           # Recipe Finder
├── anime.html          # Anime search
├── game.html           # Game replays
├── about.html          # About page (bilingual)
├── 404.html            # Custom 404 page
├── README.md           # This file (English)
├── README.zh-CN.md     # Chinese documentation
├── css/
│   ├── style.css       # Main stylesheet
│   ├── tools.css       # Tools page styles
│   ├── anime.css       # Anime page styles
│   └── settings.css    # Settings panel styles
├── js/
│   ├── main.js         # Core logic (nav, theme, tools, search, recipes, weather)
│   ├── tools.js        # API tools logic
│   ├── anime.js        # Anime page logic
│   ├── SPA.js          # SPA utilities
│   ├── lib/
│   │   ├── jikan.js    # Jikan API wrapper
│   │   └── util/
│   │       ├── Request.js
│   │       └── Settings.js
│   └── settings/
│       ├── AudioManager.js    # BGM playback & UI sounds
│       ├── SettingsPanel.js   # Settings UI
│       ├── SettingsStorage.js # LocalStorage persistence
│       └── settings-init.js   # Settings initialization
├── audio/
│   └── Prod-by-24T.mp3       # Background music (by 24T)
└── image/
    ├── home.png
    ├── food.png
    ├── game.png
    ├── Pikachu.jpg
    └── ...
```

## Getting Started

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/SIMOOuO/web_simo.git
   cd web_simo
   ```

2. Open `index.html` in your browser — no build step required.

### Deploy to GitHub Pages

1. Push to your GitHub repository
2. Go to **Settings > Pages**
3. Select the branch and root directory
4. Your site will be live at `https://<username>.github.io/web_simo/`

## APIs Used

| API | Endpoint | Usage |
|---|---|---|
| [TheMealDB](https://www.themealdb.com/) | Free | Recipe search by ingredient/cuisine |
| [Open-Meteo](https://open-meteo.com/) | Free | Weather forecasts & geocoding |
| [Jikan](https://jikan.moe/) | Free | Anime search & data |
| [Open Library](https://openlibrary.org/) | Free | Book search |
| [PokéAPI](https://pokeapi.co/) | Free | Pokémon data |
| [REST Countries](https://restcountries.com/) | Free | Country information |

## Credits

- **Background Music**: [Prod by 24T](https://space.bilibili.com/252024287) — All rights belong to the original creator. 编曲/后缀: Prod by 24T
- **Fonts**: [Fraunces](https://fonts.google.com/specimen/Fraunces), [DM Sans](https://fonts.google.com/specimen/DM+Sans), [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) via Google Fonts
- **APIs**: TheMealDB, Open-Meteo, Jikan, Open Library, PokéAPI, REST Countries

## License

&copy; 2026 SIMOOuO. All rights reserved.

This project is for personal learning and non-commercial use. All third-party APIs, images, and music are property of their respective owners. Please review applicable licenses before use.

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/SIMOOuO">SIMO</a>
</p>

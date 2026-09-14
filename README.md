# GameVault — Modern Gaming Dashboard & Library Manager

GameVault is a personal gaming dashboard and library management application built with **React**, **Vite**, **TypeScript**, and **Tailwind CSS**. It is completely client-side, offline-first, and deployable as a static website on **GitHub Pages** with zero backend dependencies.

![GameVault Preview](https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop)

---

## ✨ Features

- **🎮 Personal Library Management**:
  - Add, edit, and delete games with custom fields: title, genre, platform, status, rating, playtime, completion percentage, release year, tags, cover image URL, and markdown notes.
  - Multi-status tracking: *Playing*, *Completed*, *Backlog*, *Wishlist*, *Paused*, and *Dropped*.
  - Favorite toggling with spotlight sections.
  - Quick session logging (e.g. `+1h`, `+30m`, status changes directly from cards).

- **📊 Comprehensive Gaming Statistics**:
  - Dynamic client-side charts powered by Chart.js (Platform distribution, Genre breakdown, Status distribution, Playtime by genre, Rating histogram).
  - Calculated strictly from real stored games (no hardcoded metrics).
  - Highlights for most played title, highest rated title, and completed vs. backlog burnout ratio.

- **🎯 Gaming Goals & Milestones**:
  - Set custom targets (e.g. *"Complete 10 games this year"*, *"Clock 100 hours in RPGs"*).
  - Visual progress bars, percentage indicators, remaining amounts, and deadline countdown badges.

- **🔍 Smart Search, Filtering & Sorting**:
  - Real-time search across titles, genres, and custom tags.
  - Multi-facet filters for status, platform, genre, minimum rating, and favorites.
  - Multi-criteria sorting (Recently added, Recently played, Highest rating, Most playtime, Completion %, Alphabetical).
  - Toggle between Modern Grid view and Compact Table/List view with localStorage persistence.

- **🛡️ Resilient Offline & Image Design**:
  - Never crashes on broken or missing cover URLs.
  - Dynamic procedural SVG cover generator (`GameCoverPlaceholder`) renders custom gradient artwork, title initials, and genre typography whenever an image is unavailable.

- **💾 Local Storage Service & Backup/Restore**:
  - All data is safely stored in the user's browser using `localStorage` (`gamingDashboard_games`, `gamingDashboard_goals`, `gamingDashboard_settings`).
  - Full JSON backup export and import with structure verification and confirmation modals.
  - One-click reload of curated sample library.

- **🎨 Modern Gaming UI**:
  - Obsidian slate dark theme with neon cyan & electric violet accents.
  - Light mode switch.
  - Fully responsive on desktop, tablet, and mobile devices with collapsible navigation drawer.

---

## 🛠️ Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite 6
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3
- **Icons**: Lucide React
- **Charts**: Chart.js & React-Chartjs-2
- **Routing**: React Router (`HashRouter` for zero-configuration GitHub Pages static hosting)

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation & Local Run

1. Clone or open the repository:
   ```bash
   cd game_dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```

4. Open `http://localhost:5173` in your browser.

---

## 📦 Building for Production

To create a static production build:

```bash
npm run build
```

This compiles TypeScript and outputs optimized static HTML, CSS, and JS bundles to the `dist/` directory.

You can preview the production build locally:

```bash
npm run preview
```

---

## 🌐 Deploying to GitHub Pages

Because the app uses `base: './'` in `vite.config.ts` and `HashRouter` in `App.tsx`, it is 100% compatible with GitHub Pages subfolder URLs out of the box.

### Option 1: GitHub Pages via GitHub Actions (Recommended)

1. Push your repository to GitHub.
2. In your repository on GitHub, go to **Settings** > **Pages**.
3. Under **Build and deployment** > **Source**, select **GitHub Actions**.
4. Create a workflow file `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: true

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### Option 2: Deploy using `gh-pages` CLI

1. Install `gh-pages`:
   ```bash
   npm install --save-dev gh-pages
   ```

2. Add deploy script in `package.json`:
   ```json
   "scripts": {
     "deploy": "npm run build && gh-pages -d dist"
   }
   ```

3. Run:
   ```bash
   npm run deploy
   ```

---

## 📁 Code Architecture

```
src/
├── components/
│   ├── charts/         # Chart.js platform, genre, status, rating components
│   ├── common/         # StatCard, Modal, ConfirmDialog, ProgressBar, GameCover
│   ├── games/          # GameCard, GameGrid, GameList, FilterPanel, SearchBar, Forms
│   ├── goals/          # GoalCard, GoalFormModal
│   └── layout/         # Sidebar, Navbar, Layout
├── context/            # GameContext, GoalContext, ThemeContext
├── data/               # initialGames & curated seed data
├── pages/              # Dashboard, Library, Filtered views, Statistics, Goals, Settings
├── services/           # storageService (localStorage, schema migrations, import/export)
├── types/              # Game, Goal, Settings, Filter interfaces
└── utils/              # dynamic stats calculations, date & time formatters, JSON download
```

---

## 🔒 Privacy & Offline Behavior

GameVault connects to no third-party tracking or remote databases. All user data, notes, and goals stay strictly on your device inside browser storage.

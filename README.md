# NewsHub — Modern Global News Reader

NewsHub is a premium, responsive web application for browsing the latest headlines from around the world. Featuring a sleek glassmorphic design system, dual light/dark themes, full article preview modal, and localStorage-persisted bookmarks.

![NewsHub Showcase](https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&auto=format&fit=crop&q=80)

## Key Features

- 📰 **Interactive Demo Mode**: Explore the app immediately with high-quality, categorized mock stories and Unsplash illustrations — no API keys required!
- ⚡ **Dual API Live Engines**: Supports live feeds from both **GNews API** (CORS-friendly for web deployments like GitHub Pages) and **NewsAPI.org** (CORS-restricted, works on `localhost`).
- 🔒 **Secure LocalStorage Key Storage**: Input your API keys safely through the in-app Settings panel. Keys are stored locally in your browser and never pushed to public git repositories.
- 🌓 **Dynamic Theme Engine**: Smoothly transitions between premium dark mode (default) and paper-light mode.
- 📱 **Adaptive View Layouts**: Instantly toggle between a multi-column **Grid View** and detailed **List View** layouts.
- 🔖 **Bookmarks Sidebar**: Save important articles locally to read later, featuring dynamic badge notifications.
- 🚀 **Native Web Share**: Share stories directly using your device's native sharing sheet or automatic link clipboard coping.

## Technology Stack

- **HTML5 & CSS3**: Custom modern properties, HSL color tokens, backdrop filters, flexbox/grid alignments, and pure CSS micro-animations.
- **Vanilla JavaScript (ES6+)**: Custom routing, asynchronous fetch layers, custom-built modal managers, and state syncing.
- **News API Platforms**: Configured to query GNews API and NewsAPI.org dynamically.

## Getting Started

### 1. View Offline / Demo Mode
Open [index.html](file:///c:/Users/HP/Desktop/mywebsite/index.html) directly in any modern browser. By default, the app initializes in **Demo Mode**, letting you click categories, search, bookmark, and read full articles offline.

### 2. Connect Live News APIs
1. Click the **API Settings** button (gear icon) in the header or footer.
2. Select your preferred provider:
   - **GNews API** (Recommended for GitHub Pages): Go to [gnews.io](https://gnews.io/), register for a free account, copy your token, and paste it into the settings.
   - **NewsAPI.org** (Recommended for Localhost): Go to [newsapi.org](https://newsapi.org/), register for a developer key, copy your token, and paste it into the settings.
3. Click **Save Configuration**. The app will reload and connect live!

## Project File Layout
```
mywebsite/
├── index.html            # NewsHub Main Interface
├── style.css             # Unified CSS Style sheet (Grid/List, themes)
├── script.js             # Core App logic & Calculator integration
├── manifest.json         # PWA Manifest metadata
├── README.md             # Project Guide
└── [legacy-files]        # Legacy calculator and social resources
```

## Future Enhancements
- [ ] Multi-lingual news translation feed.
- [ ] Push notifications for breaking stories.
- [ ] RSS/Atom feed ingestion support.

## License
Open source and available under the [MIT License](https://opensource.org/licenses/MIT).

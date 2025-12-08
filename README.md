# GitHub Contribution Graph Widget

A lightweight, customizable widget to embed your GitHub contribution graph on any website.

[![npm version](https://img.shields.io/npm/v/github-contrib-graph.svg)](https://npmjs.com/package/github-contrib-graph)
[![npm downloads](https://img.shields.io/npm/dm/github-contrib-graph.svg)](https://npmjs.com/package/github-contrib-graph)
[![CI](https://github.com/iamjr15/github-contribution-graph/actions/workflows/ci.yml/badge.svg)](https://github.com/iamjr15/github-contribution-graph/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue)](LICENSE)

<p align="center">
  <a href="https://github-contribution-graph.netlify.app"><strong>Live Demo</strong></a> ·
  <a href="https://github.com/iamjr15/github-contribution-graph"><strong>GitHub Repo</strong></a> ·
  <a href="https://npmjs.com/package/github-contrib-graph"><strong>npm Package</strong></a>
</p>

---

## NPM Package

Install via npm for React or vanilla JavaScript projects:

```bash
npm install github-contrib-graph
```

### React

```tsx
import { GitHubContributionGraph } from 'github-contrib-graph/react';
import 'github-contrib-graph/styles.css';

function App() {
  return <GitHubContributionGraph username="octocat" theme="midnight" />;
}
```

### Vanilla JavaScript

```js
import { GitHubContributionWidget } from 'github-contrib-graph/vanilla';
import 'github-contrib-graph/styles.css';

const widget = new GitHubContributionWidget({
  username: 'octocat',
  container: '#my-graph',
  theme: 'void',
});
widget.render();
```

See the [package README](packages/github-contribution-graph/README.md) for full API documentation.

---

## Quick Start (CDN)

Add the following to your HTML file to get the standard GitHub-styled graph:

```html
<!-- 1. Include the styles -->
<link rel="stylesheet" href="https://github-contribution-graph.netlify.app/assets/css/gh.css">

<!-- 2. Create the container with your username -->
<div id="gh" data-login="iamjr15"></div>

<!-- 3. Include the script -->
<script src="https://github-contribution-graph.netlify.app/assets/js/gh.js"></script>
```

---

## 🌑 "Void" Minimalist Theme Integration

To replicate the futuristic **Void Minimalist** aesthetic (Black & Monospace) shown in the demo, follow these steps.

### 1. HTML Structure

Wrap the graph container in the following structure to add the grid background, crosshair, and status footer.

```html
<!-- Background Elements -->
<div class="grid-bg"></div>
<div class="crosshair"></div>

<!-- Main Content -->
<div class="main-container">
    <h1>Activity Record</h1>
    
    <!-- The Graph Container -->
    <div id="gh" data-login="YOUR_USERNAME"></div>

    <!-- Status Footer -->
    <div class="meta-info">
        <div class="meta-item"><div class="status-dot"></div> SYSTEM ONLINE</div>
        <div class="meta-item">ID: USER_01</div>
        <div class="meta-item">LOC: LOCALHOST</div>
    </div>
</div>
```

### 2. CSS Styles

Add this CSS to your stylesheet to apply the dark theme and override the default graph colors.

```css
/* --- Void Theme Variables --- */
:root {
    --bg-color: #000000;
    --text-primary: #ffffff;
    --text-dim: #333333;
    
    /* Override Graph Variables */
    --gh-bg-color: #000000 !important;
    --gh-text-default-color: #ffffff !important;
    --gh-cell-level0-color: #111111 !important;
    --gh-border-card-color: #333333 !important;
    --gh-font-default-family: 'SF Mono', 'Fira Code', Consolas, monospace !important;
}

/* --- Layout & Backgrounds --- */
body {
    background-color: var(--bg-color);
    color: var(--text-primary);
    font-family: 'SF Mono', 'Fira Code', Consolas, monospace;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    overflow: hidden;
}

.grid-bg {
    position: fixed;
    top: 0; left: 0; width: 100%; height: 100%;
    background-image: 
        linear-gradient(var(--text-dim) 1px, transparent 1px),
        linear-gradient(90deg, var(--text-dim) 1px, transparent 1px);
    background-size: 100px 100px;
    opacity: 0.1;
    pointer-events: none;
    z-index: -1;
}

.crosshair {
    position: fixed;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 20px; height: 20px;
    pointer-events: none;
    z-index: -1;
}
.crosshair::before, .crosshair::after {
    content: ''; position: absolute; background: var(--text-dim);
}
.crosshair::before { top: 9px; left: 0; width: 100%; height: 2px; }
.crosshair::after { top: 0; left: 9px; width: 2px; height: 100%; }

/* --- Graph Container Styling --- */
.main-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4rem;
}

#gh {
    padding: 2rem !important;
    border: 1px solid #1a1a1a !important;
    position: relative;
    transition: all 0.5s ease;
}

/* Corner Brackets */
#gh::before, #gh::after {
    content: ''; position: absolute; width: 10px; height: 10px;
    border: 1px solid #fff; opacity: 0.5; transition: all 0.3s ease;
}
#gh::before { top: -1px; left: -1px; border-right: none; border-bottom: none; }
#gh::after { bottom: -1px; right: -1px; border-left: none; border-top: none; }

#gh:hover {
    border-color: #333 !important;
    box-shadow: 0 0 50px rgba(255, 255, 255, 0.05);
}

/* --- Footer --- */
.meta-info {
    font-size: 0.7rem; color: #333; display: flex; gap: 2rem;
}
.status-dot {
    width: 6px; height: 6px; background-color: #00ff00;
    border-radius: 50%; display: inline-block; margin-right: 8px;
    box-shadow: 0 0 10px #00ff00;
}
```

---

## Framework Integration

### React

The widget modifies the DOM directly, so you must use `useEffect` to initialize it after the component mounts.

```jsx
import { useEffect } from 'react';

const ContributionGraph = ({ username }) => {
  useEffect(() => {
    // Add CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://github-contribution-graph.netlify.app/assets/css/gh.css';
    document.head.appendChild(link);

    // Add Script
    const script = document.createElement('script');
    script.src = 'https://github-contribution-graph.netlify.app/assets/js/gh.js';
    script.async = true;
    script.onload = () => {
      // Render after script loads and DOM is ready
      if (window.renderGitHubWidget) {
        window.renderGitHubWidget();
      }
    };
    document.body.appendChild(script);

    return () => {
      // Cleanup on unmount
      document.head.removeChild(link);
      document.body.removeChild(script);
    };
  }, []);

  return <div id="gh" data-login={username}></div>;
};

export default ContributionGraph;
```

### Vue 3

```vue
<template>
  <div id="gh" :data-login="username"></div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';

const props = defineProps({
  username: String
});

let link, script;

onMounted(() => {
  // Add CSS
  link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://github-contribution-graph.netlify.app/assets/css/gh.css';
  document.head.appendChild(link);

  // Add Script
  script = document.createElement('script');
  script.src = 'https://github-contribution-graph.netlify.app/assets/js/gh.js';
  script.async = true;
  script.onload = () => {
    // Render after script loads and DOM is ready
    if (window.renderGitHubWidget) {
      window.renderGitHubWidget();
    }
  };
  document.body.appendChild(script);
});

onUnmounted(() => {
  if (link) document.head.removeChild(link);
  if (script) document.body.removeChild(script);
});
</script>
```

## API

The widget uses a serverless API to fetch contribution data:

```
GET https://github-contribution-graph.netlify.app/api/ghcg/fetch-data?login={username}
```

**Response:**
```json
{
  "user": {
    "avatarUrl": "https://avatars.githubusercontent.com/...",
    "contributionsCollection": {
      "contributionCalendar": {
        "totalContributions": 1234,
        "months": [...],
        "weeks": [...]
      }
    }
  }
}
```

---

## Self-Hosting

### Prerequisites

- Node.js 18+
- GitHub Personal Access Token ([create one](https://github.com/settings/tokens) with `read:user` scope)
- Netlify account (free tier works)

### Deploy Your Own

1. Fork this repository
2. Connect to [Netlify](https://app.netlify.com)
3. Add environment variable: `GITHUB_TOKEN` = your PAT
4. Deploy

### Local Development

```bash
npm install
echo "GITHUB_TOKEN=your_token" > .env
netlify dev
```

Open http://localhost:8888

---

## License

Apache 2.0
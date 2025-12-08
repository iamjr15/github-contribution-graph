# GitHub Contribution Graph Widget

A lightweight, customizable widget to embed your GitHub contribution graph on any website.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://github-contribution-graph.netlify.app)
[![Netlify Status](https://api.netlify.com/api/v1/badges/478cfe35-5d4d-4ec2-939b-b58e4de45ebe/deploy-status)](https://app.netlify.com/sites/github-contribution-graph/deploys)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue)](LICENSE)

![Preview](assets/media/thumbnail.png)

**[Live Demo](https://github-contribution-graph.netlify.app)** | **[GitHub Repo](https://github.com/iamjr15/github-contribution-graph)**

## Quick Start (Standard)

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

// 1. Import the CSS (or copy the contents to your CSS file)
// import './gh.css'; 

const ContributionGraph = ({ username }) => {
  useEffect(() => {
    // 2. Load the script dynamically
    const script = document.createElement('script');
    script.src = "https://github-contribution-graph.netlify.app/assets/js/gh.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    }
  }, []);

  return (
    <div className="main-container">
        {/* Your wrapper elements... */}
        <div id="gh" data-login={username}></div>
    </div>
  );
};

export default ContributionGraph;
```

### Vue 3

```vue
<template>
  <div class="main-container">
    <div id="gh" :data-login="username"></div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';

const props = defineProps({
  username: String
});

onMounted(() => {
  const script = document.createElement('script');
  script.src = "https://github-contribution-graph.netlify.app/assets/js/gh.js";
  script.async = true;
  document.body.appendChild(script);
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
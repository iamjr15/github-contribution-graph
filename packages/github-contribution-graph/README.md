# github-contribution-graph

A lightweight, customizable GitHub contribution graph widget for any website.

[![npm version](https://img.shields.io/npm/v/github-contribution-graph.svg)](https://npmjs.com/package/github-contribution-graph)
[![npm downloads](https://img.shields.io/npm/dm/github-contribution-graph.svg)](https://npmjs.com/package/github-contribution-graph)
[![License](https://img.shields.io/npm/l/github-contribution-graph.svg)](https://github.com/iamjr15/github-contribution-graph/blob/main/LICENSE)

## Installation

```bash
npm install github-contribution-graph
```

## Quick Start

### React

```tsx
import { GitHubContributionGraph } from 'github-contribution-graph/react';
import 'github-contribution-graph/styles.css';

function App() {
  return (
    <GitHubContributionGraph
      username="octocat"
      theme="midnight"
      onDataLoaded={(data) => console.log('Loaded!', data)}
    />
  );
}
```

### Vanilla JavaScript

```js
import { GitHubContributionWidget } from 'github-contribution-graph/vanilla';
import 'github-contribution-graph/styles.css';

const widget = new GitHubContributionWidget({
  username: 'octocat',
  container: '#my-graph',
  theme: 'void',
});

widget.render();
```

### Script Tag (CDN)

```html
<link rel="stylesheet" href="https://unpkg.com/github-contribution-graph/dist/gh.css">
<div id="gh"
     data-login="octocat"
     data-show-thumbnail="true"
     data-show-header="true"
     data-show-footer="true"></div>
<script src="https://unpkg.com/github-contribution-graph/dist/browser.global.js"></script>
```

#### Data Attributes

| Attribute | Default | Description |
|-----------|---------|-------------|
| `data-login` | required | GitHub username |
| `data-show-thumbnail` | `"true"` | Show/hide GitHub logo below graph |
| `data-show-header` | `"true"` | Show/hide contribution count header |
| `data-show-footer` | `"true"` | Show/hide legend footer |

## React API

### GitHubContributionGraph

```tsx
import { GitHubContributionGraph } from 'github-contribution-graph/react';

<GitHubContributionGraph
  username="octocat"           // Required: GitHub username
  apiEndpoint="..."            // Optional: Custom API endpoint
  theme="default"              // Optional: Theme preset or custom config
  showHeader={true}            // Optional: Show contribution count header
  showFooter={true}            // Optional: Show legend footer
  showThumbnail={true}         // Optional: Show GitHub attribution
  className="my-class"         // Optional: CSS class
  style={{ margin: 20 }}       // Optional: Inline styles
  onDataLoaded={(data) => {}}  // Optional: Callback when data loads
  onError={(error) => {}}      // Optional: Callback on error
  onLoading={(loading) => {}}  // Optional: Callback on loading state change
/>
```

### useContributionData Hook

```tsx
import { useContributionData } from 'github-contribution-graph/react';

function CustomGraph() {
  const { data, loading, error, refetch } = useContributionData('octocat', {
    apiEndpoint: 'https://custom-api.com', // Optional
    autoFetch: true,                        // Optional: default true
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <p>Total: {data?.contributionsCollection.contributionCalendar.totalContributions}</p>
      <button onClick={refetch}>Refresh</button>
    </div>
  );
}
```

## Vanilla JS API

### GitHubContributionWidget

```js
import { GitHubContributionWidget } from 'github-contribution-graph/vanilla';

const widget = new GitHubContributionWidget({
  username: 'octocat',           // Required: GitHub username
  container: '#my-graph',        // Optional: CSS selector or HTMLElement
  apiEndpoint: '...',            // Optional: Custom API endpoint
  theme: 'void',                 // Optional: Theme preset or custom config
  showHeader: true,              // Optional: Show contribution count header
  showFooter: true,              // Optional: Show legend footer
  showThumbnail: true,           // Optional: Show GitHub attribution
  onDataLoaded: (data) => {},    // Optional: Callback when data loads
  onError: (error) => {},        // Optional: Callback on error
});

// Methods
await widget.render();           // Render the widget
await widget.refresh();          // Refresh data and re-render
const data = widget.getData();   // Get current data
widget.destroy();                // Clear content
await widget.update({ ... });    // Update config and re-render
```

## Themes

Built-in theme presets:

- `default` - GitHub's default dark theme
- `void` - Pure black minimalist
- `slate` - Textured dark grey
- `midnight` - Deep indigo/purple
- `glacier` - Clean light theme
- `cyber` - Neon green matrix style

### Custom Theme

```js
const widget = new GitHubContributionWidget({
  username: 'octocat',
  theme: {
    bgColor: '#1a1a2e',
    textColor: '#eaeaea',
    cellLevel0: '#16213e',
    cellLevel1: '#0f3460',
    cellLevel2: '#533483',
    cellLevel3: '#e94560',
    cellLevel4: '#ff6b6b',
    borderColor: '#0f3460',
  },
});
```

## Self-Hosting the API

By default, the widget uses the hosted API at `github-contribution-graph.netlify.app`. To self-host:

1. Clone the repository
2. Deploy to Netlify (or similar)
3. Set `GITHUB_TOKEN` environment variable (needs `read:user` scope)
4. Use the `apiEndpoint` option to point to your deployment

## Browser Support

- Modern browsers (ES2020+)
- Node.js 18+

## License

Apache-2.0

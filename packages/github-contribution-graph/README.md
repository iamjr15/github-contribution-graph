# github-contrib-graph

A lightweight, customizable GitHub contribution graph widget for React, vanilla JavaScript, and plain HTML pages.

[![npm version](https://img.shields.io/npm/v/github-contrib-graph.svg)](https://npmjs.com/package/github-contrib-graph)
[![npm downloads](https://img.shields.io/npm/dm/github-contrib-graph.svg)](https://npmjs.com/package/github-contrib-graph)
[![License](https://img.shields.io/npm/l/github-contrib-graph.svg)](https://github.com/iamjr15/github-contribution-graph/blob/main/LICENSE)

> Package name: `github-contrib-graph`.
> Repository name: `github-contribution-graph`.
> The npm package named `github-contribution-graph` is a different package.

## Features

- React component and data-fetching hook
- Vanilla JavaScript widget class
- Script-tag browser bundle for static sites
- Built-in dark and light themes
- Custom theming through CSS variables
- Optional header, footer legend, and GitHub attribution
- Hosted API by default, with support for your own API endpoint
- TypeScript definitions for all public APIs

## Installation

```bash
npm install github-contrib-graph
```

## Quick Start

### React

```tsx
import { GitHubContributionGraph } from 'github-contrib-graph/react';
import 'github-contrib-graph/styles.css';

export function ProfileActivity() {
  return (
    <GitHubContributionGraph
      username="octocat"
      theme="midnight"
      onDataLoaded={(data) => {
        console.log(data.contributionsCollection.contributionCalendar.totalContributions);
      }}
    />
  );
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

await widget.render();
```

```html
<div id="my-graph"></div>
```

### Script Tag

Use this when you do not have a bundler.

```html
<link rel="stylesheet" href="https://unpkg.com/github-contrib-graph@latest/dist/gh.css">

<div
  id="gh"
  data-login="octocat"
  data-show-thumbnail="true"
  data-show-header="true"
  data-show-footer="true"
></div>

<script src="https://unpkg.com/github-contrib-graph@latest/dist/browser.global.js"></script>
```

For production pages, pin a version instead of using `@latest`:

```html
<link rel="stylesheet" href="https://unpkg.com/github-contrib-graph@3.1.1/dist/gh.css">
<script src="https://unpkg.com/github-contrib-graph@3.1.1/dist/browser.global.js"></script>
```

The browser bundle auto-renders an element with `id="gh"` and `data-login`. It also exposes `window.renderGitHubWidget()` for manual re-rendering after you change `data-login`.

## Data Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `data-login` | required | GitHub username to render |
| `data-show-thumbnail` | `"true"` | Show or hide the GitHub attribution icon |
| `data-show-header` | `"true"` | Show or hide the contribution total and avatar |
| `data-show-footer` | `"true"` | Show or hide the Less/More legend |

## React API

```tsx
import { GitHubContributionGraph } from 'github-contrib-graph/react';

<GitHubContributionGraph
  username="octocat"
  apiEndpoint="https://your-domain.com/api/ghcg/fetch-data"
  theme="default"
  showHeader={true}
  showFooter={true}
  showThumbnail={true}
  className="my-graph"
  style={{ margin: 20 }}
  onDataLoaded={(data) => {}}
  onError={(error) => {}}
  onLoading={(isLoading) => {}}
/>;
```

### `useContributionData`

```tsx
import { useContributionData } from 'github-contrib-graph/react';

function TotalContributions() {
  const { data, loading, error, refetch } = useContributionData('octocat', {
    autoFetch: true,
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    <button onClick={refetch}>
      {data?.contributionsCollection.contributionCalendar.totalContributions}
    </button>
  );
}
```

## Vanilla API

```js
import { GitHubContributionWidget } from 'github-contrib-graph/vanilla';

const widget = new GitHubContributionWidget({
  username: 'octocat',
  container: '#my-graph',
  apiEndpoint: 'https://your-domain.com/api/ghcg/fetch-data',
  theme: 'void',
  showHeader: true,
  showFooter: true,
  showThumbnail: true,
  onDataLoaded: (data) => {},
  onError: (error) => {},
});

await widget.render();
await widget.refresh();
const data = widget.getData();
widget.destroy();
await widget.update({ username: 'another-user' });
```

## Themes

Built-in presets:

- `default`
- `void`
- `slate`
- `midnight`
- `glacier`
- `cyber`

Pass a preset name:

```tsx
<GitHubContributionGraph username="octocat" theme="cyber" />
```

Or pass a custom theme object:

```js
const widget = new GitHubContributionWidget({
  username: 'octocat',
  theme: {
    bgColor: '#111111',
    textColor: '#eeeeee',
    cellLevel0: '#222222',
    cellLevel1: '#0e4429',
    cellLevel2: '#006d32',
    cellLevel3: '#26a641',
    cellLevel4: '#39d353',
    borderColor: '#333333',
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  },
});
```

You can also override CSS variables directly on the widget root:

```css
.my-graph {
  --gh-bg-color: #000000;
  --gh-text-default-color: #ffffff;
  --gh-cell-level0-color: #111111;
  --gh-border-card-color: #333333;
  --gh-font-default-family: ui-monospace, SFMono-Regular, Menlo, monospace;
}
```

The rendered root receives the `ghContributionGraph` class, so styles work even when your container is not `#gh`.

## API Endpoint

By default, the package fetches contribution data from:

```text
https://githubgraph.jigyansurout.com/api/ghcg/fetch-data?login={username}
```

The response shape matches the GitHub GraphQL contribution calendar:

```json
{
  "user": {
    "avatarUrl": "https://avatars.githubusercontent.com/...",
    "contributionsCollection": {
      "contributionCalendar": {
        "totalContributions": 1234,
        "months": [],
        "weeks": []
      }
    }
  }
}
```

Use `apiEndpoint` if you want to run your own backend.

## Self-Hosting

This repository includes a Cloudflare Pages Functions backend at `functions/api/ghcg/fetch-data.js`.

1. Fork or clone the repository.
2. Create a GitHub personal access token with enough access to read the contribution calendar you want to show.
3. Add `GITHUB_TOKEN` to your Cloudflare Pages environment variables.
4. Use `npm run build` as the build command.
5. Use `cf-dist` as the Pages output directory.
6. Deploy with the repository root as the project root so Cloudflare can discover `functions/`.
7. Pass your endpoint to the widget:

```tsx
<GitHubContributionGraph
  username="octocat"
  apiEndpoint="https://your-domain.com/api/ghcg/fetch-data"
/>
```

Local development:

```bash
npm install
echo "GITHUB_TOKEN=your_token" > .env
npm run build
npm run dev
```

## Troubleshooting

- Use `github-contrib-graph`, not `github-contribution-graph`, when installing from npm.
- For script-tag usage, place the `<script>` after the graph container or call `window.renderGitHubWidget()` after adding the container.
- Make sure `data-login` or `username` is a valid GitHub username.
- If you self-host, confirm your API returns `{ "user": ... }` and includes CORS headers for browser usage.
- If private contributions are missing, check the permissions and visibility available to your GitHub token.

## Browser Support

- Modern browsers with ES2020 support
- Node.js 18+

## License

Apache-2.0

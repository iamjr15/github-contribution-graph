# GitHub Contribution Graph Widget

A lightweight, customizable widget to embed your GitHub contribution graph on any website.

[![npm version](https://img.shields.io/npm/v/github-contrib-graph.svg)](https://npmjs.com/package/github-contrib-graph)
[![npm downloads](https://img.shields.io/npm/dm/github-contrib-graph.svg)](https://npmjs.com/package/github-contrib-graph)
[![CI](https://github.com/iamjr15/github-contribution-graph/actions/workflows/ci.yml/badge.svg)](https://github.com/iamjr15/github-contribution-graph/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue)](LICENSE)

<p align="center">
  <a href="https://githubgraph.jigyansurout.com"><strong>Live Demo</strong></a> ·
  <a href="https://github.com/iamjr15/github-contribution-graph"><strong>GitHub Repo</strong></a> ·
  <a href="https://npmjs.com/package/github-contrib-graph"><strong>npm Package</strong></a>
</p>

> Package name: `github-contrib-graph`.
> Repository name: `github-contribution-graph`.
> The npm package named `github-contribution-graph` is a different package.

## What Is Inside

- `packages/github-contribution-graph`: npm package source for React, vanilla JS, and script-tag usage
- `functions/api/ghcg/fetch-data.js`: Cloudflare Pages Function that fetches contribution data from GitHub GraphQL
- `assets/` and `index.html`: live demo site
- `scripts/build-cf-dist.sh`: builds the Cloudflare Pages static output and syncs demo assets from the npm package build

## Install

```bash
npm install github-contrib-graph
```

## React

```tsx
import { GitHubContributionGraph } from 'github-contrib-graph/react';
import 'github-contrib-graph/styles.css';

export function ProfileActivity() {
  return <GitHubContributionGraph username="octocat" theme="midnight" />;
}
```

## Vanilla JavaScript

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

## Script Tag

```html
<link rel="stylesheet" href="https://unpkg.com/github-contrib-graph@latest/dist/gh.css">

<div id="gh" data-login="octocat"></div>

<script src="https://unpkg.com/github-contrib-graph@latest/dist/browser.global.js"></script>
```

For production, pin a version:

```html
<link rel="stylesheet" href="https://unpkg.com/github-contrib-graph@3.1.1/dist/gh.css">
<script src="https://unpkg.com/github-contrib-graph@3.1.1/dist/browser.global.js"></script>
```

The browser bundle automatically renders an element with `id="gh"` and `data-login`.

## Data Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `data-login` | required | GitHub username to render |
| `data-show-thumbnail` | `"true"` | Show or hide the GitHub attribution icon |
| `data-show-header` | `"true"` | Show or hide the contribution total and avatar |
| `data-show-footer` | `"true"` | Show or hide the Less/More legend |

## Themes

Built-in presets:

- `default`
- `void`
- `slate`
- `midnight`
- `glacier`
- `cyber`

Custom CSS variables can be set on the widget root:

```css
.my-graph {
  --gh-bg-color: #000000;
  --gh-text-default-color: #ffffff;
  --gh-cell-level0-color: #111111;
  --gh-border-card-color: #333333;
  --gh-font-default-family: ui-monospace, SFMono-Regular, Menlo, monospace;
}
```

The rendered root receives the `ghContributionGraph` class, so styles work for any container, not only `#gh`.

## Customization

You can customize the default renderer without forking it:

```tsx
<GitHubContributionGraph
  username="octocat"
  theme={{
    bgColor: '#080c10',
    textColor: '#f4f7fb',
    cellLevel0: '#18202a',
    cellLevel1: '#163b2a',
    cellLevel2: '#196c3d',
    cellLevel3: '#32a852',
    cellLevel4: '#7ee787',
    cellSize: 13,
    cellGap: 4,
    cellRadius: 4,
    cardRadius: 10,
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
  }}
  dayLabels={['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']}
  footerLabels={{ less: 'Quiet', more: 'Busy' }}
  classNames={{
    root: 'activity',
    card: 'activity__card',
    dayCell: 'activity__day',
    tooltip: 'activity__tooltip',
  }}
  dayClassName={({ day }) =>
    day.contributionCount >= 10 ? 'activity__day--hot' : undefined
  }
  dayStyle={({ day }) => ({
    opacity: day.contributionCount === 0 ? '0.35' : '1',
  })}
  dayAttributes={({ day }) => ({
    'aria-label': `${day.contributionCount} contributions on ${day.date}`,
  })}
  tooltipFormatter={({ day, date }) =>
    `${day.contributionCount} contributions on ${date.toLocaleDateString()}`
  }
/>
```

For deeper control, the package also supports DOM render hooks for the header, footer, thumbnail, and day-cell contents. React users can pass a `render` prop to bypass the default DOM renderer and render the calendar from raw contribution data with JSX.

## API

The hosted default endpoint is:

```text
GET https://githubgraph.jigyansurout.com/api/ghcg/fetch-data?login={username}
```

Use `apiEndpoint` to point the widget at your own deployment:

```tsx
<GitHubContributionGraph
  username="octocat"
  apiEndpoint="https://your-domain.com/api/ghcg/fetch-data"
/>
```

## Self-Hosting On Cloudflare Pages

This repo is set up for Cloudflare Pages Functions.

1. Fork or clone the repository.
2. Create a GitHub personal access token with enough access to read the contribution calendar you want to show.
3. Add `GITHUB_TOKEN` to your Cloudflare Pages environment variables.
4. Set the build command to `npm run build`.
5. Set the output directory to `cf-dist`.
6. Deploy with the repository root as the project root so Cloudflare can discover `functions/`.

Local development:

```bash
npm install
echo "GITHUB_TOKEN=your_token" > .env
npm run build
npm run dev
```

## Package Development

```bash
npm install
npm run test -w packages/github-contribution-graph
npm run typecheck -w packages/github-contribution-graph
npm run build
```

`npm run build` builds the npm package and then copies `dist/browser.global.js` and `dist/gh.css` into the live demo assets before creating `cf-dist`.

## Troubleshooting

- Install `github-contrib-graph`, not `github-contribution-graph`.
- For script-tag usage, place the script after the graph container or call `window.renderGitHubWidget()` after adding the container.
- Make sure `data-login` or `username` is a valid GitHub username.
- If you self-host, confirm your function returns `{ "user": ... }` and sends CORS headers.
- If private contributions are missing, check the permissions and visibility available to your GitHub token.

See the [package README](packages/github-contribution-graph/README.md) for the full API reference.

## License

Apache-2.0

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
- Custom theming through props or CSS variables
- Class hooks for every major rendered element
- Per-day class, style, attribute, tooltip, and content render hooks
- Replaceable header, footer legend, and GitHub attribution
- Fully custom React rendering when you only want the package to fetch data
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
  showMonthLabels={true}
  showWeekdayLabels={true}
  showTooltips={true}
  dayLabels={['', 'Mon', '', 'Wed', '', 'Fri', '']}
  footerLabels={{ less: 'Less', more: 'More' }}
  classNames={{ root: 'my-graph-root', dayCell: 'my-day-cell' }}
  dayClassName={({ day }) => (day.contributionCount > 0 ? 'has-activity' : '')}
  dayStyle={({ day }) => ({
    opacity: day.contributionCount === 0 ? '0.45' : '1',
  })}
  dayAttributes={({ day }) => ({
    'aria-label': `${day.contributionCount} contributions on ${day.date}`,
  })}
  tooltipFormatter={({ day, date }) =>
    `${day.contributionCount} contributions on ${date.toLocaleDateString()}`
  }
  monthLabelFormatter={(month) => month.name.slice(0, 3)}
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
  showMonthLabels: true,
  showWeekdayLabels: true,
  showTooltips: true,
  classNames: {
    root: 'profile-graph',
    dayCell: 'profile-graph__day',
  },
  dayStyle: ({ day }) => ({
    transform: day.contributionCount > 20 ? 'scale(1.15)' : 'scale(1)',
  }),
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

## Customization

The package has layered customization. You can use only the built-in presets, override the default DOM with class and render hooks, or skip the default DOM entirely in React and render your own calendar from the fetched data.

### Theme Object

Every theme key can be passed through the `theme` prop or config option. String values are used as-is. Numeric values are converted to `px`.

```tsx
<GitHubContributionGraph
  username="octocat"
  theme={{
    bgColor: '#080c10',
    textColor: '#f4f7fb',
    inactiveTextColor: '#7d8794',
    linkHoverColor: '#8ab4ff',
    cellLevel0: '#18202a',
    cellLevel1: '#163b2a',
    cellLevel2: '#196c3d',
    cellLevel3: '#32a852',
    cellLevel4: '#7ee787',
    cellSize: 13,
    cellGap: 4,
    cellRadius: 4,
    cellBorderColor: 'rgba(255,255,255,0.08)',
    cellOutlineColor: 'transparent',
    tooltipBgColor: '#f4f7fb',
    tooltipTextColor: '#080c10',
    tooltipPadding: '8px 10px',
    tooltipRadius: 8,
    tooltipFontSize: 12,
    borderColor: '#27313d',
    borderWidth: 1,
    cardPadding: 18,
    cardPaddingBlock: 10,
    cardRadius: 10,
    canvasPaddingTop: 8,
    canvasMarginInline: 12,
    headerHeight: 28,
    headerMarginBottom: 8,
    headerFontSize: 14,
    avatarSize: 24,
    footerPadding: '8px 32px',
    footerFontSize: 12,
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
  }}
/>
```

The matching CSS variables are:

| Theme key | CSS variable |
| --- | --- |
| `bgColor` | `--gh-bg-color` |
| `textColor` | `--gh-text-default-color` |
| `inactiveTextColor` | `--gh-text-inactive-color` |
| `linkHoverColor` | `--gh-link-hover-color` |
| `cellLevel0` - `cellLevel4` | `--gh-cell-level0-color` - `--gh-cell-level4-color` |
| `cellSize` | `--gh-cell-size` |
| `cellGap` | `--gh-cell-gap` |
| `cellRadius` | `--gh-cell-radius` |
| `cellBorderColor` | `--gh-cell-border-color` |
| `cellOutlineColor` | `--gh-cell-outline-color` |
| `tooltipBgColor` | `--gh-cell-info-bg-color` |
| `tooltipTextColor` | `--gh-tooltip-text-color` |
| `tooltipPadding` | `--gh-tooltip-padding` |
| `tooltipRadius` | `--gh-tooltip-radius` |
| `tooltipFontSize` | `--gh-tooltip-font-size` |
| `borderColor` | `--gh-border-card-color` |
| `borderWidth` | `--gh-border-card-width` |
| `cardPadding` | `--gh-card-padding` |
| `cardPaddingBlock` | `--gh-card-padding-block` |
| `cardRadius` | `--gh-card-radius` |
| `canvasPaddingTop` | `--gh-canvas-padding-top` |
| `canvasMarginInline` | `--gh-canvas-margin-inline` |
| `headerHeight` | `--gh-header-height` |
| `headerMarginBottom` | `--gh-header-margin-bottom` |
| `headerFontSize` | `--gh-header-font-size` |
| `avatarSize` | `--gh-avatar-size` |
| `footerPadding` | `--gh-footer-padding` |
| `footerFontSize` | `--gh-footer-font-size` |
| `fontFamily` | `--gh-font-default-family` |

### Labels, Tooltips, Classes, And Cells

```tsx
<GitHubContributionGraph
  username="octocat"
  showMonthLabels
  showWeekdayLabels
  showTooltips
  dayLabels={['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']}
  footerLabels={{ less: 'Quiet', more: 'Busy' }}
  classNames={{
    root: 'activity',
    header: 'activity__header',
    total: 'activity__total',
    profile: 'activity__profile',
    profileLink: 'activity__profile-link',
    avatar: 'activity__avatar',
    card: 'activity__card',
    canvas: 'activity__canvas',
    table: 'activity__table',
    monthLabel: 'activity__month',
    dayLabel: 'activity__weekday',
    dayCell: 'activity__day',
    tooltip: 'activity__tooltip',
    footer: 'activity__footer',
    footerLegend: 'activity__legend',
    thumbnail: 'activity__thumbnail',
    thumbnailLink: 'activity__thumbnail-link',
  }}
  dayClassName={({ day }) =>
    day.contributionCount >= 10 ? 'activity__day--hot' : undefined
  }
  dayStyle={({ day }) => ({
    opacity: day.contributionCount === 0 ? '0.35' : '1',
    borderRadius: day.contributionCount >= 10 ? 6 : 2,
  })}
  dayAttributes={({ day }) => ({
    'aria-label': `${day.contributionCount} contributions on ${day.date}`,
    'data-busy': day.contributionCount >= 10,
  })}
  tooltipFormatter={({ day, date, username }) =>
    `${username} made ${day.contributionCount} contributions on ${date.toLocaleDateString()}`
  }
  monthLabelFormatter={(month) => month.name.toUpperCase()}
/>
```

Every day cell also receives these default attributes, which makes CSS-only custom designs straightforward:

```css
.activity__day[data-level='FOURTH_QUARTILE'] {
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--gh-cell-level4-color), white 20%);
}

.activity__day[data-count='0'] {
  opacity: 0.4;
}
```

### Replace Individual Sections

The default renderer can replace the header, footer, thumbnail, or the contents inside each day cell. These hooks return DOM nodes or strings.

```ts
const widget = new GitHubContributionWidget({
  username: 'octocat',
  container: '#my-graph',
  renderHeader: ({ username, totalContributions, user }) => {
    const header = document.createElement('header');
    header.className = 'activity-header';

    const avatar = document.createElement('img');
    avatar.src = user.avatarUrl;
    avatar.alt = `${username}'s avatar`;

    const name = document.createElement('strong');
    name.textContent = username;

    const total = document.createElement('span');
    total.textContent = `${totalContributions.toLocaleString()} contributions`;

    header.append(avatar, name, total);
    return header;
  },
  renderDayContents: ({ day }) => {
    const dot = document.createElement('span');
    dot.className = 'activity-dot';
    dot.textContent = day.contributionCount > 0 ? String(day.contributionCount) : '';
    return dot;
  },
  renderFooter: ({ labels }) => {
    const footer = document.createElement('footer');
    footer.textContent = `${labels.less} / ${labels.more}`;
    return footer;
  },
  renderThumbnail: () => null,
});
```

When using the React component, `renderHeader`, `renderFooter`, `renderThumbnail`, and `renderDayContents` still belong to the default DOM renderer, so they return DOM nodes. Use the React `render` prop if you want JSX-level control.

### Fully Custom React Render

The `render` prop lets React users use the package only for fetching and state management. You receive the raw GitHub contribution calendar and can render every pixel yourself.

```tsx
<GitHubContributionGraph
  username="octocat"
  render={({ data, loading, error, refresh }) => {
    if (loading) return <p>Loading activity...</p>;
    if (error) return <button onClick={refresh}>Retry</button>;

    const calendar = data?.contributionsCollection.contributionCalendar;

    return (
      <section className="activity-board">
        <strong>{calendar?.totalContributions.toLocaleString()} contributions</strong>
        <div className="activity-grid">
          {calendar?.weeks.flatMap((week) =>
            week.contributionDays.map((day) => (
              <span
                key={day.date}
                className="activity-cell"
                data-level={day.contributionLevel}
                title={`${day.contributionCount} on ${day.date}`}
              />
            ))
          )}
        </div>
      </section>
    );
  }}
/>
```

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

# Changelog

All notable changes to this project will be documented in this file.

## [3.1.1] - 2026-05-04

### Added

- Expanded theme configuration to cover sizing, spacing, radius, borders, text colors, tooltips, header, footer, canvas, and avatar styles.
- Added class hooks for major widget elements through `classNames`.
- Added label, tooltip, per-day class, per-day style, per-day attribute, and day-content render hooks for the default renderer.
- Added DOM render hooks for the header, footer, and thumbnail.
- Added a React `render` prop for fully custom JSX rendering with the package-managed loading, error, refresh, and fetched data state.
- Added custom loading and error fallback support for the React component.

### Fixed

- Corrected package documentation to use the published `github-contrib-graph` npm name.
- Added a stable `ghContributionGraph` root class so styles work outside `#gh`.
- Fixed generated theme CSS variable names from `getThemeCSS`.
- Preserved existing query parameters when building custom API endpoint URLs.
- Synced Cloudflare demo assets from the package build output.

## [3.0.1] - 2024-12-09

### Fixed

- Updated changelog documentation

## [3.0.0] - 2024-12-09

### Added

- Initial release
- React component (`GitHubContributionGraph`)
- React hook (`useContributionData`)
- Vanilla JS widget class (`GitHubContributionWidget`)
- Browser bundle for script tag usage
- 6 built-in theme presets (default, void, slate, midnight, glacier, cyber)
- Custom theme support via CSS variables
- TypeScript type definitions
- Configurable API endpoint
- Optional header, footer, and thumbnail display

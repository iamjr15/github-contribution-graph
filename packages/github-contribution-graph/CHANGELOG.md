# Changelog

All notable changes to this project will be documented in this file.

## [3.1.1] - 2026-05-04

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

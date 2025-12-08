// Vanilla JS exports
export { GitHubContributionWidget } from './widget';
export { applyTheme, getThemePresets, getThemeCSS } from '../styles/themes';

// Re-export core utilities that might be useful
export { fetchContributionData } from '../core/api';
export { renderWidget } from '../core/renderer';
export { DEFAULT_API_ENDPOINT, THEME_PRESETS } from '../core/constants';

// Re-export types
export type {
  GitHubContributionGraphConfig,
  GitHubUser,
  ContributionCalendar,
  ContributionDay,
  ContributionWeek,
  ContributionMonth,
  ThemeConfig,
  ThemePreset,
  RenderOptions,
} from '../core/types';

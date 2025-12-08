// React exports
export {
  GitHubContributionGraph,
  type GitHubContributionGraphProps,
  type GitHubContributionGraphRef,
} from './GitHubContributionGraph';

export {
  useContributionData,
  type UseContributionDataOptions,
  type UseContributionDataResult,
} from './useContributionData';

// Re-export useful utilities
export { applyTheme, getThemePresets, getThemeCSS } from '../styles/themes';
export { fetchContributionData } from '../core/api';
export { DEFAULT_API_ENDPOINT, THEME_PRESETS } from '../core/constants';

// Re-export types
export type {
  GitHubUser,
  ContributionCalendar,
  ContributionDay,
  ContributionWeek,
  ContributionMonth,
  ThemeConfig,
  ThemePreset,
} from '../core/types';

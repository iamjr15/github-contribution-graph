import type { ContributionLevel, ThemeConfig, ThemePreset } from './types';

/**
 * Default API endpoint for fetching contribution data
 */
export const DEFAULT_API_ENDPOINT = 'https://githubgraph.jigyansurout.com/api/ghcg/fetch-data';

/**
 * Repository URL for the widget
 */
export const REPO_URL = 'https://github.com/iamjr15/github-contribution-graph';

/**
 * Contribution level values in order
 */
export const CONTRIBUTION_LEVELS: ContributionLevel[] = [
  'NONE',
  'FIRST_QUARTILE',
  'SECOND_QUARTILE',
  'THIRD_QUARTILE',
  'FOURTH_QUARTILE',
];

/**
 * Day labels for the calendar rows
 */
export const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

/**
 * Theme presets with CSS variable values
 */
export const THEME_PRESETS: Record<ThemePreset, ThemeConfig> = {
  default: {
    bgColor: '#0d1117',
    textColor: '#e6edf3',
    cellLevel0: '#21262d',
    cellLevel1: '#0e4429',
    cellLevel2: '#006d32',
    cellLevel3: '#26a641',
    cellLevel4: '#39d353',
    borderColor: '#30363d',
  },
  void: {
    bgColor: '#000000',
    textColor: '#ffffff',
    cellLevel0: '#111111',
    borderColor: '#333333',
  },
  slate: {
    bgColor: '#141414',
    textColor: '#eeeeee',
    cellLevel0: '#222222',
    borderColor: '#333333',
  },
  midnight: {
    bgColor: '#0f1016',
    textColor: '#f1f5f9',
    cellLevel0: '#1e202e',
    borderColor: '#2d2a45',
  },
  glacier: {
    bgColor: '#ffffff',
    textColor: '#334155',
    cellLevel0: '#f1f5f9',
    borderColor: '#e2e8f0',
  },
  cyber: {
    bgColor: '#000000',
    textColor: '#00ff41',
    cellLevel0: '#001a00',
    borderColor: '#003b00',
  },
};

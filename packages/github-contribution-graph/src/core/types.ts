/**
 * Contribution level indicating activity intensity
 */
export type ContributionLevel =
  | 'NONE'
  | 'FIRST_QUARTILE'
  | 'SECOND_QUARTILE'
  | 'THIRD_QUARTILE'
  | 'FOURTH_QUARTILE';

/**
 * A single day's contribution data
 */
export interface ContributionDay {
  date: string;
  contributionCount: number;
  contributionLevel: ContributionLevel;
  weekday: number;
}

/**
 * A week of contribution data
 */
export interface ContributionWeek {
  contributionDays: ContributionDay[];
}

/**
 * A month label in the calendar
 */
export interface ContributionMonth {
  name: string;
  totalWeeks: number;
}

/**
 * The full contribution calendar data
 */
export interface ContributionCalendar {
  totalContributions: number;
  months: ContributionMonth[];
  weeks: ContributionWeek[];
}

/**
 * GitHub user data from API response
 */
export interface GitHubUser {
  avatarUrl: string;
  contributionsCollection: {
    contributionCalendar: ContributionCalendar;
  };
}

/**
 * API response structure
 */
export interface APIResponse {
  user: GitHubUser | null;
  error?: string;
}

/**
 * Available theme presets
 */
export type ThemePreset = 'default' | 'void' | 'slate' | 'midnight' | 'glacier' | 'cyber';

/**
 * Custom theme configuration
 */
export interface ThemeConfig {
  bgColor?: string;
  textColor?: string;
  cellLevel0?: string;
  cellLevel1?: string;
  cellLevel2?: string;
  cellLevel3?: string;
  cellLevel4?: string;
  borderColor?: string;
  fontFamily?: string;
}

/**
 * Widget render options
 */
export interface RenderOptions {
  showHeader?: boolean;
  showFooter?: boolean;
  showThumbnail?: boolean;
}

/**
 * Configuration for the widget
 */
export interface GitHubContributionGraphConfig extends RenderOptions {
  username: string;
  apiEndpoint?: string;
  container?: string | HTMLElement;
  theme?: ThemePreset | ThemeConfig;
  onDataLoaded?: (data: GitHubUser) => void;
  onError?: (error: Error) => void;
}

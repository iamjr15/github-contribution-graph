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
 * CSS custom property value. Numbers are converted to px when applied as a theme.
 */
export type CSSValue = string | number;

/**
 * Available theme presets
 */
export type ThemePreset = 'default' | 'void' | 'slate' | 'midnight' | 'glacier' | 'cyber';

/**
 * Custom theme configuration
 */
export interface ThemeConfig {
  bgColor?: CSSValue;
  textColor?: CSSValue;
  inactiveTextColor?: CSSValue;
  linkHoverColor?: CSSValue;
  cellLevel0?: CSSValue;
  cellLevel1?: CSSValue;
  cellLevel2?: CSSValue;
  cellLevel3?: CSSValue;
  cellLevel4?: CSSValue;
  cellSize?: CSSValue;
  cellGap?: CSSValue;
  cellRadius?: CSSValue;
  cellBorderColor?: CSSValue;
  cellOutlineColor?: CSSValue;
  tooltipBgColor?: CSSValue;
  tooltipTextColor?: CSSValue;
  tooltipPadding?: CSSValue;
  tooltipRadius?: CSSValue;
  tooltipFontSize?: CSSValue;
  borderColor?: CSSValue;
  borderWidth?: CSSValue;
  cardPadding?: CSSValue;
  cardPaddingBlock?: CSSValue;
  cardRadius?: CSSValue;
  canvasPaddingTop?: CSSValue;
  canvasMarginInline?: CSSValue;
  headerHeight?: CSSValue;
  headerMarginBottom?: CSSValue;
  headerFontSize?: CSSValue;
  avatarSize?: CSSValue;
  footerPadding?: CSSValue;
  footerFontSize?: CSSValue;
  fontFamily?: CSSValue;
}

/**
 * Class hooks for styling or targeting rendered widget elements.
 */
export interface CalendarClassNames {
  root?: string;
  header?: string;
  total?: string;
  profile?: string;
  profileLink?: string;
  avatar?: string;
  card?: string;
  canvas?: string;
  table?: string;
  monthLabel?: string;
  dayLabel?: string;
  dayCell?: string;
  tooltip?: string;
  footer?: string;
  footerLegend?: string;
  thumbnail?: string;
  thumbnailLink?: string;
}

export interface DayRenderContext {
  day: ContributionDay;
  week: ContributionWeek;
  weekIndex: number;
  dayIndex: number;
  date: Date;
  username: string;
}

export interface HeaderRenderContext {
  user: GitHubUser;
  username: string;
  totalContributions: number;
}

export interface FooterRenderContext {
  levels: ContributionLevel[];
  labels: Required<FooterLabels>;
}

export interface ThumbnailRenderContext {
  repoUrl: string;
}

export interface FooterLabels {
  less?: string;
  more?: string;
}

/**
 * Inline style map for contribution day cells. Numeric values are converted to px.
 */
export type DayStyle = Record<string, CSSValue | null | undefined>;

/**
 * Widget render options
 */
export interface RenderOptions {
  showHeader?: boolean;
  showFooter?: boolean;
  showThumbnail?: boolean;
  showMonthLabels?: boolean;
  showWeekdayLabels?: boolean;
  showTooltips?: boolean;
  dayLabels?: string[];
  footerLabels?: FooterLabels;
  classNames?: CalendarClassNames;
  dayClassName?: string | ((context: DayRenderContext) => string | null | undefined | false);
  dayStyle?: DayStyle | ((context: DayRenderContext) => DayStyle | null | undefined);
  dayAttributes?: (
    context: DayRenderContext
  ) => Record<string, string | number | boolean | null | undefined> | null | undefined;
  tooltipFormatter?: (context: DayRenderContext) => string;
  monthLabelFormatter?: (
    month: ContributionMonth,
    index: number,
    months: ContributionMonth[]
  ) => string;
  renderDayContents?: (context: DayRenderContext) => Node | string | null | undefined;
  renderHeader?: (context: HeaderRenderContext) => HTMLElement | null | undefined;
  renderFooter?: (context: FooterRenderContext) => HTMLElement | null | undefined;
  renderThumbnail?: (context: ThumbnailRenderContext) => HTMLElement | null | undefined;
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

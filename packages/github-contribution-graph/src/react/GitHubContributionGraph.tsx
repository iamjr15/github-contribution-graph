import React, {
  useRef,
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { fetchContributionData } from '../core/api';
import { ROOT_CLASS } from '../core/constants';
import { renderWidget } from '../core/renderer';
import { applyTheme } from '../styles/themes';
import type { GitHubUser, ThemePreset, ThemeConfig, RenderOptions } from '../core/types';

export interface GitHubContributionGraphRenderState {
  username: string;
  data: GitHubUser | null;
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

export interface GitHubContributionGraphProps extends RenderOptions {
  /**
   * GitHub username to display contributions for
   */
  username: string;
  /**
   * Custom API endpoint for fetching data
   */
  apiEndpoint?: string;
  /**
   * Theme preset name or custom theme configuration
   */
  theme?: ThemePreset | ThemeConfig;
  /**
   * Whether to show the header with total contributions
   * @default true
   */
  showHeader?: boolean;
  /**
   * Whether to show the footer legend
   * @default true
   */
  showFooter?: boolean;
  /**
   * Whether to show the GitHub thumbnail/attribution
   * @default true
   */
  showThumbnail?: boolean;
  /**
   * Additional CSS class name
   */
  className?: string;
  /**
   * Inline styles
   */
  style?: React.CSSProperties;
  /**
   * Callback when data is successfully loaded
   */
  onDataLoaded?: (data: GitHubUser) => void;
  /**
   * Callback when an error occurs
   */
  onError?: (error: Error) => void;
  /**
   * Callback when loading state changes
   */
  onLoading?: (isLoading: boolean) => void;
  /**
   * Fully custom React renderer. When provided, the package only fetches data
   * and lets you render every pixel yourself.
   */
  render?: (state: GitHubContributionGraphRenderState) => React.ReactNode;
  /**
   * Optional custom loading UI for the default renderer path
   */
  loadingFallback?: React.ReactNode;
  /**
   * Optional custom error UI for the default renderer path
   */
  errorFallback?: React.ReactNode | ((error: Error) => React.ReactNode);
}

export interface GitHubContributionGraphRef {
  /**
   * Manually refresh the contribution data
   */
  refresh: () => Promise<void>;
  /**
   * Get the currently loaded data
   */
  getData: () => GitHubUser | null;
}

/**
 * React component for displaying GitHub contribution graphs
 *
 * @example
 * ```tsx
 * import { GitHubContributionGraph } from 'github-contrib-graph/react';
 * import 'github-contrib-graph/styles.css';
 *
 * function App() {
 *   return (
 *     <GitHubContributionGraph
 *       username="octocat"
 *       theme="midnight"
 *       onDataLoaded={(data) => console.log('Loaded!', data)}
 *     />
 *   );
 * }
 * ```
 */
export const GitHubContributionGraph = forwardRef<
  GitHubContributionGraphRef,
  GitHubContributionGraphProps
>((props, ref) => {
  const {
    username,
    apiEndpoint,
    theme = 'default',
    showHeader = true,
    showFooter = true,
    showThumbnail = true,
    showMonthLabels,
    showWeekdayLabels,
    showTooltips,
    dayLabels,
    footerLabels,
    classNames,
    dayClassName,
    dayStyle,
    dayAttributes,
    tooltipFormatter,
    monthLabelFormatter,
    renderDayContents,
    renderHeader,
    renderFooter,
    renderThumbnail,
    className,
    style,
    onDataLoaded,
    onError,
    onLoading,
    render: customRender,
    loadingFallback,
    errorFallback,
  } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const rootClassName = [ROOT_CLASS, classNames?.root, className].filter(Boolean).join(' ');
  const [data, setData] = useState<GitHubUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    if (!username) {
      setError(new Error('Username is required'));
      setLoading(false);
      return;
    }

    setLoading(true);
    onLoading?.(true);
    setError(null);

    try {
      const userData = await fetchContributionData(username, apiEndpoint);
      setData(userData);
      onDataLoaded?.(userData);
    } catch (err) {
      const fetchError = err instanceof Error ? err : new Error('Unknown error');
      setError(fetchError);
      onError?.(fetchError);
    } finally {
      setLoading(false);
      onLoading?.(false);
    }
  };

  // Fetch data when username or apiEndpoint changes
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username, apiEndpoint]);

  // Apply theme whenever it changes
  useEffect(() => {
    if (containerRef.current) {
      applyTheme(containerRef.current, theme);
    }
  }, [theme]);

  // Render widget when data or options change
  useEffect(() => {
    if (data && containerRef.current && !customRender) {
      renderWidget(containerRef.current, data, username, {
        showHeader,
        showFooter,
        showThumbnail,
        showMonthLabels,
        showWeekdayLabels,
        showTooltips,
        dayLabels,
        footerLabels,
        classNames,
        dayClassName,
        dayStyle,
        dayAttributes,
        tooltipFormatter,
        monthLabelFormatter,
        renderDayContents,
        renderHeader,
        renderFooter,
        renderThumbnail,
      });
    }
  }, [
    data,
    showHeader,
    showFooter,
    showThumbnail,
    showMonthLabels,
    showWeekdayLabels,
    showTooltips,
    dayLabels,
    footerLabels,
    classNames,
    dayClassName,
    dayStyle,
    dayAttributes,
    tooltipFormatter,
    monthLabelFormatter,
    renderDayContents,
    renderHeader,
    renderFooter,
    renderThumbnail,
    username,
    customRender,
  ]);

  // Expose ref methods
  useImperativeHandle(ref, () => ({
    refresh: fetchData,
    getData: () => data,
  }));

  if (customRender) {
    return (
      <div
        ref={containerRef}
        className={rootClassName}
        style={style}
        data-error={error ? 'true' : undefined}
      >
        {customRender({ username, data, loading, error, refresh: fetchData })}
      </div>
    );
  }

  if (loading && loadingFallback) {
    return (
      <div
        ref={containerRef}
        className={rootClassName}
        style={style}
      >
        {loadingFallback}
      </div>
    );
  }

  if (error) {
    const renderedError =
      typeof errorFallback === 'function' ? errorFallback(error) : errorFallback;

    return (
      <div className={rootClassName} style={style}>
        {renderedError ?? (
          <p style={{ color: '#f85149' }}>Failed to load contribution data.</p>
        )}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={rootClassName}
      style={style}
      data-loading={loading}
    />
  );
});

GitHubContributionGraph.displayName = 'GitHubContributionGraph';

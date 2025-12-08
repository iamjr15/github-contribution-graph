import React, {
  useRef,
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { fetchContributionData } from '../core/api';
import { renderWidget } from '../core/renderer';
import { applyTheme } from '../styles/themes';
import type { GitHubUser, ThemePreset, ThemeConfig } from '../core/types';

export interface GitHubContributionGraphProps {
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
 * import { GitHubContributionGraph } from 'github-contribution-graph/react';
 * import 'github-contribution-graph/styles.css';
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
    className,
    style,
    onDataLoaded,
    onError,
    onLoading,
  } = props;

  const containerRef = useRef<HTMLDivElement>(null);
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

  // Render widget when data or options change
  useEffect(() => {
    if (data && containerRef.current) {
      renderWidget(containerRef.current, data, username, {
        showHeader,
        showFooter,
        showThumbnail,
      });
      applyTheme(containerRef.current, theme);
    }
  }, [data, theme, showHeader, showFooter, showThumbnail, username]);

  // Expose ref methods
  useImperativeHandle(ref, () => ({
    refresh: fetchData,
    getData: () => data,
  }));

  if (error) {
    return (
      <div className={className} style={style}>
        <p style={{ color: '#f85149' }}>Failed to load contribution data.</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={className}
      style={style}
      data-loading={loading}
    />
  );
});

GitHubContributionGraph.displayName = 'GitHubContributionGraph';

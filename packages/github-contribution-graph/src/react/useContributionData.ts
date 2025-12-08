import { useState, useEffect, useCallback } from 'react';
import { fetchContributionData } from '../core/api';
import type { GitHubUser } from '../core/types';

export interface UseContributionDataOptions {
  /**
   * Custom API endpoint for fetching data
   */
  apiEndpoint?: string;
  /**
   * Whether to fetch data automatically on mount
   * @default true
   */
  autoFetch?: boolean;
}

export interface UseContributionDataResult {
  /**
   * The fetched user data, null if not loaded
   */
  data: GitHubUser | null;
  /**
   * Whether data is currently being fetched
   */
  loading: boolean;
  /**
   * Error object if fetch failed
   */
  error: Error | null;
  /**
   * Function to manually refetch data
   */
  refetch: () => Promise<void>;
}

/**
 * React hook for fetching GitHub contribution data
 *
 * @param username - GitHub username
 * @param options - Hook options
 * @returns Object containing data, loading state, error, and refetch function
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { data, loading, error, refetch } = useContributionData('octocat');
 *
 *   if (loading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *
 *   return (
 *     <div>
 *       <p>Total: {data?.contributionsCollection.contributionCalendar.totalContributions}</p>
 *       <button onClick={refetch}>Refresh</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useContributionData(
  username: string,
  options: UseContributionDataOptions = {}
): UseContributionDataResult {
  const { apiEndpoint, autoFetch = true } = options;

  const [data, setData] = useState<GitHubUser | null>(null);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    if (!username) {
      setError(new Error('Username is required'));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const userData = await fetchContributionData(username, apiEndpoint);
      setData(userData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [username, apiEndpoint]);

  useEffect(() => {
    if (autoFetch && username) {
      refetch();
    }
  }, [autoFetch, username, refetch]);

  return { data, loading, error, refetch };
}

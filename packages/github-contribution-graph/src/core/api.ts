import { DEFAULT_API_ENDPOINT } from './constants';
import type { APIResponse, GitHubUser } from './types';

/**
 * Fetch contribution data for a GitHub user
 *
 * @param username - GitHub username
 * @param apiEndpoint - Optional custom API endpoint
 * @returns Promise resolving to user data
 * @throws Error if user not found or network error
 *
 * @example
 * ```ts
 * const userData = await fetchContributionData('octocat');
 * console.log(userData.contributionsCollection.contributionCalendar.totalContributions);
 * ```
 */
export async function fetchContributionData(
  username: string,
  apiEndpoint: string = DEFAULT_API_ENDPOINT
): Promise<GitHubUser> {
  if (!username || typeof username !== 'string') {
    throw new Error('Username is required');
  }

  const url = `${apiEndpoint}?login=${encodeURIComponent(username.trim())}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data: APIResponse = await response.json();

  if (!data.user) {
    throw new Error(data.error || 'User not found');
  }

  return data.user;
}

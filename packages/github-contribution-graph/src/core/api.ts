import { DEFAULT_API_ENDPOINT } from './constants';
import type { APIResponse, GitHubUser } from './types';

/**
 * Build an API URL while preserving existing query parameters.
 */
function buildContributionUrl(apiEndpoint: string, username: string): string {
  const encodedUsername = encodeURIComponent(username);

  try {
    const base =
      typeof window !== 'undefined' && window.location?.origin
        ? window.location.origin
        : 'http://localhost';
    const url = new URL(apiEndpoint, base);
    url.searchParams.set('login', username);

    if (!/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(apiEndpoint)) {
      return `${url.pathname}${url.search}${url.hash}`;
    }

    return url.toString();
  } catch {
    const separator = apiEndpoint.includes('?') ? '&' : '?';
    return `${apiEndpoint}${separator}login=${encodedUsername}`;
  }
}

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
  if (!username || typeof username !== 'string' || !username.trim()) {
    throw new Error('Username is required');
  }

  const trimmedUsername = username.trim();
  const url = buildContributionUrl(apiEndpoint, trimmedUsername);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  let response: Response;
  try {
    response = await fetch(url, { signal: controller.signal });
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }
    throw error;
  }

  clearTimeout(timeoutId);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data: APIResponse = await response.json();

  if (!data.user) {
    throw new Error(data.error || 'User not found');
  }

  return data.user;
}

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchContributionData } from '../../src/core/api';
import { DEFAULT_API_ENDPOINT } from '../../src/core/constants';

describe('fetchContributionData', () => {
  beforeEach(() => {
    vi.mocked(fetch).mockReset();
  });

  const mockUserData = {
    avatarUrl: 'https://avatars.githubusercontent.com/u/12345',
    contributionsCollection: {
      contributionCalendar: {
        totalContributions: 500,
        months: [{ name: 'Jan', totalWeeks: 4 }],
        weeks: [
          {
            contributionDays: [
              {
                date: '2024-01-01',
                contributionCount: 5,
                contributionLevel: 'SECOND_QUARTILE',
                weekday: 1,
              },
            ],
          },
        ],
      },
    },
  };

  it('should fetch and return user data successfully', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: mockUserData }),
    } as Response);

    const result = await fetchContributionData('testuser');

    expect(result).toEqual(mockUserData);
    expect(fetch).toHaveBeenCalledWith(
      `${DEFAULT_API_ENDPOINT}?login=testuser`
    );
  });

  it('should throw error when user not found', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: null, error: 'User not found' }),
    } as Response);

    await expect(fetchContributionData('nonexistent')).rejects.toThrow(
      'User not found'
    );
  });

  it('should throw error when API returns null user without error message', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: null }),
    } as Response);

    await expect(fetchContributionData('nonexistent')).rejects.toThrow(
      'User not found'
    );
  });

  it('should use custom API endpoint when provided', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: mockUserData }),
    } as Response);

    await fetchContributionData('testuser', 'https://custom-api.com/data');

    expect(fetch).toHaveBeenCalledWith(
      'https://custom-api.com/data?login=testuser'
    );
  });

  it('should throw error on HTTP error status', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 500,
    } as Response);

    await expect(fetchContributionData('testuser')).rejects.toThrow(
      'HTTP error! status: 500'
    );
  });

  it('should throw error when username is empty', async () => {
    await expect(fetchContributionData('')).rejects.toThrow(
      'Username is required'
    );
  });

  it('should encode special characters in username', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: mockUserData }),
    } as Response);

    await fetchContributionData('user name');

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('login=user%20name')
    );
  });

  it('should trim whitespace from username', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: mockUserData }),
    } as Response);

    await fetchContributionData('  testuser  ');

    expect(fetch).toHaveBeenCalledWith(
      `${DEFAULT_API_ENDPOINT}?login=testuser`
    );
  });
});

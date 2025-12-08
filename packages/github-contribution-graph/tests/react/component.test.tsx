import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { GitHubContributionGraph } from '../../src/react/GitHubContributionGraph';
import { useContributionData } from '../../src/react/useContributionData';
import type { GitHubUser } from '../../src/core/types';

// Mock the API module
vi.mock('../../src/core/api', () => ({
  fetchContributionData: vi.fn(),
}));

import { fetchContributionData } from '../../src/core/api';

describe('GitHubContributionGraph', () => {
  const mockUser: GitHubUser = {
    avatarUrl: 'https://example.com/avatar.png',
    contributionsCollection: {
      contributionCalendar: {
        totalContributions: 500,
        months: [
          { name: 'Jan', totalWeeks: 4 },
          { name: 'Feb', totalWeeks: 4 },
        ],
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

  beforeEach(() => {
    vi.mocked(fetchContributionData).mockReset();
  });

  it('should show loading state initially', () => {
    vi.mocked(fetchContributionData).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    const { container } = render(
      <GitHubContributionGraph username="testuser" />
    );

    expect(container.querySelector('[data-loading="true"]')).toBeTruthy();
  });

  it('should render contribution graph after data loads', async () => {
    vi.mocked(fetchContributionData).mockResolvedValueOnce(mockUser);

    const { container } = render(
      <GitHubContributionGraph username="testuser" />
    );

    await waitFor(() => {
      expect(container.querySelector('.ghCalendarCard')).toBeTruthy();
    });
  });

  it('should call onDataLoaded callback when data loads', async () => {
    vi.mocked(fetchContributionData).mockResolvedValueOnce(mockUser);
    const onDataLoaded = vi.fn();

    render(
      <GitHubContributionGraph username="testuser" onDataLoaded={onDataLoaded} />
    );

    await waitFor(() => {
      expect(onDataLoaded).toHaveBeenCalledWith(mockUser);
    });
  });

  it('should call onError callback on failure', async () => {
    const error = new Error('API Error');
    vi.mocked(fetchContributionData).mockRejectedValueOnce(error);
    const onError = vi.fn();

    render(
      <GitHubContributionGraph username="testuser" onError={onError} />
    );

    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith(error);
    });
  });

  it('should render error message on failure', async () => {
    vi.mocked(fetchContributionData).mockRejectedValueOnce(new Error('API Error'));

    render(<GitHubContributionGraph username="testuser" />);

    await waitFor(() => {
      expect(screen.getByText(/Failed to load/)).toBeTruthy();
    });
  });

  it('should call onLoading callback when loading state changes', async () => {
    vi.mocked(fetchContributionData).mockResolvedValueOnce(mockUser);
    const onLoading = vi.fn();

    render(
      <GitHubContributionGraph username="testuser" onLoading={onLoading} />
    );

    await waitFor(() => {
      expect(onLoading).toHaveBeenCalledWith(true);
      expect(onLoading).toHaveBeenCalledWith(false);
    });
  });

  it('should apply custom className', async () => {
    vi.mocked(fetchContributionData).mockResolvedValueOnce(mockUser);

    const { container } = render(
      <GitHubContributionGraph username="testuser" className="custom-class" />
    );

    await waitFor(() => {
      expect(container.querySelector('.custom-class')).toBeTruthy();
    });
  });

  it('should apply custom style', async () => {
    vi.mocked(fetchContributionData).mockResolvedValueOnce(mockUser);

    const { container } = render(
      <GitHubContributionGraph
        username="testuser"
        style={{ backgroundColor: 'red' }}
      />
    );

    await waitFor(() => {
      const div = container.firstChild as HTMLElement;
      expect(div.style.backgroundColor).toBe('red');
    });
  });

  it('should refetch when username changes', async () => {
    vi.mocked(fetchContributionData).mockResolvedValue(mockUser);

    const { rerender } = render(
      <GitHubContributionGraph username="user1" />
    );

    await waitFor(() => {
      expect(fetchContributionData).toHaveBeenCalledWith('user1', undefined);
    });

    rerender(<GitHubContributionGraph username="user2" />);

    await waitFor(() => {
      expect(fetchContributionData).toHaveBeenCalledWith('user2', undefined);
    });
  });

  it('should use custom apiEndpoint', async () => {
    vi.mocked(fetchContributionData).mockResolvedValueOnce(mockUser);

    render(
      <GitHubContributionGraph
        username="testuser"
        apiEndpoint="https://custom-api.com"
      />
    );

    await waitFor(() => {
      expect(fetchContributionData).toHaveBeenCalledWith(
        'testuser',
        'https://custom-api.com'
      );
    });
  });
});

describe('useContributionData', () => {
  const mockUser: GitHubUser = {
    avatarUrl: 'https://example.com/avatar.png',
    contributionsCollection: {
      contributionCalendar: {
        totalContributions: 500,
        months: [],
        weeks: [],
      },
    },
  };

  beforeEach(() => {
    vi.mocked(fetchContributionData).mockReset();
  });

  // Helper component to test the hook
  function TestComponent({
    username,
    autoFetch = true,
  }: {
    username: string;
    autoFetch?: boolean;
  }) {
    const { data, loading, error, refetch } = useContributionData(username, {
      autoFetch,
    });

    return (
      <div>
        <span data-testid="loading">{String(loading)}</span>
        <span data-testid="error">{error?.message || 'none'}</span>
        <span data-testid="data">{data ? 'loaded' : 'null'}</span>
        <button onClick={refetch}>Refetch</button>
      </div>
    );
  }

  it('should fetch data automatically by default', async () => {
    vi.mocked(fetchContributionData).mockResolvedValueOnce(mockUser);

    render(<TestComponent username="testuser" />);

    await waitFor(() => {
      expect(screen.getByTestId('data').textContent).toBe('loaded');
    });
  });

  it('should not fetch automatically when autoFetch is false', async () => {
    vi.mocked(fetchContributionData).mockResolvedValueOnce(mockUser);

    render(<TestComponent username="testuser" autoFetch={false} />);

    expect(screen.getByTestId('loading').textContent).toBe('false');
    expect(fetchContributionData).not.toHaveBeenCalled();
  });

  it('should handle errors', async () => {
    vi.mocked(fetchContributionData).mockRejectedValueOnce(
      new Error('Test error')
    );

    render(<TestComponent username="testuser" />);

    await waitFor(() => {
      expect(screen.getByTestId('error').textContent).toBe('Test error');
    });
  });
});

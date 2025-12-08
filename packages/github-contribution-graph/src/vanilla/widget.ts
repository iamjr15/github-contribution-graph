import { fetchContributionData } from '../core/api';
import { renderWidget } from '../core/renderer';
import type { GitHubContributionGraphConfig, GitHubUser } from '../core/types';
import { applyTheme } from '../styles/themes';

/**
 * GitHub Contribution Widget class for vanilla JavaScript usage
 *
 * @example
 * ```ts
 * const widget = new GitHubContributionWidget({
 *   username: 'octocat',
 *   container: '#my-graph',
 *   theme: 'void',
 * });
 * widget.render();
 * ```
 */
export class GitHubContributionWidget {
  private container: HTMLElement;
  private config: GitHubContributionGraphConfig;
  private data: GitHubUser | null = null;

  constructor(config: GitHubContributionGraphConfig) {
    this.config = config;
    this.container = this.resolveContainer(config.container);
  }

  /**
   * Resolve the container element from config
   */
  private resolveContainer(container?: string | HTMLElement): HTMLElement {
    if (typeof container === 'string') {
      const el = document.querySelector(container);
      if (!el) {
        throw new Error(`Container not found: ${container}`);
      }
      return el as HTMLElement;
    }

    if (container instanceof HTMLElement) {
      return container;
    }

    // Default fallback for backward compatibility
    const el = document.getElementById('gh');
    if (!el) {
      throw new Error(
        'No container found. Specify container in config or add element with id="gh"'
      );
    }
    return el;
  }

  /**
   * Render the contribution graph
   */
  async render(): Promise<void> {
    try {
      this.data = await fetchContributionData(
        this.config.username,
        this.config.apiEndpoint
      );

      renderWidget(this.container, this.data, this.config.username, {
        showHeader: this.config.showHeader,
        showFooter: this.config.showFooter,
        showThumbnail: this.config.showThumbnail,
      });

      if (this.config.theme) {
        applyTheme(this.container, this.config.theme);
      }

      this.config.onDataLoaded?.(this.data);
    } catch (error) {
      this.container.innerHTML =
        '<p style="color: #f85149;">Failed to load contribution data.</p>';
      this.config.onError?.(
        error instanceof Error ? error : new Error('Unknown error')
      );
    }
  }

  /**
   * Refresh the contribution graph
   */
  async refresh(): Promise<void> {
    return this.render();
  }

  /**
   * Get the currently loaded data
   */
  getData(): GitHubUser | null {
    return this.data;
  }

  /**
   * Destroy the widget and clear content
   */
  destroy(): void {
    this.container.innerHTML = '';
    this.data = null;
  }

  /**
   * Update configuration and re-render
   */
  async update(config: Partial<GitHubContributionGraphConfig>): Promise<void> {
    this.config = { ...this.config, ...config };

    if (config.container) {
      this.container = this.resolveContainer(config.container);
    }

    return this.render();
  }
}

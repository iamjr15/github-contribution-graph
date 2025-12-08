/**
 * Browser entry point for script tag usage
 * This file is bundled as IIFE/UMD for direct browser usage
 */

import { GitHubContributionWidget } from './widget';
import { fetchContributionData } from '../core/api';
import { renderWidget } from '../core/renderer';
import { applyTheme, getThemePresets } from '../styles/themes';
import type { GitHubContributionGraphConfig } from '../core/types';

// Export everything for global access
export { GitHubContributionWidget };
export { fetchContributionData };
export { renderWidget };
export { applyTheme, getThemePresets };
export type { GitHubContributionGraphConfig };

// Re-export types
export * from '../core/types';

/**
 * Auto-initialize widget for backward compatibility
 * Looks for element with id="gh" and data-login attribute
 */
export function autoInit(): void {
  const container = document.getElementById('gh');
  if (!container) return;

  const username = container.dataset.login;
  if (!username) return;

  const widget = new GitHubContributionWidget({
    username,
    container,
  });

  widget.render();

  // Expose for manual re-render (backward compatibility)
  if (typeof window !== 'undefined') {
    (window as Window & { renderGitHubWidget?: () => Promise<void> }).renderGitHubWidget = () =>
      widget.render();
  }
}

// Auto-init when DOM is ready (only in browser context)
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInit);
  } else {
    // DOM is already ready
    autoInit();
  }
}

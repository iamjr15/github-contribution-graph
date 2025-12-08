import { THEME_PRESETS } from '../core/constants';
import type { ThemeConfig, ThemePreset } from '../core/types';

/**
 * Convert camelCase to kebab-case
 */
function camelToKebab(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

/**
 * Apply a theme to an element by setting CSS custom properties
 *
 * @param element - The element to apply theme to
 * @param theme - Theme preset name or custom config
 *
 * @example
 * ```ts
 * applyTheme(container, 'void');
 * applyTheme(container, { bgColor: '#1a1a1a', textColor: '#fff' });
 * ```
 */
export function applyTheme(
  element: HTMLElement,
  theme: ThemePreset | ThemeConfig
): void {
  const config = typeof theme === 'string' ? THEME_PRESETS[theme] : theme;

  if (!config) return;

  if (config.bgColor) {
    element.style.setProperty('--gh-bg-color', config.bgColor);
  }
  if (config.textColor) {
    element.style.setProperty('--gh-text-default-color', config.textColor);
  }
  if (config.cellLevel0) {
    element.style.setProperty('--gh-cell-level0-color', config.cellLevel0);
  }
  if (config.cellLevel1) {
    element.style.setProperty('--gh-cell-level1-color', config.cellLevel1);
  }
  if (config.cellLevel2) {
    element.style.setProperty('--gh-cell-level2-color', config.cellLevel2);
  }
  if (config.cellLevel3) {
    element.style.setProperty('--gh-cell-level3-color', config.cellLevel3);
  }
  if (config.cellLevel4) {
    element.style.setProperty('--gh-cell-level4-color', config.cellLevel4);
  }
  if (config.borderColor) {
    element.style.setProperty('--gh-border-card-color', config.borderColor);
  }
  if (config.fontFamily) {
    element.style.setProperty('--gh-font-default-family', config.fontFamily);
  }
}

/**
 * Generate CSS string from a theme configuration
 *
 * @param theme - Theme preset name or custom config
 * @returns CSS custom properties string
 */
export function getThemeCSS(theme: ThemePreset | ThemeConfig): string {
  const config = typeof theme === 'string' ? THEME_PRESETS[theme] : theme;

  if (!config) return '';

  const cssVars: string[] = [];

  for (const [key, value] of Object.entries(config)) {
    if (value) {
      const cssKey = `--gh-${camelToKebab(key).replace('color', '-color')}`;
      cssVars.push(`${cssKey}: ${value};`);
    }
  }

  return cssVars.join('\n');
}

/**
 * Get all available theme preset names
 */
export function getThemePresets(): ThemePreset[] {
  return Object.keys(THEME_PRESETS) as ThemePreset[];
}

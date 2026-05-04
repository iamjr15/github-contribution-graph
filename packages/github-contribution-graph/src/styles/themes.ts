import { THEME_PRESETS } from '../core/constants';
import type { ThemeConfig, ThemePreset } from '../core/types';

const THEME_CSS_VARIABLES: Record<keyof ThemeConfig, string> = {
  bgColor: '--gh-bg-color',
  textColor: '--gh-text-default-color',
  inactiveTextColor: '--gh-text-inactive-color',
  linkHoverColor: '--gh-link-hover-color',
  cellLevel0: '--gh-cell-level0-color',
  cellLevel1: '--gh-cell-level1-color',
  cellLevel2: '--gh-cell-level2-color',
  cellLevel3: '--gh-cell-level3-color',
  cellLevel4: '--gh-cell-level4-color',
  cellSize: '--gh-cell-size',
  cellGap: '--gh-cell-gap',
  cellRadius: '--gh-cell-radius',
  cellBorderColor: '--gh-cell-border-color',
  cellOutlineColor: '--gh-cell-outline-color',
  tooltipBgColor: '--gh-cell-info-bg-color',
  tooltipTextColor: '--gh-tooltip-text-color',
  tooltipPadding: '--gh-tooltip-padding',
  tooltipRadius: '--gh-tooltip-radius',
  tooltipFontSize: '--gh-tooltip-font-size',
  borderColor: '--gh-border-card-color',
  borderWidth: '--gh-border-card-width',
  cardPadding: '--gh-card-padding',
  cardPaddingBlock: '--gh-card-padding-block',
  cardRadius: '--gh-card-radius',
  canvasPaddingTop: '--gh-canvas-padding-top',
  canvasMarginInline: '--gh-canvas-margin-inline',
  headerHeight: '--gh-header-height',
  headerMarginBottom: '--gh-header-margin-bottom',
  headerFontSize: '--gh-header-font-size',
  avatarSize: '--gh-avatar-size',
  footerPadding: '--gh-footer-padding',
  footerFontSize: '--gh-footer-font-size',
  fontFamily: '--gh-font-default-family',
};

function normalizeCSSValue(value: string | number): string {
  return typeof value === 'number' ? `${value}px` : value;
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

  for (const [key, value] of Object.entries(config)) {
    const cssKey = THEME_CSS_VARIABLES[key as keyof ThemeConfig];
    if (cssKey && value !== undefined && value !== null && value !== '') {
      element.style.setProperty(cssKey, normalizeCSSValue(value));
    }
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
    const cssKey = THEME_CSS_VARIABLES[key as keyof ThemeConfig];
    if (cssKey && value !== undefined && value !== null && value !== '') {
      cssVars.push(`${cssKey}: ${normalizeCSSValue(value)};`);
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

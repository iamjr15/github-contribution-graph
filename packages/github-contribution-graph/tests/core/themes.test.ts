import { describe, expect, it } from 'vitest';
import { applyTheme, getThemeCSS } from '../../src/styles/themes';

describe('getThemeCSS', () => {
  it('should generate package CSS custom property names for preset themes', () => {
    expect(getThemeCSS('void')).toContain('--gh-bg-color: #000000;');
    expect(getThemeCSS('void')).toContain('--gh-text-default-color: #ffffff;');
    expect(getThemeCSS('void')).toContain('--gh-cell-level0-color: #111111;');
    expect(getThemeCSS('void')).toContain('--gh-border-card-color: #333333;');
  });

  it('should generate package CSS custom property names for custom themes', () => {
    expect(
      getThemeCSS({
        bgColor: '#111111',
        textColor: '#eeeeee',
        cellSize: 12,
        tooltipBgColor: '#222222',
        cellLevel1: '#123456',
        fontFamily: 'monospace',
      })
    ).toBe(
      [
        '--gh-bg-color: #111111;',
        '--gh-text-default-color: #eeeeee;',
        '--gh-cell-size: 12px;',
        '--gh-cell-info-bg-color: #222222;',
        '--gh-cell-level1-color: #123456;',
        '--gh-font-default-family: monospace;',
      ].join('\n')
    );
  });

  it('should apply all supported theme variables to an element', () => {
    const element = document.createElement('div');

    applyTheme(element, {
      cellSize: 14,
      cellGap: '6px',
      cellRadius: 4,
      inactiveTextColor: '#999999',
      linkHoverColor: '#abcdef',
    });

    expect(element.style.getPropertyValue('--gh-cell-size')).toBe('14px');
    expect(element.style.getPropertyValue('--gh-cell-gap')).toBe('6px');
    expect(element.style.getPropertyValue('--gh-cell-radius')).toBe('4px');
    expect(element.style.getPropertyValue('--gh-text-inactive-color')).toBe('#999999');
    expect(element.style.getPropertyValue('--gh-link-hover-color')).toBe('#abcdef');
  });
});

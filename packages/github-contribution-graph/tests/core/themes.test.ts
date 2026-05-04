import { describe, expect, it } from 'vitest';
import { getThemeCSS } from '../../src/styles/themes';

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
        cellLevel1: '#123456',
        fontFamily: 'monospace',
      })
    ).toBe(
      [
        '--gh-bg-color: #111111;',
        '--gh-text-default-color: #eeeeee;',
        '--gh-cell-level1-color: #123456;',
        '--gh-font-default-family: monospace;',
      ].join('\n')
    );
  });
});

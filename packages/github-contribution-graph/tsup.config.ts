import { defineConfig } from 'tsup';

export default defineConfig([
  // ESM and CJS builds for main, react, and vanilla entries
  {
    entry: {
      index: 'src/index.ts',
      react: 'src/react/index.ts',
      vanilla: 'src/vanilla/index.ts',
    },
    format: ['esm', 'cjs'],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: true,
    treeshake: true,
    minify: true,
    external: ['react', 'react-dom'],
    esbuildOptions(options) {
      options.drop = ['console', 'debugger'];
    },
    outExtension({ format }) {
      return {
        js: format === 'esm' ? '.js' : '.cjs',
      };
    },
  },
  // Global/IIFE build for browser script tag usage
  {
    entry: {
      browser: 'src/vanilla/browser.ts',
    },
    format: ['iife'],
    globalName: 'GitHubContributionGraph',
    minify: true,
    sourcemap: true,
    platform: 'browser',
    target: 'es2020',
    esbuildOptions(options) {
      options.drop = ['console', 'debugger'];
    },
    outExtension() {
      return { js: '.global.js' };
    },
  },
]);

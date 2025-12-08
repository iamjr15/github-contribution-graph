// Main entry - exports everything
// For tree-shaking, prefer importing from specific subpaths:
// - 'github-contribution-graph/react' for React components
// - 'github-contribution-graph/vanilla' for vanilla JS widget

// Core exports
export * from './core/types';
export * from './core/constants';
export * from './core/api';
export * from './core/renderer';

// Style utilities
export * from './styles/themes';

// Vanilla JS exports
export { GitHubContributionWidget } from './vanilla/widget';

// Note: React exports are in a separate entry point to avoid
// requiring React as a dependency for vanilla JS users
// Import from 'github-contribution-graph/react' for React components

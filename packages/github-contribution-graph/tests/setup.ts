import { beforeAll, afterEach, vi } from 'vitest';

// Mock fetch globally
beforeAll(() => {
  vi.stubGlobal('fetch', vi.fn());
});

afterEach(() => {
  vi.clearAllMocks();
  // Clear DOM between tests
  document.body.innerHTML = '';
});

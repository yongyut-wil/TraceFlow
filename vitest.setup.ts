import { vi } from 'vitest';

// Mock requestAnimationFrame and cancelAnimationFrame for Node environment
global.requestAnimationFrame = vi.fn((cb) => setTimeout(cb, 16)) as unknown as typeof requestAnimationFrame;
global.cancelAnimationFrame = vi.fn((id) => clearTimeout(id)) as unknown as typeof cancelAnimationFrame;

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
} as unknown as typeof ResizeObserver;


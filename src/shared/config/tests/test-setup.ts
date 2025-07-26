import { vi } from 'vitest'

// Mock webextension-polyfill
vi.mock('webextension-polyfill', () => ({
  default: {
    runtime: {
      getURL: vi.fn((path: string) => `chrome-extension://test/${path}`),
      onInstalled: {
        addListener: vi.fn(),
      },
    },
    storage: {
      local: {
        clear: vi.fn(),
        get: vi.fn(),
        set: vi.fn(),
      },
    },
    tabs: {
      create: vi.fn(),
    },
  },
}))

// Mock webext-bridge
vi.mock('webext-bridge/content-script', () => ({
  onMessage: vi.fn(),
  sendMessage: vi.fn(),
}))

vi.mock('webext-bridge/popup', () => ({
  onMessage: vi.fn(),
  sendMessage: vi.fn(),
}))

// Global test setup
// eslint-disable-next-line no-restricted-globals
if (global && global?.ResizeObserver) {
  // eslint-disable-next-line no-restricted-globals
  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }))
}

// Mock для chrome extension API
Object.defineProperty(window, 'chrome', {
  value: {
    runtime: {
      getURL: vi.fn((path: string) => `chrome-extension://test/${path}`),
    },
  },
  writable: true,
})

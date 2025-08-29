import "@testing-library/jest-dom";

import { TextDecoder, TextEncoder } from "util";

// Add polyfills for jsdom environment that React Router needs
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Add setTimeout to global scope for tests
global.setTimeout = setTimeout;

// Mock window.matchMedia for tests that might use it
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {}, // deprecated
    removeListener: () => {}, // deprecated
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

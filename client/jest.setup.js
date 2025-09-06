import "@testing-library/jest-dom";

import { TextDecoder, TextEncoder } from "util";

// Add polyfills for jsdom environment that React Router needs
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Add setTimeout to global scope for tests
global.setTimeout = setTimeout;

// Suppress Apollo Client deprecation warnings during tests
const originalWarn = console.warn;
console.warn = (message, ...args) => {
  // Suppress specific Apollo Client deprecation warnings
  if (
    typeof message === "string" &&
    (message.includes("addTypename") ||
      message.includes("canonizeResults") ||
      message.includes("Apollo Client"))
  ) {
    return;
  }
  originalWarn(message, ...args);
};

// Suppress React Suspense act() warnings during tests
const originalError = console.error;
console.error = (message, ...args) => {
  // Suppress React Suspense/act warnings that are common in testing
  if (
    typeof message === "string" &&
    (message.includes("A suspended resource finished loading inside a test") ||
      message.includes("act(...)") ||
      message.includes("wrap-tests-with-act"))
  ) {
    return;
  }
  originalError(message, ...args);
};

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

/**
 * Jest setup file to make jest object available globally for ES modules
 * This imports the jest object and makes it globally available
 */

import { jest } from "@jest/globals";

// Make jest available globally
global.jest = jest;

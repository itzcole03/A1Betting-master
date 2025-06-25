/**
 * Comprehensive Jest configuration for A1Betting Frontend
 * Supports TypeScript, React, and modern testing practices
 */

module.exports = {
  // Test environment
  testEnvironment: "jsdom",

  // Test file patterns
  testMatch: [
    "<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}",
    "<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}",
  ],

  // TypeScript support
  preset: "ts-jest",
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
    "^.+\\.(js|jsx)$": "babel-jest",
  },

  // Module resolution
  moduleNameMapper: {
    // Handle absolute imports
    "^@/(.*)$": "<rootDir>/src/$1",

    // Handle CSS modules and static assets
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(gif|ttf|eot|svg|png)$": "<rootDir>/src/test/__mocks__/fileMock.js",

    // Handle UI library components
    "^@/components/ui/(.*)$": "<rootDir>/src/components/ui/$1",
  },

  // Setup files
  setupFilesAfterEnv: [
    "<rootDir>/src/test/jest.setup-files.js",
    "<rootDir>/src/test/jest.setup-env.js",
  ],

  // Coverage configuration
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.d.ts",
    "!src/main.tsx",
    "!src/vite-env.d.ts",
    "!src/test/**/*",
    "!src/stories/**/*",
    "!src/**/*.stories.{js,jsx,ts,tsx}",
  ],

  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },

  coverageReporters: ["text", "lcov", "clover", "html"],

  // Test timeout
  testTimeout: 10000,

  // Clear mocks between tests
  clearMocks: true,

  // Verbose output
  verbose: true,

  // Ignore patterns
  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/dist/",
    "<rootDir>/build/",
  ],

  // Module file extensions
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
};

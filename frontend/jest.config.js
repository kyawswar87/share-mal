module.exports = {
  // Test environment
  testEnvironment: 'jsdom',
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  
  // Module name mapping for absolute imports
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@services/(.*)$': '<rootDir>/src/services/$1',
    '^@types/(.*)$': '<rootDir>/src/types/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@test-utils/(.*)$': '<rootDir>/src/test-utils/$1'
  },
  
  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.tsx',
    '!src/reportWebVitals.ts',
    '!src/setupTests.ts',
    '!src/test-utils/**',
    '!src/**/*.test.{js,jsx,ts,tsx}',
    '!src/**/*.stories.{js,jsx,ts,tsx}'
  ],
  
  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 80,
      lines: 80,
      statements: 80
    },
    // Specific thresholds for critical files
    './src/services/': {
      branches: 80,
      functions: 90,
      lines: 90,
      statements: 90
    },
    './src/components/': {
      branches: 75,
      functions: 85,
      lines: 85,
      statements: 85
    }
  },
  
  // Coverage reporters
  coverageReporters: [
    'text',
    'text-summary',
    'lcov',
    'html',
    'json-summary'
  ],
  
  // Test file patterns
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}'
  ],
  
  // Transform configuration
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
    '^.+\\.css$': 'jest-transform-stub'
  },
  
  // Module file extensions
  moduleFileExtensions: [
    'js',
    'jsx',
    'ts',
    'tsx',
    'json',
    'node'
  ],
  
  // Ignore patterns
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/build/',
    '<rootDir>/coverage/'
  ],
  
  // Clear mocks between tests
  clearMocks: true,
  
  // Restore mocks after each test
  restoreMocks: true,
  
  // Verbose output
  verbose: true,
  
  // Test timeout
  testTimeout: 10000,
  
  // Global setup
  globalSetup: undefined,
  globalTeardown: undefined,
  
  // Transform ignore patterns
  transformIgnorePatterns: [
    'node_modules/(?!(axios|date-fns|react-bootstrap-icons)/)'
  ],
  
  // Module directories
  moduleDirectories: [
    'node_modules',
    '<rootDir>/src'
  ],
  
  // Test environment options
  testEnvironmentOptions: {
    url: 'http://localhost'
  }
};

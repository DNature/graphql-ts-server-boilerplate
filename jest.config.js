const { defaults } = require('jest-config');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  globalSetup: '<rootDir>/src/testSetup/callSetup.js',
  globals: {
    'ts-jest': {
      diagnostics: false
    }
  }
};

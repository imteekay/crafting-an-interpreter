import { resolve } from 'path';

const root = resolve(__dirname);

module.exports = {
  rootDir: root,
  displayName: 'root-tests',
  testMatch: ['<rootDir>/src/**/*.test.ts'],
  testEnvironment: 'node',
  clearMocks: true,
  preset: 'ts-jest',
  moduleNameMapper: {
    'src/(.*)': '<rootDir>/src/$1',
  },
  moduleDirectories: ['node_modules', 'src'],
};

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '\\.(css|less)$': 'identity-obj-proxy',
    '^swiper/modules$': '<rootDir>/src/tests/swiper-modules-mock.js',
    '^swiper': '<rootDir>/src/tests/swiper-modules-mock.js',
  },
  transform: {
    '\\.(svg|png)$': './src/tests/jest.transformer.js',
  },
  collectCoverage: true,
  collectCoverageFrom: ['src/app/**/*.ts'],
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      branches: 25,
      functions: 25,
      lines: 25,
    },
  },
  setupFilesAfterEnv: ['./src/tests/jest.setup.js'],
  silent: true,
  modulePathIgnorePatterns: ['./src/app/enums', './src/app/types', './src/app/interfaces'],
};

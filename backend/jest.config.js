module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
    'apps/**/*.service.(t|j)s',
    'apps/**/*.controller.(t|j)s',
    'libs/**/*.service.(t|j)s',
    '!**/node_modules/**',
    '!**/dist/**',
  ],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  roots: ['<rootDir>/apps/', '<rootDir>/libs/'],
  moduleNameMapper: {
    '^@shared/(.*)$': '<rootDir>/libs/shared/src/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/test/jest-setup.ts'],
};
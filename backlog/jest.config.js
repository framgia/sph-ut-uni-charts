module.exports = {
  clearMocks: true,
  verbose: true,
  collectCoverage: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src/test'],
  testRegex: '(/__test__/.*|(\\.|/)(test|spec))\\.[jt]sx?$',
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  collectCoverageFrom: ['<rootDir>/**/*.js', '<rootDir>/**/*.ts'],
  setupFilesAfterEnv: ['<rootDir>/src/utils/singleton.ts']
}

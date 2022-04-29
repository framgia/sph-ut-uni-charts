module.exports = {
  clearMocks: true,
  verbose: true,
  collectCoverage: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['./test'],
  testRegex: '(/__test__/.*|(\\.|/)(test|spec))\\.[jt]sx?$',
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  collectCoverageFrom: ['./**/*.js', './**/*.ts'],
  setupFilesAfterEnv: ['./utils/singleton.ts']
}

import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    "@(.*)$": [
      "<rootDir>/src/$1",
      "<rootDir>/node_modules/@$1"
    ]
  },
}
export default config

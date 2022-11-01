module.exports = {
  preset: "ts-jest",
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  roots: ["<rootDir>/src"],

  // globals
  globals: {
    "ts-jest": {
      tsconfig: {
        allowJs: true,
      },
    },
  },

  // test files
  testMatch: [
    "<rootDir>/src/**/?(*.)+(spec|test).[jt]s?(x)",
    "<rootDir>/tests/**/?(*.)+(spec|test).[jt]s?(x)",
  ],

  // module resolution
  moduleDirectories: ["src", "node_modules"],
  moduleFileExtensions: ["js", "ts", "tsx"],

  // snapshot
  //   snapshotSerializers: ["enzyme-to-json/serializer"],
  //   snapshotResolver: "<rootDir>/src/test/snapshot-resolver.js",

  // transform
  transform: { "^.+\\.(js|ts)x?$": "ts-jest" },
  transformIgnorePatterns: ["/node_modules/"],

  // Code coverage
  reporters: ["default", "github-actions"],
  collectCoverageFrom: [
    "<rootDir>/src/**",
    "!<rootDir>/src/index.ts",
    "!<rootDir>/src/types.ts",
    "!<rootDir>/src/**.d.ts",
    "!<rootDir>/src/__tests__/**",
    "!<rootDir>/src/__fixtures__/**",
  ],
  //   coverageReporters: ["text-summary", "html", "lcov", "clover"],
  //   coverageDirectory: "./coverage/",
  //   collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
}

/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from "jest";
import nextJest from "next/jest";

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
const config: Config = {
  clearMocks: true,
  coverageProvider: "v8",
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleFileExtensions: [
    "js",
    "mjs",
    "cjs",
    "jsx",
    "ts",
    "tsx",
    "json",
    "node",
  ],
  moduleNameMapper: {
    "^@/components/(.*)$": "<rootDir>/src/components/$1",
    "^@/config/(.*)$": "<rootDir>/src/config/$1",
    "^@/types/(.*)$": "<rootDir>/src/types/$1",
    "^@/interfaces/(.*)$": "<rootDir>/src/interfaces/$1",
    "^@/contexts/(.*)$": "<rootDir>/src/contexts/$1",
    "^@/lib/(.*)$": "<rootDir>/src/lib/$1",
    "^@/hooks/(.*)$": "<rootDir>/src/hooks/$1",
    "^@/data/(.*)$": "<rootDir>/src/data/$1",
    "^@/(.*)$": "<rootDir>/src/$1",
    "^#site/content$": "<rootDir>/.velite",
    "^@nextui-org/react$": "<rootDir>/src/__tests__/__mocks__/nextui.tsx",
    "^@nextui-org/button$": "<rootDir>/src/__tests__/__mocks__/nextui.tsx",
    "^@nextui-org/navbar$": "<rootDir>/src/__tests__/__mocks__/nextui.tsx",
    "^@nextui-org/link$": "<rootDir>/src/__tests__/__mocks__/nextui.tsx",
    "^@nextui-org/dropdown$": "<rootDir>/src/__tests__/__mocks__/nextui.tsx",
  },
  testMatch: [
    "**/__tests__/**/*.[jt]s?(x)",
    "**/?(*.)+(spec|test).[tj]s?(x)",
  ],
  testPathIgnorePatterns: ["/node_modules/"],
  watchPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/.next/",
    "<rootDir>/out/",
    "<rootDir>/public/",
    "<rootDir>/coverage/",
  ],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(next-auth|@auth)/)",
    "/node_modules/(?!(@nextui-org|@radix-ui|framer-motion)/)",
  ],
  // Uncomment the next line to limit workers if needed
  // maxWorkers: 2,
};

export default createJestConfig(config);
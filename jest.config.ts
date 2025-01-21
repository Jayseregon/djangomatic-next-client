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
    "^@/src/components/(.*)$": "<rootDir>/src/components/$1",
    "^@/config/(.*)$": "<rootDir>/src/config/$1",
    "^@/types/(.*)$": "<rootDir>/src/types/$1",
    "^@/interfaces/(.*)$": "<rootDir>/src/interfaces/$1",
    "^@/contexts/(.*)$": "<rootDir>/src/contexts/$1",
    "^@/lib/(.*)$": "<rootDir>/src/lib/$1",
    "^@/src/lib/(.*)$": "<rootDir>/src/lib/$1",
    "^@/hooks/(.*)$": "<rootDir>/src/hooks/$1",
    "^@/data/(.*)$": "<rootDir>/src/data/$1",
    "^@/(.*)$": "<rootDir>/src/$1",
    "^#site/content$": "<rootDir>/.velite",
    "^@heroui/react$": "<rootDir>/src/__tests__/__mocks__/heroui.tsx",
    "^@heroui/button$": "<rootDir>/src/__tests__/__mocks__/heroui.tsx",
    "^@heroui/navbar$": "<rootDir>/src/__tests__/__mocks__/heroui.tsx",
    "^@heroui/link$": "<rootDir>/src/__tests__/__mocks__/heroui.tsx",
    "^@heroui/dropdown$": "<rootDir>/src/__tests__/__mocks__/heroui.tsx",
    "^@lottiefiles/dotlottie-react$": "<rootDir>/src/__tests__/__mocks__/lottie.tsx",
    "^next-auth/react$": "<rootDir>/src/__tests__/__mocks__/next-auth-react.tsx",
    "^next-auth$": "<rootDir>/src/__tests__/__mocks__/next-auth-react.tsx",
    "^next-auth/jwt$": "<rootDir>/src/__tests__/__mocks__/next-auth-react.tsx",
    "^@/src/(.*)$": "<rootDir>/src/$1",
    "^@/auth$": "<rootDir>/auth.ts",
    "^@/src/auth$": "<rootDir>/auth.ts",
    "^next-intl/server$": "<rootDir>/src/__tests__/__mocks__/next-intl-server.ts",
    "^next-auth/providers/(.*)$": "<rootDir>/src/__tests__/__mocks__/next-auth-providers.ts",
    '^next/server$': '<rootDir>/src/__tests__/__mocks__/next-server.ts',
  },
  testMatch: [
    "**/__tests__/**/*.[jt]s?(x)",
    "**/?(*.)+(spec|test).[tj]s?(x)",
  ],
  testPathIgnorePatterns: [
    "/node_modules/",
    "<rootDir>/src/__tests__/__mocks__/"
  ],
  watchPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/.next/",
    "<rootDir>/.next/standalone/",
    "<rootDir>/out/",
    "<rootDir>/public/",
    "<rootDir>/coverage/",
  ],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(@auth/core|next-auth|@panva/hkdf|jose|oauth|openid-client|preact|uuid|next-intl|@auth/core/providers|next-auth/providers|lucide-react))/"
  ],
  // Uncomment the next line to limit workers if needed
  // maxWorkers: 2,
};

export default createJestConfig(config);
module.exports = {
  clearMocks: true,
  preset: "ts-jest",
  testEnvironment: "node",
  setupFiles: ["<rootDir>/tests/setup/setup.ts"],
  setupFilesAfterEnv: [],
  moduleDirectories: ["node_modules", "<rootDir>"],
};

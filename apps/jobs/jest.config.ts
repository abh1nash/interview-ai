module.exports = {
  clearMocks: true,
  preset: "ts-jest",
  testEnvironment: "node",
  setupFiles: ["<rootDir>/tests/setup/setup.ts"],
  setupFilesAfterEnv: ["<rootDir>/prisma/singleton.ts"],
  moduleDirectories: ["node_modules", "<rootDir>"],
};

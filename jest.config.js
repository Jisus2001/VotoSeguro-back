export default {
   transform: {
    "^.+\\.js$": "babel-jest",
  },
  testEnvironment: "node",
  verbose: true,
  testMatch: ["**/tests/**/*.test.js"]
};

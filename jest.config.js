export default {
  testEnvironment: "node",
  verbose: true,
  testMatch: ["**/tests/**/*.test.js"],
  
  // 🔑 NO uses transform con ESM
  transform: {},
  
  // 🔑 CRÍTICO: Permite que Jest procese mongodb y sus dependencias
  transformIgnorePatterns: [
    "node_modules/(?!(" +
    "mongodb|" +
    "mongoose|" +
    "bson|" +
    "@mongodb-js|" +
    "socks" +
    ")/)"
  ],
  
  // 🔑 Mapeo de módulos para ESM
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  
  // 🔑 Resolver extensiones
  moduleFileExtensions: ["js", "json", "node"],
  
  // Setup files
  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],
  
  // 🔑 AUMENTAR timeout para las operaciones de Mongoose
  testTimeout: 15000,
  
  // 🔑 CRÍTICO: Forzar cierre después de las pruebas
  forceExit: true,
  
  // 🔑 Detectar handles abiertos para debugging
  detectOpenHandles: true,
  
  // Reportes
  reporters: [
    "default",
    [
      "jest-junit",
      {
        outputDirectory: "./reports/junit",
        outputName: "junit-report.xml",
        classNameTemplate: "{classname}",
        titleTemplate: "{title}",
        ancestorSeparator: " › ",
        suiteNameTemplate: "{filepath}",
      },
    ],
  ],
};
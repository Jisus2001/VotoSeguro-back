export default {
  testEnvironment: "node",
  verbose: true,
  testMatch: ["**/tests/**/*.test.js"],
  
  // 🔑 NO uses transform con ESM
  transform: {},
  
  // 🔑 CRÍTICO: Permite que Jest procese testcontainers y sus dependencias
  transformIgnorePatterns: [
    "node_modules/(?!(" +
    "testcontainers|" +
    "undici|" +
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
  
  // 🔑 CRÍTICO: Configurar globals para undici
  globals: {
    File: global.File,
    FormData: global.FormData,
  },
  
  // 🔑 AUMENTAR timeout para las operaciones de Mongoose y Testcontainers
  testTimeout: 60000,
  
  // 🔑 CRÍTICO: Forzar cierre después de las pruebas
  forceExit: true,
  
  // 🔑 Detectar handles abiertos para debugging
  detectOpenHandles: true,
  
  // 🔑 CRÍTICO: Testcontainers necesita más tiempo
  maxWorkers: 1,
  
  // Reportes
  reporters: [
    "default",
    [
      "jest-junit",
      {
        outputDirectory: "./reports/unit",
        outputName: "unit-report.xml",
        classNameTemplate: "{classname}",
        titleTemplate: "{title}",
        ancestorSeparator: " › ",
        suiteNameTemplate: "{filepath}",
      },
    ],
  ],
};

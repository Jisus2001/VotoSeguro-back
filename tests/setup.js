/**
 * @file setup.js
 * @description Configuración global para Jest - Mock de Mongoose (ESM)
 */

import { jest } from '@jest/globals';

// 🔧 CRÍTICO: Polyfills para undici
global.File = class File {
  constructor(bits, name, options) {
    this.bits = bits;
    this.name = name;
    this.options = options;
  }
};

global.FormData = class FormData {
  constructor() {
    this.data = new Map();
  }
  append(key, value) {
    this.data.set(key, value);
  }
  get(key) {
    return this.data.get(key);
  }
};

// 🔧 Aumentar timeout global para Testcontainers
jest.setTimeout(60000);

// 🔧 Limpiar después de cada test
afterEach(() => {
  jest.clearAllMocks();
});

// 🔧 Cerrar conexiones después de todos los tests
afterAll(async () => {
  // Dar tiempo para que las operaciones asíncronas terminen
  await new Promise(resolve => setTimeout(resolve, 2000));
});

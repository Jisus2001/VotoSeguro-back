/**
 * @file setup.js
 * @description Configuración global para Jest - Mock de Mongoose (ESM)
 */

import { jest } from '@jest/globals';

// 🔧 CRÍTICO: En ESM con experimental-vm-modules, 
// jest.mock() NO funciona en setup files
// Los mocks deben estar en cada archivo de test individual

// 🔧 Aumentar timeout global
jest.setTimeout(15000);

// 🔧 Limpiar después de cada test
afterEach(() => {
  jest.clearAllMocks();
});

// 🔧 Cerrar conexiones después de todos los tests
afterAll(async () => {
  // Dar tiempo para que las operaciones asíncronas terminen
  await new Promise(resolve => setTimeout(resolve, 1000));
});
// tests/setup.js
// Configuración global para Jest con ESM
import { jest } from '@jest/globals';

// Timeout global más largo para tests de integración
jest.setTimeout(30000);

// Manejo de errores no capturados
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

export default undefined;
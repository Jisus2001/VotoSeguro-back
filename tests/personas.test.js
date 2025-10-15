/**
 * @file personas.test.js
 * @description Prueba unitaria S-01: Autenticación (HU1) - Rechazo de credenciales inválidas
 */

import { jest } from "@jest/globals"; // 👈 necesario en ESM
import { validarSesion } from "../Servicios/Controllers/Personas.js";
import Personas from "../Servicios/Schemas/Personas.js";

// 🔧 Declarar el mock correctamente para ESM
jest.unstable_mockModule("../Servicios/Schemas/Personas.js", () => ({
  default: {
    findOne: jest.fn(),
  },
}));


describe("S-01 Autenticación (HU1) - Rechazo de credenciales inválidas", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("Debe retornar código 441 y mensaje controlado si la contraseña es incorrecta", async () => {
        // Simula usuario existente "admin" en la base de datos
        Personas.findOne.mockResolvedValue({
            Identificacion: "admin",
            Contrasenna: "correcta123",
            Nombre: "Administrador",
            Perfil: "Admin",
        });

        // Datos de entrada con contraseña incorrecta
        const credenciales = {
            Identificacion: "admin",
            Contrasenna: "xxx",
        };

        // Ejecutar la función
        const resultado = await validarSesion(credenciales);

        // Validaciones
        expect(resultado.success).toBe(false);
        expect(resultado.status).toBe(441);
        expect(resultado.error).toMatch(/credenciales inválidas/i);
    });

    test("Debe retornar 441 si el usuario no existe", async () => {
        // Simula usuario no encontrado
        Personas.findOne.mockResolvedValue(null);

        const credenciales = {
            Identificacion: "admin",
            Contrasenna: "xxx",
        };

        const resultado = await validarSesion(credenciales);

        expect(resultado.success).toBe(false);
        expect(resultado.status).toBe(441);
        expect(resultado.error).toMatch(/credenciales inválidas/i);
    });
});

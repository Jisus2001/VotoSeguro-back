/**
 * @file personas.test.js
 * @description Prueba unitaria S-01: Autenticación (HU1) - Rechazo de credenciales inválidas
 */

import { jest } from "@jest/globals";

// ⚠️ Mock ESM del módulo
jest.unstable_mockModule("../../Servicios/Schemas/Personas.js", () => {
  const findOneMock = jest.fn();
  const updateOneMock = jest.fn();

  const PersonasMock = function () {};
  PersonasMock.findOne = findOneMock;
  PersonasMock.updateOne = updateOneMock;

  return {
    default: PersonasMock,
    __esModule: true,
  };
});


let validarSesion;
let Personas;

describe("S-01 Autenticación (HU1) - Rechazo de credenciales inválidas", () => {
    beforeAll(async () => {
        // Importar dinámicamente los módulos mockeados
        ({ validarSesion } = await import("../../Servicios/Controllers/Personas.js"));
        ({ default: Personas } = await import("../../Servicios/Schemas/Personas.js"));
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

 test("HU1: Retorna 441 si la contraseña es incorrecta y el usuario no está bloqueado", async () => {
    const usuarioSimulado = {
        Identificacion: "admin",
        Contrasenna: "correcta123",
        Nombre: "Administrador",
        Perfil: "Admin",
        IntentosFallidos: 1, // aún no llega al límite
        BloqueadoHasta: null,
    };

    // Mock findOne
    Personas.findOne.mockResolvedValue({ ...usuarioSimulado });

    // Mock updateOne para simular incremento del contador
    Personas.updateOne = jest.fn();

    const credenciales = {
        Identificacion: "admin",
        Contrasenna: "incorrecta",
    };

    const resultado = await validarSesion(credenciales);

    expect(resultado.success).toBe(false);
    expect(resultado.status).toBe(441); // No está bloqueado aún
    expect(resultado.error).toMatch(/credenciales inválidas/i);
});


test("HU1: Retorna 441 si el usuario no existe", async () => {
    Personas.findOne.mockResolvedValue(null); // Usuario no encontrado

    const credenciales = {
        Identificacion: "admin",
        Contrasenna: "cualquier",
    };

    const resultado = await validarSesion(credenciales);

    expect(resultado.success).toBe(false);
    expect(resultado.status).toBe(441);
    expect(resultado.error).toMatch(/credenciales inválidas/i);
});

test("S-02: Bloqueo tras múltiples intentos fallidos consecutivos (usuario 'votante')", async () => {
    const usuarioBase = {
        Identificacion: "votante",
        Contrasenna: "correcta123",
        Nombre: "Votante Ejemplo",
        Perfil: "Votante",
        IntentosFallidos: 0,
        BloqueadoHasta: null,
    };

    // Estado simulado del usuario que se va actualizando en memoria
    let usuarioSimulado = { ...usuarioBase };

    // Mock de findOne dinámico
    Personas.findOne.mockImplementation(async ({ Identificacion }) => {
        if (Identificacion === "votante") {
            return { ...usuarioSimulado }; // Siempre devolver una copia actual del usuario simulado
        }
        return null;
    });

    // Mock de updateOne para modificar el estado simulado
    Personas.updateOne = jest.fn(async (_filtro, update) => {
        if (update.$set) {
            usuarioSimulado = {
                ...usuarioSimulado,
                ...update.$set,
            };
        }
    });

    const credencialesIncorrectas = {
        Identificacion: "votante",
        Contrasenna: "errada", // intencionalmente incorrecta
    };

    let resultado;

    // Realizar 3 intentos fallidos
    for (let i = 1; i <= 3; i++) {
        resultado = await validarSesion(credencialesIncorrectas);

        expect(resultado.success).toBe(false);
        expect(resultado.status).toBe(441);
        expect(resultado.error).toMatch(/credenciales inválidas/i);
        expect(usuarioSimulado.IntentosFallidos).toBeLessThanOrEqual(3);
    }

    // Simular que el usuario ya está bloqueado (updateOne lo puso)
    expect(usuarioSimulado.BloqueadoHasta).not.toBeNull();
    expect(usuarioSimulado.IntentosFallidos).toBe(0); // se reinicia después del bloqueo

    // Esperar que está realmente bloqueado (por comparación de fechas)
    const ahora = new Date();
    expect(usuarioSimulado.BloqueadoHasta > ahora).toBe(true);

    // 4.º intento mientras está bloqueado
    resultado = await validarSesion(credencialesIncorrectas);

    expect(resultado.success).toBe(false);
    expect(resultado.status).toBe(442); // código de usuario bloqueado
    expect(resultado.error).toMatch(/bloqueado/i);

    // Asegurarse de que no se aumenten los intentos mientras está bloqueado
    expect(usuarioSimulado.IntentosFallidos).toBe(0);
});


});
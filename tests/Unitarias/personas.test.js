/**
 * @file personas.test.js
 * @description Prueba unitaria S-01: Autenticación (HU1) - Rechazo de credenciales inválidas
 */

import { jest } from "@jest/globals";

// 🧩 Mock del modelo Personas (Mongoose)
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
      IntentosFallidos: 1,
      BloqueadoHasta: null,
    };

    Personas.findOne.mockResolvedValue({ ...usuarioSimulado });
    Personas.updateOne.mockResolvedValue({});

    const credenciales = {
      Identificacion: "admin",
      Contrasenna: "incorrecta",
    };

    const resultado = await validarSesion(credenciales);

    expect(resultado.success).toBe(false);
    expect(resultado.status).toBe(441);
    expect(resultado.error).toMatch(/credenciales inválidas/i);
  });

  test("HU1: Retorna 441 si el usuario no existe", async () => {
    Personas.findOne.mockResolvedValue(null);

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

    let usuarioSimulado = { ...usuarioBase };

    Personas.findOne.mockImplementation(async ({ Identificacion }) => {
      if (Identificacion === "votante") {
        return { ...usuarioSimulado };
      }
      return null;
    });

    Personas.updateOne.mockImplementation(async (_filtro, update) => {
      if (update.$set) {
        usuarioSimulado = {
          ...usuarioSimulado,
          ...update.$set,
        };
      }
    });

    const credencialesIncorrectas = {
      Identificacion: "votante",
      Contrasenna: "errada",
    };

    let resultado;

    for (let i = 1; i <= 3; i++) {
      resultado = await validarSesion(credencialesIncorrectas);

      expect(resultado.success).toBe(false);
      expect(resultado.status).toBe(441);
      expect(resultado.error).toMatch(/credenciales inválidas/i);
      expect(usuarioSimulado.IntentosFallidos).toBeLessThanOrEqual(3);
    }

    expect(usuarioSimulado.BloqueadoHasta).not.toBeNull();
    expect(usuarioSimulado.IntentosFallidos).toBe(0);

    const ahora = new Date();
    expect(usuarioSimulado.BloqueadoHasta > ahora).toBe(true);

    resultado = await validarSesion(credencialesIncorrectas);

    expect(resultado.success).toBe(false);
    expect(resultado.status).toBe(442);
    expect(resultado.error).toMatch(/bloqueado/i);
    expect(usuarioSimulado.IntentosFallidos).toBe(0);
  });
});

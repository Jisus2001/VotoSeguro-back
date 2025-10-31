/**
 * @file candidatos.test.js
 * @description Prueba unitaria para agregar candidatos correctamente
 */

import { jest } from "@jest/globals";

// 🔧 CRÍTICO: Mock de Mongoose ANTES de cualquier importación
jest.unstable_mockModule("mongoose", () => ({
  default: {
    connect: jest.fn().mockResolvedValue(true),
    connection: {
      readyState: 1,
      close: jest.fn().mockResolvedValue(true),
    },
    Schema: class Schema {
      constructor() {}
    },
    model: jest.fn(),
  },
  Schema: class Schema {
    constructor() {}
  },
  model: jest.fn(),
}));

// 🧩 Mocks para Candidatos
const saveMock = jest.fn();
const candidatosFindOneMock = jest.fn();
const deleteOneMock = jest.fn();

// 🧩 Mocks para PerfilesElecciones
const perfilFindOneMock = jest.fn();

// 🧩 Mock de sanitize-html
jest.unstable_mockModule("sanitize-html", () => ({
  default: jest.fn((text) => text),
}));

// 🧩 Mock del modelo Candidatos
jest.unstable_mockModule("../../Servicios/Schemas/Candidatos.js", () => {
  const CandidatosMock = function (data) {
    this.Nombre = data.Nombre;
    this.Partido = data.Partido;
    this.PerfilId = data.PerfilId;
    this.save = saveMock;
  };

  CandidatosMock.findOne = candidatosFindOneMock;
  CandidatosMock.deleteOne = deleteOneMock;

  return {
    default: CandidatosMock,
    __esModule: true,
  };
});

// 🧩 Mock del modelo PerfilesElecciones
jest.unstable_mockModule("../../Servicios/Schemas/PerfilesElecciones.js", () => {
  const PerfilesEleccionesMock = function () {};
  PerfilesEleccionesMock.findOne = perfilFindOneMock;

  return {
    default: PerfilesEleccionesMock,
    __esModule: true,
  };
});

let agregarCandidato;
let Candidatos;
let PerfilesElecciones;

describe("Pruebas de Candidatos", () => {
  beforeAll(async () => {
    ({ agregarCandidato } = await import(
      "../../Servicios/Controllers/Candidatos.js"
    ));
    ({ default: Candidatos } = await import(
      "../../Servicios/Schemas/Candidatos.js"
    ));
    ({ default: PerfilesElecciones } = await import(
      "../../Servicios/Schemas/PerfilesElecciones.js"
    ));
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Debería agregar candidato correctamente", async () => {
    // ✅ Simula que el perfil existe
    perfilFindOneMock.mockResolvedValue({
      _id: 1,
      IdPerfil: 1,
      Descripcion: "Perfil 1",
    });

    // ✅ Simula que no existe un candidato con ese nombre
    candidatosFindOneMock.mockResolvedValue(null);

    // ✅ Simula que el candidato se guarda correctamente
    saveMock.mockResolvedValue({
      _id: "mock-id",
      Nombre: "Candidato Prueba",
      Partido: "Partido XYZ",
      PerfilId: 1,
    });

    const data = {
      Nombre: "Candidato Prueba",
      Partido: "Partido XYZ",
      PerfilId: 1,
    };

    const resultado = await agregarCandidato(data);

    expect(resultado).toEqual({
      success: true,
      status: 200,
      mensaje: "Candidato agregado correctamente",
    });

    expect(perfilFindOneMock).toHaveBeenCalledWith({ IdPerfil: 1 });
    expect(candidatosFindOneMock).toHaveBeenCalledWith({
      Nombre: "Candidato Prueba",
    });
    expect(saveMock).toHaveBeenCalled();
  });

  test("Debe rechazar candidato si el perfil no existe", async () => {
    // ✅ Simula que el perfil NO existe
    perfilFindOneMock.mockResolvedValue(null);

    const data = {
      Nombre: "Candidato Sin Perfil",
      Partido: "Partido ABC",
      PerfilId: 999,
    };

    await expect(agregarCandidato(data)).rejects.toThrow("PerfilNoExiste");
  });

  test("Debe rechazar candidato duplicado", async () => {
    // ✅ Simula que el perfil existe
    perfilFindOneMock.mockResolvedValue({
      IdPerfil: 1,
      Descripcion: "Perfil 1",
    });

    // ✅ Simula que ya existe un candidato con ese nombre
    candidatosFindOneMock.mockResolvedValue({
      _id: "existing-id",
      Nombre: "Candidato Duplicado",
      Partido: "Partido XYZ",
      PerfilId: 1,
    });

    const data = {
      Nombre: "Candidato Duplicado",
      Partido: "Partido XYZ",
      PerfilId: 1,
    };

    await expect(agregarCandidato(data)).rejects.toThrow("CandidatoExistente");
  });
});

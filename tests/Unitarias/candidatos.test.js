/**
 * @file candidatos.test.js
 * @description Prueba unitaria para agregar candidatos correctamente
 */

import { jest } from "@jest/globals";

// 🧩 Mocks para Candidatos
const saveMock = jest.fn();
const candidatosFindOneMock = jest.fn();
const deleteOneMock = jest.fn();

// 🧩 Mocks para PerfilesElecciones
const perfilFindOneMock = jest.fn();

// 🧩 Mock del modelo Candidatos (Mongoose)
jest.unstable_mockModule("../../Servicios/Schemas/Candidatos.js", () => {
  const CandidatosMock = function () {
    return { save: saveMock };
  };

  CandidatosMock.findOne = candidatosFindOneMock;
  CandidatosMock.deleteOne = deleteOneMock;

  return {
    default: CandidatosMock,
    __esModule: true,
  };
});

// 🧩 Mock del modelo PerfilesElecciones (Mongoose)
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

beforeAll(async () => {
  ({ agregarCandidato } = await import("../../Servicios/Controllers/Candidatos.js"));
  ({ default: Candidatos } = await import("../../Servicios/Schemas/Candidatos.js"));
  ({ default: PerfilesElecciones } = await import("../../Servicios/Schemas/PerfilesElecciones.js"));
});

beforeEach(() => {
  jest.clearAllMocks();
});

test("Debería agregar candidato correctamente", async () => {
  // ✅ Simula que el perfil existe
  perfilFindOneMock.mockResolvedValue({ IdPerfil: 1, Descripcion: "Perfil 1" });

  // ✅ Simula que no existe un candidato con ese nombre
  candidatosFindOneMock.mockResolvedValue(null);

  // ✅ Simula que el candidato se guarda correctamente
  saveMock.mockResolvedValue(true);

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

  expect(candidatosFindOneMock).toHaveBeenCalledWith({ Nombre: "Candidato Prueba" });
  expect(saveMock).toHaveBeenCalled();
});
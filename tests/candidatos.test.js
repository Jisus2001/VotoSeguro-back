import { jest } from "@jest/globals";


// mock del módulo completo
jest.unstable_mockModule('../Servicios/Schemas/Candidatos.js', () => {
  // Mock de la clase constructor
  const saveMock = jest.fn();
  const constructorMock = jest.fn(() => ({
    save: saveMock,
  }));

  constructorMock.findOne = jest.fn();
  constructorMock.deleteOne = jest.fn();

  return {
    default: constructorMock,
    __esModule: true,
  };
});



jest.unstable_mockModule("../Servicios/Schemas/PerfilesElecciones.js", () => ({
  default: {
    findOne: jest.fn(),
  }
}));
let agregarCandidato;
let Candidatos;
let PerfilesElecciones;

beforeAll(async () => {
  ({ agregarCandidato } = await import('../Servicios/Controllers/Candidatos.js'));
  ({ default: Candidatos } = await import('../Schemas/Candidatos.js'));
  ({ default: PerfilesElecciones } = await import('../Schemas/PerfilesElecciones.js'));
});

beforeEach(() => {
  jest.clearAllMocks();
});

test('Debería agregar candidato correctamente', async () => {
  PerfilesElecciones.findOne.mockResolvedValue({ IdPerfil: 1, Descripcion: 'Perfil 1' });
  Candidatos.findOne.mockResolvedValue(null);

  // Como save es la función mock del constructor
  Candidatos.mockImplementation(() => ({
    save: jest.fn().mockResolvedValue(true),
  }));

  const req = {
    body: {
      Nombre: 'Candidato Prueba',
      Partido: 'Partido XYZ',
      PerfilId: 1,
    },
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  await agregarCandidato(req, res);

  expect(res.status).toHaveBeenCalledWith(201);
  expect(res.json).toHaveBeenCalledWith({ mensaje: 'Candidato agregado correctamente' });
});


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
  ({ default: Candidatos } = await import('../Servicios/Schemas/Candidatos.js'));
  ({ default: PerfilesElecciones } = await import('../Servicios/Schemas/PerfilesElecciones.js'));
});

beforeEach(() => {
  jest.clearAllMocks();
});

test('Debería agregar candidato correctamente', async () => {
  PerfilesElecciones.findOne.mockResolvedValue({ IdPerfil: 1, Descripcion: 'Perfil 1' });
  Candidatos.findOne.mockResolvedValue(null);

  const saveMock = jest.fn().mockResolvedValue(true);

  Candidatos.mockImplementation(() => ({
    save: saveMock,
  }));

  const data = {
    Nombre: 'Candidato Prueba',
    Partido: 'Partido XYZ',
    PerfilId: 1,
  };

  const resultado = await agregarCandidato(data);

  expect(resultado).toEqual({
    success: true,
    status: 200,
    mensaje: 'Candidato agregado correctamente',
  });

  expect(Candidatos.findOne).toHaveBeenCalledWith({ Nombre: 'Candidato Prueba' });
  expect(saveMock).toHaveBeenCalled();
});



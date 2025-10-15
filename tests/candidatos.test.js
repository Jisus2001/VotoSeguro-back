/**
 * @file candidatos.S-07.test.js
 * @description S-07 Validación de Entradas (Backend) - Inyección de código en campos de texto
 */

import { jest } from "@jest/globals";

// Mock ESM del modelo de Candidatos
jest.unstable_mockModule("../Servicios/Schemas/Candidatos.js", () => ({
  default: {
    create: jest.fn(),
  },
}));

let crearCandidato;
let Candidatos;

describe("S-07 Validación de Entradas - Inyección de código en campos de texto", () => {
  beforeAll(async () => {
    // Importar dinámicamente después de declarar el mock
    ({ default: Candidatos } = await import("../Servicios/Schemas/Candidatos.js"));
    ({ crearCandidato } = await import("../Servicios/Controllers/Candidatos.js"));
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("No debe almacenarse ni pasarse payload crudo con <script> en el nombre", async () => {
    // Payload malicioso de entrada
    const payloadMalicioso = {
      nombre: '<script>alert(1)</script>',
      partido: 'Partido Seguro',
      descripcion: 'Candidato de prueba'
    };

    // Preparar el mock para devolver lo que se guardaría (simulación)
    // No nos importa el retorno exacto del modelo, sólo capturar el argumento
    Candidatos.create.mockResolvedValue({
      id: "123",
      nombre: "sanitizado", // retorno simulado
      partido: payloadMalicioso.partido,
      descripcion: payloadMalicioso.descripcion,
    });

    // Ejecutar la función del controlador
    const resultado = await crearCandidato(payloadMalicioso);

    // 1) Se llamó a create exactamente una vez
    expect(Candidatos.create).toHaveBeenCalledTimes(1);

    // 2) Capturamos el argumento con el que se llamó a create
    const llamadoCon = Candidatos.create.mock.calls[0][0];

    // 3) El nombre pasado al modelo NO debe contener la etiqueta <script>
    expect(String(llamadoCon.nombre)).not.toMatch(/<script.*?>/i);
    expect(String(llamadoCon.nombre)).not.toContain("<script>");
    expect(String(llamadoCon.nombre)).not.toContain("</script>");

    // 4) Asegurarse de que el payload bruto no haya sido guardado tal cual
    expect(String(llamadoCon.nombre)).not.toBe(payloadMalicioso.nombre);

    // 5) La respuesta del controlador no debe contener el script crudo
    // Dependiendo de tu implementación, resultado puede tener forma { success, status, data, error }
    // Verificamos que en el campo data.nombre (si existe) NO esté el script crudo
    if (resultado && resultado.data && resultado.data.nombre) {
      expect(String(resultado.data.nombre)).not.toMatch(/<script.*?>/i);
    }

    // 6) Si el controlador devuelve un mensaje o el objeto creado, verificar que no incluya payload crudo
    const resultadoString = JSON.stringify(resultado);
    expect(resultadoString).not.toMatch(/<script.*?>/i);
  });

  test("Si no sanitiza en controlador, al menos no debe almacenarse crudo (defensa en profundidad)", async () => {
    // Otra prueba para asegurar que si el controlador no sanitiza, entonces el modelo no acepte tags (ejemplo defensivo)
    // Aquí simulamos que el controlador pasa el payload tal cual. Si tu controlador ya sanitiza, esta prueba
    // seguirá pasando (porque el primer test chequea explícitamente).
    const payload = { nombre: '<script>alert(2)</script>' };

    // Simulamos que el modelo rechaza payloads con <script> lanzando un error (por ejemplo, un validador del schema)
    Candidatos.create.mockRejectedValueOnce(new Error("Valor de 'nombre' inválido"));

    const resultado = await crearCandidato(payload);

    // Si el modelo rechazó por validar, el resultado no contiene script y se maneja el error
    const resultadoString = JSON.stringify(resultado);
    expect(resultadoString).not.toMatch(/<script.*?>/i);
  });
});

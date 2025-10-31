import { jest } from "@jest/globals";
import { GenericContainer } from "testcontainers";
import request from "supertest";

// Importacion dinamica para evitar problemas con ESM
let mongoose;
let app;
let Personas;
let Perfiles;
let Elecciones;
let Candidatos;

describe("Pruebas de integracion - Elecciones y Candidatos", () => {
  let container;
  let server;
  let perfil;

  beforeAll(async () => {
    jest.setTimeout(30000);

    // Importar módulos dinámicamente
    mongoose = (await import("mongoose")).default;
    app = (await import("../../app.js")).default;
    Personas = (await import("../../Servicios/Schemas/Personas.js")).default;
    Perfiles = (await import("../../Servicios/Schemas/PerfilesElecciones.js")).default;
    Elecciones = (await import("../../Servicios/Schemas/Elecciones.js")).default;
    Candidatos = (await import("../../Servicios/Schemas/Candidatos.js")).default;

    try {
      //  Inicia contenedor MongoDB
      container = await new GenericContainer("mongo:7")
        .withExposedPorts(27017)
        .start();

      const port = container.getMappedPort(27017);
      const host = container.getHost();
      const uri = `mongodb://${host}:${port}/test`;

      //  Conecta Mongoose
      await mongoose.connect(uri);

      //  Crea datos base
      perfil = await Perfiles.create({
        Descripcion: "Eleccion de representantes estudiantiles",
      });

      // Crea usuario admin (para sesi贸n)
      await Personas.create({
        Identificacion: "admin",
        Nombre: "Administrador",
        Contrasenna: "1234",
        Perfil: "Administrador",
        IntentosFallidos: 0,
      });

      //  Inicia servidor en puerto aleatorio
      server = app.listen(0);
    } catch (err) {
      console.error("Error iniciando contenedor o base de datos:", err);
      throw err;
    }
  });

  afterAll(async () => {
    if (mongoose) await mongoose.disconnect();
    if (container) await container.stop();
    if (server) await server.close();
  });

  // ---------------------------------------------------------
  //  TEST 1 - Agregar candidato con perfil valido
  // ---------------------------------------------------------
  test("Debe permitir agregar un candidato con perfil valido", async () => {
    const res = await request(server)
      .post("/candidatos/Agregar")
      .send({
        Nombre: "Rafael Perez",
        Partido: "Partido Democratico",
        PerfilId: 1,
      });

    expect(res.status).toBe(201);
    expect(res.body.mensaje).toBeDefined();

    const candidato = await Candidatos.findOne({ Nombre: "Rafael Perez" });
    expect(candidato).not.toBeNull();
  });

  // ---------------------------------------------------------
  // З TEST 2 - Error si perfil no existe
  // ---------------------------------------------------------
  test("Debe rechazar un candidato si el perfil no existe", async () => {
    const res = await request(server)
      .post("/candidatos/Agregar")
      .send({
        Nombre: "Luis Mora",
        Partido: "Partido Independiente",
        PerfilId: 99,
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("El perfil especificado no existe");
  });

  // ---------------------------------------------------------
  // З TEST 3 - Error si candidato ya existe
  // ---------------------------------------------------------
  test("Debe rechazar un candidato repetido", async () => {
    await Candidatos.create({
      Nombre: "Duplicado",
      Partido: "Partido X",
      PerfilId: 1
    });

    const res = await request(server)
      .post("/candidatos/Agregar")
      .send({
        Nombre: "Rafael Perez",
        Partido: "Partido Democratico",
        PerfilId: 1,
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Ya existe un candidato con ese nombre");
  });

  // ---------------------------------------------------------
  // З TEST 4 - Crear una eleccin 
  // ---------------------------------------------------------
  test("Debe agregar una eleccion correctamente", async () => {
    const nuevaEleccion = {
      "Nombre": "Elecciones Estudiantiles 2025",
      "SedeId": 1,
      "PerfilId": 81,
      "FechaInicio": "2025-10-05T08:00:00.000Z",
      "FechaFin": "2025-10-15T18:00:00.000Z"
    };

    const res = await request(server)
      .post("/elecciones/Agregar")
      .send(nuevaEleccion);

    expect(res.status).toBe(201);
    expect(res.body.mensaje).toBe("Agregado correctamente");

    const elecciones = await Elecciones.find();
    expect(elecciones).toHaveLength(1);
    expect(elecciones[0].Nombre).toBe(nuevaEleccion.Nombre);
  });

  // ---------------------------------------------------------
  // З TEST 5 - Abrir eleccin 
  // ---------------------------------------------------------
  test("Debe abrir una eleccion correctamente", async () => {
    const elecciones = await Elecciones.find();
    const eleccionId = elecciones[0]._id.toString();
    
    const res = await request(server)
      .put("/elecciones/Abrir/" + eleccionId);

    expect(res.status).toBe(200);
    expect(res.body.mensaje).toBeDefined();

    const actualizada = await Elecciones.findById(elecciones[0]._id);
    expect(actualizada.Activa).toBe(true);
  });

  // ---------------------------------------------------------
  // З TEST 6 - Aplicar Votos 
  // ---------------------------------------------------------
  test("Debe aplicar votos correctamente", async () => {
    const elecciones = await Elecciones.find();
    const eleccionId = elecciones[0]._id.toString();
    const candidato = await Candidatos.findOne({ Nombre: "Rafael Perez" });
    const candidatoId = candidato._id.toString();
    
    const res = await request(server)
      .post("/votos/Registrar/")
      .send({
        "Identificacion": "admin",
        "EleccionId": eleccionId,
        "CandidatoId": candidatoId
      });

    expect(res.status).toBe(200);
    expect(res.body.mensaje).toBeDefined();
  });

  // ---------------------------------------------------------
  // 1З TEST 7 - Cerrar eleccion (úlltimo paso)
  // ---------------------------------------------------------
  test("Debe cerrar una eleccion correctamente", async () => {
    const elecciones = await Elecciones.find();
    const eleccionId = elecciones[0]._id.toString();
    
    const res = await request(server)
      .put("/elecciones/Cerrar/" + eleccionId);

    expect(res.status).toBe(200);
    expect(res.body.mensaje).toBeDefined();

    const actualizada = await Elecciones.findById(elecciones[0]._id);
    expect(actualizada.Activa).toBe(false);
  });
});

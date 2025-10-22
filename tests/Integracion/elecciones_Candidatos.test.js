import { GenericContainer } from "testcontainers";
import mongoose from "mongoose";
import request from "supertest";
import app from "../../app.js";

// Importa tus modelos reales
import Personas from "../../Servicios/Schemas/Personas.js";
import Perfiles from "../../Servicios/Schemas/PerfilesElecciones.js";
import Elecciones from "../../Servicios/Schemas/Elecciones.js";
import Candidatos from "../../Servicios/Schemas/Candidatos.js";

describe("Pruebas de integración - Elecciones y Candidatos", () => {
  let container;
  let server;
  let perfil;
  let eleccionCerrada;

  beforeAll(async () => {
    jest.setTimeout(60000); // 60 segundos

    // 🔹 Inicia contenedor MongoDB
    container = await new GenericContainer("mongo:7")
      .withExposedPorts(27017)
      .start();

    const port = container.getMappedPort(27017);
    const host = container.getHost();
    const uri = `mongodb://${host}:${port}/test`;

    // 🔹 Conecta Mongoose
    await mongoose.connect(uri);

    // 🔹 Crea datos base
    perfil = await Perfiles.create({
      Descripcion: "Elección de representantes estudiantiles",
    });

  

    // 🔹 Crea usuario admin (para sesión)
    await Personas.create({
      Identificacion: "admin",
      Nombre: "Administrador",
      Contrasenna: "1234",
      Perfil: "Administrador",
      IntentosFallidos: 0,
    });

    // 🔹 Inicia servidor en puerto aleatorio
    server = app.listen(0);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    if (container) await container.stop();
    if (server) await server.close();
  });

  // ---------------------------------------------------------
  // 🧩 TEST 1 - Agregar candidato con perfil válido
  // ---------------------------------------------------------
  test("Debe permitir agregar un candidato con perfil válido", async () => {
    const res = await request(server)
      .post("/candidatos/Agregar")
      .send({
        Nombre: "Rafael Pérez",
        Partido: "Partido Democrático",
        PerfilId: 1,
      });

    expect(res.status).toBe(201);
    expect(res.body.mensaje).toBeDefined();

    const candidato = await Candidatos.findOne({ Nombre: "Rafael Pérez" });
    expect(candidato).not.toBeNull();
  });

  // ---------------------------------------------------------
  // 🧩 TEST 2 - Error si perfil no existe
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
  // 🧩 TEST 3 - Error si candidato ya existe
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
        Nombre: "Rafael Pérez",
        Partido: "Partido Democrático",
        PerfilId: 1,
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Ya existe un candidato con ese nombre");
  });


    // ---------------------------------------------------------
  // 🧩 TEST 4 - Crear una elección 
  // ---------------------------------------------------------
  test("Debe agregar una elección correctamente", async () => {
    const nuevaEleccion = {
    "Nombre": "Elecciones Estudiantiles 2025",
    "SedeId": 1,
    "PerfilId": 81,
    "FechaInicio": "2025-10-05T08:00:00.000Z",
    "FechaFin": "2025-10-15T18:00:00.000Z"
}

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
  // 🧩 TEST 5 - Abrir elección 
  // ---------------------------------------------------------
  test("Debe abrir una elección correctamente", async () => {
     const elecciones = await Elecciones.find();
     const eleccionId = elecciones[0]._id.toString();
    const res = await request(server)
      .put("/elecciones/Abrir/" + eleccionId)

    expect(res.status).toBe(200);
    expect(res.body.mensaje).toBeDefined();

    const actualizada = await Elecciones.findById(elecciones[0]._id);
    expect(actualizada.Activa).toBe(true);
  });

   // ---------------------------------------------------------
  // 🧩 TEST 6 - Aplicar Votos 
  // ---------------------------------------------------------
  test("Debe aplicar votos correctamente", async () => {
     const elecciones = await Elecciones.find();
     const eleccionId = elecciones[0]._id.toString();
     const candidato = await Candidatos.findOne({ Nombre: "Rafael Pérez" });
     const candidatoId = candidato._id.toString();
    const res = await request(server)
      .post("/votos/Registrar/")
      .send({
  "Identificacion": "admin",
  "EleccionId":eleccionId,
  "CandidatoId": candidatoId
});

    expect(res.status).toBe(200);
    expect(res.body.mensaje).toBeDefined();
  });

 
  // ---------------------------------------------------------
  // 🧩 TEST 7 - Cerrar elección (último paso)
  // ---------------------------------------------------------
  test("Debe abrir una elección correctamente", async () => {
     const elecciones = await Elecciones.find();
     const eleccionId = elecciones[0]._id.toString();
    const res = await request(server)
      .put("/elecciones/Cerrar/" + eleccionId)

    expect(res.status).toBe(200);
    expect(res.body.mensaje).toBeDefined();

    const actualizada = await Elecciones.findById(elecciones[0]._id);
    expect(actualizada.Activa).toBe(false);
  });

  });




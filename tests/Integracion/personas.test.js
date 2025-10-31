import { jest } from "@jest/globals";
import { GenericContainer } from "testcontainers";
import request from "supertest";

// 🔑 Importación dinámica para evitar problemas con ESM
let mongoose;
let app;
let Personas;

describe("Pruebas de integración - Personas / ValidarSesion", () => {
  let container;
  let server;

  beforeAll(async () => {
    jest.setTimeout(30000);

    // Importar módulos dinámicamente
    mongoose = (await import("mongoose")).default;
    app = (await import("../../app.js")).default;
    Personas = (await import("../../Servicios/Schemas/Personas.js")).default;

    try {
      container = await new GenericContainer("mongo:7")
        .withExposedPorts(27017)
        .start();

      const port = container.getMappedPort(27017);
      const host = container.getHost();
      const uri = `mongodb://${host}:${port}/test`;

      await mongoose.connect(uri);

      await Personas.create({
        Identificacion: "admin",
        Nombre: "Administrador",
        Contrasenna: "1234",
        Perfil: "admin",
        IntentosFallidos: 0,
      });

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

  test("Login correcto devuelve token", async () => {
    const res = await request(server)
      .post("/personas/ValidarSesion")
      .send({ Identificacion: "admin", Contrasenna: "1234" });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});

import { GenericContainer } from "testcontainers";
import mongoose from "mongoose";
import request from "supertest";
import app from "../../app.js";
import Personas from "../../Servicios/Schemas/Personas.js";

// 🔑 Esta línea hace que Testcontainers use Docker Desktop en Windows
process.env.TESTCONTAINERS_HOST_OVERRIDE = "host.docker.internal";

describe("Pruebas de integración - Personas / ValidarSesion", () => {
  let container;
  let server;

  beforeAll(async () => {
   jest.setTimeout(60000); // 60 segundos


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
    }
  });

  afterAll(async () => {
    await mongoose.disconnect();
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

import express from "express";
const router = express.Router();
import Personas from "../Schemas/Personas.js";

router.get("/Listar", async (req, res) => {
  console.log(Personas);
  const personas = await Personas.find();
  res.status(200).json(personas);
});

router.get("/ObtenerPersona/:Identificacion", async (req, res) => {
  console.log(Personas);
  const personas = await Personas.findOne({
    Identificacion: req.params.Identificacion,
  });
  res.status(200).json(personas);
});

router.post("/Agregar", async (req, res) => {
  const persona = new Personas(req.body);
  persona
    .save()
    .then((doc) => res.json({ mensaje: "Agregado correctamente" }))
    .catch((err) => {
      console.error(err);
      res.json({ error: "Error al guardar" });
    });
});

router.put("/Actualizar", async (req, res) => {
  const persona = req.body;
  Personas.updateOne(
    { Identificacion: persona.Identificacion },
    { $set: persona },
    { runValidators: true }
  )
    .then((doc) => res.json({ mensaje: "Guardado correctamente" }))
    .catch((err) => {
      console.error(err);
      res.json({ error: "Error al guardar" });
    });
});

router.delete("/Eliminar/:Identificacion", async (req, res) => {
  const resultado = await Personas.deleteOne({
    Identificacion: req.params.Identificacion,
  });

  if (resultado.deletedCount === 0) {
    return res.status(404).json({ error: "Persona no encontrada" });
  }

  res.json({ mensaje: "Persona eliminada correctamente" });
});

router.post("/ValidarSesion", async (req, res) => {
  const persona = await Personas.findOne({
    Identificacion: req.body.Identificacion,
  });

  if (!persona || persona.Contrasenna !== req.body.Contrasenna) {
    return res.status(401).json({ mensaje: "Credenciales incorrectas" });
  }

  return res.status(200).json({ mensaje: "Inicio de sesión exitoso" });
});

export default router;

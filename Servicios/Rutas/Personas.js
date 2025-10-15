import express from "express";
import * as personasController from "../Controllers/Personas.js";

const router = express.Router();

// Listar todas las personas
router.get("/Listar", async (req, res) => {
    const resultado = await personasController.listarPersonas();
    if (resultado.success) {
        res.json(resultado.data);
    } else {
        res.status(500).json({ error: resultado.error });
    }
});

// Obtener una persona por identificación
router.get("/ObtenerPersona/:Identificacion", async (req, res) => {
    const resultado = await personasController.obtenerPersona(req.params.Identificacion);
    if (resultado.success) {
        res.json(resultado.data);
    } else {
        res.status(404).json({ error: resultado.error });
    }
});

// Agregar una nueva persona
router.post("/Agregar", async (req, res) => {
    const resultado = await personasController.agregarPersona(req.body);
    if (resultado.success) {
        res.status(201).json({ mensaje: resultado.mensaje });
    } else {
        res.status(400).json({ error: resultado.error });
    }
});

// Actualizar una persona
router.put("/Actualizar", async (req, res) => {
    const resultado = await personasController.actualizarPersona(req.body);
    if (resultado.success) {
        res.json({ mensaje: resultado.mensaje });
    } else {
        res.status(400).json({ error: resultado.error });
    }
});

// Eliminar una persona
router.delete("/Eliminar/:Identificacion", async (req, res) => {
    const resultado = await personasController.eliminarPersona(req.params.Identificacion);
    if (resultado.success) {
        res.json({ mensaje: resultado.mensaje });
    } else {
        res.status(404).json({ error: resultado.error });
    }
});

// Validar sesión
router.post("/ValidarSesion", async (req, res) => {
    const resultado = await personasController.validarSesion(req.body);
    if (resultado.success) {
        res.status(resultado.status).json(resultado.data);
    } else {
        res.status(resultado.status).json({ error: resultado.error });
    }
});

export default router;
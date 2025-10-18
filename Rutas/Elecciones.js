import express from "express";
import * as eleccionesController from "../Servicios/Controllers/Elecciones.js";

const router = express.Router();

// Listar todas
router.get("/Listar", async (req, res) => {
    const resultado = await eleccionesController.listarElecciones(req.user);
    resultado.success ? res.json(resultado.data) : res.status(500).json({ error: resultado.error });
});

// Listar vigentes
router.get("/Vigentes", async (req, res) => {
    const resultado = await eleccionesController.listarVigentes();
    resultado.success ? res.json(resultado.data) : res.status(500).json({ error: resultado.error });
});

// Obtener por ID
router.get("/ObtenerEleccion/:id", async (req, res) => {
    const resultado = await eleccionesController.obtenerEleccion(req.params.id);
    resultado.success ? res.json(resultado.data) : res.status(404).json({ error: resultado.error });
});

// Agregar
router.post("/Agregar", async (req, res) => {
    const resultado = await eleccionesController.agregarEleccion(req.body);
    resultado.success ? res.status(201).json({ mensaje: resultado.mensaje }) : res.status(400).json({ error: resultado.error });
});

// Actualizar
router.put("/Actualizar/:id", async (req, res) => {
    const resultado = await eleccionesController.actualizarEleccion(req.params.id, req.body);
    resultado.success ? res.json({ mensaje: resultado.mensaje }) : res.status(400).json({ error: resultado.error });
});

// Eliminar
router.delete("/Eliminar/:id", async (req, res) => {
    const resultado = await eleccionesController.eliminarEleccion(req.params.id);
    resultado.success ? res.json({ mensaje: resultado.mensaje }) : res.status(404).json({ error: resultado.error });
});

// Agregar candidato
router.post("/AgregarCandidato/:id", async (req, res) => {
    const resultado = await eleccionesController.agregarCandidato(req.params.id, req.body.NombreCandidato);
    if (resultado.success) res.json({ mensaje: resultado.mensaje });
    else res.status(400).json({ error: resultado.error, elecciones: resultado.elecciones });
});

// Eliminar candidato
router.delete("/EliminarCandidato/:id/:nombreCandidato", async (req, res) => {
    const resultado = await eleccionesController.eliminarCandidato(req.params.id, req.params.nombreCandidato);
    resultado.success ? res.json({ mensaje: resultado.mensaje }) : res.status(404).json({ error: resultado.error });
});

export default router;

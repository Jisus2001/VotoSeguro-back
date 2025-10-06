import express from "express";
const router = express.Router();
import Sedes from '../Schemas/Sedes.js';

// Obtener todas las sedes
router.get("/Listar", async (req, res) => {
    try {
        const sedes = await Sedes.find();
        res.json(sedes);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener las sedes" });
    }
});

// Obtener una sede por IdSede
router.get("/ObtenerSede/:idSede", async (req, res) => {
    try {
        const sede = await Sedes.findOne({ IdSede: req.params.idSede });
        if (sede) {
            res.json(sede);
        } else {
            res.status(404).json({ error: "Sede no encontrada" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error al obtener la sede" });
    }
});

// Crear una nueva sede
router.post("/Agregar", async (req, res) => {
    const sede = new Sedes({
        Nombre: req.body.Nombre
    });

    try {
        await sede.save();
        res.status(201).json({ mensaje: "Agregado correctamente" });
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({ error: "Ya existe una sede con ese nombre" });
        } else {
            res.status(400).json({ error: "Error al guardar" });
        }
    }
});

// Actualizar una sede
router.put("/Actualizar/:idSede", async (req, res) => {
    try {
        const sede = await Sedes.findOne({ IdSede: req.params.idSede });
        if (sede) {
            sede.Nombre = req.body.Nombre || sede.Nombre;

            try {
                await sede.save();
                res.json({ mensaje: "Guardado correctamente" });
            } catch (error) {
                if (error.code === 11000) {
                    res.status(400).json({ error: "Ya existe una sede con ese nombre" });
                } else {
                    res.status(400).json({ error: "Error al guardar" });
                }
            }
        } else {
            res.status(404).json({ error: "Sede no encontrada" });
        }
    } catch (error) {
        res.status(400).json({ error: "Error al guardar" });
    }
});

// Eliminar una sede
router.delete("/Eliminar/:idSede", async (req, res) => {
    try {
        const resultado = await Sedes.deleteOne({ IdSede: req.params.idSede });
        if (resultado.deletedCount === 0) {
            return res.status(404).json({ error: "Sede no encontrada" });
        }
        res.json({ mensaje: "Sede eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar" });
    }
});

export default router;
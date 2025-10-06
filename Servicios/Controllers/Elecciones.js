import express from "express";
const router = express.Router();
import Elecciones from '../Schemas/Elecciones.js';
import Sedes from '../Schemas/Sedes.js';

// Obtener todas las elecciones
router.get("/Listar", async (req, res) => {
    try {
        const elecciones = await Elecciones.find();
        
        // Para cada elección, buscar su sede manualmente
        const eleccionesConSedes = await Promise.all(elecciones.map(async (eleccion) => {
            const eleccionObj = eleccion.toObject();
            const sede = await Sedes.findOne({ IdSede: eleccion.SedeId });
            
            if (sede) {
                eleccionObj.Sede = {
                    IdSede: sede.IdSede,
                    Nombre: sede.Nombre
                };
                delete eleccionObj.SedeId;
            }
            
            return eleccionObj;
        }));
        
        res.json(eleccionesConSedes);
    } catch (error) {
        console.error('Error al obtener elecciones:', error);
        res.status(500).json({ error: "Error al obtener las elecciones" });
    }
});

// Obtener elecciones vigentes
router.get("/Vigentes", async (req, res) => {
    try {
        const fechaActual = new Date();
        const elecciones = await Elecciones.find({
            FechaInicio: { $lte: fechaActual },  // Fecha de inicio menor o igual a la actual
            FechaFin: { $gte: fechaActual }      // Fecha de fin mayor o igual a la actual
        });
        
        // Para cada elección, buscar su sede manualmente
        const eleccionesConSedes = await Promise.all(elecciones.map(async (eleccion) => {
            const eleccionObj = eleccion.toObject();
            const sede = await Sedes.findOne({ IdSede: eleccion.SedeId });
            
            if (sede) {
                eleccionObj.Sede = {
                    IdSede: sede.IdSede,
                    Nombre: sede.Nombre
                };
                delete eleccionObj.SedeId;
            }
            
            return eleccionObj;
        }));
        
        res.json(eleccionesConSedes);
    } catch (error) {
        console.error('Error al obtener elecciones vigentes:', error);
        res.status(500).json({ error: "Error al obtener las elecciones vigentes" });
    }
});

// Obtener una elección por ID
router.get("/ObtenerEleccion/:id", async (req, res) => {
    try {
        const eleccion = await Elecciones.findById(req.params.id);
        if (eleccion) {
            const eleccionObj = eleccion.toObject();
            const sede = await Sedes.findOne({ IdSede: eleccion.SedeId });
            
            if (sede) {
                eleccionObj.Sede = {
                    IdSede: sede.IdSede,
                    Nombre: sede.Nombre
                };
                delete eleccionObj.SedeId;
            }
            
            res.json(eleccionObj);
        } else {
            res.status(404).json({ error: 'Elección no encontrada' });
        }
    } catch (error) {
        console.error('Error al obtener elección:', error);
        res.status(500).json({ error: 'Error al obtener la elección' });
    }
});

// Crear una nueva elección
router.post("/Agregar", async (req, res) => {
    try {
        const eleccion = new Elecciones({
            Nombre: req.body.Nombre,
            SedeId: req.body.SedeId,
            FechaInicio: req.body.FechaInicio,
            FechaFin: req.body.FechaFin
        });

        await eleccion.save();
        res.status(201).json({ mensaje: "Agregado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: "Error al guardar la elección" });
    }
});

// Actualizar una elección
router.put("/Actualizar/:id", async (req, res) => {
    try {
        const eleccion = await Elecciones.findById(req.params.id);
        if (eleccion) {
            eleccion.Nombre = req.body.Nombre || eleccion.Nombre;
            eleccion.SedeId = req.body.SedeId || eleccion.SedeId;
            eleccion.FechaInicio = req.body.FechaInicio || eleccion.FechaInicio;
            eleccion.FechaFin = req.body.FechaFin || eleccion.FechaFin;

            await eleccion.save();
            res.json({ mensaje: "Guardado correctamente" });
        } else {
            res.status(404).json({ error: "Elección no encontrada" });
        }
    } catch (error) {
        res.status(400).json({ error: "Error al guardar" });
    }
});

// Eliminar una elección
router.delete("/Eliminar/:id", async (req, res) => {
    try {
        const resultado = await Elecciones.deleteOne({ _id: req.params.id });
        if (resultado.deletedCount === 0) {
            return res.status(404).json({ error: "Elección no encontrada" });
        }
        res.json({ mensaje: "Elección eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar" });
    }
});

export default router;
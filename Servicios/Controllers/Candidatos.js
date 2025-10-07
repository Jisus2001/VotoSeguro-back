import express from "express";
const router = express.Router();
import Candidatos from '../Schemas/Candidatos.js';
import PerfilesElecciones from '../Schemas/PerfilesElecciones.js';

// Obtener todos los candidatos
router.get("/Listar", async (req, res) => {
    try {
        const candidatos = await Candidatos.find();
        
        // Para cada candidato, buscar su perfil
        const candidatosCompletos = await Promise.all(candidatos.map(async (candidato) => {
            const candidatoObj = candidato.toObject();
            
            // Obtener perfil
            const perfil = await PerfilesElecciones.findOne({ IdPerfil: candidato.PerfilId });
            if (perfil) {
                candidatoObj.Perfil = {
                    IdPerfil: perfil.IdPerfil,
                    Descripcion: perfil.Descripcion
                };
                delete candidatoObj.PerfilId;
            }
            
            return candidatoObj;
        }));
        
        res.json(candidatosCompletos);
    } catch (error) {
        console.error('Error al obtener candidatos:', error);
        res.status(500).json({ error: "Error al obtener los candidatos" });
    }
});

// Obtener un candidato por nombre
router.get("/ObtenerCandidato/:nombre", async (req, res) => {
    try {
        const candidato = await Candidatos.findOne({ Nombre: req.params.nombre });
        if (candidato) {
            const candidatoObj = candidato.toObject();
            
            // Obtener perfil
            const perfil = await PerfilesElecciones.findOne({ IdPerfil: candidato.PerfilId });
            if (perfil) {
                candidatoObj.Perfil = {
                    IdPerfil: perfil.IdPerfil,
                    Descripcion: perfil.Descripcion
                };
                delete candidatoObj.PerfilId;
            }
            
            res.json(candidatoObj);
        } else {
            res.status(404).json({ error: 'Candidato no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener candidato:', error);
        res.status(500).json({ error: 'Error al obtener el candidato' });
    }
});

// Crear un nuevo candidato
router.post("/Agregar", async (req, res) => {
    try {
        // Verificar si el perfil existe
        const perfil = await PerfilesElecciones.findOne({ IdPerfil: req.body.PerfilId });
        if (!perfil) {
            return res.status(400).json({ error: "El perfil especificado no existe" });
        }

        // Verificar si ya existe un candidato con el mismo nombre
        const candidatoExistente = await Candidatos.findOne({ Nombre: req.body.Nombre });
        if (candidatoExistente) {
            return res.status(400).json({ error: "Ya existe un candidato con ese nombre" });
        }

        const candidato = new Candidatos({
            Nombre: req.body.Nombre,
            Partido: req.body.Partido,
            PerfilId: req.body.PerfilId
        });

        await candidato.save();
        res.status(201).json({ mensaje: "Candidato agregado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: "Error al guardar el candidato" });
    }
});

// Actualizar un candidato
router.put("/Actualizar/:nombre", async (req, res) => {
    try {
        // Si se está actualizando el perfil, verificar que exista
        if (req.body.PerfilId) {
            const perfil = await PerfilesElecciones.findOne({ IdPerfil: req.body.PerfilId });
            if (!perfil) {
                return res.status(400).json({ error: "El perfil especificado no existe" });
            }
        }

        const candidato = await Candidatos.findOne({ Nombre: req.params.nombre });
        if (candidato) {
            candidato.Nombre = req.body.Nombre || candidato.Nombre;
            candidato.Partido = req.body.Partido || candidato.Partido;
            candidato.PerfilId = req.body.PerfilId || candidato.PerfilId;

            await candidato.save();
            res.json({ mensaje: "Candidato actualizado correctamente" });
        } else {
            res.status(404).json({ error: "Candidato no encontrado" });
        }
    } catch (error) {
        res.status(400).json({ error: "Error al actualizar el candidato" });
    }
});

// Eliminar un candidato
router.delete("/Eliminar/:nombre", async (req, res) => {
    try {
        const resultado = await Candidatos.deleteOne({ Nombre: req.params.nombre });
        if (resultado.deletedCount === 0) {
            return res.status(404).json({ error: "Candidato no encontrado" });
        }
        res.json({ mensaje: "Candidato eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar el candidato" });
    }
});

export default router;
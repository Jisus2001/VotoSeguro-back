import express from "express";
const router = express.Router();
import Elecciones from '../Schemas/Elecciones.js';
import Sedes from '../Schemas/Sedes.js';
import Candidatos from '../Schemas/Candidatos.js';
import PerfilesElecciones from '../Schemas/PerfilesElecciones.js';

// Obtener todas las elecciones
router.get("/Listar", async (req, res) => {
    try {
        const elecciones = await Elecciones.find();
        
        // Para cada elección, buscar su sede y candidatos manualmente
        const eleccionesCompletas = await Promise.all(elecciones.map(async (eleccion) => {
            const eleccionObj = eleccion.toObject();
            
            // Obtener sede
            const sede = await Sedes.findOne({ IdSede: eleccion.SedeId });
            if (sede) {
                eleccionObj.Sede = {
                    IdSede: sede.IdSede,
                    Nombre: sede.Nombre
                };
                delete eleccionObj.SedeId;
            }

            // Obtener perfil
            const perfil = await PerfilesElecciones.findOne({ IdPerfil: eleccion.PerfilId });
            if (perfil) {
                eleccionObj.Perfil = {
                    IdPerfil: perfil.IdPerfil,
                    Descripcion: perfil.Descripcion
                };
                delete eleccionObj.PerfilId;
            }
            
            // Obtener candidatos
            if (eleccion.Candidatos && eleccion.Candidatos.length > 0) {
                const candidatos = await Promise.all(eleccion.Candidatos.map(async (nombreCandidato) => {
                    const candidato = await Candidatos.findOne({ Nombre: nombreCandidato });
                    return candidato ? candidato.toObject() : null;
                }));
                eleccionObj.Candidatos = candidatos.filter(c => c !== null);
            }
            
            return eleccionObj;
        }));
        
        res.json(eleccionesCompletas);
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
            
            // Obtener sede
            const sede = await Sedes.findOne({ IdSede: eleccion.SedeId });
            if (sede) {
                eleccionObj.Sede = {
                    IdSede: sede.IdSede,
                    Nombre: sede.Nombre
                };
                delete eleccionObj.SedeId;
            }

            // Obtener perfil
            const perfil = await PerfilesElecciones.findOne({ IdPerfil: eleccion.PerfilId });
            if (perfil) {
                eleccionObj.Perfil = {
                    IdPerfil: perfil.IdPerfil,
                    Descripcion: perfil.Descripcion
                };
                delete eleccionObj.PerfilId;
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

            // Obtener perfil
            const perfil = await PerfilesElecciones.findOne({ IdPerfil: eleccion.PerfilId });
            if (perfil) {
                eleccionObj.Perfil = {
                    IdPerfil: perfil.IdPerfil,
                    Descripcion: perfil.Descripcion
                };
                delete eleccionObj.PerfilId;
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
            FechaFin: req.body.FechaFin,
            PerfilId: req.body.PerfilId
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
            eleccion.PerfilId = req.body.PerfilId || eleccion.PerfilId;

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

// Agregar un candidato a una elección
router.post("/AgregarCandidato/:id", async (req, res) => {
    try {
        const eleccion = await Elecciones.findById(req.params.id);
        if (!eleccion) {
            return res.status(404).json({ error: "Elección no encontrada" });
        }

        const nombreCandidato = req.body.NombreCandidato;
        if (!nombreCandidato) {
            return res.status(400).json({ error: "El nombre del candidato es requerido" });
        }

        // Verificar si el candidato existe
        const candidato = await Candidatos.findOne({ Nombre: nombreCandidato });
        if (!candidato) {
            return res.status(404).json({ error: "Candidato no encontrado" });
        }

        // Verificar si el candidato ya está en esta elección
        if (eleccion.Candidatos.includes(nombreCandidato)) {
            return res.status(400).json({ error: "El candidato ya está registrado en esta elección" });
        }

        // Verificar que el candidato tenga el mismo perfil que la elección
        if (candidato.PerfilId !== eleccion.PerfilId) {
            return res.status(400).json({ error: "El perfil del candidato no coincide con el perfil de la elección" });
        }

        // Verificar si el candidato está en otras elecciones activas
        const fechaActual = new Date();
        const eleccionesActivas = await Elecciones.find({
            _id: { $ne: eleccion._id }, // Excluir la elección actual
            Candidatos: nombreCandidato,
            FechaFin: { $gte: fechaActual } // Elecciones que no han terminado
        });

        if (eleccionesActivas.length > 0) {
            return res.status(400).json({ 
                error: "El candidato ya está participando en otra elección activa",
                elecciones: eleccionesActivas.map(e => e.Nombre)
            });
        }

        // Agregar el candidato
        eleccion.Candidatos.push(nombreCandidato);
        await eleccion.save();

        res.json({ mensaje: "Candidato agregado correctamente" });
    } catch (error) {
        console.error('Error al agregar candidato:', error);
        res.status(500).json({ error: "Error al agregar el candidato" });
    }
});

// Eliminar un candidato de una elección
router.delete("/EliminarCandidato/:id/:nombreCandidato", async (req, res) => {
    try {
        const eleccion = await Elecciones.findById(req.params.id);
        if (!eleccion) {
            return res.status(404).json({ error: "Elección no encontrada" });
        }

        const nombreCandidato = req.params.nombreCandidato;
        
        // Verificar si el candidato está en la elección
        const index = eleccion.Candidatos.indexOf(nombreCandidato);
        if (index === -1) {
            return res.status(404).json({ error: "Candidato no encontrado en esta elección" });
        }

        // Eliminar el candidato
        eleccion.Candidatos.splice(index, 1);
        await eleccion.save();

        res.json({ mensaje: "Candidato eliminado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al eliminar el candidato" });
    }
});

export default router;
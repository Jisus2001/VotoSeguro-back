import express from "express";
const router = express.Router();

import {
    listarCandidatos,
    obtenerCandidato,
    agregarCandidato,
    actualizarCandidato,
    eliminarCandidato,
} from "../Controllers/Candidatos.js";

// Rutas

router.get("/Listar", async (req, res) => {
    try {
        const candidatos = await listarCandidatos();
        res.json(candidatos);
    } catch (error) {
        console.error("Error al obtener candidatos:", error);
        res.status(500).json({ error: "Error al obtener los candidatos" });
    }
});

router.get("/ObtenerCandidato/:nombre", async (req, res) => {
    try {
        const candidato = await obtenerCandidato(req.params.nombre);
        if (!candidato) {
            return res.status(404).json({ error: "Candidato no encontrado" });
        }
        res.json(candidato);
    } catch (error) {
        console.error("Error al obtener candidato:", error);
        res.status(500).json({ error: "Error al obtener el candidato" });
    }
});

router.post("/Agregar", async (req, res) => {
    try {
        const mensaje = await agregarCandidato(req.body);
        res.status(201).json({ mensaje });
    } catch (error) {
        if (error.message === "PerfilNoExiste") {
            return res.status(400).json({ error: "El perfil especificado no existe" });
        }
        if (error.message === "CandidatoExistente") {
            return res.status(400).json({ error: "Ya existe un candidato con ese nombre" });
        }
        console.error(error);
        res.status(400).json({ error: "Error al guardar el candidato" });
    }
});

router.put("/Actualizar/:nombre", async (req, res) => {
    try {
        const mensaje = await actualizarCandidato(req.params.nombre, req.body);
        res.json({ mensaje });
    } catch (error) {
        if (error.message === "PerfilNoExiste") {
            return res.status(400).json({ error: "El perfil especificado no existe" });
        }
        if (error.message === "CandidatoNoEncontrado") {
            return res.status(404).json({ error: "Candidato no encontrado" });
        }
        console.error(error);
        res.status(400).json({ error: "Error al actualizar el candidato" });
    }
});

router.delete("/Eliminar/:nombre", async (req, res) => {
    try {
        const mensaje = await eliminarCandidato(req.params.nombre);
        res.json({ mensaje });
    } catch (error) {
        if (error.message === "CandidatoNoEncontrado") {
            return res.status(404).json({ error: "Candidato no encontrado" });
        }
        console.error(error);
        res.status(500).json({ error: "Error al eliminar el candidato" });
    }
});

export default router;

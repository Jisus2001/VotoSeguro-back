import express from "express";
import {
    listarPerfiles,
    obtenerPerfil,
    agregarPerfil,
    actualizarPerfil,
    eliminarPerfil
} from "../Servicios/Controllers/PerfilesElecciones.js";

const router = express.Router();

router.get("/Listar", listarPerfiles);
router.get("/ObtenerPerfil/:id", obtenerPerfil);
router.post("/Agregar", agregarPerfil);
router.put("/Actualizar/:id", actualizarPerfil);
router.delete("/Eliminar/:id", eliminarPerfil);

export default router;

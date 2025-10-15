import PerfilesElecciones from '../Schemas/PerfilesElecciones.js';

export const listarPerfiles = async (req, res) => {
    try {
        const perfiles = await PerfilesElecciones.find();
        res.json(perfiles);
    } catch (error) {
        console.error('Error al obtener perfiles:', error);
        res.status(500).json({ error: "Error al obtener los perfiles" });
    }
};

export const obtenerPerfil = async (req, res) => {
    try {
        const perfil = await PerfilesElecciones.findOne({ IdPerfil: req.params.id });
        if (perfil) {
            res.json(perfil);
        } else {
            res.status(404).json({ error: "Perfil no encontrado" });
        }
    } catch (error) {
        console.error('Error al obtener perfil:', error);
        res.status(500).json({ error: "Error al obtener el perfil" });
    }
};

export const agregarPerfil = async (req, res) => {
    try {
        const perfil = new PerfilesElecciones({
            Descripcion: req.body.Descripcion
        });

        await perfil.save();
        res.status(201).json({ mensaje: "Agregado correctamente" });
    } catch (error) {
        console.error('Error al crear perfil:', error);
        res.status(400).json({ error: "Error al guardar el perfil" });
    }
};

export const actualizarPerfil = async (req, res) => {
    try {
        const perfil = await PerfilesElecciones.findOne({ IdPerfil: req.params.id });
        if (perfil) {
            perfil.Descripcion = req.body.Descripcion || perfil.Descripcion;

            await perfil.save();
            res.json({ mensaje: "Guardado correctamente" });
        } else {
            res.status(404).json({ error: "Perfil no encontrado" });
        }
    } catch (error) {
        console.error('Error al actualizar perfil:', error);
        res.status(400).json({ error: "Error al guardar el perfil" });
    }
};

export const eliminarPerfil = async (req, res) => {
    try {
        const resultado = await PerfilesElecciones.deleteOne({ IdPerfil: req.params.id });
        if (resultado.deletedCount === 0) {
            return res.status(404).json({ error: "Perfil no encontrado" });
        }
        res.json({ mensaje: "Perfil eliminado correctamente" });
    } catch (error) {
        console.error('Error al eliminar perfil:', error);
        res.status(500).json({ error: "Error al eliminar el perfil" });
    }
};

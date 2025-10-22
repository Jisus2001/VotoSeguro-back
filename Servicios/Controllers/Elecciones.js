import Elecciones from "../Schemas/Elecciones.js";
import Sedes from "../Schemas/Sedes.js";
import Candidatos from "../Schemas/Candidatos.js";
import PerfilesElecciones from "../Schemas/PerfilesElecciones.js";

// Función auxiliar para construir una elección completa
const construirEleccionCompleta = async (eleccion) => {
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

    // Obtener candidatos con sus perfiles
    if (eleccion.Candidatos && eleccion.Candidatos.length > 0) {
        const candidatos = await Promise.all(
            eleccion.Candidatos.map(async (nombreCandidato) => {
                const candidato = await Candidatos.findOne({ Nombre: nombreCandidato });
                if (candidato) {
                    const candidatoObj = candidato.toObject();
                    const perfilCandidato = await PerfilesElecciones.findOne({ IdPerfil: candidato.PerfilId });
                    if (perfilCandidato) {
                        candidatoObj.Perfil = {
                            IdPerfil: perfilCandidato.IdPerfil,
                            Descripcion: perfilCandidato.Descripcion
                        };
                        delete candidatoObj.PerfilId;
                    }
                    return candidatoObj;
                }
                return null;
            })
        );
        eleccionObj.Candidatos = candidatos.filter(c => c !== null);
    }

    return eleccionObj;
};

// Listar todas las elecciones
export const listarElecciones = async (user) => {
    try {
        console.log("Usuario en listarElecciones:", user);
        const elecciones = await Elecciones.find();
        const eleccionesCompletas = await Promise.all(elecciones.map(construirEleccionCompleta));
        return { success: true, data: eleccionesCompletas };
    } catch (error) {
        return { success: false, error: "Error al obtener las elecciones" };
    }
};

// Listar elecciones vigentes
export const listarVigentes = async () => {
    try {
        const fechaActual = new Date();
        const elecciones = await Elecciones.find({
            FechaInicio: { $lte: fechaActual },
            FechaFin: { $gte: fechaActual }
        });
        const eleccionesCompletas = await Promise.all(elecciones.map(construirEleccionCompleta));
        return { success: true, data: eleccionesCompletas };
    } catch (error) {
        return { success: false, error: "Error al obtener las elecciones vigentes" };
    }
};

// Obtener una elección por ID
export const obtenerEleccion = async (id) => {
    try {
        const eleccion = await Elecciones.findById(id);
        if (!eleccion) {
            return { success: false, error: "Elección no encontrada" };
        }
        const eleccionCompleta = await construirEleccionCompleta(eleccion);
        return { success: true, data: eleccionCompleta };
    } catch (error) {
        return { success: false, error: "Error al obtener la elección" };
    }
};

// Agregar una nueva elección
export const agregarEleccion = async (datos) => {
    try {
        const eleccion = new Elecciones({
            Nombre: datos.Nombre,
            SedeId: datos.SedeId,
            FechaInicio: datos.FechaInicio,
            FechaFin: datos.FechaFin,
            PerfilId: datos.PerfilId
        });
        await eleccion.save();
        return { success: true, mensaje: "Agregado correctamente" };
    } catch (error) {
        return { success: false, error: "Error al guardar la elección" };
    }
};

// Actualizar una elección
export const actualizarEleccion = async (id, datos) => {
    try {
        const eleccion = await Elecciones.findById(id);
        if (!eleccion) {
            return { success: false, error: "Elección no encontrada" };
        }

        eleccion.Nombre = datos.Nombre || eleccion.Nombre;
        eleccion.SedeId = datos.SedeId || eleccion.SedeId;
        eleccion.FechaInicio = datos.FechaInicio || eleccion.FechaInicio;
        eleccion.FechaFin = datos.FechaFin || eleccion.FechaFin;
        eleccion.PerfilId = datos.PerfilId || eleccion.PerfilId;

        await eleccion.save();
        return { success: true, mensaje: "Guardado correctamente" };
    } catch (error) {
        return { success: false, error: "Error al guardar la elección" };
    }
};

export const AbrirEleccion = async (id) => {
    try {
        const eleccion = await Elecciones.findById(id);
        if (!eleccion) return { success: false, error: "Elección no encontrada" };
        
        eleccion.Activa = true;
        await eleccion.save();
         return { success: true, mensaje: "Elección abierta correctamente" };   
    } catch (error) {
        return { success: false, error: "Error al abrir la elección" };
    }
};

export const CerrarEleccion = async (id) => {
    try {
        const eleccion = await Elecciones.findById(id);
        if (!eleccion) return { success: false, error: "Elección no encontrada" };
        eleccion.Activa = false;
        await eleccion.save();
        return { success: true, mensaje: "Elección cerrada correctamente" };
    } catch (error) {
        return { success: false, error: "Error al cerrar la elección" };
    }
};      

// Eliminar una elección
export const eliminarEleccion = async (id) => {
    try {
        const resultado = await Elecciones.deleteOne({ _id: id });
        if (resultado.deletedCount === 0) {
            return { success: false, error: "Elección no encontrada" };
        }
        return { success: true, mensaje: "Elección eliminada correctamente" };
    } catch (error) {
        return { success: false, error: "Error al eliminar la elección" };
    }
};

// Agregar candidato a una elección
export const agregarCandidato = async (id, nombreCandidato) => {
    try {
        const eleccion = await Elecciones.findById(id);
        if (!eleccion) return { success: false, error: "Elección no encontrada" };
        if (!nombreCandidato) return { success: false, error: "El nombre del candidato es requerido" };

        const candidato = await Candidatos.findOne({ Nombre: nombreCandidato });
        if (!candidato) return { success: false, error: "Candidato no encontrado" };

        if (eleccion.Candidatos.includes(nombreCandidato))
            return { success: false, error: "El candidato ya está registrado en esta elección" };

        if (candidato.PerfilId !== eleccion.PerfilId)
            return { success: false, error: "El perfil del candidato no coincide con el perfil de la elección" };

        const fechaActual = new Date();
        const eleccionesActivas = await Elecciones.find({
            _id: { $ne: eleccion._id },
            Candidatos: nombreCandidato,
            FechaFin: { $gte: fechaActual }
        });

        if (eleccionesActivas.length > 0)
            return {
                success: false,
                error: "El candidato ya está participando en otra elección activa",
                elecciones: eleccionesActivas.map(e => e.Nombre)
            };

        eleccion.Candidatos.push(nombreCandidato);
        await eleccion.save();

        return { success: true, mensaje: "Candidato agregado correctamente" };
    } catch (error) {
        return { success: false, error: "Error al agregar el candidato" };
    }
};

// Eliminar candidato de una elección
export const eliminarCandidato = async (id, nombreCandidato) => {
    try {
        const eleccion = await Elecciones.findById(id);
        if (!eleccion) return { success: false, error: "Elección no encontrada" };

        const index = eleccion.Candidatos.indexOf(nombreCandidato);
        if (index === -1) return { success: false, error: "Candidato no encontrado en esta elección" };

        eleccion.Candidatos.splice(index, 1);
        await eleccion.save();

        return { success: true, mensaje: "Candidato eliminado correctamente" };
    } catch (error) {
        return { success: false, error: "Error al eliminar el candidato" };
    }
};

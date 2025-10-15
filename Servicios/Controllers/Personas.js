import Personas from "../Schemas/Personas.js";

export const listarPersonas = async () => {
    try {
        const personas = await Personas.find();
        return { success: true, data: personas };
    } catch (error) {
        return { success: false, error: "Error al obtener las personas" };
    }
};

export const obtenerPersona = async (identificacion) => {
    try {
        const persona = await Personas.findOne({ Identificacion: identificacion });
        if (!persona) {
            return { success: false, error: "Persona no encontrada" };
        }
        return { success: true, data: persona };
    } catch (error) {
        return { success: false, error: "Error al obtener la persona" };
    }
};

export const agregarPersona = async (datosPersona) => {
    try {
        const persona = new Personas(datosPersona);
        await persona.save();
        return { success: true, mensaje: "Agregado correctamente" };
    } catch (error) {
        return { success: false, error: "Error al guardar" };
    }
};

export const actualizarPersona = async (datosPersona) => {
    try {
        const resultado = await Personas.updateOne(
            { Identificacion: datosPersona.Identificacion },
            { $set: datosPersona },
            { runValidators: true }
        );
        
        if (resultado.matchedCount === 0) {
            return { success: false, error: "Persona no encontrada" };
        }
        
        return { success: true, mensaje: "Guardado correctamente" };
    } catch (error) {
        return { success: false, error: "Error al guardar" };
    }
};

export const eliminarPersona = async (identificacion) => {
    try {
        const resultado = await Personas.deleteOne({ Identificacion: identificacion });
        
        if (resultado.deletedCount === 0) {
            return { success: false, error: "Persona no encontrada" };
        }
        
        return { success: true, mensaje: "Persona eliminada correctamente" };
    } catch (error) {
        return { success: false, error: "Error al eliminar la persona" };
    }
};

export const validarSesion = async (credenciales) => {
    try {
        const persona = await Personas.findOne({
            Identificacion: credenciales.Identificacion,
        });

        if (!persona || persona.Contrasenna !== credenciales.Contrasenna) {
            return { 
                success: false, 
                status: 441, 
                error: "Credenciales inválidas" 
            };
        }

        return {
            success: true,
            status: 200,
            data: {
                mensaje: "Inicio de sesión exitoso",
                nombre: persona.Nombre,
                rol: persona.Perfil,
            }
        };
    } catch (error) {
        return { 
            success: false, 
            status: 500, 
            error: "Error en el servidor" 
        };
    }
};
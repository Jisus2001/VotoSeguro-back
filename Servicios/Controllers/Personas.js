import Personas from "../Schemas/Personas.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

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

const generarToken = (usuario) => {
    const payload = {
        id: usuario._id,
        rol: usuario.Perfil,
        identificacion: usuario.Identificacion,
        nombre: usuario.Nombre
    };

    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '1h'
    });
};

export const validarSesion = async (credenciales) => {
     try {
        const persona = await Personas.findOne({
            Identificacion: credenciales.Identificacion,
        });

        // Si no existe el usuario, devolver mensaje genérico (sin revelar info)
        if (!persona) {
            return {
                success: false,
                status: 441,
                error: "Credenciales inválidas",
            };
        }

        const ahora = new Date();

        // Verificar si está bloqueado
        if (persona.BloqueadoHasta && persona.BloqueadoHasta > ahora) {
            return {
                success: false,
                status: 442, // Código de bloqueo temporal
                error: `Usuario bloqueado hasta ${persona.BloqueadoHasta.toLocaleTimeString()}`,
            };
        }

        // Si la contraseña es incorrecta
        if (persona.Contrasenna !== credenciales.Contrasenna) {
            let intentos = persona.IntentosFallidos + 1;
            let bloqueadoHasta = null;

            // Si alcanza el máximo de intentos
            if (intentos >= 3) {
                bloqueadoHasta = new Date(ahora.getTime() + 15 * 60000); // 15 minutos
                intentos = 0; // Reiniciar intentos después del bloqueo
            }

            await Personas.updateOne(
                { Identificacion: credenciales.Identificacion },
                { $set: { IntentosFallidos: intentos, BloqueadoHasta: bloqueadoHasta } }
            );

            return {
                success: false,
                status: 441,
                error: "Credenciales inválidas",
            };
        }

        // Si contraseña correcta y no está bloqueado: resetear estado
        await Personas.updateOne(
            { Identificacion: credenciales.Identificacion },
            { $set: { IntentosFallidos: 0, BloqueadoHasta: null } }
        );
        const token = generarToken(persona);

        return {
            success: true,
            status: 200,
            data: {
                mensaje: "Inicio de sesión exitoso",
              token,
                nombre: persona.Nombre,
                rol: persona.Perfil,
            },
        };
    } catch (error) {
        console.error("Error en validarSesion:", error);
        return {
            success: false,
            status: 500,
            error: "Error en el servidor",
        };
    }
};
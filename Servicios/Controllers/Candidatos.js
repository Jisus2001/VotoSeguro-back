import Candidatos from '../Schemas/Candidatos.js';
import PerfilesElecciones from '../Schemas/PerfilesElecciones.js';
import sanitizeHtml from "sanitize-html";


// Función para listar todos los candidatos con su perfil
export async function listarCandidatos() {
    const candidatos = await Candidatos.find();

    const candidatosCompletos = await Promise.all(candidatos.map(async (candidato) => {
        const candidatoObj = candidato.toObject();

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

    return candidatosCompletos;
}

// Obtener candidato por nombre con perfil
export async function obtenerCandidato(nombre) {
    const candidato = await Candidatos.findOne({ Nombre: nombre });
    if (!candidato) return null;

    const candidatoObj = candidato.toObject();
    const perfil = await PerfilesElecciones.findOne({ IdPerfil: candidato.PerfilId });
    if (perfil) {
        candidatoObj.Perfil = {
            IdPerfil: perfil.IdPerfil,
            Descripcion: perfil.Descripcion
        };
        delete candidatoObj.PerfilId;
    }

    return candidatoObj;
}

// Crear un nuevo candidato
export async function agregarCandidato(data) {
    // Sanitizar el nombre para prevenir inyección de código
    const nombreSanitizado = sanitizeHtml(data.Nombre, {
        allowedTags: [],
        allowedAttributes: {}
    });
      if (nombreSanitizado !== data.Nombre) {
        throw new Error("Nombre contiene código malicioso");
    }
    data.Nombre = nombreSanitizado;
    // Verificar perfil existe
    const perfil = await PerfilesElecciones.findOne({ IdPerfil: data.PerfilId });
    if (!perfil) {
        throw new Error("PerfilNoExiste");
    }

    // Verificar candidato duplicado
    const candidatoExistente = await Candidatos.findOne({ Nombre: data.Nombre });
    if (candidatoExistente) {
        throw new Error("CandidatoExistente");
    }

    const candidato = new Candidatos({
        Nombre: data.Nombre,
        Partido: data.Partido,
        PerfilId: data.PerfilId
    });

    await candidato.save();
    return "Candidato agregado correctamente";
}

// Actualizar candidato
export async function actualizarCandidato(nombre, data) {
    if (data.PerfilId) {
        const perfil = await PerfilesElecciones.findOne({ IdPerfil: data.PerfilId });
        if (!perfil) {
            throw new Error("PerfilNoExiste");
        }
    }

    const candidato = await Candidatos.findOne({ Nombre: nombre });
    if (!candidato) {
        throw new Error("CandidatoNoEncontrado");
    }

    candidato.Nombre = data.Nombre || candidato.Nombre;
    candidato.Partido = data.Partido || candidato.Partido;
    candidato.PerfilId = data.PerfilId || candidato.PerfilId;

    await candidato.save();
    return "Candidato actualizado correctamente";
}

// Eliminar candidato
export async function eliminarCandidato(nombre) {
    const resultado = await Candidatos.deleteOne({ Nombre: nombre });
    if (resultado.deletedCount === 0) {
        throw new Error("CandidatoNoEncontrado");
    }
    return "Candidato eliminado correctamente";
}

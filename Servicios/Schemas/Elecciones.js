import mongoose from 'mongoose';

const EleccionesSchema = mongoose.Schema(
    {
        Nombre: {
            type: String,
            required: true
        },
        SedeId: {
            type: Number,
            required: true,
            ref: 'Sedes',  // Referencia al schema de Sedes
            refPath: 'IdSede'  // Especifica que debe usar el campo IdSede para la referencia
        },
        FechaInicio: {
            type: Date,
            required: true
        },
        FechaFin: {
            type: Date,
            required: true
        },
        PerfilId: {
            type: Number,
            required: true,
            ref: 'PerfilesElecciones',  // Referencia al schema de PerfilesElecciones
            refPath: 'IdPerfil'  // Especifica que debe usar el campo IdPerfil para la referencia
        },
        Candidatos: {
            type: [{
                type: String,
                ref: 'Candidatos',  // Referencia al schema de Candidatos
                refPath: 'Nombre'   // Especifica que debe usar el campo Nombre para la referencia
            }],
            default: []  // Inicia como un array vacío
        }
    }
);

const Elecciones = mongoose.model('Elecciones', EleccionesSchema);

export default Elecciones;

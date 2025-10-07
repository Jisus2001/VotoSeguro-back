import mongoose from 'mongoose';

const CandidatosSchema = mongoose.Schema(
    {
        Nombre: {
            type: String,
            required: true,
            unique: true
        },
        Partido: {
            type: String,
            required: true
        },
        PerfilId: {
            type: Number,
            required: true,
            ref: 'PerfilesElecciones'  // Referencia al schema de PerfilesElecciones usando IdPerfil
        }
    }
);

const Candidatos = mongoose.model('Candidatos', CandidatosSchema);

export default Candidatos;
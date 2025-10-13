import mongoose from 'mongoose';

const VotosSchema = mongoose.Schema({
    Identificacion: { 
        type: String, 
        required: true, 
        ref: 'Personas' 
    },
    EleccionId: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true, 
        ref: 'Elecciones' 
    },
    CandidatoId: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true, 
        ref: 'Candidatos' 
    },
    Fecha: { 
        type: Date, 
        default: Date.now 
    }
});

const Votos = mongoose.model('Votos', VotosSchema);

export default Votos;
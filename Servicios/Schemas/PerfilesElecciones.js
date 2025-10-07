import mongoose from 'mongoose';

const PerfilesCounterSchema = mongoose.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 }
});

const PerfilesCounter = mongoose.model('PerfilesCounter', PerfilesCounterSchema);

const PerfilesEleccionesSchema = mongoose.Schema(
    {
        IdPerfil: {
            type: Number,
            unique: true
        },
        Descripcion: {
            type: String,
            required: true
        }
    }
);

// Middleware pre-save para auto-incrementar IdPerfil
PerfilesEleccionesSchema.pre('save', async function(next) {
    if (this.isNew) {
        try {
            const counter = await PerfilesCounter.findByIdAndUpdate(
                { _id: 'idPerfil' },
                { $inc: { seq: 1 } },
                { new: true, upsert: true }
            );
            this.IdPerfil = counter.seq;
            next();
        } catch (error) {
            return next(error);
        }
    } else {
        next();
    }
});

const PerfilesElecciones = mongoose.model('PerfilesElecciones', PerfilesEleccionesSchema);

export default PerfilesElecciones;
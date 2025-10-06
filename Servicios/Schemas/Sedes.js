import mongoose from 'mongoose';

const SedesCounterSchema = mongoose.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 }
});

const SedesCounter = mongoose.model('SedesCounter', SedesCounterSchema);

const SedesSchema = mongoose.Schema(
    {
        IdSede: {
            type: Number,
            unique: true
        },
        Nombre: {
            type: String,
            required: true,
            unique: true
        }
    }
);

// Middleware pre-save para auto-incrementar IdSede
SedesSchema.pre('save', async function(next) {
    if (this.isNew) {
        try {
            const counter = await SedesCounter.findByIdAndUpdate(
                { _id: 'idSede' },
                { $inc: { seq: 1 } },
                { new: true, upsert: true }
            );
            this.IdSede = counter.seq;
            next();
        } catch (error) {
            return next(error);
        }
    } else {
        next();
    }
});

const Sedes = mongoose.model('Sedes', SedesSchema);

export default Sedes;
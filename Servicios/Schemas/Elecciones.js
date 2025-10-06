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
        }
    }
);

const Elecciones = mongoose.model('Elecciones', EleccionesSchema);

export default Elecciones;

import mongoose from 'mongoose';

const PersonasSchema = mongoose.Schema(
    {
        Identificacion: {
            type: String,
            unique: true,
            required: true
        },
         Nombre: {
            type: String,
            required: true
        },Contrasenna: {
            type: String,
            required: true
        },
         Telefono: {
            type: String
        },
         Correo: {
            type: String
        }
    }
);

const Personas= mongoose.model('Personas',PersonasSchema);

 export default Personas;
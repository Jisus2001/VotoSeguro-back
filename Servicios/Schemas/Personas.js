const mongoose = require('mongoose');

const PersonasSchema = mongoose.Schema(
    {
        Identificacion: {
            type: String,
            required: true
        },
         Nombre: {
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

module.exports = Personas;
// middlewares/auth.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
// Importa el modelo de Persona si necesitas cargar más datos del usuario
//
 import Personas from '../Servicios/Schemas/Personas.js';

const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            
    

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Puedes evitar hacer otra consulta si el token ya contiene la info
        req.user = decoded;

        // O si prefieres cargar todo el usuario desde la BD:
        // const persona = await Personas.findById(decoded.id);
        // if (!persona) return res.status(401).json({ error: 'Usuario no encontrado' });
        // req.user = persona;

        next();
    }
} catch (error) {
        return res.status(401).json({ error: 'Token inválido o expirado' });
    }
};


export default authenticate;



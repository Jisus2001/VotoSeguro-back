import authenticate from './Middlewares/authentication.js';
import rutasDePersonas from './Rutas/Personas.js';
import rutasDeElecciones from './Rutas/Elecciones.js';
import rutasDeSedes from './Servicios/Controllers/Sedes.js';
import rutasDePerfiles from './Rutas/PerfilesElecciones.js';
import rutasDeCandidatos from './Rutas/Candidatos.js';
import rutasDeVotos from './Servicios/Controllers/Votos.js';

function asignarRutasAExpress(app) {
   app.use('/personas', authenticate, rutasDePersonas);
   app.use('/elecciones', authenticate, rutasDeElecciones);
   app.use('/sedes', authenticate, rutasDeSedes);
   app.use('/perfiles', authenticate, rutasDePerfiles);
   app.use('/candidatos', authenticate, rutasDeCandidatos);
   app.use('/votos', authenticate, rutasDeVotos);
}

export default asignarRutasAExpress;
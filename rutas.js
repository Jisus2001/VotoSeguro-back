import authenticate from './Middlewares/authentication.js';
import rutasDePersonas from './Rutas/Personas.js';
import rutasDeElecciones from './Rutas/Elecciones.js';
import rutasDeSedes from './Servicios/Controllers/Sedes.js';
import rutasDePerfiles from './Rutas/PerfilesElecciones.js';
import rutasDeCandidatos from './Rutas/Candidatos.js';
import rutasDeVotos from './Servicios/Controllers/Votos.js';

function asignarRutasAExpress(app) {
   app.use('/personas',authenticate, rutasDePersonas);
   app.use('/elecciones', rutasDeElecciones);
   app.use('/sedes', rutasDeSedes);
   app.use('/perfiles', rutasDePerfiles);
   app.use('/candidatos', rutasDeCandidatos);
   app.use('/votos', rutasDeVotos);
}

export default asignarRutasAExpress;
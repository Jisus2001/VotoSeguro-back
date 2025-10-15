import rutasDePersonas from './Servicios/Rutas/Personas.js';
import rutasDeElecciones from './Servicios/Rutas/Elecciones.js';
import rutasDeSedes from './Servicios/Controllers/Sedes.js';
import rutasDePerfiles from './Servicios/Rutas/PerfilesElecciones.js';
import rutasDeCandidatos from './Servicios/Rutas/Candidatos.js';
import rutasDeVotos from './Servicios/Controllers/Votos.js';

function asignarRutasAExpress(app) {
   app.use('/personas', rutasDePersonas);
   app.use('/elecciones', rutasDeElecciones);
   app.use('/sedes', rutasDeSedes);
   app.use('/perfiles', rutasDePerfiles);
   app.use('/candidatos', rutasDeCandidatos);
   app.use('/votos', rutasDeVotos);
}

export default asignarRutasAExpress;
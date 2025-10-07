
import rutasDePersonas from './Servicios/Controllers/Personas.js';
import rutasDeElecciones from './Servicios/Controllers/Elecciones.js';
import rutasDeSedes from './Servicios/Controllers/Sedes.js';
import rutasDePerfiles from './Servicios/Controllers/PerfilesElecciones.js';
import rutasDeCandidatos from './Servicios/Controllers/Candidatos.js';

function asignarRutasAExpress(app) {
   app.use('/personas', rutasDePersonas);
   app.use('/elecciones', rutasDeElecciones);
   app.use('/sedes', rutasDeSedes);
   app.use('/perfiles', rutasDePerfiles);
   app.use('/candidatos', rutasDeCandidatos);
}

export default asignarRutasAExpress;
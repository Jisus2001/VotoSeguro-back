
import rutasDePersonas from './Servicios/Controllers/Personas.js';
import rutasDeElecciones from './Servicios/Controllers/Elecciones.js';
import rutasDeSedes from './Servicios/Controllers/Sedes.js';

function asignarRutasAExpress(app) {
   app.use('/personas', rutasDePersonas);
   app.use('/elecciones', rutasDeElecciones);
   app.use('/sedes', rutasDeSedes);
}

export default asignarRutasAExpress;
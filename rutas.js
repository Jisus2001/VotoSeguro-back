
import rutasDePersonas from './Servicios/Controllers/Personas.js';

function asignarRutasAExpress(app) {
   app.use('/personas', rutasDePersonas);

}

export default asignarRutasAExpress;
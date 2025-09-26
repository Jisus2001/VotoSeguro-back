
const rutasDePersonas = require('./Servicios/Controllers/Personas.js');

function asignarRutasAExpress(app) {
  app.use('/personas', rutasDePersonas);

}

module.exports = asignarRutasAExpress;
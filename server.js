const express = require('express');
const db = require ('./DB/db.js');
const rutas = require ('./rutas.js')

//aplicacion y variables
const app= express();
const PORT = process.env.PORT || 80;


 //Middleware para que el servidor pueda recibir JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


db();
rutas(app);

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
import express from "express"
import db from "./DB/db.js"
import rutas from './rutas.js';
import cors from 'cors'
import dotenv from 'dotenv';
dotenv.config();


//aplicacion y variables
const app= express();
const PORT = process.env.PORT || 80;


 //Middleware para que el servidor pueda recibir JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//
app.use(cors())

db();
rutas(app)
//app.use("/",Personas)

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
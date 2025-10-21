import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import db from "./DB/db.js";

const PORT = process.env.PORT || 80;

// Conectar la base de datos real
db();

// Levantar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

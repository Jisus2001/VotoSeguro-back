
const mongoose = require('mongoose');

// Reemplaza con tu cadena de conexión real
const MONGODB_URI = 'mongodb+srv://cluster0.c0xwy.mongodb.net/" --apiVersion 1 --username <jisus>';

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI, {
    });
    console.log('✅ Conectado a MongoDB Atlas');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error.message);
    process.exit(1);
  }
}

module.exports = connectDB;

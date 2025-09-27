
import mongoose from 'mongoose';

// Reemplaza con tu cadena de conexión real
const MONGODB_URI = 'mongodb+srv://jisus:123@cluster0.c0xwy.mongodb.net/VotoSeguro';

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

export default  connectDB;

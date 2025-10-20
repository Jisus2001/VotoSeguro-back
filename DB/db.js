
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

// Reemplaza con tu cadena de conexión real
const MONGODB_URI = 'mongodb+srv://'+process.env.MONGODB_User+':'+process.env.MONGODB_Password+'@cluster0.c0xwy.mongodb.net/'+process.env.MONGODB_DB;

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

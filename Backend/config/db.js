import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    console.log("Intentando conectar a MongoDB...");

    // Usa exactamente la misma URI que funcionó en tu script de prueba
    const mongoURI =
      "mongodb://admin:pass@mongodb:27017/sports?authSource=admin";

    // Simplifica las opciones para evitar advertencias de obsolescencia
    const options = {
      serverSelectionTimeoutMS: 30000,
    };

    await mongoose.connect(mongoURI, options);
    console.log("Conectado exitosamente a MongoDB");
  } catch (error) {
    console.error("Error al conectar a MongoDB:", error);
    process.exit(1);
  }
};

export default connectDB;

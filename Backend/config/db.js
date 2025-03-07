import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    console.log(
      "Conectando a: mongodb://admin:pass@mongodb:27017/sports?authSource=admin"
    );

    // Usa exactamente la misma URI que funcionó en tus pruebas
    await mongoose.connect(
      "mongodb://admin:pass@mongodb:27017/sports?authSource=admin"
    );

    console.log("Conexión a MongoDB establecida");
    return mongoose.connection;
  } catch (error) {
    console.error("Error al conectar a MongoDB:", error);
    process.exit(1);
  }
};

export default connectDB;

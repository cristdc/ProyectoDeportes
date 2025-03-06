import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    console.log(
      "Intentando conectar a MongoDB con URI:",
      process.env.MONGODB_URI
    );

    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 30000,
    };

    await mongoose.connect(process.env.MONGODB_URI, options);
    console.log("Conectado exitosamente a MongoDB");
  } catch (error) {
    console.error("Error al conectar a MongoDB:", error);
    console.error("Error completo:", JSON.stringify(error, null, 2));
    process.exit(1);
  }
};

export default connectDB;

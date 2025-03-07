import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

dotenv.config();

// Función async para iniciar la aplicación después de conectar a MongoDB
const startServer = async () => {
  try {
    // Conectar a MongoDB primero
    const db = await connectDB();

    // Iniciar el servidor después de la conexión exitosa
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error al iniciar la aplicación:", error);
    process.exit(1);
  }
};

// Iniciar la aplicación
startServer();

import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

dotenv.config();

// Primero conectar a MongoDB y luego iniciar el servidor
const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error al iniciar el servidor:", error);
    process.exit(1);
  }
};

startServer();

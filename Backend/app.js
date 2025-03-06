import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { corsMiddleware, corsOptions } from "./config/cors2.js"; // Importamos la nueva configuración
import connectDB from "./config/db.js";

// Rutas internas
import adminRoutes from "./routes/adminRoutes.js";
import raceRoutes from "./routes/raceRoutes.js";
import registrationRoutes from "./routes/registrationRoutes.js";
<<<<<<< HEAD
import fileRoutes from "./routes/fileRoutes.js";
=======
import userRoutes from "./routes/userRoutes.js";
>>>>>>> d2105df8ee8f350a833554ebde61e9ad4ad3b0e4

dotenv.config();

const app = express();

// configuracion de express
app.use(cors(corsOptions));
app.use(corsMiddleware); // Añadir el middleware personalizado después de cors
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Middleware de debugging
if (process.env.NODE_ENV !== "production") {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    console.log("Cookies:", req.cookies);
    console.log("Headers:", req.headers);
    next();
  });
}

// Conexión con la base de datos
connectDB();

// Rutas
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/races", raceRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/files", fileRoutes);

export default app;

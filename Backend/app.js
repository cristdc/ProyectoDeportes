import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import { corsOptions } from "./config/cors.js";
import dotenv from "dotenv";
import path from 'path';
import { fileURLToPath } from 'url';
import { loggingMiddleware } from './middlewares/loggingMiddleware.js';
import { dirname } from 'path';

// Rutas internas
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import raceRoutes from "./routes/raceRoutes.js";
import registrationRoutes from "./routes/registrationRoutes.js";

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// configuracion de express
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Servir archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Conexión con la base de datos
connectDB();

// Aplicar el middleware de logging antes de las rutas
app.use(loggingMiddleware);

// Rutas
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/races", raceRoutes);
app.use("/api/registrations", registrationRoutes);

export default app;
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import { corsOptions } from "./config/cors.js";
import dotenv from "dotenv";

// Rutas internas
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import raceRoutes from "./routes/raceRoutes.js";
import registrationRoutes from "./routes/registrationRoutes.js";

dotenv.config();

const app = express();

// configuracion de express
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());



// Conexión con la base de datos
connectDB();

// Rutas
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/races", raceRoutes);
app.use("/api/registrations", registrationRoutes);

export default app;
import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import { corsOptions } from "./config/cors.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// configuracion de express
// cors

app.use(cors(corsOptions))

app.use(express.json());
app.use(cookieParser);

// Conexión con la base de datos
connectDB();

// rutas
app.use("api/users", userRoutes);

export default app;
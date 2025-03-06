import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { corsOptions } from './config/cors.js';
import dotenv from "dotenv";
import connectDB from "./config/db.js";

// Rutas
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import raceRoutes from "./routes/raceRoutes.js";
import registrationRoutes from "./routes/registrationRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";

dotenv.config();

const app = express();

app.set('trust proxy', 1); // trust first proxy

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Rutas
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/races', raceRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/files', fileRoutes);


app.get("/api/test-cookies", (req, res) => {
  console.log("Cookies recibidas:", req.cookies);
  console.log("Headers:", req.headers);

  res.cookie("test-cookie", "test-value", {
    httpOnly: true,
    secure: false, // Ajusta según corresponda
    sameSite: "none",
    maxAge: 60000, // 1 minuto
  });

  res.json({
    cookiesReceived: req.cookies,
    cookiesSent: true,
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

export default app;

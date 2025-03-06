import express from "express";
import { adminMiddleware, authMiddleware } from "../middlewares/authmiddleware";

const router = express.Router();

// Todas las rutas requieren autenticación y rol de admin
router.use(authMiddleware);
router.use(adminMiddleware);

// Ruta para descargar EXE
router.get("/file", downloadFile);

// Ruta para descargar APK
router.get("/file", downloadFile);

export default router;
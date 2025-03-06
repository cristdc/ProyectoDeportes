import express from "express";
import {
  downloadFile,
  getAvailableFiles,
  uploadFile,
  deleteFile,
} from "../controllers/fileController.js";
import {
  authMiddleware,
  adminMiddleware,
} from "../middlewares/authmiddleware.js";
import { appUpload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// Ruta para obtener archivos disponibles (requiere autenticación)
router.get("/list", authMiddleware, (req, res) => getAvailableFiles(req, res));
router.get("/list/:type", authMiddleware, (req, res) =>
  getAvailableFiles(req, res)
);

// Ruta para descargar archivos (requiere autenticación)
router.get("/download/:type/:filename", authMiddleware, downloadFile);

// Rutas para administradores (requieren autenticación y rol admin)
router.use(authMiddleware);
router.use(adminMiddleware);

// Subir un nuevo archivo
router.post("/upload", appUpload.single("file"), uploadFile);

// Eliminar un archivo
router.delete("/:type/:filename", deleteFile);

export default router;

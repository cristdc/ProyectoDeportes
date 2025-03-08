import express from "express";
import {
  getAllRaces,
  getRacesByDate,
  getRacesByLocation,
  getRacesBySport,
  createRace,
  getRaceById,
  updateRace,
  deleteRace,
  registerRaceResults,
  getRaceResults,
  downloadRunnersCSV,
  uploadGPXFile,
  downloadGPXFile,
  deleteGPXFile,
  uploadResultsCSV,
} from "../controllers/raceController.js";
import {
  authMiddleware,
  adminMiddleware,
} from "../middlewares/authmiddleware.js";
import { csvUpload, gpxUpload } from "../config/multer.js";

const router = express.Router();

// Rutas públicas para listar carreras
router.get("/", getAllRaces);
router.get("/date/:date", getRacesByDate);
router.get("/location/:location", getRacesByLocation);
router.get("/sport/:sport", getRacesBySport);
router.get("/:id", getRaceById);

// Rutas protegidas para admins
router.post("/", authMiddleware, adminMiddleware, createRace);
router.put("/:id", authMiddleware, adminMiddleware, updateRace);
router.delete("/:id", authMiddleware, adminMiddleware, deleteRace);

// Rutas para resultados
router.post(
  "/:id/results",
  authMiddleware,
  adminMiddleware,
  registerRaceResults
);
router.get("/:id/results", getRaceResults);

// Rutas para carga de archivos CSV
router.get(
  "/:id/runners-csv",
  authMiddleware,
  adminMiddleware,
  downloadRunnersCSV
);
router.post(
  "/:id/results-csv",
  authMiddleware,
  adminMiddleware,
  csvUpload.single("file"),
  uploadResultsCSV
);

// NUEVAS RUTAS PARA ARCHIVOS GPX
// Carga de archivo GPX (solo admin)
router.post(
  "/:id/gpx",
  authMiddleware,
  adminMiddleware,
  gpxUpload.single("gpxFile"),
  uploadGPXFile
);

// Descarga de archivo GPX (cualquier usuario autenticado)
router.get(
  "/:id/gpx",
  authMiddleware, // Solo requiere estar autenticado
  downloadGPXFile
);

// Eliminar archivo GPX (solo admin)
router.delete("/:id/gpx", authMiddleware, adminMiddleware, deleteGPXFile);

export default router;

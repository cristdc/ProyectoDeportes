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
  uploadResultsCSV,
} from "../controllers/raceController.js";
import {
  authMiddleware,
  adminMiddleware,
} from "../middlewares/authmiddleware.js";
import { csvUpload } from "../config/multer.js";

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
router.post("/:id/results", authMiddleware, adminMiddleware, registerRaceResults); 
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

export default router;

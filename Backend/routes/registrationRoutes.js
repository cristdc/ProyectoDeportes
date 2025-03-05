import express from "express";
import {
  createRegistration,
  getUserRegistrations,
  getRaceRegistrations,
  getAllRegistrations,
  updateRegistration,
  updateRegistrationTime,
  cancelRegistration,
} from "../controllers/registrationController.js";
import {
  authMiddleware,
  adminMiddleware,
} from "../middlewares/authmiddleware.js";

const router = express.Router();

// Rutas básicas (requieren autenticación)
router.use(authMiddleware);

// Inscripciones
router.post("/", createRegistration);
router.get("/user", getUserRegistrations);

// Ruta para ver inscripciones por usuario (solo admin)
router.get("/user/:userId", adminMiddleware, getUserRegistrations);

// Ruta para ver inscripciones por carrera (admin o creador de la carrera)
router.get("/race/:id", getRaceRegistrations);

// Rutas para actualizar/cancelar inscripciones
router.put("/:id", adminMiddleware, updateRegistration); // Actualizar inscripción (admin)

router.put("/:id/time", adminMiddleware, updateRegistrationTime); // Registrar tiempo final (admin)

router.put("/:id/cancel", cancelRegistration); // Cualquier usuario puede cancelar su inscripción

// Ruta para admins (listar todas las inscripciones)
router.get("/", adminMiddleware, getAllRegistrations);

export default router;

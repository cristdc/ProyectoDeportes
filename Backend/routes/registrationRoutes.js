import express from "express";
import {
  createRegistration,
  getUserRegistrations,
  getAllRegistrations,
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
router.get(
  "/user/:userId",
  authMiddleware,
  adminMiddleware,
  getUserRegistrations
); // Admin puede ver inscripciones de cualquier usuario
router.put(
  "/:id/time",
  authMiddleware,
  adminMiddleware,
  updateRegistrationTime
); // Registrar tiempo final
router.put("/:id/cancel", cancelRegistration); 

// Ruta para admins (listar todas las inscripciones)
router.get("/", authMiddleware, adminMiddleware, getAllRegistrations);

export default router;

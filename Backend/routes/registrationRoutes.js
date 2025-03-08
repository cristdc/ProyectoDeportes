import express from "express";
import { authMiddleware } from "../middlewares/authmiddleware.js";
import registrationController from "../controllers/registrationController.js";

const router = express.Router();

router.use(authMiddleware);

// Rutas básicas
router.post('/', registrationController.createRegistration);
router.get('/user', registrationController.getUserRegistrations);
router.get('/race/:id', registrationController.getRaceRegistrations);
router.get('/', registrationController.getAllRegistrations);

// Rutas de gestión de inscripciones
router.post('/toggle/:raceId', registrationController.toggleRegistration);
router.get('/status/:raceId', registrationController.checkRegistrationStatus);
router.put('/:id/cancel', registrationController.cancelRegistration);
router.put('/:id/time', registrationController.updateRegistrationTime);
router.put('/:id', registrationController.updateRegistration);

export default router;

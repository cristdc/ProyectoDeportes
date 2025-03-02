import express from 'express';
import { addUser, getUserProfile } from '../controllers/userController.js';
import authMiddleware from '../middlewares/authmiddleware.js';

const router= express.Router();

// rutas del usuario
router.post("/", addUser)
router.get("/me", authMiddleware, getUserProfile)

export default router;
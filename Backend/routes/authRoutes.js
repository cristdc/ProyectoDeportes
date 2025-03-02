import express from 'express';
import { login, register, logout } from '../controllers/authController.js';
import authMiddleware from '../middlewares/authmiddleware.js';

const router = express.Router();

// Rutas de autenticación
// /login  /register  /logout

router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);
// aquí tendréis que añadir las rutas que faltan (google)

router.get("/check-auth", authMiddleware, (req, res) => {
    res.status(200).json({message: 'Autenticado', userId: req.userId});
})

export default router;

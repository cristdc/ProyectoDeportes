import express from "express";
import {
  login,
  register,
  logout,
  getUserProfile,
  updateProfile,
  getUserById,
  searchUsersByName,
  getAuthStatus,
  userDownloadGPXFile,
  checkCookies,
} from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authmiddleware.js";

const router = express.Router();

// Rutas públicas
router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);

// Rutas protegidas para usuarios regulares
router.get("/profile", authMiddleware, getUserProfile);
router.put("/profile", authMiddleware, updateProfile);

// Rutas adicionales para usuarios
router.get("/search", authMiddleware, searchUsersByName); 

router.get("/check-cookies", checkCookies);

router.get("/check-auth", authMiddleware, (req, res) => {
  
  res.status(200).json({
    authenticated: true,
    user: req.user,
    tokenExpiration: new Date(req.user.exp * 1000) 
  });
});

router.get("/auth-status", getAuthStatus);
router.get("/:id", authMiddleware, getUserById); 

// Ruta para que un usuario descargue un GPX de una carrera
router.get("/:id/gpx", authMiddleware, userDownloadGPXFile);
export default router;

import express from "express";
import {
  login,
  register,
  logout,
  getUserProfile,
  updateProfile,
  getUserById,
  searchUsersByName,
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
router.get("/:id", authMiddleware, getUserById); 

export default router;

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
import User from "../models/User.js";

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
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ message: 'Error al obtener el usuario' });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updateData = {};
    
    // Extraer los campos del formData
    if (req.body.name) updateData.name = req.body.name;
    if (req.body.email) updateData.email = req.body.email;
    if (req.body.height) updateData.height = req.body.height;
    if (req.body.weight) updateData.weight = req.body.weight;
    if (req.body.age) updateData.age = req.body.age;
    if (req.body.gender) updateData.gender = req.body.gender;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ message: 'Error al actualizar el usuario' });
  }
});

export default router;

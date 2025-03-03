import express from "express";
import {
  getAllUsers,
  getUserById,
  getUsersByName,
  updateUser,
  deleteUser,
  changeUserRole,
  getSystemStats,
} from "../controllers/adminController.js";
import {
  authMiddleware,
  adminMiddleware,
} from "../middlewares/authmiddleware.js";

const router = express.Router();

// Todas las rutas requieren autenticación y rol de admin
router.use(authMiddleware);
router.use(adminMiddleware);

// Rutas de administración de usuarios
router.get("/users", getAllUsers);
router.get("/users/search", getUsersByName);
router.post("/users/change-role", changeUserRole);
router.get("/users/:id", getUserById);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

// Panel de administración - estadísticas
router.get("/stats", getSystemStats);

export default router;

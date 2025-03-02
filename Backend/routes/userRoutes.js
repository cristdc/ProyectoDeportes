import express from 'express';
import { login, register, logout, getUserProfile, getUserById, 
    getUsersByName, updateUser, deleteUser, 
    getAllUsers} from '../controllers/userController.js';
import authMiddleware from '../middlewares/authmiddleware.js';

const router = express.Router();

// Rutas de autenticación
// /login  /register  /logout

router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);
router.get("/profile", authMiddleware, getUserProfile)
router.get("/:id", authMiddleware, getUserById)
router.get("/search?name=Antonio", authMiddleware, getUsersByName)
router.put("/:id", authMiddleware, updateUser)
router.delete(":id", authMiddleware, deleteUser)
router.get("/list", authMiddleware, getAllUsers)

router.get("/check-auth", authMiddleware, (req, res) => {
    res.status(200).json({message: 'Autenticado', userId: req.userId});
})

export default router;

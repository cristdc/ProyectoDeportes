import jwt from "jsonwebtoken";
import multer from 'multer';
import path from 'path';

// Configurar el almacenamiento
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/profiles/') // Asegúrate de que este directorio existe
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname))
  }
});

// Filtrar tipos de archivos
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('No es una imagen válida'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max
  }
});

// Middleware para verificar el token JWT
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "No hay token de autenticación" });
    }

    // Verificamos y decodificamos el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (error) {
    res.status(401).json({ message: "Token inválido" });
  }
};

// Middleware para verificar si es admin
const adminMiddleware = async (req, res, next) => {
  try {
    // Asumimos que authMiddleware ya ha sido ejecutado y req.user está configurado
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "No tienes permisos para acceder a este recurso" });
    }
    next();
  } catch (error) {
    res.status(401).json({ message: "Error de autenticación" });
  }
};

export { authMiddleware, adminMiddleware, upload };

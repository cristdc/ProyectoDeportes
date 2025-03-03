import jwt from "jsonwebtoken";

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

export { authMiddleware, adminMiddleware };

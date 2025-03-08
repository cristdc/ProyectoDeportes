import jwt from "jsonwebtoken";

// Middleware para verificar el token JWT
const authMiddleware = async (req, res, next) => {
  try {
    console.log("Cookies recibidas:", req.cookies);
    console.log("Headers de autorización:", req.headers.authorization);

    // Obtener token de cookies o headers
    const token =
      req.cookies.token ||
      (req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null);

    if (!token) {
      return res.status(401).json({
        message: "No hay token de autenticación",
        cookiesPresent: Object.keys(req.cookies).length > 0,
        headersPresent: !!req.headers.authorization,
        allCookies: req.cookies,
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = {
        id: decoded.id,
        role: decoded.role,
        exp: decoded.exp,
      };

      next();
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          message: "El token ha expirado",
          error: "token_expired",
        });
      } else {
        return res.status(401).json({
          message: "Token inválido",
          error: "token_invalid",
        });
      }
    }
  } catch (error) {
    console.error("Error de autenticación:", error);
    res.status(500).json({ message: "Error interno del servidor" });
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

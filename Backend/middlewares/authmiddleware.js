import jwt from "jsonwebtoken";

// Middleware para verificar el token JWT
const authMiddleware = async (req, res, next) => {
  try {
    console.log("Cookies recibidas:", req.cookies);
    console.log("Headers de autorización:", req.headers.authorization);

    // Obtener token de cookies o headers de autorización
    let token = req.cookies.token;

    // Si no hay token en cookies, buscar en el header de autorización
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      }
    }

    if (!token) {
      return res.status(401).json({
        message: "No hay token de autenticación",
        cookiesPresent: Object.keys(req.cookies).length > 0,
        headersPresent: !!req.headers.authorization,
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Si el token está por expirar (menos de 1 hora), renovarlo
      const timeUntilExpiry = decoded.exp - Math.floor(Date.now() / 1000);
      if (timeUntilExpiry < 3600) { // menos de 1 hora
        const newToken = jwt.sign(
          { id: decoded.id, role: decoded.role },
          process.env.JWT_SECRET,
          { expiresIn: "24h" }
        );

        // Actualizar cookie
        res.cookie("token", newToken, {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
          maxAge: 24 * 60 * 60 * 1000,
          path: "/",
          domain: req.headers.host.indexOf(".amazonaws.com") > -1
            ? ".amazonaws.com"
            : undefined,
        });

        // Incluir el nuevo token en la respuesta para actualizar localStorage
        res.setHeader('X-New-Token', newToken);
      }

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

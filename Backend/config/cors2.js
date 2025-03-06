// Configuración CORS optimizada para manejar múltiples orígenes y cookies correctamente
const allowOrigin = [
  "http://localhost:5173", // Frontend React
  "http://localhost:5174", // Frontend Propio (SPA)
  "http://localhost:3000", // Frontend
  "http://localhost:8080", // Posible puerto para aplicaciones móviles/escritorio
  "http://localhost:8081", // Otro puerto alternativo (por si acaso)
  // Puedes añadir más orígenes según sea necesario, incluyendo URLs de producción
];

export const corsOptions = {
  origin: function (origin, callback) {
    // Permitir solicitudes sin origen (como aplicaciones móviles o curl)
    if (!origin) {
      return callback(null, true);
    }

    // Verificar si el origen está en la lista de permitidos
    if (allowOrigin.includes(origin)) {
      return callback(null, true);
    } else {
      // Para permitir cualquier IP en desarrollo, usa esta condición
      if (process.env.NODE_ENV !== "production") {
        return callback(null, true);
      }
      return callback(new Error("No permitido por CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
  ],
  exposedHeaders: [
    "Access-Control-Allow-Origin",
    "Access-Control-Allow-Credentials",
    "Set-Cookie",
  ],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  maxAge: 86400, // Tiempo en segundos que el navegador puede cachear la respuesta de preflight
};

// Middleware de CORS específico para solucionar problemas con cookies
export const corsMiddleware = (req, res, next) => {
  // Configurar encabezados de CORS manualmente (alternativa a usar el paquete cors)
  const origin = req.headers.origin;
  if (
    allowOrigin.includes(origin) ||
    !origin ||
    process.env.NODE_ENV !== "production"
  ) {
    res.header("Access-Control-Allow-Origin", origin || "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS, PATCH"
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-Requested-With, Accept, Origin"
    );
    res.header(
      "Access-Control-Expose-Headers",
      "Access-Control-Allow-Origin, Access-Control-Allow-Credentials, Set-Cookie"
    );

    // Manejar solicitudes OPTIONS
    if (req.method === "OPTIONS") {
      return res.status(204).end();
    }
  }

  next();
};

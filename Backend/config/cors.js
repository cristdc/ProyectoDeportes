// Lista de dominios permitidos
const allowedOrigins = [
  "http://localhost:5173", // Frontend React
  "http://localhost:5174", // Frontend Propio (SPA)
  "http://localhost:3000", // Frontend
  "http://localhost:8080", // Posible puerto para aplicaciones móviles/escritorio
  "http://localhost:8081", // Otro puerto alternativo (por si acaso)
  "http://127.0.0.1:5500", // Añade esta línea
  "http://localhost:5500", // También esta
  "http://192.168.70.191",
  "http://localhost/prueba", // Nuevo origen específico para la página de prueba
];

export const corsOptions = {
  origin: function (origin, callback) {
    // Permitir peticiones sin origin en desarrollo
    if (!origin && process.env.NODE_ENV !== "production") {
      return callback(null, true);
    }

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("No permitido por CORS"));
    }
  },
  credentials: true, // Esto es crucial
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["set-cookie"],
};
// Lista de dominios permitidos
const allowedOrigins = [
  "http://localhost:5173", // Frontend React
  "http://localhost:5174", // Frontend Propio (SPA)
  "http://localhost:3000", // Frontend
  "http://localhost:8080", // Posible puerto para aplicaciones móviles/escritorio
  "http://localhost:8081", // Otro puerto alternativo (por si acaso)
  "http://localhost:5500", // También esta
  "http://localhost", // Nuevo origen (Docker frontend)
  "http://localhost/prueba", // Nuevo origen específico para la página de prueba
  "http://alb-deportes-332363768.us-east-1.elb.amazonaws.com",
  "https://alb-deportes-332363768.us-east-1.elb.amazonaws.com",
  "http://35.153.250.116",
  "https://35.153.250.116",
  "http://alb-deportes-332363768.us-east-1.elb.amazonaws.com/running/",
  "https://alb-deportes-332363768.us-east-1.elb.amazonaws.com/running/",
  "http://35.153.250.116/running/",
  "https://35.153.250.116/running/",
];

// En cors.js
export const corsOptions = {
  origin: function (origin, callback) {
    // Permitir solicitudes desde tu dominio
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log(`Origen bloqueado por CORS: ${origin}`);
      callback(new Error("No permitido por CORS"));
    }
  },
  credentials: true, // Esto es crucial para cookies
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["set-cookie"], // Importante para exponer las cookies al cliente
};
const allowOrigin = [
  "http://localhost:5173", // Frontend React
  "http://localhost:5174", // Frontend Propio (SPA)
  "http://localhost:3000", // Frontend
  "http://localhost:8080", // Posible puerto para aplicaciones móviles/escritorio
  "http://localhost:8081", // Otro puerto alternativo (por si acaso)
];

export const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowOrigin.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Origin not allowed"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders: [
    "Access-Control-Allow-Origin",
    "Access-Control-Allow-Credentials",
    "Set-Cookie",
  ],
  preflightContinue: false,
  optionsSuccessStatus: 204,
};
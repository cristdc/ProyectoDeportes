const allowOrigin=["http://localhost:5173", "http://localhost:5174"];

export const corsOptions = {
        origin: (origin, callback) => {
            if (!origin || allowOrigin.includes(origin)) {
                callback(null, origin);
            } else {
                callback(new Error("Origin not allowed"));
            }
        },
    
        credentials: true, // Para que el navegador permita el envío de cookies
        methods: ["GET", "POST", "PUT", "DELETE"], // Para que el navegador permita el envío de cookies
        allowedHeaders: ["Content-Type", "Authorization"], // Para que el navegador permita el envío de cookies
    }    
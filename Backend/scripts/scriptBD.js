import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import Race from "../models/Race.js";
import Registration from "../models/Registrations.js";
import bcrypt from "bcryptjs";

// Cargar variables de entorno
dotenv.config();

// Función para obtener la URI de conexión correcta
function getMongoURI() {
  // Si se está ejecutando en Docker, usa el nombre de servicio "mongodb"
  // En local, usa localhost
  const baseURI = process.env.MONGODB_URI || "mongodb://localhost:27017/sports";

  // Reemplazar "mongodb" con "localhost" si se está ejecutando localmente
  return baseURI.replace("mongodb://mongodb:", "mongodb://localhost:");
}

// Función para hashear contraseñas
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Datos de ejemplo actualizados con los nuevos campos
const exampleData = {
  users: [
    {
      _id: new mongoose.Types.ObjectId("663f1b4667d0d8992e610c85"),
      email: "admin@example.com",
      name: "Admin Usuario",
      role: "admin",
      avatar: "default.jpg",
      age: 35,
      registrationDate: new Date("2026-01-15T10:30:00Z"),
    },
    {
      _id: new mongoose.Types.ObjectId("663f1b4667d0d8992e610c86"),
      email: "corredor@example.com",
      name: "Juan Corredor",
      role: "user",
      avatar: "default.jpg",
      age: 28,
      gender: "male",
      registrationDate: new Date("2026-02-20T14:45:00Z"),
    },
    {
      _id: new mongoose.Types.ObjectId("663f1b4667d0d8992e610c87"),
      email: "ciclista@example.com",
      name: "María Ciclista",
      role: "user",
      avatar: "default.jpg",
      age: 32,
      gender: "female",
      registrationDate: new Date("2026-03-05T09:15:00Z"),
    },
  ],
  races: [
    {
      _id: new mongoose.Types.ObjectId("663f1b4667d0d8992e610d85"),
      name: "Maratón Urbano 2026",
      sport: "running",
      date: new Date("2026-05-15T08:00:00Z"),
      location: "Parque Central",
      distance: 42.2,
      maxParticipants: 500,
      unevenness: 150,
      tour: "ruta-maraton.gpx",
      qualifyingTime: "04:00:00",
      classification: [],
      createdBy: new mongoose.Types.ObjectId("663f1b4667d0d8992e610c85"),
      status: "open",
      createdAt: new Date("2026-01-10T11:30:00Z"),
      hasRunnersCSV: false,
      runnersCSVPath: null,
      lastCSVUpdate: null,
      hasGPXFile: false,
      gpxFilePath: null,
      gpxFileUploadedAt: null,
      gpxFileName: null,
    },
    {
      _id: new mongoose.Types.ObjectId("663f1b4667d0d8992e610d86"),
      name: "Trail de Montaña",
      sport: "trailRunning",
      date: new Date("2026-06-22T07:30:00Z"),
      location: "Sierra Norte",
      distance: 21.5,
      maxParticipants: 300,
      unevenness: 850,
      tour: "ruta-trail.gpx",
      qualifyingTime: "03:30:00",
      classification: [],
      createdBy: new mongoose.Types.ObjectId("663f1b4667d0d8992e610c85"),
      status: "open",
      createdAt: new Date("2026-02-15T10:45:00Z"),
      hasRunnersCSV: false,
      runnersCSVPath: null,
      lastCSVUpdate: null,
      hasGPXFile: false,
      gpxFilePath: null,
      gpxFileUploadedAt: null,
      gpxFileName: null,
    },
    {
      _id: new mongoose.Types.ObjectId("663f1b4667d0d8992e610d87"),
      name: "Gran Fondo Ciclista",
      sport: "cycling",
      date: new Date("2026-07-08T07:00:00Z"),
      location: "Valle del Río",
      distance: 120,
      maxParticipants: 400,
      unevenness: 1200,
      tour: "ruta-ciclista.gpx",
      qualifyingTime: "05:00:00",
      classification: [],
      createdBy: new mongoose.Types.ObjectId("663f1b4667d0d8992e610c85"),
      status: "open",
      createdAt: new Date("2026-03-10T09:20:00Z"),
      hasRunnersCSV: false,
      runnersCSVPath: null,
      lastCSVUpdate: null,
      hasGPXFile: false,
      gpxFilePath: null,
      gpxFileUploadedAt: null,
      gpxFileName: null,
    },
  ],
  registrations: [
    {
      _id: new mongoose.Types.ObjectId("663f1b4667d0d8992e610e85"),
      race: new mongoose.Types.ObjectId("663f1b4667d0d8992e610d85"),
      user: new mongoose.Types.ObjectId("663f1b4667d0d8992e610c86"),
      dorsal: 101,
      registeredAt: new Date("2026-03-15T14:30:00Z"),
      status: "registered",
      time: null,
      position: null,
      hasUserGpx: false,
      userGpxPath: null,
      userGpxUploadedAt: null,
      userGpxFileName: null,
      userGpxData: {
        totalDistance: null,
        elevationGain: null,
        elevationLoss: null,
        movingTime: null,
        totalTime: null,
        avgSpeed: null,
        maxSpeed: null,
      },
    },
    {
      _id: new mongoose.Types.ObjectId("663f1b4667d0d8992e610e86"),
      race: new mongoose.Types.ObjectId("663f1b4667d0d8992e610d86"),
      user: new mongoose.Types.ObjectId("663f1b4667d0d8992e610c86"),
      dorsal: 202,
      registeredAt: new Date("2026-03-16T10:45:00Z"),
      status: "registered",
      time: null,
      position: null,
      hasUserGpx: false,
      userGpxPath: null,
      userGpxUploadedAt: null,
      userGpxFileName: null,
      userGpxData: {
        totalDistance: null,
        elevationGain: null,
        elevationLoss: null,
        movingTime: null,
        totalTime: null,
        avgSpeed: null,
        maxSpeed: null,
      },
    },
    {
      _id: new mongoose.Types.ObjectId("663f1b4667d0d8992e610e87"),
      race: new mongoose.Types.ObjectId("663f1b4667d0d8992e610d87"),
      user: new mongoose.Types.ObjectId("663f1b4667d0d8992e610c87"),
      dorsal: 303,
      registeredAt: new Date("2026-03-20T11:15:00Z"),
      status: "registered",
      time: null,
      position: null,
      hasUserGpx: false,
      userGpxPath: null,
      userGpxUploadedAt: null,
      userGpxFileName: null,
      userGpxData: {
        totalDistance: null,
        elevationGain: null,
        elevationLoss: null,
        movingTime: null,
        totalTime: null,
        avgSpeed: null,
        maxSpeed: null,
      },
    },
  ],
};

// Función para seedear la base de datos
async function seedDatabase() {
  try {
    const mongoURI = getMongoURI();
    console.log("Conectando a:", mongoURI);

    await mongoose.connect(mongoURI, {
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 45000,
    });
    console.log("Conexión a MongoDB establecida");

    await User.deleteMany({});
    await Race.deleteMany({});
    await Registration.deleteMany({});

    console.log("Colecciones limpiadas");

    // Hashear todas las contraseñas con bcrypt
    const hashedUsers = await Promise.all(
      exampleData.users.map(async (user) => {
        const hashedPassword = await hashPassword("123456");
        return { ...user, password: hashedPassword };
      })
    );

    await User.insertMany(hashedUsers);
    console.log("Usuarios insertados con contraseñas hasheadas");

    await Race.insertMany(exampleData.races);
    console.log("Carreras insertadas");

    await Registration.insertMany(exampleData.registrations);
    console.log("Inscripciones insertadas");

    console.log("Base de datos inicializada correctamente");
  } catch (error) {
    console.error("Error al seedear la base de datos:", error);
  } finally {
    await mongoose.connection.close();
  }
}

// Ejecutar la función de seedeo
seedDatabase();

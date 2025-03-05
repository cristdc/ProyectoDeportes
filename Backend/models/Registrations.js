import mongoose from "mongoose";

// registrationSchema actualizado con campos para GPX de usuario
const registrationSchema = mongoose.Schema({
  race: { type: mongoose.Schema.Types.ObjectId, ref: "Race", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  dorsal: { type: Number, default: null },
  registeredAt: { type: Date, default: Date.now() },
  status: {
    type: String,
    enum: ["registered", "cancelled", "finished"],
    default: "registered",
  },
  time: { type: String }, 
  position: { type: Number },

  // Nuevos campos para GPX de usuario
  hasUserGpx: { type: Boolean, default: false },
  userGpxPath: { type: String, default: null },
  userGpxUploadedAt: { type: Date, default: null },
  userGpxFileName: { type: String, default: null },

  // Datos adicionales que se pueden extraer del GPX del usuario
  userGpxData: {
    totalDistance: { type: Number, default: null }, // En km
    elevationGain: { type: Number, default: null }, // En metros
    elevationLoss: { type: Number, default: null }, // En metros
    movingTime: { type: String, default: null }, // Formato HH:MM:SS
    totalTime: { type: String, default: null }, // Formato HH:MM:SS
    avgSpeed: { type: Number, default: null }, // En km/h
    maxSpeed: { type: Number, default: null }, // En km/h
  },
});

export default mongoose.model("Registration", registrationSchema);

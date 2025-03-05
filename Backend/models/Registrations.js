import mongoose from "mongoose";

// registrationSchema
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
  time: { type: Date },
  position: { type: Number },
});

export default mongoose.model("Registration", registrationSchema);
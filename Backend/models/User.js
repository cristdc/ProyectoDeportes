import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Esquema de la colección User
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ["admin", "user"], default: "user" },
  avatar: { 
    type: String, 
    default: "default.jpg",
    get: function(v) {
      return v ? `${process.env.BACKEND_URL}/uploads/img/${v}` : null;
    }
  },
  age: { type: Number },
  registrationDate: { type: Date, default: Date.now },
  gender: { type: String, enum: ["male", "female"], require:true },
});

// Middleware para encriptar la contraseña antes de guardar
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Método para comparar la contraseña
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export default mongoose.model("User", userSchema);

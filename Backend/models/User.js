import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Esquema de la colección User
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'El email es requerido'],
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'La contraseña es requerida']
  },
  height: {
    type: Number,
    default: null,
    validate: {
      validator: function(v) {
        return v === null || (Number.isFinite(v) && v > 0);
      },
      message: 'La altura debe ser un número positivo'
    }
  },
  weight: {
    type: Number,
    default: null,
    validate: {
      validator: function(v) {
        return v === null || (Number.isFinite(v) && v > 0);
      },
      message: 'El peso debe ser un número positivo'
    }
  },
  age: {
    type: Number,
    default: null,
    validate: {
      validator: function(v) {
        return v === null || (Number.isInteger(v) && v > 0);
      },
      message: 'La edad debe ser un número entero positivo'
    }
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', ''],
    default: ''
  },
  profileImage: {
    type: String,
    default: null
  },
  role: {
    type: String,
    default: 'user',
    enum: ['user', 'admin']
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  stats: {
    totalRaces: {
      type: Number,
      default: 0,
      min: 0
    },
    completedRaces: {
      type: Number,
      default: 0,
      min: 0
    },
    totalKilometers: {
      type: Number,
      default: 0,
      min: 0
    }
  }
}, {
  timestamps: true
});

// Middleware para encriptar la contraseña antes de guardar
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  
  // Asegurar que los valores numéricos sean números
  if (this.height) this.height = Number(this.height);
  if (this.weight) this.weight = Number(this.weight);
  if (this.age) this.age = Number(this.age);
  
  next();
});

// Método para comparar la contraseña
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export default mongoose.model("User", userSchema);

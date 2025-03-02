import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Esquema de la colección User
const userSchema=new mongoose.Schema({
    email:{type: String, required: true, unique:true},
    password:{type: String, required: true},
    name:{type: String, required: true},
    role:{type: String, enum: ["admin", "user"], default: "user"},
    avatar:{type: String, default: "default.jpg"},
    age: {type: Number },
    registrationDate:{type: Date, default: Date.now()}
})

// Debería de encriptar la contraseña antes de guardarla en la base de datos
userSchema.pre("save", async function(next){
    if(this.isModified("password")){
        this.password = bcrypt.hash(this.password, 10);
    }
    next();
})

// Método para comparar la contraseña introducida con la contraseña encriptada

userSchema.methods.comparePassword=async function(password)
{
    return await bcrypt.compare(password, this.password);
}

// Exportar el modelo User


export default mongoose.model("User", userSchema);
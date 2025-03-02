import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Esquema de la colección User
const userSchema=new mongoose.Schema({
    username:{type: String, required: true, unique:true},
    password:{type: String, required: true},

})

// Debería de encriptar la contraseña antes de guardarla en la base de datos
userSchema.pre("save", async function(next){
    if(this.isModified("password")){
        this.password=await bcrypt.hash(this.password, 10);
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
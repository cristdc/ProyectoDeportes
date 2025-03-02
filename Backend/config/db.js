import mongoose from "mongoose";

const connectDB = async () => {
    try {
        // Conectar a la base de datos
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Conectado a la base de datos de MongoDB");
    } catch (error) {
        console.log("Error al conectar a la base de datos", error.message);
        process.exit(1); // Detener la aplicación con código de error distinto de 0
    }
};

export default connectDB;
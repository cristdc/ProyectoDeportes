import mongoose from "mongoose";


async function testConnection() {
  const uri = "mongodb://admin:pass@mongodb:27017/sports?authSource=admin";

  console.log("Intentando conectar a MongoDB:", uri);

  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
    });

    console.log("Conexión exitosa a MongoDB");

    // Intentar crear un documento de prueba
    const TestModel = mongoose.model(
      "Test",
      new mongoose.Schema({ name: String })
    );

    await TestModel.create({ name: "test-connection" });
    console.log("Documento de prueba creado con éxito");

    process.exit(0);
  } catch (error) {
    console.error("Error al conectar a MongoDB:", error);
    process.exit(1);
  }
}

testConnection();

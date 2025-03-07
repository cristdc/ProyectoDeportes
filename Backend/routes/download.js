import express from "express";
import path from "path";
const router = express.Router();

router.get("/HOLA.exe", (req, res) => {
  const filePath = path.join(process.cwd(), "uploads/EXE/HOLA.exe");
  res.download(filePath, "HOLA.exe", (err) => {
    if (err) {
      res.status(500).send({
        message: "Error al descargar el archivo",
      });
    }
  });
});

export default router;

import express from "express";
import path from "path";
const router = express.Router();


// Rutas para descargar los archivos EXE específicos
router.get("/Cycling.exe", (req, res) => {
  const filePath = path.join(process.cwd(), "uploads/EXE/Cycling.exe");
  res.download(filePath, "Cycling.exe", (err) => {
    if (err) {
      res.status(500).send({
        message: "Error al descargar el archivo",
      });
    }
  });
});

router.get("/Running.exe", (req, res) => {
  const filePath = path.join(process.cwd(), "uploads/EXE/Running.exe");
  res.download(filePath, "Running.exe", (err) => {
    if (err) {
      res.status(500).send({
        message: "Error al descargar el archivo",
      });
    }
  });
});

router.get("/TrailRunning.exe", (req, res) => {
  const filePath = path.join(process.cwd(), "uploads/EXE/TrailRunning.exe");
  res.download(filePath, "TrailRunning.exe", (err) => {
    if (err) {
      res.status(500).send({
        message: "Error al descargar el archivo",
      });
    }
  });
});

router.get("/Management.exe", (req, res) => {
  const filePath = path.join(process.cwd(), "uploads/EXE/Management.exe");
  res.download(filePath, "Management.exe", (err) => {
    if (err) {
      res.status(500).send({
        message: "Error al descargar el archivo",
      });
    }
  });
});

// Rutas para descargar los archivos APK
router.get("/Cycling.apk", (req, res) => {
  const filePath = path.join(process.cwd(), "uploads/APK/Cycling.apk");
  res.download(filePath, "Cycling.apk", (err) => {
    if (err) {
      res.status(500).send({
        message: "Error al descargar el archivo",
      });
    }
  });
});

router.get("/Running.apk", (req, res) => {
  const filePath = path.join(process.cwd(), "uploads/APK/Running.apk");
  res.download(filePath, "Running.apk", (err) => {
    if (err) {
      res.status(500).send({
        message: "Error al descargar el archivo",
      });
    }
  });
});

export default router;

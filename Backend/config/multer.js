import multer from "multer";
import path from "path";
import fs from "fs";

// Asegurarse de que el directorio existe
const createDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Configuración para archivos CSV
const csvStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), "uploads", "csv");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, `race-${req.params.id}-${uniqueSuffix}${extension}`);
  },
});

export const csvUpload = multer({
  storage: csvStorage,
  fileFilter: (req, file, cb) => {
    const filetypes = /csv/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Solo se permiten archivos CSV"));
    }
  },
  limits: { fileSize: 1024 * 1024 * 10 }, // 10MB
});

// Configuración para archivos GPX
const gpxStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), "uploads", "gpx");
    createDir(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, `route-${req.params.id}-${uniqueSuffix}${extension}`);
  },
});

export const gpxUpload = multer({
  storage: gpxStorage,
  fileFilter: (req, file, cb) => {
    const filetypes = /gpx/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    // GPX es un formato XML, por lo que podría ser application/xml o text/xml
    const mimetype =
      file.mimetype === "application/gpx+xml" ||
      file.mimetype === "application/xml" ||
      file.mimetype === "text/xml";

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Solo se permiten archivos GPX"));
    }
  },
  limits: { fileSize: 1024 * 1024 * 20 }, // 20MB para rutas GPX más complejas
});
import multer from "multer";
import path from "path";
import fs from "fs";

// Existing GPX storage configuration
const gpxStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/gpx");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const gpxUpload = multer({
  storage: gpxStorage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "application/gpx+xml" ||
      path.extname(file.originalname).toLowerCase() === ".gpx"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only GPX files are allowed!"));
    }
  },
});

// New image storage configuration
const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/img");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "avatar-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const imageUpload = multer({
  storage: imageStorage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPG, PNG & GIF images are allowed!"));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
});

// Nueva configuración para archivos de aplicación (APK/EXE)
const appStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const downloadDir = path.join(process.cwd(), "uploads", "Downloads");
    if (!fs.existsSync(downloadDir)) {
      fs.mkdirSync(downloadDir, { recursive: true });
    }
    cb(null, downloadDir);
  },
  filename: function (req, file, cb) {
    // Usamos el nombre original con su extensión
    cb(null, file.originalname);
  },
});

const appUpload = multer({
  storage: appStorage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === ".exe" || ext === ".apk") {
      cb(null, true);
    } else {
      cb(new Error("Only EXE and APK files are allowed!"));
    }
  },
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB max file size
  },
});

export { gpxUpload, imageUpload, appUpload };

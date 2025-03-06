import multer from 'multer';
import path from 'path';

// Existing GPX storage configuration
const gpxStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/gpx')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
});

const gpxUpload = multer({ 
  storage: gpxStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/gpx+xml' || path.extname(file.originalname).toLowerCase() === '.gpx') {
      cb(null, true);
    } else {
      cb(new Error('Only GPX files are allowed!'));
    }
  }
});

// New image storage configuration
const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/img')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname))
  }
});

const imageUpload = multer({ 
  storage: imageStorage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG, PNG & GIF images are allowed!'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max file size
  }
});

export { gpxUpload, imageUpload };
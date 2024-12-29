import multer from 'multer';
import config from 'src/config/config';

// Validar el tipo de archivo
const fileFilter: multer.Options['fileFilter'] = (req, file, cb) => {
  if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
    cb(null, true); // Aceptar archivo
  } else {
    cb(new Error('Solo se permiten archivos con extensión .xlsx')); // Rechazar archivo
  }
};

// Set up storage engine
export const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, config.fileUpload.path || 'uploads/'); // Files will be stored in the 'uploads' folder
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique filenames
  },
});

// Initialize upload middleware
export const upload = multer({ storage, fileFilter });

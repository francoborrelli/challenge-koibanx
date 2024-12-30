import multer from 'multer';
import config from 'src/config/config';

const ALLOWED_TYPES = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];

/**
 * File filter function for multer to accept only .xlsx files.
 *
 * @param req - The request object.
 * @param file - The file object containing file details.
 * @param cb - The callback function to indicate whether the file should be accepted or rejected.
 *
 * The function checks the MIME type of the uploaded file. If the MIME type is
 * 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', the file is accepted.
 * Otherwise, an error is returned indicating that only .xlsx files are allowed.
 */
const fileFilter: multer.Options['fileFilter'] = (req, file, cb) => {
  if (ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true); // Aceptar archivo
  } else {
    cb(new Error('Solo se permiten archivos con extensión .xlsx')); // Rechazar archivo
  }
};

/**
 * Configuration for multer storage engine.
 *
 * This storage engine saves files to disk with a unique filename.
 *
 * @property {Function} destination - Specifies the destination directory for the uploaded files.
 * @param {Object} req - The request object.
 * @param {Object} file - The file object containing file details.
 * @param {Function} cb - The callback function to specify the destination directory.
 *
 * @property {Function} filename - Specifies the filename for the uploaded files.
 * @param {Object} req - The request object.
 * @param {Object} file - The file object containing file details.
 * @param {Function} cb - The callback function to specify the filename.
 *
 * The destination directory defaults to 'uploads/' if not specified in the configuration.
 * The filename is generated using the current timestamp and the original filename to ensure uniqueness.
 */
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

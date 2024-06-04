import path from 'path';
import multer from 'multer';
import toHttpError from '../HttpError.js';

const destination = path.resolve('tmp');
const allowedFileExtensions = ['jpg', 'jpeg', 'png'];

const storage = multer.diskStorage({
  destination,
  filename: (req, file, callback) => {
    const uniquePreffix = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
    const filename = `${uniquePreffix}_${file.originalname}`;
    callback(null, filename);
  },
});

const fileFilter = (req, file, callback) => {
  const extension = file.originalname.split('.').pop();
  if (extension === 'exe' || !allowedFileExtensions.includes(extension)) {
    return callback(toHttpError(400, 'Invalid file type'));
  }
  callback(null, true);
};

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter,
});

export default upload;

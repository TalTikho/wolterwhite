import multer from 'multer'
import path from 'node:path'
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'crypto';

const __dirname = import.meta.dirname;

const storageConfig = multer.diskStorage({
    // destinations is uploads folder 
    // under the project directory
    destination: path.join(__dirname, "../uploads"),
    filename: (req, file, cb) => {
        // file name is prepended with UUId time to handle duplicate file names
        cb(null, randomUUID().toString());
    },
});


// file filter for filtering only images
const fileFilterConfig = function (req, file, cb) {
    if (file.mimetype === "image/jpeg"
        || file.mimetype === "image/png") {
        // calling callback with true
        // as mimetype of file is image
        cb(null, true);
    } else {
        // false to indicate not to store the file
        cb(null, false);
    }
};

// creating multer object for storing
// with configuration
export const upload = multer({
    // applying storage and file filter
    storage: storageConfig,
    limits: {
        // limits file size to 7 MB
        fileSize: 1024 * 1024 * 7
    },
    fileFilter: fileFilterConfig,
});


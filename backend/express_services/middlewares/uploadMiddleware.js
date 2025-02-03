const multer = require("multer");

// Set up multer storage configuration and limits (5MB file size limit)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
}).single('file');

// Middleware function to handle file upload and size validation
const uploadFileMiddleware = (req, res, next) => {
    upload(req, res, (err) => {
        if (err) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({
                    message: 'File size is too large. Please upload a file smaller than 5MB.',
                });
            }
            return res.status(500).json({
                message: 'Something went wrong while uploading the file.',
            });
        }

        if (!req.file) {
            console.log('No file uploaded. Continuing without file.');
            return next(); // Proceed to the next middleware or controller
        }

        console.log('File uploaded successfully.');
        next();
    });
};

module.exports = {
    uploadFileMiddleware,
};

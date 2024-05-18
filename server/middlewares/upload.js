const multer = require('multer');

// Set up multer storage for image and pdf files
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).fields([{ name: 'image', maxCount: 1 }, { name: 'pdf', maxCount: 1 }]);

// Middleware for uploading image and pdf files
const uploadFiles = (req, res, next) => {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ message: 'File upload error' });
        } else if (err) {
            return res.status(500).json({ message: 'Internal server error' });
        }
        next();
    });
};

module.exports = uploadFiles;


const multer = require('multer');

// Configure Multer to store files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Middleware for handling single file uploads
const uploadFile = (fieldName) => (req, res, next) => {
  const uploadMiddleware = upload.single(fieldName);
  uploadMiddleware(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: 'File upload failed', error: err.message });
    }
    next();
  });
};

module.exports = {
  uploadFile,
};

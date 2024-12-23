const multer = require('multer');
const path = require('path');

// Set storage engine
const storage = multer.diskStorage({
    destination: './uploads', // Directory to store uploaded files
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

// Init upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 },  // Increase file size limit to 10MB
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    }
}).single('questionPaper');  // 'questionPaper' is the field name for file uploads

// Check file type (allow only PDFs)
function checkFileType(file, cb) {
    const filetypes = /pdf/; // Regular expression to allow only PDFs
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true); // File type is valid
    } else {
        cb('Error: PDFs Only!'); // Reject any non-PDF file
    }
}


module.exports = upload;

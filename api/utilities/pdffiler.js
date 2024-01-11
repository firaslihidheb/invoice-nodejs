const multer = require('multer');
const express = require('express');
const path = require('path');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },

    filename: function(req, file, cb) {
        // Keep the original file extension for PDF files
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage }).single('pdf_file');

const pdfFilter = function(req, file, cb) {
    // Accept PDF files only
    if (!file.originalname.match(/\.(pdf)$/)) {
        req.fileValidationError = 'Only PDF files are allowed!';
        return cb(new Error('Only PDF files are allowed!'), false);
    }
    cb(null, true);
};

const router = express.Router();

router.post('/uploadpdf', (req, res) => {
    upload(req, res, function(err) {
        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        } else if (!req.file) {
            return res.send('Please select a PDF file to upload');
        } else if (err instanceof multer.MulterError) {
            return res.send(err);
        } else if (err) {
            return res.send(err);
        }

        // Display uploaded PDF link for user validation
        res.send(`You have uploaded this PDF: <hr/><a href="${req.file.path}" target="_blank">Open PDF</a><hr /><a href="./">Upload another PDF</a>`);
    });
});

module.exports = { upload, router };;

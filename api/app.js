const express = require('express');
const authenticator = require('./utilities/authenticator');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const { upload, router } = require('./utilities/pdffiler');

require('./utilities/log_attributes');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/user');
const productsRouter = require('./routes/product');
const customerRouter = require('./routes/customer');
const invoiceRouter = require('./routes/invoice');

// Creating the web app from express
const app = express();

app.use(express.json({ limit: '2000mb' }));
app.use(express.urlencoded({ extended: false, limit: '2000mb' }))

// Allowing JSON to be parsed as a request parameter
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(authenticator);

// All the routers defined above
// All path and route middlewares defined below
app.use('/', indexRouter);
app.use('/user',bodyParser.json({ type: '*/*' }), usersRouter);
app.use('/product', bodyParser.json({ type: '*/*' }),productsRouter);
app.use('/customer',bodyParser.json({ type: '*/*' }), customerRouter);
app.use('/invoice', bodyParser.json({ type: '*/*' }),invoiceRouter);

// Handle the file upload logic with logging
app.post('/uploadpdf', (req, res) => {
    console.log('Incoming request:', req);

    upload(req, res, function (err) {
        if (err) {
            console.error('Error uploading file:', err);
            return res.status(500).json({ error: 'Error uploading file' });
        }

        if (req.fileValidationError) {
            console.error('File validation error:', req.fileValidationError);
            return res.status(400).json({ error: req.fileValidationError });
        }

        if (!req.file) {
            console.error('No file selected');
            return res.status(400).json({ error: 'Please select a PDF file to upload' });
        }

    
        // Display uploaded PDF link for user validation
        console.log('File uploaded successfully:', req.file);
        res.json({
            message: 'File uploaded successfully',
            filePath: req.file.path
        });
        
    });
});

// Use the router from pdffiler.js
app.use('/uploadpdf',router);

module.exports = app;

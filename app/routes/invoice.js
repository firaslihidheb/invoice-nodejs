const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
  res.render('invoices',{title:'Invoices'});
});
router.get("/upload", function(request, response, next){

	response.render('invoice_download', {title:'File Upload in Node JS Express using Multer'});

});


module.exports = router;

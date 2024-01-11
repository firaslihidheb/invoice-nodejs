const express = require('express');
const router = express.Router();
const invoice = require('./../models/invoice');
const Invoice = new invoice();


router.get('/mois_facturation', function(req, res, next) {
    Invoice.getMonths(req, res);
});



module.exports = router;

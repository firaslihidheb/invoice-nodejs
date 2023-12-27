const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
    res.render('collaborateurs',{title:'Collaborateur'});
});

module.exports = router;
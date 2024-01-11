const express = require('express');
const router = express.Router();
const user = require('./../models/user')
const User = new user();

router.post('/login', function(req, res) {
    User.loginUser(req,res);
});
router.get('/logout', function(req, res) {
    User.logoutUser(req,res);
});
router.get('/:user_id', function(req, res) {
    User.getUser(req,res);
});

router.post('/register', function(req, res) {
    User.addUser(req,res);
});
router.get('/register/all', function(req, res) {
    User.getUsers(req,res);
});
router.post('/register/update', function(req, res) {
    User.updateUser(req,res);
});
module.exports = router;

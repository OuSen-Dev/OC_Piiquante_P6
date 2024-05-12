// All const required --------------
const express = require('express');
const router = express.Router();
//const auth = require('auth');
const userCtrl = require('../controllers/user');
//------------------------------
// USER routes ----------------
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
//----------------------------
module.exports = router;
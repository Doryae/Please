const express = require('express');
const router = express.Router();
const password = require('../middleware/password');

const userCtrl = require('../controllers/user');

// Inscription
router.post('/signup', password, userCtrl.signup);
// Connexion
router.post('/login', userCtrl.login);

module.exports = router;
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const {  registerDimUser, login} = require('../controllers/dimuser');

// روش‌های احراز هویت معمولی
router.post('/login', authController.login);
router.post('/register', authController.register);


// router.post('/login', registerDimUser);
// router.post('/register', login);

// روش احراز هویت گوگل
router.post('/google-auth', authController.googleAuth);

// روش احراز هویت متامسک
router.get('/metamask-nonce', authController.getMetaMaskNonce);
router.post('/metamask-auth', authController.metamaskAuth);

module.exports = router; 
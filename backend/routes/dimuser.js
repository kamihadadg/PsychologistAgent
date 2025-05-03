const express = require('express');
const router = express.Router();
const { getDimUser, registerDimUser, login} = require('../controllers/dimuser');
const authenticateJWT = require('../server').authenticateJWT;

router.post('/register', registerDimUser);
router.post('/login', login);
router.get('/', authenticateJWT, getDimUser);

module.exports = router;

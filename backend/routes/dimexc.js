const express = require('express');
const router = express.Router();
const { getdimexc, createdimexc } = require('../controllers/dimexc');
const authenticateJWT = require('../server').authenticateJWT;

router.get('/', authenticateJWT, getdimexc);
router.post('/', authenticateJWT, createdimexc);

module.exports = router;

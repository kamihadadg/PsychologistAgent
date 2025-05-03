const express = require('express');
const router = express.Router();
const { getdimorders, createdimorders } = require('../controllers/dimorders');
const authenticateJWT = require('../server').authenticateJWT;

router.get('/', authenticateJWT, getdimorders);
router.post('/', authenticateJWT, createdimorders);

module.exports = router;

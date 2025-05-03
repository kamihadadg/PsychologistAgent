const express = require('express');
const router = express.Router();
const { getdimbots, createdimbots, getdimbot,startdimbot, Stopdimbot, getdimbotssignal } = require('../controllers/dimbots');

const authenticateJWT = require('../server').authenticateJWT;

router.get('/', authenticateJWT, getdimbots);
router.get('/signalbots', authenticateJWT, getdimbotssignal);
router.post('/', authenticateJWT, createdimbots);
router.post('/startbot', authenticateJWT, startdimbot);
router.post('/stopbot', authenticateJWT, Stopdimbot);
router.get('/load-bot', authenticateJWT, getdimbot);


module.exports = router;

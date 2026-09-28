const express = require('express');
const router = express.Router();
const controller = require('./controller');
const verifyToken = require('../../middleware/auth');
const sessionVerifier = require('../../middleware/sessionVerifier');

// Company dashboard routes (JWT auth)
router.get('/get', verifyToken, controller.getAutoSetup);
router.post('/add', verifyToken, controller.saveAutoSetup);
router.put('/update', verifyToken, controller.saveAutoSetup);

// Storefront routes (Shopify session token auth)
router.get('/getAutoSetup', sessionVerifier, controller.getAutoSetup);
router.post('/saveAutoSetup', sessionVerifier, controller.saveAutoSetup);
router.put('/updateAutoSetup', sessionVerifier, controller.saveAutoSetup);

module.exports = router;

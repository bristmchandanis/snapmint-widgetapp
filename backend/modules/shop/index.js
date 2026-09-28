const express = require('express');
const router = express.Router();
const sessionVerifier = require('../../middleware/sessionVerifier');
const controller = require('./controller');

router.get('/getShopDetails', sessionVerifier, controller.getShopDetails);
router.post('/web-pixel/create', sessionVerifier, controller.createWebPixel);
router.post('/web-pixel/delete', sessionVerifier, controller.deleteWebPixel);
router.get('/color-customization/get', controller.getStoreColors);
router.post('/color-customization/save', controller.saveStoreColors);

module.exports = router;

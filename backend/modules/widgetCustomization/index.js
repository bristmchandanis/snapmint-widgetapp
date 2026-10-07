const express = require('express');
const router = express.Router();
const controller = require('./controller');
const verifyToken = require('../../middleware/auth');
const { checkPermission } = require('../../middleware/permission');
const sessionVerifier = require('../../middleware/sessionVerifier');

// Company dashboard routes
router.get('/get', verifyToken, checkPermission('widgetCustomization', 'read'), controller.getWidget);
router.post('/add', verifyToken, checkPermission('widgetCustomization', 'write'), controller.saveWidget);
router.put('/update', verifyToken, checkPermission('widgetCustomization', 'edit'), controller.saveWidget);
router.post('/save', verifyToken, checkPermission('widgetCustomization', 'write'), controller.saveWidget);

// Storefront routes (Shopify session auth)
router.get('/getStoreWidget', sessionVerifier, controller.getWidget);
router.get('/getStoreWidgetById', sessionVerifier, controller.getWidget);

module.exports = router;

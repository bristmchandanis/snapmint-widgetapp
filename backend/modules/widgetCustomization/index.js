const express = require('express');
const router = express.Router();
const controller = require('./controller');
const verifyToken = require('../../middleware/auth');
const { checkPermission } = require('../../middleware/permission');
const sessionVerifier = require('../../middleware/sessionVerifier');

// Company dashboard routes
router.get('/get', verifyToken, checkPermission('widgetCustomization', 'read'), controller.getWidgetCustomization);
router.get('/list', verifyToken, checkPermission('widgetCustomization', 'read'), controller.listWidgetCustomizations);
router.post('/add', verifyToken, checkPermission('widgetCustomization', 'write'), controller.saveWidgetCustomization);
router.put('/update', verifyToken, checkPermission('widgetCustomization', 'edit'), controller.saveWidgetCustomization);
router.delete('/delete', verifyToken, checkPermission('widgetCustomization', 'edit'), controller.deleteWidgetCustomization);

// Storefront routes (Shopify session auth)
router.get('/getStoreWidgetById', sessionVerifier, controller.getWidgetCustomization);
router.get('/getStoreWidget', sessionVerifier, controller.getStoreWidgets);
router.post('/addStoreWidget', sessionVerifier, controller.saveWidgetCustomization);
router.put('/updateStoreWidget', sessionVerifier, controller.saveWidgetCustomization);
router.delete('/deleteStoreWidget', sessionVerifier, controller.deleteWidgetCustomization);

module.exports = router;

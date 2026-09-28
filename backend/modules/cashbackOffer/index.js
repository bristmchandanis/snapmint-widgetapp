const express = require('express');
const router = express.Router();
const controller = require('./controller');
const verifyToken = require('../../middleware/auth');
const { checkPermission } = require('../../middleware/permission');

// Company Dashboard Admin Endpoints
router.get('/', verifyToken, checkPermission('cashbackOffer', 'read'), controller.getOffers);
router.post('/create', verifyToken, checkPermission('cashbackOffer', 'write'), controller.createOffer);
router.put('/update/:id', verifyToken, checkPermission('cashbackOffer', 'edit'), controller.updateOffer);
router.delete('/delete/:id', verifyToken, checkPermission('cashbackOffer', 'edit'), controller.deleteOffer);

module.exports = router;

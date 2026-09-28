const express = require('express');
const router = express.Router();
const { addMerchantCredential, getMerchantCredentials, deleteMerchantCredential } = require('./controller');
const verifyToken = require('../../middleware/auth');
const { checkPermission } = require('../../middleware/permission');

router.get('/list', verifyToken, checkPermission('merchantOnboard', 'read'), getMerchantCredentials);
router.post('/add', verifyToken, checkPermission('merchantOnboard', 'write'), addMerchantCredential);
router.put('/update', verifyToken, checkPermission('merchantOnboard', 'edit'), addMerchantCredential);
router.delete('/delete', verifyToken, checkPermission('merchantOnboard', 'edit'), deleteMerchantCredential);

module.exports = router;

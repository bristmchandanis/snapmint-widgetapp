const express = require('express');
const router = express.Router();
const { getActivityLogs } = require('./controller');
const verifyToken = require('../../middleware/auth');

router.get('/list', verifyToken, getActivityLogs);
router.get('/', verifyToken, getActivityLogs);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  getCoupons,
  validateAndAddCoupon,
  toggleCouponSelectable,
  syncFromShopify,
  loadDemoCoupons,
} = require('./controller');

router.get('/', getCoupons);
router.post('/validate-and-add', validateAndAddCoupon);
router.patch('/:id/toggle', toggleCouponSelectable);
router.post('/sync', syncFromShopify);
router.post('/demo-sync', loadDemoCoupons);

module.exports = router;

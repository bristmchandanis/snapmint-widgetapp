const express = require('express');
const router = express.Router();
const {
  getCoupons,
  validateAndAddCoupon,
  toggleCouponSelectable,
} = require('./controller');

router.get('/', getCoupons);
router.post('/validate-and-add', validateAndAddCoupon);
router.patch('/:id/toggle', toggleCouponSelectable);

module.exports = router;

const express = require("express");
const router = express.Router();

const appstationRoutes = require('../modules/appstation');
const shopRoutes = require('../modules/shop');
const widgetCustomizationRoutes = require('../modules/widgetCustomization');
const merchantCredentialRoutes = require('../modules/merchantCredential');
const activityLogRoutes = require('../modules/activityLog');
const cashbackOfferRoutes = require('../modules/cashbackOffer');
const couponRoutes = require('../modules/coupon');

router.use('/auth', appstationRoutes);
router.use('/shop', shopRoutes);
router.use('/widget-customization', widgetCustomizationRoutes);
router.use('/merchant-credentials', merchantCredentialRoutes);
router.use('/activity-log', activityLogRoutes);
router.use('/cashback-offer', cashbackOfferRoutes);
router.use('/coupon', couponRoutes);

module.exports = router;

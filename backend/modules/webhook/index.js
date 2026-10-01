const verifyShopifyWebhook = require("../../middleware/webhookVerifier");
const {
  handleAppUninstalled,
  shopUpdate,
  handleDiscountCreateOrUpdate,
  handleDiscountDelete,
} = require("./controller");
const express = require("express");
const router = express.Router();

router.post(
  "/app/uninstalled",
  verifyShopifyWebhook,
  handleAppUninstalled,
);

router.post(
  "/shop/update",
  verifyShopifyWebhook,
  shopUpdate,
);

router.post(
  "/discounts/create",
  verifyShopifyWebhook,
  handleDiscountCreateOrUpdate,
);

router.post(
  "/discounts/update",
  verifyShopifyWebhook,
  handleDiscountCreateOrUpdate,
);

router.post(
  "/discounts/delete",
  verifyShopifyWebhook,
  handleDiscountDelete,
);

module.exports = router;

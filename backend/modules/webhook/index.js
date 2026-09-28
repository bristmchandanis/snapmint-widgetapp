const verifyShopifyWebhook = require("../../middleware/webhookVerifier");
const { handleAppUninstalled, shopUpdate } = require("./controller");
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

module.exports = router;

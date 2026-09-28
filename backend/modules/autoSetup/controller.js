const AutoSetup = require("./model");
const Shop = require("../shop/model");
const {
  syncAutoSetupMetafieldAsync,
  formatAutoSetupPayload,
} = require("../../utils/snapmint");
const { findShopRecord } = require("../../utils/shopHelper");
const { logActivity } = require("../../utils/helper");

const AUTO_SETUP_ALLOWED_FIELDS = exports.AUTO_SETUP_ALLOWED_FIELDS = [
  'collectionGridItem', 'collectionSalePrice', 'collectionProductId',
  'collectionProductHandle', 'collectionProductName', 'collectionVariantId',
  'collectionProductAvailable', 'collectionProductUrl', 'collectionWidgetAppendTarget',
  'collectionWidgetPlacement', 'pdpPriceSelector', 'pdpSalePrice', 'pdpProductId', 'pdpProductHandle',
  'pdpProductName', 'pdpVariantId', 'pdpProductAvailable',
  'pdpProductUrl', 'pdpWidgetAppendTarget', 'pdpWidgetPlacement',
  'cartItem', 'cartTotal', 'cartWidgetAppendTarget', 'cartWidgetPlacement',
  'cartDrawerItem', 'cartDrawerTotal', 'cartDrawerWidgetAppendTarget', 'cartDrawerWidgetPlacement',
  // 'minCartItem', 'minCartTotal', 'minCartWidgetAppendTarget', 'minCartWidgetPlacement',
];

exports.getAutoSetup = async (req, res) => {
  try {
    const shopId = req.query?.shopId || req.shopId;
    const shopDomain = req.query?.shopDomain || req.shop;
    const autoSetupId = req.query?.id;

    const shop = await findShopRecord(shopId, shopDomain);
    if (!shop) {
      return res
        .status(404)
        .json({ success: false, message: "Shop not found." });
    }

    const autoSetup = autoSetupId
      ? await AutoSetup.findOne({ where: { id: autoSetupId, shopId: shop.id } })
      : await AutoSetup.findOne({
        where: { shopId: shop.id },
        order: [["updatedAt", "DESC"]],
      });

    return res.status(200).json({
      success: true,
      message: autoSetup
        ? "Auto setup retrieved successfully."
        : "No auto setup found for this shop.",
      data: formatAutoSetupPayload(autoSetup),
    });
  } catch (error) {
    console.error("[AutoSetup] get error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch auto setup configuration.",
    });
  }
};

exports.saveAutoSetup = async (req, res) => {
  try {
    const fields = req.body || {};
    const shopId = fields.shopId || fields.id;
    const shopDomain = fields.myshopifyDomain || fields.shop || req.shop;

    const shop = await findShopRecord(shopId, shopDomain);
    if (!shop) {
      return res.status(400).json({
        success: false,
        message: "Valid shopId or domain is required.",
      });
    }

    const existingAutoSetup = fields.id
      ? await AutoSetup.findByPk(fields.id)
      : await AutoSetup.findOne({
        where: { shopId: shop.id },
        order: [["updatedAt", "DESC"]],
      });

    const payload = { shopId: shop.id };
    for (const key of AUTO_SETUP_ALLOWED_FIELDS) {
      if (fields[key] !== undefined && fields[key] !== '') {
        payload[key] = fields[key];
      }
    }

    const isCreated = !existingAutoSetup;
    const autoSetupRecord = existingAutoSetup
      ? await existingAutoSetup.update(payload)
      : await AutoSetup.create(payload);

    if (!fields.skipActivityLog && req.query?.skipActivityLog !== 'true') {
      await logActivity('AUTO_SETUP_SAVED', {
        req,
        shop,
        isCreated,
      });
    }

    const autoSetupMetafieldSynced = await syncAutoSetupMetafieldAsync(
      shop,
      AutoSetup,
    );

    return res.status(200).json({
      success: true,
      message: "Auto setup saved successfully.",
      data: formatAutoSetupPayload(autoSetupRecord),
      metafieldSynced: autoSetupMetafieldSynced,
    });
  } catch (error) {
    console.error("[AutoSetup] save error:", error);
    return res.status(500).json({
      success: false,
      message: error?.message || "Failed to save auto setup configuration.",
    });
  }
};

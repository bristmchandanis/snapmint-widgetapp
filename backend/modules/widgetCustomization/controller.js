const { Widget } = require("./model");
const { findShopRecord } = require("../../utils/shopHelper");
const { successResponse, errorResponse } = require("../../utils/helper");
const { syncWidgetMetafield } = require("../../utils/snapmint");

exports.getWidget = async (req, res) => {
  try {
    const shopId = req.query?.shopId || req.query?.id || req.shopId;
    const shopDomain = req.query?.shopDomain || req.query?.shop || req.shop;

    const shop = await findShopRecord(shopId, shopDomain);
    if (!shop) {
      return successResponse(res, 200, "No widget found", { widget: null, data: null });
    }

    const widget = await Widget.findOne({
      where: { shopId: shop.id },
      order: [["updatedAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      message: "Widget data fetched successfully",
      widget: widget || null,
      data: widget ? { customization: widget, ...(widget.toJSON ? widget.toJSON() : widget) } : null,
    });
  } catch (error) {
    console.error("[Widget] get error:", error);
    return errorResponse(res, 500, "Failed to fetch widget data.", error);
  }
};

exports.saveWidget = async (req, res) => {
  try {
    const fields = req.body || {};
    const shopId = fields.shopId || req.shopId;
    const shopDomain = fields.shopDomain || req.shop;

    const shop = await findShopRecord(shopId, shopDomain);
    if (!shop) {
      return errorResponse(res, 404, "Shop not found.");
    }

    const updateData = {};
    if (fields.plans !== undefined) updateData.plans = fields.plans;
    if (fields.priceBands !== undefined) updateData.priceBands = fields.priceBands;
    if (fields.configure !== undefined) updateData.configure = fields.configure;
    if (fields.configuration !== undefined && fields.configure === undefined) {
      updateData.configure = fields.configuration;
    }
    if (fields.customization !== undefined) updateData.customization = fields.customization;
    if (fields.targeting !== undefined) updateData.targeting = fields.targeting;
    if (fields.isActive !== undefined) updateData.isActive = Boolean(fields.isActive);

    let [widget, created] = await Widget.findOrCreate({
      where: { shopId: shop.id },
      defaults: {
        shopId: shop.id,
        ...updateData,
      },
    });

    if (!created) {
      await widget.update(updateData);
    }

    // Sync single widget metafield to Shopify
    if (shop.token) {
      syncWidgetMetafield(shop, widget).catch((err) =>
        console.warn("[Widget] Sync widget metafield error:", err.message)
      );
    }

    return res.status(200).json({
      success: true,
      message: "Widget saved successfully",
      widget,
      data: { customization: widget, ...(widget.toJSON ? widget.toJSON() : widget) },
    });
  } catch (error) {
    console.error("[Widget] save error:", error);
    return errorResponse(res, 500, "Failed to save widget data.", error);
  }
};
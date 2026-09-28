const { WidgetCustomization, WidgetCustomizationStyle } = require("./model");
const Shop = require("../shop/model");
const AutoSetup = require("../autoSetup/model");
const sequelize = require("../../config/db");
const { Op } = require("sequelize");
const {
  syncMetafieldAsync,
  syncAutoSetupMetafieldAsync,
  formatWidgetLayoutMetafield,
} = require("../../utils/snapmint");
const { findShopRecord } = require("../../utils/shopHelper");
const { logActivity } = require("../../utils/helper");
const { AUTO_SETUP_ALLOWED_FIELDS } = require("../autoSetup/controller");

const LAYOUT_ALLOWED_FIELDS = [
  "masterTemplateLayout",
  "placement",
  "placements",
  "minAmount",
  "maxAmount",
  "isCustomRange",
  "tenure",
  "dpPercent",
  "dpType",
  "emiPercent",
  "isActive",
];

const INLINE_STYLE_KEYS = [
  "layoutType",
  "isNewBadge",
  "newBadgeText",
  "isDiscountBadge",
  "discountBadgeText",
  "pricePrefixText",
  "priceText",
  "emiOptionText",
  "isBranding",
  "ctaText",
  "isInfoIcon",
  "infoTooltipText",
  "secondaryEmiText",
  "secondaryEmiOptionText",
  "secondaryEmiOptionTextColor",
  "isUpiBranding",
];

const STYLE_ALLOWED_FIELDS = [
  "titleText",
  "logoUrl",
  "buttonText",
  "badgeText",
  "footerText",
  "step1Text",
  "feature1Text",
  "feature2Text",
  "feature3Text",
  "inlineWidgetConfig",
  "masterPopupConfig",
  ...INLINE_STYLE_KEYS,
];

const STYLE_EXCLUDED_KEYS = new Set([...INLINE_STYLE_KEYS, 'inlineWidgetConfig', 'masterPopupConfig']);

const formatCustomizationPayload = (
  customizationRecord,
  styleRecord,
  options = {},
) => {
  const customizationData = customizationRecord
    ? (customizationRecord.toJSON ? customizationRecord.toJSON() : customizationRecord)
    : {};
  const styleData = styleRecord
    ? (styleRecord.toJSON ? styleRecord.toJSON() : styleRecord)
    : customizationData.style || {};

  const { id: _sId, shopId: _sShopId, widgetCustomizationId: _wId, createdAt: _sCa, updatedAt: _sUa, shop: _sShop, ...cleanStyle } = styleData;
  const { shop: _cShop, style: _cStyle, shopId: _cShopId, ...cleanCustomization } = customizationData;

  if (options.flat) {
    return {
      ...cleanCustomization,
      ...cleanStyle,
    };
  }

  const metafieldValue = {
    ...cleanCustomization,
    ...cleanStyle,
  };

  const metafieldObject = formatWidgetLayoutMetafield(metafieldValue);

  return {
    customization: {
      id: customizationData.id,
      shopId: customizationData.shopId,
      createdAt: customizationData.createdAt,
      updatedAt: customizationData.updatedAt,
      metafield: metafieldObject,
    },
    metafieldValue,
  };
};

const extractPlacementsList = (recordOrPayload) => {
  const raw = recordOrPayload?.placements;
  if (Array.isArray(raw) && raw.length > 0) return raw;
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch { }
  }
  if (recordOrPayload?.placement) return [recordOrPayload.placement];
  return ["PDP"];
};

exports.getWidgetCustomization = async (req, res) => {
  try {
    const shopId = req.query?.shopId || req.shopId;
    const shopDomain = req.query?.shopDomain || req.shop;
    const customizationId = req.query?.id;

    let customization = null;

    if (customizationId) {
      customization = await WidgetCustomization.findByPk(customizationId, {
        include: [{ model: WidgetCustomizationStyle, as: "style" }],
      });
    } else if (shopId || shopDomain) {
      const shop = await findShopRecord(shopId, shopDomain);
      if (!shop) {
        return res
          .status(404)
          .json({ success: false, message: "Shop not found." });
      }
      customization = await WidgetCustomization.findOne({
        where: { shopId: shop.id },
        include: [{ model: WidgetCustomizationStyle, as: "style" }],
        order: [["updatedAt", "DESC"]],
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "id, shopId or domain parameter is required.",
      });
    }

    if (!customization) {
      return res.status(200).json({
        success: true,
        message: "No widget customization found.",
        data: null,
      });
    }

    const { customization: formattedCustomization } =
      formatCustomizationPayload(customization, customization.style);

    return res.status(200).json({
      success: true,
      message: "Widget customization retrieved successfully.",
      data: {
        customization: formattedCustomization,
      },
    });
  } catch (error) {
    console.error("[WidgetCustomization] get error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch widget customization.",
    });
  }
};

// Deactivate conflicting earlier widgets for the same shop & range when locations overlap
const deactivateConflictingWidgets = async (shopId, minAmount, maxAmount, locations, currentId, transaction) => {
  if (minAmount == null || maxAmount == null) return;
  const existing = await WidgetCustomization.findAll({
    where: {
      shopId,
      minAmount: Number(minAmount),
      maxAmount: Number(maxAmount),
      isActive: true,
      ...(currentId ? { id: { [Op.ne]: Number(currentId) } } : {}),
    },
    attributes: ['id', 'placements', 'placement'],
    raw: true,
    transaction,
  });

  const matchingIds = existing
    .filter((widget) => locations.some((loc) => extractPlacementsList(widget).includes(loc)))
    .map((widget) => widget.id);

  if (matchingIds.length > 0) {
    await WidgetCustomization.update(
      { isActive: false },
      { where: { id: matchingIds }, transaction }
    );
  }
};

// Reactivate latest inactive widget for range when an active widget is deleted
const reactivateLatestOnDelete = async (shopId, minAmount, maxAmount) => {
  if (minAmount == null || maxAmount == null) return;
  const latestInactive = await WidgetCustomization.findOne({
    where: {
      shopId,
      minAmount: Number(minAmount),
      maxAmount: Number(maxAmount),
      isActive: false,
    },
    order: [["updatedAt", "DESC"], ["id", "DESC"]],
  });

  if (latestInactive) {
    await latestInactive.update({ isActive: true });
  }
};

exports.saveWidgetCustomization = async (req, res) => {
  try {
    const fields = req.body || {};
    const shopId = fields.shopId || req.query?.shopId;
    const shopDomain = fields.myshopifyDomain || req.query?.shopDomain;

    const shop = await findShopRecord(shopId, shopDomain);
    if (!shop) {
      return res.status(400).json({
        success: false,
        message: "Valid shopId or domain is required.",
      });
    }

    if (shop.onboardStatus !== "APPROVED") {
      return res.status(400).json({
        success: false,
        message: "Store onboarding is not approved yet.",
      });
    }

    const hasWidgetPayloadFields = LAYOUT_ALLOWED_FIELDS.some(
      (key) => key !== "isActive" && fields[key] !== undefined
    ) || STYLE_ALLOWED_FIELDS.some(
      (key) => fields[key] !== undefined
    ) || fields.customizationId !== undefined || fields.id !== undefined;

    if (fields.allowCustomization !== undefined) {
      const allowVal =
        fields.allowCustomization === "1" ||
          fields.allowCustomization === 1 ||
          fields.allowCustomization === true
          ? "1"
          : "0";

      await shop.update({ allowCustomization: allowVal });

      if (!hasWidgetPayloadFields) {
        logActivity('STORE_CUSTOMIZATION_TOGGLED', {
          req,
          shop,
          allowCustomization: allowVal,
        });

        return res.status(200).json({
          success: true,
          message: "Store customization setting updated successfully.",
          allowCustomization: allowVal,
        });
      }
    }

    const customizationId = fields.customizationId || fields.id;
    const existingCustomization = customizationId
      ? await WidgetCustomization.findByPk(customizationId)
      : null;

    const layoutPayload = { shopId: shop.id };
    for (const key of LAYOUT_ALLOWED_FIELDS) {
      if (fields[key] !== undefined) layoutPayload[key] = fields[key];
    }

    layoutPayload.isActive = true;

    const { customization, style } = await sequelize.transaction(async (transaction) => {
      const targetPlacements = extractPlacementsList(layoutPayload);
      await deactivateConflictingWidgets(
        shop.id,
        layoutPayload.minAmount,
        layoutPayload.maxAmount,
        targetPlacements,
        customizationId,
        transaction
      );

      const custRecord = existingCustomization
        ? await existingCustomization.update(layoutPayload, { transaction })
        : await WidgetCustomization.create(layoutPayload, { transaction });

      const existingStyle = await WidgetCustomizationStyle.findOne({
        where: { widgetCustomizationId: custRecord.id },
        transaction,
      });

      const currentInlineConfig = (existingStyle && existingStyle.inlineWidgetConfig) || {};
      const incomingConfig = fields.inlineWidgetConfig;
      const newInlineConfig = typeof incomingConfig === 'object' && incomingConfig !== null
        ? { ...currentInlineConfig, ...incomingConfig }
        : { ...currentInlineConfig };

      for (const key of INLINE_STYLE_KEYS) {
        if (fields[key] !== undefined) {
          newInlineConfig[key] = fields[key];
        }
      }

      const currentMasterConfig = (existingStyle && existingStyle.masterPopupConfig) || {};
      const incomingMasterConfig = fields.masterPopupConfig;
      const newMasterPopupConfig = typeof incomingMasterConfig === 'object' && incomingMasterConfig !== null
        ? { ...currentMasterConfig, ...incomingMasterConfig }
        : { ...currentMasterConfig };

      const stylePayload = {
        shopId: shop.id,
        widgetCustomizationId: custRecord.id,
        inlineWidgetConfig: newInlineConfig,
        masterPopupConfig: newMasterPopupConfig,
      };
      for (const key of STYLE_ALLOWED_FIELDS) {
        if (fields[key] !== undefined && !STYLE_EXCLUDED_KEYS.has(key)) {
          stylePayload[key] = fields[key];
        }
      }

      const styleRecord = existingStyle
        ? await existingStyle.update(stylePayload, { transaction })
        : await WidgetCustomizationStyle.create(stylePayload, {
          transaction,
        });

      return { customization: custRecord, style: styleRecord };
    });

    // Save/update Auto Setup selectors if provided in the payload
    const autoSetupPayload = { shopId: shop.id };
    let hasAutoSetupFields = false;
    for (const key of AUTO_SETUP_ALLOWED_FIELDS) {
      if (fields[key] !== undefined && fields[key] !== "") {
        autoSetupPayload[key] = fields[key];
        hasAutoSetupFields = true;
      }
    }

    if (hasAutoSetupFields) {
      const existingAutoSetup = await AutoSetup.findOne({
        where: { shopId: shop.id },
        order: [["updatedAt", "DESC"]],
      });
      if (existingAutoSetup) {
        await existingAutoSetup.update(autoSetupPayload);
      } else {
        await AutoSetup.create(autoSetupPayload);
      }
    }

    await Promise.all([
      syncMetafieldAsync(
        shop,
        WidgetCustomization,
        WidgetCustomizationStyle,
      ),
      syncAutoSetupMetafieldAsync(
        shop,
        AutoSetup,
      ),
    ]);
    const { customization: formattedCustomization } =
      formatCustomizationPayload(customization, style);

    logActivity('WIDGET_CONFIG_SAVED', {
      req,
      shop,
      isUpdate: !!existingCustomization,
      metadata: { customizationId: customization.id, placement: layoutPayload.placement, placements: layoutPayload.placements },
    });

    return res.status(200).json({
      success: true,
      message: "Widget customization saved successfully.",
      data: {
        id: customization.id,
        customization: formattedCustomization,
      },
    });
  } catch (error) {
    console.error("[WidgetCustomization] save error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to save widget customization.",
    });
  }
};

exports.listWidgetCustomizations = async (req, res) => {
  try {
    const customizations = await WidgetCustomization.findAll({
      include: [
        {
          model: Shop,
          as: "shop",
          attributes: ["id", "name", "myshopifyDomain", "email", "shopOwner"],
        },
        { model: WidgetCustomizationStyle, as: "style" },
      ],
      order: [["updatedAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      message: "Widget customizations retrieved successfully.",
      data: customizations,
    });
  } catch (error) {
    console.error("[WidgetCustomization] list error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch widget customizations list.",
    });
  }
};

exports.deleteWidgetCustomization = async (req, res) => {
  try {
    const id = req.body?.id || req.query?.id;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Widget customization ID is required.",
      });
    }
    const customization = await WidgetCustomization.findByPk(id, {
      include: [{ model: Shop, as: "shop" }],
    });
    if (!customization) {
      return res
        .status(404)
        .json({ success: false, message: "Widget customization not found." });
    }

    const { shop, shopId, minAmount, maxAmount, isActive } = customization;
    const wasActive = isActive !== false;

    await customization.destroy();

    const remainingCount = await WidgetCustomization.count({ where: { shopId } });
    if (remainingCount === 0) {
      await AutoSetup.destroy({ where: { shopId } });
      if (shop) {
        await Promise.all([
          syncAutoSetupMetafieldAsync(shop, AutoSetup),
          syncMetafieldAsync(shop, WidgetCustomization, WidgetCustomizationStyle),
        ]);
      }
    } else {
      if (wasActive && shopId) {
        await reactivateLatestOnDelete(shopId, minAmount, maxAmount);
      }
      if (shop) {
        await syncMetafieldAsync(
          shop,
          WidgetCustomization,
          WidgetCustomizationStyle,
        );
      }
    }

    logActivity('WIDGET_CONFIG_DELETED', { req, shop, id, metadata: { id } });

    return res.status(200).json({
      success: true,
      message: "Widget customization deleted successfully.",
    });
  } catch (error) {
    console.error("[WidgetCustomization] delete error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to delete widget customization.",
    });
  }
};

exports.getStoreWidgets = async (req, res) => {
  try {
    const shopId = req.params?.shopId || req.shopId;
    const shopDomain = req.query?.shopDomain || req.shop;

    const shop = await findShopRecord(shopId, shopDomain);
    if (!shop) {
      return res
        .status(404)
        .json({ success: false, message: "Shop not found." });
    }

    const customizations = await WidgetCustomization.findAll({
      where: { shopId: shop.id },
      include: [{ model: WidgetCustomizationStyle, as: "style" }],
      order: [["updatedAt", "DESC"]],
    });

    const formattedList = customizations.map((cust) =>
      formatCustomizationPayload(cust, cust.style, { flat: true }),
    );

    return res.status(200).json({
      success: true,
      message: "Store widget customizations retrieved successfully.",
      data: formattedList,
    });
  } catch (error) {
    console.error(
      "[WidgetCustomization] getStoreWidgets error:",
      error.message,
    );
    return res.status(500).json({
      success: false,
      message: "Failed to fetch store widget customizations.",
    });
  }
};
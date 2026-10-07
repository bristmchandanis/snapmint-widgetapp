const {
  ONBOARD_STATUS,
  WIDGET_STATUS,
  APP_STATUS,
  APP_INSTALL,
  SEQUELIZE_OP,
} = require("../../config/constants");
const { auth } = require("../../config/shopify");
const { getGraphQLClient } = require("../../utils/common");
const {
  successResponse,
  errorResponse,
  sanitizeString,
  logActivity,
} = require("../../utils/helper");
const {
  SHOP_QUERY,
  GET_METAFIELD_QUERY,
  WEB_PIXEL_CREATE_MUTATION,
  WEB_PIXEL_DELETE_MUTATION,
  APP_ACCESS_SCOPES_QUERY,
} = require("./graphqlQuery");
const Shop = require("./model");
const MerchantCredential = require("../merchantCredential/model");
const { syncSnapmintMetafield } = require("../../utils/snapmint");
const { findShopRecord } = require("../../utils/shopHelper");

exports.getShopDetails = async (req, res) => {
  try {
    const { sessionToken, shopDomain } = req;

    if (!sessionToken || !shopDomain) {
      return errorResponse(
        res,
        400,
        "Session token and shop domain are required.",
      );
    }

    const cleanShopDomain = sanitizeString(shopDomain);
    const shopHandle = cleanShopDomain.split(".")[0];

    // 1. Parallelize token exchange and initial DB lookups concurrently
    const [{ session: newSession }, merchantCred, existingShop] = await Promise.all([
      auth.tokenExchange({
        sessionToken,
        shop: shopDomain,
      }),
      MerchantCredential.findOne({
        where: {
          [SEQUELIZE_OP.or]: [
            { shop: cleanShopDomain },
            { shop: shopHandle },
            { shop: `${shopHandle}.myshopify.com` },
          ],
        },
      }),
      Shop.findOne({ where: { myshopifyDomain: shopDomain } }),
    ]);
    const accessToken = newSession.accessToken;

    if (merchantCred && merchantCred.appInstall !== APP_INSTALL.INSTALLED) {
      merchantCred
        .update({ appInstall: APP_INSTALL.INSTALLED })
        .catch(() => { });
    }

    // 3. Resolve status & credentials
    const merchantId = merchantCred?.merchantId || existingShop?.merchantId;
    const merchantToken = merchantCred?.token || existingShop?.merchantToken;
    const onboardStatus = merchantCred
      ? ONBOARD_STATUS.APPROVED
      : existingShop?.onboardStatus || ONBOARD_STATUS.PENDING;
    const widgetStatus = merchantCred
      ? WIDGET_STATUS.ENABLED
      : existingShop?.widgetStatus || WIDGET_STATUS.DISABLED;
    const appStatus =
      widgetStatus === WIDGET_STATUS.ENABLED
        ? APP_STATUS.ENABLED
        : APP_STATUS.DISABLED;

    let shop = existingShop ? existingShop.toJSON() : null;
    const isNewOrReinstalled =
      !existingShop || existingShop.appInstall === APP_INSTALL.UNINSTALLED;

    // 4. Create single shared GraphQL client (Reused across calls)
    const { graphqlClient } = await getGraphQLClient({
      shopDomain,
      accessToken,
    });

    // 5. Fetch shop info & upsert if new or reinstalled
    if (isNewOrReinstalled) {
      const gqlResponse = await graphqlClient.request(SHOP_QUERY);
      const shopInfo = gqlResponse?.data?.shop;

      if (!shopInfo) {
        return errorResponse(
          res,
          502,
          "Unable to fetch shop info from Shopify.",
        );
      }

      const upsertData = {
        myshopifyDomain: shopDomain,
        token: accessToken,
        domain: shopInfo.primaryDomain?.host,
        name: shopInfo.name,
        email: shopInfo.email,
        province: shopInfo.billingAddress?.province,
        country: shopInfo.country || shopInfo.billingAddress?.country,
        city: shopInfo.city || shopInfo.billingAddress?.city,
        currency: shopInfo.currencyCode,
        ianaTimezone: shopInfo.ianaTimezone,
        shopOwner: shopInfo.shopOwnerName,
        moneyFormat: shopInfo.currencyFormats?.moneyFormat,
        moneyWithCurrencyFormat:
          shopInfo.currencyFormats?.moneyWithCurrencyFormat,
        weightUnit: shopInfo.weightUnit,
        planDisplayName: shopInfo.plan?.publicDisplayName,
        planName: shopInfo.plan?.shopifyPlus
          ? "shopify_plus"
          : shopInfo.plan?.publicDisplayName,
        isScopeUpdate: "1",
        appInstall: APP_INSTALL.INSTALLED,
        merchantId,
        merchantToken,
        onboardStatus,
        widgetStatus,
        appStatus,
        webPixelId: null,
      };

      if (existingShop) {
        await existingShop.update(upsertData);
        shop = existingShop.toJSON();
      } else {
        const createdShop = await Shop.create(upsertData);
        shop = createdShop.toJSON();
      }
    } else {
      const updateData = {};
      if (existingShop.token !== accessToken) {
        updateData.token = accessToken;
        updateData.appInstall = APP_INSTALL.INSTALLED;
        updateData.webPixelId = null;
      }
      if (existingShop.appInstall !== APP_INSTALL.INSTALLED) {
        updateData.appInstall = APP_INSTALL.INSTALLED;
        updateData.webPixelId = null;
      }

      if (
        merchantCred &&
        (existingShop.merchantId !== merchantId ||
          existingShop.merchantToken !== merchantToken ||
          existingShop.onboardStatus !== onboardStatus ||
          existingShop.widgetStatus !== widgetStatus)
      ) {
        updateData.merchantId = merchantId;
        updateData.merchantToken = merchantToken;
        updateData.onboardStatus = onboardStatus;
        updateData.widgetStatus = widgetStatus;
        updateData.appStatus = appStatus;
      }

      if (Object.keys(updateData).length > 0) {
        await existingShop.update(updateData);
        shop = existingShop.toJSON();
      }
    }

    // 6. Sync Snapmint EMI plans metafield — only on new install or reinstall

    if (isNewOrReinstalled) {
      const activeMerchantToken = merchantCred?.merchantToken || merchantToken;
      const isWidgetEnabled =
        (shop?.widgetStatus || widgetStatus) === WIDGET_STATUS.ENABLED;
      await syncSnapmintMetafield(
        graphqlClient,
        activeMerchantToken,
        isWidgetEnabled,
      );
      logActivity('SHOPIFY_APP_INSTALLED', {
        req,
        shopDomain,
        shop,
      });
    }

    // 7. Strip sensitive token & return
    const { token: _token, ...safeShopData } = shop || {};
    const getGqlResponse = await graphqlClient.request(GET_METAFIELD_QUERY, {
      variables: {
        namespace: "snapmint_emi",
        key: "merchant_plans",
      },
    });

    const merchantPlanValue = getGqlResponse?.data?.shop?.metafield?.value || getGqlResponse?.body?.data?.shop?.metafield?.value;
    let parsedMerchantPlan = [];
    if (merchantPlanValue) {
      try {
        parsedMerchantPlan = JSON.parse(merchantPlanValue);
      } catch (e) {
        console.warn("Failed to parse merchantPlan JSON:", e);
      }
    }

    return successResponse(res, 200, "Shop details retrieved successfully.", {
      allowCustomization: safeShopData.allowCustomization,
      hasWebPixel: safeShopData.hasWebPixel,
      isWebPixelCreated: Boolean(safeShopData.webPixelId),
      appInstall: safeShopData.appInstall,
      appStatus: safeShopData.appStatus,
      myshopifyDomain: safeShopData.myshopifyDomain,
      onboardStatus: safeShopData.onboardStatus,
      planName: safeShopData.planName,
      widgetStatus: safeShopData.widgetStatus,
      id: safeShopData.id,
      merchantPlan: parsedMerchantPlan,
    });
  } catch (error) {
    console.error("[ShopDetails] Error:", error.message);
    return errorResponse(res, 401, error.message || "Invalid session token.", error);
  }
};

exports.createWebPixel = async (req, res) => {
  try {
    const shop = await findShopRecord(req.shopId || req.body?.shopId, req.shopDomain || req.body?.shopDomain);
    if (!shop) return errorResponse(res, 404, "Shop not found.");

    if (shop.webPixelId) {
      return successResponse(res, 200, "Web pixel already configured.", {
        isWebPixelCreated: true,
        webPixelId: shop.webPixelId,
      });
    }

    const { graphqlClient } = await getGraphQLClient({
      shopDomain: shop.myshopifyDomain,
      accessToken: shop.token,
    });
    if (!graphqlClient) return errorResponse(res, 500, "Unable to initialize Shopify GraphQL client.");

    // Query granted access scopes
    try {
      const scopeRes = await graphqlClient.request(APP_ACCESS_SCOPES_QUERY);
      const scopes = scopeRes?.data?.app?.availableAccessScopes || [];
      const hasPixelScope = scopes.some((s) => s.handle === "write_pixels");
      if (!hasPixelScope) {
        console.warn(`[WebPixel] Scope 'write_pixels' not yet granted for ${shop.myshopifyDomain}`);
      }
    } catch (scopeErr) {
      console.warn("[WebPixel] Scope query note:", scopeErr.message);
    }

    const accountID = req.body?.accountID || shop.merchantId;
    const gqlRes = await graphqlClient.request(WEB_PIXEL_CREATE_MUTATION, {
      variables: { webPixel: { settings: JSON.stringify({ accountID }) } },
    });

    const userErrors = gqlRes?.data?.webPixelCreate?.userErrors || [];
    const pixel = gqlRes?.data?.webPixelCreate?.webPixel;

    if (userErrors.length > 0 && !pixel) {
      return errorResponse(res, 400, userErrors[0]?.message || "Failed to create web pixel.", userErrors);
    }

    if (pixel?.id) {
      await shop.update({ hasWebPixel: "1", webPixelId: pixel.id });
    }

    return successResponse(res, 200, "Web pixel created successfully.", {
      isWebPixelCreated: true,
    });
  } catch (error) {
    return errorResponse(res, 500, error.message || "Failed to create web pixel.", error);
  }
};

exports.deleteWebPixel = async (req, res) => {
  try {
    const shop = await findShopRecord(req.shopId || req.body?.shopId, req.shopDomain || req.body?.shopDomain);
    if (!shop) return errorResponse(res, 404, "Shop not found.");

    if (!shop.webPixelId) {
      await shop.update({ hasWebPixel: "0" });
      return successResponse(res, 200, "Web pixel is not configured.", {
        isWebPixelCreated: false,
      });
    }

    const { graphqlClient } = await getGraphQLClient({
      shopDomain: shop.myshopifyDomain,
      accessToken: shop.token,
    });

    if (graphqlClient && shop.webPixelId) {
      const gqlRes = await graphqlClient.request(WEB_PIXEL_DELETE_MUTATION, {
        variables: { id: shop.webPixelId },
      });
      const userErrors = gqlRes?.data?.webPixelDelete?.userErrors || [];
      if (userErrors.length > 0) {
        console.warn("[deleteWebPixel] Shopify userErrors:", userErrors);
      }
    }

    await shop.update({ hasWebPixel: "0", webPixelId: null });

    return successResponse(res, 200, "Web pixel deleted successfully.", {
      isWebPixelCreated: false,
    });
  } catch (error) {
    console.error("[deleteWebPixel] Error:", error.message);
    return errorResponse(res, 500, error.message || "Failed to delete web pixel.", error);
  }
};

exports.getStoreColors = async (req, res) => {
  try {
    const shopId = req.query?.shopId || req.shopId;
    const shopDomain = req.query?.shopDomain || req.shop;

    const shop = await findShopRecord(shopId, shopDomain);
    if (!shop) {
      return errorResponse(res, 404, "Shop not found.");
    }

    const colorConfig = shop.colorConfig || {};
    return successResponse(res, 200, "Store colors retrieved successfully.", {
      id: shop.id,
      name: shop.name,
      myshopifyDomain: shop.myshopifyDomain,
      colorConfig,
    });
  } catch (error) {
    console.error("[StoreColors] get error:", error.message);
    return errorResponse(res, 500, "Failed to fetch store color configuration.");
  }
};

exports.saveStoreColors = async (req, res) => {
  try {
    const fields = req.body || {};
    const shopId = fields.shopId || fields.id;
    const shopDomain = fields.myshopifyDomain || fields.shop || req.shop;

    const shop = await findShopRecord(shopId, shopDomain);
    if (!shop) {
      return errorResponse(res, 400, "Valid shopId or domain is required.");
    }

    const colorConfig = fields.colorConfig || {
      innerLayoutColors: fields.innerLayoutColors || {},
      masterPopupColors: fields.masterPopupColors || {},
    };

    // Save JSON colorConfig column on Shop table
    await shop.update({ colorConfig });

    logActivity('STORE_COLORS_SAVED', { req, shop });

    return successResponse(res, 200, "Store colors saved successfully.", {
      colorConfig,
    });
  } catch (error) {
    console.error("[StoreColors] save error:", error.message);
    return errorResponse(res, 500, "Failed to save store color configuration.");
  }
};

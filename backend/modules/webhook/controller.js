const {
  successResponse,
  errorResponse,
  sanitizeString,
  logActivity,
} = require("../../utils/helper");
const { APP_INSTALL, SEQUELIZE_OP } = require("../../config/constants");
const Shop = require("../shop/model");
const MerchantCredential = require("../merchantCredential/model");

exports.handleAppUninstalled = async (req, res) => {
  try {
    const shopDomain = req.get("X-Shopify-Shop-Domain");

    console.log(`Received APP_UNINSTALLED webhook from ${shopDomain}`);

    if (shopDomain) {
      const cleanShopDomain = sanitizeString(shopDomain);

      await Promise.all([
        Shop.update(
          {
            recurringCharge: "0",
            chargeId: null,
            planType: "0",
            planInterval: "1",
            appInstall: APP_INSTALL.UNINSTALLED,
            webPixelId: null,
          },
          {
            where: {
              myshopifyDomain: shopDomain,
            },
          },
        ),
        MerchantCredential.update(
          { appInstall: APP_INSTALL.UNINSTALLED },
          { where: { shop: cleanShopDomain } },
        ),
      ]);

      logActivity('SHOPIFY_APP_UNINSTALLED', { req, shopDomain: cleanShopDomain });
    }

    return successResponse(res, 200, "Webhook processed successfully");
  } catch (error) {
    console.error("Error processing app uninstalled webhook:", error);
    return errorResponse(
      res,
      500,
      "Unable to process webhook. Please try again.",
      error,
    );
  }
};

exports.shopUpdate = async (req, res) => {
  try {
    const rawDomain = req.headers["x-shopify-shop-domain"];
    console.log(
      `[Webhook] Received SHOP_UPDATE webhook for: ${rawDomain || "unknown"}`,
    );
    let payload = req.body;

    if (Buffer.isBuffer(payload)) {
      payload = JSON.parse(payload.toString("utf8"));
    } else if (typeof payload === "string") {
      payload = JSON.parse(payload);
    }

    if (rawDomain && payload) {
      const cleanShopDomain = sanitizeString(rawDomain);
      const handle = cleanShopDomain.split(".")[0];

      await Shop.update(
        {
          domain: payload.domain,
          name: payload.name,
          email: payload.email,
          province: payload.province,
          country:
            payload.country || payload.country_name || payload.country_code,
          city: payload.city,
          currency: payload.currency,
          ianaTimezone: payload.iana_timezone,
          timezone: payload.timezone,
          moneyFormat: payload.money_format,
          moneyWithCurrencyFormat: payload.money_with_currency_format,
          weightUnit: payload.weight_unit,
          planDisplayName: payload.plan_display_name,
          planName: payload.plan_name,
        },
        {
          where: {
            [SEQUELIZE_OP.or]: [
              { myshopifyDomain: cleanShopDomain },
              { myshopifyDomain: handle },
              { myshopifyDomain: `${handle}.myshopify.com` },
            ],
          },
        },
      );
    }
    return res.status(200).send({ message: "ok" });
  } catch (error) {
    console.error("=========Webhooks shopUpdate========", error);
    return res.status(200).send({ message: "ok" });
  }
};

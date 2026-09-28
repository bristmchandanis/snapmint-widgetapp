const axios = require('axios');
const { SET_METAFIELD_MUTATION, SHOP_QUERY } = require('../modules/shop/graphqlQuery');
const Shop = require('../modules/shop/model');
const { getGraphQLClient } = require('./common');
const { cleanTermsAndConditions } = require('./helper');

const SNAPMINT_API_URL = process.env.SNAPMINT_API_URL;
const SNAPMINT_METAFIELD_NAMESPACE = 'snapmint_emi';
const WIDGET_LAYOUT_KEY = 'widget_layout';
const AUTO_SETUP_KEY = 'auto_setup';
const MERCHANT_PLANS_KEY = 'merchant_plans';
const INNER_COLORS_KEY = 'inner_layout_colors';
const MASTER_COLORS_KEY = 'master_popup_colors';
const CASHBACK_OFFER_KEY = 'cashback_offer';

const cleanObject = (obj, extraKeys = []) => {
  if (!obj) return {};
  const raw = obj.toJSON ? obj.toJSON() : obj;
  const result = { ...raw };
  delete result.id;
  delete result.shopId;
  delete result.createdAt;
  delete result.updatedAt;
  for (const key of extraKeys) delete result[key];
  return result;
};

const resolveShopAndClient = async (shop) => {
  if (!shop) return null;
  let targetShop = shop;
  if ((!targetShop.token || !targetShop.myshopifyDomain) && targetShop.id) {
    targetShop = await Shop.findByPk(targetShop.id);
  }
  if (!targetShop?.token || !targetShop?.myshopifyDomain) return null;
  const { graphqlClient } = await getGraphQLClient({
    shopDomain: targetShop.myshopifyDomain,
    accessToken: targetShop.token,
  });
  if (!graphqlClient) return null;
  return { targetShop, graphqlClient };
};

const createMetafield = (key, value = null) => ({
  namespace: SNAPMINT_METAFIELD_NAMESPACE,
  key,
  type: 'json',
  value,
});

const formatWidgetLayoutMetafield = (value) => createMetafield(WIDGET_LAYOUT_KEY, value);

const formatAutoSetupPayload = (autoSetupRecord) => {
  if (!autoSetupRecord) return null;
  const raw = autoSetupRecord.toJSON ? autoSetupRecord.toJSON() : autoSetupRecord;
  return {
    id: raw.id,
    shopId: raw.shopId,
    metafield: createMetafield(AUTO_SETUP_KEY, cleanObject(raw)),
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
};

const shopGqlIdCache = new Map();

const getShopGqlId = async (graphqlClient) => {
  const shopDomain = graphqlClient?.session?.shop;

  if (shopDomain && shopGqlIdCache.has(shopDomain)) {
    return shopGqlIdCache.get(shopDomain);
  }

  try {
    const response = await graphqlClient.request(SHOP_QUERY);
    const ownerId = response?.data?.shop?.id || response?.body?.data?.shop?.id || null;

    if (ownerId && shopDomain) {
      shopGqlIdCache.set(shopDomain, ownerId);
    }

    return ownerId;
  } catch (error) {
    console.error('[Snapmint] Failed to retrieve Shop GraphQL ID:', error.message);
    return null;
  }
};

const setShopMetafield = async (graphqlClient, key, data = {}) => {
  if (!graphqlClient || data == null) {
    console.warn(`[Snapmint] setShopMetafield skipped for key "${key}": missing client or data.`);
    return false;
  }

  try {
    const ownerId = await getShopGqlId(graphqlClient);
    if (!ownerId) {
      console.warn(`[Snapmint] setShopMetafield skipped for key "${key}": could not get shop GQL ownerId.`);
      return false;
    }

    const payloadValue = typeof data === 'string' ? data : JSON.stringify(data);

    const res = await graphqlClient.request(SET_METAFIELD_MUTATION, {
      variables: {
        metafields: [{
          ownerId,
          namespace: SNAPMINT_METAFIELD_NAMESPACE,
          key,
          type: 'json',
          value: payloadValue,
        }],
      },
    });

    const userErrors =
      res?.data?.metafieldsSet?.userErrors ||
      res?.body?.data?.metafieldsSet?.userErrors ||
      [];

    if (userErrors.length > 0) {
      console.warn(`[Snapmint] Metafield set userErrors for key "${key}":`, userErrors);
    }

    return userErrors.length === 0;
  } catch (err) {
    console.error(`[Snapmint] setShopMetafield exception for key "${key}":`, err.message || err);
    return false;
  }
};

const compileShopAllWidgetsMetafieldPayload = async (WidgetCustomization, WidgetCustomizationStyle, shopId) => {
  const allCustomizations = await WidgetCustomization.findAll({
    where: { shopId, isActive: true },
    include: [{ model: WidgetCustomizationStyle, as: 'style' }],
    order: [['id', 'ASC']],
  });

  const widgetsList = allCustomizations.map((item) => {
    const custData = item.toJSON();
    const styleData = custData.style || {};
    delete custData.style;
    delete custData.shopId;

    const cleanStyle = cleanObject(styleData, ['widgetCustomizationId']);

    return {
      ...custData,
      ...cleanStyle,
    };
  });

  return {
    widgets: widgetsList,
  };
};

const syncWidgetLayoutMetafield = async (graphqlClient, layoutData) => {
  return await setShopMetafield(graphqlClient, WIDGET_LAYOUT_KEY, layoutData);
};

const syncMetafieldAsync = async (shop, WidgetCustomization, WidgetCustomizationStyle) => {
  try {
    const resolved = await resolveShopAndClient(shop);
    if (!resolved) return false;
    const { targetShop, graphqlClient } = resolved;

    const payload = await compileShopAllWidgetsMetafieldPayload(WidgetCustomization, WidgetCustomizationStyle, targetShop.id);
    return await syncWidgetLayoutMetafield(graphqlClient, payload);
  } catch (err) {
    console.warn('[Snapmint] Metafield sync error:', err.message);
    return false;
  }
};

const fetchSnapmintMerchantPlans = async (merchantToken) => {
  if (!SNAPMINT_API_URL) return null;

  try {
    const { data } = await axios.get(SNAPMINT_API_URL, {
      headers: {
        Authorization: `Bearer ${merchantToken}`,
        merchant_key: merchantToken,
        merchant_token: merchantToken,
        'Content-Type': 'application/json',
      },
      params: {
        merchant_token: merchantToken,
      },
      timeout: 10000,
    });
    return data;
  } catch (err) {
    console.warn('[Snapmint API] fetchSnapmintMerchantPlans error:', err?.message);
    return null;
  }
};

const syncSnapmintMetafield = async (graphqlClient, merchantToken, isWidgetEnabled = true) => {
  const plansData = await fetchSnapmintMerchantPlans(merchantToken);
  const payload = typeof plansData === 'object' && plansData !== null
    ? { ...plansData, enabled: isWidgetEnabled }
    : { data: plansData, enabled: isWidgetEnabled };

  if (graphqlClient) {
    await setShopMetafield(graphqlClient, MERCHANT_PLANS_KEY, payload);
  }

  return payload;
};

const syncAutoSetupMetafieldAsync = async (shop, AutoSetupModel) => {
  try {
    const resolved = await resolveShopAndClient(shop);
    if (!resolved) return false;
    const { targetShop, graphqlClient } = resolved;

    const autoSetupRecord = await AutoSetupModel.findOne({
      where: { shopId: targetShop.id },
      order: [['updatedAt', 'DESC']],
    });

    const cleanAutoSetup = cleanObject(autoSetupRecord);
    return await setShopMetafield(graphqlClient, AUTO_SETUP_KEY, cleanAutoSetup);
  } catch (err) {
    console.error('[Snapmint] AutoSetup Metafield sync error:', err.message);
    return false;
  }
};


const syncStoreColorsMetafieldsAsync = async (shop, colorConfig = {}) => {
  try {
    const resolved = await resolveShopAndClient(shop);
    if (!resolved) return false;
    const { graphqlClient } = resolved;

    const innerColors = colorConfig.innerLayoutColors || colorConfig.inner_layout_colors || {};
    const masterColors = colorConfig.masterPopupColors || colorConfig.master_popup_colors || {};

    await Promise.all([
      setShopMetafield(graphqlClient, INNER_COLORS_KEY, innerColors),
      setShopMetafield(graphqlClient, MASTER_COLORS_KEY, masterColors),
    ]);

    return true;
  } catch (err) {
    console.error('[Snapmint] Store Colors Metafield sync error:', err.message);
    return false;
  }
};

const syncCashbackOfferMetafieldAsync = async (shop, CashbackOfferModel) => {
  try {
    const resolved = await resolveShopAndClient(shop);
    if (!resolved) return false;
    const { targetShop, graphqlClient } = resolved;

    const offers = await CashbackOfferModel.findAll({
      where: { shopId: targetShop.id, status: 'ACTIVE' },
      order: [['createdAt', 'DESC']],
    });

    const cleanOffers = offers.map((o) => {
      const raw = o.toJSON ? o.toJSON() : { ...o };
      delete raw.shopId;

      if (raw.termsAndConditions) {
        raw.termsAndConditions = cleanTermsAndConditions(raw.termsAndConditions);
      }

      return raw;
    });

    return await setShopMetafield(graphqlClient, CASHBACK_OFFER_KEY, { offers: cleanOffers });
  } catch (err) {
    console.error('[Snapmint] CashbackOffer Metafield sync error:', err.message);
    return false;
  }
};

module.exports = {
  SNAPMINT_METAFIELD_NAMESPACE,
  WIDGET_LAYOUT_KEY,
  AUTO_SETUP_KEY,
  MERCHANT_PLANS_KEY,
  INNER_COLORS_KEY,
  MASTER_COLORS_KEY,
  CASHBACK_OFFER_KEY,
  cleanObject,
  createMetafield,
  formatWidgetLayoutMetafield,
  formatAutoSetupPayload,
  compileShopAllWidgetsMetafieldPayload,
  syncMetafieldAsync,
  syncAutoSetupMetafieldAsync,
  syncStoreColorsMetafieldsAsync,
  syncCashbackOfferMetafieldAsync,
  fetchSnapmintMerchantPlans,
  syncWidgetLayoutMetafield,
  syncSnapmintMetafield,
  setShopMetafield,
};

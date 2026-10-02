const { SET_METAFIELD_MUTATION, SHOP_QUERY } = require('../modules/shop/graphqlQuery');
const Shop = require('../modules/shop/model');
const { getGraphQLClient } = require('./common');

const SNAPMINT_METAFIELD_NAMESPACE = 'snapmint_emi';
const WIDGET_METAFIELD_KEY = 'widget';

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
  if (!graphqlClient || data == null) return false;

  try {
    const ownerId = await getShopGqlId(graphqlClient);
    if (!ownerId) return false;

    const payloadValue = typeof data === 'string' ? data : JSON.stringify(data, null, 2);

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

    const userErrors = res?.data?.metafieldsSet?.userErrors || res?.body?.data?.metafieldsSet?.userErrors || [];
    if (userErrors.length > 0) {
      console.warn(`[Snapmint] Metafield userErrors for "${key}":`, userErrors);
    }
    return userErrors.length === 0;
  } catch (err) {
    console.error(`[Snapmint] setShopMetafield error for "${key}":`, err.message);
    return false;
  }
};

const syncWidgetMetafield = async (shop, widgetData = {}) => {
  try {
    const resolved = await resolveShopAndClient(shop);
    if (!resolved) return false;
    const { graphqlClient } = resolved;

    const raw = widgetData.toJSON ? widgetData.toJSON() : widgetData;
    const payload = {
      plans: raw.plans || [],
      priceBands: raw.priceBands || {},
      configure: raw.configure || {},
      customization: raw.customization || {},
      targeting: raw.targeting || {},
      isActive: raw.isActive !== undefined ? raw.isActive : true,
    };

    return await setShopMetafield(graphqlClient, WIDGET_METAFIELD_KEY, payload);
  } catch (err) {
    console.warn('[Snapmint] Widget metafield sync error:', err.message);
    return false;
  }
};

// Store merchant plans metafield (widget enablement state)
const syncSnapmintMetafield = async (graphqlClient, merchantToken, isWidgetEnabled = true) => {
  const payload = { enabled: isWidgetEnabled, merchantToken: merchantToken || null };
  if (graphqlClient) {
    await setShopMetafield(graphqlClient, 'merchant_plans', payload);
  }
  return payload;
};

// Cashback offer metafield sync
const syncCashbackOfferMetafieldAsync = async (shop, CashbackOfferModel) => {
  try {
    const resolved = await resolveShopAndClient(shop);
    if (!resolved) return false;
    const { targetShop, graphqlClient } = resolved;
    const offers = await CashbackOfferModel.findAll({
      where: { shopId: targetShop.id, status: 'ACTIVE' },
      order: [['createdAt', 'DESC']],
    });
    return await setShopMetafield(graphqlClient, 'cashback_offer', { offers });
  } catch (err) {
    console.error('[Snapmint] CashbackOffer sync error:', err.message);
    return false;
  }
};

module.exports = {
  SNAPMINT_METAFIELD_NAMESPACE,
  WIDGET_METAFIELD_KEY,
  syncWidgetMetafield,
  setShopMetafield,
  syncSnapmintMetafield,
  syncCashbackOfferMetafieldAsync,
};


const MerchantCredential = require('./model');
const Shop = require('../shop/model');
const { sanitizeString, logActivity } = require('../../utils/helper');
const {
  SEQUELIZE_OP,
  ONBOARD_STATUS,
  WIDGET_STATUS,
  APP_STATUS,
  APP_INSTALL,
} = require('../../config/constants');
const { getGraphQLClient } = require('../../utils/common');
const { syncSnapmintMetafield } = require('../../utils/snapmint');

const findShopByDomainOrHandle = async (shopStr) => {
  if (!shopStr) return null;
  const cleanShop = sanitizeString(shopStr);
  const handle = cleanShop.split('.')[0];

  return await Shop.findOne({
    where: {
      [SEQUELIZE_OP.or]: [
        { myshopifyDomain: { [SEQUELIZE_OP.iLike]: `%${handle}%` } },
        { myshopifyDomain: cleanShop },
      ],
    },
  });
};

const addMerchantCredential = async (req, res) => {
  try {
    const { shop, merchantId, mid, token, name, brandingMode } = req.body;
    const targetMerchantId = merchantId || mid;

    if (!shop || !targetMerchantId) {
      return res.status(400).json({
        success: false,
        message: 'Shop and Merchant ID are required.',
      });
    }

    const cleanShop = sanitizeString(shop);
    const cleanMerchantId = String(targetMerchantId).trim();
    const cleanToken = token ? String(token).trim() : null;

    const shopRow = await findShopByDomainOrHandle(cleanShop);
    const currentInstallStatus = shopRow && String(shopRow.appInstall) === APP_INSTALL.INSTALLED ? APP_INSTALL.INSTALLED : APP_INSTALL.UNINSTALLED;

    const existing = await MerchantCredential.findOne({ where: { shop: cleanShop } });
    const isUpdate = Boolean(req.body.id || req.method === 'PUT');

    if (existing && (!isUpdate || String(existing.id) !== String(req.body.id))) {
      return res.status(409).json({
        success: false,
        message: 'This Shopify store URL is already registered. Please enter a unique URL.',
      });
    }

    let merchant;
    let created = false;

    if (existing && isUpdate) {
      merchant = existing;
      await merchant.update({
        merchantId: cleanMerchantId,
        ...(cleanToken !== undefined && { token: cleanToken }),
        name: name ? String(name).trim() : merchant.name,
        brandingMode: brandingMode || 'snapmint',
        appInstall: currentInstallStatus,
        ...(req.user?.id && { createdBy: req.user.id }),
      });
    } else {
      merchant = await MerchantCredential.create({
        shop: cleanShop,
        merchantId: cleanMerchantId,
        token: cleanToken,
        name: name ? String(name).trim() : null,
        brandingMode: brandingMode || 'snapmint',
        appInstall: currentInstallStatus,
        createdBy: req.user?.id || null,
      });
      created = true;
    }

    if (shopRow) {
      await shopRow.update({
        merchantId: cleanMerchantId,
        ...(cleanToken && { merchantToken: cleanToken }),
        onboardStatus: ONBOARD_STATUS.APPROVED,
        widgetStatus: WIDGET_STATUS.ENABLED,
        appStatus: APP_STATUS.ENABLED,
      });

      if (shopRow.token && cleanToken) {
        getGraphQLClient({ shopDomain: shopRow.myshopifyDomain, accessToken: shopRow.token })
          .then(({ graphqlClient }) => syncSnapmintMetafield(graphqlClient, cleanToken, true))
          .catch((err) => console.warn('[AddMerchantCredential] Metafield sync failed:', err.message));
      }
    }

    logActivity('MERCHANT_CREDENTIAL_SAVED', {
      req,
      shop: shopRow || { myshopifyDomain: cleanShop },
      isCreated: created,
    });

    return res.status(created ? 201 : 200).json({
      success: true,
      message: created
        ? 'Merchant credential created successfully.'
        : 'Merchant credential updated successfully.',
      merchant,
    });
  } catch (error) {
    console.error('[AddMerchantCredential] Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to save merchant credential.',
    });
  }
};

const getMerchantCredentials = async (req, res) => {
  try {
    const [merchants, shops] = await Promise.all([
      MerchantCredential.findAll({ order: [['id', 'DESC']] }),
      Shop.findAll({ raw: true, attributes: ['myshopifyDomain', 'appInstall'] }),
    ]);

    const shopsMap = new Map();
    shops.forEach((s) => {
      const fullDomain = s.myshopifyDomain ? s.myshopifyDomain.toLowerCase() : '';
      const handle = fullDomain ? fullDomain.split('.')[0] : '';

      if (fullDomain) shopsMap.set(fullDomain, s);
      if (handle) shopsMap.set(handle, s);
    });

    const formattedMerchants = merchants.map((m) => {
      const merchantObj = m.toJSON();
      const cleanShop = sanitizeString(merchantObj.shop);
      const handle = cleanShop ? cleanShop.split('.')[0] : '';

      const matchingShop = shopsMap.get(cleanShop) || shopsMap.get(handle);
      const liveInstallStatus = matchingShop && String(matchingShop.appInstall) === APP_INSTALL.INSTALLED ? APP_INSTALL.INSTALLED : APP_INSTALL.UNINSTALLED;

      merchantObj.appInstall = liveInstallStatus;

      if (m.appInstall !== liveInstallStatus) {
        m.update({ appInstall: liveInstallStatus }).catch(() => { });
      }

      return merchantObj;
    });

    return res.status(200).json({
      success: true,
      merchants: formattedMerchants,
    });
  } catch (error) {
    console.error('[GetMerchantCredentials] Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch merchant credentials.',
    });
  }
};

const deleteMerchantCredential = async (req, res) => {
  try {
    const { id, shop } = req.body || {};
    if (!id && !shop) return res.status(400).json({ success: false, message: 'Merchant ID or shop domain is required.' });

    const merchant = await MerchantCredential.findOne({ where: id ? { id } : { shop: sanitizeString(shop) } });
    if (!merchant) return res.status(404).json({ success: false, message: 'Merchant credential not found.' });

    const cleanShop = sanitizeString(merchant.shop);
    const handle = cleanShop.split('.')[0];
    await merchant.destroy();

    // 1. Reset shop status in database dynamically
    const shopRow = await findShopByDomainOrHandle(cleanShop);
    if (shopRow) {
      await shopRow.update({
        merchantId: null,
        merchantToken: null,
        onboardStatus: ONBOARD_STATUS.PENDING,
        widgetStatus: WIDGET_STATUS.DISABLED,
        appStatus: APP_STATUS.DISABLED,
      });

      // 2. Disable Shopify Metafield
      if (shopRow.token) {
        getGraphQLClient({ shopDomain: shopRow.myshopifyDomain, accessToken: shopRow.token })
          .then(({ graphqlClient }) => syncSnapmintMetafield(graphqlClient, null, false))
          .catch(() => { });
      }
    }

    logActivity('MERCHANT_CREDENTIAL_DELETED', {
      req,
      shop: shopRow || { myshopifyDomain: cleanShop },
    });

    return res.status(200).json({ success: true, message: 'Merchant credential deleted successfully.' });
  } catch (error) {
    console.error('[DeleteMerchantCredential] Error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to delete merchant credential.' });
  }
};

module.exports = {
  addMerchantCredential,
  getMerchantCredentials,
  deleteMerchantCredential,
};

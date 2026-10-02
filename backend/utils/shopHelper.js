const Shop = require('../modules/shop/model');
const { SEQUELIZE_OP } = require('../config/constants');

const findShopRecord = async (shopId, shopDomain) => {
  // 1. Try by Shop primary key (only if it looks like a valid integer)
  if (shopId && /^\d+$/.test(String(shopId))) {
    const shop = await Shop.findByPk(shopId);
    if (shop) return shop;
  }

  // 2. Try by domain with flexible matching
  if (shopDomain) {
    const clean = String(shopDomain).trim().toLowerCase();
    const handle = clean.replace(/\.myshopify\.com$/, '');
    const full = handle.includes('.') ? handle : `${handle}.myshopify.com`;

    const shop = await Shop.findOne({
      where: {
        [SEQUELIZE_OP.or]: [
          { myshopifyDomain: clean },
          { myshopifyDomain: handle },
          { myshopifyDomain: full },
        ],
      },
    });
    if (shop) return shop;
  }

  return null;
};

module.exports = { findShopRecord };

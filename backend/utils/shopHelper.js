const Shop = require('../modules/shop/model');

const findShopRecord = async (shopId, shopDomain) => {
  if (shopId) {
    return Shop.findByPk(shopId);
  }

  if (shopDomain) {
    return Shop.findOne({
      where: { myshopifyDomain: shopDomain },
    });
  }

  return null;
};

module.exports = {
  findShopRecord,
};

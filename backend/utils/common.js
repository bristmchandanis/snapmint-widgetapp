const shopify = require('../config/shopify');
const Shop = require('../modules/shop/model');

/**
 * Creates a Shopify Admin GraphQL client for the given shop.
 *
 * @param {Object} options
 * @param {string} options.shopDomain - The myshopify domain.
 * @param {string} [options.accessToken] - Access token (falls back to DB token).
 * @param {boolean} [options.onlyShopData=false] - If true, skip GraphQL client creation.
 * @returns {{ graphqlClient: Object|null, shopData: Object|null }}
 */
const getGraphQLClient = async ({ shopDomain, accessToken, onlyShopData = false }) => {
  if (!shopDomain) {
    throw new Error('shopDomain is required to create a GraphQL client.');
  }

  let shopData = null;
  let finalAccessToken = accessToken;

  if (!finalAccessToken || onlyShopData) {
    shopData = await Shop.findOne({ where: { myshopifyDomain: shopDomain } });
    finalAccessToken = finalAccessToken || shopData?.token;
  }

  if (!onlyShopData && !finalAccessToken) {
    throw new Error(`No access token available for shop "${shopDomain}".`);
  }

  const graphqlClient = !onlyShopData
    ? new shopify.clients.Graphql({ session: { shop: shopDomain, accessToken: finalAccessToken } })
    : null;

  return { graphqlClient, shopData };
};

module.exports = { getGraphQLClient };

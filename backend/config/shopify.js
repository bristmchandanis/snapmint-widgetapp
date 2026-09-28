const { shopifyApi, ApiVersion, LogSeverity } = require('@shopify/shopify-api');
const { shopifyApiAdapter } = require('@shopify/shopify-api/adapters/node');
const { SHOPIFY_API_KEY, SHOPIFY_API_SECRET_KEY, SCOPES, SHOPIFY_APP_URI } = require('./constants');

const shopify = shopifyApi({
  apiKey: SHOPIFY_API_KEY,
  apiSecretKey: SHOPIFY_API_SECRET_KEY,
  scopes: SCOPES ? (Array.isArray(SCOPES) ? SCOPES : SCOPES.split(',')) : ['read_products', 'write_products'],
  hostName: SHOPIFY_APP_URI ? SHOPIFY_APP_URI.replace(/^https?:\/\//, '') : 'localhost:5000',
  apiVersion: ApiVersion.April26 || '2024-04',
  adapter: shopifyApiAdapter,
  isEmbeddedApp: true,
  logger: {
    level: LogSeverity.Error,
  },
});

module.exports = shopify;

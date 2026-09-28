const { session } = require('../config/shopify');
const { errorResponse } = require('../utils/helper');
const { findShopRecord } = require('../utils/shopHelper');

const sessionVerifier = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return errorResponse(res, 401, 'Authorization header is required.');
  }

  const match = authHeader.match(/^Bearer\s+(.+)$/);
  if (!match || !match[1].trim()) {
    return errorResponse(res, 401, 'Invalid authorization token format.');
  }

  const token = match[1].trim();
  try {
    const tokenPayload = await session.decodeSessionToken(token);

    if (!tokenPayload?.dest) {
      return errorResponse(res, 401, 'Invalid session token payload.');
    }

    req.sessionToken = token;
    req.shopDomain = tokenPayload.dest.replace(/^https?:\/\//, '');

    req.shop = await findShopRecord(null, req.shopDomain);
    req.shopId = req.shop?.id;
    next();
  } catch (error) {
    if (error.message.includes('expired') || error.message.includes('exp') || error.message.includes('timestamp')) {
      return errorResponse(res, 401, 'Session expired. Please reload the app.');
    }

    if (error.message.includes('JWT') || error.message.includes('signature')) {
      return errorResponse(res, 401, 'Invalid session token. Please reload the app.');
    }

    console.error('[SessionVerifier] Unexpected error:', error.message);
    return errorResponse(res, 401, 'Session verification failed. Please try again.');
  }
};

module.exports = sessionVerifier;

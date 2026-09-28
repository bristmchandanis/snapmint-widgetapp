const ActivityLog = require('../modules/activityLog/model');
const ACTIVITY_ACTIONS = require('../config/activityActions');

const successResponse = (res, statusCode, message, data = {}) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

const errorResponse = (res, statusCode, message, error = null) => {
  const payload = {
    success: false,
    message,
  };

  if (error && process.env.NODE_ENV !== 'production') {
    payload.error = error.message || error;
  }

  return res.status(statusCode).json(payload);
};

const parsePermissions = (user, fallbackPermissions = null) => {
  if (typeof user.permissions === 'string') {
    try {
      return JSON.parse(user.permissions);
    } catch {
      return fallbackPermissions || {};
    }
  }
  return user.permissions || fallbackPermissions || {};
};

const sanitizeString = (value) => {
  if (!value) return '';
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//i, '');
};

const logActivity = async (actionKey, payload = {}) => {
  try {
    const { req, metadata, source: customSource } = payload;
    const user = payload.user || req?.user;
    const shopDomain = payload.shopDomain || payload.shop?.myshopifyDomain || null;

    const actionConfig = ACTIVITY_ACTIONS[actionKey]?.(payload) || {};
    const module = actionConfig.module || payload.module || 'STORES';
    const description = actionConfig.description || payload.description || '';

    const source = customSource || (req?.shop ? 'SHOPIFY_APP' : 'DASHBOARD');

    await ActivityLog.create({
      userId: user?.id || null,
      userName: user?.name || (source === 'SHOPIFY_APP' ? 'Shopify App' : 'Dashboard'),
      userEmail: user?.email || null,
      userRole: user?.role || (source === 'SHOPIFY_APP' ? 'SHOPIFY' : 'DASHBOARD'),
      shopDomain,
      action: actionKey,
      module,
      description,
      metadata: metadata || null,
      source,
    });
  } catch (err) {
    console.error('[ActivityLogger] Error logging action:', actionKey, err.message);
  }
};

const cleanTermsAndConditions = (terms) => {
  if (!terms) return terms;
  let textStr = Array.isArray(terms) ? terms.join('') : String(terms);
  textStr = textStr.replace(/&nbsp;|\u00a0/g, ' ');
  const matches = textStr.match(/<li[^>]*>([\s\S]*?)<\/li>/gi);
  if (matches && matches.length > 0) {
    return matches.map((item) => item.replace(/<[^>]*>/g, '').trim()).filter(Boolean);
  }
  return textStr.replace(/<[^>]*>/g, '').trim();
};

module.exports = {
  successResponse,
  errorResponse,
  parsePermissions,
  sanitizeString,
  logActivity,
  cleanTermsAndConditions,
};


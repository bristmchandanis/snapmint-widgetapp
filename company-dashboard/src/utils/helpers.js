import React from 'react';
import dayjs from 'dayjs';

export const formatDate = (dateVal) => {
  if (!dateVal) return 'N/A';
  const d = dayjs(dateVal);
  if (!d.isValid()) return String(dateVal);
  return d.format('MMM D, YYYY');
};

export const formatCurrency = (val) => {
  const num = Number(val);
  if (isNaN(num)) return '₹0';
  return `₹${num.toLocaleString('en-IN')}`;
};

export const isShopApproved = (onboardStatus) => {
  const status = String(onboardStatus || '').toUpperCase();
  return status === 'APPROVED' || status === 'ACTIVE' || String(onboardStatus) === '1';
};

export const getOnboardStatusValue = (status) => {
  if (isShopApproved(status)) return 'APPROVED';
  return String(status || '').toUpperCase() === 'REJECTED' ? 'REJECTED' : 'PENDING';
};

export const getOnboardStatusStyle = (statusVal) => {
  if (statusVal === 'APPROVED') return 'bg-emerald-50 text-emerald-700 border-0';
  if (statusVal === 'REJECTED') return 'bg-rose-50 text-rose-700 border-0';
  return 'bg-amber-50 text-amber-800 border-0';
};

export const getWidgetStatusValue = (widgetStatus, onboardStatusVal) => {
  const status = String(widgetStatus || '').toUpperCase();
  if (status === 'ON' || status === '1' || status === 'ENABLED') return 'Enabled';
  if (status === 'OFF' || status === '0' || status === 'DISABLED') return 'Disabled';
  if (onboardStatusVal === 'PENDING') return 'Disabled';
  return 'Disabled';
};

export const normalizeShopData = (shop = {}) => {
  const onboardVal = getOnboardStatusValue(shop.onboardStatus || shop.onboard_status);
  return {
    ...shop,
    name: shop.name || 'Shopify Store',
    shopOwner: shop.shopOwner || 'N/A',
    email: shop.email || 'N/A',
    planName: shop.planDisplayName || shop.planName || 'Free Plan',
    createdDate: formatDate(shop.createdAt || shop.created_at || shop.createdDate),
    isInstalled: String(shop.appInstall) === '1',
    onboardStatusVal: onboardVal,
    onboardStatusStyle: getOnboardStatusStyle(onboardVal),
    widgetStatusVal: getWidgetStatusValue(shop.widgetStatus || shop.widget_status, onboardVal, shop.appInstall),
    allowCustomization: shop.allowCustomization === '1',
    hasWebPixel: shop.hasWebPixel === '1',
  };
};

export const calculateShopMetrics = (shops = []) => {
  let installed = 0;
  let enabled = 0;
  let approved = 0;

  for (let index = 0; index < shops.length; index++) {
    const shop = shops[index];
    if (String(shop.appInstall) === '1') installed++;
    if (String(shop.appStatus) === '1') enabled++;
    if (isShopApproved(shop.onboardStatus)) approved++;
  }

  return { total: shops.length, installed, enabled, approved };
};

export const filterShops = (shops = [], search = '', onboardFilter = 'ALL') => {
  const query = search.toLowerCase().trim();
  if (!query && onboardFilter === 'ALL') return shops;

  return shops.filter((shop) => {
    const statusUpper = String(shop.onboardStatus || '').toUpperCase();
    const approved = isShopApproved(shop.onboardStatus);
    const isRejected = statusUpper === 'REJECTED';
    const isPending = !approved && !isRejected;

    const matchesOnboard =
      onboardFilter === 'ALL' ||
      (onboardFilter === 'APPROVED' && approved) ||
      (onboardFilter === 'REJECTED' && isRejected) ||
      (onboardFilter === 'PENDING' && isPending);

    if (!matchesOnboard) return false;
    if (!query) return true;

    return (
      (shop.name && shop.name.toLowerCase().includes(query)) ||
      (shop.myshopifyDomain && shop.myshopifyDomain.toLowerCase().includes(query)) ||
      (shop.shopOwner && shop.shopOwner.toLowerCase().includes(query)) ||
      (shop.email && shop.email.toLowerCase().includes(query)) ||
      (shop.planDisplayName && shop.planDisplayName.toLowerCase().includes(query)) ||
      (shop.planName && shop.planName.toLowerCase().includes(query))
    );
  });
};

export const calculateEMISchedule = (sampleAmount) => {
  const totalAmount = Number(sampleAmount) || 0;
  const downPayment = Math.round(totalAmount / 3);
  const emi1 = Math.round(totalAmount / 3);
  const emi2 = totalAmount - downPayment - emi1;
  return { totalAmount, downPayment, emi1, emi2 };
};

export const formatButtonText = (buttonText, downPayment) => {
  const safeText = typeof buttonText === 'string' ? buttonText : '';
  const amountVal = Number(downPayment) || 0;
  return safeText.includes('{amount}')
    ? safeText.replace('{amount}', amountVal > 0 ? amountVal.toLocaleString() : '')
    : safeText;
};

export const renderFeatureText = (text) => {
  if (!text) return null;
  if (text.includes('<br')) {
    const parts = text.split(/<br\s*\/?>/i);
    return parts.map((part, idx) => (
      React.createElement(React.Fragment, { key: idx },
        idx > 0 && React.createElement('br'),
        part
      )
    ));
  }
  const words = text.trim().split(/\s+/);
  if (words.length >= 2 && words.length <= 4) {
    const mid = Math.ceil(words.length / 2);
    const line1 = words.slice(0, mid).join(' ');
    const line2 = words.slice(mid).join(' ');
    return React.createElement(React.Fragment, null, line1, React.createElement('br'), line2);
  }
  return text;
};

export const renderFormattedText = (text) => {
  if (!text) return null;
  if (typeof text === 'string' && (text.includes('<b>') || text.includes('<strong>'))) {
    return React.createElement('span', { dangerouslySetInnerHTML: { __html: text } });
  }
  return text;
};

export const renderFooterText = (text) => {
  if (!text) return null;
  if (typeof text === 'string') {
    if (text.includes('<b>') || text.includes('<strong>')) {
      return React.createElement('span', { dangerouslySetInnerHTML: { __html: text } });
    }
    const formatted = text.replace(/(Merchant Pay Later|payment screen|checkout)/g, '<b>$1</b>');
    if (formatted !== text) {
      return React.createElement('span', { dangerouslySetInnerHTML: { __html: formatted } });
    }
  }
  return text;
};

const parseHexToRgb = (colorStr) => {
  let hex = colorStr.replace('#', '').trim();
  if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  if (hex.length !== 6) return null;
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return (!isNaN(r) && !isNaN(g) && !isNaN(b)) ? { r, g, b } : null;
};

export const getSoftBgTint = (colorStr) => {
  if (!colorStr || colorStr === '#ffffff' || colorStr === 'transparent') return '#f3f4f6';
  if (colorStr.startsWith('rgba') || colorStr.startsWith('hsla')) return colorStr;
  const rgb = parseHexToRgb(colorStr);
  return rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.15)` : colorStr;
};

export const getGradientBg = (colorStr) => {
  if (!colorStr || colorStr === '#ffffff' || colorStr === 'transparent') {
    return 'linear-gradient(180deg, #f1f5f9 0%, #ffffff 100%)';
  }
  if (colorStr.includes('gradient')) return colorStr;
  const rgb = parseHexToRgb(colorStr);
  if (rgb) return `linear-gradient(180deg, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2) 0%, #ffffff 100%)`;
  return `linear-gradient(180deg, ${colorStr} 0%, #ffffff 100%)`;
};

export const getNextMonthNames = () => {
  const today = new Date();
  const dayNum = today.getDate();
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const v = dayNum % 100;
  const ordSuffix = (v >= 11 && v <= 13) ? 'th' : (suffixes[v % 10] || 'th');
  const dayOrdinal = `${dayNum}${ordSuffix}`;
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const nextMonth1 = monthNames[(today.getMonth() + 1) % 12];
  const nextMonth2 = monthNames[(today.getMonth() + 2) % 12];
  return { day: dayNum, dayOrdinal, nextMonth1, nextMonth2 };
};

export const isSuperAdminRole = (role) => {
  if (!role) return false;
  const normalized = String(role).trim().toUpperCase().replace(/[\s_]+/g, '_');
  return normalized === 'SUPERMASTER_ADMIN';
};

export const hasPermission = (user, moduleName, action = 'read') => {
  if (!user) return false;
  if (isSuperAdminRole(user.role)) return true;
  if (moduleName === 'stores' && action === 'read') return true;

  let perms = user.permissions || {};
  if (typeof perms === 'string') {
    try { perms = JSON.parse(perms); } catch { perms = {}; }
  }

  const modulePerms = perms?.[moduleName] || {};
  return Boolean(modulePerms[action]);
};

export const getModulePermissions = (user, moduleName) => ({
  canRead: hasPermission(user, moduleName, 'read'),
  canWrite: hasPermission(user, moduleName, 'write'),
  canEdit: hasPermission(user, moduleName, 'edit'),
});

export const DEFAULT_MERCHANT_PLANS = [
  { tenure: 3, dp_rate: 0.25, dp_type: "percentage", min_order_value: 199, max_order_value: 200000, emi_amount_rate: 0.25 },
  { tenure: 6, dp_rate: 0.25, dp_type: "percentage", min_order_value: 5000, max_order_value: 200000, emi_amount_rate: 0.125 },
  { tenure: 9, dp_rate: 0.25, dp_type: "percentage", min_order_value: 10000, max_order_value: 200000, emi_amount_rate: 0.0833 },
  { tenure: 3, dp_rate: 0, dp_type: "fixed", min_order_value: 199, max_order_value: 200000, emi_amount_rate: 0.3333 },
  { tenure: 6, dp_rate: 0, dp_type: "fixed", min_order_value: 5000, max_order_value: 200000, emi_amount_rate: 0.1667 },
  { tenure: 9, dp_rate: 0, dp_type: "fixed", min_order_value: 10000, max_order_value: 200000, emi_amount_rate: 0.1111 },
];

export const parseMerchantPlans = (shop) => {
  const raw = shop?.merchantPlan || shop?.merchant_plan || shop?.plans || (shop ? shop : DEFAULT_MERCHANT_PLANS);
  const list = Array.isArray(raw) ? raw : (raw?.plans || raw?.data || DEFAULT_MERCHANT_PLANS);
  const options = [];

  list.forEach((planItem, planIdx) => {
    const min = Number(planItem.min_order_value ?? planItem.minAmount ?? planItem.min);
    const max = Number(planItem.max_order_value ?? planItem.maxAmount ?? planItem.max);
    const tenure = planItem.tenure != null ? Number(planItem.tenure) : null;
    const dpPercent = Number(planItem.dp_rate ?? planItem.dpPercent) || 0;
    const rawDpType = String(planItem.dp_type || planItem.dpType || 'percentage').toLowerCase();
    const dpType = rawDpType.includes('fix') ? 'fixed' : 'percentage';
    const emiPercent = Number(planItem.emi_amount_rate ?? planItem.emiPercent) || 0;

    if (!isNaN(min) && !isNaN(max)) {
      const typeLabel = dpType === 'fixed' ? 'Fixed DP' : '% DP';
      const customLabel = planItem.label || planItem.plan_name || planItem.name || planItem.title || `₹${min.toLocaleString('en-IN')} – ₹${max.toLocaleString('en-IN')}${tenure ? ` (${tenure} Months Plan - ${typeLabel})` : ` (${typeLabel})`}`;

      options.push({
        id: planItem.id ?? planIdx,
        min,
        max,
        tenure,
        dpPercent,
        dpType,
        emiPercent,
        label: customLabel,
        rawPlan: planItem,
      });
    }
  });

  return options;
};

export const getRangeBandDisplayLabel = (config, merchantPresets = []) => {
  const min = config?.minAmount;
  const max = config?.maxAmount;

  if (min != null && max != null) {
    if (!config?.isCustomRange) {
      const matched = merchantPresets.find((item) => item.min === min && item.max === max && (config?.tenure == null || item.tenure === config.tenure) && (config?.dpType == null || item.dpType === config.dpType));
      if (matched) return matched.label;
      const rangeMatched = merchantPresets.find((item) => item.min === min && item.max === max);
      if (rangeMatched) return rangeMatched.label;
    }
    if (max > min && max > 0) {
      return `₹${Number(min).toLocaleString('en-IN')} – ₹${Number(max).toLocaleString('en-IN')}`;
    }
  }

  return 'Custom Range';
};

export const mapRolesToOptions = (rolesList = [], excludeRoleId = null) => {
  if (!Array.isArray(rolesList)) return [];
  return rolesList
    .filter((roleItem) => roleItem && roleItem.id !== excludeRoleId)
    .map((roleItem) => ({ value: roleItem.name, label: roleItem.name }));
};

// Cashback and offer related functions

export const isOfferExpired = (endDate) => {
  if (!endDate) return false;
  return dayjs(endDate).format('YYYY-MM-DD') < dayjs().format('YYYY-MM-DD');
};

export const getEffectiveOfferStatus = (endDate, currentStatus = 'ACTIVE') => {
  return isOfferExpired(endDate) ? 'EXPIRED' : currentStatus;
};

export const generateDefaultTerms = ({ startDate, endDate, cashbackCreditDays } = {}, existingTerms) => {
  const creditDays = cashbackCreditDays || 15;
  const startFmt = startDate ? formatDate(startDate) : '';
  const endFmt = endDate ? formatDate(endDate) : '';

  const validityText = startFmt && endFmt ? `from ${startFmt} to ${endFmt}`
    : startFmt ? `from ${startFmt}`
      : endFmt ? `till ${endFmt}`
        : 'during the campaign period';

  // In-place update of credit days & validity text if terms HTML already exists
  if (existingTerms && existingTerms.replace(/<[^>]*>/g, '').trim()) {
    const S = `(?:\\s|&nbsp;|\\u00a0)+`;
    return existingTerms
      .replace(new RegExp(`(within${S})\\d+`, 'gi'), `$1${creditDays}`)
      .replace(
        new RegExp(`(during${S}the${S}campaign${S}period|from${S}[^<]+?to${S}[^<]+?|from${S}[^<]+?|till${S}[^<]+?)(?=\\s*<|\\s*$)`, 'gi'),
        validityText
      );
  }

  // Initial default terms HTML generation
  const bullets = [
    'The offer is valid only for transactions made through the Snapmint payment option',
    'The offer is valid only for the first transactions of customers through the Snapmint payment option',
    `The cashback offer is valid ${validityText}`,
    `The cashback will be processed within ${creditDays} working days after the due date of the last EMI`,
    'Cashback is valid only when the customer pays their EMIs on time',
    'The offer would not be applicable in case of canceled refunded transactions. In case of a partial refund, the cashback will be applicable only on the remaining value',
    'The Offer can be availed only once per user during the campaign period',
  ];

  return `<ol>${bullets.map((b) => `<li>${b}</li>`).join('')}</ol>`;
};


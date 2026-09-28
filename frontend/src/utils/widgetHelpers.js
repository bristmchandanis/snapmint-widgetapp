export const formatRange = (min, max) => {
  const minNum = Number(min) || 0;
  const maxNum = Number(max) || 0;
  return `₹${minNum.toLocaleString('en-IN')} – ₹${maxNum.toLocaleString('en-IN')}`;
};

export const isMasterTwo = (templateId) => {
  return templateId === 'master_2' || templateId === '2';
};

export const getMerchantPlan = (shop) => {
  if (!shop) return [];
  let raw = shop.merchantPlan;
  if (typeof raw === 'string') {
    try {
      raw = JSON.parse(raw);
    } catch {
      raw = [];
    }
  }
  const list = Array.isArray(raw) ? raw : (raw?.plans || raw?.data || []);
  const options = [];

  list.forEach((plan, idx) => {
    const min = Number(plan.min_order_value ?? plan.minAmount ?? plan.min);
    const max = Number(plan.max_order_value ?? plan.maxAmount ?? plan.max);
    const tenure = plan.tenure != null ? Number(plan.tenure) : null;
    const dpPercent = Number(plan.dp_rate ?? plan.dpPercent ?? plan.dp_percent) || 0;
    const rawDpType = String(plan.dp_type || plan.dpType || 'percentage').toLowerCase();
    const dpType = rawDpType.includes('fix') ? 'fixed' : 'percentage';
    const emiPercent = Number(plan.emi_amount_rate ?? plan.emiPercent ?? plan.emi_percent) || 0;

    if (!isNaN(min) && !isNaN(max)) {
      const typeLabel = dpType === 'fixed' ? 'Fixed DP' : '% DP';
      const customLabel = plan.label || plan.plan_name || plan.name || plan.title || `₹${min.toLocaleString('en-IN')} – ₹${max.toLocaleString('en-IN')}${tenure ? ` (${tenure} Months Plan - ${typeLabel})` : ` (${typeLabel})`}`;

      options.push({
        id: plan.id ?? idx,
        min,
        max,
        tenure,
        dpPercent,
        dpType,
        emiPercent,
        label: customLabel,
        rawPlan: plan,
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
      const matched = merchantPresets.find((r) => r.min === min && r.max === max && (config?.tenure == null || r.tenure === config.tenure) && (config?.dpType == null || r.dpType === config.dpType));
      if (matched) return matched.label;
      const rangeMatched = merchantPresets.find((r) => r.min === min && r.max === max);
      if (rangeMatched) return rangeMatched.label;
    }
    if (max > min && max > 0) {
      return formatRange(min, max);
    }
  }

  return 'Custom Range';
};

export const TAB_CONFIGS = [
  {
    id: 'pdp',
    label: 'PDP (Product Detail)',
    field: 'displayPdp',
    code: 'PDP',
    placementField: 'pdpWidgetPlacement',
    fields: [
      { name: 'pdpProductId', label: 'Product ID Selector', placeholder: 'e.g. .product-single__id or data-product-id' },
      { name: 'pdpProductHandle', label: 'Product Handle Selector', placeholder: 'e.g. .product-single__handle' },
      { name: 'pdpProductName', label: 'Product Name Selector', placeholder: 'e.g. .product-single__title' },
      { name: 'pdpVariantId', label: 'Variant ID Selector', placeholder: "e.g. select[name='id']" },
      { name: 'pdpProductAvailable', label: 'Product Available Selector', placeholder: 'e.g. .product-form__submit' },
      { name: 'pdpProductUrl', label: 'Product URL Selector', placeholder: 'e.g. canonical link or URL path' },
      { name: 'pdpSalePrice', label: 'Product Sale Price Selector', placeholder: 'e.g. .price-item--sale or .product__price' },
      { name: 'pdpWidgetAppendTarget', label: 'Widget Append Target', placeholder: 'e.g. .product-form__buttons' },
    ],
  },
  {
    id: 'collection',
    label: 'Collection',
    field: 'displayCollection',
    code: 'COLLECTION',
    placementField: 'collectionWidgetPlacement',
    fields: [
      { name: 'collectionGridItem', label: 'Grid Item Class', placeholder: 'e.g. .product-card or .grid__item' },
      { name: 'collectionSalePrice', label: 'Sale Price Selector', placeholder: 'e.g. .price-item--sale' },
      { name: 'collectionProductId', label: 'Product ID Selector', placeholder: 'e.g. data-product-id' },
      { name: 'collectionProductHandle', label: 'Product Handle Selector', placeholder: 'e.g. data-product-handle' },
      { name: 'collectionProductName', label: 'Product Name Selector', placeholder: 'e.g. .card__heading' },
      { name: 'collectionVariantId', label: 'Variant ID Selector', placeholder: 'e.g. data-variant-id' },
      { name: 'collectionProductAvailable', label: 'Product Available Selector', placeholder: 'e.g. .badge--sold-out' },
      { name: 'collectionProductUrl', label: 'Product URL Selector', placeholder: 'e.g. a.card-wrapper' },
      { name: 'collectionWidgetAppendTarget', label: 'Widget Append Target', placeholder: 'e.g. .card__information' },
    ],
  },
  {
    id: 'cart',
    label: 'Cart Page',
    field: 'displayCart',
    code: 'CART',
    placementField: 'cartWidgetPlacement',
    fields: [
      { name: 'cartItem', label: 'Cart Item Class', placeholder: 'e.g. .cart__item or .cart-item' },
      { name: 'cartTotal', label: 'Cart Total Selector', placeholder: 'e.g. .cart__subtotal or .cart-total' },
      { name: 'cartWidgetAppendTarget', label: 'Widget Append Target', placeholder: 'e.g. .cart__footer or .cart-checkout' },
    ],
  },
  {
    id: 'minicart',
    label: 'Mini Cart',
    field: 'displayMiniCart',
    code: 'MINICART',
    placementField: 'minCartWidgetPlacement',
    fields: [
      { name: 'minCartItem', label: 'Mini Cart Item Class', placeholder: 'e.g. .mini-cart__item' },
      { name: 'minCartTotal', label: 'Mini Cart Total Selector', placeholder: 'e.g. .mini-cart__total' },
      { name: 'minCartWidgetAppendTarget', label: 'Widget Append Target', placeholder: 'e.g. .mini-cart__footer' },
    ],
  },
  {
    id: 'cartdrawer',
    label: 'Cart Drawer',
    field: 'displayCartDrawer',
    code: 'CARTDRAWER',
    placementField: 'cartDrawerWidgetPlacement',
    fields: [
      { name: 'cartDrawerItem', label: 'Cart Drawer Item Class', placeholder: 'e.g. #CartDrawer .cart-item' },
      { name: 'cartDrawerTotal', label: 'Cart Drawer Total Selector', placeholder: 'e.g. .cart-drawer__footer .totals__total-value' },
      { name: 'cartDrawerWidgetAppendTarget', label: 'Widget Append Target', placeholder: 'e.g. .cart-drawer__footer .totals' },
    ],
  },
];

export const AUTO_SETUP_FIELDS = [
  'pdpProductId', 'pdpProductHandle', 'pdpProductName', 'pdpVariantId', 'pdpProductAvailable', 'pdpProductUrl', 'pdpSalePrice', 'pdpWidgetAppendTarget', 'pdpWidgetPlacement', 'pdpPriceSelector',
  'collectionGridItem', 'collectionSalePrice', 'collectionProductId', 'collectionProductHandle', 'collectionProductName', 'collectionVariantId', 'collectionProductAvailable', 'collectionProductUrl', 'collectionWidgetAppendTarget', 'collectionWidgetPlacement',
  'cartItem', 'cartTotal', 'cartWidgetAppendTarget', 'cartWidgetPlacement',
  'cartDrawerItem', 'cartDrawerTotal', 'cartDrawerWidgetAppendTarget', 'cartDrawerWidgetPlacement',
  'minCartItem', 'minCartTotal', 'minCartWidgetAppendTarget', 'minCartWidgetPlacement',
];

export const DEFAULT_STYLE = {
  titleText: 'Pay Later',
  logoUrl: '',
  buttonText: 'Pay only ₹{amount} Now',
  step1Text: 'Pay Now',
  feature1Text: '0% Interest Installments',
  feature2Text: '0 Extra Cost',
  feature3Text: 'UPI & Cards accepted',
  titleColor: '#111827',
  buttonBgColor: '#000000',
  buttonTextColor: '#111827',
  badgeColor: '#4b5563',
  featureTextColor: '#6b7280',
  backgroundColor: '#ffffff',
  borderColor: '#e5e7eb',
  footerBgColor: '#f9fafb',
  footerTextColor: '#374151',
};

export const getTemplateStyleDefaults = (templateId = 'master_1', styleObj = {}) => {
  const isMaster2 = isMasterTwo(templateId);
  return {
    ...DEFAULT_STYLE,
    ...styleObj,
    badgeText: isMaster2 ? (styleObj.badgeText ?? '& pay the rest in No Cost EMIs') : '',
    footerText: styleObj.footerText ?? (isMaster2 ? 'Select Merchant Pay Later during checkout' : 'Select Merchant Pay Later on the payment screen'),
    step1Text: isMaster2 ? '' : (styleObj.step1Text ?? DEFAULT_STYLE.step1Text),
  };
};

export const buildConfigFromStyle = (templateId = 'master_1', styleObj = {}, extra = {}) => {
  const combined = { ...styleObj, ...extra };
  const explicitPlacements = TAB_CONFIGS.filter((tab) => combined[tab.field]).map((tab) => tab.code);
  const activePlacements = explicitPlacements.length > 0
    ? explicitPlacements
    : (Array.isArray(combined.placements) && combined.placements.length > 0 ? combined.placements : ['PDP']);

  const displayFlags = Object.fromEntries(TAB_CONFIGS.map((tab) => [tab.field, activePlacements.includes(tab.code)]));
  const customizationId = combined.customizationId ?? combined.id;
  const selectors = {};
  AUTO_SETUP_FIELDS.forEach((key) => {
    selectors[key] = combined[key] || '';
  });

  const plan = getMerchantPlan(combined)[0];

  return {
    ...combined,
    ...selectors,
    ...displayFlags,
    ...getTemplateStyleDefaults(templateId, combined),
    customizationId,
    id: customizationId,
    masterTemplateLayout: templateId,
    placement: combined.placement || activePlacements[0] || 'PDP',
    placements: activePlacements,
    minAmount: combined.minAmount != null ? Number(combined.minAmount) : (plan?.min ?? 199),
    maxAmount: combined.maxAmount != null ? Number(combined.maxAmount) : (plan?.max ?? 200000),
    tenure: combined.tenure ?? plan?.tenure ?? null,
    dpPercent: combined.dpPercent ?? plan?.dpPercent ?? null,
    dpType: combined.dpType ?? plan?.dpType ?? null,
    emiPercent: combined.emiPercent ?? plan?.emiPercent ?? null,
    isCustomRange: Boolean(combined.isCustomRange ?? false),
  };
};

export const parseCustomizationResponse = (resData, id) => {
  const raw = resData?.customization || resData || {};
  const metafieldVal = raw.metafield?.value || {};
  const fetched = { ...raw, ...metafieldVal };
  const fetchedStyle = resData?.style || metafieldVal || raw || {};
  const templateId = fetched.masterTemplateLayout || raw.masterTemplateLayout || 'master_1';

  let parsedPlacements = fetched.placements || raw.placements || metafieldVal.placements;
  if (typeof parsedPlacements === 'string') {
    try { parsedPlacements = JSON.parse(parsedPlacements); } catch { }
  }

  const builtConfig = buildConfigFromStyle(templateId, fetchedStyle, {
    customizationId: raw.id || id,
    id: raw.id || id,
    allowCustomization: fetched.allowCustomization ?? raw.allowCustomization,
    placement: fetched.placement || raw.placement,
    placements: Array.isArray(parsedPlacements) ? parsedPlacements : undefined,
    minAmount: fetched.minAmount ?? raw.minAmount,
    maxAmount: fetched.maxAmount ?? raw.maxAmount,
    isCustomRange: Boolean(fetched.isCustomRange ?? raw.isCustomRange),
    ...fetched,
  });

  return {
    templateId,
    config: builtConfig,
    shop: raw.shop || null,
  };
};

export const buildSavePayload = (config = {}, storeDetails = {}, masterTemplateId = 'master_1', editId = null) => {
  const activePlacements = Array.isArray(config.placements) && config.placements.length > 0
    ? config.placements
    : ['PDP'];
  const displayFlags = Object.fromEntries(TAB_CONFIGS.map((tab) => [tab.field, activePlacements.includes(tab.code)]));

  const shopId = storeDetails?.id || storeDetails?.shopId;
  const domain = storeDetails?.myshopifyDomain || storeDetails?.domain;
  const activeId = editId ? Number(editId) : undefined;

  const merchantPlan = !config.isCustomRange
    ? getMerchantPlan(storeDetails).find((p) => p.min === Number(config.minAmount) && p.max === Number(config.maxAmount))
    : null;

  const payload = {
    ...(activeId ? { id: activeId, customizationId: activeId } : {}),
    ...(shopId ? { shopId } : {}),
    ...(domain ? { myshopifyDomain: domain } : {}),
    masterTemplateLayout: masterTemplateId,
    placement: activePlacements[0] || 'PDP',
    placements: activePlacements,
    ...displayFlags,
    allowCustomization: '1',
    minAmount: config.minAmount ?? null,
    maxAmount: config.maxAmount ?? null,
    isCustomRange: Boolean(config.isCustomRange),
    overrideDuplicateRange: Boolean(config.overrideDuplicateRange),
    tenure: config.tenure != null ? Number(config.tenure) : (merchantPlan?.tenure != null ? Number(merchantPlan.tenure) : null),
    dpPercent: config.dpPercent != null ? Number(config.dpPercent) : (merchantPlan?.dpPercent != null ? Number(merchantPlan.dpPercent) : null),
    dpType: config.dpType || merchantPlan?.dpType || null,
    emiPercent: config.emiPercent != null ? Number(config.emiPercent) : (merchantPlan?.emiPercent != null ? Number(merchantPlan.emiPercent) : null),
    ...getTemplateStyleDefaults(masterTemplateId, config),
  };

  AUTO_SETUP_FIELDS.forEach((key) => {
    if (config[key] !== undefined && config[key] !== '') {
      payload[key] = config[key];
    }
  });

  return payload;
};

export const extractAutoSetupPayload = (config = {}, storeDetails = {}) => {
  const shopId = storeDetails?.id || storeDetails?.shopId;
  const domain = storeDetails?.myshopifyDomain || storeDetails?.domain;

  const payload = {
    ...(shopId ? { shopId } : {}),
    ...(domain ? { myshopifyDomain: domain } : {}),
  };

  AUTO_SETUP_FIELDS.forEach((field) => {
    if (config[field] !== undefined && config[field] !== null && config[field] !== '') {
      payload[field] = config[field];
    }
  });

  return payload;
};

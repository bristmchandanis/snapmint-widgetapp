// 1. COLOR CUSTOMIZATION DEFAULTS & SCHEMAS
export const INNER_COLOR_FIELDS = [
  { key: 'widgetBgColor', label: 'Widget Background', defaultVal: '#EFEFEF' },
  { key: 'widgetBorderColor', label: 'Minimal Pill Border Color', defaultVal: '#D71E09' },
  { key: 'ctaBgColor', label: 'CTA Background', defaultVal: '#EF0714' },
  { key: 'ctaColor', label: 'CTA Text Color', defaultVal: '#FFFFFF' },
  { key: 'newBadgeBgColor', label: 'New Badge Background', defaultVal: '#2CA254' },
  { key: 'newBadgeTextColor', label: 'New Badge Text Color', defaultVal: '#FFFFFF' },
  { key: 'discountBadgeBgColor', label: 'Discount Badge Background', defaultVal: '#000000' },
  { key: 'discountBadgeTextColor', label: 'Discount Badge Text Color', defaultVal: '#FFFFFF' },
  { key: 'pricePrefixTextColor', label: 'Price Prefix Color', defaultVal: '#2B2B2B' },
  { key: 'priceTextColor', label: 'Price Color', defaultVal: '#2DA257' },
  { key: 'emiOptionTextColor', label: 'EMI Option Color', defaultVal: '#2B2B2B' },
  { key: 'secondaryEmiTextColor', label: 'Secondary EMI Color', defaultVal: '#1B1B1B' },
  { key: 'infoTooltipTextColor', label: 'Info Icon Color', defaultVal: '#151E29' },
];

export const DEFAULT_INNER_COLORS = Object.fromEntries(
  INNER_COLOR_FIELDS.map(({ key, defaultVal }) => [key, defaultVal])
);

export const MASTER_COLOR_FIELDS = [
  // Global Colors
  { key: 'primaryColor', label: 'Primary Color', defaultVal: '#FF6F00' },
  { key: 'primaryHoverColor', label: 'Primary Hover Color', defaultVal: '#FF6F00' },
  { key: 'primaryBgColor', label: 'Primary Light BG Color', defaultVal: '#FFF5EA' },
  { key: 'darkSliceColor', label: 'Dark Slice Color', defaultVal: '#19202A' },
  { key: 'lightSliceColor', label: 'Light Slice Color', defaultVal: '#F0F4F8' },

  // Text Colors
  { key: 'textPrimaryColor', label: 'Text Primary Color', defaultVal: '#151E29' },
  { key: 'textSecondaryColor', label: 'Text Secondary Color', defaultVal: '#151E29' },
  { key: 'textMutedColor', label: 'Text Muted Color', defaultVal: '#334255' },
  { key: 'textFeatureColor', label: 'Text Feature Color', defaultVal: '#151E29' },
  { key: 'textWhiteColor', label: 'Text White Color', defaultVal: '#FFFFFF' },

  // Background & Layout Colors
  { key: 'overlayBgColor', label: 'Overlay Background Color', defaultVal: '#3D3F43' },
  { key: 'modalBgColor', label: 'Modal Background Color', defaultVal: '#FFFFFF' },
  { key: 'innerBgColor', label: 'Inner Container BG Color', defaultVal: '#F1F5F9' },
  { key: 'cardBgColor', label: 'Card Background Color', defaultVal: '#FFFFFF' },
  { key: 'pillBgColor', label: 'Pill Background Color', defaultVal: '#FFFFFF' },
  { key: 'footerBgColor', label: 'Footer Background Color', defaultVal: '#F1F5F9' },
  { key: 'dividerColor', label: 'Divider Color', defaultVal: '#E2E8F0' },

  // Deal Badge Colors
  { key: 'dealBgColor', label: 'Deal Badge Background', defaultVal: '#FFF5EA' },
  { key: 'dealBorderColor', label: 'Deal Badge Border', defaultVal: '#FFDCCC' },
  { key: 'dealTextColor', label: 'Deal Badge Text Color', defaultVal: '#CC4F02' },
  { key: 'dealIconColor', label: 'Deal Badge Icon Color', defaultVal: '#C84B12' },

  // Offer Note Color
  { key: 'offerNoteColor', label: 'Offer Note Color', defaultVal: '#94A3B8' },

  // Merchant Badge Colors
  { key: 'merchantBgColor', label: 'Merchant Badge Background', defaultVal: '#FFFFFF' },
  { key: 'merchantBorderColor', label: 'Merchant Badge Border', defaultVal: '#CBD5E1' },
  { key: 'merchantTextColor', label: 'Merchant Badge Text', defaultVal: '#151E29' },

  // Discount Banner Colors
  { key: 'discountTextColor', label: 'Discount Banner Text', defaultVal: '#151E29' },
  { key: 'discountBoldColor', label: 'Discount Banner Bold Text', defaultVal: '#0F172A' },

  // Extra Off Tag Colors
  { key: 'extraOffBgColor', label: 'Extra Off Tag Background', defaultVal: '#FF5C00' },
  { key: 'extraOffTextColor', label: 'Extra Off Tag Text Color', defaultVal: '#FFFFFF' },
];

export const DEFAULT_MASTER_COLORS = Object.fromEntries(
  MASTER_COLOR_FIELDS.map(({ key, defaultVal }) => [key, defaultVal])
);

// 2. INLINE BANNER WIDGET DEFAULTS & CONFIGS
export const DEFAULT_INLINE_CONFIG = {
  layoutType: 'singleRowButton',
  isNewBadge: true,
  newBadgeText: 'NEW',
  isDiscountBadge: true,
  discountBadgeText: 'Flat 10% cashback up to ₹300',
  pricePrefixText: '',
  priceText: '{price}/month',
  emiOptionText: '{tenure} months EMI options',
  isBranding: true,
  ctaText: 'Buy on EMI',
  isInfoIcon: true,
  infoTooltipText: 'Calculate EMI options',
  secondaryEmiText: '0% EMI',
  secondaryEmiOptionText: '({tenure} months)',
  isUpiBranding: true,
  ...DEFAULT_INNER_COLORS,
};

// 3. AUTO-SETUP & PLACEMENT TAB CONFIGURATIONS
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
  /*
  {
    id: 'minicart',
    label: 'Mini Cart',
    field: 'displayMiniCart',
    code: 'MINICART',
    placementField: 'minCartWidgetPlacement',
    fields: [
      { name: 'minCartItem', label: 'Mini Cart Item Class', placeholder: 'e.g. .cart-drawer__item' },
      { name: 'minCartTotal', label: 'Mini Cart Total Selector', placeholder: 'e.g. .cart-drawer__total' },
      { name: 'minCartWidgetAppendTarget', label: 'Widget Append Target', placeholder: 'e.g. .cart-drawer__footer' },
    ],
  },
  */
  {
    id: 'cartDrawer',
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
  'pdpPriceSelector', 'pdpSalePrice', 'pdpProductId', 'pdpProductHandle', 'pdpProductName', 'pdpVariantId', 'pdpProductAvailable', 'pdpProductUrl', 'pdpWidgetAppendTarget', 'pdpWidgetPlacement',
  'collectionGridItem', 'collectionSalePrice', 'collectionProductId', 'collectionProductHandle', 'collectionProductName', 'collectionVariantId', 'collectionProductAvailable', 'collectionProductUrl', 'collectionWidgetAppendTarget', 'collectionWidgetPlacement',
  'cartItem', 'cartTotal', 'cartWidgetAppendTarget', 'cartWidgetPlacement',
  'cartDrawerItem', 'cartDrawerTotal', 'cartDrawerWidgetAppendTarget', 'cartDrawerWidgetPlacement',
  'minCartItem', 'minCartTotal', 'minCartWidgetAppendTarget', 'minCartWidgetPlacement',
];

/// 4. MASTER POPUP MODAL FIELD SCHEMAS
export const TOGGLE_FIELD_PAIRS = [
  { toggleKey: 'isCashback', toggleDefault: true, textKey: 'cashbackType', textDefault: 'Cashback', label: 'Cashback', isSelect: true, options: ['Cashback', 'Extra Off'] },
  {
    toggleKey: 'isCashbackText', toggleDefault: true, textKey: 'cashbackOfferText', help: '{amount} for dynamic amount', linkedTo: 'cashbackType', variants: {
      Cashback: ['Cashback', 'Cashback - {amount}% Snapmint', 'e.g. Cashback - {amount}% Snapmint'],
      'Extra Off': ['Extra off', 'Extra {amount}% off - Auto Applied on Payment with Snapmint', 'e.g. Extra {amount}% off'],
    }
  },
  { toggleKey: 'isLimitedDeal', toggleDefault: true, textKey: 'limitedDealText', textDefault: 'LIMITED TIME DEAL', label: 'Limited Time Deal', placeholder: 'e.g. SPECIAL DEAL' },
  { toggleKey: 'isCoupon', toggleDefault: true, textKey: 'couponText', textDefault: 'Coupon and Offers', label: 'Coupon & Offers Bar', placeholder: 'e.g. Special Offers' },
  { toggleKey: 'isWlPayLater', toggleDefault: true, textKey: 'wlPayLaterText', textDefault: '{logo} Pay Later', label: 'WL Pay Later Badge', placeholder: 'e.g. Pay Later with {logo}', help: '{logo} for dynamic logo' },
  { toggleKey: 'iswhiteLabel', toggleDefault: true, textKey: 'whiteLabelText', textDefault: 'Powered by {logo}', label: 'White Label Branding', placeholder: 'e.g. Powered by {logo}', help: '{logo} for dynamic logo' },
  { toggleKey: 'isRbiRegulated', toggleDefault: true, textKey: 'rbiRegulatedText', textDefault: 'RBI REGULATED', label: 'RBI Regulated Badge', placeholder: 'e.g. RBI COMPLIANT' },
  { toggleKey: 'isRbiTrusted', toggleDefault: true, textKey: 'rbiTrustedText', textDefault: 'TRUSTED BY 5 CR+ USERS', label: 'RBI Trusted Badge', placeholder: 'e.g. 1M+ USERS' },
  { toggleKey: 'isNote', toggleDefault: true, textKey: 'noteText', textDefault: 'Offer will change for order value greater than ₹3000 and users with no credit history. *T&C', label: 'Note Disclaimer', placeholder: 'e.g. Min cart value ₹1000', isTextarea: true },
];

export const MASTER_TEXT_INPUT_FIELDS = [
  { key: 'payonlyText', label: 'Pay Only Text', placeholder: 'e.g. Pay initial', defaultVal: 'Pay only' },
  { key: 'payNowText', label: 'Pay Now Text', placeholder: 'e.g. Pay {price}', defaultVal: '{price} Now', help: '{price} for dynamic price' },
  { key: 'restLaterInText', label: 'Rest Later Text', placeholder: 'e.g. split into', defaultVal: 'rest later in', help: '{emi} for dynamic emi' },
  { key: 'emiHeader', label: 'EMI Options Header', placeholder: 'e.g. No-Cost EMI', defaultVal: 'EMI options' },
  { key: 'empiPlans', label: 'EMI Plans Text', placeholder: 'e.g. {month} Plan', defaultVal: '{month} Option', help: '{month} for dynamic month' },
  { key: 'planBadgeText', label: 'Plan Badge Text', placeholder: 'e.g. Zero Downpayment', defaultVal: '{text}', help: '{text} for dynamic text' },
  { key: 'price', label: 'Plan Value / Price', placeholder: 'e.g. ₹999', defaultVal: '{price}', help: '{price} for dynamic price' },
  { key: 'scheduleLabelText', label: 'Schedule Date Label', placeholder: 'e.g. 15th Oct', defaultVal: '{text}', help: '{text} for dynamic date' },
  { key: 'tenureLabelText', label: 'Tenure Duration Label', placeholder: 'e.g. 3 Months', defaultVal: '{text}', help: '{text} for dynamic duration' },
  { key: 'subTotalLabel', label: 'Sub Total Label', placeholder: 'e.g. Subtotal', defaultVal: 'Sub Total' },
  { key: 'couponAppliedTemplate', label: 'Coupon Applied Template', placeholder: 'e.g. {code} Applied', defaultVal: '{code} Coupon Applied', help: '{code} for dynamic coupon' },
  { key: 'totalOrderLabel', label: 'Total Order Label', placeholder: 'e.g. Total Amount', defaultVal: 'Total Order Value' },
  { key: 'highlightsText', label: 'Highlight Features Text', placeholder: 'e.g. Zero Processing Fee', defaultVal: '0% Interest Installments / 0 Extra Cost / UPI + Cards Accepted' },
  { key: 'paymentTaglineText', label: 'Footer Payment Tagline Text', placeholder: 'e.g. Pay with {logo}', defaultVal: 'Pay with {logo} at 0% EMI', help: '{logo} for dynamic logo' },
  { key: 'chooseSize', label: 'Choose Size Text', placeholder: 'e.g. Select Size', defaultVal: 'Choose Size for {logo} EMI Purchase', help: '{logo} for dynamic logo' },
  { key: 'fullName', label: 'Full Name Input', placeholder: 'e.g. John', defaultVal: 'John Doe' },
  { key: 'lastName', label: 'Last Name Input', placeholder: 'e.g. Doe', defaultVal: 'Doe' },
  { key: 'mobile', label: 'Mobile Number', placeholder: 'e.g. 9876543210', defaultVal: '1234567890' },
  { key: 'ctaButtonText', label: 'CTA Button Text', placeholder: 'e.g. Buy Now >', defaultVal: 'Buy On EMI >', help: '{text} for dynamic text' },
  { key: 'selectColor', label: 'Select Color Dropdown Text', placeholder: 'e.g. Brown', defaultVal: 'Color: Brown', help: '{color} for dynamic color' },
  { key: 'selectSize', label: 'Select Size Dropdown Text', placeholder: 'e.g. Size 9', defaultVal: 'Size: 9', help: '{size} for dynamic size' },
  { key: 'paymentInstructionText', label: 'Payment Instruction Text', placeholder: 'e.g. Select Pay Later', defaultVal: 'Select Snapmint on the payment screen' },
  { key: 'creditLimitTitle', label: 'Credit Limit Title', placeholder: 'e.g. Limit up to {limit}', defaultVal: 'Unlock your limits Up to ₹10,000', help: '{limit} for dynamic max amount' },
  { key: 'badgeText', label: 'Credit Limit Badge Text', placeholder: 'e.g. Instant Approval', defaultVal: 'Instant Approval' },
  { key: 'creditLimitDisclaimer', label: 'Credit Score Disclaimer Text', placeholder: 'e.g. No CIBIL Check', defaultVal: 'No Credit Score Impact' },
];

export const MASTER_DROPDOWN_FIELDS = [
  { key: 'orderValueType', label: 'Order Value Layout', defaultVal: 'Coupon Apply', options: ['Coupon Apply', 'Total Order Value'] },
  { key: 'paymentTaglineType', label: 'Footer Tagline Layout', defaultVal: 'Only Pay with', options: ['Only Pay with', 'with personal details', 'with Size', 'Credit limit-with Select payment', 'Credit limit-0% EMI'] },
];

export const DEFAULT_MASTER_CONFIG = {
  popupLayoutType: 'default',
  isChevron: true,
  ...DEFAULT_MASTER_COLORS,
  ...Object.fromEntries(
    MASTER_DROPDOWN_FIELDS.map((f) => [f.key, f.defaultVal])
  ),
  ...Object.fromEntries(
    TOGGLE_FIELD_PAIRS.flatMap((p) => [
      [p.toggleKey, p.toggleDefault ?? true],
      [p.textKey, p.variants ? Object.values(p.variants)[0][1] : (p.textDefault ?? '')],
    ])
  ),
  ...Object.fromEntries(
    MASTER_TEXT_INPUT_FIELDS.map((f) => [f.key, f.defaultVal ?? ''])
  ),
};

export const COLOR_SECTION_CONFIGS = [
  {
    id: 'inline',
    title: 'Inline Banner Customization Colors',
    previewLabel: 'Live Inline Banner Preview',
    fieldsConfig: INNER_COLOR_FIELDS,
    defaultColors: DEFAULT_INNER_COLORS,
  },
  {
    id: 'master',
    title: 'Master Popup Modal Customization Colors',
    previewLabel: 'Live Master Popup Layout Preview',
    fieldsConfig: MASTER_COLOR_FIELDS,
    defaultColors: DEFAULT_MASTER_COLORS,
  },
];

// 5. FORM FIELD SCHEMAS FOR WIDGET CUSTOMIZER
export const getPricingFields = (isMinimal, isSingleTenure = false) => [
  { key: 'pricePrefixText', label: 'Price Prefix', placeholder: isMinimal ? 'e.g. "Pay"' : (isSingleTenure ? 'e.g. "Or"' : 'e.g. "or", "Pay"') },
  { key: 'priceText', label: 'Price Text', placeholder: isMinimal ? 'e.g. {price}/mo' : 'e.g. {price}/month', help: '{price} for dynamic price' },
  ...(isSingleTenure
    ? [{ key: 'secondaryEmiOptionText', label: 'Secondary Tenure Text', placeholder: 'e.g. ({tenure} months)', help: isMinimal ? null : '{tenure} for dynamic tenure' }]
    : [{ key: 'emiOptionText', label: 'EMI Option Text', placeholder: isMinimal ? 'e.g. "No Cost EMI with"' : 'e.g. {tenure} months EMI options', help: isMinimal ? null : '{tenure} for dynamic tenure' }]
  ),
  ...(!isMinimal ? [
    { key: 'secondaryEmiText', label: 'Secondary EMI Text', placeholder: 'e.g. 0% EMI' }
  ] : []),
];

// 6. CASHBACK OFFER FORM FIELD SCHEMAS
export const getCashbackFormFields = (startDateMin, endDateMin, cashbackTypeOptions = []) => [
  {
    key: 'title',
    label: 'Campaign Title',
    type: 'text',
    required: true,
    placeholder: 'e.g. Mega Cashback Offer',
  },
  {
    key: 'cashbackCreditDays',
    label: 'Cashback Credit Days',
    type: 'number',
    placeholder: 'e.g. 15',
    min: 7,
    max: 30,
  },
  {
    key: 'cashbackType',
    label: 'Cashback Type',
    type: 'select',
    options: cashbackTypeOptions,
    placeholder: 'Select cashback type',
  },
  {
    key: 'cashbackValue',
    label: 'Cashback Amount',
    type: 'number',
    required: true,
    placeholder: 'e.g. 500',
  },
  {
    key: 'startDate',
    label: 'Start Date',
    type: 'date',
    required: true,
    min: startDateMin,
    valueTransform: (val) => (val ? String(val).split('T')[0] : ''),
  },
  {
    key: 'endDate',
    label: 'End Date',
    type: 'date',
    required: true,
    min: endDateMin,
    valueTransform: (val) => (val ? String(val).split('T')[0] : ''),
  },
];

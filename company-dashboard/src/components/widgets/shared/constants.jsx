// Base colors shared across light theme palettes
const BASE_LIGHT_THEME = {
  mainText: '#151E29',
  popupBg: '#FFFFFF',
  bottomBg: '#F1F5F9',
  bottomText: '#151E29',
  fieldBg: '#FFFFFF',
  enteredText: '#151E29',
  fieldPlaceholder: '#334255',
  fieldBorder: '#CBD5E1',
  secondaryText: '#334255',
  planBg: '#F1F5F9',
  uspText: '#151E29',
  paymentCards: '#FFFFFF',
};

export const THEME_PALETTES = {
  orange: {
    ...BASE_LIGHT_THEME,
    id: 'orange',
    name: 'Orange',
    brandAccent: '#FF6F00',
    payNowTagFill: '#FF6F00',
    payNowTagText: '#FFFFFF',
    buttonFill: '#FF6F00',
    buttonText: '#FFFFFF',
    selectedCard: '#FFF5EA',
    selectedOutline: '#FF6F00',
  },
  neutral: {
    ...BASE_LIGHT_THEME,
    id: 'neutral',
    name: 'Neutral',
    brandAccent: '#64768B',
    payNowTagFill: '#334255',
    payNowTagText: '#FFFFFF',
    buttonFill: '#334255',
    buttonText: '#FFFFFF',
    selectedCard: '#F8FAFC',
    selectedOutline: '#64768B',
  },
  darkMode: {
    id: 'darkMode',
    name: 'Dark Mode',
    brandAccent: '#FF6F00',
    payNowTagFill: '#FF6F00',
    payNowTagText: '#FFFFFF',
    mainText: '#F8FAFC',
    popupBg: '#151E29',
    bottomBg: '#1E2B3B',
    bottomText: '#F8FAFC',
    fieldBg: '#151E29',
    enteredText: '#F8FAFC',
    fieldPlaceholder: '#F1F5F9',
    fieldBorder: '#64768B',
    buttonFill: '#FF6F00',
    buttonText: '#FFFFFF',
    secondaryText: '#F1F5F9',
    planBg: '#1E2B3B',
    uspText: '#F8FAFC',
    paymentCards: '#151E29',
    selectedCard: '#151E29',
    selectedOutline: '#FF6F00',
  },
};

export const DEFAULT_BRAND_COLORS = [
  '#FFFFFF', '#FF6F01', '#BCBFC3', '#8A8F95', '#FEC091', '#F2D4BE', '#FE9645', '#62686F'
];

export const DEFAULT_LOGO_COLORS = [
  '#0A1225', '#06444D', '#A71346', '#8F8F1A', '#314277', '#5D6015', '#165F1D', '#491946'
];

export const DEFAULT_CUSTOM_TEXT = {
  topTitle: 'Pay only',
  amountTitle: '{amount} Now',
  sizeSheetTitle: 'Choose Size for {merchant} EMI Purchase',
};

export const DEFAULT_CORNER_RADII = {
  popup: '16 px',
  container: '16 px',
  button: '6 px',
};

export const DEFAULT_CASHBACK = {
  enabled: true,
  ribbonFill: '#D1F4FC',
  ribbonText: '#151E29',
};

export const DEFAULT_OFFERS = {
  enabled: true,
  offerRibbon: true,
  offerRibbonFill: '#FF6F00',
  offerRibbonText: '#FFFFFF',
  offerText: true,
  offerTextColour: '#F8FAFC',
  limitedTimeDealTag: true,
  dealTagFill: '#FFF5EA',
  dealTagText: '#CC4F02',
  dealTagIcon: '#CC4F02',
  offerNote: true,
  offerNoteColour: '#64768B',
  offerNoteText: 'Offer will change for order value greater than ₹3000',
};

export const DEFAULT_COUPONS = {
  enabled: true,
  couponStripFill: '#FDF2F7',
  couponStripText: '#151E29',
  couponIconColour: '#BE185D',
  listButtonColour: '#FF6F00',
  listButtonTextColour: '#FFFFFF',
  listNavIcons: '#64768B',
};

export const DEFAULT_RBI = {
  enabled: true,
  iconsColour: '#FF6F00',
  textColour: '#64768B',
};

export const DEFAULT_SNAPSHOT = {
  selectedTheme: 'orange',
  colors: { ...THEME_PALETTES.orange },
  brandColors: [...DEFAULT_BRAND_COLORS],
  logoColors: [...DEFAULT_LOGO_COLORS],
  brandLogo: null,
  titleFont: null,
  bodyFont: null,
  uploadedFonts: [],
  customText: { ...DEFAULT_CUSTOM_TEXT },
  cornerRadii: { ...DEFAULT_CORNER_RADII },
  cashback: { ...DEFAULT_CASHBACK },
  offers: { ...DEFAULT_OFFERS },
  coupons: { ...DEFAULT_COUPONS },
  rbi: { ...DEFAULT_RBI },
};

// Reusable inspector field presets
const MAIN_TEXT_FIELD = [{ key: 'mainText', label: 'Text colour' }];
const LABEL_FIELD = [{ key: 'secondaryText', label: 'Label colour' }];
const USP_FIELD = [{ key: 'uspText', label: 'Text colour' }];
const TRUST_FIELDS = [
  { key: 'rbiIcons', label: 'Icon colour' },
  { key: 'rbiText', label: 'Text colour' },
];
const CARD_FIELDS = [
  { key: 'paymentCards', label: 'Background' },
  { key: 'mainText', label: 'Text colour' },
  { key: 'secondaryText', label: 'Secondary text' },
];

// Granular element inspector map: data-snp-el attribute → { label, fields: [{ key, label }] }
export const ELEMENT_MAP = {
  // Modal background & header
  'popup-bg': { label: 'Pop-up background', fields: [{ key: 'popupBg', label: 'Background' }] },
  'header': { label: 'Header section', fields: [{ key: 'mainText', label: 'Text colour' }, { key: 'popupBg', label: 'Background' }] },
  'subtitle': { label: 'Top subtitle ("Pay only")', fields: MAIN_TEXT_FIELD },
  'amount-highlight': { label: 'Highlight amount', fields: [{ key: 'brandAccent', label: 'Accent colour' }] },
  'rest-subtitle': { label: 'Subtitle ("rest later in")', fields: MAIN_TEXT_FIELD },
  'deal-badge': { label: 'Limited time deal badge', fields: [{ key: 'dealTagFill', label: 'Background' }, { key: 'dealTagText', label: 'Text colour' }, { key: 'dealTagIcon', label: 'Icon colour' }] },
  'offer-banner': { label: 'Offer banner ("Extra 5% Off")', fields: [{ key: 'brandAccent', label: 'Accent colour' }, { key: 'mainText', label: 'Text colour' }] },
  'corner-ribbon': { label: 'Cashback corner ribbon', fields: [{ key: 'ribbonFill', label: 'Ribbon fill' }, { key: 'ribbonText', label: 'Ribbon text' }] },
  'close-btn': { label: 'Close button', fields: [{ key: 'mainText', label: 'Icon colour' }] },

  // Plan section & Cards
  'inner-box': { label: 'Plan container', fields: [{ key: 'planBg', label: 'Background' }] },
  'card-active': { label: 'Payment card 1 (Active)', fields: [{ key: 'selectedCard', label: 'Card fill' }, { key: 'mainText', label: 'Text colour' }, { key: 'selectedOutline', label: 'Outline' }, { key: 'brandAccent', label: 'Accent' }] },
  'pie-1': { label: 'Pie chart 1 (Active)', fields: [{ key: 'brandAccent', label: 'Slice colour' }] },
  'card-price-1': { label: 'Card 1 price', fields: [{ key: 'mainText', label: 'Price colour' }] },
  'card-label-1': { label: 'Card 1 label ("Today")', fields: LABEL_FIELD },
  'pay-now-badge': { label: 'Pay Now badge', fields: [{ key: 'payNowTagFill', label: 'Badge fill' }, { key: 'payNowTagText', label: 'Badge text' }] },

  'card-2': { label: 'Payment card 2', fields: CARD_FIELDS },
  'pie-2': { label: 'Pie chart 2', fields: [{ key: 'mainText', label: 'Slice colour' }] },
  'card-price-2': { label: 'Card 2 price', fields: [{ key: 'mainText', label: 'Price colour' }] },
  'card-label-2': { label: 'Card 2 label ("3rd May")', fields: LABEL_FIELD },

  'card-3': { label: 'Payment card 3', fields: CARD_FIELDS },
  'pie-3': { label: 'Pie chart 3', fields: [{ key: 'mainText', label: 'Slice colour' }] },
  'card-price-3': { label: 'Card 3 price', fields: [{ key: 'mainText', label: 'Price colour' }] },
  'card-label-3': { label: 'Card 3 label ("3rd Jun")', fields: LABEL_FIELD },

  // Total order value
  'total-card': { label: 'Total order value card', fields: MAIN_TEXT_FIELD },
  'total-row': { label: 'Total order value row', fields: MAIN_TEXT_FIELD },
  'total-label': { label: 'Label ("Total Order Value")', fields: MAIN_TEXT_FIELD },
  'total-price': { label: 'Total amount text', fields: MAIN_TEXT_FIELD },
  'coupon-strip': { label: 'Coupon & Offers strip', fields: [{ key: 'couponStripFill', label: 'Strip fill' }, { key: 'couponStripText', label: 'Text colour' }, { key: 'couponIconColour', label: 'Icon colour' }] },

  // Features bar & individual items
  'features': { label: 'Features bar', fields: USP_FIELD },
  'feature-1': { label: 'Feature 1 ("0% Interest")', fields: USP_FIELD },
  'feature-2': { label: 'Feature 2 ("0 Extra Cost")', fields: USP_FIELD },
  'feature-3': { label: 'Feature 3 ("UPI + Cards")', fields: USP_FIELD },

  // Offer disclaimer note
  'offer-note': { label: 'Offer disclaimer note', fields: [{ key: 'offerNoteColour', label: 'Note text colour' }] },

  // Footer & Trust badges
  'footer': { label: 'Footer section', fields: [{ key: 'secondaryText', label: 'Text colour' }] },
  'pay-with-brand': { label: 'Brand row ("Pay with Snapmint")', fields: MAIN_TEXT_FIELD },
  'trust-bar': { label: 'Trust badges row', fields: TRUST_FIELDS },
  'rbi-badge': { label: 'RBI regulated badge', fields: TRUST_FIELDS },
  'trusted-badge': { label: 'Trusted users badge', fields: TRUST_FIELDS },
  'eligibility-footer': { label: 'Eligibility section', fields: [{ key: 'brandAccent', label: 'Accent colour' }] },

  // Express checkout
  'express-bottom': { label: 'Express checkout bar', fields: [{ key: 'bottomBg', label: 'Background' }, { key: 'bottomText', label: 'Text colour' }, { key: 'buttonFill', label: 'Button fill' }, { key: 'buttonText', label: 'Button text' }] },
};

// Map color keys → CSS variable names for per-element inline overrides
export const COLOR_KEY_TO_CSS_VAR = {
  popupBg: ['--snp-color-modal-bg'],
  mainText: ['--snp-color-text-primary'],
  brandAccent: ['--snp-color-primary'],
  planBg: ['--snp-color-inner-bg'],
  selectedCard: ['--snp-color-card-active', '--snp-color-primary-bg'],
  selectedOutline: ['--snp-color-card-outline'],
  paymentCards: ['--snp-color-card-bg'],
  secondaryText: ['--snp-color-text-secondary', '--snp-color-text-muted'],
  uspText: ['--snp-color-text-feature', '--snp-color-usp-text'],
  bottomBg: ['--snp-color-bottom-bg'],
  bottomText: ['--snp-color-bottom-text', '--snp-color-entered-text'],
  buttonFill: ['--snp-color-button-fill'],
  buttonText: ['--snp-color-button-text'],
  payNowTagFill: ['--snp-color-pay-now', '--snp-color-button-fill'],
  payNowTagText: ['--snp-color-pay-now-text', '--snp-color-button-text'],
  dealTagFill: ['--snp-color-deal-bg'],
  dealTagText: ['--snp-color-deal-text'],
  dealTagIcon: ['--snp-color-deal-icon'],
  offerNoteColour: ['--snp-color-offer-note-custom', '--snp-color-offer-note'],
  rbiIcons: ['--snp-color-rbi-icons'],
  rbiText: ['--snp-color-rbi-text'],
  ribbonFill: ['--snp-color-cashback-ribbon-bg'],
  ribbonText: ['--snp-color-cashback-ribbon-text'],
  couponStripFill: ['--snp-color-coupon-strip-fill'],
  couponStripText: ['--snp-color-coupon-strip-text'],
  couponIconColour: ['--snp-color-coupon-icon'],
};

// Strips whitespace for valid CSS radius e.g. "16 px" -> "16px"
const toCssRadius = (val, fallback) => (val || fallback).replace(/\s+/g, '');

/**
 * Builds the CSS variables map for the live preview container based on current customization settings.
 */
export function buildLivePreviewStyles({
  colors = {},
  cornerRadii = {},
  cashback = {},
  offers = {},
  rbi = {},
  coupons = {},
  titleFont = null,
  bodyFont = null,
}) {
  const {
    brandAccent,
    payNowTagFill,
    payNowTagText,
    mainText,
    secondaryText,
    uspText,
    popupBg,
    planBg,
    paymentCards,
    selectedCard,
    selectedOutline,
    bottomBg,
    bottomText,
    fieldBg,
    enteredText,
    fieldPlaceholder,
    fieldBorder,
    buttonFill,
    buttonText,
  } = colors;

  const footerBg = bottomBg || planBg;

  return {
    '--snp-color-primary': brandAccent,
    '--snp-color-extra-off-bg': brandAccent,
    '--snp-color-pay-now': payNowTagFill,
    '--snp-color-pay-now-text': payNowTagText,
    '--snp-color-extra-off-text': payNowTagText,
    '--snp-color-text-primary': mainText,
    '--snp-color-text-secondary': secondaryText,
    '--snp-color-text-muted': secondaryText,
    '--snp-color-offer-note': secondaryText,
    '--snp-color-text-feature': uspText,
    '--snp-color-usp-text': uspText,
    '--snp-color-modal-bg': popupBg,
    '--snp-color-inner-bg': planBg,
    '--snp-color-card-bg': paymentCards,
    '--snp-color-pill-bg': paymentCards,
    '--snp-color-card-active': selectedCard,
    '--snp-color-card-outline': selectedOutline,
    '--snp-color-primary-bg': selectedCard,
    '--snp-color-footer-bg': footerBg,
    '--snp-color-bottom-bg': bottomBg,
    '--snp-color-bottom-text': bottomText,
    '--snp-color-field-bg': fieldBg,
    '--snp-color-entered-text': enteredText || bottomText || '#151E29',
    '--snp-color-field-placeholder': fieldPlaceholder,
    '--snp-color-field-border': fieldBorder,
    '--snp-color-button-fill': buttonFill,
    '--snp-color-button-text': buttonText,
    '--snp-radius-modal': toCssRadius(cornerRadii.popup, '16px'),
    '--snp-radius-container': toCssRadius(cornerRadii.container, '16px'),
    '--snp-radius-button': toCssRadius(cornerRadii.button, '6px'),
    '--snp-color-cashback-ribbon-bg': cashback.ribbonFill || '#F1F5F9',
    '--snp-color-cashback-ribbon-text': cashback.ribbonText || '#151E29',
    '--snp-color-offer-ribbon-fill': offers.offerRibbonFill,
    '--snp-color-offer-ribbon-text': offers.offerRibbonText,
    '--snp-color-offer-text': offers.offerTextColour,
    '--snp-color-deal-bg': offers.dealTagFill,
    '--snp-color-deal-text': offers.dealTagText,
    '--snp-color-deal-icon': offers.dealTagIcon,
    '--snp-color-offer-note-custom': offers.offerNoteColour,
    '--snp-rbi-display': rbi?.enabled !== false ? 'flex' : 'none',
    '--snp-color-rbi-icons': rbi?.iconsColour || '#FF6F00',
    '--snp-color-rbi-text': rbi?.textColour || '#64768B',
    '--snp-color-coupon-strip-fill': coupons?.couponStripFill || '#FDF2F7',
    '--snp-color-coupon-strip-text': coupons?.couponStripText || '#151E29',
    '--snp-color-coupon-icon': coupons?.couponIconColour || '#BE185D',
    '--snp-color-coupon-btn': coupons?.listButtonColour || '#FF6F00',
    '--snp-color-coupon-btn-text': coupons?.listButtonTextColour || '#FFFFFF',
    '--snp-color-coupon-nav-icons': coupons?.listNavIcons || '#64768B',
    '--snp-font-title': titleFont ? `"${titleFont}", var(--snp-font-family)` : 'var(--snp-font-family)',
    '--snp-font-body': bodyFont ? `"${bodyFont}", var(--snp-font-inter)` : 'var(--snp-font-inter)',
    '--snp-font-family': bodyFont ? `"${bodyFont}", 'Archivo', 'Inter', sans-serif` : "'Archivo', 'Inter', sans-serif",
    '--snp-font-inter': bodyFont ? `"${bodyFont}", 'Inter', sans-serif` : "'Inter', sans-serif",
    '--snp-font-title-style': titleFont && /italic/i.test(titleFont) ? 'italic' : 'normal',
    '--snp-font-body-style': bodyFont && /italic/i.test(bodyFont) ? 'italic' : 'normal',
  };
}

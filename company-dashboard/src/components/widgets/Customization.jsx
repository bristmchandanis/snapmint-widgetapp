import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { ArrowRight, ArrowLeft, Crosshair, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { PiePopup, MultiLayerPopup, BoxPopup, FixedDepositPopup } from './popup/PopupModal';
import CouponListPopup from './popup/CouponListPopup';
import './popup/PopupModal.css';
import AssetsSection from './customization/AssetsSection';
import ThemeSection from './customization/ThemeSection';
import ColoursSection from './customization/ColoursSection';
import TextSection from './customization/TextSection';
import CornerRadiusSection from './customization/CornerRadiusSection';
import CashbackSection from './customization/CashbackSection';
import OffersSection from './customization/OffersSection';
import CouponsSection from './customization/CouponsSection';
import RbiSection from './customization/RbiSection';
import { extractColorsFromImage, extractColorsFromText } from './customization/colorExtraction';

const THEME_PALETTES = {
  orange: {
    id: 'orange', name: 'Orange',
    brandAccent: '#FF6F00', payNowTagFill: '#FF6F00', payNowTagText: '#FFFFFF',
    mainText: '#151E29', popupBg: '#FFFFFF', bottomBg: '#F1F5F9', bottomText: '#151E29',
    fieldBg: '#FFFFFF', enteredText: '#151E29', fieldPlaceholder: '#334255', fieldBorder: '#CBD5E1',
    buttonFill: '#FF6F00', buttonText: '#FFFFFF', secondaryText: '#334255',
    planBg: '#F1F5F9', uspText: '#151E29', paymentCards: '#FFFFFF',
    selectedCard: '#FFF5EA', selectedOutline: '#FF6F00',
  },
  neutral: {
    id: 'neutral', name: 'Neutral',
    brandAccent: '#64768B', payNowTagFill: '#334255', payNowTagText: '#FFFFFF',
    mainText: '#151E29', popupBg: '#FFFFFF', bottomBg: '#F1F5F9', bottomText: '#151E29',
    fieldBg: '#FFFFFF', enteredText: '#151E29', fieldPlaceholder: '#334255', fieldBorder: '#CBD5E1',
    buttonFill: '#334255', buttonText: '#FFFFFF', secondaryText: '#334255',
    planBg: '#F1F5F9', uspText: '#151E29', paymentCards: '#FFFFFF',
    selectedCard: '#F8FAFC', selectedOutline: '#64768B',
  },
  darkMode: {
    id: 'darkMode', name: 'Dark Mode',
    brandAccent: '#FF6F00', payNowTagFill: '#FF6F00', payNowTagText: '#FFFFFF',
    mainText: '#F8FAFC', popupBg: '#151E29', bottomBg: '#1E2B3B', bottomText: '#F8FAFC',
    fieldBg: '#151E29', enteredText: '#F8FAFC', fieldPlaceholder: '#F1F5F9', fieldBorder: '#64768B',
    buttonFill: '#FF6F00', buttonText: '#FFFFFF', secondaryText: '#F1F5F9',
    planBg: '#1E2B3B', uspText: '#F8FAFC', paymentCards: '#151E29',
    selectedCard: '#151E29', selectedOutline: '#FF6F00',
  },
};

const PLACEMENT_TABS = [
  { id: 'pdp', label: 'PDP' },
  { id: 'mini-cart', label: 'Mini cart' },
  { id: 'cart', label: 'Cart' },
  { id: 'checkout', label: 'Checkout' },
];

const DEFAULT_BRAND_COLORS = [
  '#FFFFFF', '#FF6F01', '#BCBFC3', '#8A8F95', '#FEC091', '#F2D4BE', '#FE9645', '#62686F'
];

const DEFAULT_LOGO_COLORS = [
  '#0A1225', '#06444D', '#A71346', '#8F8F1A', '#314277', '#5D6015', '#165F1D', '#491946'
];

const DEFAULT_CUSTOM_TEXT = {
  topTitle: 'Pay only',
  amountTitle: '{amount} Now',
  sizeSheetTitle: 'Choose Size for {merchant} EMI Purchase',
};

const DEFAULT_CORNER_RADII = {
  popup: '16 px',
  container: '16 px',
  button: '6 px',
};

const DEFAULT_CASHBACK = {
  enabled: true,
  ribbonFill: '#D1F4FC',
  ribbonText: '#151E29',
};

const DEFAULT_OFFERS = {
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

const DEFAULT_COUPONS = {
  enabled: true,
  couponStripFill: '#FDF2F7',
  couponStripText: '#151E29',
  couponIconColour: '#BE185D',
  listButtonColour: '#FF6F00',
  listButtonTextColour: '#FFFFFF',
  listNavIcons: '#64768B',
};

const DEFAULT_RBI = {
  enabled: true,
  iconsColour: '#FF6F00',
  textColour: '#64768B',
};

const POPUP_MAP = {
  'multi-plan': MultiLayerPopup,
  'pie': PiePopup,
  'box': BoxPopup,
  'fixed-dp': FixedDepositPopup,
};

// Granular element inspector map: data-snp-el value → { label, fields: [{ key (color state key), label }] }
const ELEMENT_MAP = {
  // Modal background
  'popup-bg':           { label: 'Pop-up background',        fields: [{ key: 'popupBg', label: 'Background' }] },

  // Header & Title items
  'header':             { label: 'Header section',            fields: [{ key: 'mainText', label: 'Text colour' }, { key: 'popupBg', label: 'Background' }] },
  'subtitle':           { label: 'Top subtitle ("Pay only")', fields: [{ key: 'mainText', label: 'Text colour' }] },
  'amount-highlight':   { label: 'Highlight amount',         fields: [{ key: 'brandAccent', label: 'Accent colour' }] },
  'rest-subtitle':      { label: 'Subtitle ("rest later in")', fields: [{ key: 'mainText', label: 'Text colour' }] },
  'deal-badge':         { label: 'Limited time deal badge',   fields: [{ key: 'dealTagFill', label: 'Background' }, { key: 'dealTagText', label: 'Text colour' }, { key: 'dealTagIcon', label: 'Icon colour' }] },
  'offer-banner':       { label: 'Offer banner ("Extra 5% Off")', fields: [{ key: 'brandAccent', label: 'Accent colour' }, { key: 'mainText', label: 'Text colour' }] },
  'corner-ribbon':      { label: 'Cashback corner ribbon',    fields: [{ key: 'ribbonFill', label: 'Ribbon fill' }, { key: 'ribbonText', label: 'Ribbon text' }] },
  'close-btn':          { label: 'Close button',              fields: [{ key: 'mainText', label: 'Icon colour' }] },

  // Plan section & Cards
  'inner-box':          { label: 'Plan container',           fields: [{ key: 'planBg', label: 'Background' }] },
  'card-active':        { label: 'Payment card 1 (Active)',  fields: [{ key: 'selectedCard', label: 'Card fill' }, { key: 'mainText', label: 'Text colour' }, { key: 'selectedOutline', label: 'Outline' }, { key: 'brandAccent', label: 'Accent' }] },
  'pie-1':              { label: 'Pie chart 1 (Active)',      fields: [{ key: 'brandAccent', label: 'Slice colour' }] },
  'card-price-1':       { label: 'Card 1 price',              fields: [{ key: 'mainText', label: 'Price colour' }] },
  'card-label-1':       { label: 'Card 1 label ("Today")',   fields: [{ key: 'secondaryText', label: 'Label colour' }] },
  'pay-now-badge':      { label: 'Pay Now badge',             fields: [{ key: 'payNowTagFill', label: 'Badge fill' }, { key: 'payNowTagText', label: 'Badge text' }] },

  'card-2':             { label: 'Payment card 2',            fields: [{ key: 'paymentCards', label: 'Background' }, { key: 'mainText', label: 'Text colour' }, { key: 'secondaryText', label: 'Secondary text' }] },
  'pie-2':              { label: 'Pie chart 2',               fields: [{ key: 'mainText', label: 'Slice colour' }] },
  'card-price-2':       { label: 'Card 2 price',              fields: [{ key: 'mainText', label: 'Price colour' }] },
  'card-label-2':       { label: 'Card 2 label ("3rd May")',  fields: [{ key: 'secondaryText', label: 'Label colour' }] },

  'card-3':             { label: 'Payment card 3',            fields: [{ key: 'paymentCards', label: 'Background' }, { key: 'mainText', label: 'Text colour' }, { key: 'secondaryText', label: 'Secondary text' }] },
  'pie-3':              { label: 'Pie chart 3',               fields: [{ key: 'mainText', label: 'Slice colour' }] },
  'card-price-3':       { label: 'Card 3 price',              fields: [{ key: 'mainText', label: 'Price colour' }] },
  'card-label-3':       { label: 'Card 3 label ("3rd Jun")',  fields: [{ key: 'secondaryText', label: 'Label colour' }] },

  // Total order value
  'total-card':         { label: 'Total order value card',    fields: [{ key: 'mainText', label: 'Text colour' }] },
  'total-row':          { label: 'Total order value row',     fields: [{ key: 'mainText', label: 'Text colour' }] },
  'total-label':        { label: 'Label ("Total Order Value")', fields: [{ key: 'mainText', label: 'Text colour' }] },
  'total-price':        { label: 'Total amount text',         fields: [{ key: 'mainText', label: 'Text colour' }] },
  'coupon-strip':       { label: 'Coupon & Offers strip',     fields: [{ key: 'couponStripFill', label: 'Strip fill' }, { key: 'couponStripText', label: 'Text colour' }, { key: 'couponIconColour', label: 'Icon colour' }] },

  // Features bar & individual items
  'features':           { label: 'Features bar',              fields: [{ key: 'uspText', label: 'Text colour' }] },
  'feature-1':          { label: 'Feature 1 ("0% Interest")', fields: [{ key: 'uspText', label: 'Text colour' }] },
  'feature-2':          { label: 'Feature 2 ("0 Extra Cost")', fields: [{ key: 'uspText', label: 'Text colour' }] },
  'feature-3':          { label: 'Feature 3 ("UPI + Cards")', fields: [{ key: 'uspText', label: 'Text colour' }] },

  // Offer disclaimer note
  'offer-note':         { label: 'Offer disclaimer note',     fields: [{ key: 'offerNoteColour', label: 'Note text colour' }] },

  // Footer & Trust badges
  'footer':             { label: 'Footer section',            fields: [{ key: 'secondaryText', label: 'Text colour' }] },
  'pay-with-brand':     { label: 'Brand row ("Pay with Snapmint")', fields: [{ key: 'mainText', label: 'Text colour' }] },
  'trust-bar':          { label: 'Trust badges row',          fields: [{ key: 'rbiIcons', label: 'Icon colour' }, { key: 'rbiText', label: 'Text colour' }] },
  'rbi-badge':          { label: 'RBI regulated badge',       fields: [{ key: 'rbiIcons', label: 'Icon colour' }, { key: 'rbiText', label: 'Text colour' }] },
  'trusted-badge':      { label: 'Trusted users badge',       fields: [{ key: 'rbiIcons', label: 'Icon colour' }, { key: 'rbiText', label: 'Text colour' }] },
  'eligibility-footer': { label: 'Eligibility section',       fields: [{ key: 'brandAccent', label: 'Accent colour' }] },

  // Express checkout
  'express-bottom':     { label: 'Express checkout bar',      fields: [{ key: 'bottomBg', label: 'Background' }, { key: 'bottomText', label: 'Text colour' }, { key: 'buttonFill', label: 'Button fill' }, { key: 'buttonText', label: 'Button text' }] },
};

export default function Customization({
  merchantName = "Neeman's",
  brandingMode = 'WHITE_LABEL',
  plans = [],
  priceBands = {},
  configuration = {},
  initialCustomization,
  onBack,
  onContinue,
}) {
  const safeMerchant = String(merchantName || "Neeman's");
  const safeConfig = configuration && typeof configuration === 'object' ? configuration : {};

  const isPlacementEnabled = useCallback((tabId) => {
    if (!safeConfig || Object.keys(safeConfig).length === 0) return true;
    return safeConfig[tabId]?.enabled === true;
  }, [safeConfig]);

  const firstEnabledPlacement = useMemo(() => {
    const found = PLACEMENT_TABS.find((t) => isPlacementEnabled(t.id));
    return found ? found.id : 'pdp';
  }, [isPlacementEnabled]);

  const [activePlacement, setActivePlacement] = useState(firstEnabledPlacement);

  useEffect(() => {
    if (!isPlacementEnabled(activePlacement)) {
      setActivePlacement(firstEnabledPlacement);
    }
  }, [firstEnabledPlacement, activePlacement, isPlacementEnabled]);

  const selectedPlanPreview = useMemo(() => {
    if (priceBands?.choices && typeof priceBands.choices === 'object') {
      const first = Object.values(priceBands.choices)[0];
      if (first) {
        const s = String(first).toLowerCase();
        if (s.includes('box')) return 'box';
        if (s.includes('fixed')) return 'fixed-dp';
        if (s.includes('multi')) return 'multi-plan';
        if (s.includes('pie')) return 'pie';
      }
    }
    return 'pie';
  }, [priceBands]);

  const [isWhiteLabel, setIsWhiteLabel] = useState(brandingMode === 'WHITE_LABEL');
  const [selectedTheme, setSelectedTheme] = useState('orange');
  const [colors, setColors] = useState(() => ({
    ...THEME_PALETTES.orange,
    ...(initialCustomization?.colors || {}),
  }));

  const [brandColors, setBrandColors] = useState(() => initialCustomization?.brandColors || DEFAULT_BRAND_COLORS);
  const [logoColors, setLogoColors] = useState(() => initialCustomization?.logoColors || DEFAULT_LOGO_COLORS);
  const [brandLogo, setBrandLogo] = useState(() => initialCustomization?.brandLogo || null);
  const [titleFont, setTitleFont] = useState(() => initialCustomization?.titleFont || null);
  const [bodyFont, setBodyFont] = useState(() => initialCustomization?.bodyFont || null);
  const [uploadedFonts, setUploadedFonts] = useState(() => initialCustomization?.uploadedFonts || []);
  const [isEditingTypography, setIsEditingTypography] = useState(false);
  const [activePickerField, setActivePickerField] = useState(null);

  const [customText, setCustomText] = useState(() => ({
    ...DEFAULT_CUSTOM_TEXT,
    ...(initialCustomization?.customText || {}),
  }));

  const [cornerRadii, setCornerRadii] = useState(() => ({
    ...DEFAULT_CORNER_RADII,
    ...(initialCustomization?.cornerRadii || {}),
  }));

  const [cashback, setCashback] = useState(() => ({
    ...DEFAULT_CASHBACK,
    ...(initialCustomization?.cashback || {}),
  }));

  const [offers, setOffers] = useState(() => ({
    ...DEFAULT_OFFERS,
    ...(initialCustomization?.offers || {}),
  }));

  const isCouponsEnabledInConfig = useMemo(() => {
    if (
      (safeConfig?.[activePlacement]?.popupType === 'express' ||
        activePlacement === 'checkout' ||
        activePlacement === 'mini-cart') &&
      safeConfig?.[activePlacement]?.capture?.coupons !== undefined
    ) {
      return Boolean(safeConfig[activePlacement].capture.coupons);
    }

    const placements = Object.entries(safeConfig);
    const expressPlacements = placements.filter(
      ([key, cfg]) => cfg?.popupType === 'express' || key === 'checkout' || key === 'mini-cart'
    );
    if (expressPlacements.length > 0) {
      return expressPlacements.some(([, cfg]) => Boolean(cfg?.capture?.coupons));
    }

    if (placements.length > 0) {
      return placements.some(([, cfg]) => Boolean(cfg?.capture?.coupons));
    }

    return Boolean(initialCustomization?.coupons?.enabled ?? true);
  }, [safeConfig, activePlacement, initialCustomization]);

  const [coupons, setCoupons] = useState(() => ({
    ...DEFAULT_COUPONS,
    ...(initialCustomization?.coupons || {}),
    enabled: isCouponsEnabledInConfig,
  }));

  useEffect(() => {
    setCoupons((prev) => ({
      ...prev,
      enabled: isCouponsEnabledInConfig,
    }));
  }, [isCouponsEnabledInConfig]);

  const [previewMode, setPreviewMode] = useState('popup'); // 'popup' | 'coupon-list'
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Select Element inspector state
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedElement, setSelectedElement] = useState(null);
  const [editorTab, setEditorTab] = useState('this'); // 'this' | 'shared'
  const [elementOverrides, setElementOverrides] = useState({}); // { [snpElId]: { [colorKey]: hex } }
  const previewContainerRef = useRef(null);

  // Map color keys → CSS variable names for per-element inline overrides
  const COLOR_KEY_TO_CSS_VAR = useMemo(() => ({
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
  }), []);

  // Apply per-element overrides as inline CSS vars on the actual DOM nodes
  useEffect(() => {
    const container = previewContainerRef.current;
    if (!container) return;
    const allVars = Object.values(COLOR_KEY_TO_CSS_VAR).flat();
    container.querySelectorAll('[data-snp-el]').forEach(node => {
      const elId = node.getAttribute('data-snp-el');
      const overrides = elementOverrides[elId];
      allVars.forEach(v => node.style.removeProperty(v));
      if (overrides) {
        Object.entries(overrides).forEach(([key, val]) => {
          const cssVars = COLOR_KEY_TO_CSS_VAR[key] || [];
          cssVars.forEach(v => node.style.setProperty(v, val));
        });
      }
    });
  }, [elementOverrides, COLOR_KEY_TO_CSS_VAR]);

  // Highlight selected element in preview
  useEffect(() => {
    const container = previewContainerRef.current;
    if (!container) return;
    container.querySelectorAll('[data-snp-el]').forEach(node => {
      if (selectedElement && node.getAttribute('data-snp-el') === selectedElement) {
        node.classList.add('snp-el-selected');
      } else {
        node.classList.remove('snp-el-selected');
      }
    });
  }, [selectedElement]);

  const [hoveredElementLabel, setHoveredElementLabel] = useState(null);

  const [rbi, setRbi] = useState(() => ({
    ...DEFAULT_RBI,
    ...(initialCustomization?.rbi || {}),
  }));

  const fontOptions = useMemo(() => {
    const list = Array.isArray(uploadedFonts) ? [...uploadedFonts] : [];
    if (titleFont && !list.includes(titleFont)) list.push(titleFont);
    if (bodyFont && !list.includes(bodyFont)) list.push(bodyFont);
    return list.filter(Boolean);
  }, [uploadedFonts, titleFont, bodyFont]);

  const hasUploadedFonts = Boolean((uploadedFonts && uploadedFonts.length > 0) || titleFont || bodyFont);

  const paletteInputRef = useRef(null);
  const logoInputRef = useRef(null);

  // Select-element hover/click handlers (event delegation)
  const handlePreviewMouseOver = useCallback((e) => {
    if (!isSelectMode) return;
    const el = e.target.closest('[data-snp-el]');
    const container = previewContainerRef.current;
    if (!container) return;
    container.querySelectorAll('[data-snp-el]').forEach(n => n.classList.remove('snp-el-hover'));
    if (el) {
      el.classList.add('snp-el-hover');
      const elId = el.getAttribute('data-snp-el');
      setHoveredElementLabel(ELEMENT_MAP[elId]?.label || null);
    } else {
      setHoveredElementLabel(null);
    }
  }, [isSelectMode]);

  const handlePreviewMouseLeave = useCallback(() => {
    previewContainerRef.current?.querySelectorAll('.snp-el-hover').forEach(n => n.classList.remove('snp-el-hover'));
    setHoveredElementLabel(null);
  }, []);

  const handlePreviewClick = useCallback((e) => {
    if (!isSelectMode) return;
    e.preventDefault();
    e.stopPropagation();
    const el = e.target.closest('[data-snp-el]');
    if (el) {
      const elId = el.getAttribute('data-snp-el');
      setSelectedElement(elId);
      // Auto expand matching accordion section
      if (['deal-badge', 'offer-banner', 'offer-note'].includes(elId)) {
        setOpenSections(prev => ({ ...prev, offers: true }));
      } else if (['coupon-strip', 'total-card', 'total-row', 'total-label', 'total-price'].includes(elId)) {
        setOpenSections(prev => ({ ...prev, coupons: true, cashback: true }));
      } else if (['corner-ribbon'].includes(elId)) {
        setOpenSections(prev => ({ ...prev, cashback: true }));
      } else if (['footer', 'trust-bar', 'rbi-badge', 'trusted-badge', 'pay-with-brand', 'eligibility-footer'].includes(elId)) {
        setOpenSections(prev => ({ ...prev, rbi: true }));
      } else if (['subtitle', 'amount-highlight', 'rest-subtitle'].includes(elId)) {
        setOpenSections(prev => ({ ...prev, changeText: true }));
      } else if (['express-bottom'].includes(elId)) {
        setOpenSections(prev => ({ ...prev, expressBottom: true, colours: true }));
      } else {
        setOpenSections(prev => ({ ...prev, colours: true }));
      }
    }
  }, [isSelectMode]);

  const [openSections, setOpenSections] = useState({
    assets: true,
    brandColours: true,
    typography: true,
    changeText: true,
    cornerRadius: true,
    theme: true,
    colours: true,
    expressBottom: true,
    moreColours: false,
    cashback: true,
    offers: true,
    coupons: true,
    rbi: true,
  });

  const [lastStateBeforeReset, setLastStateBeforeReset] = useState(null);

  const toggleSection = useCallback((sec) => {
    setOpenSections((prev) => ({ ...prev, [sec]: !prev[sec] }));
  }, []);

  const handleColorChange = useCallback((key, value) => {
    setColors((prev) => ({ ...prev, [key]: value }));
  }, []);

  // Handler: change color in element editor (This element vs Shared style)
  const handleElementColorChange = useCallback((colorKey, value) => {
    if (['dealTagFill', 'dealTagText', 'dealTagIcon', 'offerNoteColour'].includes(colorKey)) {
      setOffers(prev => ({ ...prev, [colorKey]: value }));
    }
    if (['rbiIcons', 'rbiText'].includes(colorKey)) {
      setRbi(prev => ({ ...prev, [colorKey === 'rbiIcons' ? 'iconsColour' : 'textColour']: value }));
    }
    if (['ribbonFill', 'ribbonText'].includes(colorKey)) {
      setCashback(prev => ({ ...prev, [colorKey]: value }));
    }
    if (['couponStripFill', 'couponStripText', 'couponIconColour'].includes(colorKey)) {
      setCoupons(prev => ({ ...prev, [colorKey]: value }));
    }
    if (editorTab === 'shared') {
      setColors((prev) => ({ ...prev, [colorKey]: value }));
    } else {
      setElementOverrides(prev => ({
        ...prev,
        [selectedElement]: { ...(prev[selectedElement] || {}), [colorKey]: value },
      }));
    }
  }, [editorTab, selectedElement]);

  const handleApplyPaletteColor = useCallback((fieldKey, selectedHex) => {
    const upper = selectedHex.toUpperCase();
    if (fieldKey === 'brandAccent') {
      setColors((prev) => ({
        ...prev,
        brandAccent: upper,
        payNowTagFill: upper,
        buttonFill: upper,
        selectedOutline: upper,
      }));
    } else {
      setColors((prev) => ({ ...prev, [fieldKey]: upper }));
    }
  }, []);

  const handleSelectTheme = useCallback((themeId) => {
    setSelectedTheme(themeId);
    if (THEME_PALETTES[themeId]) {
      setColors({ ...THEME_PALETTES[themeId] });
    }
  }, []);

  const handleResetColors = useCallback(() => {
    setColors({ ...(THEME_PALETTES[selectedTheme] || THEME_PALETTES.orange) });
    toast.success('Reset colours');
  }, [selectedTheme]);

  const handleResetText = useCallback(() => {
    setCustomText({ ...DEFAULT_CUSTOM_TEXT });
    toast.info('Text reset to default');
  }, []);

  const getCurrentSnapshot = useCallback(() => ({
    selectedTheme,
    colors: { ...colors },
    brandColors: [...brandColors],
    logoColors: [...logoColors],
    brandLogo,
    titleFont,
    bodyFont,
    uploadedFonts: [...uploadedFonts],
    customText: { ...customText },
    cornerRadii: { ...cornerRadii },
    cashback: { ...cashback },
    offers: { ...offers },
    coupons: { ...coupons },
    rbi: { ...rbi },
  }), [selectedTheme, colors, brandColors, logoColors, brandLogo, titleFont, bodyFont, uploadedFonts, customText, cornerRadii, cashback, offers, coupons, rbi]);

  const applySnapshot = useCallback((s) => {
    setSelectedTheme(s.selectedTheme || 'orange');
    setColors(s.colors || { ...THEME_PALETTES.orange });
    setBrandColors(s.brandColors || [...DEFAULT_BRAND_COLORS]);
    setLogoColors(s.logoColors || [...DEFAULT_LOGO_COLORS]);
    setBrandLogo(s.brandLogo ?? null);
    setTitleFont(s.titleFont ?? null);
    setBodyFont(s.bodyFont ?? null);
    setUploadedFonts(s.uploadedFonts || []);
    setCustomText(s.customText || { ...DEFAULT_CUSTOM_TEXT });
    setCornerRadii(s.cornerRadii || { ...DEFAULT_CORNER_RADII });
    setCashback(s.cashback || { ...DEFAULT_CASHBACK });
    setOffers(s.offers || { ...DEFAULT_OFFERS });
    setCoupons(s.coupons || { ...DEFAULT_COUPONS });
    setRbi(s.rbi || { ...DEFAULT_RBI });
  }, []);

  const handleResetEverything = useCallback(() => {
    setLastStateBeforeReset(getCurrentSnapshot());
    applySnapshot({
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
    });
    setActivePickerField(null);
    toast.success('Reset all customization settings');
  }, [getCurrentSnapshot, applySnapshot]);

  const handleUndoReset = useCallback(() => {
    if (!lastStateBeforeReset) return;
    applySnapshot(lastStateBeforeReset);
    setLastStateBeforeReset(null);
    toast.info('Undo reset applied');
  }, [lastStateBeforeReset, applySnapshot]);

  const handleUploadPalette = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const detected = file.type.startsWith('image/')
        ? await extractColorsFromImage(file, DEFAULT_LOGO_COLORS)
        : await extractColorsFromText(file, DEFAULT_BRAND_COLORS);

      if (detected.length > 0) {
        setBrandColors(detected);
        handleApplyPaletteColor('brandAccent', detected[0]);
      } else {
        toast.error('Could not detect any colours from the file');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to extract colours from file');
    }
    e.target.value = '';
  }, [handleApplyPaletteColor]);

  const handleAddBrandColor = useCallback(() => {
    setBrandColors((prev) => [...prev, '#FFFFFF']);
  }, []);

  const handleRemoveBrandColor = useCallback((indexToRemove) => {
    setBrandColors((prev) => prev.filter((_, i) => i !== indexToRemove));
  }, []);

  const handleUpdateBrandColor = useCallback((index, newHex) => {
    setBrandColors((prev) => prev.map((c, i) => (i === index ? newHex.toUpperCase() : c)));
  }, []);

  const handleSelectLogoColor = useCallback((color) => {
    setBrandColors((prev) => (!prev.includes(color) ? [...prev, color] : prev));
    handleApplyPaletteColor('brandAccent', color);
  }, [handleApplyPaletteColor]);

  const handleUploadLogo = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      setBrandLogo(reader.result);
      toast.success('Brand logo uploaded');
      try {
        const detected = await extractColorsFromImage(file, DEFAULT_LOGO_COLORS);
        if (detected.length > 0) {
          setLogoColors(detected);
        }
      } catch (err) {
        console.error(err);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }, []);

  const handleRemoveLogo = useCallback((e) => {
    e.stopPropagation();
    setBrandLogo(null);
    setLogoColors([]);
  }, []);

  const handleUploadFont = useCallback((type, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFonts((prev) => {
      const list = Array.isArray(prev) ? prev : [];
      return list.includes(file.name) ? list : [...list, file.name];
    });
    if (type === 'title') {
      setTitleFont(file.name);
      toast.success(`Uploaded heading font: ${file.name}`);
    } else {
      setBodyFont(file.name);
      toast.success(`Uploaded body font: ${file.name}`);
    }
    e.target.value = '';
  }, []);

  const handleSave = () => {
    toast.success('Pop-up appearance saved');
    if (onContinue) {
      onContinue({
        theme: selectedTheme,
        colors,
        isWhiteLabel,
        activePlacement,
        selectedPlanPreview,
        brandColors,
        brandLogo,
        logoColors,
        titleFont,
        bodyFont,
        customText,
        cornerRadii,
        cashback,
        offers,
        coupons: { ...coupons, enabled: isCouponsEnabledInConfig },
        rbi,
      });
    }
  };

  const currentPopupType = safeConfig[activePlacement]?.popupType || (activePlacement === 'cart' ? 'eligibility-payment' : (activePlacement === 'mini-cart' || activePlacement === 'checkout') ? 'express' : 'info');
  const isExpressPlacement = currentPopupType === 'express';

  const livePreviewStyles = useMemo(() => ({
    '--snp-color-primary': colors.brandAccent,
    '--snp-color-pay-now': colors.payNowTagFill,
    '--snp-color-pay-now-text': colors.payNowTagText,
    '--snp-color-text-primary': colors.mainText,
    '--snp-color-text-secondary': colors.secondaryText,
    '--snp-color-text-muted': colors.secondaryText,
    '--snp-color-text-feature': colors.uspText,
    '--snp-color-modal-bg': colors.popupBg,
    '--snp-color-inner-bg': colors.planBg,
    '--snp-color-card-bg': colors.paymentCards,
    '--snp-color-card-active': colors.selectedCard,
    '--snp-color-card-outline': colors.selectedOutline,
    '--snp-color-primary-bg': colors.selectedCard,
    '--snp-color-pill-bg': colors.paymentCards,
    '--snp-color-extra-off-bg': colors.brandAccent,
    '--snp-color-extra-off-text': colors.payNowTagText,
    '--snp-color-usp-text': colors.uspText,
    '--snp-color-offer-note': colors.secondaryText,
    '--snp-color-footer-bg': colors.bottomBg || colors.planBg,
    '--snp-color-bottom-bg': colors.bottomBg,
    '--snp-color-bottom-text': colors.bottomText,
    '--snp-color-field-bg': colors.fieldBg,
    '--snp-color-entered-text': colors.enteredText || colors.bottomText || '#151E29',
    '--snp-color-field-placeholder': colors.fieldPlaceholder,
    '--snp-color-field-border': colors.fieldBorder,
    '--snp-color-button-fill': colors.buttonFill,
    '--snp-color-button-text': colors.buttonText,
    '--snp-radius-modal': (cornerRadii.popup || '16px').replace(/\s+/g, ''),
    '--snp-radius-container': (cornerRadii.container || '16px').replace(/\s+/g, ''),
    '--snp-radius-button': (cornerRadii.button || '6px').replace(/\s+/g, ''),
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
  }), [colors, cornerRadii, cashback, offers, rbi, coupons]);

  const ActivePopup = POPUP_MAP[selectedPlanPreview] || PiePopup;

  return (
    <div className="w-full min-h-[calc(100vh-140px)] flex flex-col bg-gray-50 rounded-md overflow-hidden border border-gray-200">
      {/* Placement Tab Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5 bg-gray-100/80 p-1 rounded-md">
          {PLACEMENT_TABS.map((tab) => {
            const isEnabled = isPlacementEnabled(tab.id);
            const isActive = activePlacement === tab.id;

            if (!isEnabled) {
              return (
                <button
                  key={tab.id}
                  type="button"
                  disabled
                  className="px-3.5 py-1.5 rounded-md text-xs font-semibold text-gray-300 cursor-not-allowed select-none bg-transparent"
                >
                  {tab.label}
                </button>
              );
            }

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActivePlacement(tab.id)}
                className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${isActive ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Workspace: Preview Area + Sidebar */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Preview Container */}
        <div className="flex-1 bg-gray-100 p-6 sm:p-10 flex flex-col items-center justify-center relative overflow-y-auto min-h-[580px]">
          <div className="absolute top-4 right-4 z-10">
            <button
              type="button"
              onClick={() => { setIsSelectMode(m => !m); if (isSelectMode) setSelectedElement(null); }}
              className={`backdrop-blur-sm border px-3 py-1.5 rounded-md text-xs font-medium shadow-xs flex items-center gap-1.5 cursor-pointer transition-all ${
                isSelectMode
                  ? 'bg-[#513487] text-white border-[#513487] hover:bg-[#432b71]'
                  : 'bg-white/90 text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              <span>{isSelectMode ? 'Done selecting' : 'Select element'}</span>
            </button>
          </div>



          <div
            ref={previewContainerRef}
            className={`w-full max-w-[420px] transition-all duration-300 drop-shadow-xl ${isSelectMode ? 'snp-select-mode' : ''}`}
            style={livePreviewStyles}
            onMouseOver={handlePreviewMouseOver}
            onMouseLeave={handlePreviewMouseLeave}
            onClickCapture={isSelectMode ? handlePreviewClick : undefined}
          >
            {previewMode === 'coupon-list' ? (
              <CouponListPopup
                coupons={coupons}
                initialOrderValue={15000}
                appliedCoupon={appliedCoupon}
                onApply={(coupon) => {
                  setAppliedCoupon(coupon);
                  if (coupon) setPreviewMode('popup');
                }}
                onClose={() => setPreviewMode('popup')}
              />
            ) : (
              <ActivePopup
                merchantName={safeMerchant}
                orderValue={15000}
                downPaymentPercent={selectedPlanPreview === 'pie' ? 33 : 25}
                tenure={3}
                fixedDp={1}
                eligibleTenures={[3, 6]}
                popupType={currentPopupType}
                showExpress={isExpressPlacement}
                customText={customText}
                cashback={cashback}
                offers={offers}
                coupons={{ ...coupons, enabled: isCouponsEnabledInConfig }}
                appliedCoupon={appliedCoupon}
                onOpenCoupons={() => {
                  if (!isSelectMode) setPreviewMode('coupon-list');
                }}
                rbi={rbi}
                onClose={() => { }}
              />
            )}
          </div>
        </div>

        {/* Sidebar Settings Panel */}
        <div className="w-full lg:w-[380px] xl:w-[390px] bg-white border-l border-gray-200 flex flex-col justify-between max-h-[calc(100vh-210px)] overflow-y-auto">
          {/* Header */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center font-bold text-xs border border-gray-200">
                  {safeMerchant.charAt(0) || 'C'}
                </div>
                <span className="text-xs font-bold text-gray-900 truncate max-w-[170px]">{safeMerchant}</span>
              </div>

              <button
                type="button"
                onClick={() => setIsWhiteLabel((prev) => !prev)}
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-md cursor-pointer transition-colors ${isWhiteLabel ? 'bg-gray-100 text-gray-800 font-bold' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
              >
                White label
              </button>
            </div>

            <h2 className="text-base font-bold text-gray-900 tracking-tight">Pop-up appearance</h2>

            <div className="flex items-center justify-between mt-2.5">
              <button
                type="button"
                onClick={handleResetEverything}
                className="text-xs font-semibold px-3 py-1.5 rounded-md bg-white border border-[#c5b8e4] text-[#513487] hover:bg-[#f6f2fb] cursor-pointer transition-colors shadow-xs"
              >
                Reset everything
              </button>
              {lastStateBeforeReset && (
                <button
                  type="button"
                  onClick={handleUndoReset}
                  className="text-xs text-gray-500 hover:text-gray-900 cursor-pointer transition-colors"
                >
                  Undo reset
                </button>
              )}
            </div>
          </div>

          {/* Element Inspector Panel */}
          {selectedElement && ELEMENT_MAP[selectedElement] && (() => {
            const elDef = ELEMENT_MAP[selectedElement];
            const overrides = elementOverrides[selectedElement] || {};
            return (
            <div className="p-4 border-b border-[#ebdff7] bg-[#fcfaff]">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-gray-900">{elDef.label}</h3>
                <button
                  type="button"
                  onClick={() => { setSelectedElement(null); setActivePickerField(null); }}
                  className="text-xs text-gray-500 hover:text-[#513487] font-medium cursor-pointer"
                >
                  Done
                </button>
              </div>
              <div className="flex items-center p-0.5 bg-[#f0ebf7] rounded-lg border border-[#e5dced] mb-2">
                <button
                  type="button"
                  onClick={() => setEditorTab('this')}
                  className={`flex-1 text-[11px] font-semibold py-1 rounded-md cursor-pointer transition-all ${
                    editorTab === 'this'
                      ? 'bg-white text-[#513487] shadow-xs'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  This element
                </button>
                <button
                  type="button"
                  onClick={() => setEditorTab('shared')}
                  className={`flex-1 text-[11px] font-semibold py-1 rounded-md cursor-pointer transition-all ${
                    editorTab === 'shared'
                      ? 'bg-white text-[#513487] shadow-xs'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  Shared style
                </button>
              </div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] text-gray-500 italic">
                  {editorTab === 'this' ? 'Only the selected element will change.' : 'Changes will apply to all elements sharing this style.'}
                </p>
                {editorTab === 'this' && Object.keys(overrides).length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setElementOverrides(prev => {
                        const next = { ...prev };
                        delete next[selectedElement];
                        return next;
                      });
                    }}
                    className="text-[10px] text-[#513487] hover:text-red-600 font-semibold cursor-pointer underline shrink-0 ml-2"
                  >
                    Reset override
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {elDef.fields.map(({ key, label: fLabel }) => {
                  const getBaseColor = (k) => {
                    if (['dealTagFill', 'dealTagText', 'dealTagIcon', 'offerNoteColour'].includes(k)) return offers[k] || offers.dealTagFill;
                    if (k === 'rbiIcons') return rbi?.iconsColour || '#FF6F00';
                    if (k === 'rbiText') return rbi?.textColour || '#64768B';
                    if (k === 'ribbonFill') return cashback?.ribbonFill || '#D1F4FC';
                    if (k === 'ribbonText') return cashback?.ribbonText || '#151E29';
                    if (k === 'couponStripFill') return coupons?.couponStripFill || '#FDF2F7';
                    if (k === 'couponStripText') return coupons?.couponStripText || '#151E29';
                    if (k === 'couponIconColour') return coupons?.couponIconColour || '#BE185D';
                    return colors[k] || '#000000';
                  };
                  const resolvedColor = editorTab === 'this' ? (overrides[key] || getBaseColor(key)) : getBaseColor(key);
                  return (
                  <div key={key} className="relative">
                    <button
                      type="button"
                      onClick={() => setActivePickerField(activePickerField === `el-${key}` ? null : `el-${key}`)}
                      className={`flex items-center gap-1.5 border rounded-full px-2.5 py-1 bg-white text-[10.5px] font-medium cursor-pointer transition-all ${
                        activePickerField === `el-${key}` ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      <div className="w-4 h-4 rounded-full border border-black/10 shrink-0" style={{ backgroundColor: resolvedColor || '#000' }} />
                      <span className="text-gray-700">{fLabel}</span>
                    </button>
                    {activePickerField === `el-${key}` && (
                      <div className="absolute left-0 top-full mt-1 z-50 w-48 bg-white rounded-lg shadow-xl border border-gray-200 p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold text-gray-600 uppercase">{fLabel}</span>
                          <button type="button" onClick={() => setActivePickerField(null)} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X className="w-3 h-3" /></button>
                        </div>
                        <input type="color" value={resolvedColor || '#000000'} onChange={(e) => handleElementColorChange(key, e.target.value.toUpperCase())} className="w-full h-14 rounded cursor-pointer border border-gray-200 p-0.5 bg-white mb-2" />
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-gray-400 font-medium">HEX</span>
                          <input type="text" value={resolvedColor || ''} maxLength={7} onChange={(e) => handleElementColorChange(key, e.target.value.toUpperCase())} className="flex-1 px-2 py-1 border border-gray-200 rounded text-[10px] font-mono font-semibold text-gray-800 uppercase focus:outline-none focus:border-gray-400" />
                        </div>
                      </div>
                    )}
                  </div>
                  );
                })}
              </div>
            </div>
            );
          })()}

          {/* Collapsible Customization Sections */}
          <div className="divide-y divide-gray-100 flex-1">
            {/* 1. Merchant's Assets */}
            <AssetsSection
              merchantName={safeMerchant}
              isOpen={openSections.assets}
              onToggle={() => toggleSection('assets')}
              brandLogo={brandLogo}
              logoInputRef={logoInputRef}
              onUploadLogo={handleUploadLogo}
              onRemoveLogo={handleRemoveLogo}
              brandColoursOpen={openSections.brandColours}
              onToggleBrandColours={() => toggleSection('brandColours')}
              brandColors={brandColors}
              onAddBrandColor={handleAddBrandColor}
              onUpdateBrandColor={handleUpdateBrandColor}
              onRemoveBrandColor={handleRemoveBrandColor}
              paletteInputRef={paletteInputRef}
              onUploadPalette={handleUploadPalette}
              logoColors={logoColors}
              onSelectLogoColor={handleSelectLogoColor}
              onApplyPaletteColor={handleApplyPaletteColor}
              typographyOpen={openSections.typography}
              onToggleTypography={() => toggleSection('typography')}
              hasUploadedFonts={hasUploadedFonts}
              titleFont={titleFont}
              bodyFont={bodyFont}
              fontOptions={fontOptions}
              isEditingTypography={isEditingTypography}
              setIsEditingTypography={setIsEditingTypography}
              onUploadFont={handleUploadFont}
              setTitleFont={setTitleFont}
              setBodyFont={setBodyFont}
            />

            {/* 2. Theme */}
            <ThemeSection
              isOpen={openSections.theme}
              onToggle={() => toggleSection('theme')}
              selectedTheme={selectedTheme}
              onSelectTheme={handleSelectTheme}
            />

            {/* 3. Colours */}
            <ColoursSection
              coloursOpen={openSections.colours}
              onToggleColours={() => toggleSection('colours')}
              expressBottomOpen={openSections.expressBottom}
              onToggleExpressBottom={() => toggleSection('expressBottom')}
              moreColoursOpen={openSections.moreColours}
              onToggleMoreColours={() => toggleSection('moreColours')}
              colors={colors}
              onColorChange={handleColorChange}
              onApplyPaletteColor={handleApplyPaletteColor}
              onResetColors={handleResetColors}
              activePickerField={activePickerField}
              setActivePickerField={setActivePickerField}
              brandColors={brandColors}
              logoColors={logoColors}
              isExpressPlacement={isExpressPlacement}
            />

            {/* 4. Text */}
            <TextSection
              isOpen={openSections.changeText}
              onToggle={() => toggleSection('changeText')}
              customText={customText}
              setCustomText={setCustomText}
              onResetText={handleResetText}
            />

            {/* 5. Corner Radius */}
            <CornerRadiusSection
              isOpen={openSections.cornerRadius}
              onToggle={() => toggleSection('cornerRadius')}
              cornerRadii={cornerRadii}
              setCornerRadii={setCornerRadii}
            />

            {/* 6. Cashback */}
            <CashbackSection
              isOpen={openSections.cashback}
              onToggle={() => toggleSection('cashback')}
              cashback={cashback}
              setCashback={setCashback}
            />

            {/* 7. Offers */}
            <OffersSection
              isOpen={openSections.offers}
              onToggle={() => toggleSection('offers')}
              offers={offers}
              setOffers={setOffers}
            />

            {/* 8. Coupons */}
            <CouponsSection
              isOpen={openSections.coupons}
              onToggle={() => toggleSection('coupons')}
              coupons={coupons}
              setCoupons={setCoupons}
              onPreviewList={() => setPreviewMode('coupon-list')}
            />

            {/* 9. RBI & Trusted Users */}
            <RbiSection
              isOpen={openSections.rbi}
              onToggle={() => toggleSection('rbi')}
              rbi={rbi}
              setRbi={setRbi}
            />
          </div>

          {/* Sidebar Save Button */}
          <div className="p-4 border-t border-gray-200 bg-white space-y-1.5 sticky bottom-0">
            <div className="flex justify-end">
              <Button
                type="button"
                onClick={handleSave}
                className="h-8 px-4 bg-[#151E29] hover:bg-black text-white text-xs font-medium rounded-md cursor-pointer shadow-xs"
              >
                Save appearance
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div className="bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="rounded-md h-9 px-4 border-gray-200 text-gray-700 font-semibold text-xs cursor-pointer flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Configure</span>
        </Button>

        <Button
          type="button"
          onClick={handleSave}
          className="rounded-md h-9 px-5 bg-black hover:bg-gray-800 text-white font-bold text-xs cursor-pointer flex items-center gap-1.5"
        >
          <span>Continue to Coupons</span>
          <ArrowRight className="w-4 h-4 text-white" />
        </Button>
      </div>
    </div>
  );
}

import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { PiePopup, MultiLayerPopup, BoxPopup, FixedDepositPopup } from './popup/PopupModal';
import CouponListPopup from './popup/CouponListPopup';
import './popup/PopupModal.css';
import CustomizationHeader, { PLACEMENT_TABS } from './customization/CustomizationHeader';
import ElementInspector from './customization/ElementInspector';
import AssetsSection from './customization/AssetsSection';
import ThemeSection from './customization/ThemeSection';
import ColoursSection from './customization/ColoursSection';
import TextSection from './customization/TextSection';
import CornerRadiusSection from './customization/CornerRadiusSection';
import CashbackSection from './customization/CashbackSection';
import OffersSection from './customization/OffersSection';
import CouponsSection from './customization/CouponsSection';
import RbiSection from './customization/RbiSection';
import { extractColorsFromImage, extractColorsFromText } from './shared/helpers.jsx';
import {
  buildLivePreviewStyles,
  THEME_PALETTES,
  DEFAULT_BRAND_COLORS,
  DEFAULT_LOGO_COLORS,
  DEFAULT_CUSTOM_TEXT,
  DEFAULT_CORNER_RADII,
  DEFAULT_CASHBACK,
  DEFAULT_OFFERS,
  DEFAULT_COUPONS,
  DEFAULT_RBI,
  DEFAULT_SNAPSHOT,
  ELEMENT_MAP,
  COLOR_KEY_TO_CSS_VAR,
} from './shared/constants.jsx';

const POPUP_MAP = {
  'multi-plan': MultiLayerPopup,
  'pie': PiePopup,
  'box': BoxPopup,
  'fixed-dp': FixedDepositPopup,
};

export const BRANDING_OPTIONS = [
  { id: 'snapmint', label: 'Snapmint' },
  { id: 'co-branded', label: 'Co-branded' },
  { id: 'white-label', label: 'White label' },
];

export const normalizeBrandingMode = (mode) => {
  if (!mode) return 'snapmint';
  const str = String(mode).toLowerCase().replace(/_/g, '-');
  if (str.includes('white')) return 'white-label';
  if (str.includes('co')) return 'co-branded';
  if (str.includes('snap')) return 'snapmint';
  return str;
};

export const formatBrandingLabel = (mode) => {
  const norm = normalizeBrandingMode(mode);
  const match = BRANDING_OPTIONS.find((b) => b.id === norm);
  return match ? match.label : (mode ? (mode.charAt(0).toUpperCase() + mode.slice(1)) : 'Snapmint');
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
  const safeConfig = useMemo(() => {
    const raw = configuration && typeof configuration === 'object' ? configuration : {};
    return {
      pdp: { enabled: true, ...(raw.pdp || {}) },
      'mini-cart': { enabled: true, ...(raw['mini-cart'] || {}) },
      cart: { enabled: true, ...(raw.cart || {}) },
      checkout: { enabled: true, ...(raw.checkout || {}) },
    };
  }, [configuration]);

  const isPlacementEnabled = useCallback((tabId) => {
    return safeConfig[tabId]?.enabled !== false;
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

  // Derive applicable styles based on priceBands configuration or merchant plans
  const applicableStyles = useMemo(() => {
    const styleSet = new Set();

    // 1. From priceBands.bands groups
    if (Array.isArray(priceBands?.bands)) {
      priceBands.bands.forEach((b) => {
        (b.groups || []).forEach((g) => {
          (g.allowed || []).forEach((s) => {
            if (s) styleSet.add(s);
          });
        });
      });
    }

    // 2. From priceBands.choices if any
    if (priceBands?.choices && typeof priceBands.choices === 'object') {
      Object.values(priceBands.choices).forEach((s) => {
        if (s) {
          const str = String(s).toLowerCase();
          if (str.includes('box')) styleSet.add('box');
          else if (str.includes('fixed')) styleSet.add('fixed-dp');
          else if (str.includes('pie')) styleSet.add('pie');
        }
      });
    }

    // 3. From plans if styleSet is still empty
    if (styleSet.size === 0 && Array.isArray(plans) && plans.length > 0) {
      plans.forEach((p) => {
        if (p.dpType === 'fixed') {
          styleSet.add('fixed-dp');
        } else {
          const t = Number(p.tenure);
          if ([2, 3, 4, 6].includes(t)) {
            styleSet.add('pie');
            styleSet.add('box');
          } else if ([12, 18, 24].includes(t)) {
            styleSet.add('box');
          } else {
            styleSet.add('pie');
            styleSet.add('box');
          }
        }
      });
    }

    // Fallback only if no styles were derived
    if (styleSet.size === 0) {
      styleSet.add('pie');
      styleSet.add('box');
    }

    const STYLE_LABELS = {
      pie: 'Pie',
      box: 'Box',
      'fixed-dp': 'Fixed DP',
    };

    return Array.from(styleSet)
      .filter((s) => s !== 'multi-plan')
      .map((id) => ({
        id,
        label: STYLE_LABELS[id] || (id.charAt(0).toUpperCase() + id.slice(1)),
      }));
  }, [priceBands, plans]);

  const [activePopupStyle, setActivePopupStyle] = useState(() => {
    if (priceBands?.choices && typeof priceBands.choices === 'object') {
      const first = Object.values(priceBands.choices)[0];
      if (first) {
        const s = String(first).toLowerCase();
        if (s.includes('pie')) return 'pie';
        if (s.includes('box')) return 'box';
        if (s.includes('fixed')) return 'fixed-dp';
      }
    }
    return 'pie';
  });

  // Keep activePopupStyle synchronized with priceBands.choices
  useEffect(() => {
    if (priceBands?.choices && typeof priceBands.choices === 'object') {
      const first = Object.values(priceBands.choices)[0];
      if (first) {
        const s = String(first).toLowerCase();
        const matched = s.includes('pie') ? 'pie' : s.includes('box') ? 'box' : s.includes('fixed') ? 'fixed-dp' : null;
        if (matched) setActivePopupStyle(matched);
      }
    }
  }, [priceBands?.choices]);

  const hasMultiPlan = useMemo(() => {
    return (
      (priceBands?.bands || []).some((b) => (b.groups || []).some((g) => (g.plans || []).length > 1)) ||
      (Array.isArray(plans) && plans.length > 1)
    );
  }, [priceBands, plans]);

  const availableFutureRepayments = useMemo(() => {
    const tenureSet = new Set();

    // 1. From priceBands.bands
    if (Array.isArray(priceBands?.bands)) {
      priceBands.bands.forEach((b) => {
        (b.groups || []).forEach((g) => {
          (g.plans || []).forEach((p) => {
            if (p.tenure) tenureSet.add(Number(p.tenure));
          });
        });
      });
    }

    // 2. From plans prop
    if (tenureSet.size === 0 && Array.isArray(plans)) {
      plans.forEach((p) => {
        if (p.tenure) tenureSet.add(Number(p.tenure));
      });
    }

    const baseTenures = tenureSet.size > 0 ? Array.from(tenureSet) : [3];
    return baseTenures
      .sort((a, b) => a - b)
      .map((t) => {
        const futureMonths = Math.max(1, t - 1);
        return {
          value: String(futureMonths),
          label: `${futureMonths} ${futureMonths === 1 ? 'month' : 'months'}`,
          tenure: t,
        };
      });
  }, [priceBands, plans]);

  const [selectedPlanPreviewMode, setSelectedPlanPreviewMode] = useState('single');
  const [selectedFutureRepayments, setSelectedFutureRepayments] = useState(() => {
    return availableFutureRepayments[0]?.value || '2';
  });

  // Keep future repayments in sync if availableFutureRepayments updates
  useEffect(() => {
    if (
      availableFutureRepayments.length > 0 &&
      !availableFutureRepayments.some((opt) => opt.value === selectedFutureRepayments)
    ) {
      setSelectedFutureRepayments(availableFutureRepayments[0].value);
    }
  }, [availableFutureRepayments, selectedFutureRepayments]);

  // Synchronize activePopupStyle if the available styles change
  useEffect(() => {
    if (applicableStyles.length > 0 && !applicableStyles.some((s) => s.id === activePopupStyle)) {
      setActivePopupStyle(applicableStyles[0].id);
    }
  }, [applicableStyles, activePopupStyle]);

  const selectedPlanPreview = useMemo(() => {
    if (selectedPlanPreviewMode === 'multi') return 'multi-plan';
    return activePopupStyle;
  }, [selectedPlanPreviewMode, activePopupStyle]);

  const currentBrandingMode = normalizeBrandingMode(brandingMode);
  const isWhiteLabel = currentBrandingMode === 'white-label';
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
  const [fontFamilyMap, setFontFamilyMap] = useState({});
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

  const [expressTab, setExpressTab] = useState('size');
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
    applySnapshot(DEFAULT_SNAPSHOT);
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

  const handleUploadFont = useCallback(async (type, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const familyName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');
    const fontUrl = URL.createObjectURL(file);

    try {
      const fontFace = new FontFace(familyName, `url("${fontUrl}")`);
      const loaded = await fontFace.load();
      document.fonts.add(loaded);
    } catch (err) {
      console.warn('FontFace load error:', err);
    }

    let styleTag = document.getElementById(`snp-font-${familyName}`);
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = `snp-font-${familyName}`;
      styleTag.textContent = `@font-face { font-family: "${familyName}"; src: url("${fontUrl}"); font-display: swap; }`;
      document.head.appendChild(styleTag);
    }

    setFontFamilyMap((prev) => ({ ...prev, [file.name]: familyName }));
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

  useEffect(() => {
    [titleFont, bodyFont].filter(Boolean).forEach((f) => {
      const clean = f.split(/[-_.]/)[0];
      const common = ['Roboto', 'Inter', 'Poppins', 'Montserrat', 'Lato', 'OpenSans', 'Open Sans', 'Oswald', 'Raleway', 'Nunito', 'Ubuntu', 'Rubik'];
      const matched = common.find((g) => clean.toLowerCase() === g.toLowerCase().replace(/\s+/g, ''));
      if (matched) {
        const id = `snp-gf-${matched}`;
        if (!document.getElementById(id)) {
          const link = document.createElement('link');
          link.id = id;
          link.rel = 'stylesheet';
          link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(matched)}:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,700&display=swap`;
          document.head.appendChild(link);
        }
      }
    });
  }, [titleFont, bodyFont]);

  const activeTitleFontFamily = useMemo(() => {
    if (!titleFont) return null;
    if (fontFamilyMap[titleFont]) return fontFamilyMap[titleFont];
    const clean = titleFont.split(/[-_.]/)[0];
    const common = ['Roboto', 'Inter', 'Poppins', 'Montserrat', 'Lato', 'OpenSans', 'Open Sans', 'Oswald', 'Raleway', 'Nunito', 'Ubuntu', 'Rubik'];
    const matched = common.find((g) => clean.toLowerCase() === g.toLowerCase().replace(/\s+/g, ''));
    if (matched) return matched;
    return titleFont.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');
  }, [titleFont, fontFamilyMap]);

  const activeBodyFontFamily = useMemo(() => {
    if (!bodyFont) return null;
    if (fontFamilyMap[bodyFont]) return fontFamilyMap[bodyFont];
    const clean = bodyFont.split(/[-_.]/)[0];
    const common = ['Roboto', 'Inter', 'Poppins', 'Montserrat', 'Lato', 'OpenSans', 'Open Sans', 'Oswald', 'Raleway', 'Nunito', 'Ubuntu', 'Rubik'];
    const matched = common.find((g) => clean.toLowerCase() === g.toLowerCase().replace(/\s+/g, ''));
    if (matched) return matched;
    return bodyFont.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');
  }, [bodyFont, fontFamilyMap]);

  const handleSave = () => {
    if (onContinue) {
      onContinue({
        theme: selectedTheme,
        colors,
        isWhiteLabel,
        brandingMode: currentBrandingMode,
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
    } else {
      toast.success('Pop-up appearance saved');
    }
  };

  const currentPopupType = safeConfig[activePlacement]?.popupType || (activePlacement === 'cart' ? 'eligibility-payment' : (activePlacement === 'mini-cart' || activePlacement === 'checkout') ? 'express' : 'info');
  const isExpressPlacement = currentPopupType === 'express';

  const livePreviewStyles = useMemo(() => buildLivePreviewStyles({
    colors,
    cornerRadii,
    cashback,
    offers,
    rbi,
    coupons,
    titleFont: activeTitleFontFamily,
    bodyFont: activeBodyFontFamily,
  }), [colors, cornerRadii, cashback, offers, rbi, coupons, activeTitleFontFamily, activeBodyFontFamily]);

  const popupTenure = selectedPlanPreview === 'box'
    ? Number(selectedFutureRepayments)
    : Number(selectedFutureRepayments) + 1;

  const ActivePopup = POPUP_MAP[selectedPlanPreview] || PiePopup;

  return (
    <div className="w-full min-h-[calc(100vh-140px)] flex flex-col bg-gray-50 rounded-md overflow-hidden border border-gray-200">
      {/* Header Bar: Placement Tabs & Plan Preview Controls */}
      <CustomizationHeader
        activePlacement={activePlacement}
        setActivePlacement={setActivePlacement}
        isPlacementEnabled={isPlacementEnabled}
        selectedPlanPreviewMode={selectedPlanPreviewMode}
        setSelectedPlanPreviewMode={setSelectedPlanPreviewMode}
        hasMultiPlan={hasMultiPlan}
        selectedFutureRepayments={selectedFutureRepayments}
        setSelectedFutureRepayments={setSelectedFutureRepayments}
        availableFutureRepayments={availableFutureRepayments}
        activePopupStyle={activePopupStyle}
        setActivePopupStyle={setActivePopupStyle}
        applicableStyles={applicableStyles}
      />

      {/* Main Workspace: Preview Area + Sidebar */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Preview Container */}
        <div className="flex-1 bg-gray-100 p-6 sm:p-10 flex flex-col items-center justify-center relative overflow-y-auto min-h-[580px]">
          <div className="absolute top-4 right-4 z-10">
            <button
              type="button"
              onClick={() => { setIsSelectMode(m => !m); if (isSelectMode) setSelectedElement(null); }}
              className={`backdrop-blur-sm border px-3 py-1.5 rounded-md text-xs font-medium shadow-xs flex items-center gap-1.5 cursor-pointer transition-all ${isSelectMode
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
                downPaymentPercent={selectedPlanPreview === 'pie' ? (100 / (Number(selectedFutureRepayments) + 1)) : 33.333333}
                tenure={popupTenure}
                fixedDp={1}
                eligibleTenures={[3, 6]}
                popupType={currentPopupType}
                showExpress={isExpressPlacement}
                expressTab={expressTab}
                onExpressTabChange={setExpressTab}
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

              {/* Branding Mode Badge (Displays selected branding mode from Step 1) */}
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-gray-100 text-gray-800 border border-gray-200/60 shadow-2xs">
                {formatBrandingLabel(brandingMode)}
              </span>
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
          <ElementInspector
            selectedElement={selectedElement}
            onClose={() => { setSelectedElement(null); setActivePickerField(null); }}
            editorTab={editorTab}
            setEditorTab={setEditorTab}
            elementOverrides={elementOverrides}
            setElementOverrides={setElementOverrides}
            activePickerField={activePickerField}
            setActivePickerField={setActivePickerField}
            handleElementColorChange={handleElementColorChange}
            colors={colors}
            offers={offers}
            rbi={rbi}
            cashback={cashback}
            coupons={coupons}
          />

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
              expressTab={expressTab}
              onExpressTabChange={setExpressTab}
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

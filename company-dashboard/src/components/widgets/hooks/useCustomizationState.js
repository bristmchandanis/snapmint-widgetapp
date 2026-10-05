import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { extractColorsFromImage, extractColorsFromText } from '../shared/helpers.jsx';
import {
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
} from '../shared/constants.jsx';

const COMMON_FONTS = [
  'Roboto', 'Inter', 'Poppins', 'Montserrat', 'Lato', 'Open Sans',
  'Oswald', 'Raleway', 'Nunito', 'Ubuntu', 'Rubik',
];

const DEFAULT_OPEN_SECTIONS = {
  assets: true, brandColours: true, typography: true, changeText: true,
  cornerRadius: true, theme: true, colours: true, expressBottom: true,
  moreColours: false, cashback: true, offers: true, coupons: true, rbi: true,
};

// ─── Font Helpers ───
const normalizeFontName = (str = '') => str.split(/[-_.]/)[0].toLowerCase().replace(/\s+/g, '');
const sanitizeFontFamily = (name = '') => name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');

const loadGoogleFont = (fontName) => {
  if (!fontName) return;
  const clean = normalizeFontName(fontName);
  const match = COMMON_FONTS.find((f) => normalizeFontName(f) === clean);
  if (match && !document.getElementById(`snp-gf-${match}`)) {
    const link = document.createElement('link');
    link.id = `snp-gf-${match}`;
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(match)}:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,700&display=swap`;
    document.head.appendChild(link);
  }
};

const registerCustomFont = async (familyName, url) => {
  try {
    const fontFace = new FontFace(familyName, `url("${url}")`);
    document.fonts.add(await fontFace.load());
  } catch (err) {
    console.warn('FontFace load error:', err);
  }
  if (!document.getElementById(`snp-font-${familyName}`)) {
    const style = document.createElement('style');
    style.id = `snp-font-${familyName}`;
    style.textContent = `@font-face { font-family: "${familyName}"; src: url("${url}"); font-display: swap; }`;
    document.head.appendChild(style);
  }
};

export default function useCustomizationState({ brandingMode, initialCustomization, safeConfig, activePlacement }) {
  const currentBrandingMode = brandingMode || 'snapmint';
  const isWhiteLabel = currentBrandingMode === 'white-label';

  // State initialization helpers
  const initVal = (key, fallback) => initialCustomization?.[key] ?? fallback;
  const initObj = (key, fallback) => ({ ...fallback, ...(initialCustomization?.[key] || {}) });

  // 1. Theme & Colors
  const [selectedTheme, setSelectedTheme] = useState(() => initVal('selectedTheme', 'orange'));
  const [colors, setColors] = useState(() => ({ ...THEME_PALETTES.orange, ...(initialCustomization?.colors || {}) }));

  // 2. Brand Assets
  const [brandColors, setBrandColors] = useState(() => initVal('brandColors', DEFAULT_BRAND_COLORS));
  const [logoColors, setLogoColors] = useState(() => initVal('logoColors', DEFAULT_LOGO_COLORS));
  const [brandLogo, setBrandLogo] = useState(() => initVal('brandLogo', null));

  // 3. Typography
  const [titleFont, setTitleFont] = useState(() => initVal('titleFont', null));
  const [bodyFont, setBodyFont] = useState(() => initVal('bodyFont', null));
  const [uploadedFonts, setUploadedFonts] = useState(() => initVal('uploadedFonts', []));
  const [fontFamilyMap, setFontFamilyMap] = useState({});
  const [isEditingTypography, setIsEditingTypography] = useState(false);
  const [activePickerField, setActivePickerField] = useState(null);

  // 4. Content Sections (Text, Radii, Cashback, Offers, RBI)
  const [customText, setCustomText] = useState(() => initObj('customText', DEFAULT_CUSTOM_TEXT));
  const [cornerRadii, setCornerRadii] = useState(() => initObj('cornerRadii', DEFAULT_CORNER_RADII));
  const [cashback, setCashback] = useState(() => initObj('cashback', DEFAULT_CASHBACK));
  const [offers, setOffers] = useState(() => initObj('offers', DEFAULT_OFFERS));
  const [rbi, setRbi] = useState(() => initObj('rbi', DEFAULT_RBI));

  // 5. Coupons & Placement Settings
  const isCouponsEnabledInConfig = useMemo(() => {
    const active = safeConfig?.[activePlacement]?.capture?.coupons;
    if (active !== undefined) return Boolean(active);
    return Object.values(safeConfig || {}).some((c) => Boolean(c?.capture?.coupons))
      ?? Boolean(initialCustomization?.coupons?.enabled ?? true);
  }, [safeConfig, activePlacement, initialCustomization]);

  const [coupons, setCoupons] = useState(() => ({
    ...initObj('coupons', DEFAULT_COUPONS),
    enabled: isCouponsEnabledInConfig,
  }));

  useEffect(() => {
    setCoupons((prev) => ({ ...prev, enabled: isCouponsEnabledInConfig }));
  }, [isCouponsEnabledInConfig]);

  // 6. UI & Section Accordion
  const [previewMode, setPreviewMode] = useState('popup');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [expressTab, setExpressTab] = useState('size');
  const [lastStateBeforeReset, setLastStateBeforeReset] = useState(null);
  const [openSections, setOpenSections] = useState(DEFAULT_OPEN_SECTIONS);

  const toggleSection = useCallback((sec) => setOpenSections((p) => ({ ...p, [sec]: !p[sec] })), []);
  const paletteInputRef = useRef(null);
  const logoInputRef = useRef(null);

  // ─── Font Resolution & Auto-injection ───
  const resolveFontFamily = useCallback((name) => {
    if (!name) return null;
    return fontFamilyMap[name]
      || COMMON_FONTS.find((f) => normalizeFontName(f) === normalizeFontName(name))
      || sanitizeFontFamily(name);
  }, [fontFamilyMap]);

  const activeTitleFontFamily = useMemo(() => resolveFontFamily(titleFont), [titleFont, resolveFontFamily]);
  const activeBodyFontFamily = useMemo(() => resolveFontFamily(bodyFont), [bodyFont, resolveFontFamily]);
  const fontOptions = useMemo(() => [...new Set([...uploadedFonts, titleFont, bodyFont].filter(Boolean))], [uploadedFonts, titleFont, bodyFont]);
  const hasUploadedFonts = Boolean(uploadedFonts?.length || titleFont || bodyFont);

  useEffect(() => {
    loadGoogleFont(titleFont);
    loadGoogleFont(bodyFont);
  }, [titleFont, bodyFont]);

  // ─── Color & Theme Handlers ───
  const handleColorChange = useCallback((k, v) => setColors((p) => ({ ...p, [k]: v })), []);

  const handleApplyPaletteColor = useCallback((fieldKey, hex) => {
    const upper = hex.toUpperCase();
    if (fieldKey === 'brandAccent') {
      setColors((p) => ({ ...p, brandAccent: upper, payNowTagFill: upper, buttonFill: upper, selectedOutline: upper }));
    } else {
      setColors((p) => ({ ...p, [fieldKey]: upper }));
    }
  }, []);

  const handleSelectTheme = useCallback((id) => {
    setSelectedTheme(id);
    if (THEME_PALETTES[id]) setColors({ ...THEME_PALETTES[id] });
  }, []);

  const handleResetColors = useCallback(() => {
    setColors({ ...(THEME_PALETTES[selectedTheme] || THEME_PALETTES.orange) });
    toast.success('Reset colours');
  }, [selectedTheme]);

  const handleResetText = useCallback(() => {
    setCustomText({ ...DEFAULT_CUSTOM_TEXT });
    toast.info('Text reset to default');
  }, []);

  // ─── Snapshot & Reset ───
  const getCurrentSnapshot = useCallback(() => ({
    selectedTheme, colors, brandColors, logoColors, brandLogo,
    titleFont, bodyFont, uploadedFonts, customText, cornerRadii,
    cashback, offers, coupons, rbi,
  }), [selectedTheme, colors, brandColors, logoColors, brandLogo, titleFont, bodyFont, uploadedFonts, customText, cornerRadii, cashback, offers, coupons, rbi]);

  const applySnapshot = useCallback((s) => {
    setSelectedTheme(s.selectedTheme || 'orange');
    setColors(s.colors || { ...THEME_PALETTES.orange });
    setBrandColors(s.brandColors || DEFAULT_BRAND_COLORS);
    setLogoColors(s.logoColors || DEFAULT_LOGO_COLORS);
    setBrandLogo(s.brandLogo ?? null);
    setTitleFont(s.titleFont ?? null);
    setBodyFont(s.bodyFont ?? null);
    setUploadedFonts(s.uploadedFonts || []);
    setCustomText(s.customText || DEFAULT_CUSTOM_TEXT);
    setCornerRadii(s.cornerRadii || DEFAULT_CORNER_RADII);
    setCashback(s.cashback || DEFAULT_CASHBACK);
    setOffers(s.offers || DEFAULT_OFFERS);
    setCoupons(s.coupons || DEFAULT_COUPONS);
    setRbi(s.rbi || DEFAULT_RBI);
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

  // ─── Brand Colors & Logo Handlers ───
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
    } catch {
      toast.error('Failed to extract colours from file');
    }
    e.target.value = '';
  }, [handleApplyPaletteColor]);

  const handleAddBrandColor = useCallback(() => setBrandColors((p) => [...p, '#FFFFFF']), []);
  const handleRemoveBrandColor = useCallback((idx) => setBrandColors((p) => p.filter((_, i) => i !== idx)), []);
  const handleUpdateBrandColor = useCallback((idx, hex) => setBrandColors((p) => p.map((c, i) => (i === idx ? hex.toUpperCase() : c))), []);
  const handleSelectLogoColor = useCallback((color) => {
    setBrandColors((p) => (!p.includes(color) ? [...p, color] : p));
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
        if (detected.length) setLogoColors(detected);
      } catch { }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }, []);

  const handleRemoveLogo = useCallback((e) => {
    e.stopPropagation();
    setBrandLogo(null);
    setLogoColors([]);
  }, []);

  // ─── Font Upload Handler ───
  const handleUploadFont = useCallback(async (type, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const familyName = sanitizeFontFamily(file.name);
    await registerCustomFont(familyName, URL.createObjectURL(file));

    setFontFamilyMap((p) => ({ ...p, [file.name]: familyName }));
    setUploadedFonts((p) => (p.includes(file.name) ? p : [...p, file.name]));
    (type === 'title' ? setTitleFont : setBodyFont)(file.name);
    toast.success(`Uploaded ${type === 'title' ? 'heading' : 'body'} font: ${file.name}`);
    e.target.value = '';
  }, []);

  return {
    currentBrandingMode,
    isWhiteLabel,
    selectedTheme,
    colors,
    setColors,
    handleSelectTheme,
    handleColorChange,
    handleApplyPaletteColor,
    handleResetColors,
    brandColors,
    logoColors,
    brandLogo,
    paletteInputRef,
    logoInputRef,
    handleUploadPalette,
    handleAddBrandColor,
    handleRemoveBrandColor,
    handleUpdateBrandColor,
    handleSelectLogoColor,
    handleUploadLogo,
    handleRemoveLogo,
    titleFont,
    setTitleFont,
    bodyFont,
    setBodyFont,
    uploadedFonts,
    fontOptions,
    hasUploadedFonts,
    isEditingTypography,
    setIsEditingTypography,
    handleUploadFont,
    activeTitleFontFamily,
    activeBodyFontFamily,
    customText,
    setCustomText,
    handleResetText,
    cornerRadii,
    setCornerRadii,
    cashback,
    setCashback,
    offers,
    setOffers,
    coupons,
    setCoupons,
    isCouponsEnabledInConfig,
    rbi,
    setRbi,
    activePickerField,
    setActivePickerField,
    previewMode,
    setPreviewMode,
    appliedCoupon,
    setAppliedCoupon,
    expressTab,
    setExpressTab,
    lastStateBeforeReset,
    handleResetEverything,
    handleUndoReset,
    openSections,
    setOpenSections,
    toggleSection,
  };
}

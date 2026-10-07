import React, { useMemo, useCallback } from 'react';
import { toast } from 'sonner';
import { PiePopup, MultiLayerPopup, BoxPopup, FixedDepositPopup } from './popup/PopupModal';
import './popup/PopupModal.css';
import { buildLivePreviewStyles } from './shared/constants.jsx';
import usePlansAndStyles from './hooks/usePlansAndStyles';
import useCustomizationState from './hooks/useCustomizationState';
import usePreviewInteraction from './hooks/usePreviewInteraction';
import CustomizationLayout from './customization/CustomizationLayout';

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

export const normalizeBrandingMode = (mode) => mode || 'snapmint';

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

  // ─── Plans, Styles & Placement ───
  const {
    safeConfig,
    isPlacementEnabled,
    activePlacement,
    setActivePlacement,
    applicableStyles,
    activePopupStyle,
    setActivePopupStyle,
    hasMultiPlan,
    availableFutureRepayments,
    selectedPlanPreviewMode,
    setSelectedPlanPreviewMode,
    selectedFutureRepayments,
    setSelectedFutureRepayments,
    selectedPlanPreview,
    currentPopupType,
    isExpressPlacement,
  } = usePlansAndStyles({ configuration, priceBands, plans });

  // ─── All Customization State ───
  const state = useCustomizationState({
    brandingMode,
    initialCustomization,
    safeConfig,
    activePlacement,
  });

  // ─── Select-Element Inspector ───
  const inspector = usePreviewInteraction({
    setOpenSections: state.setOpenSections,
  });

  // ─── Element Color Change Handler ───
  const handleElementColorChange = useCallback((colorKey, value) => {
    if (['dealTagFill', 'dealTagText', 'dealTagIcon', 'offerNoteColour'].includes(colorKey)) {
      state.setOffers(prev => ({ ...prev, [colorKey]: value }));
    }
    if (['rbiIcons', 'rbiText'].includes(colorKey)) {
      state.setRbi(prev => ({ ...prev, [colorKey === 'rbiIcons' ? 'iconsColour' : 'textColour']: value }));
    }
    if (['ribbonFill', 'ribbonText'].includes(colorKey)) {
      state.setCashback(prev => ({ ...prev, [colorKey]: value }));
    }
    if (['couponStripFill', 'couponStripText', 'couponIconColour'].includes(colorKey)) {
      state.setCoupons(prev => ({ ...prev, [colorKey]: value }));
    }
    if (inspector.editorTab === 'shared') {
      state.setColors((prev) => ({ ...prev, [colorKey]: value }));
    } else {
      inspector.setElementOverrides(prev => ({
        ...prev,
        [inspector.selectedElement]: { ...(prev[inspector.selectedElement] || {}), [colorKey]: value },
      }));
    }
  }, [inspector.editorTab, inspector.selectedElement, state]);

  // ─── Live Preview Styles ───
  const livePreviewStyles = useMemo(() => buildLivePreviewStyles({
    colors: state.colors,
    cornerRadii: state.cornerRadii,
    cashback: state.cashback,
    offers: state.offers,
    rbi: state.rbi,
    coupons: state.coupons,
    titleFont: state.activeTitleFontFamily,
    bodyFont: state.activeBodyFontFamily,
  }), [state.colors, state.cornerRadii, state.cashback, state.offers, state.rbi, state.coupons, state.activeTitleFontFamily, state.activeBodyFontFamily]);

  const popupTenure = selectedPlanPreview === 'box'
    ? Number(selectedFutureRepayments)
    : Number(selectedFutureRepayments) + 1;

  const ActivePopup = POPUP_MAP[selectedPlanPreview] || PiePopup;

  // ─── Save Handler ───
  const handleSave = useCallback(() => {
    if (onContinue) {
      onContinue({
        theme: state.selectedTheme,
        colors: state.colors,
        isWhiteLabel: state.isWhiteLabel,
        brandingMode: state.currentBrandingMode,
        activePlacement,
        selectedPlanPreview,
        brandColors: state.brandColors,
        brandLogo: state.brandLogo,
        logoColors: state.logoColors,
        titleFont: state.titleFont,
        bodyFont: state.bodyFont,
        customText: state.customText,
        cornerRadii: state.cornerRadii,
        cashback: state.cashback,
        offers: state.offers,
        coupons: { ...state.coupons, enabled: state.isCouponsEnabledInConfig },
        rbi: state.rbi,
      });
    } else {
      toast.success('Pop-up appearance saved');
    }
  }, [onContinue, state, activePlacement, selectedPlanPreview]);

  return (
    <CustomizationLayout
      safeMerchant={safeMerchant}
      brandingMode={brandingMode}
      onBack={onBack}
      handleSave={handleSave}
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
      selectedPlanPreview={selectedPlanPreview}
      currentPopupType={currentPopupType}
      isExpressPlacement={isExpressPlacement}
      ActivePopup={ActivePopup}
      livePreviewStyles={livePreviewStyles}
      popupTenure={popupTenure}
      state={state}
      inspector={inspector}
      handleElementColorChange={handleElementColorChange}
    />
  );
}

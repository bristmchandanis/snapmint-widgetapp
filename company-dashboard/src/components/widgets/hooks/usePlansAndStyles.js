import { useState, useMemo, useCallback, useEffect } from 'react';
import { PLACEMENT_TABS } from '../customization/CustomizationHeader';

const STYLE_LABELS = {
  pie: 'Pie',
  box: 'Box',
  'fixed-dp': 'Fixed DP',
};

const DEFAULT_POPUP_BY_PLACEMENT = {
  cart: 'eligibility-payment',
  'mini-cart': 'express',
  checkout: 'express',
};

// Helper to extract style key from raw string (e.g. "pie_layout" -> "pie")
const parseStyle = (val) => {
  const s = String(val || '').toLowerCase();
  if (s.includes('box')) return 'box';
  if (s.includes('fixed')) return 'fixed-dp';
  if (s.includes('pie')) return 'pie';
  return null;
};

export default function usePlansAndStyles({ configuration, priceBands, plans }) {
  // ─── Placement Configuration ───
  const safeConfig = useMemo(() => {
    const raw = configuration && typeof configuration === 'object' ? configuration : {};
    return {
      pdp: { enabled: true, ...(raw.pdp || {}) },
      'mini-cart': { enabled: true, ...(raw['mini-cart'] || {}) },
      cart: { enabled: true, ...(raw.cart || {}) },
      checkout: { enabled: true, ...(raw.checkout || {}) },
    };
  }, [configuration]);

  const isPlacementEnabled = useCallback(
    (tabId) => safeConfig[tabId]?.enabled !== false,
    [safeConfig],
  );

  const firstEnabledPlacement = useMemo(
    () => PLACEMENT_TABS.find((t) => isPlacementEnabled(t.id))?.id || 'pdp',
    [isPlacementEnabled],
  );

  const [activePlacement, setActivePlacement] = useState(firstEnabledPlacement);

  useEffect(() => {
    if (!isPlacementEnabled(activePlacement)) {
      setActivePlacement(firstEnabledPlacement);
    }
  }, [firstEnabledPlacement, activePlacement, isPlacementEnabled]);

  // ─── Applicable Popup Styles ───
  const applicableStyles = useMemo(() => {
    const styleSet = new Set();

    // 1. From priceBands.bands groups
    if (Array.isArray(priceBands?.bands)) {
      priceBands.bands.forEach((b) => {
        (b.groups || []).forEach((g) => {
          (g.allowed || []).forEach((s) => s && styleSet.add(s));
        });
      });
    }

    // 2. From priceBands.choices
    if (priceBands?.choices && typeof priceBands.choices === 'object') {
      Object.values(priceBands.choices).forEach((s) => {
        const parsed = parseStyle(s);
        if (parsed) styleSet.add(parsed);
      });
    }

    // 3. Fallback from plans
    if (styleSet.size === 0 && Array.isArray(plans) && plans.length > 0) {
      plans.forEach((p) => {
        if (p.dpType === 'fixed') {
          styleSet.add('fixed-dp');
        } else {
          styleSet.add('box');
          if (![12, 18, 24].includes(Number(p.tenure))) {
            styleSet.add('pie');
          }
        }
      });
    }

    // 4. Default fallback
    if (styleSet.size === 0) {
      styleSet.add('pie');
      styleSet.add('box');
    }

    return Array.from(styleSet)
      .filter((s) => s !== 'multi-plan')
      .map((id) => ({
        id,
        label: STYLE_LABELS[id] || id.charAt(0).toUpperCase() + id.slice(1),
      }));
  }, [priceBands, plans]);

  // ─── Active Popup Style ───
  const choiceStyle = useMemo(() => {
    if (priceBands?.choices && typeof priceBands.choices === 'object') {
      return parseStyle(Object.values(priceBands.choices)[0]);
    }
    return null;
  }, [priceBands?.choices]);

  const [activePopupStyle, setActivePopupStyle] = useState(() => choiceStyle || 'pie');

  useEffect(() => {
    if (choiceStyle && applicableStyles.some((s) => s.id === choiceStyle)) {
      setActivePopupStyle(choiceStyle);
    } else if (applicableStyles.length > 0 && !applicableStyles.some((s) => s.id === activePopupStyle)) {
      setActivePopupStyle(applicableStyles[0].id);
    }
  }, [choiceStyle, applicableStyles, activePopupStyle]);

  // ─── Multi-Plan Flag ───
  const hasMultiPlan = useMemo(() => {
    return (
      (priceBands?.bands || []).some((b) =>
        (b.groups || []).some((g) => (g.plans || []).length > 1),
      ) || (Array.isArray(plans) && plans.length > 1)
    );
  }, [priceBands, plans]);

  // ─── Future Repayments ───
  const availableFutureRepayments = useMemo(() => {
    const tenureSet = new Set();

    if (Array.isArray(priceBands?.bands)) {
      priceBands.bands.forEach((b) => {
        (b.groups || []).forEach((g) => {
          (g.plans || []).forEach((p) => p.tenure && tenureSet.add(Number(p.tenure)));
        });
      });
    }

    if (tenureSet.size === 0 && Array.isArray(plans)) {
      plans.forEach((p) => p.tenure && tenureSet.add(Number(p.tenure)));
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
  const [selectedFutureRepayments, setSelectedFutureRepayments] = useState(
    () => availableFutureRepayments[0]?.value || '2',
  );

  useEffect(() => {
    if (
      availableFutureRepayments.length > 0 &&
      !availableFutureRepayments.some((opt) => opt.value === selectedFutureRepayments)
    ) {
      setSelectedFutureRepayments(availableFutureRepayments[0].value);
    }
  }, [availableFutureRepayments, selectedFutureRepayments]);

  const selectedPlanPreview = useMemo(() => {
    return selectedPlanPreviewMode === 'multi' ? 'multi-plan' : activePopupStyle;
  }, [selectedPlanPreviewMode, activePopupStyle]);

  const currentPopupType =
    safeConfig[activePlacement]?.popupType ||
    DEFAULT_POPUP_BY_PLACEMENT[activePlacement] ||
    'info';

  const isExpressPlacement = currentPopupType === 'express';

  return {
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
  };
}

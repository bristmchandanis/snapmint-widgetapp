import { useState, useCallback, useEffect, useRef } from 'react';
import { ELEMENT_MAP, COLOR_KEY_TO_CSS_VAR } from '../shared/constants.jsx';

const ALL_CSS_VARS = Object.values(COLOR_KEY_TO_CSS_VAR).flat();

const ELEMENT_TO_SECTION = {
  'deal-badge': 'offers',
  'offer-banner': 'offers',
  'offer-note': 'offers',
  'coupon-strip': 'coupons',
  'total-card': 'coupons',
  'total-row': 'coupons',
  'total-label': 'coupons',
  'total-price': 'coupons',
  'corner-ribbon': 'cashback',
  footer: 'rbi',
  'trust-bar': 'rbi',
  'rbi-badge': 'rbi',
  'trusted-badge': 'rbi',
  'pay-with-brand': 'rbi',
  'eligibility-footer': 'rbi',
  subtitle: 'changeText',
  'amount-highlight': 'changeText',
  'rest-subtitle': 'changeText',
  'express-bottom': 'expressBottom',
};

const clearHoverClasses = (container) => {
  container?.querySelectorAll('.snp-el-hover').forEach((n) => n.classList.remove('snp-el-hover'));
};

export default function usePreviewInteraction({ setOpenSections }) {
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedElement, setSelectedElement] = useState(null);
  const [editorTab, setEditorTab] = useState('this');
  const [elementOverrides, setElementOverrides] = useState({});
  const [hoveredElementLabel, setHoveredElementLabel] = useState(null);
  const previewContainerRef = useRef(null);

  useEffect(() => {
    const container = previewContainerRef.current;
    if (!container) return;

    container.querySelectorAll('[data-snp-el]').forEach((node) => {
      const overrides = elementOverrides[node.getAttribute('data-snp-el')];
      ALL_CSS_VARS.forEach((v) => node.style.removeProperty(v));

      if (overrides) {
        Object.entries(overrides).forEach(([key, val]) => {
          (COLOR_KEY_TO_CSS_VAR[key] || []).forEach((v) => node.style.setProperty(v, val));
        });
      }
    });
  }, [elementOverrides]);

  useEffect(() => {
    const container = previewContainerRef.current;
    if (!container) return;

    container.querySelectorAll('[data-snp-el]').forEach((node) => {
      const isSelected = Boolean(selectedElement && node.getAttribute('data-snp-el') === selectedElement);
      node.classList.toggle('snp-el-selected', isSelected);
    });
  }, [selectedElement]);

  const handlePreviewMouseOver = useCallback((e) => {
    if (!isSelectMode) return;
    const container = previewContainerRef.current;
    clearHoverClasses(container);

    const el = e.target.closest('[data-snp-el]');
    if (el) {
      el.classList.add('snp-el-hover');
      const elId = el.getAttribute('data-snp-el');
      setHoveredElementLabel(ELEMENT_MAP[elId]?.label || null);
    } else {
      setHoveredElementLabel(null);
    }
  }, [isSelectMode]);

  const handlePreviewMouseLeave = useCallback(() => {
    clearHoverClasses(previewContainerRef.current);
    setHoveredElementLabel(null);
  }, []);

  const handlePreviewClick = useCallback((e) => {
    if (!isSelectMode) return;
    e.preventDefault();
    e.stopPropagation();

    const el = e.target.closest('[data-snp-el]');
    if (!el) return;

    const elId = el.getAttribute('data-snp-el');
    setSelectedElement(elId);

    const section = ELEMENT_TO_SECTION[elId] || 'colours';
    const extra = section === 'coupons'
      ? { cashback: true }
      : section === 'expressBottom'
        ? { colours: true }
        : {};

    setOpenSections((prev) => ({ ...prev, [section]: true, ...extra }));
  }, [isSelectMode, setOpenSections]);

  return {
    isSelectMode,
    setIsSelectMode,
    selectedElement,
    setSelectedElement,
    editorTab,
    setEditorTab,
    elementOverrides,
    setElementOverrides,
    hoveredElementLabel,
    previewContainerRef,
    handlePreviewMouseOver,
    handlePreviewMouseLeave,
    handlePreviewClick,
  };
}

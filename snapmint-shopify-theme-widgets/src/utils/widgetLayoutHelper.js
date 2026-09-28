import { getDownPaymentAndEmi } from "./emiCalculator";

const parseWindowObject = (value, fallback = {}) => {
  if (!value) return fallback;
  if (typeof value === "object") return value;
  try {
    return JSON.parse(value) || fallback;
  } catch {
    return fallback;
  }
};

export const getWidgetLayoutData = () => {
  return parseWindowObject(window.snapmintWidgetLayout, { widgets: [] });
};

export const getMatchingWidget = (price, placementTypes = "PDP") => {
  const layoutData = getWidgetLayoutData();
  const widgets = layoutData.widgets || [];
  
  const placementsToCheck = Array.isArray(placementTypes) ? placementTypes : [placementTypes];

  // Filter based on placement and price range
  const validWidgets = widgets.filter((widget) => {
    const hasPlacement = Array.isArray(widget.placements) && widget.placements.some(p => placementsToCheck.includes(p));
    const min = Number(widget.minAmount) || 0;
    const max = Number(widget.maxAmount) || Infinity;
    const inRange = price >= min && price <= max;
    return hasPlacement && inRange;
  });

  if (!validWidgets.length) return null;

  // Highest ID wins
  validWidgets.sort((a, b) => {
    const idA = Number(a.id) || 0;
    const idB = Number(b.id) || 0;
    return idB - idA; // Descending
  });

  return validWidgets[0];
};

export const getWidgetEmiData = (price, widget) => {
  if (!widget) return { downPayment: 0, emi: 0 };
  
  // Transform widget config to match getDownPaymentAndEmi expected plan object
  const plan = {
    dpRate: widget.dpPercent,
    dpType: widget.dpType,
    emiAmountRate: widget.emiPercent,
    tenure: widget.tenure,
    minAmount: widget.minAmount,
    maxAmount: widget.maxAmount,
  };

  return getDownPaymentAndEmi(price, plan);
};

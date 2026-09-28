import {
  getSnapmintAutoSetupClass,
  getSnpmitThemeSelectors,
} from "./constants";

export const SECONDARY_PRODUCT_CONTEXT_SELECTOR =
  "product-card, quick-add-dialog, quick-add-modal, " +
  "quick-add-component, [data-quick-add], .quick-add, dialog";

export function getConfiguredSelectors() {
  const themeSelectors = getSnpmitThemeSelectors() || {};
  const appSelectors = getSnapmintAutoSetupClass() || {};
  const selectorNames = new Set([
    ...Object.keys(themeSelectors),
    ...Object.keys(appSelectors),
  ]);

  const selectors = {};

  for (const name of selectorNames) {
    selectors[name] = appSelectors[name] || themeSelectors[name] || "";
  }

  return selectors;
}

export function findMainPdpElement(parent, selector) {
  if (!parent || !selector) return null;

  const candidates = [];
  try {
    if (parent.matches?.(selector)) candidates.push(parent);
  } catch {
    console.warn(`Snapmint: invalid selector "${selector}"`);
    return null;
  }

  candidates.push(...findAllElements(parent, selector));

  return (
    candidates.find(
      (element) =>
        !element.closest?.(".snapmint_widget_pdp") &&
        !element.closest?.(SECONDARY_PRODUCT_CONTEXT_SELECTOR),
    ) || null
  );
}

export function findFirstElement(parent, selectorList) {
  if (!parent || !selectorList) return null;

  for (const item of selectorList.split(",")) {
    const selector = item.trim();

    try {
      if (parent.matches?.(selector)) return parent;

      const element = parent.querySelector(selector);
      if (element) return element;
    } catch {
      console.warn(`Snapmint: invalid selector "${selector}"`);
    }
  }

  return null;
}

export function findAllElements(parent, selector) {
  if (!selector) return [];

  try {
    return [...parent.querySelectorAll(selector)];
  } catch {
    console.warn(`Snapmint: invalid selector "${selector}"`);
    return [];
  }
}

export function placeWidget(target, widget, placement) {
  switch (placement) {
    case "before":
      target.before(widget);
      break;
    case "prepend":
      target.prepend(widget);
      break;
    case "append":
      target.append(widget);
      break;
    default:
      target.after(widget);
  }
}

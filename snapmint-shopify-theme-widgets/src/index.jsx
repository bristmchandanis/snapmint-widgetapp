import { createRoot } from "react-dom/client";
import SnapMintCollectionWidget from "./components/collections/SnapMintCollectionWidget";
import SnapMintPDPWidget from "./components/pdp/SnapMintPDPWidget";
import {
  mountedWidgets,
  pdpRuntime,
  cartRuntime,
} from "./utils/widgetRuntimes";
import {
  getConfiguredSelectors,
  findMainPdpElement,
  findFirstElement,
  findAllElements,
  placeWidget,
  SECONDARY_PRODUCT_CONTEXT_SELECTOR,
} from "./utils/domHelper";
import { getWidgetLayoutData } from "./utils/widgetLayoutHelper";
import {
  readProductSnapshot,
  readEmbeddedProduct,
  normalizeShopifyId,
  readProductHandle,
  parsePriceInMinorUnits,
} from "./utils/productDataHelper";
import SnapMintCartWidget from "./components/cart/SnapMintCartWidget";
import "./styles.css";
const fallbackStates = {};

export function logWidgetFallback(pageType, reason) {
  const key = `${pageType}:${reason}`;
  if (fallbackStates[key]) return;
  fallbackStates[key] = true;
  console.log(`Snapmint Widget Fallback [${pageType}]:`, reason);
}

const TRUE_DATA_VALUE = "true";
const SETUP_DELAY_MS = 50;
const MAX_SETUP_DELAY_MS = 250;
const DOM_SNAPSHOT_DELAY_MS = 150;
const UNAVAILABLE_SNAPSHOT_DELAY_MS = 500;

const WIDGET_PAGES = [
  {
    type: "collection",
    contextSelectorKey: "collectionGridItem",
    widgetClassName: "snapmint_widget_collection",
    Component: SnapMintCollectionWidget,
  },
  {
    type: "pdp",
    widgetClassName: "snapmint_widget_pdp",
    Component: SnapMintPDPWidget,
    productPageOnly: true,
    appendTargetRequired: true,
  },
  {
    type: "cart",
    widgetClassName: "snapmint_widget_cart",
    Component: SnapMintCartWidget,
    appendTargetRequired: true,
  },
  {
    type: "cartDrawer",
    widgetClassName: "snapmint_widget_cart",
    Component: SnapMintCartWidget,
    appendTargetRequired: true,
  },
];

let setupTimer;
let firstSetupRequestAt = 0;

window.snapmintAutoSetup = setupWidgets;

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeWidgets, {
    once: true,
  });
} else {
  initializeWidgets();
}

// Main setup flow

function initializeWidgets() {
  setupWidgets();
  document.addEventListener("change", handleDocumentChange);
  document.addEventListener("shopify:product:select", handleProductSelect);
  [
    "variant:change",
    "variant:changed",
    "product:variant-change",
    "theme:variant:change",
  ].forEach((eventName) => {
    document.addEventListener(eventName, handleVariantEvent);
  });

  new MutationObserver(handleDomMutations).observe(document.body, {
    attributes: true,
    characterData: true,
    childList: true,
    subtree: true,
  });
}

function handleDocumentChange() {
  // A new choice makes any previously resolved event variant stale.
  if (!pdpRuntime.suppressBubblingChange) {
    pdpRuntime.eventGeneration += 1;
    pdpRuntime.eventVariant = null;
  }

  scheduleWidgetSetup();
}

function handleDomMutations(records) {
  reattachPdpWidget();

  const hasExternalMutation = records.some((record) => {
    const target =
      record.target.nodeType === Node.ELEMENT_NODE
        ? record.target
        : record.target.parentElement;
    const widgetHost = target?.closest?.(
      ".snapmint_widget_pdp, .snapmint_widget_collection",
    );

    // Manual widgets are configured through data-* attributes, so an external
    // attribute update on their host must still trigger a props refresh.
    if (
      record.type === "attributes" &&
      target === widgetHost &&
      !isAutomaticWidget(widgetHost)
    ) {
      return true;
    }

    return !target?.closest?.(
      ".snapmint_widget_pdp, .snapmint_widget_collection, #sm-pop-up-model",
    );
  });

  if (hasExternalMutation) scheduleWidgetSetup();
}

function handleProductSelect(event) {
  if (isSecondaryProductEvent(event)) return;

  const generation = ++pdpRuntime.eventGeneration;
  pdpRuntime.suppressBubblingChange = true;
  pdpRuntime.eventVariant = null;

  // Ignore only the original change event that is still bubbling. A later
  // selection must invalidate this promise even if it has not resolved yet.
  queueMicrotask(() => {
    pdpRuntime.suppressBubblingChange = false;
  });

  Promise.resolve(event.promise)
    .then((result) => {
      if (generation !== pdpRuntime.eventGeneration) return;

      const variant = normalizeVariantRecord(
        result?.detail?.resource || result?.variant,
      );

      if (variant) {
        pdpRuntime.eventVariant = addEventProductIdentity(
          variant,
          result?.detail?.product ||
            result?.detail?.newProduct ||
            event.product ||
            event.detail?.product,
          result?.detail?.productId,
        );
      }

      scheduleWidgetSetup();
    })
    .catch(() => {
      scheduleWidgetSetup();
    });
}

function handleVariantEvent(event) {
  if (isSecondaryProductEvent(event)) return;

  const variant = normalizeVariantRecord(
    event.detail?.variant ||
      event.detail?.resource ||
      event.detail ||
      event.variant,
  );

  if (!variant) return;

  pdpRuntime.eventGeneration += 1;
  pdpRuntime.suppressBubblingChange = true;
  pdpRuntime.eventVariant = addEventProductIdentity(
    variant,
    event.detail?.product || event.product,
  );

  queueMicrotask(() => {
    pdpRuntime.suppressBubblingChange = false;
  });

  scheduleWidgetSetup();
}

function isSecondaryProductEvent(event) {
  const secondaryContext = event.target?.closest?.(
    SECONDARY_PRODUCT_CONTEXT_SELECTOR,
  );

  if (secondaryContext && !secondaryContext.contains(pdpRuntime.widget)) {
    return true;
  }

  const mainContext = getMainPdpContext();
  if (
    mainContext !== document &&
    event.target &&
    mainContext.contains(event.target)
  ) {
    return false;
  }

  const eventProduct = event.product || event.detail?.product;
  const currentDomProduct = readCurrentPdpProductIdentity(mainContext);
  const embeddedProduct = readEmbeddedProduct();
  const currentProductId = normalizeShopifyId(
    currentDomProduct.productId ||
      embeddedProduct.id ||
      window.ShopifyAnalytics?.meta?.product?.id,
  );
  const currentProductHandle =
    currentDomProduct.productHandle ||
    embeddedProduct.handle ||
    window.location.pathname.split("/products/")[1]?.split(/[/?#]/)[0] ||
    "";
  const eventProductId = normalizeShopifyId(eventProduct?.id);
  const eventProductHandle = eventProduct?.handle || "";

  if (
    (eventProductId &&
      currentProductId &&
      eventProductId !== currentProductId) ||
    (eventProductHandle &&
      currentProductHandle &&
      eventProductHandle !== currentProductHandle)
  ) {
    return true;
  }

  return false;
}

function getMainPdpContext() {
  const widgetContext = pdpRuntime.widget?.isConnected
    ? pdpRuntime.widget.closest("product-info, .shopify-section")
    : null;
  if (widgetContext) return widgetContext;

  const selectors = getConfiguredSelectors();
  const variantIdElement = findMainPdpElement(document, selectors.pdpVariantId);
  return (
    variantIdElement?.closest("product-info, .product, .shopify-section") ||
    document
  );
}

function readCurrentPdpProductIdentity(context) {
  const selectors = getConfiguredSelectors();
  const variantIdElement = findMainPdpElement(context, selectors.pdpVariantId);
  const productIdElement = findMainPdpElement(context, selectors.pdpProductId);
  const productHandleElement = findMainPdpElement(
    context,
    selectors.pdpProductHandle,
  );

  return {
    productId: normalizeShopifyId(
      productIdElement !== variantIdElement
        ? productIdElement?.dataset?.productId ||
            productIdElement?.value ||
            productIdElement?.textContent?.trim()
        : "",
    ),
    productHandle: productHandleElement
      ? readProductHandle(productHandleElement, "", {})
      : "",
  };
}

function addEventProductIdentity(variant, product, productId) {
  return {
    ...variant,
    productId: normalizeShopifyId(productId || product?.id),
    productHandle: product?.handle || "",
  };
}

function scheduleWidgetSetup() {
  const now = Date.now();
  if (!firstSetupRequestAt) firstSetupRequestAt = now;

  clearTimeout(setupTimer);
  const remainingMaxDelay = Math.max(
    MAX_SETUP_DELAY_MS - (now - firstSetupRequestAt),
    0,
  );
  setupTimer = setTimeout(
    runScheduledWidgetSetup,
    Math.min(SETUP_DELAY_MS, remainingMaxDelay),
  );
}

function runScheduledWidgetSetup() {
  setupTimer = null;
  firstSetupRequestAt = 0;
  setupWidgets();
}

function setupWidgets() {
  const selectors = getConfiguredSelectors();
  WIDGET_PAGES.forEach((page) => {
    setupWidgetPage(page, selectors);
  });
}

function setupWidgetPage(page, selectors) {
  const widgetSelector = `.${page.widgetClassName}`;
  const existingWidgets = findAllElements(document, widgetSelector);
  const manualWidgets = existingWidgets.filter(
    (widget) => !isAutomaticWidget(widget),
  );

  // One manual widget disables automatic widgets of the same type.
  if (manualWidgets.length > 0) {
    existingWidgets.forEach(removeAutomaticWidget);

    if (
      page.type === "pdp" &&
      pdpRuntime.widget &&
      !existingWidgets.includes(pdpRuntime.widget)
    ) {
      removeAutomaticWidget(pdpRuntime.widget);
    }

    if (isPageAllowed(page)) {
      manualWidgets.forEach((widget) => {
        const data = readWidgetDataFromElement(widget);
        // Fast-path: Scrape cart price immediately to prevent network delay
        if (
          (page.type === "cart" || page.type === "cartDrawer") &&
          !data.amount
        ) {
          const getPageSelector = (name) => selectors[`${page.type}${name}`];
          const priceSelector =
            getPageSelector("SalePrice") ||
            getPageSelector("PriceSelector") ||
            getPageSelector("Total") ||
            "";
          if (priceSelector) {
            const priceElement = findFirstElement(document, priceSelector);
            if (priceElement) {
              data.amount = parsePriceInMinorUnits(priceElement);
            }
          }
        }
        renderWidget(widget, page.Component, data);
      });
    }
    return;
  }

  const contexts = page.contextSelectorKey
    ? findAllElements(document, selectors[page.contextSelectorKey])
    : [document];

  contexts.forEach((context) => {
    setupAutomaticWidget(page, context, selectors);
  });

  // Initialize any server-rendered automatic widget that has no React root yet.
  findAllElements(document, widgetSelector).forEach((widget) => {
    if (mountedWidgets.has(widget)) return;
    const context =
      page.type === "collection"
        ? getCollectionContext(widget, selectors)
        : document;
    if (!isValidAutomaticContext(page, context, selectors)) return;
    renderWidget(widget, page.Component);
  });
}

function setupAutomaticWidget(page, context, selectors) {
  const widgetSelector = `.${page.widgetClassName}[data-snapmint-page-type="${page.type}"]`;
  const getPageSelector = (name) => selectors[`${page.type}${name}`];
  const domWidget = context.querySelector(widgetSelector);
  let widget = domWidget;
  if (page.type === "pdp" && pdpRuntime.widget) {
    widget = pdpRuntime.widget;
  } else if (
    (page.type === "cart" || page.type === "cartDrawer") &&
    cartRuntime[page.type]
  ) {
    widget = cartRuntime[page.type];
  }
  // A section morph can contain a cloned old host. Keep the original host/root.
  if (
    (page.type === "pdp" || page.type === "cart") &&
    domWidget &&
    widget !== domWidget &&
    isAutomaticWidget(domWidget)
  ) {
    removeAutomaticWidget(domWidget);
  }

  if (!isValidAutomaticContext(page, context, selectors)) {
    // Remove a PDP widget only after leaving the product page. Collection
    // markup can be temporarily incomplete while a theme updates the DOM.
    if (!isPageAllowed(page)) removeAutomaticWidget(widget);
    return;
  }

  if (widget && !isAutomaticWidget(widget)) return;

  const configuredAppendTargetSelector = getPageSelector("WidgetAppendTarget");

  const configuredAppendTarget =
    page.type === "pdp"
      ? findMainPdpElement(context, configuredAppendTargetSelector)
      : findFirstElement(context, configuredAppendTargetSelector);

  let appendTarget = configuredAppendTarget;

  if (page.type === "pdp" && appendTarget) {
    // Keep it here for compatibility, though we no longer use it
    pdpRuntime.usesGenericPlacement = false;
  }

  // Keep the current widget mounted while Shopify replaces price markup.
  if (page.appendTargetRequired && !appendTarget && !widget?.isConnected) {
    if (page.type === "pdp" || page.type === "cart") {
      logWidgetFallback(
        page.type,
        `Append target not found for selector: ${configuredAppendTargetSelector}`,
      );
    }
    return;
  }

  const priceSelector =
    getPageSelector("SalePrice") ||
    getPageSelector("PriceSelector") ||
    getPageSelector("Total") ||
    "";
  const priceElement =
    findFirstElement(appendTarget, priceSelector) ||
    (page.type === "pdp"
      ? findMainPdpElement(context, priceSelector)
      : findFirstElement(context, priceSelector));
  const displayedAmount = parsePriceInMinorUnits(priceElement);
  const snapshot = readProductSnapshot(
    context,
    page,
    selectors,
    displayedAmount,
  );

  // Empty transition markup is not a reason to clear the committed widget.
  // A confirmed unavailable state keeps the last amount only so the existing
  // React content can stay mounted while its host is hidden.
  if (!snapshot.data.amount) {
    if (
      page.type === "pdp" &&
      snapshot.data.available === "false" &&
      pdpRuntime.committedData?.amount
    ) {
      snapshot.data.amount = pdpRuntime.committedData.amount;
    } else {
      if (page.type === "pdp" || page.type === "cart") {
        logWidgetFallback(
          page.type,
          `Price amount could not be scraped using selector: ${priceSelector}`,
        );
      }
      return;
    }
  }

  if (!widget) {
    widget = document.createElement("div");
    widget.className = page.widgetClassName;
    widget.dataset.snapmintAuto = TRUE_DATA_VALUE;
    widget.dataset.snapmintPageType = page.type;

    if (page.type === "pdp") {
      pdpRuntime.widget = widget;
    } else if (page.type === "cart" || page.type === "cartDrawer") {
      cartRuntime[page.type] = widget;
    }
  }

  if (!widget.isConnected) {
    const placementTarget =
      appendTarget || priceElement?.closest(".price") || priceElement;

    if (!placementTarget) return;
    placeWidget(placementTarget, widget, getPageSelector("WidgetPlacement"));
  }

  if (page.type === "pdp") {
    stagePdpSnapshot(widget, page.Component, snapshot);
  } else {
    renderWidget(widget, page.Component, snapshot.data);
  }
}

function isPageAllowed(page) {
  if (page.productPageOnly && !isProductPage()) return false;

  if (window.snapmintWidgetLayout) {
    const layoutData = getWidgetLayoutData();
    const widgets = layoutData.widgets || [];
    let hasPlacement = false;
    for (const widget of widgets) {
      const placements = Array.isArray(widget.placements)
        ? widget.placements
        : [];
      if (page.type === "pdp" && placements.includes("PDP"))
        hasPlacement = true;
      if (page.type === "collection" && placements.includes("COLLECTION"))
        hasPlacement = true;
      if (page.type === "cart" && placements.includes("CART"))
        hasPlacement = true;
      if (page.type === "cartDrawer" && placements.includes("CARTDRAWER"))
        hasPlacement = true;
    }
    if (!hasPlacement) return false;
  }

  return true;
}

function isValidAutomaticContext(page, context, selectors) {
  if (!isPageAllowed(page)) return false;

  return (
    page.type !== "collection" || isCollectionProductCard(context, selectors)
  );
}

function stagePdpSnapshot(widget, Component, snapshot) {
  const data = mergeWithCommittedPdpData(snapshot.data);
  const signature = JSON.stringify(data);
  const committedSignature = JSON.stringify(pdpRuntime.committedData);

  if (
    snapshot.atomic ||
    (!pdpRuntime.committedData && !snapshot.fallbackUnavailable)
  ) {
    commitPdpSnapshot(widget, Component, data);
    return;
  }

  if (signature === committedSignature) {
    clearPendingPdpSnapshot();
    return;
  }

  const settleDelay = snapshot.fallbackUnavailable
    ? UNAVAILABLE_SNAPSHOT_DELAY_MS
    : DOM_SNAPSHOT_DELAY_MS;
  const now = Date.now();

  if (pdpRuntime.pendingSnapshot?.signature !== signature) {
    clearPendingPdpSnapshot();
    pdpRuntime.pendingSnapshot = { signature, data, firstSeenAt: now };
    schedulePdpSnapshotRetry(settleDelay);
    return;
  }

  const elapsed = now - pdpRuntime.pendingSnapshot.firstSeenAt;
  if (elapsed < settleDelay) {
    schedulePdpSnapshotRetry(settleDelay - elapsed);
    return;
  }

  commitPdpSnapshot(widget, Component, data);
}

function mergeWithCommittedPdpData(data) {
  if (!pdpRuntime.committedData) return data;

  const mergedData = { ...pdpRuntime.committedData };

  for (const [name, value] of Object.entries(data)) {
    if (value !== "" && value != null) mergedData[name] = value;
  }

  return mergedData;
}

function commitPdpSnapshot(widget, Component, data) {
  clearPendingPdpSnapshot();
  pdpRuntime.widget = widget;
  pdpRuntime.committedData = data;
  renderWidget(widget, Component, data);
}

function schedulePdpSnapshotRetry(delay) {
  clearTimeout(pdpRuntime.pendingTimer);
  pdpRuntime.pendingTimer = setTimeout(setupWidgets, Math.max(delay, 1));
}

function clearPendingPdpSnapshot() {
  clearTimeout(pdpRuntime.pendingTimer);
  pdpRuntime.pendingTimer = null;
  pdpRuntime.pendingSnapshot = null;
}

function reattachPdpWidget() {
  const widget = pdpRuntime.widget;
  if (!widget || widget.isConnected || !isProductPage()) return;

  const connectedWidgets = findAllElements(document, ".snapmint_widget_pdp");
  if (connectedWidgets.some((element) => !isAutomaticWidget(element))) return;

  connectedWidgets.forEach((element) => {
    if (element !== widget) removeAutomaticWidget(element);
  });

  const selectors = getConfiguredSelectors();
  const configuredTarget = findMainPdpElement(
    document,
    selectors.pdpWidgetAppendTarget,
  );
  const appendTarget = configuredTarget;

  if (configuredTarget) pdpRuntime.usesGenericPlacement = false;

  if (appendTarget)
    placeWidget(appendTarget, widget, selectors.pdpWidgetPlacement);
}

function isProductPage() {
  return /\/products\/[^/]+/.test(window.location.pathname);
}

function getCollectionContext(element, selectors) {
  try {
    return element?.closest(selectors.collectionGridItem) || null;
  } catch {
    return null;
  }
}

function isCollectionProductCard(context, selectors) {
  if (!context) return false;

  if (isProductPage()) {
    const mainProductElement =
      findFirstElement(document, selectors.pdpProductId) ||
      findFirstElement(document, selectors.pdpProductHandle) ||
      findFirstElement(document, selectors.pdpWidgetAppendTarget);

    if (mainProductElement && context.contains(mainProductElement)) {
      return false;
    }
  }

  return [
    selectors.collectionProductId,
    selectors.collectionProductHandle,
    selectors.collectionProductUrl,
  ].some((selector) => findFirstElement(context, selector));
}

function renderWidget(
  element,
  Component,
  data = readWidgetDataFromElement(element),
) {
  const props = {};

  for (const [name, value] of Object.entries(data)) {
    if (value != null) props[name] = String(value);
  }

  element.hidden = props.available === "false";

  const signature = JSON.stringify(props);
  let state = mountedWidgets.get(element);

  if (!state) {
    if (element.dataset.snapmintMounted === TRUE_DATA_VALUE) return;

    state = {
      root: createRoot(element),
      signature: "",
    };
    mountedWidgets.set(element, state);
    element.dataset.snapmintMounted = TRUE_DATA_VALUE;
  }

  if (state.signature === signature) return;

  Object.assign(element.dataset, props);
  state.signature = signature;
  state.root.render(<Component {...props} />);
}

function readWidgetDataFromElement(element) {
  const { dataset } = element;

  return {
    amount: dataset.amount,
    currency: dataset.currency,
    productId: dataset.productId,
    productHandle: dataset.productHandle,
    productName: dataset.productName,
    variantId: dataset.variantId,
    available: dataset.available,
    productUrl: dataset.productUrl,
  };
}

function isAutomaticWidget(widget) {
  return widget.dataset.snapmintAuto === TRUE_DATA_VALUE;
}

function removeAutomaticWidget(widget) {
  if (!widget || !isAutomaticWidget(widget)) return;

  if (pdpRuntime.widget === widget) {
    clearPendingPdpSnapshot();
    pdpRuntime.widget = null;
    pdpRuntime.committedData = null;
    pdpRuntime.suppressBubblingChange = false;
    pdpRuntime.eventVariant = null;
    pdpRuntime.usesGenericPlacement = false;
    pdpRuntime.eventGeneration += 1;
  } else if (cartRuntime.widget === widget) {
    cartRuntime.widget = null;
  }

  const state = mountedWidgets.get(widget);
  if (state) {
    state.root.unmount();
    mountedWidgets.delete(widget);
  }

  widget.remove();
}

import { pdpRuntime } from "./widgetRuntimes";
import {
  findMainPdpElement,
  findFirstElement,
  findAllElements,
} from "./domHelper";

export function readProductSnapshot(context, page, selectors, displayedAmount) {
  const findProductElement = (name) =>
    page.type === "pdp"
      ? findMainPdpElement(context, selectors[`${page.type}${name}`])
      : findFirstElement(context, selectors[`${page.type}${name}`]);

  const productIdElement = findProductElement("ProductId");
  const productHandleElement = findProductElement("ProductHandle");
  const productNameElement = findProductElement("ProductName");
  const variantIdElement = findProductElement("VariantId");
  const productUrlElement = findProductElement("ProductUrl");

  const soldOutElement = findProductElement("ProductAvailable");

  const payloadProduct = readProductPayload(productIdElement);
  const embeddedProduct = page.type === "pdp" ? readEmbeddedProduct() : {};
  const productUrl = readProductUrl(productUrlElement);
  const productHandle = readProductHandle(
    productHandleElement,
    productUrl,
    Object.keys(payloadProduct).length ? payloadProduct : embeddedProduct,
  );
  const productIdFromElement =
    productIdElement !== variantIdElement
      ? productIdElement?.dataset?.productId ||
        productIdElement?.value ||
        productIdElement?.textContent?.trim()
      : "";
  const productId = normalizeShopifyId(
    productIdFromElement ||
      embeddedProduct.id ||
      payloadProduct.id ||
      window.ShopifyAnalytics?.meta?.product?.id,
  );
  const canonicalVariantId = readVariantId(variantIdElement);
  const selectedVariantId = variantIdElement
    ? canonicalVariantId
    : readVariantIdFromUrl();
  const exactVariant =
    page.type === "pdp"
      ? readExactVariant(
          context,
          variantIdElement,
          selectedVariantId,
          canonicalVariantId,
          embeddedProduct,
          payloadProduct,
          productId,
          productHandle,
        )
      : null;
  const variantId = exactVariant?.id || selectedVariantId;
  const hasEmptyCanonicalSelection = Boolean(
    page.type === "pdp" && variantIdElement && !canonicalVariantId,
  );
  const isTransitioning = Boolean(
    page.type === "pdp" &&
      variantIdElement &&
      canonicalVariantId &&
      selectedVariantId &&
      selectedVariantId !== canonicalVariantId,
  );
  const explicitAvailability =
    page.type === "pdp" && !hasEmptyCanonicalSelection
      ? readDomVariantAvailability(context, variantIdElement, variantId)
      : null;
  const exactAvailability = exactVariant?.available ?? explicitAvailability;
  const fallbackUnavailable =
    exactAvailability == null &&
    (hasEmptyCanonicalSelection || isUnavailableElement(soldOutElement));
  const availabilityUnknown =
    exactAvailability == null &&
    (isTransitioning || isLoadingElement(soldOutElement));
  const available = availabilityUnknown
    ? pdpRuntime.committedData?.available || "true"
    : fallbackUnavailable || exactAvailability === false
      ? "false"
      : "true";

  const fallbackAmount = pdpRuntime.committedData?.amount || 0;
  const rawAmount =
    exactVariant && exactVariant.price != null
      ? exactVariant.price
      : displayedAmount || fallbackAmount;
  const amount =
    available === "false" && !displayedAmount ? fallbackAmount : rawAmount;
  const currency = window.Shopify?.currency?.active || "";

  let productName =
    productNameElement?.textContent?.trim() ||
    payloadProduct.title ||
    embeddedProduct.title ||
    "";
  if (productName && exactVariant && exactVariant.title !== "Default Title") {
    productName = `${productName} - ${exactVariant.title}`;
  }

  return {
    fallbackUnavailable,
    data: {
      amount,
      currency,
      productId,
      productHandle,
      productName,
      variantId,
      available,
      productUrl,
    },
  };
}

export function readEmbeddedProduct() {
  const scriptElement = document.querySelector(
    "[id^='ProductJson-'], [data-product-json]",
  );
  if (!scriptElement) return {};

  if (scriptElement !== window.snapmintEmbeddedProductElement) {
    try {
      window.snapmintEmbeddedProductData = JSON.parse(
        scriptElement.textContent || "",
      );
      window.snapmintEmbeddedProductElement = scriptElement;
    } catch {
      window.snapmintEmbeddedProductData = {};
    }
  }

  return window.snapmintEmbeddedProductData || {};
}

export function readExactVariant(
  context,
  variantIdElement,
  selectedVariantId,
  canonicalVariantId,
  embeddedProduct,
  payloadProduct,
  productId,
  productHandle,
) {
  const variants = embeddedProduct.variants || payloadProduct.variants || [];
  let exactVariant = variants.find(
    (variant) => String(variant.id) === selectedVariantId,
  );

  if (exactVariant) return exactVariant;

  const titleOptionElement = findFirstElement(
    context,
    "input[name='title'], [name='title']",
  );
  const options = [];

  for (let i = 1; i <= 3; i++) {
    const inputName = `options[Option${i}]`;
    const optionElement =
      findFirstElement(context, `input[name='${inputName}']:checked`) ||
      findFirstElement(
        context,
        `[name='${inputName}'], [id^='Option-'][id$='-${i}']`,
      ) ||
      (i === 1 ? titleOptionElement : null);
    if (!optionElement) break;

    const optionValue = optionElement.value || optionElement.textContent || "";
    options.push(optionValue.trim());
  }

  if (options.length) {
    const optionMatch = variants.find((variant) =>
      options.every((option, index) => variant.options[index] === option),
    );
    if (optionMatch) exactVariant = optionMatch;
  }

  if (
    exactVariant &&
    productId &&
    exactVariant.product_id &&
    String(exactVariant.product_id) !== productId
  ) {
    return null;
  }

  if (
    exactVariant &&
    productHandle &&
    exactVariant.product_handle &&
    exactVariant.product_handle !== productHandle
  ) {
    return null;
  }

  // Filter out any fallback variant matching the selection if it is not
  // actually canonical for the current DOM selection.
  if (
    exactVariant &&
    variantIdElement &&
    canonicalVariantId &&
    String(exactVariant.id) !== canonicalVariantId
  ) {
    return null;
  }

  return exactVariant;
}

export function readVariantId(element) {
  if (!element) return "";

  if (["INPUT", "SELECT", "OPTION"].includes(element.tagName)) {
    return normalizeShopifyId(element.value);
  }

  return normalizeShopifyId(
    element.dataset?.variantId ||
      element.getAttribute("data-current-variant-id") ||
      element.value ||
      element.textContent?.trim(),
  );
}

export function readVariantIdFromUrl() {
  return normalizeShopifyId(
    new URLSearchParams(window.location.search).get("variant"),
  );
}

export function readDomVariantAvailability(
  context,
  variantIdElement,
  variantId,
) {
  const selectedOption = variantIdElement?.selectedOptions?.[0];
  const candidates = [
    variantIdElement,
    selectedOption,
    ...findAllElements(
      context,
      "[data-current-variant-id][data-variant-available], " +
        "[data-variant-id][data-available], " +
        "sticky-add-to-cart[data-variant-available]",
    ),
  ];

  for (const element of candidates) {
    if (!element) continue;
    if (
      element === pdpRuntime.widget ||
      element.closest?.(".snapmint_widget_pdp")
    ) {
      continue;
    }

    const elementVariantId = normalizeShopifyId(
      element.dataset?.currentVariantId || element.dataset?.variantId,
    );

    if (elementVariantId && elementVariantId !== variantId) {
      continue;
    }

    const available = readBoolean(
      element.dataset?.variantAvailable ?? element.dataset?.available,
    );

    if (available != null) return available;
  }

  return null;
}

export function readBoolean(value) {
  if (typeof value === "boolean") return value;
  if (value === "true") return true;
  if (value === "false") return false;
  return null;
}

export function isUnavailableElement(element) {
  if (!element) return false;

  if (element.matches("button, input, select")) {
    return (
      element.disabled ||
      element.getAttribute("aria-disabled") === "true" ||
      element.dataset.available === "false"
    );
  }

  return true;
}

export function isLoadingElement(element) {
  return Boolean(
    element?.matches(
      "[aria-busy='true'], [data-loading='true'], .loading, .is-loading",
    ) ||
    element?.closest(
      "[aria-busy='true'], [data-loading='true'], .loading, .is-loading",
    ),
  );
}

export function readProductPayload(element) {
  try {
    const payload = element?.getAttribute("view-event-payload");
    return payload ? JSON.parse(payload).product || {} : {};
  } catch {
    return {};
  }
}

export function readProductUrl(element) {
  const text = element?.textContent?.trim() || "";
  return (
    element?.dataset?.productUrl ||
    element?.getAttribute("href") ||
    (/^(https?:\/\/|\/)/.test(text) ? text : "")
  );
}

export function readProductHandle(handleElement, productUrl, payloadProduct) {
  const handleUrl =
    handleElement?.getAttribute("href") ||
    productUrl ||
    window.location.pathname;
  const handleFromUrl = handleUrl.split("/products/")[1]?.split(/[?#]/)[0];

  return (
    handleElement?.dataset?.productHandle ||
    handleFromUrl ||
    payloadProduct.handle ||
    handleElement?.textContent?.trim() ||
    ""
  );
}

export function normalizeShopifyId(value) {
  const id = String(value || "");
  return id.includes("gid://shopify/") ? id.split("/").pop() : id;
}

export function parseMinorUnitAmount(value) {
  const amount = Number(value);
  return Number.isFinite(amount) && amount > 0 ? Math.round(amount) : 0;
}

export function parseDecimalAmountInMinorUnits(value) {
  const amount = Number(value);
  return Number.isFinite(amount) && amount > 0 ? Math.round(amount * 100) : 0;
}

export function parsePriceInMinorUnits(element) {
  const priceText = (element?.textContent || "").replace(/[^0-9.,]/g, "");
  const separatorIndex = Math.max(
    priceText.lastIndexOf("."),
    priceText.lastIndexOf(","),
  );
  const hasDecimals =
    separatorIndex > -1 && priceText.length - separatorIndex - 1 === 2;
  const wholeValue = (
    hasDecimals ? priceText.slice(0, separatorIndex) : priceText
  ).replace(/[.,]/g, "");
  const decimals = hasDecimals ? `.${priceText.slice(separatorIndex + 1)}` : "";
  const amount = Number.parseFloat(`${wholeValue}${decimals}`);

  return amount ? Math.round(amount * 100) : 0;
}

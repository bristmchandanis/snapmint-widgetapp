import { parseMerchantPlans } from './helpers';
import {
    DEFAULT_INLINE_CONFIG,
    DEFAULT_MASTER_CONFIG,
    INNER_COLOR_FIELDS,
    MASTER_COLOR_FIELDS,
    TAB_CONFIGS,
    AUTO_SETUP_FIELDS,
} from './moduleData';

const INNER_COLOR_KEYS = INNER_COLOR_FIELDS.map((f) => f.key);
const MASTER_COLOR_KEYS = MASTER_COLOR_FIELDS.map((f) => f.key);

export const safeJsonParse = (val, fallback = {}) => {
    if (typeof val === 'object' && val !== null) return val;
    if (typeof val === 'string' && val.trim()) {
        try { return JSON.parse(val); } catch { }
    }
    return fallback;
};

export const isMasterTwo = (templateId) => templateId === 'master_2' || templateId === '2';

export const extractPlacements = (customization = {}) => {
    const placements = safeJsonParse(customization?.placements, null);
    if (Array.isArray(placements) && placements.length > 0) return placements;

    const activeLocations = TAB_CONFIGS
        .filter((tab) => customization?.[tab.field])
        .map((tab) => tab.code);

    return activeLocations.length > 0 ? activeLocations : [customization?.placement || 'PDP'];
};

const resolvePlacementsAndFlags = (source = {}) => {
    const placements = extractPlacements(source);
    const displayFlags = Object.fromEntries(TAB_CONFIGS.map((t) => [t.field, placements.includes(t.code)]));
    return { placements, displayFlags };
};

const resolvePlanDetails = (config, merchantPlans = []) => {
    const isCustom = Boolean(config.isCustomRange);
    const firstPlan = merchantPlans[0] || {};
    const minAmount = config.minAmount != null ? Number(config.minAmount) : (firstPlan.min ?? 199);
    const maxAmount = config.maxAmount != null ? Number(config.maxAmount) : (firstPlan.max ?? 200000);

    const matchedPlan = !isCustom
        ? (merchantPlans.find((p) => p.min === minAmount && p.max === maxAmount) || firstPlan)
        : {};

    const active = isCustom ? config : { ...matchedPlan, ...config };

    return {
        minAmount,
        maxAmount,
        isCustomRange: isCustom,
        tenure: active.tenure != null ? Number(active.tenure) : null,
        dpPercent: active.dpPercent != null ? Number(active.dpPercent) : null,
        dpType: active.dpType || null,
        emiPercent: active.emiPercent != null ? Number(active.emiPercent) : null,
    };
};

export const buildConfigFromStyle = (templateId = 'master_1', styleObj = {}, extra = {}) => {
    const rawCombined = { ...styleObj, ...extra };
    const inlineWidgetConfigObj = safeJsonParse(rawCombined.inlineWidgetConfig);
    const masterPopupConfigObj = safeJsonParse(rawCombined.masterPopupConfig);
    const { innerLayoutColors = {}, masterPopupColors = {} } = safeJsonParse(rawCombined.colorConfig || rawCombined.shop?.colorConfig);
    const combined = { ...inlineWidgetConfigObj, ...masterPopupConfigObj, ...rawCombined, ...innerLayoutColors, ...masterPopupColors };

    const { placements, displayFlags } = resolvePlacementsAndFlags(combined);
    const planDetails = resolvePlanDetails(combined, parseMerchantPlans(combined));
    const isM2 = isMasterTwo(templateId);
    const customizationId = combined.customizationId ?? combined.id;

    return {
        ...DEFAULT_INLINE_CONFIG,
        ...DEFAULT_MASTER_CONFIG,
        ...combined,
        layoutType: combined.layoutType || DEFAULT_INLINE_CONFIG.layoutType,
        ...displayFlags,
        customizationId,
        id: customizationId,
        masterTemplateLayout: templateId,
        allowMerchantCustomization: !['0', 0].includes(combined.allowCustomization) && !['0', 0].includes(combined.allowMerchantCustomization),
        placement: combined.placement || placements[0] || 'PDP',
        placements,
        ...planDetails,
        expressCheckoutEnabled: combined.expressCheckoutEnabled !== false,
        discountSupportEnabled: combined.discountSupportEnabled !== false,
        pdpWidgetPlacement: combined.pdpWidgetPlacement || 'after',
        titleText: combined.titleText || 'Pay Later',
        logoUrl: combined.logoUrl || '',
        buttonText: combined.buttonText || 'Pay only ₹{amount} Now',
        badgeText: isM2 ? (combined.badgeText || '& pay the rest in No Cost EMIs') : '',
        footerText: combined.footerText || (isM2 ? 'Select Merchant Pay Later during checkout' : 'Select Merchant Pay Later on the payment screen'),
        step1Text: isM2 ? '' : (combined.step1Text || 'Pay Now'),
        feature1Text: combined.feature1Text || '0% Interest Installments',
        feature2Text: combined.feature2Text || '0 Extra Cost',
        feature3Text: combined.feature3Text || 'UPI & Cards accepted',
    };
};

export const extractAutoSetupPayload = (config = {}, selectedShop = {}) => {
    const payload = {
        ...(selectedShop.id ? { shopId: selectedShop.id } : {}),
        ...(selectedShop.myshopifyDomain ? { myshopifyDomain: selectedShop.myshopifyDomain } : {}),
    };

    AUTO_SETUP_FIELDS.forEach((field) => {
        if (config?.[field] !== undefined && config?.[field] !== '') {
            payload[field] = config[field];
        }
    });

    return payload;
};

export const buildSavePayload = (config, selectedShop, masterTemplateId, editId) => {
    const { placements, displayFlags } = resolvePlacementsAndFlags(config);
    const activeId = editId ? Number(editId) : (config.customizationId || config.id || undefined);
    const planDetails = resolvePlanDetails(config, parseMerchantPlans(selectedShop));
    const inlineWidgetConfig = extractColorDefaults(DEFAULT_INLINE_CONFIG, config, INNER_COLOR_KEYS);
    const masterWidgetConfig = extractColorDefaults(DEFAULT_MASTER_CONFIG, config, MASTER_COLOR_KEYS);
    const autoSetupFields = extractAutoSetupPayload(config, selectedShop);

    return {
        ...(activeId ? { id: activeId, customizationId: activeId } : {}),
        masterTemplateLayout: masterTemplateId,
        placement: placements[0] || 'PDP',
        placements,
        ...displayFlags,
        allowCustomization: config.allowMerchantCustomization ? '1' : '0',
        overrideDuplicateRange: Boolean(config.overrideDuplicateRange),
        ...planDetails,
        expressCheckoutEnabled: config.expressCheckoutEnabled !== false,
        discountSupportEnabled: config.discountSupportEnabled !== false,
        layoutType: inlineWidgetConfig.layoutType,
        inlineWidgetConfig,
        masterPopupConfig: masterWidgetConfig,
        ...autoSetupFields,
    };
};

export const parseCustomizationResponse = (resData, id, currentShop = null) => {
    const raw = resData?.customization || {};
    const metafieldVal = safeJsonParse(raw.metafield?.value);
    const shopObj = raw.shop || currentShop;
    const colorConfig = shopObj?.colorConfig || shopObj?.color_config;
    const fetched = { colorConfig, shop: shopObj, ...metafieldVal, ...raw, ...resData?.style };
    const templateId = fetched.masterTemplateLayout || 'master_1';

    let parsedPlacements = safeJsonParse(fetched.placements, ['PDP', 'CART']);
    if (!Array.isArray(parsedPlacements)) parsedPlacements = ['PDP', 'CART'];

    const combinedData = {
        ...fetched,
        id: raw.id || id,
        customizationId: raw.id || id,
        placements: parsedPlacements,
    };

    const builtConfig = buildConfigFromStyle(templateId, combinedData, shopObj);

    return {
        templateId,
        config: builtConfig,
        shop: shopObj,
    };
};

export const extractColorDefaults = (defaultObj = {}, existingObj = {}, excludeKeys = []) =>
    Object.fromEntries(
        Object.keys(defaultObj)
            .filter((k) => !excludeKeys.includes(k))
            .map((k) => [
                k,
                existingObj?.[k] !== undefined ? existingObj[k] : defaultObj[k],
            ])
    );

export const formatLayoutProps = (props = {}) => {
    const {
        isNewBadge,
        newBadgeText,
        isDiscountBadge,
        discountBadgeText,
        isUpiBranding,
        isBranding,
        samplePrice: rawSamplePrice = '₹499',
        type,
        pricePrefixText = '',
        priceText = '{price}/month',
        secondaryEmiOptionText = '({tenure} months)',
        secondaryEmiOptionTextColor,
        emiOptionText = '{tenure} months EMI options',
        emiOptionTextColor = '#1B1B1B',
        secondaryEmiText = '',
        layoutType = '',
    } = props;

    const isMinimal = layoutType.toLowerCase().includes('minimal');
    const isSingle = Boolean(type && !String(type).includes('/'));

    const showNewBadge = isNewBadge !== false && Boolean(newBadgeText?.trim());
    const showDiscountBadge = isDiscountBadge !== false && Boolean(discountBadgeText?.trim());
    const showUpi = Boolean(isUpiBranding);
    const showBranding = isBranding !== false;

    const prefix = pricePrefixText !== undefined && pricePrefixText !== null
        ? pricePrefixText.trim()
        : (isMinimal ? 'Pay' : (isSingle ? 'Or' : ''));

    const pricePattern = (!priceText || priceText === '{price}/month') && isMinimal ? '{price}/mo' : (priceText || '{price}/month');
    const priceDisplay = pricePattern.includes('{price}') ? pricePattern.replace(/₹?\{price\}/g, rawSamplePrice) : pricePattern;

    const defaultEmiText = isMinimal ? 'No Cost EMI with' : '{tenure} months EMI options';
    const rawEmiText = !emiOptionText || emiOptionText === '{tenure} months EMI options' ? defaultEmiText : emiOptionText;

    const emiText = isSingle
        ? (secondaryEmiOptionText || '({tenure} months)').replace('{tenure}', type)
        : rawEmiText.replace('{tenure}', type || '');

    const emiColor = isSingle ? (secondaryEmiOptionTextColor || emiOptionTextColor) : emiOptionTextColor;
    const secondary = secondaryEmiText ? secondaryEmiText.trim() : '';
    const upiText = showUpi ? (secondary ? (/upi/i.test(secondary) ? secondary : `${secondary} on UPI`) : 'on UPI') : '';

    return {
        ...props,
        showNewBadge,
        showDiscountBadge,
        showUpi,
        showBranding,
        samplePrice: rawSamplePrice,
        isSingle,
        prefix,
        priceDisplay,
        emiText,
        emiColor,
        secondary,
        upiText,
    };
};

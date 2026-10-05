import { z } from 'zod';
import { validateForm, validateField } from './authValidation';

export const cleanShopDomain = (domainStr) => {
  if (!domainStr) return '';
  return domainStr
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//i, '')
    .replace(/\/.*$/, '');
};

export const merchantSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Enter the merchant's name." }),
  merchantId: z
    .string()
    .trim()
    .min(1, { message: "Enter the merchant's assigned ID." }),
  shop: z
    .string()
    .min(1, { message: "Enter a valid store address (e.g. store.myshopify.com)." })
    .transform((val) => cleanShopDomain(val))
    .refine((val) => val.length >= 2, {
      message: 'Enter a valid store address (e.g. store.myshopify.com).',
    }),
  brandingMode: z.string().optional(),
});

export const validateMerchantForm = (data, existingMerchants = [], currentId = null) => {
  const normalizedData = {
    ...data,
    shop: cleanShopDomain(data.shop || ''),
  };
  const result = validateForm(merchantSchema, normalizedData);
  if (!result.isValid) return result;

  const isDuplicate = existingMerchants?.some((m) => {
    const mShop = cleanShopDomain(m.shop || m.myshopifyDomain || '');
    const mId = m.id || m._id;
    const curId = currentId || data.id;
    return mShop === normalizedData.shop && (!curId || String(mId) !== String(curId));
  });

  if (isDuplicate) {
    return {
      isValid: false,
      errors: {
        ...result.errors,
        shop: 'This Shopify store URL is already registered. Please enter a unique URL.',
      },
    };
  }

  return result;
};

export const validateMerchantField = (fieldName, value, existingMerchants = [], currentId = null) => {
  if (fieldName === 'shop') {
    const cleaned = cleanShopDomain(value);
    const err = validateField(merchantSchema, fieldName, cleaned);
    if (err) return err;

    const isDuplicate = existingMerchants?.some((m) => {
      const mShop = cleanShopDomain(m.shop || m.myshopifyDomain || '');
      const mId = m.id || m._id;
      return mShop === cleaned && (!currentId || String(mId) !== String(currentId));
    });

    if (isDuplicate) {
      return 'This Shopify store URL is already registered. Please enter a unique URL.';
    }
    return null;
  }
  return validateField(merchantSchema, fieldName, value);
};

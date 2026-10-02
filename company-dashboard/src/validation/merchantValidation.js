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

export const validateMerchantForm = (data) => {
  const normalizedData = {
    ...data,
    shop: cleanShopDomain(data.shop || ''),
  };
  return validateForm(merchantSchema, normalizedData);
};

export const validateMerchantField = (fieldName, value) => {
  if (fieldName === 'shop') {
    value = cleanShopDomain(value);
  }
  return validateField(merchantSchema, fieldName, value);
};

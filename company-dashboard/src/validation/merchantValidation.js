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
  shop: z
    .string()
    .min(1, { message: 'Shop domain or name is required' })
    .transform((val) => cleanShopDomain(val))
    .refine((val) => val.length >= 2, {
      message: 'Please enter a valid shop domain or name',
    }),
  merchantId: z
    .string()
    .trim()
    .min(1, { message: 'Merchant ID is required' })
    .min(2, { message: 'Merchant ID must be at least 2 characters long' }),
  token: z
    .string()
    .trim()
    .min(1, { message: 'Snapmint token is required' })
    .min(3, { message: 'Token must be at least 3 characters long' }),
});

export const validateMerchantForm = (data) => {
  const normalizedData = {
    ...data,
    shop: cleanShopDomain(data.shop),
    merchantId: data.merchantId || data.mid || '',
  };
  return validateForm(merchantSchema, normalizedData);
};

export const validateMerchantField = (fieldName, value) => {
  if (fieldName === 'shop') {
    value = cleanShopDomain(value);
  }
  const targetField = fieldName === 'mid' ? 'merchantId' : fieldName;
  return validateField(merchantSchema, targetField, value);
};

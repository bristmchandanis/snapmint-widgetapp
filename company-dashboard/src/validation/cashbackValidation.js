import { z } from 'zod';
import { validateForm } from './authValidation';

export const cashbackOfferSchema = z
  .object({
    shopId: z
      .union([z.string(), z.number()])
      .refine((val) => Boolean(val && String(val).trim() !== ''), {
        message: 'Please select a store to proceed',
      }),
    title: z
      .string({ required_error: 'Campaign title is required' })
      .trim()
      .min(1, { message: 'Campaign title is required' }),
    cashbackValue: z
      .union([z.string(), z.number()])
      .transform((val) => (val === '' || val === null || val === undefined ? NaN : Number(val)))
      .refine((val) => !isNaN(val) && val > 0, {
        message: 'Cashback amount is required and must be greater than 0',
      }),
    startDate: z
      .union([z.string(), z.null(), z.undefined()])
      .transform((val) => (val ? String(val).trim() : ''))
      .refine((val) => val.length > 0, {
        message: 'Start date is required',
      }),
    endDate: z
      .union([z.string(), z.null(), z.undefined()])
      .transform((val) => (val ? String(val).trim() : ''))
      .refine((val) => val.length > 0, {
        message: 'End date is required',
      }),
    cashbackCreditDays: z
      .union([z.string(), z.number(), z.null(), z.undefined()])
      .transform((val) => (val === '' || val === null || val === undefined ? null : Number(val)))
      .refine((val) => val === null || (!isNaN(val) && val >= 7 && val <= 30), {
        message: 'Cashback credit days must be between 7 and 30 days',
      }),
  })
  .passthrough()
  .superRefine((data, ctx) => {
    if (data.startDate && data.endDate) {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end < start) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'End date cannot be earlier than start date',
          path: ['endDate'],
        });
      }
    }
  });

export const validateCashbackForm = (formData) => {
  return validateForm(cashbackOfferSchema, formData);
};

export const validateCashbackField = (fieldName, value, fullFormData = {}) => {
  const mergedData = { ...fullFormData, [fieldName]: value };
  const formValidation = validateForm(cashbackOfferSchema, mergedData);
  return formValidation.errors[fieldName] || null;
};

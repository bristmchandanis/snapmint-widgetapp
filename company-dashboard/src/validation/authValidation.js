import { z } from 'zod';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .regex(EMAIL_REGEX, { message: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(1, { message: 'Password is required' })
    .regex(
      PASSWORD_REGEX,
      { message: 'Password must be 8+ characters with uppercase, lowercase, number & symbol (@$!%*?&)' }
    ),
});

export const registerSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Full name is required' })
    .min(2, { message: 'Full name must be at least 2 characters' }),
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .regex(EMAIL_REGEX, { message: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(1, { message: 'Password is required' })
    .regex(
      PASSWORD_REGEX,
      { message: 'Must be 8+ chars with uppercase, lowercase, number & symbol (@$!%*?&)' }
    ),
  role: z
    .string()
    .min(1, { message: 'Role is required' }),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, { message: 'Current password is required' }),
    newPassword: z
      .string()
      .min(1, { message: 'New password is required' })
      .regex(
        PASSWORD_REGEX,
        { message: 'Must be 8+ chars with uppercase, lowercase, number & symbol (@$!%*?&)' }
      ),
    confirmPassword: z
      .string()
      .min(1, { message: 'Please confirm your new password' }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const validateForm = (schema, data) => {
  const result = schema.safeParse(data);
  if (result.success) return { isValid: true, errors: {} };

  const errors = {};
  result.error.issues.forEach((issue) => {
    const fieldName = issue.path[0];
    if (!errors[fieldName]) {
      errors[fieldName] = issue.message;
    }
  });

  return { isValid: false, errors };
};

export const validateField = (schema, fieldName, value) => {
  const fieldSchema = schema.shape[fieldName];
  if (!fieldSchema) return null;
  const result = fieldSchema.safeParse(value);
  return result.success ? null : result.error.issues[0]?.message || null;
};

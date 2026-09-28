import { useState } from 'react';
import { validateForm, validateField } from '../validation/authValidation';

export function useAuthForm(initialState, schema) {
  const [formData, setFormData] = useState(initialState);
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    const fieldError = validateField(schema, name, value);
    setFieldErrors((prev) => ({
      ...prev,
      [name]: fieldError || '',
    }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const fieldError = validateField(schema, name, value);
    setFieldErrors((prev) => ({
      ...prev,
      [name]: fieldError || '',
    }));
  };

  const handleSubmit = (onSubmitAction) => async (e) => {
    e.preventDefault();

    const validation = validateForm(schema, formData);
    if (!validation.isValid) {
      setFieldErrors(validation.errors);
      return;
    }

    setFieldErrors({});
    setLoading(true);

    try {
      await onSubmitAction(formData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = (newValues = initialState) => {
    setFormData(newValues);
    setFieldErrors({});
  };

  return {
    formData,
    fieldErrors,
    loading,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFormData,
    setFieldErrors,
  };
}

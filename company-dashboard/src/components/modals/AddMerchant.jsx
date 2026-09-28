import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { apiService } from '../../utils/constants';
import { validateMerchantForm, cleanShopDomain } from '../../validation/merchantValidation';
import FormModal from '../common/FormModal';
import FormField from '../common/FormField';
import { IconBuilding } from '../common/Icons';

export default function AddMerchant({ open, onOpenChange, initialData = null, onMerchantAdded, disabled = false, readOnly = false }) {
  const [formData, setFormData] = useState({ shop: '', merchantId: '', token: '' });
  const [errors, setErrors] = useState({ shop: '', merchantId: '', token: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        shop: initialData.shop || initialData.myshopifyDomain || '',
        merchantId: initialData.merchantId || initialData.mid || '',
        token: initialData.token || initialData.merchantToken || '',
      });
    } else {
      setFormData({ shop: '', merchantId: '', token: '' });
    }
    setErrors({ shop: '', merchantId: '', token: '' });
  }, [initialData, open]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleClose = (isOpen) => {
    if (!isOpen) {
      setFormData({ shop: '', merchantId: '', token: '' });
      setErrors({ shop: '', merchantId: '', token: '' });
    }
    onOpenChange(isOpen);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (readOnly) { handleClose(false); return; }

    const { isValid, errors: validationErrors } = validateMerchantForm(formData);
    if (!isValid) { setErrors(validationErrors); return; }

    const sanitizedShop = cleanShopDomain(formData.shop);
    const trimmedMerchantId = formData.merchantId.trim();
    const trimmedToken = formData.token.trim();

    setSubmitting(true);
    try {
      const isEdit = Boolean(initialData);
      const res = isEdit
        ? await apiService.updateMerchantCredential({
          id: initialData.id,
          shop: sanitizedShop,
          merchantId: trimmedMerchantId,
          token: trimmedToken,
        })
        : await apiService.addMerchantCredential({
          shop: sanitizedShop,
          merchantId: trimmedMerchantId,
          token: trimmedToken,
        });

      if (res?.success) {
        toast.success(
          res.message || (isEdit ? 'Merchant credential updated successfully!' : 'Merchant credential added successfully!')
        );
        if (onMerchantAdded) onMerchantAdded();
        handleClose(false);
      } else {
        toast.error(res?.message || 'Failed to save merchant credential.');
      }
    } catch (err) {
      toast.error(err?.message || 'Failed to connect to server.');
    } finally {
      setSubmitting(false);
    }
  };

  const isEditMode = Boolean(initialData);

  return (
    <FormModal
      open={open}
      onClose={() => handleClose(false)}
      title={readOnly ? 'View Merchant Credentials' : isEditMode ? 'Edit Merchant Credentials' : 'Add Merchant Details'}
      icon={IconBuilding}
      onSubmit={handleSubmit}
      loading={submitting}
      submitDisabled={disabled || readOnly}
      readOnly={readOnly}
      submitText="Save"
    >
      <FormField
        id="shop"
        name="shop"
        label="Shop Domain"
        placeholder="e.g. store.myshopify.com"
        value={formData.shop}
        error={errors.shop}
        required
        disabled={submitting || isEditMode || readOnly}
        onChange={(e) => handleInputChange('shop', e.target.value)}
      />

      <FormField
        id="merchantId"
        name="merchantId"
        label="Merchant ID"
        placeholder="e.g. Merchant_1024"
        value={formData.merchantId}
        error={errors.merchantId}
        required
        disabled={submitting || readOnly}
        onChange={(e) => handleInputChange('merchantId', e.target.value)}
      />

      <FormField
        id="token"
        name="token"
        label="Snapmint Token"
        placeholder="e.g. 11A1CZ0..."
        value={formData.token}
        error={errors.token}
        required
        disabled={submitting || readOnly}
        onChange={(e) => handleInputChange('token', e.target.value)}
      />
    </FormModal>
  );
}

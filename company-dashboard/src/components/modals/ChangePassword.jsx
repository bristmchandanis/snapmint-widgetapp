import { useState } from 'react';
import { toast } from 'sonner';
import { apiService } from '../../utils/constants';
import { changePasswordSchema, validateForm } from '../../validation/authValidation';
import FormModal from '../common/FormModal';
import FormField from '../common/FormField';
import { IconLock } from '../common/Icons';

export default function ChangePassword({ open, onClose }) {
  const [formData, setFormData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [errors, setErrors] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleClose = () => {
    setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setErrors({ currentPassword: '', newPassword: '', confirmPassword: '' });
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { isValid, errors: validationErrors } = validateForm(changePasswordSchema, formData);
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await apiService.changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      if (res.success) {
        toast.success('Password updated successfully!');
        handleClose();
      } else {
        toast.error(res.message || 'Failed to update password.');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormModal
      open={open}
      onClose={handleClose}
      title="Change Account Password"
      onSubmit={handleSubmit}
      loading={loading}
      submitText="Update Password"
    >
      <FormField
        id="currentPassword"
        name="currentPassword"
        label="Current Password"
        type="password"
        placeholder="••••••••"
        value={formData.currentPassword}
        error={errors.currentPassword}
        icon={IconLock}
        required
        disabled={loading}
        onChange={(e) => handleInputChange('currentPassword', e.target.value)}
      />
      <FormField
        id="newPassword"
        name="newPassword"
        label="New Password"
        type="password"
        placeholder="••••••••"
        value={formData.newPassword}
        error={errors.newPassword}
        icon={IconLock}
        required
        disabled={loading}
        onChange={(e) => handleInputChange('newPassword', e.target.value)}
      />
      <FormField
        id="confirmPassword"
        name="confirmPassword"
        label="Password Confirmation"
        type="password"
        placeholder="••••••••"
        value={formData.confirmPassword}
        error={errors.confirmPassword}
        icon={IconLock}
        required
        disabled={loading}
        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
      />
    </FormModal>
  );
}

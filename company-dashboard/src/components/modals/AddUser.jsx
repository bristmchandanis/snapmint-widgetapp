import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { apiService } from '../../utils/constants';
import { registerSchema, validateField } from '../../validation/authValidation';
import { useAuthForm } from '../../hooks/useAuthForm';
import FormModal from '../common/FormModal';
import FormField from '../common/FormField';
import SimpleSelect from '../common/SimpleSelect';
import { IconUser, IconMail, IconLock } from '../common/Icons';
import { Label } from '@/components/ui/label';

export default function AddUser({ open, onClose, onUserAdded }) {
  const { formData, fieldErrors, loading, handleChange, handleBlur, handleSubmit, resetForm, setFormData, setFieldErrors } =
    useAuthForm({ name: '', email: '', password: '', role: '' }, registerSchema);

  const [rolesList, setRolesList] = useState([]);

  // Fetch created roles when modal opens
  useEffect(() => {
    if (open) {
      const fetchRoles = async () => {
        try {
          const res = await apiService.getRoles();
          if (res?.success && Array.isArray(res.roles)) {
            setRolesList(res.roles);
          }
        } catch (err) {
          console.warn('Failed to load roles in AddUser modal:', err.message);
        }
      };
      fetchRoles();
    }
  }, [open]);

  const handleRoleSelect = (value) => {
    setFormData((prev) => ({ ...prev, role: value }));
    const fieldError = validateField(registerSchema, 'role', value);
    setFieldErrors((prev) => ({
      ...prev,
      role: fieldError || '',
    }));
  };

  const handleSaveUser = async (data) => {
    try {
      const res = await apiService.register(data);

      if (res.success) {
        toast.success(res.message || `Member ${data.name} added successfully!`);
        resetForm({ name: '', email: '', password: '', role: '' });
        if (onUserAdded) onUserAdded();
        onClose();
      } else {
        toast.error(res.message || 'Failed to create user account.');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to connect to server.');
    }
  };

  const handleClose = () => {
    resetForm({ name: '', email: '', password: '', role: '' });
    onClose();
  };

  return (
    <FormModal
      open={open}
      onClose={handleClose}
      title="Add Team Member"
      onSubmit={handleSubmit(handleSaveUser)}
      loading={loading}
      submitText="Save"
    >
      <FormField
        id="add-user-name"
        name="name"
        label="Full Name"
        type="text"
        placeholder="John Doe"
        value={formData.name}
        error={fieldErrors.name}
        icon={IconUser}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      <FormField
        id="add-user-email"
        name="email"
        label="Email Address"
        type="email"
        placeholder="john@example.com"
        value={formData.email}
        error={fieldErrors.email}
        icon={IconMail}
        autoComplete="off"
        onChange={handleChange}
        onBlur={handleBlur}
      />
      <FormField
        id="add-user-password"
        name="password"
        label="Password"
        type="password"
        placeholder="••••••••"
        value={formData.password}
        error={fieldErrors.password}
        icon={IconLock}
        autoComplete="new-password"
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <div className="space-y-1.5 pt-1 text-left">
        <Label htmlFor="user-role-select" className="text-xs font-semibold text-gray-700 block">
          Role <span className="text-red-500 ml-0.5">*</span>
        </Label>
        <SimpleSelect
          id="user-role-select"
          value={formData.role}
          onValueChange={handleRoleSelect}
          options={rolesList.map((roleItem) => ({ value: roleItem.name, label: roleItem.name }))}
          placeholder="Select Role"
          emptyMessage="No roles created"
          error={fieldErrors.role}
        />
      </div>
    </FormModal>
  );
}

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { IconSpinner, IconChevronDown } from '../common/Icons';
import FormField from '../common/FormField';
import { apiService } from '../../utils/constants';

export const AVAILABLE_MODULES = [
  { id: 'stores', name: 'Stores Management' },
  { id: 'merchantOnboard', name: 'Merchant Onboarding' },
  { id: 'widgetCustomization', name: 'Widget Customization' },
  { id: 'cashbackOffer', name: 'Cashback & Offer' },
];

export const parseRoleBadges = (permissions = {}) => {
  return AVAILABLE_MODULES.filter((moduleItem) => {
    const perms = permissions[moduleItem.id];
    return perms && (perms.read || perms.write || perms.edit);
  }).map((moduleItem) => {
    const perms = permissions[moduleItem.id] || {};
    const rights = ['read', 'write', 'edit']
      .filter((type) => perms[type])
      .map((type) => type.charAt(0).toUpperCase() + type.slice(1))
      .join(', ');
    return { moduleName: moduleItem.name, rights: rights };
  });
};

export default function RoleForm({ editingRole, onSaved }) {
  const [roleName, setRoleName] = useState(editingRole?.name || '');
  const [modulePermissions, setModulePermissions] = useState(editingRole?.permissions || {});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [savingRole, setSavingRole] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleModuleToggle = (moduleId) => {
    setModulePermissions((previousPermissions) => {
      const isSelected = previousPermissions[moduleId] !== undefined;
      if (isSelected) {
        const nextPermissions = { ...previousPermissions };
        delete nextPermissions[moduleId];
        return nextPermissions;
      }
      return { ...previousPermissions, [moduleId]: { read: true, write: false, edit: false } };
    });
  };

  const handlePermissionToggle = (moduleId, permType) => {
    setModulePermissions((previousPermissions) => {
      const current = previousPermissions[moduleId] || { read: false, write: false, edit: false };
      const newValue = !current[permType];
      const updatedModule = { ...current, [permType]: newValue };

      if (newValue && permType !== 'read') {
        updatedModule.read = true;
      } else if (!newValue && permType === 'read') {
        Object.keys(updatedModule).forEach((type) => {
          if (type !== 'read') updatedModule[type] = false;
        });
      }

      return { ...previousPermissions, [moduleId]: updatedModule };
    });
  };

  const handleSaveRole = async (event) => {
    event.preventDefault();
    if (!roleName.trim()) {
      toast.error('Please enter a Role Name.');
      return;
    }

    const hasActivePerms = Object.values(modulePermissions).some(
      (perms) => perms && (perms.read || perms.write || perms.edit)
    );

    if (!hasActivePerms) {
      toast.error('Please select permissions for at least one module.');
      return;
    }

    setSavingRole(true);
    try {
      const payload = {
        ...(editingRole?.id ? { id: editingRole.id } : {}),
        name: roleName.trim(),
        permissions: modulePermissions,
      };

      const response = await apiService.createRole(payload);

      if (response?.success) {
        toast.success(response.message || `Role "${roleName.trim()}" saved successfully!`);
        onSaved();
      } else {
        toast.error(response?.message || 'Failed to save role.');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to save role.');
    } finally {
      setSavingRole(false);
    }
  };

  const selectedBadges = parseRoleBadges(modulePermissions);
  const selectedSummaryText = selectedBadges.length > 0
    ? selectedBadges.map((badgeItem) => `${badgeItem.moduleName} (${badgeItem.rights})`).join(' • ')
    : 'Choose module & permissions';

  return (
    <form onSubmit={handleSaveRole} className="space-y-4">
      <FormField
        id="roleName"
        name="roleName"
        label="Role Name"
        type="text"
        placeholder="e.g. Store Manager, Support, Admin"
        value={roleName}
        onChange={(event) => setRoleName(event.target.value)}
        required
      />

      <div className="space-y-1.5 text-left w-full relative" ref={dropdownRef}>
        <Label htmlFor="moduleSelect" className="text-xs font-semibold text-gray-700 block">
          Select Module <span className="text-red-500 ml-0.5">*</span>
        </Label>

        <button
          id="moduleSelect"
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex h-9 w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-gray-800 shadow-none hover:border-gray-300 focus:outline-none cursor-pointer transition-all text-left"
        >
          <span className="truncate pr-2 font-normal text-gray-700">
            {selectedSummaryText}
          </span>
          <IconChevronDown className={`w-3.5 h-3.5 text-gray-500 shrink-0 transition-transform duration-150 ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {isDropdownOpen && (
          <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl p-2 z-[100] space-y-1 max-h-72 overflow-y-auto animate-in fade-in-50 duration-150">
            {AVAILABLE_MODULES.map((moduleItem) => {
              const perms = modulePermissions[moduleItem.id] || { read: false, write: false, edit: false };
              const isSelected = modulePermissions[moduleItem.id] !== undefined;

              return (
                <div key={moduleItem.id} className="rounded-lg transition-colors">
                  <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <label className="flex items-center gap-2.5 cursor-pointer select-none font-semibold text-xs sm:text-sm text-gray-900 flex-1">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => handleModuleToggle(moduleItem.id)}
                      />
                      <span>{moduleItem.name}</span>
                    </label>
                  </div>

                  {isSelected && (
                    <div className="pl-6 pr-3 py-1 space-y-2 border-l-2 border-gray-200 ml-4 mb-1.5 mt-0.5">
                      {['read', 'write', 'edit'].map((permType) => (
                        <label key={permType} className="flex items-center gap-2 cursor-pointer select-none">
                          <Checkbox
                            checked={Boolean(perms[permType])}
                            onCheckedChange={() => handlePermissionToggle(moduleItem.id, permType)}
                          />
                          <span className="text-xs font-medium text-gray-700 capitalize">{permType}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="pt-2 flex justify-end">
        <Button
          type="submit"
          disabled={savingRole}
          className="rounded-md bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs px-5 h-9 cursor-pointer shadow-2xs"
        >
          {savingRole ? (
            <span className="flex items-center gap-2">
              <IconSpinner className="w-3.5 h-3.5 animate-spin text-white" />
              Saving
            </span>
          ) : (
            editingRole ? 'Update Role' : 'Save'
          )}
        </Button>
      </div>
    </form>
  );
}

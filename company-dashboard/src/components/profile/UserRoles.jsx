import { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { IconSpinner, IconChevronLeft, IconTrash, IconPencil } from '../common/Icons';
import ConfirmModal from '../common/ConfirmModal';
import SimpleSelect from '../common/SimpleSelect';
import { apiService } from '../../utils/constants';
import { mapRolesToOptions } from '../../utils/helpers';
import RoleForm, { parseRoleBadges } from './RoleForm';

export default function UserRoles() {
  const [isCreatingRole, setIsCreatingRole] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [rolesList, setRolesList] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(true);

  // Deletion modal state
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [targetReassignRole, setTargetReassignRole] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingRoleId, setDeletingRoleId] = useState(null);

  const reassignOptions = useMemo(() => mapRolesToOptions(rolesList, roleToDelete?.id), [rolesList, roleToDelete]);

  const fetchCreatedRoles = useCallback(async () => {
    setLoadingRoles(true);
    try {
      const response = await apiService.getRoles();
      if (response?.success && Array.isArray(response.roles)) {
        setRolesList(response.roles);
      }
    } catch (error) {
      console.warn('Failed to load roles:', error.message);
    } finally {
      setLoadingRoles(false);
    }
  }, []);

  useEffect(() => {
    fetchCreatedRoles();
  }, [fetchCreatedRoles]);

  const handleStartAddRole = () => {
    setEditingRole(null);
    setIsCreatingRole(true);
  };

  const handleEditRole = (roleItem) => {
    setEditingRole(roleItem);
    setIsCreatingRole(true);
  };

  const handleBackToRoles = () => {
    setEditingRole(null);
    setIsCreatingRole(false);
  };

  const handleOpenDeleteModal = (roleItem) => {
    setRoleToDelete(roleItem);
    setTargetReassignRole('');
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDeleteRole = async () => {
    if (!roleToDelete) return;
    if (!targetReassignRole) {
      toast.error('Please select a new role to reassign existing members to.');
      return;
    }

    setDeletingRoleId(roleToDelete.id);
    try {
      const response = await apiService.deleteRole(roleToDelete.id, targetReassignRole);
      if (response?.success) {
        toast.success(response.message || 'Role deleted successfully.');
        fetchCreatedRoles();
        setIsDeleteModalOpen(false);
        setRoleToDelete(null);
      } else {
        toast.error(response?.message || 'Failed to delete role.');
      }
    } catch (error) {
      toast.error('Failed to delete role.');
    } finally {
      setDeletingRoleId(null);
    }
  };

  return (
    <>
      <Card className="rounded-xl border border-gray-200 shadow-none bg-white overflow-visible">
        <CardHeader className="px-4 py-3.5 sm:px-5 border-b border-gray-200 bg-[#f8fafc] flex flex-row items-center justify-between">
          <CardTitle className="text-base font-bold text-gray-900">
            {isCreatingRole ? (editingRole ? 'Edit Role' : 'Create New Role') : 'Available Roles'}
          </CardTitle>

          {isCreatingRole ? (
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleBackToRoles}
              title="Back to Roles"
              className="w-8 h-8 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-100/80 transition-colors cursor-pointer shrink-0 flex items-center justify-center"
            >
              <IconChevronLeft className="w-4 h-4 text-gray-700" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleStartAddRole}
              className="rounded-md px-3.5 h-8 text-xs font-bold bg-gray-900 hover:bg-gray-800 text-white cursor-pointer"
            >
              Add Role
            </Button>
          )}
        </CardHeader>

        <CardContent className="p-4 sm:p-5">
          {isCreatingRole ? (
            <RoleForm
              editingRole={editingRole}
              onSaved={() => {
                fetchCreatedRoles();
                setIsCreatingRole(false);
              }}
            />
          ) : (
            <div className="space-y-3">
              {loadingRoles ? (
                <div className="flex items-center justify-center py-8">
                  <IconSpinner className="w-5 h-5 animate-spin text-gray-900" />
                </div>
              ) : rolesList.length === 0 ? (
                <div className="text-center py-8 text-xs text-gray-400 font-medium">
                  No custom roles created yet. Click <strong className="text-gray-700 font-semibold">Add Role</strong> above to create one.
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {rolesList.map((roleItem) => {
                    const badges = parseRoleBadges(roleItem.permissions);
                    return (
                      <div
                        key={roleItem.id}
                        className="py-3 px-2.5 flex items-center justify-between gap-4 hover:bg-gray-50/60 rounded-lg transition-colors group"
                      >
                        <div className="space-y-1 text-left">
                          <div className="font-bold text-sm text-gray-900">{roleItem.name}</div>

                          {badges.length > 0 ? (
                            <div className="flex flex-wrap gap-1.5">
                              {badges.map((badge, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-gray-100/70 text-gray-700 border-gray-200/60"
                                >
                                  <span className="font-semibold text-gray-900">{badge.moduleName}:</span>
                                  <span className="text-gray-600">{badge.rights}</span>
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <div className="text-xs text-gray-400 font-medium">No permissions set</div>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <Button
                            type="button"
                            size="icon"
                            onClick={() => handleEditRole(roleItem)}
                            className="w-8 h-8 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors cursor-pointer flex items-center justify-center border-0 shadow-2xs"
                            title="Edit Role"
                          >
                            <IconPencil className="w-4 h-4 text-white" />
                          </Button>

                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => handleOpenDeleteModal(roleItem)}
                            className="w-8 h-8 rounded-md border border-gray-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 transition-all cursor-pointer shadow-2xs shrink-0 flex items-center justify-center"
                            title="Delete Role"
                          >
                            <IconTrash className="w-4 h-4 text-rose-600" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation & Reassignment Modal */}
      <ConfirmModal
        open={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setRoleToDelete(null);
        }}
        onConfirm={handleConfirmDeleteRole}
        title="Delete Role"
        itemName={roleToDelete?.name}
        confirmText="Delete Role"
        variant="destructive"
        compact
        loading={deletingRoleId === roleToDelete?.id}
      >
        <div className="space-y-2.5 pt-1 text-left">
          <p className="text-xs text-gray-600 font-medium leading-relaxed">
            Select a new role to reassign team members currently holding <strong className="text-gray-900 font-bold">{roleToDelete?.name}</strong>:
          </p>

          <SimpleSelect
            value={targetReassignRole}
            onValueChange={setTargetReassignRole}
            options={reassignOptions}
            placeholder="Select new role"
            triggerClassName="w-full h-9 text-xs font-semibold rounded-lg bg-white border-gray-200"
          />
        </div>
      </ConfirmModal>
    </>
  );
}

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SimpleSelect from '../common/SimpleSelect';
import { toast } from 'sonner';
import { IconSpinner, IconTrash } from '../common/Icons';
import ConfirmModal from '../common/ConfirmModal';
import AddUser from '../modals/AddUser';
import { apiService } from '../../utils/constants';
import { isSuperAdminRole, mapRolesToOptions } from '../../utils/helpers';

export default function TeamMembers({ currentUser }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingUserId, setSavingUserId] = useState(null);
  const [deletingUserId, setDeletingUserId] = useState(null);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [createdRoles, setCreatedRoles] = useState([]);

  const isAdmin = isSuperAdminRole(currentUser?.role);

  const roleOptions = useMemo(() => mapRolesToOptions(createdRoles), [createdRoles]);

  const fetchRoles = useCallback(async () => {
    try {
      const response = await apiService.getRoles();
      if (response?.success && Array.isArray(response.roles)) {
        setCreatedRoles(response.roles);
      }
    } catch (error) {
      console.warn('Failed to load roles:', error.message);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiService.getUsers();
      if (response.success && Array.isArray(response.users)) {
        setUsers(response.users);
      }
    } catch (error) {
      console.warn('Failed to load user records:', error?.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, [fetchUsers, fetchRoles]);

  const handleRoleChange = (userId, newRole) => {
    setUsers((previousUsers) =>
      previousUsers.map((item) => (item.id === userId ? { ...item, role: newRole } : item))
    );
  };

  const handleSaveUser = async (targetUser) => {
    if (currentUser?.id === targetUser.id) {
      toast.error('You cannot modify your own role.');
      return;
    }

    setSavingUserId(targetUser.id);
    try {
      const response = await apiService.updateUserPermissions({
        userId: targetUser.id,
        role: targetUser.role,
      });

      if (response.success) {
        toast.success(response.message || `Role updated for ${targetUser.name}`);
        fetchUsers();
      } else {
        toast.error(response.message || 'Failed to update user.');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to save updates.');
    } finally {
      setSavingUserId(null);
    }
  };

  const handleOpenDeleteModal = (targetUser) => {
    if (currentUser?.id === targetUser.id) {
      toast.error('You cannot delete your own account.');
      return;
    }
    setUserToDelete(targetUser);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    setDeletingUserId(userToDelete.id);
    try {
      const response = await apiService.deleteUser(userToDelete.id);
      if (response.success) {
        toast.success(response.message || `Deleted user account for ${userToDelete.name}`);
        setUsers((previousUsers) => previousUsers.filter((item) => item.id !== userToDelete.id));
        setIsDeleteModalOpen(false);
        setUserToDelete(null);
      } else {
        toast.error(response.message || 'Failed to delete user.');
      }
    } catch (error) {
      toast.error('Failed to delete user account.');
    } finally {
      setDeletingUserId(null);
    }
  };

  const teamMembers = useMemo(() => {
    return users
      .filter((member) => member.id !== currentUser?.id)
      .map((member) => {
        const memberRole = member.role || roleOptions[0]?.value || 'EMPLOYEE';
        const memberRoleOptions = roleOptions.some((option) => option.value === memberRole)
          ? roleOptions
          : [{ value: memberRole, label: memberRole }, ...roleOptions];

        return {
          ...member,
          memberRole,
          memberRoleOptions,
        };
      });
  }, [users, currentUser?.id, roleOptions]);

  return (
    <>
      <Card className="rounded-xl border border-gray-200 shadow-none bg-white overflow-hidden">
        <CardHeader className="px-4 py-3.5 sm:px-5 border-b border-gray-200 bg-[#f8fafc] flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold text-gray-900">
              Team Members
            </CardTitle>
          </div>

          {isAdmin && (
            <Button
              onClick={() => setIsAddUserModalOpen(true)}
              className="rounded-md px-3.5 h-8 text-xs font-bold bg-gray-900 hover:bg-gray-800 text-white cursor-pointer"
            >
              Add Member
            </Button>
          )}
        </CardHeader>

        <CardContent className="p-4 sm:p-5">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <IconSpinner className="w-5 h-5 animate-spin text-gray-900" />
            </div>
          ) : teamMembers.length === 0 ? (
            <div className="text-center py-8 text-xs text-gray-400 font-medium">
              No team members added yet.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {teamMembers.map((member) => {
                const isSaving = savingUserId === member.id;
                const isDeleting = deletingUserId === member.id;

                const memberRole = roleOptions.some((opt) => opt.value === member.role) ? member.role : 'EMPLOYEE';

                return (
                  <div
                    key={member.id}
                    className="py-3 px-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1 text-left">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 text-sm">{member.name}</span>
                        <Badge
                          variant={isSuperAdminRole(member.memberRole) ? 'default' : 'secondary'}
                          className={`text-[10px] font-bold px-2 py-0.5 ${isSuperAdminRole(member.memberRole)
                            ? 'bg-gray-900 text-white'
                            : 'bg-gray-200/80 text-gray-700'
                            }`}
                        >
                          {member.memberRole}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-500 font-mono">{member.email}</div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      {isAdmin && (
                        <>
                          <SimpleSelect
                            value={member.memberRole}
                            onValueChange={(selectedRole) => handleRoleChange(member.id, selectedRole)}
                            options={member.memberRoleOptions}
                            triggerClassName="w-auto min-w-36 h-8 text-xs font-semibold rounded-md px-3"
                            emptyMessage="No roles created"
                          />

                          <Button
                            size="sm"
                            onClick={() => handleSaveUser(member)}
                            disabled={isSaving || isDeleting}
                            className="rounded-md px-3.5 font-bold h-8 text-xs bg-gray-900 hover:bg-gray-800 text-white cursor-pointer"
                          >
                            {isSaving ? <IconSpinner className="w-3.5 h-3.5 animate-spin text-white" /> : 'Save'}
                          </Button>

                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => handleOpenDeleteModal(member)}
                            disabled={isDeleting || isSaving}
                            title="Delete User Account"
                            className="w-8 h-8 rounded-md border border-gray-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 transition-all cursor-pointer shadow-2xs shrink-0 flex items-center justify-center"
                          >
                            {isDeleting ? (
                              <IconSpinner className="w-3.5 h-3.5 animate-spin text-rose-600" />
                            ) : (
                              <IconTrash className="w-4 h-4 text-rose-600" />
                            )}
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add User Modal */}
      {isAdmin && (
        <>
          <AddUser
            open={isAddUserModalOpen}
            onClose={() => setIsAddUserModalOpen(false)}
            onUserAdded={fetchUsers}
          />

          <ConfirmModal
            open={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
              setUserToDelete(null);
            }}
            onConfirm={handleConfirmDelete}
            title="Delete Member"
            itemName={userToDelete?.name}
            confirmText="Delete"
            variant="destructive"
            compact
            loading={deletingUserId === userToDelete?.id}
          />
        </>
      )}
    </>
  );
}

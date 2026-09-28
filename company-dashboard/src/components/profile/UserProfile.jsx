import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { IconSpinner } from '../common/Icons';
import FormField from '../common/FormField';
import ChangePassword from '../modals/ChangePassword';
import { apiService } from '../../utils/constants';

const parseName = (fullName = '') => {
  const parts = fullName.split(' ');
  return { firstName: parts[0] || '', lastName: parts.slice(1).join(' ') || '' };
};

export default function UserProfile({ currentUser, onUserRoleUpdated }) {
  const [profileData, setProfileData] = useState(() => parseName(currentUser?.name));
  const [savingProfile, setSavingProfile] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);

  useEffect(() => {
    if (currentUser?.name) setProfileData(parseName(currentUser.name));
  }, [currentUser?.name]);

  const handleProfileUpdate = async (event) => {
    event.preventDefault();
    const fullName = `${profileData.firstName.trim()} ${profileData.lastName.trim()}`.trim();
    if (!fullName) {
      toast.error('First Name cannot be empty.');
      return;
    }

    setSavingProfile(true);
    try {
      const response = await apiService.updateProfile({ name: fullName });

      if (response.success) {
        toast.success('Profile updated successfully!');
        const updatedUser = { ...currentUser, ...(response.user || { name: fullName }) };
        if (onUserRoleUpdated) onUserRoleUpdated(updatedUser);
      } else {
        toast.error(response.message || 'Failed to update profile.');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <>
      <Card className="rounded-xl border border-gray-200 shadow-none bg-white overflow-hidden">
        <CardHeader className="px-4 py-3 sm:px-5 sm:py-3.5 border-b border-gray-200 bg-[#f8fafc]">
          <CardTitle className="text-base font-bold text-gray-900">
            Edit Profile
          </CardTitle>
        </CardHeader>

        <CardContent className="p-4 sm:p-5">
          <form onSubmit={handleProfileUpdate} className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                id="firstName"
                name="firstName"
                label="First Name"
                placeholder="First Name"
                value={profileData.firstName}
                required
                onChange={(event) => setProfileData((previous) => ({ ...previous, firstName: event.target.value }))}
              />
              <FormField
                id="lastName"
                name="lastName"
                label="Last Name"
                placeholder="Last Name"
                value={profileData.lastName}
                required
                onChange={(event) => setProfileData((previous) => ({ ...previous, lastName: event.target.value }))}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                id="email"
                name="email"
                label="Email"
                type="email"
                value={currentUser?.email || ''}
                disabled
              />

              <FormField
                id="password"
                label="Password"
                type="password"
                value="••••••••••••"
                disabled
                action={
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsChangePasswordModalOpen(true)}
                    className="h-10 rounded-md px-3.5 text-xs font-semibold border-gray-200 text-gray-800 bg-gray-100 hover:bg-gray-200/80 transition-colors cursor-pointer shrink-0"
                  >
                    Change Password
                  </Button>
                }
              />
            </div>

            <div className="pt-0.5">
              <Button
                type="submit"
                disabled={savingProfile}
                className="rounded-md bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs px-5 h-9 cursor-pointer shadow-2xs"
              >
                {savingProfile ? (
                  <span className="flex items-center gap-2">
                    <IconSpinner className="w-3.5 h-3.5 animate-spin text-white" />
                    Saving
                  </span>
                ) : (
                  'Save'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Change Password Modal */}
      <ChangePassword
        open={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
      />
    </>
  );
}

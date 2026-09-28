import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import UserProfile from '../components/profile/UserProfile';
import TeamMembers from '../components/profile/TeamMembers';
import UserRoles from '../components/profile/UserRoles';
import { isSuperAdminRole } from '../utils/helpers';

export default function Profile({ currentUser, onUserRoleUpdated }) {
  const [activeTab, setActiveTab] = useState('profile');
  const isSuperAdmin = isSuperAdminRole(currentUser?.role);

  return (
    <div className="space-y-4 animate-in fade-in duration-200 w-full">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
        User Profile
      </h1>

      {/* Tabs Navigation: Profile (Everyone) | Team Members & Role (SUPERMASTER_ADMIN Only) */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          {isSuperAdmin && <TabsTrigger value="team">Team Members</TabsTrigger>}
          {isSuperAdmin && <TabsTrigger value="role">Role</TabsTrigger>}
        </TabsList>

        {/* TAB 1: Profile (Everyone) */}
        <TabsContent value="profile" activeValue={activeTab}>
          <UserProfile
            currentUser={currentUser}
            onUserRoleUpdated={onUserRoleUpdated}
          />
        </TabsContent>

        {/* TAB 2: Team Members (SUPERMASTER_ADMIN Only) */}
        {isSuperAdmin && (
          <TabsContent value="team" activeValue={activeTab}>
            <TeamMembers currentUser={currentUser} />
          </TabsContent>
        )}

        {/* TAB 3: Role (SUPERMASTER_ADMIN Only) */}
        {isSuperAdmin && (
          <TabsContent value="role" activeValue={activeTab}>
            <UserRoles />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}

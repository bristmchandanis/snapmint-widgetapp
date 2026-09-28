import { useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { appRoutesURL } from '../../routes/appRoutesURL';

export default function DashboardLayout({ user, onLogout, onUserRoleUpdated }) {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-white flex flex-col">
      <Navbar user={user} onLogout={onLogout} onToggleMobileSidebar={() => setMobileOpen(true)} />
      <div className="flex-1 flex min-w-0">
        <Sidebar
          onNavigate={(id) =>
            navigate(
              {
                stores: appRoutesURL.stores,
                'merchant-onboard': appRoutesURL.merchantOnboard,
                'widget-customization': appRoutesURL.widgetCustomization,
                'cashback-offer': appRoutesURL.cashbackOffer,
                "activity-logs": appRoutesURL.activityLogs,
                profile: appRoutesURL.profile,
              }[id] || appRoutesURL.stores
            )
          }
          user={user}
          onLogout={onLogout}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
        />
        <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            <Outlet context={{ user, onUserRoleUpdated }} />
          </main>
        </div>
      </div>
    </div>
  );
}

import {
  IconDashboard,
  IconPlusCircle,
  IconTag,
  IconBarChart,
  IconLogOut,
  IconUser,
  IconX,
} from './Icons';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { appRoutesURL } from '../../routes/appRoutesURL';
import { hasPermission } from '../../utils/helpers';

export default function Sidebar({ onNavigate, user, onLogout, mobileOpen, onMobileClose }) {
  const location = useLocation();
  const pathname = location.pathname;

  const menuItems = [
    {
      id: 'stores',
      moduleName: 'stores',
      label: 'Stores Dashboard',
      icon: IconDashboard,
      path: appRoutesURL.stores,
    },
    {
      id: 'merchant-onboard',
      moduleName: 'merchantOnboard',
      label: 'All Merchants',
      icon: IconPlusCircle,
      path: appRoutesURL.merchantOnboard,
    },
    {
      id: 'cashback-offer',
      moduleName: 'cashbackOffer',
      label: 'Cashback & Offer',
      icon: IconTag,
      path: appRoutesURL.cashbackOffer,
    },
    {
      id: "activity-logs",
      moduleName: "activityLogs",
      label: "Activity Logs",
      icon: IconBarChart,
      path: appRoutesURL.activityLogs,
    },
  ];

  const visibleMenuItems = menuItems.filter((item) => {
    if (!item.moduleName || item.moduleName === "activityLogs") return true;
    return hasPermission(user, item.moduleName, "read");
  });

  const handleItemClick = (pageId) => {
    onNavigate(pageId);
    if (onMobileClose) onMobileClose();
  };

  const navContent = (
    <div className="flex flex-col h-full bg-gray-100 text-gray-900 w-64 px-3 py-5 space-y-4 border-r border-gray-200 shadow-none">
      {/* Mobile Close Button Header */}
      {onMobileClose && (
        <div className="flex items-center justify-between lg:hidden pb-3 border-b border-gray-200">
          <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Navigation Menu</span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onMobileClose}
            className="p-1.5 h-8 w-8 text-gray-700 hover:text-gray-950 rounded-md hover:bg-gray-100 cursor-pointer"
          >
            <IconX className="w-5 h-5" />
          </Button>
        </div>
      )}

      {/* Main Navigation */}
      <div className="flex-1 space-y-4 overflow-y-auto pr-0.5 pt-1">
        <div>
          <div className="space-y-0.5">
            {visibleMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname.startsWith(item.path) ||
                (item.id === 'stores' && (pathname.startsWith(appRoutesURL.autoSetup) || pathname.startsWith(appRoutesURL.colorCustomization)));

              return (
                <Button
                  key={item.id}
                  type="button"
                  variant="ghost"
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-1.75 rounded-md text-[13px] transition-all duration-150 cursor-pointer justify-start h-auto ${isActive
                    ? 'bg-gray-200 text-gray-900 font-semibold hover:bg-gray-200'
                    : 'text-gray-900 font-medium hover:bg-gray-200/60'
                    }`}
                >
                  <Icon className="w-4 h-4 shrink-0 text-gray-900 transition-colors" />
                  <span>{item.label}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sidebar Footer: Profile & Sign Out */}
      {user && (
        <div className="pt-4 border-t border-gray-200 space-y-2">
          {/* Profile Button */}
          <Button
            type="button"
            variant="ghost"
            onClick={() => handleItemClick('profile')}
            className={`w-full flex items-center justify-center gap-2.5 px-3 py-2 h-auto rounded-lg text-[13px] transition-all duration-150 cursor-pointer ${pathname === appRoutesURL.profile
              ? 'bg-gray-200 text-gray-900 font-semibold hover:bg-gray-200'
              : 'text-gray-900 font-medium hover:bg-gray-200/60 bg-gray-100 border border-gray-300'
              }`}
          >
            <IconUser className="w-4 h-4 text-gray-900" />
            <span>Profile</span>
          </Button>

          {/* Centered Sign Out Button */}
          <Button
            type="button"
            variant="ghost"
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2.5 px-3 py-2 h-auto rounded-lg text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-all duration-150 cursor-pointer"
          >
            <IconLogOut className="w-4 h-4 text-rose-500" />
            <span>Sign Out</span>
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Left Sidebar */}
      <aside className="hidden lg:block fixed left-0 top-16 bottom-0 z-30">
        {navContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 top-16 z-50 flex">
          <div
            className="fixed inset-0 top-16 bg-gray-950/40 backdrop-blur-xs transition-opacity"
            onClick={onMobileClose}
          />
          <div className="relative z-10 h-full">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
}

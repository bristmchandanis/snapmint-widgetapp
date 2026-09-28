import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { IconUser, IconLogOut, IconMenu } from './Icons';

const getInitials = (name) => {
  if (!name) return 'U';
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export default function Navbar({ user, onLogout, onToggleMobileSidebar }) {
  return (
    <header className="h-16 sticky top-0 z-40 w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 bg-gray-900 text-white border-b border-gray-800 shadow-md">
      {/* Left: Mobile Toggle + Snapmint Logo & Brand Text */}
      <div className="flex items-center gap-3">
        {onToggleMobileSidebar && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={onToggleMobileSidebar}
            className="lg:hidden h-9 w-9 rounded-xl border border-gray-700 text-gray-200 hover:bg-gray-800 bg-transparent hover:text-white transition-all cursor-pointer"
          >
            <IconMenu className="w-5 h-5" />
          </Button>
        )}

        {/* Snapmint Brand Logo & Text on Navbar */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white text-gray-900 font-black text-base flex items-center justify-center shadow-md tracking-tight">
            S
          </div>
          <span className="font-extrabold text-white text-lg leading-none tracking-tight">
            Snapmint
          </span>
        </div>
      </div>

      {/* Right: User Profile Avatar */}
      <div className="flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              title="User Profile"
              className="rounded-full bg-white border border-gray-200 text-gray-900 hover:bg-gray-100 cursor-pointer select-none font-extrabold text-xs shadow-2xs transition-all w-9 h-9 flex items-center justify-center"
            >
              {user ? (
                <span>{getInitials(user.name)}</span>
              ) : (
                <IconUser className="w-4 h-4 text-gray-900" />
              )}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-36 bg-white border border-gray-200 shadow-xl rounded-xl p-1.5 z-50">
            <DropdownMenuItem
              onClick={onLogout}
              className="text-rose-600 focus:text-rose-700 focus:bg-rose-50 rounded-lg cursor-pointer text-xs font-semibold py-2 px-2.5 flex items-center gap-2"
            >
              <IconLogOut className="w-4 h-4 text-rose-500" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

import { NavLink, Outlet } from 'react-router-dom';
import {
  HiPlus,
  HiArrowDown,
  HiArrowUp,
  HiUser,
  HiViewGrid,
  HiShieldCheck,
  HiGlobeAlt,
} from 'react-icons/hi';
import { useAuth } from '../hooks/useAuth';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import Navbar from '../components/Navbar';

const DashboardLayout = () => {
  const { user } = useAuth();

  const menuItems = [
    { title: 'Overview', path: '/dashboard', icon: HiViewGrid, end: true },
    { title: 'Source Products', path: '/products', icon: HiGlobeAlt },
    { title: 'New Listing', path: '/dashboard/add-export', icon: HiPlus, hidden: user?.isGuest },
    { title: 'Inventory (Exports)', path: '/dashboard/my-exports', icon: HiArrowUp, hidden: user?.isGuest },
    { title: 'Purchase Orders', path: '/dashboard/my-imports', icon: HiArrowDown, hidden: user?.isGuest },
    { title: 'Settings', path: '/dashboard/profile', icon: HiUser },
  ].filter((item) => !item.hidden);

  if (user?.isAdmin || user?.role === 'admin' || user?.userType === 'demo-admin') {
    menuItems.push({
      title: 'Admin Console',
      path: '/admin/dashboard',
      icon: HiShieldCheck,
    });
  }

  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      <Navbar />
      <div className="flex flex-1 mt-14">
      {/* Enterprise Left Sidebar */}
      <aside className="w-56 lg:w-60 bg-surface border-r border-border-default hidden md:flex flex-col p-4 sticky top-14 h-[calc(100vh-56px)] shrink-0 select-none">
        {/* Workspace Identity */}
        <div className="mb-5 px-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-foreground-muted">
              Workspace
            </span>
            <Badge variant={user?.isGuest ? 'warning' : 'success'} size="sm" hasDot>
              {user?.isGuest ? 'Demo' : 'Live'}
            </Badge>
          </div>
          <div className="text-xs font-semibold text-foreground truncate mt-1">
            {user?.displayName || 'Trade Account'}
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-0.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors',
                    isActive
                      ? 'bg-surface-subtle text-foreground border border-border-default shadow-2xs font-semibold'
                      : 'text-foreground-secondary hover:text-foreground hover:bg-surface-hover/60'
                  )
                }
              >
                <Icon className="w-4 h-4 text-foreground-muted shrink-0" />
                <span className="truncate">{item.title}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom User Bar */}
        <div className="mt-auto pt-4 border-t border-border-subtle">
          <div className="flex items-center gap-2.5 p-2 rounded-lg bg-surface-subtle border border-border-subtle">
            <div className="w-7 h-7 rounded-md bg-accent-subtle text-accent-primary border border-accent-primary/20 flex items-center justify-center font-bold text-xs shrink-0">
              {user?.displayName?.charAt(0) || 'U'}
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-medium text-foreground truncate">
                {user?.displayName || 'User'}
              </div>
              <div className="text-[10px] text-foreground-muted truncate">
                {user?.isGuest ? 'Read-only Sandbox' : 'Verified Member'}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Workspace Canvas */}
      <main className="flex-1 p-6 md:p-8 lg:p-10 overflow-x-hidden min-w-0">
        <Outlet />
      </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

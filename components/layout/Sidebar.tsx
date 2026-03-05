'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard, Map, Calendar, History, User, Settings,
  LogOut, Zap, Shield, BarChart3, Building2, CheckSquare,
  Menu, X, ChevronRight
} from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { ThemeToggle } from './ThemeToggle';
import { cn } from '@/lib/utils';

const userNavItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/book', icon: Calendar, label: 'Book Charging' },
  { href: '/dashboard/sessions', icon: History, label: 'My Sessions' },
  { href: '/dashboard/profile', icon: User, label: 'Profile' },
];

const adminNavItems = [
  { href: '/admin', icon: BarChart3, label: 'Analytics' },
  { href: '/admin/stations', icon: Building2, label: 'Stations' },
  { href: '/admin/approvals', icon: CheckSquare, label: 'Approvals' },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdmin = user?.role === 'admin';
  const navItems = isAdmin ? adminNavItems : userNavItems;

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-electric-500 to-volt-500 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-display font-bold text-lg text-white">VoltMap</span>
            <div className="text-xs text-white/40 font-mono">
              {isAdmin ? 'Admin Console' : 'EV Dashboard'}
            </div>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="px-4 py-4 border-b border-white/10">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-electric-600 to-volt-600 flex items-center justify-center text-white font-bold text-sm">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-white truncate">{user?.name}</div>
            <div className="text-xs text-white/40 truncate">{user?.email}</div>
          </div>
          {isAdmin && (
            <div className="flex items-center gap-1 bg-volt-500/20 border border-volt-500/40 rounded-full px-2 py-0.5">
              <Shield className="w-3 h-3 text-volt-400" />
              <span className="text-xs text-volt-400 font-semibold">Admin</span>
            </div>
          )}
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        <div className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-3 px-3">
          {isAdmin ? 'Management' : 'Navigation'}
        </div>
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 group',
                isActive
                  ? 'bg-electric-600/20 text-electric-400 border border-electric-500/30'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              )}
            >
              <Icon className={cn('w-5 h-5', isActive ? 'text-electric-400' : 'text-white/40 group-hover:text-white/70')} />
              {label}
              {isActive && <ChevronRight className="w-4 h-4 ml-auto text-electric-400" />}
            </Link>
          );
        })}

        {/* Switch to Admin/User */}
        {isAdmin && (
          <>
            <div className="text-xs font-semibold text-white/30 uppercase tracking-widest mt-4 mb-3 px-3">User View</div>
            {userNavItems.map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm text-white/40 hover:text-white hover:bg-white/5 transition-all duration-200 group"
              >
                <Icon className="w-5 h-5 text-white/30 group-hover:text-white/60" />
                {label}
              </Link>
            ))}
          </>
        )}
      </nav>

      {/* Bottom Actions */}
      <div className="px-4 py-4 border-t border-white/10 space-y-2">
        <ThemeToggle />
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-gray-900/50 backdrop-blur border-r border-white/10 flex-col h-screen sticky top-0 overflow-y-auto">
        <SidebarContent />
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-gray-900/90 backdrop-blur border-b border-white/10 flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-electric-500 to-volt-500 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold text-white">VoltMap</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg bg-white/10 text-white"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <>
          <div className="drawer-overlay lg:hidden" onClick={() => setMobileOpen(false)} />
          <div className="drawer-panel lg:hidden">
            <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mt-3 mb-4" />
            <SidebarContent />
          </div>
        </>
      )}

      {/* Mobile Spacer */}
      <div className="lg:hidden h-[57px]" />
    </>
  );
}

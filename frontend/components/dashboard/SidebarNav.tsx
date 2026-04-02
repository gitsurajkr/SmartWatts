'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Zap,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
  TrendingDown,
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { useAuth } from '@/lib/auth';

const menuItems = [
  { icon: Home, label: 'Dashboard', href: '/dashboard' },
  { icon: Zap, label: 'Devices', href: '/devices' },
  { icon: BarChart3, label: 'Analytics', href: '/analytics' },
  { icon: TrendingDown, label: 'Savings', href: '/savings' },
];

const bottomLinks = [
  { icon: Settings, label: 'Settings', href: '/settings' },
  { icon: HelpCircle, label: 'Help & Support', href: '/support' },
];

export default function SidebarNav() {
  const pathname = usePathname();
  const dashboard = useStore((s) => s.dashboard);
  const { logout } = useAuth();

  const totalUnits = dashboard?.totalUnits || 0;

  return (
    <div className="h-full flex flex-col bg-card p-4 md:p-6">
      {/* Main Menu */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-primary text-white shadow-lg shadow-primary/30'
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="my-4 border-t border-border" />

      {/* Quick Stats */}
      <div className="mb-6 p-4 bg-muted rounded-lg">
        <p className="text-xs text-muted-foreground mb-2 font-semibold">MONTHLY USAGE</p>
        <p className="text-2xl font-bold text-foreground mb-1">
          {totalUnits > 0 ? `${totalUnits.toLocaleString()} kWh` : '—'}
        </p>
        <p className="text-xs text-secondary">
          {dashboard
            ? `${dashboard.activeDevices} of ${dashboard.totalDevices} devices active`
            : 'Loading...'}
        </p>
      </div>

      {/* Bottom Menu */}
      <div className="space-y-2 border-t border-border pt-4">
        {bottomLinks.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-muted text-foreground'
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </div>
  );
}

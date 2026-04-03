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
  const totalDevices = dashboard?.totalDevices || 0;
  const activeDevices = dashboard?.activeDevices || 0;

  return (
    <div className="h-full flex flex-col p-4 md:p-5">
      {/* Main Menu */}
      <nav className="flex-1 space-y-1.5">
        {menuItems.map((item, idx) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative animate-fade-up stagger-${idx + 1} ${
                isActive
                  ? 'bg-primary/10 text-primary font-semibold active-indicator'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <item.icon className={`w-5 h-5 transition-all duration-300 ${
                isActive ? 'text-primary' : 'group-hover:scale-110 group-hover:text-primary'
              }`} />
              <span className="text-sm font-medium">{item.label}</span>
              {isActive && (
                <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-primary animate-pulse-dot" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="my-4 border-t border-border" />

      {/* Quick Stats Card */}
      <div className="mb-5 p-4 glass-card rounded-xl animate-fade-up stagger-5">
        <p className="text-[10px] text-muted-foreground mb-3 font-bold tracking-widest uppercase">
          Monthly Usage
        </p>
        <p className="text-2xl font-bold text-foreground mb-1">
          {totalUnits > 0 ? (
            <span className="text-gradient">{totalUnits.toLocaleString()} kWh</span>
          ) : (
            '—'
          )}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-primary rounded-full animate-progress-fill"
              style={{ width: totalDevices > 0 ? `${(activeDevices / totalDevices) * 100}%` : '0%' }}
            />
          </div>
          <p className="text-[10px] text-muted-foreground whitespace-nowrap">
            {dashboard
              ? `${activeDevices}/${totalDevices} active`
              : 'Loading...'}
          </p>
        </div>
      </div>

      {/* Bottom Menu */}
      <div className="space-y-1 border-t border-border pt-4">
        {bottomLinks.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 group ${
                isActive
                  ? 'bg-muted text-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <item.icon className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-300 group"
        >
          <LogOut className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </div>
  );
}

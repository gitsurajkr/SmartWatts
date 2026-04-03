'use client';

import React from 'react';
import Link from 'next/link';
import { Menu, Settings, Bell } from 'lucide-react';
import { useAuth } from '@/lib/auth';

interface TopNavbarProps {
  onMenuClick: () => void;
}

export default function TopNavbar({ onMenuClick }: TopNavbarProps) {
  const { user } = useAuth();

  return (
    <div className="h-16 glass-strong border-b border-border flex items-center justify-between px-4 md:px-8 sticky top-0 z-20">
      {/* Left side */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="p-2 hover:bg-muted rounded-xl md:hidden transition-all duration-300 hover:scale-105"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-lg shadow-primary/20 transition-all duration-300 group-hover:shadow-primary/40 group-hover:scale-105">
            <span className="text-white font-bold text-sm">⚡</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold text-gradient leading-tight">SmartWatts</h1>
            <p className="text-[10px] text-muted-foreground -mt-0.5 font-medium tracking-wider uppercase">Energy Dashboard</p>
          </div>
        </Link>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        <button
          className="p-2.5 hover:bg-muted rounded-xl transition-all duration-300 relative group hover:scale-105"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5 transition-transform group-hover:animate-wiggle" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-secondary animate-pulse-dot" />
        </button>

        <Link
          href="/settings"
          className="p-2.5 hover:bg-muted rounded-xl transition-all duration-300 hover:scale-105"
          aria-label="Settings"
        >
          <Settings className="w-5 h-5 transition-transform hover:rotate-90 duration-500" />
        </Link>

        <Link href="/settings" className="hidden sm:flex items-center gap-3 pl-4 ml-2 border-l border-border group">
          <div className="text-right">
            <p className="text-sm font-semibold text-foreground">{user?.name ?? 'User'}</p>
            <p className="text-xs text-muted-foreground">{user?.email ?? ''}</p>
          </div>
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-gradient-primary flex items-center justify-center transition-all duration-300 group-hover:glow-ring group-hover:scale-105">
              <span className="text-white font-bold text-xs">
                {user?.name?.charAt(0).toUpperCase() ?? '?'}
              </span>
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-400 border-2 border-[var(--card-solid)]" />
          </div>
        </Link>
      </div>
    </div>
  );
}

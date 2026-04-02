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
    <div className="h-16 bg-card border-b border-border flex items-center justify-between px-4 md:px-8 sticky top-0 z-20">
      {/* Left side */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="p-2 hover:bg-muted rounded-lg md:hidden transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <span className="text-white font-bold text-sm">SW</span>
          </div>
          <h1 className="text-xl font-bold hidden sm:block text-foreground">SmartWatts</h1>
        </Link>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <button
          className="p-2 hover:bg-muted rounded-lg transition-colors relative"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
        </button>

        <Link
          href="/settings"
          className="p-2 hover:bg-muted rounded-lg transition-colors"
          aria-label="Settings"
        >
          <Settings className="w-5 h-5" />
        </Link>

        <Link href="/settings" className="hidden sm:flex items-center gap-3 pl-4 border-l border-border">
          <div className="text-right">
            <p className="text-sm font-medium text-foreground">{user?.name ?? 'User'}</p>
            <p className="text-xs text-muted-foreground">{user?.email ?? ''}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <span className="text-white font-bold text-xs">
              {user?.name?.charAt(0).toUpperCase() ?? '?'}
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}

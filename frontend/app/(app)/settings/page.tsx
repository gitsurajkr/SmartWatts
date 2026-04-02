'use client';

import { useAuth } from '@/lib/auth';
import AIBudgetCard from '@/components/ai/AIBudgetCard';
import { User, Mail, LogOut, Shield } from 'lucide-react';

export default function SettingsPage() {
  const { user, logout } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
      </div>

      {/* Profile card */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Profile</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 border border-border">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {user?.name?.charAt(0).toUpperCase() ?? '?'}
              </span>
            </div>
            <div>
              <p className="font-semibold text-foreground">{user?.name ?? 'User'}</p>
              <p className="text-sm text-muted-foreground">{user?.email ?? ''}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 rounded-xl border border-border">
              <User className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Name</p>
                <p className="text-sm font-medium text-foreground">{user?.name ?? '—'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl border border-border">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium text-foreground">{user?.email ?? '—'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Budget setting */}
      <AIBudgetCard />

      {/* Rate info */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Electricity Rate</h2>
        <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/30 border border-border">
          <Shield className="w-5 h-5 text-primary" />
          <div>
            <p className="font-medium text-foreground">₹8 per kWh</p>
            <p className="text-xs text-muted-foreground">Default Indian electricity rate (customization coming soon)</p>
          </div>
        </div>
      </div>

      {/* Logout */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Account Actions</h2>
        <button
          onClick={logout}
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors font-medium"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}

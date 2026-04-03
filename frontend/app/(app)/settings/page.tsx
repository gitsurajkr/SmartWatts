'use client';

import { useAuth } from '@/lib/auth';
import AIBudgetCard from '@/components/ai/AIBudgetCard';
import { User, Mail, LogOut, Shield, Zap } from 'lucide-react';

export default function SettingsPage() {
  const { user, logout } = useAuth();

  return (
    <div className="space-y-6">
      <div className="animate-fade-up">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1 text-sm">Manage your account and preferences</p>
      </div>

      {/* Profile card */}
      <div className="glass-card rounded-2xl p-6 animate-fade-up stagger-1">
        <h2 className="text-lg font-bold text-foreground mb-4">Profile</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 rounded-xl glass border border-border group">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-lg shadow-primary/20 transition-all duration-300 group-hover:shadow-primary/40 group-hover:scale-105">
                <span className="text-white font-bold text-xl">
                  {user?.name?.charAt(0).toUpperCase() ?? '?'}
                </span>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#22c55e] border-2 border-[var(--card-solid)]" />
            </div>
            <div>
              <p className="font-bold text-foreground text-lg">{user?.name ?? 'User'}</p>
              <p className="text-sm text-muted-foreground">{user?.email ?? ''}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 rounded-xl border border-border glass group hover:scale-[1.02] transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Name</p>
                <p className="text-sm font-semibold text-foreground">{user?.name ?? '—'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl border border-border glass group hover:scale-[1.02] transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-[#a78bfa]/10 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <Mail className="w-5 h-5 text-[#a78bfa]" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Email</p>
                <p className="text-sm font-semibold text-foreground">{user?.email ?? '—'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Budget setting */}
      <AIBudgetCard />

      {/* Rate info */}
      <div className="glass-card rounded-2xl p-6 animate-fade-up stagger-3">
        <h2 className="text-lg font-bold text-foreground mb-4">Electricity Rate</h2>
        <div className="flex items-center gap-4 p-4 rounded-xl glass border border-border group hover:scale-[1.01] transition-all duration-300">
          <div className="w-11 h-11 rounded-xl bg-[#ffab40]/10 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
            <Zap className="w-5 h-5 text-[#ffab40]" />
          </div>
          <div>
            <p className="font-bold text-foreground">₹8 per kWh</p>
            <p className="text-xs text-muted-foreground">Default Indian electricity rate (customization coming soon)</p>
          </div>
        </div>
      </div>

      {/* Logout */}
      <div className="glass-card rounded-2xl p-6 animate-fade-up stagger-4">
        <h2 className="text-lg font-bold text-foreground mb-4">Account Actions</h2>
        <button
          onClick={logout}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-destructive text-white hover:bg-destructive/90 transition-all duration-300 font-semibold hover:shadow-lg hover:shadow-destructive/25 hover:scale-[1.02] active:scale-[0.98] group"
        >
          <LogOut className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
          Sign Out
        </button>
      </div>
    </div>
  );
}

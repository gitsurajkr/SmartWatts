'use client';

import React, { useEffect } from 'react';
import { Bell, TrendingUp, Wallet, Zap, X } from 'lucide-react';
import { useAIStore } from '@/lib/aiStore';
import { useStore } from '@/lib/store';

const alertIcons = {
  spike: TrendingUp,
  budget: Wallet,
  efficiency: Zap,
};

const alertStyles = {
  high: {
    border: 'border-destructive/20',
    bg: 'bg-destructive/5',
    dot: 'bg-destructive',
    glow: 'shadow-destructive/10',
  },
  medium: {
    border: 'border-[#ffab40]/20',
    bg: 'bg-[#ffab40]/5',
    dot: 'bg-[#ffab40]',
    glow: 'shadow-[#ffab40]/10',
  },
  low: {
    border: 'border-primary/20',
    bg: 'bg-primary/5',
    dot: 'bg-primary',
    glow: 'shadow-primary/10',
  },
};

export default function AIAlertsPanel() {
  const { alerts, alertsLoading, fetchAlerts } = useAIStore();
  const appliances = useStore((s) => s.appliances);
  const hasAppliances = appliances.length > 0;
  const [dismissed, setDismissed] = React.useState<Set<number>>(new Set());

  useEffect(() => {
    if (hasAppliances) {
      fetchAlerts();
    }
  }, [hasAppliances, fetchAlerts]);

  const visibleAlerts = alerts.filter((_, i) => !dismissed.has(i));

  if (appliances.length === 0 || visibleAlerts.length === 0) return null;

  return (
    <div className="space-y-3">
      {visibleAlerts.map((alert, idx) => {
        const realIdx = alerts.indexOf(alert);
        const Icon = alertIcons[alert.type] || Bell;
        const styles = alertStyles[alert.severity] || alertStyles.low;

        return (
          <div
            key={idx}
            className={`glass-card rounded-xl p-4 ${styles.border} ${styles.bg} flex items-start gap-3 animate-fade-up stagger-${idx + 1} group hover:shadow-lg ${styles.glow} transition-all duration-300`}
          >
            <div className="relative flex-shrink-0 mt-0.5">
              <Icon className="w-5 h-5 text-foreground" />
              <span className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full ${styles.dot} animate-pulse-dot`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground text-sm">{alert.title}</p>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{alert.message}</p>
            </div>
            <button
              onClick={() => setDismissed((prev) => new Set(prev).add(realIdx))}
              className="p-1.5 hover:bg-muted rounded-lg transition-all duration-300 flex-shrink-0 opacity-0 group-hover:opacity-100 hover:scale-110"
              aria-label="Dismiss"
            >
              <X className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

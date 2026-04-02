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

const alertColors = {
  high: 'border-red-500/30 bg-red-500/5',
  medium: 'border-orange-500/30 bg-orange-500/5',
  low: 'border-blue-500/30 bg-blue-500/5',
};

const dotColors = {
  high: 'bg-red-500',
  medium: 'bg-orange-500',
  low: 'bg-blue-500',
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
        const borderColor = alertColors[alert.severity] || alertColors.low;
        const dot = dotColors[alert.severity] || dotColors.low;

        return (
          <div key={idx} className={`rounded-xl border p-4 ${borderColor} flex items-start gap-3`}>
            <div className="relative flex-shrink-0 mt-0.5">
              <Icon className="w-5 h-5 text-foreground" />
              <span className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${dot}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground text-sm">{alert.title}</p>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{alert.message}</p>
            </div>
            <button
              onClick={() => setDismissed((prev) => new Set(prev).add(realIdx))}
              className="p-1 hover:bg-muted rounded transition-colors flex-shrink-0"
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

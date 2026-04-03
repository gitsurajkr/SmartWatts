'use client';

import React, { useEffect } from 'react';
import { Sparkles, AlertTriangle, Lightbulb, Info, RefreshCw } from 'lucide-react';
import { useAIStore } from '@/lib/aiStore';
import { useStore } from '@/lib/store';

const severityStyles = {
  high: 'border-destructive/20 bg-destructive/5',
  medium: 'border-[#ffab40]/20 bg-[#ffab40]/5',
  low: 'border-primary/20 bg-primary/5',
};

const typeIcons = {
  warning: AlertTriangle,
  tip: Lightbulb,
  info: Info,
};

const iconColors = {
  high: 'text-destructive',
  medium: 'text-[#ffab40]',
  low: 'text-primary',
};

export default function AIInsightsCard() {
  const { insights, insightsLoading, fetchInsights } = useAIStore();
  const appliances = useStore((s) => s.appliances);
  const hasAppliances = appliances.length > 0;

  useEffect(() => {
    if (hasAppliances) {
      fetchInsights();
    }
  }, [hasAppliances, fetchInsights]);

  if (appliances.length === 0) return null;

  return (
    <div className="glass-card rounded-2xl p-6 animate-fade-up">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-lg font-bold text-foreground">AI Insights</h2>
        </div>
        <button
          onClick={() => fetchInsights(true)}
          disabled={insightsLoading}
          className="p-2 hover:bg-muted rounded-xl transition-all duration-300 disabled:opacity-40 hover:scale-110"
          aria-label="Refresh insights"
        >
          <RefreshCw className={`w-4 h-4 text-muted-foreground ${insightsLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {insightsLoading && insights.length === 0 ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="p-3 rounded-xl border border-border animate-pulse">
              <div className="h-4 w-3/4 bg-muted rounded mb-2" />
              <div className="h-3 w-1/2 bg-muted rounded" />
            </div>
          ))}
        </div>
      ) : insights.length > 0 ? (
        <div className="space-y-3">
          {insights.map((insight, idx) => {
            const Icon = typeIcons[insight.type] || Info;
            const styles = severityStyles[insight.severity] || severityStyles.low;
            const iconColor = iconColors[insight.severity] || iconColors.low;
            return (
              <div
                key={idx}
                className={`p-3 rounded-xl border ${styles} transition-all duration-300 hover:scale-[1.02] animate-fade-up stagger-${idx + 1}`}
              >
                <div className="flex gap-3">
                  <Icon className={`w-4 h-4 flex-shrink-0 mt-0.5 ${iconColor}`} />
                  <p className="text-sm text-foreground leading-relaxed">{insight.message}</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No insights available yet.</p>
      )}
    </div>
  );
}

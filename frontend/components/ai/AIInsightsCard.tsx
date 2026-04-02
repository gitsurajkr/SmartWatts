'use client';

import React, { useEffect } from 'react';
import { Sparkles, AlertTriangle, Lightbulb, Info, RefreshCw } from 'lucide-react';
import { useAIStore } from '@/lib/aiStore';
import { useStore } from '@/lib/store';

const severityColors = {
  high: 'text-red-500 bg-red-500/10 border-red-500/20',
  medium: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
  low: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
};

const typeIcons = {
  warning: AlertTriangle,
  tip: Lightbulb,
  info: Info,
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
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">AI Insights</h2>
        </div>
        <button
          onClick={() => fetchInsights(true)}
          disabled={insightsLoading}
          className="p-2 hover:bg-muted rounded-lg transition-colors disabled:opacity-40"
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
            const colors = severityColors[insight.severity] || severityColors.low;
            return (
              <div key={idx} className={`p-3 rounded-xl border ${colors}`}>
                <div className="flex gap-3">
                  <Icon className="w-4 h-4 flex-shrink-0 mt-0.5" />
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

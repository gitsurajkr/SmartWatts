'use client';

import React, { useEffect } from 'react';
import { FileText, RefreshCw } from 'lucide-react';
import { useAIStore } from '@/lib/aiStore';
import { useStore } from '@/lib/store';

export default function AIMonthlyReport() {
  const { monthlyReport, reportLoading, fetchMonthlyReport } = useAIStore();
  const appliances = useStore((s) => s.appliances);
  const hasAppliances = appliances.length > 0;

  useEffect(() => {
    if (hasAppliances) {
      fetchMonthlyReport();
    }
  }, [hasAppliances, fetchMonthlyReport]);

  if (appliances.length === 0) return null;

  return (
    <div className="glass-card rounded-2xl p-6 relative overflow-hidden group animate-fade-up">
      {/* Ambient gradient */}
      <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-primary/5 blur-3xl group-hover:bg-primary/10 transition-all duration-700" />
      <div className="absolute -bottom-16 -left-16 w-40 h-40 rounded-full bg-accent/5 blur-3xl group-hover:bg-accent/10 transition-all duration-700" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-lg font-bold text-foreground">Monthly AI Report</h2>
          </div>
          <button
            onClick={() => fetchMonthlyReport(true)}
            disabled={reportLoading}
            className="p-2 hover:bg-muted rounded-xl transition-all duration-300 disabled:opacity-40 hover:scale-110"
            aria-label="Regenerate report"
          >
            <RefreshCw className={`w-4 h-4 text-muted-foreground ${reportLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {reportLoading && !monthlyReport ? (
          <div className="space-y-2 animate-pulse">
            <div className="h-4 w-full bg-muted rounded" />
            <div className="h-4 w-5/6 bg-muted rounded" />
            <div className="h-4 w-4/6 bg-muted rounded" />
          </div>
        ) : monthlyReport ? (
          <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap animate-fade-in">{monthlyReport}</p>
        ) : (
          <p className="text-sm text-muted-foreground">Report will be generated when you have appliance data.</p>
        )}
      </div>
    </div>
  );
}

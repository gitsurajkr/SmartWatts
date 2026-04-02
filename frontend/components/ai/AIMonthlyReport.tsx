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
    <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/5 to-secondary/5 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Monthly AI Report</h2>
        </div>
        <button
          onClick={() => fetchMonthlyReport(true)}
          disabled={reportLoading}
          className="p-2 hover:bg-muted rounded-lg transition-colors disabled:opacity-40"
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
        <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{monthlyReport}</p>
      ) : (
        <p className="text-sm text-muted-foreground">Report will be generated when you have appliance data.</p>
      )}
    </div>
  );
}

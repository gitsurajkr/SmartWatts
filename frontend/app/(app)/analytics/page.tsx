'use client';

import { useStore } from '@/lib/store';
import ChartsSection from '@/components/dashboard/ChartsSection';
import AIMonthlyReport from '@/components/ai/AIMonthlyReport';
import AIInsightsCard from '@/components/ai/AIInsightsCard';
import { BarChart3, TrendingUp, Zap, DollarSign } from 'lucide-react';

export default function AnalyticsPage() {
  const { dashboard, weeklyTrend, appliances } = useStore();

  const totalUnits = dashboard?.totalUnits ?? 0;
  const totalBill = dashboard?.totalBill ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground mt-1">Detailed energy consumption insights and trends</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Monthly Units</p>
            <p className="text-xl font-bold text-foreground">{totalUnits} kWh</p>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Monthly Bill</p>
            <p className="text-xl font-bold text-foreground">₹{totalBill.toLocaleString()}</p>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Active Devices</p>
            <p className="text-xl font-bold text-foreground">{dashboard?.activeDevices ?? 0}</p>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Avg per Device</p>
            <p className="text-xl font-bold text-foreground">
              {appliances.length > 0 ? `${(totalUnits / appliances.length).toFixed(1)} kWh` : '0 kWh'}
            </p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <ChartsSection dashboard={dashboard} weeklyTrend={weeklyTrend} />

      {/* AI Report + Insights side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AIMonthlyReport />
        <AIInsightsCard />
      </div>

      {/* Cost breakdown table */}
      {appliances.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Appliance Cost Breakdown</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Device</th>
                  <th className="text-right py-3 px-4 font-semibold text-muted-foreground">Watts</th>
                  <th className="text-right py-3 px-4 font-semibold text-muted-foreground">Hrs/Day</th>
                  <th className="text-right py-3 px-4 font-semibold text-muted-foreground">Days/Week</th>
                  <th className="text-right py-3 px-4 font-semibold text-muted-foreground">Units/Mo</th>
                  <th className="text-right py-3 px-4 font-semibold text-muted-foreground">Cost/Mo</th>
                  <th className="text-right py-3 px-4 font-semibold text-muted-foreground">Share</th>
                </tr>
              </thead>
              <tbody>
                {(dashboard?.breakdown ?? []).map((b, idx) => (
                  <tr key={b._id} className={`border-b border-border ${idx === (dashboard?.breakdown?.length ?? 0) - 1 ? 'border-b-0' : ''}`}>
                    <td className="py-3 px-4 font-medium text-foreground">{b.name}</td>
                    <td className="py-3 px-4 text-right text-foreground">{b.watts}W</td>
                    <td className="py-3 px-4 text-right text-foreground">{b.hoursPerDay}h</td>
                    <td className="py-3 px-4 text-right text-foreground">{b.daysPerWeek}d</td>
                    <td className="py-3 px-4 text-right font-semibold text-foreground">{b.monthlyUnits} kWh</td>
                    <td className="py-3 px-4 text-right font-semibold text-primary">₹{b.monthlyCost}</td>
                    <td className="py-3 px-4 text-right text-muted-foreground">{b.percentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {appliances.length === 0 && (
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <BarChart3 className="w-10 h-10 mx-auto mb-3 text-muted-foreground opacity-40" />
          <p className="font-medium text-muted-foreground">No analytics data yet</p>
          <p className="text-sm text-muted-foreground mt-1">Add appliances from the Devices page to see analytics</p>
        </div>
      )}
    </div>
  );
}

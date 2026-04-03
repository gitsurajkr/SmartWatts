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

  const statCards = [
    {
      icon: Zap,
      label: 'Monthly Units',
      value: `${totalUnits} kWh`,
      gradient: 'from-[#0ea5e9] to-[#00e5ff]',
      iconBg: 'bg-primary/10',
    },
    {
      icon: DollarSign,
      label: 'Monthly Bill',
      value: `₹${totalBill.toLocaleString()}`,
      gradient: 'from-[#a78bfa] to-[#818cf8]',
      iconBg: 'bg-[#a78bfa]/10',
    },
    {
      icon: BarChart3,
      label: 'Active Devices',
      value: `${dashboard?.activeDevices ?? 0}`,
      gradient: 'from-[#ffab40] to-[#ff8a65]',
      iconBg: 'bg-[#ffab40]/10',
    },
    {
      icon: TrendingUp,
      label: 'Avg per Device',
      value: appliances.length > 0 ? `${(totalUnits / appliances.length).toFixed(1)} kWh` : '0 kWh',
      gradient: 'from-[#22c55e] to-[#4ade80]',
      iconBg: 'bg-[#22c55e]/10',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="animate-fade-up">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground mt-1 text-sm">Detailed energy consumption insights and trends</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => {
          const CardIcon = card.icon;
          return (
            <div
              key={card.label}
              className={`glass-card rounded-2xl p-5 flex items-center gap-4 group animate-fade-up stagger-${idx + 1}`}
            >
              <div className={`w-11 h-11 rounded-xl ${card.iconBg} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                <CardIcon className="w-5 h-5" style={{ color: 'var(--primary)' }} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">{card.label}</p>
                <p className="text-xl font-bold text-foreground">{card.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <ChartsSection dashboard={dashboard} weeklyTrend={weeklyTrend} />

      {/* AI Report + Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <AIMonthlyReport />
        <AIInsightsCard />
      </div>

      {/* Cost breakdown table */}
      {appliances.length > 0 && (
        <div className="glass-card rounded-2xl p-6 animate-fade-up">
          <h2 className="text-lg font-bold text-foreground mb-4">Appliance Cost Breakdown</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Device</th>
                  <th className="text-right py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Watts</th>
                  <th className="text-right py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Hrs/Day</th>
                  <th className="text-right py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Days/Week</th>
                  <th className="text-right py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Units/Mo</th>
                  <th className="text-right py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Cost/Mo</th>
                  <th className="text-right py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Share</th>
                </tr>
              </thead>
              <tbody>
                {(dashboard?.breakdown ?? []).map((b, idx) => (
                  <tr
                    key={b._id}
                    className={`border-b border-border/50 hover:bg-primary/[0.03] transition-all duration-300 animate-fade-up stagger-${Math.min(idx + 1, 8)} ${idx === (dashboard?.breakdown?.length ?? 0) - 1 ? 'border-b-0' : ''}`}
                  >
                    <td className="py-3 px-4 font-semibold text-foreground">{b.name}</td>
                    <td className="py-3 px-4 text-right text-foreground">{b.watts}W</td>
                    <td className="py-3 px-4 text-right text-foreground">{b.hoursPerDay}h</td>
                    <td className="py-3 px-4 text-right text-foreground">{b.daysPerWeek}d</td>
                    <td className="py-3 px-4 text-right font-bold text-foreground">{b.monthlyUnits} kWh</td>
                    <td className="py-3 px-4 text-right font-bold text-gradient">₹{b.monthlyCost}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-primary rounded-full animate-progress-fill"
                            style={{ width: `${b.percentage}%` }}
                          />
                        </div>
                        <span className="text-muted-foreground font-medium text-xs w-8">{b.percentage}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {appliances.length === 0 && (
        <div className="glass-card rounded-2xl p-16 text-center animate-fade-up">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted flex items-center justify-center">
            <BarChart3 className="w-8 h-8 text-muted-foreground opacity-30" />
          </div>
          <p className="font-semibold text-foreground/70">No analytics data yet</p>
          <p className="text-sm text-muted-foreground mt-1">Add appliances from the Devices page to see analytics</p>
        </div>
      )}
    </div>
  );
}

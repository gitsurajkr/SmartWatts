'use client';

import { useStore } from '@/lib/store';
import AIBudgetCard from '@/components/ai/AIBudgetCard';
import AIInsightsCard from '@/components/ai/AIInsightsCard';
import { Leaf, TrendingDown, Lightbulb, Target, Zap, Calculator } from 'lucide-react';

const RATE_PER_UNIT = 8;

function simulateSaving(watts: number, hoursPerDay: number, daysPerWeek: number, reduceHours: number) {
  const currentUnits = (watts * hoursPerDay * daysPerWeek * 4) / 1000;
  const reducedUnits = (watts * Math.max(0, hoursPerDay - reduceHours) * daysPerWeek * 4) / 1000;
  const savedUnits = currentUnits - reducedUnits;
  return { savedUnits: Math.round(savedUnits * 100) / 100, savedAmount: Math.round(savedUnits * RATE_PER_UNIT * 100) / 100 };
}

export default function SavingsPage() {
  const { dashboard, appliances } = useStore();

  const savings = dashboard?.savings;
  const topAppliance = dashboard?.topAppliance;

  const deviceSavings = appliances
    .filter((a) => a.status === 'active' && a.hoursPerDay > 1)
    .map((a) => {
      const sim = simulateSaving(a.watts, a.hoursPerDay, a.daysPerWeek, 1);
      return { ...a, ...sim };
    })
    .sort((a, b) => b.savedAmount - a.savedAmount);

  const totalPotentialSavings = deviceSavings.reduce((sum, d) => sum + d.savedAmount, 0);
  const totalPotentialUnits = deviceSavings.reduce((sum, d) => sum + d.savedUnits, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Savings</h1>
        <p className="text-muted-foreground mt-1">Smart recommendations to reduce your electricity bill</p>
      </div>

      {/* Top savings cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border bg-gradient-to-br from-green-500/10 to-green-500/5 p-5">
          <div className="flex items-center gap-2 mb-2">
            <Leaf className="w-5 h-5 text-green-500" />
            <p className="text-sm text-muted-foreground">Potential Monthly Savings</p>
          </div>
          <p className="text-2xl font-bold text-green-600">
            ₹{savings?.amount ?? Math.round(totalPotentialSavings)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">by reducing 1 hr/day on top consumer</p>
        </div>
        <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/10 to-primary/5 p-5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-5 h-5 text-primary" />
            <p className="text-sm text-muted-foreground">Saveable Units</p>
          </div>
          <p className="text-2xl font-bold text-primary">
            {savings?.units ?? Math.round(totalPotentialUnits * 100) / 100} kWh
          </p>
          <p className="text-xs text-muted-foreground mt-1">across all devices (1hr/day reduction)</p>
        </div>
        <div className="rounded-2xl border border-border bg-gradient-to-br from-secondary/10 to-secondary/5 p-5">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-secondary" />
            <p className="text-sm text-muted-foreground">Top Consumer</p>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {topAppliance?.name ?? 'None'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {topAppliance ? `${topAppliance.monthlyUnits} kWh (${topAppliance.percentage}%)` : 'Add devices to see'}
          </p>
        </div>
      </div>

      {/* AI Budget + AI Insights side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AIBudgetCard />
        <AIInsightsCard />
      </div>

      {/* Smart recommendations */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-orange-500" />
          <h2 className="text-lg font-semibold text-foreground">Smart Recommendations</h2>
        </div>
        <div className="space-y-3">
          {savings?.tip && (
            <div className="p-4 rounded-xl border border-border bg-orange-500/5">
              <p className="font-medium text-foreground text-sm">{savings.tip}</p>
              <p className="text-xs text-muted-foreground mt-1">This is your highest impact optimization</p>
            </div>
          )}
          <div className="p-4 rounded-xl border border-border bg-muted/30">
            <p className="font-medium text-foreground text-sm">Shift heavy-load appliances to off-peak hours</p>
            <p className="text-xs text-muted-foreground mt-1">Use appliances between 10 PM - 6 AM for potential lower rates</p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-muted/30">
            <p className="font-medium text-foreground text-sm">Switch standby devices to active only when needed</p>
            <p className="text-xs text-muted-foreground mt-1">Standby devices still consume phantom power</p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-muted/30">
            <p className="font-medium text-foreground text-sm">Consider energy-efficient alternatives</p>
            <p className="text-xs text-muted-foreground mt-1">LED lighting, inverter ACs, and 5-star rated appliances reduce consumption significantly</p>
          </div>
        </div>
      </div>

      {/* Device-by-device savings simulation */}
      {deviceSavings.length > 0 ? (
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calculator className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">1 Hr/Day Reduction Simulation</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            If you reduce each active device by 1 hour per day, here&apos;s how much you can save:
          </p>
          <div className="space-y-3">
            {deviceSavings.map((d) => (
              <div key={d._id} className="flex items-center gap-4 p-3 rounded-xl border border-border bg-muted/30">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-green-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm truncate">{d.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {d.watts}W &middot; {d.hoursPerDay}h/day &rarr; {Math.max(0, d.hoursPerDay - 1)}h/day
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-green-600 text-sm">₹{d.savedAmount}/mo</p>
                  <p className="text-xs text-muted-foreground">{d.savedUnits} kWh</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
            <p className="font-semibold text-foreground">Total Potential Savings</p>
            <p className="text-xl font-bold text-green-600">₹{Math.round(totalPotentialSavings)}/mo</p>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <Leaf className="w-10 h-10 mx-auto mb-3 text-muted-foreground opacity-40" />
          <p className="font-medium text-muted-foreground">No savings data yet</p>
          <p className="text-sm text-muted-foreground mt-1">Add appliances with more than 1 hour daily usage to see savings simulations</p>
        </div>
      )}
    </div>
  );
}

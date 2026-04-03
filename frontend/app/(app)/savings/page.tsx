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

  const topCards = [
    {
      icon: Leaf,
      label: 'Potential Monthly Savings',
      value: `₹${savings?.amount ?? Math.round(totalPotentialSavings)}`,
      sub: 'by reducing 1 hr/day on top consumer',
      iconBg: 'bg-[#22c55e]/10',
      valueColor: 'text-[#22c55e]',
      gradient: 'from-[#22c55e] to-[#4ade80]',
    },
    {
      icon: TrendingDown,
      label: 'Saveable Units',
      value: `${savings?.units ?? Math.round(totalPotentialUnits * 100) / 100} kWh`,
      sub: 'across all devices (1hr/day reduction)',
      iconBg: 'bg-primary/10',
      valueColor: 'text-gradient',
      gradient: 'from-[#0ea5e9] to-[#00e5ff]',
    },
    {
      icon: Target,
      label: 'Top Consumer',
      value: topAppliance?.name ?? 'None',
      sub: topAppliance ? `${topAppliance.monthlyUnits} kWh (${topAppliance.percentage}%)` : 'Add devices to see',
      iconBg: 'bg-[#ffab40]/10',
      valueColor: 'text-foreground',
      gradient: 'from-[#ffab40] to-[#ff8a65]',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="animate-fade-up">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Savings</h1>
        <p className="text-muted-foreground mt-1 text-sm">Smart recommendations to reduce your electricity bill</p>
      </div>

      {/* Top savings cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {topCards.map((card, idx) => {
          const CardIcon = card.icon;
          return (
            <div key={card.label} className={`glass-card rounded-2xl p-5 relative overflow-hidden group animate-fade-up stagger-${idx + 1}`}>
              <div className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-9 h-9 rounded-xl ${card.iconBg} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                  <CardIcon className="w-4.5 h-4.5 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">{card.label}</p>
              </div>
              <p className={`text-2xl font-bold ${card.valueColor}`}>
                {card.value}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{card.sub}</p>
            </div>
          );
        })}
      </div>

      {/* AI Budget + AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <AIBudgetCard />
        <AIInsightsCard />
      </div>

      {/* Smart recommendations */}
      <div className="glass-card rounded-2xl p-6 animate-fade-up">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-lg bg-[#ffab40]/10 flex items-center justify-center">
            <Lightbulb className="w-4 h-4 text-[#ffab40]" />
          </div>
          <h2 className="text-lg font-bold text-foreground">Smart Recommendations</h2>
        </div>
        <div className="space-y-3">
          {savings?.tip && (
            <div className="p-4 rounded-xl border border-[#ffab40]/20 bg-[#ffab40]/5 animate-fade-up stagger-1 hover:scale-[1.01] transition-all duration-300">
              <p className="font-semibold text-foreground text-sm">{savings.tip}</p>
              <p className="text-xs text-muted-foreground mt-1">This is your highest impact optimization</p>
            </div>
          )}
          {[
            {
              title: 'Shift heavy-load appliances to off-peak hours',
              desc: 'Use appliances between 10 PM - 6 AM for potential lower rates',
            },
            {
              title: 'Switch standby devices to active only when needed',
              desc: 'Standby devices still consume phantom power',
            },
            {
              title: 'Consider energy-efficient alternatives',
              desc: 'LED lighting, inverter ACs, and 5-star rated appliances reduce consumption significantly',
            },
          ].map((rec, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border border-border glass hover:scale-[1.01] transition-all duration-300 animate-fade-up stagger-${idx + 2}`}
            >
              <p className="font-semibold text-foreground text-sm">{rec.title}</p>
              <p className="text-xs text-muted-foreground mt-1">{rec.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Device-by-device savings simulation */}
      {deviceSavings.length > 0 ? (
        <div className="glass-card rounded-2xl p-6 animate-fade-up">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Calculator className="w-4 h-4 text-primary" />
            </div>
            <h2 className="text-lg font-bold text-foreground">1 Hr/Day Reduction Simulation</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-5">
            If you reduce each active device by 1 hour per day, here&apos;s how much you can save:
          </p>
          <div className="space-y-3">
            {deviceSavings.map((d, idx) => (
              <div
                key={d._id}
                className={`flex items-center gap-4 p-3 rounded-xl border border-border glass group hover:scale-[1.01] transition-all duration-300 animate-fade-up stagger-${Math.min(idx + 1, 8)}`}
              >
                <div className="w-10 h-10 rounded-xl bg-[#22c55e]/10 flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
                  <Zap className="w-5 h-5 text-[#22c55e]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground text-sm truncate">{d.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {d.watts}W &middot; {d.hoursPerDay}h/day &rarr; {Math.max(0, d.hoursPerDay - 1)}h/day
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-[#22c55e] text-sm">₹{d.savedAmount}/mo</p>
                  <p className="text-xs text-muted-foreground">{d.savedUnits} kWh</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 pt-5 border-t border-border flex justify-between items-center">
            <p className="font-bold text-foreground">Total Potential Savings</p>
            <p className="text-xl font-bold text-[#22c55e]">₹{Math.round(totalPotentialSavings)}/mo</p>
          </div>
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-16 text-center animate-fade-up">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted flex items-center justify-center">
            <Leaf className="w-8 h-8 text-muted-foreground opacity-30" />
          </div>
          <p className="font-semibold text-foreground/70">No savings data yet</p>
          <p className="text-sm text-muted-foreground mt-1">Add appliances with more than 1 hour daily usage to see savings simulations</p>
        </div>
      )}
    </div>
  );
}

import React from 'react'
import { AlertCircle, Lightbulb, TrendingUp, Target } from 'lucide-react'
import type { DashboardData } from '@/lib/types'

interface InsightsPanelProps {
  dashboard: DashboardData | null
}

export default function InsightsPanel({ dashboard }: InsightsPanelProps) {
  const totalUnits = dashboard?.totalUnits || 0

  const insights = [
    {
      icon: Lightbulb,
      title: dashboard?.savings.tip || 'Add appliances to see savings tips',
      description: dashboard?.savings.amount
        ? `Potential saving: ₹${dashboard.savings.amount}/month`
        : 'Log your devices to get personalized recommendations',
      severity: 'warning' as const,
      color: 'text-[#ffab40]',
      bg: 'bg-[#ffab40]/5',
      border: 'border-[#ffab40]/20',
    },
    {
      icon: TrendingUp,
      title: 'Peak hours detection',
      description: 'Shift heavy-load appliances to off-peak hours (10 PM – 6 AM) for lower rates',
      severity: 'info' as const,
      color: 'text-primary',
      bg: 'bg-primary/5',
      border: 'border-primary/20',
    },
    {
      icon: Target,
      title: 'Monthly projection',
      description: totalUnits > 0
        ? `On track to consume ${totalUnits.toLocaleString()} kWh this month`
        : 'Add devices to see your monthly projection',
      severity: 'success' as const,
      color: 'text-[#22c55e]',
      bg: 'bg-[#22c55e]/5',
      border: 'border-[#22c55e]/20',
    },
  ]

  return (
    <div className="space-y-5">
      {/* Smart Insights */}
      <div className="glass-card rounded-2xl p-6 animate-fade-up">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-foreground">Smart Insights</h2>
        </div>

        <div className="space-y-3">
          {insights.map((insight, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border ${insight.border} ${insight.bg} transition-all duration-300 hover:scale-[1.02] animate-fade-up stagger-${idx + 1}`}
            >
              <div className="flex gap-3">
                <insight.icon
                  className={`w-5 h-5 flex-shrink-0 mt-0.5 ${insight.color}`}
                />
                <div>
                  <p className="font-semibold text-foreground text-sm">{insight.title}</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {insight.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Energy Consumer Card */}
      <div className="glass-card rounded-2xl p-6 relative overflow-hidden group animate-fade-up stagger-4">
        {/* Ambient glow */}
        <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-primary/5 blur-3xl group-hover:bg-primary/10 transition-all duration-700" />
        <div className="absolute -bottom-10 -left-10 w-28 h-28 rounded-full bg-accent/5 blur-3xl group-hover:bg-accent/10 transition-all duration-700" />

        <div className="relative z-10 space-y-4">
          <div className="flex items-start justify-between">
            <h3 className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase">Top Energy Consumer</h3>
            <AlertCircle className="w-4 h-4 text-primary animate-pulse-dot" />
          </div>

          {dashboard?.topAppliance ? (
            <>
              <p className="text-2xl font-bold text-gradient">{dashboard.topAppliance.name}</p>

              <div className="space-y-2 pt-3 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-medium">Usage</span>
                  <span className="font-bold text-foreground">
                    {dashboard.topAppliance.monthlyUnits} kWh ({dashboard.topAppliance.percentage}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-primary rounded-full animate-progress-fill"
                    style={{ width: `${dashboard.topAppliance.percentage}%` }}
                  />
                </div>
              </div>

              {dashboard.savings.amount > 0 && (
                <div className="pt-3 border-t border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground font-medium">Saveable</span>
                    <span className="font-bold text-[#22c55e]">₹{dashboard.savings.amount}/mo</span>
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="text-muted-foreground text-sm">No devices added yet</p>
          )}
        </div>
      </div>
    </div>
  )
}

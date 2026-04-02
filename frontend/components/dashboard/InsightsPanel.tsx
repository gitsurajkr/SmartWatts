import React from 'react'
import { AlertCircle, Lightbulb, TrendingUp, Target } from 'lucide-react'
import type { DashboardData } from '@/lib/types'

interface InsightsPanelProps {
  dashboard: DashboardData | null
}

export default function InsightsPanel({ dashboard }: InsightsPanelProps) {
  const totalUnits = dashboard?.totalUnits || 0
  const topName = dashboard?.topAppliance?.name || 'your top device'

  const insights = [
    {
      icon: Lightbulb,
      title: dashboard?.savings.tip || 'Add appliances to see savings tips',
      description: dashboard?.savings.amount
        ? `Potential saving: ₹${dashboard.savings.amount}/month`
        : 'Log your devices to get personalized recommendations',
      severity: 'warning' as const,
    },
    {
      icon: TrendingUp,
      title: 'Peak hours detection',
      description: 'Shift heavy-load appliances to off-peak hours (10 PM – 6 AM) for lower rates',
      severity: 'info' as const,
    },
    {
      icon: Target,
      title: 'Monthly projection',
      description: totalUnits > 0
        ? `On track to consume ${totalUnits.toLocaleString()} kWh this month`
        : 'Add devices to see your monthly projection',
      severity: 'success' as const,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Smart Insights */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-foreground">Smart Insights</h2>
        </div>

        <div className="space-y-4">
          {insights.map((insight, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-border bg-muted/30 transition-all text-left w-full"
            >
              <div className="flex gap-3">
                <insight.icon
                  className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                    insight.severity === 'warning'
                      ? 'text-orange-500'
                      : insight.severity === 'info'
                        ? 'text-primary'
                        : 'text-secondary'
                  }`}
                />
                <div>
                  <p className="font-medium text-foreground text-sm">{insight.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {insight.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Energy Consumer Card */}
      <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/10 to-secondary/10 p-6 relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-primary/5 blur-3xl" />

        <div className="relative z-10 space-y-4">
          <div className="flex items-start justify-between">
            <h3 className="text-sm font-semibold text-muted-foreground">TOP ENERGY CONSUMER</h3>
            <AlertCircle className="w-4 h-4 text-primary" />
          </div>

          {dashboard?.topAppliance ? (
            <>
              <p className="text-2xl font-bold text-foreground">{dashboard.topAppliance.name}</p>

              <div className="space-y-2 pt-2 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Usage</span>
                  <span className="font-semibold text-foreground">
                    {dashboard.topAppliance.monthlyUnits} kWh ({dashboard.topAppliance.percentage}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                    style={{ width: `${dashboard.topAppliance.percentage}%` }}
                  />
                </div>
              </div>

              {dashboard.savings.amount > 0 && (
                <div className="pt-2 border-t border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Saveable</span>
                    <span className="font-semibold text-green-500">₹{dashboard.savings.amount}/mo</span>
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

import React from 'react'
import { Zap, DollarSign, Leaf, BarChart3 } from 'lucide-react'
import type { DashboardData } from '@/lib/types'

interface AnalyticsCardsProps {
  dashboard: DashboardData | null
}

export default function AnalyticsCards({ dashboard }: AnalyticsCardsProps) {
  const cards = [
    {
      id: 'usage',
      title: 'Total Units',
      value: dashboard ? `${dashboard.totalUnits.toLocaleString()} kWh` : '—',
      change: 'Monthly consumption',
      icon: Zap,
      bgGradient: 'from-primary/10 to-primary/5',
      iconColor: 'text-primary',
    },
    {
      id: 'bill',
      title: 'Estimated Bill',
      value: dashboard ? `₹${dashboard.totalBill.toLocaleString()}` : '—',
      change: dashboard ? `@₹${dashboard.ratePerUnit}/kWh` : '',
      icon: DollarSign,
      bgGradient: 'from-blue-500/10 to-blue-500/5',
      iconColor: 'text-blue-500',
    },
    {
      id: 'top',
      title: 'Top Consumer',
      value: dashboard?.topAppliance?.name || 'N/A',
      change: dashboard?.topAppliance
        ? `${dashboard.topAppliance.monthlyUnits} kWh (${dashboard.topAppliance.percentage}%)`
        : 'No appliances yet',
      icon: BarChart3,
      bgGradient: 'from-secondary/10 to-secondary/5',
      iconColor: 'text-secondary',
    },
    {
      id: 'savings',
      title: 'Potential Savings',
      value: dashboard ? `₹${dashboard.savings.amount.toLocaleString()}` : '—',
      change: dashboard?.savings.units
        ? `${dashboard.savings.units} kWh saveable`
        : 'Add appliances to see savings',
      icon: Leaf,
      bgGradient: 'from-green-500/10 to-green-500/5',
      iconColor: 'text-green-500',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {cards.map((card) => {
        const CardIcon = card.icon
        return (
          <div
            key={card.id}
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.bgGradient} border border-border p-6 transition-all hover:shadow-lg hover:-translate-y-1`}
          >
            {/* Background accent */}
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-primary/5 blur-3xl" />

            <div className="relative z-10">
              {/* Header with icon */}
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">{card.title}</h3>
                <CardIcon className={`w-5 h-5 ${card.iconColor}`} />
              </div>

              {/* Value */}
              <p className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                {card.value}
              </p>

              {/* Change indicator */}
              <p className="text-xs text-secondary font-medium">{card.change}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

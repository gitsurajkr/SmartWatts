'use client'

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
      gradient: 'from-[#0ea5e9] to-[#00e5ff]',
      glowColor: 'var(--glow-primary)',
      iconBg: 'bg-[#0ea5e9]/10',
    },
    {
      id: 'bill',
      title: 'Estimated Bill',
      value: dashboard ? `₹${dashboard.totalBill.toLocaleString()}` : '—',
      change: dashboard ? `@₹${dashboard.ratePerUnit}/kWh` : '',
      icon: DollarSign,
      gradient: 'from-[#a78bfa] to-[#818cf8]',
      glowColor: 'rgba(167, 139, 250, 0.2)',
      iconBg: 'bg-[#a78bfa]/10',
    },
    {
      id: 'top',
      title: 'Top Consumer',
      value: dashboard?.topAppliance?.name || 'N/A',
      change: dashboard?.topAppliance
        ? `${dashboard.topAppliance.monthlyUnits} kWh (${dashboard.topAppliance.percentage}%)`
        : 'No appliances yet',
      icon: BarChart3,
      gradient: 'from-[#ffab40] to-[#ff8a65]',
      glowColor: 'var(--glow-secondary)',
      iconBg: 'bg-[#ffab40]/10',
    },
    {
      id: 'savings',
      title: 'Potential Savings',
      value: dashboard ? `₹${dashboard.savings.amount.toLocaleString()}` : '—',
      change: dashboard?.savings.units
        ? `${dashboard.savings.units} kWh saveable`
        : 'Add appliances to see savings',
      icon: Leaf,
      gradient: 'from-[#22c55e] to-[#4ade80]',
      glowColor: 'rgba(34, 197, 94, 0.2)',
      iconBg: 'bg-[#22c55e]/10',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
      {cards.map((card, idx) => {
        const CardIcon = card.icon
        return (
          <div
            key={card.id}
            className={`relative overflow-hidden glass-card rounded-2xl p-5 group animate-fade-up stagger-${idx + 1}`}
            style={{ '--card-glow': card.glowColor } as React.CSSProperties}
          >
            {/* Ambient glow */}
            <div
              className="absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-60 transition-opacity duration-700"
              style={{ background: `radial-gradient(circle, ${card.glowColor}, transparent)` }}
            />

            <div className="relative z-10">
              {/* Header with icon */}
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{card.title}</h3>
                <div className={`w-9 h-9 rounded-xl ${card.iconBg} flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:animate-float`}>
                  <CardIcon className="w-4.5 h-4.5" style={{ color: card.glowColor.includes('primary') ? 'var(--primary)' : undefined }} />
                </div>
              </div>

              {/* Value */}
              <p className="text-2xl md:text-3xl font-bold text-foreground mb-1.5 tracking-tight">
                {card.value}
              </p>

              {/* Change indicator */}
              <p className="text-xs text-muted-foreground font-medium">{card.change}</p>
            </div>

            {/* Bottom gradient line */}
            <div className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
          </div>
        )
      })}
    </div>
  )
}

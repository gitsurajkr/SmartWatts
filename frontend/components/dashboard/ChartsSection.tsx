'use client'

import React from 'react'
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import type { DashboardData, WeeklyDataPoint } from '@/lib/types'

interface ChartsSectionProps {
  dashboard: DashboardData | null
  weeklyTrend: WeeklyDataPoint[]
}

const COLORS = ['#0066ff', '#00d9a3', '#6b5eff', '#ff6b6b', '#ffa726', '#26c6da', '#ab47bc', '#ec407a']

export default function ChartsSection({ dashboard, weeklyTrend }: ChartsSectionProps) {
  // Build donut chart data from dashboard breakdown
  const pieData =
    dashboard?.breakdown?.map((b) => ({
      name: b.name,
      value: b.monthlyUnits,
    })) || []

  const hasChartData = pieData.length > 0
  const hasTrendData = weeklyTrend.length > 0

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Weekly Usage Chart */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-1">Weekly Usage</h2>
          <p className="text-sm text-muted-foreground">kWh consumption trend</p>
        </div>

        {hasTrendData ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyTrend} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="label" stroke="var(--muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '0.75rem',
                  color: 'var(--foreground)',
                }}
                labelStyle={{ color: 'var(--foreground)' }}
                formatter={(value) => [`${Number(value).toFixed(2)} kWh`, '']}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="usage"
                name="Usage"
                stroke="var(--primary)"
                strokeWidth={2}
                dot={{ fill: 'var(--primary)' }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="target"
                name="Target"
                stroke="var(--muted-foreground)"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: 'var(--muted)' }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <p className="text-sm">No trend data yet</p>
              <p className="text-xs mt-1">Add appliances to see weekly usage trends</p>
            </div>
          </div>
        )}
      </div>

      {/* Appliance Distribution Chart */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-1">
            Appliance Distribution
          </h2>
          <p className="text-sm text-muted-foreground">Percentage of total monthly usage</p>
        </div>

        {hasChartData ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                outerRadius={100}
                innerRadius={40}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '0.75rem',
                  color: 'var(--foreground)',
                }}
                formatter={(value) => [`${Number(value).toFixed(2)} kWh`, 'Monthly Units']}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <p className="text-sm">No appliances added</p>
              <p className="text-xs mt-1">Add devices to see your usage breakdown</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

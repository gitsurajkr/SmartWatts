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

const COLORS = ['#0ea5e9', '#00e5ff', '#a78bfa', '#f43f5e', '#ffab40', '#22c55e', '#818cf8', '#fb923c']

export default function ChartsSection({ dashboard, weeklyTrend }: ChartsSectionProps) {
  const pieData =
    dashboard?.breakdown?.map((b) => ({
      name: b.name,
      value: b.monthlyUnits,
    })) || []

  const hasChartData = pieData.length > 0
  const hasTrendData = weeklyTrend.length > 0

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Weekly Usage Chart */}
      <div className="glass-card rounded-2xl p-6 animate-fade-up stagger-1">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-foreground mb-1">Weekly Usage</h2>
          <p className="text-xs text-muted-foreground font-medium">kWh consumption trend</p>
        </div>

        {hasTrendData ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyTrend} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#0ea5e9" />
                  <stop offset="100%" stopColor="#00e5ff" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="label" stroke="var(--muted-foreground)" fontSize={11} fontFamily="Inter" />
              <YAxis stroke="var(--muted-foreground)" fontSize={11} fontFamily="Inter" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card-solid)',
                  border: '1px solid var(--border)',
                  borderRadius: '0.75rem',
                  color: 'var(--foreground)',
                  fontFamily: 'Inter',
                  backdropFilter: 'blur(16px)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                }}
                labelStyle={{ color: 'var(--foreground)', fontWeight: 600 }}
                formatter={(value) => [`${Number(value).toFixed(2)} kWh`, '']}
              />
              <Legend wrapperStyle={{ fontFamily: 'Inter', fontSize: 12 }} />
              <Line
                type="monotone"
                dataKey="usage"
                name="Usage"
                stroke="url(#lineGrad)"
                strokeWidth={3}
                dot={{ fill: '#0ea5e9', r: 4, strokeWidth: 2, stroke: '#0ea5e9' }}
                activeDot={{ r: 7, fill: '#00e5ff', stroke: '#0ea5e9', strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="target"
                name="Target"
                stroke="var(--muted-foreground)"
                strokeWidth={2}
                strokeDasharray="6 4"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-muted flex items-center justify-center">
                <BarChartIcon className="w-6 h-6 opacity-40" />
              </div>
              <p className="text-sm font-medium">No trend data yet</p>
              <p className="text-xs mt-1 opacity-70">Add appliances to see weekly usage trends</p>
            </div>
          </div>
        )}
      </div>

      {/* Appliance Distribution Chart */}
      <div className="glass-card rounded-2xl p-6 animate-fade-up stagger-2">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-foreground mb-1">
            Appliance Distribution
          </h2>
          <p className="text-xs text-muted-foreground font-medium">Percentage of total monthly usage</p>
        </div>

        {hasChartData ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <defs>
                {COLORS.map((color, i) => (
                  <linearGradient key={i} id={`pieGrad-${i}`} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={1} />
                    <stop offset="100%" stopColor={color} stopOpacity={0.7} />
                  </linearGradient>
                ))}
              </defs>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                outerRadius={100}
                innerRadius={45}
                fill="#8884d8"
                dataKey="value"
                strokeWidth={2}
                stroke="var(--background)"
              >
                {pieData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={`url(#pieGrad-${index % COLORS.length})`} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card-solid)',
                  border: '1px solid var(--border)',
                  borderRadius: '0.75rem',
                  color: 'var(--foreground)',
                  fontFamily: 'Inter',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                }}
                formatter={(value) => [`${Number(value).toFixed(2)} kWh`, 'Monthly Units']}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-muted flex items-center justify-center">
                <PieChartIcon className="w-6 h-6 opacity-40" />
              </div>
              <p className="text-sm font-medium">No appliances added</p>
              <p className="text-xs mt-1 opacity-70">Add devices to see your usage breakdown</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function BarChartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13h2v8H3zM9 8h2v13H9zM15 11h2v10h-2zM21 4h2v17h-2z" />
    </svg>
  )
}

function PieChartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
    </svg>
  )
}

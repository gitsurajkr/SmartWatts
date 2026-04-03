'use client'

import React, { useState } from 'react'
import { X, Zap } from 'lucide-react'
import { useStore } from '@/lib/store'
import type { Appliance, ApplianceFormData } from '@/lib/types'

interface AddApplianceModalProps {
  onClose: () => void
  editingAppliance?: Appliance | null
}

const APPLIANCE_PRESETS: { name: string; watts: number }[] = [
  { name: 'Air Conditioner', watts: 1500 },
  { name: 'Refrigerator', watts: 200 },
  { name: 'Washing Machine', watts: 500 },
  { name: 'Water Heater', watts: 2000 },
  { name: 'Microwave', watts: 1000 },
  { name: 'Television', watts: 100 },
  { name: 'Fan', watts: 75 },
  { name: 'Lighting', watts: 60 },
]

const RATE_PER_UNIT = 8 // ₹8/kWh — matches backend

export default function AddApplianceModal({
  onClose,
  editingAppliance,
}: AddApplianceModalProps) {
  const { addAppliance, updateAppliance } = useStore()

  const isEditing = !!editingAppliance

  const [form, setForm] = useState<ApplianceFormData>({
    name: editingAppliance?.name || '',
    watts: editingAppliance?.watts || '',
    hoursPerDay: editingAppliance?.hoursPerDay || '',
    daysPerWeek: editingAppliance?.daysPerWeek || 7,
    status: editingAppliance?.status || 'active',
  })

  const [errors, setErrors] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  // Live calculation preview
  const watts = Number(form.watts) || 0
  const hours = Number(form.hoursPerDay) || 0
  const days = Number(form.daysPerWeek) || 0
  const monthlyUnits = (watts * hours * days * 4) / 1000
  const monthlyCost = monthlyUnits * RATE_PER_UNIT

  const handleChange = (field: keyof ApplianceFormData, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors([])
  }

  const handlePresetClick = (preset: { name: string; watts: number }) => {
    setForm((prev) => ({ ...prev, name: preset.name, watts: preset.watts }))
    setErrors([])
  }

  const handleSubmit = async () => {
    // Client-side validation
    const validationErrors: string[] = []
    if (!form.name || !String(form.name).trim()) validationErrors.push('Name is required')
    if (!form.watts || Number(form.watts) < 1) validationErrors.push('Watts must be at least 1')
    if (form.hoursPerDay === '' || Number(form.hoursPerDay) < 0 || Number(form.hoursPerDay) > 24)
      validationErrors.push('Hours must be between 0 and 24')
    if (!form.daysPerWeek || Number(form.daysPerWeek) < 1 || Number(form.daysPerWeek) > 7)
      validationErrors.push('Days must be between 1 and 7')

    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      return
    }

    setSaving(true)
    try {
      if (isEditing && editingAppliance) {
        await updateAppliance(editingAppliance._id, form)
      } else {
        await addAppliance(form)
      }
      onClose()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save'
      setErrors([message])
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="glass-strong rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-foreground">
              {isEditing ? 'Edit Device' : 'Add Device'}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isEditing ? 'Update device details' : 'Register a new device to track'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-xl transition-all duration-300 hover:scale-110 hover:rotate-90"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Messages */}
        {errors.length > 0 && (
          <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 animate-fade-up">
            {errors.map((err, i) => (
              <p key={i} className="text-sm text-destructive font-medium">
                {err}
              </p>
            ))}
          </div>
        )}

        {/* Form Fields */}
        <div className="space-y-4 mb-6">
          {/* Name */}
          <div className="animate-fade-up stagger-1">
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">
              Device Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g., Air Conditioner"
              className="w-full px-4 py-3 rounded-xl border border-border bg-muted/50 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-300"
            />
          </div>

          {/* Watts */}
          <div className="animate-fade-up stagger-2">
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">
              Power Rating (Watts)
            </label>
            <input
              type="number"
              value={form.watts}
              onChange={(e) => handleChange('watts', e.target.value)}
              placeholder="e.g., 1500"
              min="1"
              max="50000"
              className="w-full px-4 py-3 rounded-xl border border-border bg-muted/50 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-300"
            />
          </div>

          {/* Hours & Days row */}
          <div className="grid grid-cols-2 gap-4 animate-fade-up stagger-3">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">
                Hours / Day
              </label>
              <input
                type="number"
                value={form.hoursPerDay}
                onChange={(e) => handleChange('hoursPerDay', e.target.value)}
                placeholder="e.g., 8"
                min="0"
                max="24"
                step="0.5"
                className="w-full px-4 py-3 rounded-xl border border-border bg-muted/50 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-300"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">
                Days / Week
              </label>
              <input
                type="number"
                value={form.daysPerWeek}
                onChange={(e) => handleChange('daysPerWeek', e.target.value)}
                placeholder="e.g., 7"
                min="1"
                max="7"
                className="w-full px-4 py-3 rounded-xl border border-border bg-muted/50 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-300"
              />
            </div>
          </div>

          {/* Status Toggle */}
          <div className="animate-fade-up stagger-4">
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">
              Status
            </label>
            <div className="flex gap-2">
              {(['active', 'standby'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleChange('status', s)}
                  className={`flex-1 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all duration-300 capitalize ${
                    form.status === s
                      ? s === 'active'
                        ? 'bg-[#22c55e]/10 text-[#22c55e] border-[#22c55e]/30 shadow-sm'
                        : 'bg-muted text-muted-foreground border-border'
                      : 'border-border text-muted-foreground hover:bg-muted/50 hover:border-border'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Calculation Preview */}
        {watts > 0 && hours > 0 && (
          <div className="mb-6 p-4 rounded-xl glass-card border border-primary/20 animate-fade-up">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-white" />
              </div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Estimated Monthly
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {monthlyUnits.toFixed(1)} <span className="text-sm font-normal text-muted-foreground">kWh</span>
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gradient">
                  ₹{Math.round(monthlyCost).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Presets — only show when adding */}
        {!isEditing && (
          <div className="mb-6 animate-fade-up stagger-5">
            <p className="text-[10px] font-bold text-muted-foreground mb-3 uppercase tracking-widest">
              Quick Add Presets
            </p>
            <div className="grid grid-cols-2 gap-2">
              {APPLIANCE_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handlePresetClick(preset)}
                  className={`px-3 py-2.5 rounded-xl border text-sm font-medium transition-all duration-300 text-left hover:scale-[1.02] ${
                    form.name === preset.name
                      ? 'border-primary bg-primary/5 text-primary shadow-sm'
                      : 'border-border hover:border-primary/30 hover:bg-primary/5 text-foreground'
                  }`}
                >
                  <span className="block font-semibold">{preset.name}</span>
                  <span className="text-xs text-muted-foreground">{preset.watts}W</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={saving}
            className="flex-1 px-4 py-3 rounded-xl border border-border text-foreground hover:bg-muted transition-all duration-300 font-semibold disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex-1 px-4 py-3 rounded-xl bg-gradient-primary text-white hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 font-semibold disabled:opacity-50 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
          >
            {saving ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : isEditing ? (
              'Save Changes'
            ) : (
              'Add Device'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl border border-border w-full max-w-lg p-6 shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">
            {isEditing ? 'Edit Device' : 'Add Device'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Messages */}
        {errors.length > 0 && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
            {errors.map((err, i) => (
              <p key={i} className="text-sm text-red-500">
                {err}
              </p>
            ))}
          </div>
        )}

        {/* Form Fields */}
        <div className="space-y-4 mb-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Device Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g., Air Conditioner"
              className="w-full px-4 py-3 rounded-lg border border-border bg-muted text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
            />
          </div>

          {/* Watts */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Power Rating (Watts)
            </label>
            <input
              type="number"
              value={form.watts}
              onChange={(e) => handleChange('watts', e.target.value)}
              placeholder="e.g., 1500"
              min="1"
              max="50000"
              className="w-full px-4 py-3 rounded-lg border border-border bg-muted text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
            />
          </div>

          {/* Hours & Days row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
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
                className="w-full px-4 py-3 rounded-lg border border-border bg-muted text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Days / Week
              </label>
              <input
                type="number"
                value={form.daysPerWeek}
                onChange={(e) => handleChange('daysPerWeek', e.target.value)}
                placeholder="e.g., 7"
                min="1"
                max="7"
                className="w-full px-4 py-3 rounded-lg border border-border bg-muted text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>
          </div>

          {/* Status Toggle */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Status
            </label>
            <div className="flex gap-2">
              {(['active', 'standby'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleChange('status', s)}
                  className={`flex-1 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all capitalize ${
                    form.status === s
                      ? s === 'active'
                        ? 'bg-secondary/20 text-secondary border-secondary/40'
                        : 'bg-muted text-muted-foreground border-border'
                      : 'border-border text-muted-foreground hover:bg-muted/50'
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
          <div className="mb-6 p-4 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/10">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-primary" />
              <p className="text-xs font-semibold text-muted-foreground uppercase">
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
                <p className="text-2xl font-bold text-primary">
                  ₹{Math.round(monthlyCost).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Presets — only show when adding */}
        {!isEditing && (
          <div className="mb-6">
            <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase">
              Quick Add Presets
            </p>
            <div className="grid grid-cols-2 gap-2">
              {APPLIANCE_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handlePresetClick(preset)}
                  className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all text-left ${
                    form.name === preset.name
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border hover:border-primary/30 hover:bg-primary/5 text-foreground'
                  }`}
                >
                  <span className="block">{preset.name}</span>
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
            className="flex-1 px-4 py-3 rounded-lg border border-border text-foreground hover:bg-muted transition-colors font-medium disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex-1 px-4 py-3 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
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

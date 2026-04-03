'use client'

import React, { useState } from 'react'
import { Plus, Zap, Pencil, Trash2, AlertTriangle } from 'lucide-react'
import type { Appliance } from '@/lib/types'

interface ApplianceTableProps {
  appliances: Appliance[]
  onAddAppliance: () => void
  onEditAppliance: (appliance: Appliance) => void
  onRemoveAppliance: (id: string) => void
}

export default function ApplianceTable({
  appliances,
  onAddAppliance,
  onEditAppliance,
  onRemoveAppliance,
}: ApplianceTableProps) {
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const handleDeleteClick = (id: string) => {
    setConfirmDeleteId(id)
  }

  const handleConfirmDelete = async () => {
    if (!confirmDeleteId) return
    setDeleting(true)
    try {
      await onRemoveAppliance(confirmDeleteId)
    } finally {
      setConfirmDeleteId(null)
      setDeleting(false)
    }
  }

  const confirmAppliance = appliances.find((a) => a._id === confirmDeleteId)

  return (
    <>
      <div className="glass-card rounded-2xl p-6 animate-fade-up">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-foreground mb-1">Connected Devices</h2>
            <p className="text-xs text-muted-foreground font-medium">
              {appliances.length} device{appliances.length !== 1 ? 's' : ''} registered
            </p>
          </div>
          <button
            onClick={onAddAppliance}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-primary text-white hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 font-semibold text-sm hover:scale-105 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Device</span>
          </button>
        </div>

        {appliances.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted flex items-center justify-center">
              <Zap className="w-8 h-8 opacity-30" />
            </div>
            <p className="font-semibold text-foreground/70">No devices added yet</p>
            <p className="text-sm mt-1 opacity-60">Click &quot;Add Device&quot; to start tracking your electricity usage</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                    Device
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider hidden sm:table-cell">
                    Watts
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider hidden md:table-cell">
                    Hrs/Day
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                    Units/Mo
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider hidden lg:table-cell">
                    Cost/Mo
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {appliances.map((appliance, idx) => (
                  <tr
                    key={appliance._id}
                    className={`border-b border-border/50 hover:bg-primary/[0.03] transition-all duration-300 group animate-fade-up stagger-${Math.min(idx + 1, 8)} ${
                      idx === appliances.length - 1 ? 'border-b-0' : ''
                    }`}
                  >
                    {/* Device Name */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
                          <Zap className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{appliance.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {appliance.daysPerWeek}d/week
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Watts */}
                    <td className="py-4 px-4 text-right hidden sm:table-cell">
                      <p className="text-foreground font-medium">{appliance.watts}W</p>
                    </td>

                    {/* Hours/Day */}
                    <td className="py-4 px-4 text-right hidden md:table-cell">
                      <p className="text-foreground font-medium">{appliance.hoursPerDay}h</p>
                    </td>

                    {/* Monthly Units */}
                    <td className="py-4 px-4 text-right">
                      <p className="font-bold text-foreground">
                        {appliance.monthlyUnits} kWh
                      </p>
                    </td>

                    {/* Monthly Cost */}
                    <td className="py-4 px-4 text-right hidden lg:table-cell">
                      <p className="font-bold text-gradient">
                        ₹{appliance.monthlyCost}
                      </p>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      <div className="flex justify-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                            appliance.status === 'active'
                              ? 'bg-[#22c55e]/10 text-[#22c55e]'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            appliance.status === 'active' ? 'bg-[#22c55e] animate-pulse-dot' : 'bg-muted-foreground'
                          }`} />
                          {appliance.status === 'active' ? 'Active' : 'Standby'}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4">
                      <div className="flex justify-center gap-1">
                        <button
                          onClick={() => onEditAppliance(appliance)}
                          className="p-2 hover:bg-primary/10 rounded-xl transition-all duration-300 text-muted-foreground hover:text-primary hover:scale-110"
                          title="Edit device"
                          aria-label="Edit device"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(appliance._id)}
                          className="p-2 hover:bg-destructive/10 rounded-xl transition-all duration-300 text-muted-foreground hover:text-destructive hover:scale-110"
                          title="Remove device"
                          aria-label="Remove device"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDeleteId && confirmAppliance && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="glass-strong rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-scale-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Remove Device</h3>
                <p className="text-xs text-muted-foreground">This action cannot be undone</p>
              </div>
            </div>

            <p className="text-sm text-foreground mb-6">
              Are you sure you want to remove <strong>{confirmAppliance.name}</strong> ({confirmAppliance.monthlyUnits} kWh/month)?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 rounded-xl border border-border text-foreground hover:bg-muted transition-all duration-300 font-semibold disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                id="confirm-delete-btn"
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 rounded-xl bg-destructive text-white hover:bg-destructive/90 transition-all duration-300 font-semibold disabled:opacity-50 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-destructive/25"
              >
                {deleting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Removing...
                  </>
                ) : (
                  'Remove'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

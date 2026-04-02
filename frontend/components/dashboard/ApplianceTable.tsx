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
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-1">Connected Devices</h2>
            <p className="text-sm text-muted-foreground">
              {appliances.length} device{appliances.length !== 1 ? 's' : ''} registered
            </p>
          </div>
          <button
            onClick={onAddAppliance}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors font-medium text-sm"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Device</span>
          </button>
        </div>

        {appliances.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Zap className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="font-medium">No devices added yet</p>
            <p className="text-sm mt-1">Click &quot;Add Device&quot; to start tracking your electricity usage</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">
                    Device
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-muted-foreground hidden sm:table-cell">
                    Watts
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-muted-foreground hidden md:table-cell">
                    Hrs/Day
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-muted-foreground">
                    Units/Mo
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-muted-foreground hidden lg:table-cell">
                    Cost/Mo
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-muted-foreground">
                    Status
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {appliances.map((appliance, idx) => (
                  <tr
                    key={appliance._id}
                    className={`border-b border-border hover:bg-muted/30 transition-colors ${
                      idx === appliances.length - 1 ? 'border-b-0' : ''
                    }`}
                  >
                    {/* Device Name */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center flex-shrink-0">
                          <Zap className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{appliance.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {appliance.daysPerWeek}d/week
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Watts */}
                    <td className="py-4 px-4 text-right hidden sm:table-cell">
                      <p className="text-foreground">{appliance.watts}W</p>
                    </td>

                    {/* Hours/Day */}
                    <td className="py-4 px-4 text-right hidden md:table-cell">
                      <p className="text-foreground">{appliance.hoursPerDay}h</p>
                    </td>

                    {/* Monthly Units */}
                    <td className="py-4 px-4 text-right">
                      <p className="font-semibold text-foreground">
                        {appliance.monthlyUnits} kWh
                      </p>
                    </td>

                    {/* Monthly Cost */}
                    <td className="py-4 px-4 text-right hidden lg:table-cell">
                      <p className="font-semibold text-primary">
                        ₹{appliance.monthlyCost}
                      </p>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      <div className="flex justify-center">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            appliance.status === 'active'
                              ? 'bg-secondary/20 text-secondary'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {appliance.status === 'active' ? 'Active' : 'Standby'}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4">
                      <div className="flex justify-center gap-1">
                        <button
                          onClick={() => onEditAppliance(appliance)}
                          className="p-2 hover:bg-primary/10 rounded-lg transition-colors text-primary hover:text-primary"
                          title="Edit device"
                          aria-label="Edit device"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(appliance._id)}
                          className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-red-500 hover:text-red-600"
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-2xl border border-border shadow-2xl max-w-sm w-full p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Remove Device</h3>
                <p className="text-sm text-muted-foreground">This action cannot be undone</p>
              </div>
            </div>

            <p className="text-sm text-foreground mb-6">
              Are you sure you want to remove <strong>{confirmAppliance.name}</strong> ({confirmAppliance.monthlyUnits} kWh/month)?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 rounded-lg border border-border text-foreground hover:bg-muted transition-colors font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                id="confirm-delete-btn"
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
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

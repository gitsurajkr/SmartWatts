'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import type { Appliance } from '@/lib/types';
import ApplianceTable from '@/components/dashboard/ApplianceTable';
import AddApplianceModal from '@/components/dashboard/AddApplianceModal';
import { Zap } from 'lucide-react';

export default function DevicesPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAppliance, setEditingAppliance] = useState<Appliance | null>(null);
  const { appliances, dashboard, removeAppliance, error, clearError } = useStore();

  const handleOpenAdd = () => {
    setEditingAppliance(null);
    setShowAddModal(true);
  };

  const handleOpenEdit = (appliance: Appliance) => {
    setEditingAppliance(appliance);
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingAppliance(null);
  };

  const handleDelete = async (id: string) => {
    try {
      await removeAppliance(id);
    } catch {
      // error handled in store
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Devices</h1>
          <p className="text-muted-foreground mt-1">Manage your connected appliances and track their energy usage</p>
        </div>

        {error && (
          <div className="flex items-center justify-between p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500">
            <p className="text-sm font-medium">{error}</p>
            <button onClick={clearError} className="text-red-400 hover:text-red-300 text-sm font-medium ml-4">Dismiss</button>
          </div>
        )}

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground mb-1">Total Devices</p>
            <p className="text-2xl font-bold text-foreground">{dashboard?.totalDevices ?? 0}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground mb-1">Active Devices</p>
            <p className="text-2xl font-bold text-secondary">{dashboard?.activeDevices ?? 0}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground mb-1">Total Monthly Usage</p>
            <p className="text-2xl font-bold text-primary">{dashboard?.totalUnits ? `${dashboard.totalUnits} kWh` : '0 kWh'}</p>
          </div>
        </div>

        {/* Device-wise breakdown bar chart */}
        {appliances.length > 0 && (
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Device-wise Monthly Usage</h2>
            <div className="space-y-3">
              {appliances.map((app) => {
                const maxUnits = Math.max(...appliances.map((a) => a.monthlyUnits), 1);
                const pct = (app.monthlyUnits / maxUnits) * 100;
                return (
                  <div key={app._id} className="flex items-center gap-3">
                    <div className="w-36 flex-shrink-0 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-foreground truncate">{app.name}</span>
                    </div>
                    <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-foreground w-24 text-right">
                      {app.monthlyUnits} kWh
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <ApplianceTable
          appliances={appliances}
          onAddAppliance={handleOpenAdd}
          onEditAppliance={handleOpenEdit}
          onRemoveAppliance={handleDelete}
        />
      </div>

      {showAddModal && (
        <AddApplianceModal
          onClose={handleCloseModal}
          editingAppliance={editingAppliance}
        />
      )}
    </>
  );
}

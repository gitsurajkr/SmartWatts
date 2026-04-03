'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import type { Appliance } from '@/lib/types';
import ApplianceTable from '@/components/dashboard/ApplianceTable';
import AddApplianceModal from '@/components/dashboard/AddApplianceModal';
import { Zap, BarChart3, Activity } from 'lucide-react';

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

  const summaryCards = [
    {
      icon: Zap,
      label: 'Total Devices',
      value: `${dashboard?.totalDevices ?? 0}`,
      iconBg: 'bg-primary/10',
    },
    {
      icon: Activity,
      label: 'Active Devices',
      value: `${dashboard?.activeDevices ?? 0}`,
      iconBg: 'bg-[#22c55e]/10',
      valueColor: 'text-[#22c55e]',
    },
    {
      icon: BarChart3,
      label: 'Total Monthly Usage',
      value: dashboard?.totalUnits ? `${dashboard.totalUnits} kWh` : '0 kWh',
      iconBg: 'bg-[#a78bfa]/10',
      valueColor: 'text-gradient',
    },
  ];

  return (
    <>
      <div className="space-y-6">
        <div className="animate-fade-up">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Devices</h1>
          <p className="text-muted-foreground mt-1 text-sm">Manage your connected appliances and track their energy usage</p>
        </div>

        {error && (
          <div className="flex items-center justify-between p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive animate-fade-up">
            <p className="text-sm font-semibold">{error}</p>
            <button onClick={clearError} className="text-destructive/70 hover:text-destructive text-sm font-semibold ml-4 transition-colors">Dismiss</button>
          </div>
        )}

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {summaryCards.map((card, idx) => {
            const CardIcon = card.icon;
            return (
              <div key={card.label} className={`glass-card rounded-2xl p-5 flex items-center gap-4 group animate-fade-up stagger-${idx + 1}`}>
                <div className={`w-11 h-11 rounded-xl ${card.iconBg} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                  <CardIcon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">{card.label}</p>
                  <p className={`text-2xl font-bold ${card.valueColor || 'text-foreground'}`}>{card.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Device-wise breakdown bar chart */}
        {appliances.length > 0 && (
          <div className="glass-card rounded-2xl p-6 animate-fade-up stagger-4">
            <h2 className="text-lg font-bold text-foreground mb-5">Device-wise Monthly Usage</h2>
            <div className="space-y-3">
              {appliances.map((app, idx) => {
                const maxUnits = Math.max(...appliances.map((a) => a.monthlyUnits), 1);
                const pct = (app.monthlyUnits / maxUnits) * 100;
                return (
                  <div
                    key={app._id}
                    className={`flex items-center gap-3 group animate-fade-up stagger-${Math.min(idx + 1, 8)}`}
                  >
                    <div className="w-36 flex-shrink-0 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                        <Zap className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-sm font-semibold text-foreground truncate">{app.name}</span>
                    </div>
                    <div className="flex-1 h-7 bg-muted rounded-lg overflow-hidden">
                      <div
                        className="h-full bg-gradient-primary rounded-lg transition-all duration-700 animate-progress-fill flex items-center justify-end pr-2"
                        style={{ width: `${pct}%` }}
                      >
                        {pct > 25 && (
                          <span className="text-[10px] font-bold text-white">{app.monthlyUnits} kWh</span>
                        )}
                      </div>
                    </div>
                    {pct <= 25 && (
                      <span className="text-sm font-bold text-foreground w-24 text-right">
                        {app.monthlyUnits} kWh
                      </span>
                    )}
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

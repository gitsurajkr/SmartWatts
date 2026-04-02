'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import type { Appliance } from '@/lib/types';
import AnalyticsCards from '@/components/dashboard/AnalyticsCards';
import ChartsSection from '@/components/dashboard/ChartsSection';
import ApplianceTable from '@/components/dashboard/ApplianceTable';
import InsightsPanel from '@/components/dashboard/InsightsPanel';
import AddApplianceModal from '@/components/dashboard/AddApplianceModal';
import AIInsightsCard from '@/components/ai/AIInsightsCard';
import AIAlertsPanel from '@/components/ai/AIAlertsPanel';
import AIMonthlyReport from '@/components/ai/AIMonthlyReport';

export default function DashboardPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAppliance, setEditingAppliance] = useState<Appliance | null>(null);

  const {
    appliances,
    dashboard,
    weeklyTrend,
    isLoading,
    error,
    removeAppliance,
    clearError,
  } = useStore();

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
      // error is set in store
    }
  };

  return (
    <>
      <div className="space-y-6">
        {error && (
          <div className="flex items-center justify-between p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500">
            <p className="text-sm font-medium">{error}</p>
            <button
              onClick={clearError}
              className="text-red-400 hover:text-red-300 text-sm font-medium ml-4"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Proactive AI Alerts */}
        <AIAlertsPanel />

        {isLoading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-border bg-card p-6 animate-pulse">
                  <div className="h-4 w-24 bg-muted rounded mb-4" />
                  <div className="h-8 w-32 bg-muted rounded mb-2" />
                  <div className="h-3 w-20 bg-muted rounded" />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-border bg-card p-6 animate-pulse">
                  <div className="h-5 w-36 bg-muted rounded mb-6" />
                  <div className="h-[300px] bg-muted/50 rounded-xl" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <AnalyticsCards dashboard={dashboard} />
            <ChartsSection dashboard={dashboard} weeklyTrend={weeklyTrend} />

            {/* AI Monthly Report */}
            <AIMonthlyReport />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ApplianceTable
                  appliances={appliances}
                  onAddAppliance={handleOpenAdd}
                  onEditAppliance={handleOpenEdit}
                  onRemoveAppliance={handleDelete}
                />
              </div>
              <div className="space-y-6">
                <AIInsightsCard />
                <InsightsPanel dashboard={dashboard} />
              </div>
            </div>
          </>
        )}
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

import { create } from 'zustand';
import type { Appliance, ApplianceFormData, DashboardData, WeeklyDataPoint } from './types';
import * as api from './api';

interface SmartWattsState {
  appliances: Appliance[];
  dashboard: DashboardData | null;
  weeklyTrend: WeeklyDataPoint[];
  isLoading: boolean;
  error: string | null;

  fetchAppliances: () => Promise<void>;
  fetchDashboard: () => Promise<void>;
  fetchWeeklyTrend: () => Promise<void>;
  fetchAll: () => Promise<void>;

  addAppliance: (data: ApplianceFormData) => Promise<void>;
  updateAppliance: (id: string, data: ApplianceFormData) => Promise<void>;
  removeAppliance: (id: string) => Promise<void>;

  clearError: () => void;
  reset: () => void;
}

const initialState = {
  appliances: [] as Appliance[],
  dashboard: null as DashboardData | null,
  weeklyTrend: [] as WeeklyDataPoint[],
  isLoading: false,
  error: null as string | null,
};

export const useStore = create<SmartWattsState>((set, get) => ({
  ...initialState,

  fetchAppliances: async () => {
    try {
      const appliances = await api.getAppliances();
      set({ appliances });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch appliances';
      set({ error: message });
    }
  },

  fetchDashboard: async () => {
    try {
      const dashboard = await api.getDashboard();
      set({ dashboard });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch dashboard';
      set({ error: message });
    }
  },

  fetchWeeklyTrend: async () => {
    try {
      const weeklyTrend = await api.getWeeklyTrend();
      set({ weeklyTrend });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch trends';
      set({ error: message });
    }
  },

  fetchAll: async () => {
    set({ isLoading: true, error: null });
    try {
      const [appliances, dashboard, weeklyTrend] = await Promise.all([
        api.getAppliances(),
        api.getDashboard(),
        api.getWeeklyTrend(),
      ]);
      set({ appliances, dashboard, weeklyTrend, isLoading: false });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load data';
      set({ error: message, isLoading: false });
    }
  },

  addAppliance: async (data: ApplianceFormData) => {
    try {
      await api.createAppliance(data);
      await get().fetchAll();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to add appliance';
      set({ error: message });
      throw err;
    }
  },

  updateAppliance: async (id: string, data: ApplianceFormData) => {
    try {
      await api.updateAppliance(id, data);
      await get().fetchAll();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update appliance';
      set({ error: message });
      throw err;
    }
  },

  removeAppliance: async (id: string) => {
    try {
      await api.deleteAppliance(id);
      await get().fetchAll();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete appliance';
      set({ error: message });
      throw err;
    }
  },

  clearError: () => set({ error: null }),

  reset: () => set(initialState),
}));

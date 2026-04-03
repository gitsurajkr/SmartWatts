import { create } from 'zustand';
import type { ChatMessage, AIInsight, AIAlert } from './types';
import * as api from './api';

interface AIState {
  // Chat
  messages: ChatMessage[];
  chatLoading: boolean;

  // Insights
  insights: AIInsight[];
  insightsLoading: boolean;
  insightsFetchedAt: number;

  // Monthly report
  monthlyReport: string | null;
  reportLoading: boolean;
  reportFetchedAt: number;

  // Alerts
  alerts: AIAlert[];
  alertsLoading: boolean;
  alertsFetchedAt: number;

  // Budget
  budget: number | null;
  budgetAdvice: string | null;
  budgetLoading: boolean;
  budgetFetchedAt: number;

  // Actions
  sendMessage: (message: string) => Promise<void>;
  fetchInsights: (force?: boolean) => Promise<void>;
  fetchMonthlyReport: (force?: boolean) => Promise<void>;
  fetchAlerts: (force?: boolean) => Promise<void>;
  fetchBudget: () => Promise<void>;
  updateBudget: (amount: number) => Promise<void>;
  fetchBudgetAdvice: (force?: boolean) => Promise<void>;
  reset: () => void;
}

let msgId = 0;
function nextId() {
  return `msg_${Date.now()}_${++msgId}`;
}

// Gemini responses are valid for 5 minutes before re-fetching
const CACHE_TTL = 5 * 60 * 1000;

function isFresh(fetchedAt: number) {
  return fetchedAt > 0 && Date.now() - fetchedAt < CACHE_TTL;
}

const initialState = {
  messages: [] as ChatMessage[],
  chatLoading: false,
  insights: [] as AIInsight[],
  insightsLoading: false,
  insightsFetchedAt: 0,
  monthlyReport: null as string | null,
  reportLoading: false,
  reportFetchedAt: 0,
  alerts: [] as AIAlert[],
  alertsLoading: false,
  alertsFetchedAt: 0,
  budget: null as number | null,
  budgetAdvice: null as string | null,
  budgetLoading: false,
  budgetFetchedAt: 0,
};

export const useAIStore = create<AIState>((set, get) => ({
  ...initialState,

  sendMessage: async (message: string) => {
    const userMsg: ChatMessage = {
      id: nextId(),
      role: 'user',
      content: message,
      timestamp: Date.now(),
    };

    set((s) => ({ messages: [...s.messages, userMsg], chatLoading: true }));

    try {
      const { reply } = await api.aiChat(message);
      const assistantMsg: ChatMessage = {
        id: nextId(),
        role: 'assistant',
        content: reply,
        timestamp: Date.now(),
      };
      set((s) => ({ messages: [...s.messages, assistantMsg], chatLoading: false }));
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Failed to get AI response';
      const errorMsg: ChatMessage = {
        id: nextId(),
        role: 'assistant',
        content: `Sorry, I couldn't process that request. ${errMsg}`,
        timestamp: Date.now(),
      };
      set((s) => ({ messages: [...s.messages, errorMsg], chatLoading: false }));
    }
  },

  fetchInsights: async (force = false) => {
    const state = get();
    if (!force && (state.insightsLoading || isFresh(state.insightsFetchedAt))) return;

    set({ insightsLoading: true });
    try {
      const insights = await api.getAIInsights();
      set({ insights, insightsLoading: false, insightsFetchedAt: Date.now() });
    } catch {
      set({ insightsLoading: false });
    }
  },

  fetchMonthlyReport: async (force = false) => {
    const state = get();
    if (!force && (state.reportLoading || isFresh(state.reportFetchedAt))) return;

    set({ reportLoading: true });
    try {
      const { report } = await api.getMonthlyReport();
      set({ monthlyReport: report, reportLoading: false, reportFetchedAt: Date.now() });
    } catch {
      set({ reportLoading: false });
    }
  },

  fetchAlerts: async (force = false) => {
    const state = get();
    if (!force && (state.alertsLoading || isFresh(state.alertsFetchedAt))) return;

    set({ alertsLoading: true });
    try {
      const alerts = await api.getAIAlerts();
      set({ alerts, alertsLoading: false, alertsFetchedAt: Date.now() });
    } catch {
      set({ alertsLoading: false });
    }
  },

  fetchBudget: async () => {
    try {
      const { budget } = await api.getBudget();
      set({ budget });
    } catch {
      // ignore
    }
  },

  updateBudget: async (amount: number) => {
    set({ budgetLoading: true });
    try {
      const { budget } = await api.setBudget(amount);
      set({ budget, budgetLoading: false });
      get().fetchBudgetAdvice(true);
    } catch {
      set({ budgetLoading: false });
    }
  },

  fetchBudgetAdvice: async (force = false) => {
    const state = get();
    if (!force && (state.budgetLoading || isFresh(state.budgetFetchedAt))) return;

    set({ budgetLoading: true });
    try {
      const { advice } = await api.getBudgetAdvice();
      set({ budgetAdvice: advice, budgetLoading: false, budgetFetchedAt: Date.now() });
    } catch {
      set({ budgetLoading: false });
    }
  },

  reset: () => set(initialState),
}));

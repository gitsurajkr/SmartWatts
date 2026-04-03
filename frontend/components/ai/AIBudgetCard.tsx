'use client';

import React, { useEffect, useState } from 'react';
import { Wallet, Sparkles, RefreshCw } from 'lucide-react';
import { useAIStore } from '@/lib/aiStore';
import { useStore } from '@/lib/store';

export default function AIBudgetCard() {
  const { budget, budgetAdvice, budgetLoading, fetchBudget, updateBudget, fetchBudgetAdvice } = useAIStore();
  const dashboard = useStore((s) => s.dashboard);
  const appliances = useStore((s) => s.appliances);
  const [inputValue, setInputValue] = useState('');
  const [editing, setEditing] = useState(false);
  const hasAppliances = appliances.length > 0;

  useEffect(() => {
    fetchBudget();
  }, [fetchBudget]);

  useEffect(() => {
    if (budget && hasAppliances) {
      fetchBudgetAdvice();
    }
  }, [budget, hasAppliances, fetchBudgetAdvice]);

  const handleSetBudget = async () => {
    const amount = Number(inputValue);
    if (amount > 0) {
      await updateBudget(amount);
      setEditing(false);
      setInputValue('');
    }
  };

  const monthlyBill = dashboard?.totalBill ?? 0;
  const overBudget = budget ? monthlyBill > budget : false;
  const diff = budget ? Math.abs(monthlyBill - budget) : 0;
  const budgetPercent = budget ? Math.min((monthlyBill / budget) * 100, 100) : 0;

  return (
    <div className="glass-card rounded-2xl p-6 animate-fade-up">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-warm flex items-center justify-center">
            <Wallet className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-lg font-bold text-foreground">Budget Optimizer</h2>
        </div>
        {budget && budgetAdvice && (
          <button
            onClick={() => fetchBudgetAdvice(true)}
            disabled={budgetLoading}
            className="p-2 hover:bg-muted rounded-xl transition-all duration-300 disabled:opacity-40 hover:scale-110"
            aria-label="Refresh advice"
          >
            <RefreshCw className={`w-4 h-4 text-muted-foreground ${budgetLoading ? 'animate-spin' : ''}`} />
          </button>
        )}
      </div>

      {!budget || editing ? (
        <div className="space-y-3 animate-fade-up">
          <p className="text-sm text-muted-foreground">
            Set your monthly electricity budget to get AI-powered optimization tips.
          </p>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-semibold">₹</span>
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="e.g. 2000"
                min="1"
                className="w-full pl-7 pr-4 py-2.5 rounded-xl border border-border bg-muted/50 text-foreground text-sm placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-300"
              />
            </div>
            <button
              onClick={handleSetBudget}
              disabled={!inputValue || Number(inputValue) <= 0}
              className="px-4 py-2.5 rounded-xl bg-gradient-primary text-white text-sm font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 disabled:opacity-40"
            >
              Set
            </button>
            {budget && (
              <button
                onClick={() => setEditing(false)}
                className="px-3 py-2.5 rounded-xl border border-border text-sm text-foreground hover:bg-muted transition-all duration-300"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4 animate-fade-up">
          {/* Budget status */}
          <div className="flex items-center justify-between p-3 rounded-xl glass border border-border">
            <div>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Monthly Budget</p>
              <p className="text-lg font-bold text-foreground">₹{budget.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Current Bill</p>
              <p className={`text-lg font-bold ${overBudget ? 'text-destructive' : 'text-[#22c55e]'}`}>
                ₹{monthlyBill.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full animate-progress-fill transition-colors duration-500 ${
                  overBudget ? 'bg-destructive' : 'bg-gradient-primary'
                }`}
                style={{ width: `${budgetPercent}%` }}
              />
            </div>
            <div className={`text-center text-xs font-semibold ${
              overBudget ? 'text-destructive' : 'text-[#22c55e]'
            }`}>
              {overBudget ? `Over budget by ₹${Math.round(diff)}` : `Under budget by ₹${Math.round(diff)}`}
            </div>
          </div>

          {/* AI advice */}
          {budgetLoading && !budgetAdvice ? (
            <div className="space-y-2 animate-pulse">
              <div className="h-3 w-full bg-muted rounded" />
              <div className="h-3 w-4/5 bg-muted rounded" />
            </div>
          ) : budgetAdvice ? (
            <div className="p-3 rounded-xl bg-primary/5 border border-primary/10 animate-fade-up">
              <div className="flex gap-2 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-[10px] font-bold text-primary uppercase tracking-wider">AI Recommendation</p>
              </div>
              <p className="text-sm text-foreground leading-relaxed">{budgetAdvice}</p>
            </div>
          ) : null}

          <button
            onClick={() => { setEditing(true); setInputValue(String(budget)); }}
            className="w-full text-xs text-muted-foreground hover:text-foreground transition-all duration-300 hover:bg-muted py-2 rounded-lg"
          >
            Change budget
          </button>
        </div>
      )}
    </div>
  );
}

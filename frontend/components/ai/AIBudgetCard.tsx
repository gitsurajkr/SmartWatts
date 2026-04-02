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

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Wallet className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Budget Optimizer</h2>
        </div>
        {budget && budgetAdvice && (
          <button
            onClick={() => fetchBudgetAdvice(true)}
            disabled={budgetLoading}
            className="p-2 hover:bg-muted rounded-lg transition-colors disabled:opacity-40"
            aria-label="Refresh advice"
          >
            <RefreshCw className={`w-4 h-4 text-muted-foreground ${budgetLoading ? 'animate-spin' : ''}`} />
          </button>
        )}
      </div>

      {!budget || editing ? (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Set your monthly electricity budget to get AI-powered optimization tips.
          </p>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₹</span>
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="e.g. 2000"
                min="1"
                className="w-full pl-7 pr-4 py-2.5 rounded-lg border border-border bg-muted text-foreground text-sm placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>
            <button
              onClick={handleSetBudget}
              disabled={!inputValue || Number(inputValue) <= 0}
              className="px-4 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-40"
            >
              Set
            </button>
            {budget && (
              <button
                onClick={() => setEditing(false)}
                className="px-3 py-2.5 rounded-lg border border-border text-sm text-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Budget status */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50 border border-border">
            <div>
              <p className="text-xs text-muted-foreground">Monthly Budget</p>
              <p className="text-lg font-bold text-foreground">₹{budget.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Current Bill</p>
              <p className={`text-lg font-bold ${overBudget ? 'text-red-500' : 'text-green-500'}`}>
                ₹{monthlyBill.toLocaleString()}
              </p>
            </div>
          </div>

          <div className={`p-2 rounded-lg text-center text-xs font-medium ${
            overBudget
              ? 'bg-red-500/10 text-red-500 border border-red-500/20'
              : 'bg-green-500/10 text-green-500 border border-green-500/20'
          }`}>
            {overBudget ? `Over budget by ₹${Math.round(diff)}` : `Under budget by ₹${Math.round(diff)}`}
          </div>

          {/* AI advice */}
          {budgetLoading && !budgetAdvice ? (
            <div className="space-y-2 animate-pulse">
              <div className="h-3 w-full bg-muted rounded" />
              <div className="h-3 w-4/5 bg-muted rounded" />
            </div>
          ) : budgetAdvice ? (
            <div className="p-3 rounded-xl bg-primary/5 border border-primary/10">
              <div className="flex gap-2 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-xs font-medium text-primary">AI Recommendation</p>
              </div>
              <p className="text-sm text-foreground leading-relaxed">{budgetAdvice}</p>
            </div>
          ) : null}

          <button
            onClick={() => { setEditing(true); setInputValue(String(budget)); }}
            className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Change budget
          </button>
        </div>
      )}
    </div>
  );
}

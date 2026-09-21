import React, { useState } from 'react';
import { 
  PieChart as PieIcon, Sparkles, 
  HelpCircle, CreditCard, ArrowUpRight
} from 'lucide-react';
import { Transaction, FinancialProfile } from '../types';
import { formatINR } from '../utils/formatters';

interface ExpenseIntelligenceProps {
  transactions: Transaction[];
  profile: FinancialProfile;
  onAskCopilot: (query: string) => void;
}

export const ExpenseIntelligencePage: React.FC<ExpenseIntelligenceProps> = ({
  transactions,
  profile,
  onAskCopilot
}) => {
  const [_selectedAIInsight] = useState<string | null>(null);

  // Group transactions by category
  const categories = [
    { name: 'House Rent', amount: profile.expenses.rent, color: '#6366F1' },
    { name: 'Food & Groceries', amount: profile.expenses.food, color: '#10B981' },
    { name: 'Transport & Commute', amount: profile.expenses.transport, color: '#06B6D4' },
    { name: 'Subscriptions & OTT', amount: profile.expenses.subscriptions, color: '#F59E0B' },
    { name: 'Shopping', amount: profile.expenses.shopping, color: '#EC4899' },
    { name: 'Entertainment & Outings', amount: profile.expenses.entertainment, color: '#8B5CF6' },
  ];

  const totalExpense = categories.reduce((sum, c) => sum + c.amount, 0);

  // Subscriptions filter
  const recurringTxns = transactions.filter(t => t.is_recurring);
  const totalSubscriptionsMonthly = recurringTxns
    .filter(t => t.category === 'subscriptions')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="finora-card rounded-2xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 mb-1">
          <PieIcon className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Expense Intelligence</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Where Is My Money Going?
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
          Contextual analysis of your spending patterns, UPI outflow, and recurring subscriptions with AI explainability.
        </p>
      </div>

      {/* AI Spending Narrative & Spike Alert */}
      <div className="p-5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-700 dark:text-indigo-400 mb-1">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">AI Pattern Detection</span>
          </div>
          <p className="text-sm font-bold text-slate-900 dark:text-white">
            “Food & dining spending is 21% higher than your declared baseline.”
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            4 Swiggy and Zepto deliveries in the past 8 days total ₹2,450, primarily on late weekend nights.
          </p>
        </div>

        <button
          onClick={() => onAskCopilot("Why did my dining expenses spike this month and how can I cut it without sacrificing convenience?")}
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center space-x-2 whitespace-nowrap shadow-sm transition-colors w-fit"
        >
          <HelpCircle className="w-4 h-4" />
          <span>Ask AI Why</span>
        </button>
      </div>

      {/* Category Breakdown & Subscriptions Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Breakdown List */}
        <div className="finora-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm lg:col-span-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
            Monthly Expense Allocation ({formatINR(totalExpense)})
          </h3>

          <div className="space-y-3">
            {categories.map((cat) => {
              const pct = Math.round((cat.amount / (totalExpense || 1)) * 100);
              return (
                <div key={cat.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{cat.name}</span>
                    <span className="font-mono text-slate-900 dark:text-white font-semibold">
                      {formatINR(cat.amount)} <span className="text-slate-500 text-[10px]">({pct}%)</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-200 dark:border-slate-700">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: cat.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recurring Subscriptions Box */}
        <div className="finora-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-4">
              <div className="flex items-center space-x-2 text-slate-900 dark:text-white font-bold text-sm">
                <CreditCard className="w-4 h-4 text-amber-500" />
                <span>Recurring Subscriptions</span>
              </div>
              <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                {formatINR(totalSubscriptionsMonthly)}/mo
              </span>
            </div>

            <div className="space-y-2.5">
              {recurringTxns.map((t) => (
                <div key={t.id} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 block">{t.merchant}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 capitalize">{t.category}</span>
                  </div>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {formatINR(t.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-center">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-center space-x-1">
              <span>Automatic bank auto-debit alerts active</span>
              <ArrowUpRight className="w-3 h-3 text-slate-400" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

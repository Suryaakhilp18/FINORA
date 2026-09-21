import React, { useState } from 'react';
import { Target, Plus, Sparkles, Calendar, X } from 'lucide-react';
import { FinancialGoal, FinancialSnapshot } from '../types';
import { formatINR } from '../utils/formatters';
import { ApiService } from '../services/api';

interface GoalPlannerProps {
  goals: FinancialGoal[];
  snapshot: FinancialSnapshot;
  onGoalAdded: (goal: FinancialGoal) => void;
}

export const GoalPlannerPage: React.FC<GoalPlannerProps> = ({
  goals,
  snapshot,
  onGoalAdded,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('emergency_fund');
  const [newTarget, setNewTarget] = useState<number>(50000);
  const [newCurrent, setNewCurrent] = useState<number>(10000);
  const [newDate, setNewDate] = useState('2026-12-31');

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || newTarget <= 0) return;

    const monthsRemaining = 6;
    const remaining = Math.max(0, newTarget - newCurrent);
    const monthlyNeeded = Math.round(remaining / monthsRemaining);

    try {
      const added = await ApiService.addGoal({
        title: newTitle,
        category: newCategory,
        target_amount: newTarget,
        current_amount: newCurrent,
        target_date: newDate,
        monthly_contribution: monthlyNeeded,
        status: 'In Progress'
      });
      onGoalAdded(added);
      setShowAddModal(false);
      setNewTitle('');
    } catch (err) {
      console.error(err);
      alert('Failed to save goal');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="finora-card rounded-2xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 mb-1">
            <Target className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Goal Intelligence</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Financial Goals & Milestones
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
            Simulate how much to save every month with deterministic calculations. See how purchase decisions delay or accelerate your targets.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center space-x-2 shadow-sm transition-colors whitespace-nowrap w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Goal</span>
        </button>
      </div>

      {/* Monthly Surplus Context Banner */}
      <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Monthly Available Surplus for Goals: <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">{formatINR(snapshot.monthly_surplus)}</span>
            </p>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              Total committed across all goals: ₹11,500/month. You have comfortable headroom of ₹2,500/mo.
            </p>
          </div>
        </div>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {goals.map((goal) => {
          const pct = Math.min(100, Math.round((goal.current_amount / (goal.target_amount || 1)) * 100));
          
          return (
            <div 
              key={goal.id}
              className="finora-card rounded-xl p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm finora-card-hover flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                    {goal.category.replace('_', ' ')}
                  </span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{pct}%</span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 leading-snug">
                  {goal.title}
                </h3>

                <div className="space-y-1 mb-4">
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400">Saved:</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{formatINR(goal.current_amount)}</span>
                  </div>
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400">Target:</span>
                    <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">{formatINR(goal.target_amount)}</span>
                  </div>
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400">Target Date:</span>
                    <span className="text-slate-700 dark:text-slate-300 flex items-center space-x-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>{goal.target_date}</span>
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden mb-3 border border-slate-200 dark:border-slate-700">
                  <div 
                    className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
                <span className="text-slate-500 dark:text-slate-400">Monthly Target:</span>
                <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                  {formatINR(goal.monthly_contribution)}/mo
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Goal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <Target className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Create New Financial Goal</span>
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGoal} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Goal Name / Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. MacBook Air M3"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg p-2 text-sm text-slate-900 dark:text-white outline-none focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Target Amount (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={newTarget}
                    onChange={(e) => setNewTarget(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg p-2 text-sm text-slate-900 dark:text-white font-mono outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Already Saved (₹)
                  </label>
                  <input
                    type="number"
                    value={newCurrent}
                    onChange={(e) => setNewCurrent(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg p-2 text-sm text-slate-900 dark:text-white font-mono outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Target Date
                </label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg p-2 text-sm text-slate-900 dark:text-white outline-none focus:border-indigo-600"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-sm"
                >
                  Save Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

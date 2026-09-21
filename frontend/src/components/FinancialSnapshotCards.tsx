import React from 'react';
import { Wallet, TrendingUp, TrendingDown, Landmark, CalendarClock } from 'lucide-react';
import { FinancialSnapshot } from '../types';
import { formatINR } from '../utils/formatters';

interface SnapshotProps {
  snapshot: FinancialSnapshot;
  onOpenObligations?: () => void;
}

export const FinancialSnapshotCards: React.FC<SnapshotProps> = ({ snapshot, onOpenObligations }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
      {/* Available Money */}
      <div className="finora-card rounded-2xl p-4 finora-card-hover relative overflow-hidden group">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Available Money</span>
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-sm">
            <Wallet className="w-4 h-4" />
          </div>
        </div>
        <div className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white font-mono">
          {formatINR(snapshot.available_money)}
        </div>
        <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-semibold flex items-center">
          Liquid balance in accounts
        </p>
      </div>

      {/* Monthly Income */}
      <div className="finora-card rounded-2xl p-4 finora-card-hover relative overflow-hidden group">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Monthly Income</span>
          <div className="w-8 h-8 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-sm">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white font-mono">
          {formatINR(snapshot.monthly_income)}
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
          Salary + declared gigs
        </p>
      </div>

      {/* Monthly Expenses */}
      <div className="finora-card rounded-2xl p-4 finora-card-hover relative overflow-hidden group">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Living Expenses</span>
          <div className="w-8 h-8 rounded-xl bg-rose-500/10 dark:bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center shadow-sm">
            <TrendingDown className="w-4 h-4" />
          </div>
        </div>
        <div className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white font-mono">
          {formatINR(snapshot.monthly_expenses)}
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
          Rent, food, transport & subs
        </p>
      </div>

      {/* Liquid Savings */}
      <div className="finora-card rounded-2xl p-4 finora-card-hover relative overflow-hidden group">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Liquid Savings</span>
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 dark:bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shadow-sm">
            <Landmark className="w-4 h-4" />
          </div>
        </div>
        <div className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white font-mono">
          {formatINR(snapshot.savings)}
        </div>
        <p className="text-[11px] text-cyan-600 dark:text-cyan-400 mt-1 font-semibold">
          {snapshot.emergency_buffer_months} months runway
        </p>
      </div>

      {/* Upcoming Obligations */}
      <div 
        onClick={onOpenObligations}
        className="finora-card rounded-2xl p-4 finora-card-hover relative overflow-hidden group cursor-pointer border-amber-500/30 col-span-2 sm:col-span-1"
      >
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Upcoming Obligations</span>
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-sm">
            <CalendarClock className="w-4 h-4" />
          </div>
        </div>
        <div className="text-xl sm:text-2xl font-black tracking-tight text-amber-600 dark:text-amber-300 font-mono">
          {formatINR(snapshot.upcoming_obligations)}
        </div>
        <p className="text-[11px] text-amber-700 dark:text-amber-400 mt-1 font-semibold flex items-center justify-between">
          <span>EMIs, bills, rent</span>
          <span className="text-[10px] underline">View</span>
        </p>
      </div>
    </div>
  );
};

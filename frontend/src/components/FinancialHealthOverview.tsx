import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Shield } from 'lucide-react';
import { FinancialSnapshot } from '../types';

interface HealthOverviewProps {
  snapshot: FinancialSnapshot;
  onExploreDimension?: (dimension: string) => void;
}

export const FinancialHealthOverview: React.FC<HealthOverviewProps> = ({ snapshot }) => {
  const { cash_flow, emergency_buffer, goal_progress, debt_load } = snapshot.health_dimensions;

  const renderBadge = (status: 'Healthy' | 'Watch' | 'Needs Attention') => {
    if (status === 'Healthy') {
      return (
        <span className="badge-healthy px-2.5 py-0.5 rounded-full text-[11px] font-bold inline-flex items-center space-x-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
          <span>Healthy</span>
        </span>
      );
    }
    if (status === 'Watch') {
      return (
        <span className="badge-watch px-2.5 py-0.5 rounded-full text-[11px] font-bold inline-flex items-center space-x-1">
          <AlertTriangle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
          <span>Watch</span>
        </span>
      );
    }
    return (
      <span className="badge-attention px-2.5 py-0.5 rounded-full text-[11px] font-bold inline-flex items-center space-x-1">
        <AlertCircle className="w-3 h-3 text-rose-600 dark:text-rose-400" />
        <span>Needs Attention</span>
      </span>
    );
  };

  const dimensions = [
    {
      key: 'cash_flow',
      title: 'Cash Flow Surplus',
      status: cash_flow.status,
      desc: cash_flow.description,
      metric: `+₹${cash_flow.value.toLocaleString('en-IN')}/mo`,
    },
    {
      key: 'emergency_buffer',
      title: 'Emergency Cushion',
      status: emergency_buffer.status,
      desc: emergency_buffer.description,
      metric: `${emergency_buffer.value} Months`,
    },
    {
      key: 'debt_load',
      title: 'Debt Load Ratio',
      status: debt_load.status,
      desc: debt_load.description,
      metric: `${debt_load.value}% of Income`,
    },
    {
      key: 'goal_progress',
      title: 'Goal Momentum',
      status: goal_progress.status,
      desc: goal_progress.description,
      metric: '3 Goals Active',
    },
  ];

  return (
    <div className="finora-card rounded-2xl p-5 border">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-200 dark:border-finora-border/60">
        <div>
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-cyan-600 dark:text-finora-cyan" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Financial Health Dimensions
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Objective multidimensional evaluation. No opaque credit scores.
          </p>
        </div>
        <div className="text-[11px] text-slate-600 dark:text-slate-400 bg-white/80 dark:bg-slate-900/60 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
          Profile: <span className="text-slate-900 dark:text-slate-200 font-semibold">{snapshot.planning_profile.split(':')[1] || snapshot.planning_profile}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {dimensions.map((dim) => (
          <div 
            key={dim.key}
            className="p-3.5 rounded-xl bg-white/50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-finora-border/50 hover:border-slate-400 dark:hover:border-slate-700 transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{dim.title}</span>
                {renderBadge(dim.status)}
              </div>
              <div className="text-lg font-black text-slate-900 dark:text-white mb-1 tracking-tight font-mono">
                {dim.metric}
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                {dim.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

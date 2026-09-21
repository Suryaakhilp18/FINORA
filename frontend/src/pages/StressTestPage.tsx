import React, { useState, useEffect } from 'react';
import { 
  Activity, ArrowRight, CheckCircle2, ShieldAlert
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { FinancialSnapshot } from '../types';
import { formatINR } from '../utils/formatters';
import { ApiService } from '../services/api';

interface StressTestProps {
  snapshot: FinancialSnapshot;
}

export const StressTestPage: React.FC<StressTestProps> = ({ snapshot: _snapshot }) => {
  const [selectedShock, setSelectedShock] = useState<string>('income_drop_20');
  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const shocks = [
    { id: 'income_drop_20', title: 'Income Drops by 20%', desc: 'Loss of freelance income or variable performance bonus' },
    { id: 'unexpected_expense_20k', title: 'Sudden ₹20,000 Expense', desc: 'Urgent medical, vehicle breakdown or deposit shock' },
    { id: 'new_emi_5k', title: 'New ₹5,000 Monthly EMI', desc: 'Committed to a new gadget, vehicle, or personal loan installment' },
    { id: 'rent_increase_3k', title: 'Rent Increases by ₹3,000', desc: 'Landlord lease renewal or relocation to independent flat' },
    { id: 'zero_income', title: '1 Month Without Income', desc: 'Unplanned gap between jobs or extended medical leave' },
  ];

  const fetchSimulation = async (shockType: string) => {
    setLoading(true);
    try {
      const res = await ApiService.runStressTest(shockType, 180);
      setSimulationResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSimulation(selectedShock);
  }, [selectedShock]);

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="finora-card rounded-2xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div className="flex items-center space-x-2 text-rose-600 dark:text-rose-400 mb-1">
          <Activity className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Resilience Engineering</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Financial Stress Testing
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
          Simulate external financial shocks across 30, 90, and 180 days to assess your emergency runway and resilience buffer before a crisis occurs.
        </p>
      </div>

      {/* Scenario Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {shocks.map((s) => {
          const isSelected = selectedShock === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setSelectedShock(s.id)}
              className={`p-4 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-500 ring-1 ring-rose-500/30 shadow-sm'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1">{s.title}</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{s.desc}</p>
            </button>
          );
        })}
      </div>

      {/* Simulation Result Output */}
      {simulationResult && (
        <div className="finora-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {simulationResult.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                {simulationResult.narrative}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Survival Runway:</span>
              <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                {simulationResult.emergency_runway_months} Months
              </span>
            </div>
          </div>

          {/* 180-Day Balance Trajectory Chart */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3">
              180-Day Projected Savings Under Shock
            </h4>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={simulationResult.trajectory || []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="shockSavingsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#E11D48" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#E11D48" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#94A3B8" opacity={0.2} vertical={false} />
                  <XAxis 
                    dataKey="day" 
                    tickFormatter={(val) => `Day ${val}`} 
                    stroke="#94A3B8" 
                    fontSize={11} 
                    tickLine={false}
                  />
                  <YAxis 
                    tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`} 
                    stroke="#94A3B8" 
                    fontSize={11} 
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--finora-card-bg)', 
                      borderColor: 'var(--finora-card-border)', 
                      borderRadius: '0.75rem',
                      color: 'var(--finora-text)',
                      fontSize: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }} 
                    formatter={(val: any) => [formatINR(val), 'Liquid Balance']}
                    labelFormatter={(lbl) => `Day ${lbl}`}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="balance" 
                    stroke="#E11D48" 
                    strokeWidth={2.5} 
                    fillOpacity={1} 
                    fill="url(#shockSavingsGrad)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Shock Milestones & Safeguard Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-2 flex items-center space-x-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                <span>Estimated Impact</span>
              </h5>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {simulationResult.survival_analysis || 'Under this shock, discretionary spending must contract by ₹4,500/month to prevent drawing down more than 40% of liquid assets.'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-2 flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Recommended Safeguard Action</span>
              </h5>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Maintain at least ₹45,000 in a dedicated high-yield liquid emergency fund and pause discretionary gadgets until runway recovers to 4.0+ months.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

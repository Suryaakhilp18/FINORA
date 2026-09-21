import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { TimelinePoint } from '../types';
import { formatINR } from '../utils/formatters';
import { useTheme } from '../context/ThemeContext';

interface TimelineProps {
  timeline: TimelinePoint[];
  productName: string;
}

export const FinancialTimelineChart: React.FC<TimelineProps> = ({ timeline, productName }) => {
  const { theme } = useTheme();
  if (!timeline || timeline.length === 0) return null;

  const chartData = timeline.map((pt) => ({
    label: pt.label,
    event: pt.event,
    withoutPurchase: pt.balance_without_purchase,
    withPurchase: pt.balance_with_purchase,
    delta: pt.balance_without_purchase - pt.balance_with_purchase,
  }));

  const isDark = theme === 'dark';

  const CustomTooltip = ({ active, payload, label: _label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl shadow-lg text-xs text-slate-800 dark:text-slate-200">
          <p className="font-bold text-slate-900 dark:text-slate-200 mb-1 border-b border-slate-200 dark:border-slate-800 pb-1">
            {data.label}: <span className="text-indigo-600 dark:text-indigo-400 font-medium">{data.event}</span>
          </p>
          <div className="space-y-1 mt-1">
            <p className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-between space-x-4">
              <span>Without Purchase:</span>
              <span>{formatINR(data.withoutPurchase)}</span>
            </p>
            <p className="text-indigo-600 dark:text-indigo-400 font-bold flex items-center justify-between space-x-4">
              <span>With {productName}:</span>
              <span>{formatINR(data.withPurchase)}</span>
            </p>
            <p className="text-rose-500 text-[11px] pt-1 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between font-semibold">
              <span>Liquidity Difference:</span>
              <span>-{formatINR(data.delta)}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="finora-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 pb-3 border-b border-slate-200 dark:border-slate-800 gap-2">
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center space-x-2">
            <span>Projected Liquidity Trajectory (6-Month Forecast)</span>
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Comparing future cash curves through Paydays, Rent, EMIs, and Living Expenses.
          </p>
        </div>
        <div className="flex items-center space-x-4 text-xs font-semibold">
          <div className="flex items-center space-x-1.5">
            <div className="w-3 h-3 rounded-sm bg-emerald-500" />
            <span className="text-slate-700 dark:text-slate-300">Baseline (No Purchase)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <div className="w-3 h-3 rounded-sm bg-indigo-500" />
            <span className="text-slate-700 dark:text-slate-300">With {productName}</span>
          </div>
        </div>
      </div>

      <div className="h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorWithout" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.35}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.0}/>
              </linearGradient>
              <linearGradient id="colorWith" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#1E293B" : "#E2E8F0"} vertical={false} />
            <XAxis 
              dataKey="label" 
              stroke={isDark ? "#64748B" : "#94A3B8"} 
              fontSize={11}
              tickLine={false}
            />
            <YAxis 
              tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`} 
              stroke={isDark ? "#64748B" : "#94A3B8"} 
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="withoutPurchase" 
              stroke="#10B981" 
              strokeWidth={2.5}
              fillOpacity={1} 
              fill="url(#colorWithout)" 
            />
            <Area 
              type="monotone" 
              dataKey="withPurchase" 
              stroke="#6366F1" 
              strokeWidth={2.5}
              fillOpacity={1} 
              fill="url(#colorWith)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-2">
        <span>Deterministic projection calculated by Finora Engine v1.0</span>
        <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
          Safeguards 3.0+ Month Living Buffer
        </span>
      </div>
    </div>
  );
};

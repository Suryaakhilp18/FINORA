import React from 'react';
import { Dna, ShieldAlert, Sparkles, HelpCircle } from 'lucide-react';
import { MonteCarloResult } from '../types';
import { formatINR } from '../utils/formatters';

interface MonteCarloFanChartProps {
  data: MonteCarloResult;
  productName: string;
}

export const MonteCarloFanChart: React.FC<MonteCarloFanChartProps> = ({ data, productName }) => {
  if (!data || !data.without_purchase || !data.with_purchase) return null;

  const labels = data.labels || ["M0", "M1", "M2", "M3", "M4", "M5", "M6"];
  const width = 560;
  const height = 210;
  const padding = { top: 25, right: 30, bottom: 35, left: 60 };

  // Calculate global min and max for chart scale
  const allValues = [
    ...data.without_purchase.p10,
    ...data.without_purchase.p90,
    ...data.with_purchase.p10,
    ...data.with_purchase.p90,
    data.safety_threshold || 20000
  ];
  const minVal = Math.min(...allValues, 0);
  const maxVal = Math.max(...allValues, 120000);

  const getX = (idx: number) => {
    return padding.left + (idx / (labels.length - 1)) * (width - padding.left - padding.right);
  };

  const getY = (val: number) => {
    const clamped = Math.max(minVal, Math.min(maxVal, val));
    const normalized = (clamped - minVal) / (maxVal - minVal || 1);
    return height - padding.bottom - normalized * (height - padding.top - padding.bottom);
  };

  // Build SVG path strings for Fan areas & lines
  const buildAreaPath = (p10: number[], p90: number[]) => {
    const topPoints = p90.map((v, i) => `${getX(i)},${getY(v)}`).join(' L ');
    const bottomPoints = [...p10].reverse().map((v, i) => {
      const originalIdx = p10.length - 1 - i;
      return `${getX(originalIdx)},${getY(v)}`;
    }).join(' L ');
    return `M ${topPoints} L ${bottomPoints} Z`;
  };

  const buildLinePath = (vals: number[]) => {
    return vals.map((v, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)},${getY(v)}`).join(' ');
  };

  const withoutArea = buildAreaPath(data.without_purchase.p10, data.without_purchase.p90);
  const withoutMedian = buildLinePath(data.without_purchase.p50);

  const withArea = buildAreaPath(data.with_purchase.p10, data.with_purchase.p90);
  const withMedian = buildLinePath(data.with_purchase.p50);

  const thresholdY = getY(data.safety_threshold || 20000);

  return (
    <div className="finora-card rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 mb-4 border-b border-slate-200 dark:border-slate-800 gap-2">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Dna className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center space-x-2">
              <span>Monte Carlo Future Simulator</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-200 dark:border-indigo-800">
                1,000 Runs
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Stochastic modeling of freelance income swings, random repairs, and inflation.
            </p>
          </div>
        </div>

        {/* Probability Metric Pill */}
        <div className="flex items-center space-x-2">
          <div className="px-3 py-1 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-right">
            <span className="text-[10px] text-slate-500 block uppercase font-bold">Safety Resilience</span>
            <div className="text-xs font-mono font-bold">
              <span className="text-emerald-600 dark:text-emerald-400">{data.prob_cushion_above_20k_without}%</span>
              <span className="text-slate-400 mx-1">→</span>
              <span className="text-rose-600 dark:text-rose-400">{data.prob_cushion_above_20k_with}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Probability Banner */}
      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 mb-4 flex items-center space-x-2.5">
        <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
        <p className="text-xs text-slate-800 dark:text-slate-200 font-semibold leading-relaxed">
          {data.headline}
        </p>
      </div>

      {/* Responsive SVG Chart */}
      <div className="w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto text-xs font-mono select-none"
        >
          {/* Horizontal gridlines */}
          {[0, 20000, 50000, 80000, 110000].map((tick) => {
            const y = getY(tick);
            return (
              <g key={tick}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="currentColor"
                  strokeOpacity={0.08}
                  strokeDasharray="3 3"
                />
                <text
                  x={padding.left - 8}
                  y={y + 3}
                  textAnchor="end"
                  className="fill-slate-400 text-[9px]"
                >
                  ₹{(tick / 1000).toFixed(0)}k
                </text>
              </g>
            );
          })}

          {/* Safety Threshold Line */}
          <line
            x1={padding.left}
            y1={thresholdY}
            x2={width - padding.right}
            y2={thresholdY}
            stroke="#ef4444"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <text
            x={width - padding.right - 4}
            y={thresholdY - 5}
            textAnchor="end"
            fill="#ef4444"
            className="text-[9px] font-bold"
          >
            Safety Threshold (₹20k)
          </text>

          {/* Without Purchase: Fan Area & Median Line */}
          <path d={withoutArea} fill="#10b981" fillOpacity="0.12" />
          <path d={withoutMedian} fill="none" stroke="#10b981" strokeWidth="2.5" />

          {/* With Purchase: Fan Area & Median Line */}
          <path d={withArea} fill="#6366f1" fillOpacity="0.15" />
          <path d={withMedian} fill="none" stroke="#6366f1" strokeWidth="2.5" strokeDasharray="5 3" />

          {/* X Axis Labels */}
          {labels.map((lbl, idx) => (
            <text
              key={idx}
              x={getX(idx)}
              y={height - 10}
              textAnchor="middle"
              className="fill-slate-500 dark:fill-slate-400 text-[10px] font-sans"
            >
              {lbl}
            </text>
          ))}
        </svg>
      </div>

      {/* Chart Legend */}
      <div className="flex flex-wrap items-center justify-between pt-3 mt-2 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-1 bg-emerald-500 rounded" />
            <span className="font-semibold text-slate-900 dark:text-white">Without Purchase (Median P50)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-1 bg-indigo-500 rounded border-dashed" />
            <span className="font-semibold text-slate-900 dark:text-white">With {productName} (P50)</span>
          </div>
        </div>
        <span className="text-[10px] text-slate-400 italic">
          Shaded region spans 10th to 90th percentile
        </span>
      </div>
    </div>
  );
};

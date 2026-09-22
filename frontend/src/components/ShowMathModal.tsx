import React from 'react';
import { X, Calculator, ShieldCheck, Check } from 'lucide-react';

export interface MathFormulaItem {
  title: string;
  metricValue: string;
  formula: string;
  calculationSteps: string[];
  explanation: string;
  sourceStandard: string;
}

interface ShowMathModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: MathFormulaItem | null;
}

export const ShowMathModal: React.FC<ShowMathModalProps> = ({
  isOpen,
  onClose,
  data
}) => {
  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-none animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-200 dark:border-slate-800 mb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Show The Math: {data.title}
              </h3>
              <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
                <ShieldCheck className="w-3 h-3 inline" />
                <span>Deterministic Banking Mathematics</span>
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Highlighted Value Card */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 mb-4 text-center">
          <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold block mb-1">
            Calculated Output
          </span>
          <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
            {data.metricValue}
          </span>
        </div>

        {/* Formula Box */}
        <div className="space-y-3 text-xs mb-4">
          <div className="p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800/60 font-mono">
            <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-400 block mb-1 uppercase font-sans">
              Exact Algebraic Formula:
            </span>
            <p className="text-slate-900 dark:text-slate-100 font-bold text-xs sm:text-sm">
              {data.formula}
            </p>
          </div>

          {/* Step by step arithmetic */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-xs">
            <span className="text-[10px] font-bold text-slate-500 block mb-2 uppercase font-sans">
              Step-by-Step Substitution:
            </span>
            <ul className="space-y-1.5">
              {data.calculationSteps.map((step, idx) => (
                <li key={idx} className="text-slate-700 dark:text-slate-300 flex items-start space-x-2">
                  <span className="text-emerald-500 font-bold">{idx + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
              {data.explanation}
            </p>
            <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700 text-[10px] text-slate-500 dark:text-slate-400 flex items-center space-x-1">
              <Check className="w-3 h-3 text-emerald-500" />
              <span>Standard: {data.sourceStandard}</span>
            </div>
          </div>
        </div>

        {/* Done Button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
        >
          Got it
        </button>
      </div>
    </div>
  );
};

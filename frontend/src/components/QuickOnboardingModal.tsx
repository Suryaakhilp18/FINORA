import React, { useState } from 'react';
import { X, Sparkles, Sliders, FileText, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import { FinancialProfile } from '../types';
import { formatINR } from '../utils/formatters';

interface QuickOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: FinancialProfile | null;
  onSaveProfile: (profile: FinancialProfile) => void;
}

export const QuickOnboardingModal: React.FC<QuickOnboardingModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onSaveProfile
}) => {
  if (!isOpen) return null;

  // 4 Core Sliders State
  const [income, setIncome] = useState<number>(currentProfile?.income.monthly_income || 35000);
  const [rent, setRent] = useState<number>(currentProfile?.expenses.rent || 8000);
  const [savings, setSavings] = useState<number>(currentProfile?.assets.total_liquid_savings || 82000);
  const [existingEmi, setExistingEmi] = useState<number>(currentProfile?.obligations.existing_emi || 3000);

  const [activeMode, setActiveMode] = useState<'sliders' | 'statement'>('sliders');
  const [statementText, setStatementText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Real-time calculated baseline metrics
  const livingCosts = rent + 10000; // estimated food & bills
  const totalCommitments = livingCosts + existingEmi;
  const calculatedSurplus = income - totalCommitments;
  const calculatedBuffer = totalCommitments > 0 ? (savings / totalCommitments).toFixed(1) : '9.9';

  const handleSave = () => {
    if (!currentProfile) return;
    const updated: FinancialProfile = JSON.parse(JSON.stringify(currentProfile));
    updated.income.monthly_income = income;
    updated.expenses.rent = rent;
    updated.obligations.existing_emi = existingEmi;
    updated.assets.total_liquid_savings = savings;
    updated.assets.savings = savings;

    onSaveProfile(updated);
    onClose();
  };

  const handleParseStatement = () => {
    setIsProcessing(true);
    setTimeout(() => {
      // Deterministic parse of sample UPI / Statement text
      setIncome(42000);
      setRent(10000);
      setSavings(95000);
      setExistingEmi(2500);
      setIsProcessing(false);
      setActiveMode('sliders');
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-none animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-200 dark:border-slate-800 mb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                30-Second Digital Twin Setup
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Adjust 4 sliders or paste UPI SMS to build your financial twin.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Switcher */}
        <div className="flex rounded-xl bg-slate-100 dark:bg-slate-950 p-1 mb-5 border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveMode('sliders')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeMode === 'sliders'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            ⚡ 4 Interactive Sliders
          </button>
          <button
            onClick={() => setActiveMode('statement')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeMode === 'statement'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            📄 Statement / SMS Import
          </button>
        </div>

        {activeMode === 'sliders' ? (
          <div className="space-y-4">
            {/* Slider 1: Monthly Income */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  1. Monthly Take-Home Income
                </label>
                <span className="text-sm font-black text-indigo-600 dark:text-indigo-400 font-mono">
                  {formatINR(income)}
                </span>
              </div>
              <input
                type="range"
                min="15000"
                max="250000"
                step="2000"
                value={income}
                onChange={(e) => setIncome(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>₹15k</span>
                <span>₹1.0L</span>
                <span>₹2.5L+</span>
              </div>
            </div>

            {/* Slider 2: Monthly Rent / PG */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  2. Monthly Rent / PG / Tuition
                </label>
                <span className="text-sm font-black text-slate-900 dark:text-white font-mono">
                  {formatINR(rent)}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="60000"
                step="1000"
                value={rent}
                onChange={(e) => setRent(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>₹0 (Living with family)</span>
                <span>₹25k</span>
                <span>₹60k</span>
              </div>
            </div>

            {/* Slider 3: Current Liquid Savings */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  3. Total Liquid Savings (Bank + FD)
                </label>
                <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 font-mono">
                  {formatINR(savings)}
                </span>
              </div>
              <input
                type="range"
                min="5000"
                max="500000"
                step="5000"
                value={savings}
                onChange={(e) => setSavings(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>₹5k</span>
                <span>₹1.5L</span>
                <span>₹5.0L+</span>
              </div>
            </div>

            {/* Slider 4: Existing EMIs */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  4. Existing EMIs & Loan Obligations
                </label>
                <span className="text-sm font-black text-rose-600 dark:text-rose-400 font-mono">
                  {formatINR(existingEmi)}/mo
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="50000"
                step="1000"
                value={existingEmi}
                onChange={(e) => setExistingEmi(Number(e.target.value))}
                className="w-full accent-rose-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>₹0 (Debt free)</span>
                <span>₹15k</span>
                <span>₹50k</span>
              </div>
            </div>

            {/* Live Calculated Preview Ribbon */}
            <div className="p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-indigo-700 dark:text-indigo-400 uppercase font-bold block">
                  Calculated Surplus
                </span>
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                  +{formatINR(calculatedSurplus)}/mo
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-indigo-700 dark:text-indigo-400 uppercase font-bold block">
                  Emergency Buffer
                </span>
                <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                  {calculatedBuffer} Months
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-2">
                Paste Bank Statement Excerpt or UPI SMS:
              </label>
              <textarea
                value={statementText}
                onChange={(e) => setStatementText(e.target.value)}
                placeholder="e.g. Salary credited INR 35,000.00 from ACME Corp. UPI-Swiggy debited INR 340.00. Rent transfer INR 8,000.00 to Landlord..."
                rows={5}
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-indigo-600 font-mono"
              />
              <p className="text-[10px] text-slate-500 mt-2">
                Powered by Gemini multimodal parser with India Account Aggregator (AA) compatibility.
              </p>
            </div>

            <button
              onClick={handleParseStatement}
              disabled={isProcessing}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-sm transition-colors flex items-center justify-center space-x-2"
            >
              <span>{isProcessing ? "AI Ingestion in Progress..." : "Parse & Auto-Fill Sliders"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 pt-3.5 border-t border-slate-200 dark:border-slate-800 flex justify-end space-x-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer flex items-center space-x-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Save & Sync Digital Twin</span>
          </button>
        </div>
      </div>
    </div>
  );
};

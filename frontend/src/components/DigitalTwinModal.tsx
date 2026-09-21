import React, { useState } from 'react';
import { 
  X, Shield, TrendingUp, TrendingDown, 
  CalendarClock, Landmark, Check
} from 'lucide-react';
import { FinancialProfile } from '../types';
import { formatINR } from '../utils/formatters';

interface DigitalTwinModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: FinancialProfile;
  onSaveProfile: (updated: FinancialProfile) => void;
}

export const DigitalTwinModal: React.FC<DigitalTwinModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'income' | 'expenses' | 'obligations' | 'assets'>('income');
  const [formData, setFormData] = useState<FinancialProfile>(JSON.parse(JSON.stringify(profile)));
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    onSaveProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center space-x-2">
                <span>Financial Digital Twin</span>
                <span className="text-[10px] uppercase font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">
                  Synced State
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Your continuously updated financial state powering all simulations and AI reasoning.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-2 pt-4 pb-2 border-b border-slate-200 dark:border-finora-border/60">
          <button
            onClick={() => setActiveTab('income')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors ${
              activeTab === 'income' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Income ({formatINR(formData.income.monthly_income)})</span>
          </button>

          <button
            onClick={() => setActiveTab('expenses')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors ${
              activeTab === 'expenses' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
            }`}
          >
            <TrendingDown className="w-3.5 h-3.5" />
            <span>Expenses</span>
          </button>

          <button
            onClick={() => setActiveTab('obligations')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors ${
              activeTab === 'obligations' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
            }`}
          >
            <CalendarClock className="w-3.5 h-3.5" />
            <span>Obligations & EMIs</span>
          </button>

          <button
            onClick={() => setActiveTab('assets')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors ${
              activeTab === 'assets' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
            }`}
          >
            <Landmark className="w-3.5 h-3.5" />
            <span>Assets & Reserves</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {activeTab === 'income' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Take-Home Monthly Salary (₹)
                </label>
                <input
                  type="number"
                  value={formData.income.monthly_income}
                  onChange={(e) => setFormData({
                    ...formData,
                    income: { ...formData.income, monthly_income: Number(e.target.value) }
                  })}
                  className="w-full bg-white/70 dark:bg-slate-900 border border-slate-300 dark:border-finora-border rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white font-mono shadow-sm outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Variable / Freelance Income (₹)
                </label>
                <input
                  type="number"
                  value={formData.income.variable_income}
                  onChange={(e) => setFormData({
                    ...formData,
                    income: { ...formData.income, variable_income: Number(e.target.value) }
                  })}
                  className="w-full bg-white/70 dark:bg-slate-900 border border-slate-300 dark:border-finora-border rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white font-mono shadow-sm outline-none focus:border-indigo-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Salary Frequency & Payday
                </label>
                <input
                  type="text"
                  value={formData.income.frequency}
                  onChange={(e) => setFormData({
                    ...formData,
                    income: { ...formData.income, frequency: e.target.value }
                  })}
                  className="w-full bg-white/70 dark:bg-slate-900 border border-slate-300 dark:border-finora-border rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white shadow-sm outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          )}

          {activeTab === 'expenses' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-slate-700 dark:text-slate-300 block mb-1 font-semibold">House Rent (₹)</label>
                <input
                  type="number"
                  value={formData.expenses.rent}
                  onChange={(e) => setFormData({
                    ...formData,
                    expenses: { ...formData.expenses, rent: Number(e.target.value) }
                  })}
                  className="w-full bg-white/70 dark:bg-slate-900 border border-slate-300 dark:border-finora-border rounded-xl p-2 text-sm text-slate-900 dark:text-white font-mono shadow-sm outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-700 dark:text-slate-300 block mb-1 font-semibold">Food & Dining (₹)</label>
                <input
                  type="number"
                  value={formData.expenses.food}
                  onChange={(e) => setFormData({
                    ...formData,
                    expenses: { ...formData.expenses, food: Number(e.target.value) }
                  })}
                  className="w-full bg-white/70 dark:bg-slate-900 border border-slate-300 dark:border-finora-border rounded-xl p-2 text-sm text-slate-900 dark:text-white font-mono shadow-sm outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-700 dark:text-slate-300 block mb-1 font-semibold">Transport & Metro (₹)</label>
                <input
                  type="number"
                  value={formData.expenses.transport}
                  onChange={(e) => setFormData({
                    ...formData,
                    expenses: { ...formData.expenses, transport: Number(e.target.value) }
                  })}
                  className="w-full bg-white/70 dark:bg-slate-900 border border-slate-300 dark:border-finora-border rounded-xl p-2 text-sm text-slate-900 dark:text-white font-mono shadow-sm outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-700 dark:text-slate-300 block mb-1 font-semibold">Shopping (₹)</label>
                <input
                  type="number"
                  value={formData.expenses.shopping}
                  onChange={(e) => setFormData({
                    ...formData,
                    expenses: { ...formData.expenses, shopping: Number(e.target.value) }
                  })}
                  className="w-full bg-white/70 dark:bg-slate-900 border border-slate-300 dark:border-finora-border rounded-xl p-2 text-sm text-slate-900 dark:text-white font-mono shadow-sm outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-700 dark:text-slate-300 block mb-1 font-semibold">Subscriptions & OTT (₹)</label>
                <input
                  type="number"
                  value={formData.expenses.subscriptions}
                  onChange={(e) => setFormData({
                    ...formData,
                    expenses: { ...formData.expenses, subscriptions: Number(e.target.value) }
                  })}
                  className="w-full bg-white/70 dark:bg-slate-900 border border-slate-300 dark:border-finora-border rounded-xl p-2 text-sm text-slate-900 dark:text-white font-mono shadow-sm outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-700 dark:text-slate-300 block mb-1 font-semibold">Utilities & Wi-Fi (₹)</label>
                <input
                  type="number"
                  value={formData.expenses.utilities}
                  onChange={(e) => setFormData({
                    ...formData,
                    expenses: { ...formData.expenses, utilities: Number(e.target.value) }
                  })}
                  className="w-full bg-white/70 dark:bg-slate-900 border border-slate-300 dark:border-finora-border rounded-xl p-2 text-sm text-slate-900 dark:text-white font-mono shadow-sm outline-none"
                />
              </div>
            </div>
          )}

          {activeTab === 'obligations' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Existing Smartphone EMI (₹/mo)</label>
                <input
                  type="number"
                  value={formData.obligations.existing_emi}
                  onChange={(e) => setFormData({
                    ...formData,
                    obligations: { ...formData.obligations, existing_emi: Number(e.target.value) }
                  })}
                  className="w-full bg-white/70 dark:bg-slate-900 border border-slate-300 dark:border-finora-border rounded-xl p-2 text-sm text-slate-900 dark:text-white font-mono shadow-sm outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Credit Card Monthly Statement (₹)</label>
                <input
                  type="number"
                  value={formData.obligations.credit_card_payments}
                  onChange={(e) => setFormData({
                    ...formData,
                    obligations: { ...formData.obligations, credit_card_payments: Number(e.target.value) }
                  })}
                  className="w-full bg-white/70 dark:bg-slate-900 border border-slate-300 dark:border-finora-border rounded-xl p-2 text-sm text-slate-900 dark:text-white font-mono shadow-sm outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Upcoming Bills & Utilities (₹)</label>
                <input
                  type="number"
                  value={formData.obligations.upcoming_bills}
                  onChange={(e) => setFormData({
                    ...formData,
                    obligations: { ...formData.obligations, upcoming_bills: Number(e.target.value) }
                  })}
                  className="w-full bg-white/70 dark:bg-slate-900 border border-slate-300 dark:border-finora-border rounded-xl p-2 text-sm text-slate-900 dark:text-white font-mono shadow-sm outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Health / Term Insurance (₹/mo)</label>
                <input
                  type="number"
                  value={formData.obligations.insurance}
                  onChange={(e) => setFormData({
                    ...formData,
                    obligations: { ...formData.obligations, insurance: Number(e.target.value) }
                  })}
                  className="w-full bg-white/70 dark:bg-slate-900 border border-slate-300 dark:border-finora-border rounded-xl p-2 text-sm text-slate-900 dark:text-white font-mono shadow-sm outline-none"
                />
              </div>
            </div>
          )}

          {activeTab === 'assets' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Bank Savings Account (₹)</label>
                <input
                  type="number"
                  value={formData.assets.savings}
                  onChange={(e) => setFormData({
                    ...formData,
                    assets: { 
                      ...formData.assets, 
                      savings: Number(e.target.value),
                      total_liquid_savings: Number(e.target.value) + formData.assets.cash
                    }
                  })}
                  className="w-full bg-white/70 dark:bg-slate-900 border border-slate-300 dark:border-finora-border rounded-xl p-2 text-sm text-slate-900 dark:text-white font-mono shadow-sm outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Liquid Cash in Hand / UPI Wallets (₹)</label>
                <input
                  type="number"
                  value={formData.assets.cash}
                  onChange={(e) => setFormData({
                    ...formData,
                    assets: { 
                      ...formData.assets, 
                      cash: Number(e.target.value),
                      total_liquid_savings: formData.assets.savings + Number(e.target.value)
                    }
                  })}
                  className="w-full bg-white/70 dark:bg-slate-900 border border-slate-300 dark:border-finora-border rounded-xl p-2 text-sm text-slate-900 dark:text-white font-mono shadow-sm outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Mutual Funds / SIP Investments (₹)</label>
                <input
                  type="number"
                  value={formData.assets.investments}
                  onChange={(e) => setFormData({
                    ...formData,
                    assets: { ...formData.assets, investments: Number(e.target.value) }
                  })}
                  className="w-full bg-white/70 dark:bg-slate-900 border border-slate-300 dark:border-finora-border rounded-xl p-2 text-sm text-slate-900 dark:text-white font-mono shadow-sm outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Fixed Deposits (₹)</label>
                <input
                  type="number"
                  value={formData.assets.fixed_deposits}
                  onChange={(e) => setFormData({
                    ...formData,
                    assets: { ...formData.assets, fixed_deposits: Number(e.target.value) }
                  })}
                  className="w-full bg-white/70 dark:bg-slate-900 border border-slate-300 dark:border-finora-border rounded-xl p-2 text-sm text-slate-900 dark:text-white font-mono shadow-sm outline-none"
                />
              </div>
            </div>
          )}

          {/* Planning Profile Badge Note */}
          <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-900/80 border border-slate-200 dark:border-finora-border/60 text-xs">
            <span className="font-bold text-slate-800 dark:text-slate-300 block mb-0.5">
              Personalized Planning Profile:
            </span>
            <p className="text-slate-600 dark:text-slate-400">
              {formData.planning_profile_risk} (Used strictly for deterministic simulation assumptions).
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-finora-border">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Cancel
          </button>
          
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center space-x-2 shadow-md transition-all cursor-pointer"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Updated Twin</span>
              </>
            ) : (
              <span>Save & Sync Digital Twin</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

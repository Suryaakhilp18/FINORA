import React, { useState } from 'react';
import { X, Sparkles, UserCheck, TrendingUp, Copy, Check, MessageSquare } from 'lucide-react';
import { ApiService } from '../services/api';
import { FutureSelfResponse, NegotiationScriptResponse } from '../types';
import { formatINR } from '../utils/formatters';

interface FutureSelfModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  price: number;
}

export const FutureSelfModal: React.FC<FutureSelfModalProps> = ({
  isOpen,
  onClose,
  productName,
  price
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'future_self' | 'negotiation'>('future_self');
  const [targetAge, setTargetAge] = useState<number>(30);
  const [loading, setLoading] = useState<boolean>(false);
  const [futureData, setFutureData] = useState<FutureSelfResponse | null>(null);

  // Negotiation script state
  const [negTopic, setNegTopic] = useState<'rent_reduction' | 'card_fee_waiver' | 'subscription'>('rent_reduction');
  const [negScript, setNegScript] = useState<NegotiationScriptResponse | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const fetchFutureSelf = async () => {
    setLoading(true);
    try {
      const res = await ApiService.getFutureSelfDialogue(productName, price, targetAge);
      setFutureData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchNegotiationScript = async (topic: 'rent_reduction' | 'card_fee_waiver' | 'subscription') => {
    setNegTopic(topic);
    try {
      const res = await ApiService.getNegotiationScript(topic, {
        current_rent: 12000,
        target_rent: 10500,
        bank: "HDFC Bank",
        spend: "₹1,85,000"
      });
      setNegScript(res);
    } catch (e) {
      console.error(e);
    }
  };

  React.useEffect(() => {
    fetchFutureSelf();
    fetchNegotiationScript('rent_reduction');
  }, [productName, price, targetAge]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-none animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-200 dark:border-slate-800 mb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Future Self & Tactical Negotiation Agent
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Forward compound wealth projection & copy-paste negotiation scripts.
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

        {/* Tab Switcher */}
        <div className="flex rounded-xl bg-slate-100 dark:bg-slate-950 p-1 mb-4 border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('future_self')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'future_self'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            🔮 Talk to You at Age {targetAge}
          </button>
          <button
            onClick={() => setActiveTab('negotiation')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'negotiation'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            💬 Negotiation Scripts
          </button>
        </div>

        {activeTab === 'future_self' ? (
          <div className="space-y-4">
            {/* Age Selector */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Target Projection Age:</span>
              <div className="flex items-center space-x-2">
                {[25, 28, 30, 35].map((a) => (
                  <button
                    key={a}
                    onClick={() => setTargetAge(a)}
                    className={`px-2.5 py-1 rounded-lg font-mono font-bold text-xs transition-colors ${
                      targetAge === a
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Age {a}
                  </button>
                ))}
              </div>
            </div>

            {/* Compound Opportunity Cost Banner */}
            {futureData && (
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">
                    Wealth at Age {targetAge} (Normal)
                  </span>
                  <span className="text-base font-black text-emerald-600 dark:text-emerald-400 font-mono">
                    {formatINR(futureData.projected_portfolio_normal)}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">
                    Opportunity Cost of {productName}
                  </span>
                  <span className="text-base font-black text-rose-600 dark:text-rose-400 font-mono">
                    {formatINR(futureData.opportunity_cost_at_future_age)}
                  </span>
                </div>
              </div>
            )}

            {/* Future Self Dialogue Card */}
            <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800/60 relative">
              <div className="flex items-center space-x-2 mb-2 text-indigo-700 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Message from You in {2026 + (targetAge - 21)}:</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                {futureData?.dialogue || "Generating forward-projected guidance grounded in 11% CAGR equity returns..."}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Negotiation Topic Pills */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => fetchNegotiationScript('rent_reduction')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  negTopic === 'rent_reduction'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                🏠 Rent Reduction / Lease
              </button>
              <button
                onClick={() => fetchNegotiationScript('card_fee_waiver')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  negTopic === 'card_fee_waiver'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                💳 Credit Card Fee Waiver
              </button>
              <button
                onClick={() => fetchNegotiationScript('subscription')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  negTopic === 'subscription'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                🔄 Subscription Discount
              </button>
            </div>

            {/* Script Display Card */}
            {negScript && (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 relative">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {negScript.title}
                  </span>
                  <button
                    onClick={() => handleCopy(negScript.script)}
                    className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "Copied!" : "Copy Script"}</span>
                  </button>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-mono whitespace-pre-line">
                  {negScript.script}
                </p>
                <p className="text-[10px] text-slate-500 mt-2.5 italic">
                  💡 {negScript.advice}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

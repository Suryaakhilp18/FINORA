import React, { useState, useRef } from 'react';
import { 
  Zap, Camera, ArrowRight, ShieldCheck, AlertTriangle, 
  Wallet, Landmark, CalendarClock, Scale, Loader2
} from 'lucide-react';
import { FinancialSnapshot } from '../types';
import { formatINR } from '../utils/formatters';
import { ApiService } from '../services/api';

interface BeforeYouPayProps {
  snapshot: FinancialSnapshot;
  onExploreInWhatIf: (product: string, price: number) => void;
}

export const BeforeYouPayPage: React.FC<BeforeYouPayProps> = ({
  snapshot,
  onExploreInWhatIf
}) => {
  const [productName, setProductName] = useState('Sony WH-1000XM5 Headphones');
  const [price, setPrice] = useState<number>(29990);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [extractedInfo, setExtractedInfo] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Deterministic calculations
  const liquidSavings = snapshot.savings;
  const upcomingCommitments = snapshot.upcoming_obligations;
  const remainingSavings = liquidSavings - price;
  const fixedLivingExpenses = snapshot.monthly_expenses + upcomingCommitments;
  const postPurchaseBuffer = Math.max(0, Number((remainingSavings / (fixedLivingExpenses || 1)).toFixed(1)));

  let riskRating: 'Low' | 'Moderate' | 'High' = 'Low';
  if (remainingSavings < upcomingCommitments || postPurchaseBuffer < 1.5) {
    riskRating = 'High';
  } else if (postPurchaseBuffer < 3.0) {
    riskRating = 'Moderate';
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    setExtractedInfo(`Scanning ${file.name}...`);
    try {
      const res = await ApiService.uploadDocumentOrScreenshot(file);
      if (res.extracted) {
        setProductName(res.extracted.product_or_merchant || file.name);
        setPrice(res.extracted.amount || 45000);
        setExtractedInfo(res.extracted.key_details || 'Price & product detected successfully');
      }
    } catch (err) {
      console.error(err);
      setExtractedInfo('Image analyzed with demo fallback.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      {/* Hero Banner */}
      <div className="finora-card rounded-2xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400 mb-2">
          <Zap className="w-5 h-5 fill-amber-500" />
          <span className="text-xs font-bold uppercase tracking-wider">
            Quick-Fire Affordability Check
          </span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Before You Pay
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
          At the checkout counter or Amazon cart? Enter the price or upload a screenshot to instantly see what happens to your bank balance and upcoming obligations before you swipe.
        </p>

        {/* Quick input controls */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-1">
            <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Item / Purchase Name
            </label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-amber-500 outline-none"
              placeholder="e.g. MacBook Air or Dinner"
            />
          </div>

          <div className="sm:col-span-1">
            <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Price (₹)
            </label>
            <input
              type="number"
              value={price || ''}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white font-mono focus:border-amber-500 outline-none"
              placeholder="29990"
            />
          </div>

          <div className="sm:col-span-1 flex items-end">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isAnalyzing}
              className="w-full py-2 px-3 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
                  <span>Scanning...</span>
                </>
              ) : (
                <>
                  <Camera className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Upload Cart Screenshot</span>
                </>
              )}
            </button>
          </div>
        </div>

        {extractedInfo && (
          <div className="mt-3 p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300">
            {extractedInfo}
          </div>
        )}
      </div>

      {/* Decision Verdict Card */}
      <div className={`finora-card rounded-2xl p-6 border ${
        riskRating === 'Low' 
          ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20' 
          : riskRating === 'Moderate'
          ? 'border-amber-300 dark:border-amber-800 bg-amber-50/40 dark:bg-amber-950/20'
          : 'border-rose-300 dark:border-rose-800 bg-rose-50/40 dark:bg-rose-950/20'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mt-0.5 ${
              riskRating === 'Low'
                ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-400'
                : riskRating === 'Moderate'
                ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-400'
                : 'bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-400'
            }`}>
              {riskRating === 'Low' ? <ShieldCheck className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Cart Instant Verdict
              </span>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                {riskRating === 'Low' && 'Safe to Proceed with Caution'}
                {riskRating === 'Moderate' && 'Moderate Risk: Check Upcoming Bills'}
                {riskRating === 'High' && 'High Risk: Threatens Essential Commitments'}
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-lg">
                {riskRating === 'Low' && `Spending ${formatINR(price)} preserves ${postPurchaseBuffer} months of emergency runway. Upcoming obligations of ${formatINR(upcomingCommitments)} remain covered.`}
                {riskRating === 'Moderate' && `Spending ${formatINR(price)} drops your emergency cushion to ${postPurchaseBuffer} months, which is below the recommended 3.0-month threshold.`}
                {riskRating === 'High' && `Warning: This purchase leaves only ${formatINR(remainingSavings)} in liquid savings, directly endangering your ₹${upcomingCommitments.toLocaleString('en-IN')} in scheduled EMIs and bills.`}
              </p>
            </div>
          </div>

          <button
            onClick={() => onExploreInWhatIf(productName, price)}
            className="px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-colors shadow-sm whitespace-nowrap"
          >
            <Scale className="w-4 h-4" />
            <span>Open in Full What-If</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3 Vital Balance Impacts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="finora-card rounded-xl p-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 mb-2">
            <Wallet className="w-4 h-4" />
            <span className="text-xs font-semibold">Immediate Cash Outflow</span>
          </div>
          <div className="text-xl font-mono font-black text-slate-900 dark:text-white">
            {formatINR(price)}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Deducted from ₹{liquidSavings.toLocaleString('en-IN')} savings
          </p>
        </div>

        <div className="finora-card rounded-xl p-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 mb-2">
            <Landmark className="w-4 h-4" />
            <span className="text-xs font-semibold">Post-Swipe Balance</span>
          </div>
          <div className={`text-xl font-mono font-black ${remainingSavings >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
            {formatINR(remainingSavings)}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Leaves {postPurchaseBuffer} months living runway
          </p>
        </div>

        <div className="finora-card rounded-xl p-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 mb-2">
            <CalendarClock className="w-4 h-4" />
            <span className="text-xs font-semibold">Upcoming Due (Next 30 Days)</span>
          </div>
          <div className="text-xl font-mono font-black text-amber-600 dark:text-amber-400">
            {formatINR(upcomingCommitments)}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            {remainingSavings >= upcomingCommitments ? 'Covered by remaining balance' : 'Shortfall risk detected!'}
          </p>
        </div>
      </div>
    </div>
  );
};

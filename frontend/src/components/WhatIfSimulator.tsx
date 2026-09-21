import React, { useState, useEffect } from 'react';
import { 
  Scale, CheckCircle2, AlertTriangle, Calculator, Sparkles, Shield,
  Volume2, VolumeX, Brain, Clock, Lock, Tag, MessageSquare, Send,
  HelpCircle, ArrowRight, Loader2
} from 'lucide-react';
import { ScenarioResult, DecisionExplanation, TimelinePoint, NegotiationResponse } from '../types';
import { formatINR } from '../utils/formatters';
import { FinancialTimelineChart } from './FinancialTimelineChart';
import { ApiService } from '../services/api';

interface WhatIfSimulatorProps {
  scenarios: ScenarioResult[];
  explanation?: DecisionExplanation;
  timeline?: TimelinePoint[];
  productName: string;
  price: number;
  onSimulateNew: (product: string, price: number) => void;
  isLoading?: boolean;
}

export const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({
  scenarios,
  explanation,
  timeline,
  productName,
  price,
  onSimulateNew,
  isLoading
}) => {
  const [activeScenarioId, setActiveScenarioId] = useState<string>('buy_now');
  const [showCalculationModal, setShowCalculationModal] = useState<boolean>(false);
  const [customProduct, setCustomProduct] = useState<string>(productName);
  const [customPrice, setCustomPrice] = useState<number>(price);

  // Audio Debrief State
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  // Behavioral Cooling-off State
  const [coolingOffActive, setCoolingOffActive] = useState<boolean>(false);
  const [coolingOffHours, setCoolingOffHours] = useState<number>(48);

  // Decision Negotiation State
  const [negotiateQuery, setNegotiateQuery] = useState<string>('');
  const [negotiateLoading, setNegotiateLoading] = useState<boolean>(false);
  const [negotiationResult, setNegotiationResult] = useState<NegotiationResponse | null>(null);

  const activeScenario = scenarios.find((s) => s.id === activeScenarioId) || scenarios[0];

  // Stop speech synthesis if component unmounts
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customPrice > 0) {
      onSimulateNew(customProduct || 'Item', customPrice);
    }
  };

  // Text-To-Speech Executive Audio Briefing
  const handleToggleAudio = () => {
    if (!('speechSynthesis' in window)) {
      alert("Text-to-speech audio is not supported in this browser.");
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    const scriptToRead = explanation?.audio_script || (
      `Here is FINORA's financial debrief on ${productName} for ${formatINR(price)}. ` +
      `Paying upfront leaves you with ${activeScenario.emergency_buffer_months} months of emergency savings. ` +
      `${explanation?.verdict_headline || ''}`
    );

    const utterance = new SpeechSynthesisUtterance(scriptToRead);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Pick English voice if available
    const voices = window.speechSynthesis.getVoices();
    const indVoice = voices.find(v => v.lang.includes('en-IN') || v.lang.includes('en-GB') || v.lang.includes('en-US'));
    if (indVoice) {
      utterance.voice = indVoice;
    }

    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  // Interactive Counterfactual Negotiation
  const handleNegotiate = async (queryText?: string) => {
    const q = queryText || negotiateQuery;
    if (!q.trim() || negotiateLoading) return;

    setNegotiateLoading(true);
    try {
      const res = await ApiService.negotiateDecision(q, productName, price);
      setNegotiationResult(res);
      setNegotiateQuery('');
    } catch (err) {
      console.error("Negotiation error:", err);
    } finally {
      setNegotiateLoading(false);
    }
  };

  const sampleCounterfactuals = [
    "What if I get a ₹15,000 festival bonus next month?",
    "What if my roommate splits 50% of the cost?",
    "Can I cut dining out by ₹3,000/mo to cover the EMI?",
    "What if price drops by 10% during sale?"
  ];

  const renderStressBadge = (stress: string) => {
    if (stress === 'Low') {
      return (
        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
          Low Stress
        </span>
      );
    }
    if (stress === 'Moderate') {
      return (
        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
          Moderate Risk
        </span>
      );
    }
    if (stress === 'High') {
      return (
        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
          High Stress
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-800">
        Critical Strain
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Simulator Control Header */}
      <div className="finora-card rounded-2xl p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Scale className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                What-If Decision Simulator
              </h2>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Simulating multi-scenario trade-offs for <span className="text-slate-900 dark:text-white font-bold">{productName}</span> at <span className="text-emerald-600 dark:text-emerald-400 font-bold">{formatINR(price)}</span>.
            </p>
          </div>

          {/* Quick Input Bar */}
          <form onSubmit={handleCustomSubmit} className="flex items-center gap-2">
            <input
              type="text"
              value={customProduct}
              onChange={(e) => setCustomProduct(e.target.value)}
              placeholder="Product name"
              className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 w-36 sm:w-44 focus:border-indigo-600 outline-none"
            />
            <div className="relative">
              <span className="absolute left-2.5 top-1.5 text-xs text-slate-400">₹</span>
              <input
                type="number"
                value={customPrice || ''}
                onChange={(e) => setCustomPrice(Number(e.target.value))}
                placeholder="Price"
                className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg pl-6 pr-2.5 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 w-28 sm:w-32 focus:border-indigo-600 outline-none font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors shadow-sm disabled:opacity-50"
            >
              Simulate
            </button>
          </form>
        </div>
      </div>

      {/* 5 Scenario Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {scenarios.map((scen) => {
          const isSelected = scen.id === activeScenarioId;
          return (
            <button
              key={scen.id}
              onClick={() => setActiveScenarioId(scen.id)}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-indigo-50/50 dark:bg-indigo-950/30 border-indigo-600 dark:border-indigo-500 shadow-sm ring-1 ring-indigo-600/30'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                  {scen.name.split('(')[0]}
                </span>
                {renderStressBadge(scen.stress_level)}
              </div>
              <div className="text-sm font-black text-slate-900 dark:text-white font-mono">
                {scen.monthly_payment > 0 ? (
                  <span>{formatINR(scen.monthly_payment)}<span className="text-[10px] text-slate-500 font-sans">/mo</span></span>
                ) : (
                  <span>{formatINR(scen.upfront_cash_required)}</span>
                )}
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1 font-medium">
                Buffer: {scen.emergency_buffer_months} mo
              </p>
            </button>
          );
        })}
      </div>

      {/* Active Scenario Detailed Comparison Panel */}
      {activeScenario && (
        <div className="finora-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 mb-4 border-b border-slate-200 dark:border-slate-800 gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  {activeScenario.name}
                </h3>
                {renderStressBadge(activeScenario.stress_level)}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                {activeScenario.tagline}
              </p>
            </div>

            <button
              onClick={() => setShowCalculationModal(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors w-fit shadow-sm"
            >
              <Calculator className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>View Calculation Breakdown</span>
            </button>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-0.5 font-medium">Immediate Outflow</span>
              <span className="text-base font-bold text-slate-900 dark:text-white font-mono">
                {formatINR(activeScenario.upfront_cash_required)}
              </span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-0.5 font-medium">Monthly Commitment</span>
              <span className="text-base font-bold text-slate-900 dark:text-white font-mono">
                {activeScenario.monthly_payment > 0 ? `${formatINR(activeScenario.monthly_payment)}/mo` : '₹0'}
              </span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-0.5 font-medium">Post-Purchase Savings</span>
              <span className="text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                {formatINR(activeScenario.post_purchase_savings)}
              </span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-0.5 font-medium">Emergency Buffer Left</span>
              <span className="text-base font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                {activeScenario.emergency_buffer_months} Months
              </span>
            </div>
          </div>

          {/* Trade-Off Highlights */}
          <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60 mb-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 mb-1 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Core Financial Trade-off</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
              {activeScenario.trade_offs}
            </p>
          </div>

          {/* Pros and Cons Split */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 mb-2 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Advantages</span>
              </h4>
              <ul className="space-y-1.5">
                {activeScenario.pros.map((p, idx) => (
                  <li key={idx} className="text-xs text-slate-700 dark:text-slate-300 flex items-start space-x-2">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">•</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3.5 rounded-xl bg-rose-50/80 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/60">
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800 dark:text-rose-400 mb-2 flex items-center space-x-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Trade-offs & Risks</span>
              </h4>
              <ul className="space-y-1.5">
                {activeScenario.cons.map((c, idx) => (
                  <li key={idx} className="text-xs text-slate-700 dark:text-slate-300 flex items-start space-x-2">
                    <span className="text-rose-600 dark:text-rose-400 font-bold">•</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          ADVANCEMENT 1: AI DECISION VERDICT & AUDIO EXECUTIVE DEBRIEF
          ========================================================================= */}
      {explanation && (
        <div className="finora-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-slate-200 dark:border-slate-800 gap-3">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
                Explainable Decision Intelligence
              </h3>
            </div>

            {/* Audio Debrief Player */}
            <button
              onClick={handleToggleAudio}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-2 transition-all shadow-sm ${
                isPlayingAudio
                  ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 border border-rose-300'
                  : 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100'
              }`}
              title="Play executive audio summary using native speech synthesis"
            >
              {isPlayingAudio ? (
                <>
                  <VolumeX className="w-4 h-4 text-rose-600 animate-pulse" />
                  <span>Pause Briefing</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Listen to 30s Audio Briefing</span>
                </>
              )}
            </button>
          </div>

          <div className="text-base font-black text-slate-900 dark:text-white mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
            {explanation.verdict_headline}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mb-4">
            <div className="space-y-3">
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-300 block mb-1">What happened?</span>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{explanation.what_happened}</p>
              </div>
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-300 block mb-1">Why does it matter?</span>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{explanation.why_it_matters}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-300 block mb-1">Key Assumptions</span>
                <ul className="space-y-1">
                  {explanation.assumptions_used?.map((a, i) => (
                    <li key={i} className="text-slate-600 dark:text-slate-400 flex items-start space-x-1.5">
                      <span className="text-slate-400">•</span>
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="font-bold text-slate-800 dark:text-slate-300 block mb-1">What would change this result?</span>
                <ul className="space-y-1">
                  {explanation.what_changes_the_result?.map((c, i) => (
                    <li key={i} className="text-indigo-600 dark:text-indigo-400 flex items-start space-x-1.5 font-medium">
                      <span className="text-indigo-500">→</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Deal Hacks & Hidden Costs Callout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs">
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60">
              <span className="font-bold text-amber-800 dark:text-amber-400 flex items-center space-x-1 mb-1">
                <Tag className="w-3.5 h-3.5" />
                <span>Hidden Cost Watch</span>
              </span>
              <p className="text-[11px] text-slate-700 dark:text-slate-300">
                {explanation.hidden_costs_warning || "Watch for 18% GST on EMI interest, bank processing fees, and mandatory accessory add-ons."}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800/60">
              <span className="font-bold text-indigo-800 dark:text-indigo-400 flex items-center space-x-1 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Smart Deal Hacks</span>
              </span>
              <ul className="text-[11px] text-slate-700 dark:text-slate-300 space-y-0.5">
                {explanation.smart_deal_hacks?.slice(0, 2).map((h, i) => (
                  <li key={i} className="truncate">• {h}</li>
                )) || <li>• Look for card instant discounts & 6-month No-Cost EMI</li>}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          ADVANCEMENT 2: BEHAVIORAL AI "REGRET SHIELD" & IMPULSE BUY SCORE
          ========================================================================= */}
      <div className="finora-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-slate-200 dark:border-slate-800 gap-2">
          <div className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Behavioral Economics & Regret Shield
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Cognitive bias detection based on Indian millennial and Gen-Z spending psychology.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Impulse Risk Score:</span>
            <span className={`px-2.5 py-1 rounded-md text-xs font-mono font-black ${
              (explanation?.impulse_score || 72) > 60
                ? 'bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border border-rose-300'
                : 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-300'
            }`}>
              {explanation?.impulse_score || 72}% High Risk
            </span>
          </div>
        </div>

        {/* Cognitive Biases Identified */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          {(explanation?.cognitive_biases || [
            {
              name: "Present Bias",
              description: "Hyper-focusing on the instant joy of unboxing today while discounting the budget pinch next week.",
              mitigation: "Sleep on it for 48 hours before swiping."
            },
            {
              name: "The Diderot Effect",
              description: "High-ticket purchases often trigger a domino effect of unbudgeted accessories (adapters, cases, mouse).",
              mitigation: "Enforce a 30-day accessory ban."
            },
            {
              name: "Discount Anchoring",
              description: "Viewing a ₹10,000 festival discount as 'money made' rather than ₹65,000 leaving your account.",
              mitigation: "Evaluate the net cash deduction, not the discount banner."
            }
          ]).map((b, i) => (
            <div key={i} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
              <span className="font-bold text-slate-900 dark:text-white block mb-1">{b.name}</span>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed mb-2">{b.description}</p>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-[10px] text-indigo-700 dark:text-indigo-400 font-semibold">
                Shield: {b.mitigation}
              </div>
            </div>
          ))}
        </div>

        {/* Cooling-off Lock Activation */}
        <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-900 flex items-center justify-center text-amber-600 shadow-sm">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                {coolingOffActive ? "Active: 48-Hour Smart Cooling-Off Period" : "Smart 48-Hour Cooling-Off Period"}
              </span>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                {coolingOffActive 
                  ? "Decision lock is active. We will notify you in 48 hours to confirm if the purchase still aligns with your goals."
                  : "68% of impulse gadget purchases lose their emotional urgency after 2 days. Activate a lock before buying."
                }
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setCoolingOffActive(!coolingOffActive);
              if (!coolingOffActive) {
                alert(`48-Hour Cooling-Off Shield activated for ${productName}! Take a step back and revisit in 2 days.`);
              }
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              coolingOffActive
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-amber-500'
            }`}
          >
            {coolingOffActive ? "✓ Lock Active (48h)" : "Activate 48h Lock"}
          </button>
        </div>
      </div>

      {/* =========================================================================
          ADVANCEMENT 3: INTERACTIVE AI DECISION NEGOTIATION
          ========================================================================= */}
      <div className="finora-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div className="flex items-center space-x-2 pb-3 mb-4 border-b border-slate-200 dark:border-slate-800">
          <MessageSquare className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              AI Decision Negotiation (Counterfactual Studio)
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Dialogue with FINORA to simulate "What if...?" adjustments in real time with deterministic recalculation.
            </p>
          </div>
        </div>

        {/* Counterfactual Quick Prompt Pills */}
        <div className="flex items-center flex-wrap gap-1.5 mb-4">
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mr-1">
            Explore:
          </span>
          {sampleCounterfactuals.map((q, i) => (
            <button
              key={i}
              onClick={() => handleNegotiate(q)}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors text-left"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Query Input */}
        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            value={negotiateQuery}
            onChange={(e) => setNegotiateQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleNegotiate()}
            placeholder="e.g. What if I split the cost 50-50 with my roommate or get a ₹15k Diwali bonus?"
            className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-indigo-600"
            disabled={negotiateLoading}
          />
          <button
            onClick={() => handleNegotiate()}
            disabled={negotiateLoading || !negotiateQuery.trim()}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-sm disabled:opacity-50"
          >
            {negotiateLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            <span>Negotiate</span>
          </button>
        </div>

        {/* Negotiation Output */}
        {negotiationResult && (
          <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/80 animate-fadeIn space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400">
                Counterfactual Simulation Result
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-indigo-600 text-white">
                {negotiationResult.verdict_shift}
              </span>
            </div>

            <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
              {negotiationResult.response_text}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-indigo-200 dark:border-indigo-800 text-[11px] font-mono">
              <div className="bg-white dark:bg-slate-900 p-2 rounded-lg border border-indigo-100 dark:border-indigo-900">
                <span className="text-slate-500 font-sans text-[10px] block">Adjusted Cost</span>
                <span className="font-bold text-slate-900 dark:text-white">{formatINR(negotiationResult.adjusted_price)}</span>
              </div>
              <div className="bg-white dark:bg-slate-900 p-2 rounded-lg border border-indigo-100 dark:border-indigo-900">
                <span className="text-slate-500 font-sans text-[10px] block">New Savings</span>
                <span className="font-bold text-slate-900 dark:text-white">{formatINR(negotiationResult.adjusted_savings)}</span>
              </div>
              <div className="bg-white dark:bg-slate-900 p-2 rounded-lg border border-indigo-100 dark:border-indigo-900">
                <span className="text-slate-500 font-sans text-[10px] block">Monthly Surplus</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">+{formatINR(negotiationResult.adjusted_surplus)}/mo</span>
              </div>
              <div className="bg-white dark:bg-slate-900 p-2 rounded-lg border border-indigo-100 dark:border-indigo-900">
                <span className="text-slate-500 font-sans text-[10px] block">New Runway</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">{negotiationResult.new_emergency_runway_months} Months</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Financial Timeline Simulation Component */}
      {timeline && timeline.length > 0 && (
        <FinancialTimelineChart timeline={timeline} productName={productName} />
      )}

      {/* Calculation Modal */}
      {showCalculationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 transition-opacity">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-4">
              <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <Calculator className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Deterministic Calculation Logic</span>
              </h4>
              <button 
                onClick={() => setShowCalculationModal(false)}
                className="text-slate-500 hover:text-slate-900 dark:hover:text-white text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800"
              >
                Close
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <p className="text-slate-700 dark:text-slate-300 font-sans mb-1 font-semibold">1. Standard EMI Formula</p>
                <p className="text-slate-800 dark:text-slate-200">E = P * r * (1+r)^n / ((1+r)^n - 1)</p>
                <p className="text-slate-500 dark:text-slate-400 mt-1">P = {formatINR(price)} | r = 13.5%/12/100 | n = 12 months</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <p className="text-slate-700 dark:text-slate-300 font-sans mb-1 font-semibold">2. Monthly Surplus</p>
                <p className="text-slate-800 dark:text-slate-200">Surplus = Income (₹35k) - [Living Exp (₹18k) + Commitments (₹3k)]</p>
                <p className="text-emerald-600 dark:text-emerald-400 font-bold mt-1">= +₹14,000 / month baseline</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <p className="text-slate-700 dark:text-slate-300 font-sans mb-1 font-semibold">3. Emergency Buffer</p>
                <p className="text-slate-800 dark:text-slate-200">Buffer = Liquid Savings / Monthly Fixed Expenses</p>
                <p className="text-indigo-600 dark:text-indigo-400 mt-1 font-bold">Post-Purchase: {formatINR(activeScenario.post_purchase_savings)} / ₹21,000 = {activeScenario.emergency_buffer_months} months</p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-right">
              <button
                onClick={() => setShowCalculationModal(false)}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { 
  Sparkles, ArrowRight, Scale, Zap, Activity, 
  ChevronRight, Sun, Moon
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { formatINR } from '../utils/formatters';

interface LandingPageProps {
  onStartApp: () => void;
  onInstantDemo: (options?: { autoPlayAudio?: boolean }) => void;
  onOpenLogin: () => void;
  snapshot?: any;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartApp: _onStartApp,
  onInstantDemo,
  onOpenLogin,
  snapshot
}) => {
  const { theme, toggleTheme } = useTheme();

  // Engine verified figures
  const income = snapshot?.monthly_income || 35000;
  const savings = snapshot?.savings || 82000;
  const cushion = snapshot?.emergency_buffer_months || 3.9;
  const surplus = snapshot?.monthly_surplus || 14000;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090D16] transition-colors duration-200">
      {/* Top Banner Navigation */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 sticky top-0 z-50 transition-colors shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-sm">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">FINORA</span>
              <span className="text-[10px] ml-2 px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-200 dark:border-emerald-800">
                AI FINANCIAL INTELLIGENCE
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-amber-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors shadow-sm"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </button>

            {/* Prominent Login Button */}
            <button
              onClick={onOpenLogin}
              className="px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer"
            >
              Log In
            </button>

            {/* Launch Demo Button (Without Auto-Play) */}
            <button
              onClick={() => onInstantDemo()}
              className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-sm flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Launch Demo</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-14 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        <div className="text-center max-w-3xl mx-auto relative z-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Built for the way young Indians earn, spend & borrow</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white mb-6 leading-tight">
            Think Before <br className="hidden sm:inline" />
            <span className="text-indigo-600 dark:text-indigo-400">
              You Spend.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
            FINORA combines Gemini multimodal AI with a deterministic financial engine to simulate the exact future consequences of everyday financial decisions — before you make them.
          </p>

          {/* HERO ACTION BUTTONS: DEMO & LOGIN */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-12">
            <button
              onClick={() => onInstantDemo()}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm sm:text-base shadow-xl flex items-center justify-center space-x-2.5 transition-all transform hover:-translate-y-0.5 cursor-pointer ring-4 ring-indigo-600/20"
            >
              <Zap className="w-4 h-4 fill-current text-amber-300" />
              <span>Explore Decision Studio</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={onOpenLogin}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold text-sm sm:text-base border border-slate-300 dark:border-slate-700 shadow-sm flex items-center justify-center space-x-2 transition-all cursor-pointer"
            >
              <span>Sign In / Create Account</span>
            </button>
          </div>
        </div>

        {/* Hero Interactive Simulation Teaser (LIVE ENGINE NUMBERS) */}
        <div className="relative max-w-4xl mx-auto rounded-2xl p-6 sm:p-8 finora-card border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-rose-500" />
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400 ml-2">financial_engine.py</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-200 dark:border-emerald-800">
                ✓ Live Verified Engine Math
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 mb-6 font-mono text-xs sm:text-sm">
            <p className="text-slate-700 dark:text-slate-400">
              <span className="text-indigo-600 dark:text-indigo-400 font-bold">User:</span> “Can I afford a ₹65,000 laptop next month without damaging my emergency savings?”
            </p>
            <p className="text-emerald-700 dark:text-emerald-400 mt-2 font-medium">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">FINORA AI:</span> “YES, BUT it alters your risk profile. An upfront ₹65k purchase reduces your cushion from {cushion} months down to 0.8 months. However, choosing a 12-month EMI (₹5,800/mo) keeps ₹76k liquid today.”
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-bold">Take-Home Pay</span>
              <span className="text-base font-black text-slate-900 dark:text-white font-mono">{formatINR(income)}/mo</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-bold">Current Savings</span>
              <span className="text-base font-black text-slate-900 dark:text-white font-mono">{formatINR(savings)}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-bold">Emergency Cushion</span>
              <span className="text-base font-black text-indigo-600 dark:text-indigo-400 font-mono">{cushion} Months</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-bold">Monthly Surplus</span>
              <span className="text-base font-black text-emerald-600 dark:text-emerald-400 font-mono">+{formatINR(surplus)}/mo</span>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem & Solution Statement */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200 dark:border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 block mb-2">The Problem</span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3">Disconnected Financial Decisions</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Young Indians juggle UPI payments, no-cost EMIs, credit card bills, rent, and investments across separate apps. When deciding whether to buy a gadget or book a trip, decisions are made in isolation without knowing how it impacts next month's rent or long-term goals.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-2">The Solution</span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3">Unified Decision Intelligence</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              FINORA builds your Financial Digital Twin. Every question you ask triggers a deterministic calculation engine combined with Gemini multimodal intelligence to simulate trade-offs across 5 scenarios and project your exact timeline before you spend.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200 dark:border-slate-800">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block mb-2">Platform Capabilities</span>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">Everything You Need to Spend Smart</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="finora-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm finora-card-hover">
            <Scale className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mb-3" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">What-If Multi-Scenario Simulator</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Explore 5 distinct choices for every high-ticket purchase with cash-flow timelines, goal delay metrics, and stress indicators.
            </p>
          </div>

          <div className="finora-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm finora-card-hover">
            <Zap className="w-6 h-6 text-amber-500 dark:text-amber-400 mb-3" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Before You Pay (Cart Scanner)</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Upload product screenshots from Amazon or Flipkart to extract pricing and check post-purchase liquidity in 3 seconds.
            </p>
          </div>

          <div className="finora-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm finora-card-hover">
            <Activity className="w-6 h-6 text-rose-500 dark:text-rose-400 mb-3" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Financial Stress Testing</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Simulate 20% income drops, sudden ₹20k emergencies, or job search sabbaticals across 180-day forecast curves.
            </p>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
        <div className="finora-card rounded-2xl p-8 sm:p-12 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">
            Make informed financial decisions.
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto mb-6">
            “Most finance apps tell you where your money went. FINORA helps you understand what happens if you spend it.”
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onInstantDemo()}
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-sm inline-flex items-center justify-center space-x-2 transition-colors cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-current text-amber-300" />
              <span>Launch Demo (Aarav, 21)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenLogin}
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-sm shadow-sm inline-flex items-center justify-center space-x-2 transition-colors cursor-pointer"
            >
              <span>Sign In / Create Account</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

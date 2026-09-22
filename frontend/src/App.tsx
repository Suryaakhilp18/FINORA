import React, { useState, useEffect } from 'react';
import { 
  Zap, Scale, ShieldAlert, ArrowRight, Wallet, TrendingUp, Landmark, ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

import { 
  FinancialSnapshot, FinancialProfile, User, WhatIfResponse, 
  Transaction, AIInsight, FinancialGoal 
} from './types';
import { ApiService } from './services/api';
import { formatINR } from './utils/formatters';

// Components
import { Navbar } from './components/Navbar';
import { MobileNav } from './components/MobileNav';
import { FinancialSnapshotCards } from './components/FinancialSnapshotCards';
import { FinancialHealthOverview } from './components/FinancialHealthOverview';
import { AskFinoraHero } from './components/AskFinoraHero';
import { WhatIfSimulator } from './components/WhatIfSimulator';
import { DigitalTwinModal } from './components/DigitalTwinModal';
import { QuickOnboardingModal } from './components/QuickOnboardingModal';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { BeforeYouPayPage } from './pages/BeforeYouPayPage';
import { GoalPlannerPage } from './pages/GoalPlannerPage';
import { ExpenseIntelligencePage } from './pages/ExpenseIntelligencePage';
import { StressTestPage } from './pages/StressTestPage';

export default function App() {
  // App View State
  const [currentView, setCurrentView] = useState<'landing' | 'login' | 'app'>('landing');
  // 3-Pillar Navigation: 'studio' | 'finances' | 'goals'
  const [currentTab, setCurrentTab] = useState<string>('studio');
  // Studio sub-mode: 'simulator' | 'before-you-pay' | 'stress-test'
  const [studioMode, setStudioMode] = useState<'simulator' | 'before-you-pay' | 'stress-test'>('simulator');
  
  // User & Profile State
  const [user, setUser] = useState<User | null>(null);
  const [snapshot, setSnapshot] = useState<FinancialSnapshot | null>(null);
  const [profile, setProfile] = useState<FinancialProfile | null>(null);
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [_insights, setInsights] = useState<AIInsight[]>([]);
  const [isDigitalTwinOpen, setIsDigitalTwinOpen] = useState<boolean>(false);
  const [isQuickTwinOpen, setIsQuickTwinOpen] = useState<boolean>(false);

  // Simulation State
  const [activeSimulation, setActiveSimulation] = useState<WhatIfResponse | null>(null);
  const [simulatingProduct, setSimulatingProduct] = useState<string>('MacBook Air M3 Laptop');
  const [simulatingPrice, setSimulatingPrice] = useState<number>(65000);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [autoPlayAudio, setAutoPlayAudio] = useState<boolean>(false);

  const handleSimulationReady = (res: any) => {
    const simResult: WhatIfResponse = {
      product_name: res.parsed_intent?.product || res.product_name || 'Purchase Item',
      price: res.parsed_intent?.amount || res.price || 65000,
      payment_method: res.parsed_intent?.financing_preference || 'cash',
      baseline_context: res.financial_context || res.baseline_context || {
        current_liquid_savings: snapshot?.savings || 82000,
        monthly_income: snapshot?.monthly_income || 35000,
        monthly_expenses: snapshot?.monthly_expenses || 18000,
        upcoming_obligations: snapshot?.upcoming_obligations || 3000,
        monthly_surplus: snapshot?.monthly_surplus || 14000,
        emergency_buffer_months: snapshot?.emergency_buffer_months || 3.9
      },
      scenarios: res.deterministic_scenarios || res.scenarios || [],
      timeline: res.timeline || [],
      explanation: res.explanation,
      finora_score: res.finora_score,
      nocost_emi_analysis: res.nocost_emi_analysis,
      monte_carlo: res.monte_carlo,
      reasoning_trace: res.reasoning_trace,
      hallucination_guard: res.hallucination_guard,
      data_completeness: res.data_completeness || 'High'
    };

    setActiveSimulation(simResult);
    setSimulatingProduct(simResult.product_name);
    setSimulatingPrice(simResult.price);
    setStudioMode('simulator');
  };

  // Initialize data
  const loadUserData = async (userId: string = 'user_demo_21') => {
    try {
      const [snapData, profData, goalsData, txnsData, insightsData] = await Promise.all([
        ApiService.getSnapshot(userId),
        ApiService.getProfile(userId),
        ApiService.getGoals(userId),
        ApiService.getTransactions(userId),
        ApiService.getInsights(userId)
      ]);
      setSnapshot(snapData);
      setProfile(profData);
      setGoals(goalsData);
      setTransactions(txnsData);
      setInsights(insightsData);
      
      // Auto-run initial simulation for canonical laptop scenario
      if (!activeSimulation) {
        const initialSim = await ApiService.simulateWhatIf({
          product_name: 'MacBook Air M3 Laptop',
          price: 65000,
          query: 'Can I afford a ₹65,000 laptop?'
        }, userId);
        handleSimulationReady(initialSim);
      }
    } catch (err) {
      console.error('Error loading financial state:', err);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  const handleInstantDemo = async (options?: { autoPlayAudio?: boolean }) => {
    setIsLoading(true);
    if (options?.autoPlayAudio) {
      setAutoPlayAudio(true);
    }
    try {
      const res = await ApiService.demoLogin();
      setUser(res.user);
      await loadUserData(res.user.id);
      setCurrentView('app');
      setCurrentTab('studio');
      setStudioMode('simulator');
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch (e) {
      console.error(e);
      setCurrentView('app');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSuccess = (loggedInUser: User, _token: string) => {
    setUser(loggedInUser);
    setCurrentView('app');
    setCurrentTab('studio');
    loadUserData(loggedInUser.id);
  };

  const handleResetDemo = async () => {
    setIsLoading(true);
    await ApiService.resetDemo();
    await loadUserData('user_demo_21');
    setIsLoading(false);
    confetti({ particleCount: 40, spread: 50 });
  };

  const handleSimulateNew = async (product: string, price: number) => {
    setIsLoading(true);
    try {
      const res = await ApiService.simulateWhatIf({ product_name: product, price });
      handleSimulationReady(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  // 1. Landing View
  if (currentView === 'landing') {
    return (
      <LandingPage
        onStartApp={() => setCurrentView('login')}
        onInstantDemo={handleInstantDemo}
        onOpenLogin={() => setCurrentView('login')}
        snapshot={snapshot}
      />
    );
  }

  // 2. Login View
  if (currentView === 'login') {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        onInstantDemo={handleInstantDemo}
      />
    );
  }

  // 3. Authenticated App Experience
  return (
    <div className="min-h-screen flex flex-col pb-20 md:pb-10 bg-slate-50 dark:bg-[#090D16] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Top Sticky Navbar (3 Pillars) */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        user={user}
        snapshot={snapshot}
        onResetDemo={handleResetDemo}
        onOpenTwin={() => setIsDigitalTwinOpen(true)}
        onOpenQuickTwin={() => setIsQuickTwinOpen(true)}
        onLogout={() => setCurrentView('landing')}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* =========================================================================
            PILLAR 1: DECISION STUDIO (Unified, decluttered decision center)
            ========================================================================= */}
        {currentTab === 'studio' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Slim Live Financial Vital Ribbon */}
            {snapshot && (
              <div className="finora-card rounded-xl p-3 sm:p-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-300 font-semibold">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Live Financial Context:</span>
                </div>

                <div className="flex items-center flex-wrap gap-2 sm:gap-4 font-mono">
                  <div className="flex items-center space-x-1.5 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                    <Wallet className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                    <span className="text-slate-500 dark:text-slate-400 font-sans text-[11px]">Savings:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{formatINR(snapshot.savings)}</span>
                  </div>

                  <div className="flex items-center space-x-1.5 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-slate-500 dark:text-slate-400 font-sans text-[11px]">Surplus:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">+{formatINR(snapshot.monthly_surplus)}/mo</span>
                  </div>

                  <div className="flex items-center space-x-1.5 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                    <Landmark className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-slate-500 dark:text-slate-400 font-sans text-[11px]">Runway:</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{snapshot.emergency_buffer_months} Months</span>
                  </div>

                  <div className="hidden lg:flex items-center space-x-1.5 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-slate-500 dark:text-slate-400 font-sans text-[11px]">Safe Spend Limit:</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400">₹28,000</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsDigitalTwinOpen(true)}
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1"
                >
                  <span>Edit Twin Profile</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* "Ask FINORA" Hero Bar */}
            <AskFinoraHero
              onSimulationReady={handleSimulationReady}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />

            {/* Decision Workspace Header & Segmented Pill Switcher */}
            <div className="finora-card rounded-2xl p-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Decision Intelligence Workspace
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Select how you want to evaluate this purchase decision.
                </p>
              </div>

              {/* Segmented Control Pills */}
              <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => setStudioMode('simulator')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all ${
                    studioMode === 'simulator'
                      ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>5-Scenario Simulator</span>
                </button>

                <button
                  onClick={() => setStudioMode('before-you-pay')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all ${
                    studioMode === 'before-you-pay'
                      ? 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Before You Pay</span>
                </button>

                <button
                  onClick={() => setStudioMode('stress-test')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all ${
                    studioMode === 'stress-test'
                      ? 'bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Stress Test</span>
                </button>
              </div>
            </div>

            {/* Studio Workspace Content Body */}
            {studioMode === 'simulator' && activeSimulation && (
              <WhatIfSimulator
                scenarios={activeSimulation.scenarios}
                explanation={activeSimulation.explanation}
                timeline={activeSimulation.timeline}
                finoraScore={activeSimulation.finora_score}
                nocostEmiAnalysis={activeSimulation.nocost_emi_analysis}
                monteCarlo={activeSimulation.monte_carlo}
                reasoningTrace={activeSimulation.reasoning_trace}
                hallucinationGuard={activeSimulation.hallucination_guard}
                baselineContext={activeSimulation.baseline_context}
                productName={simulatingProduct}
                price={simulatingPrice}
                onSimulateNew={handleSimulateNew}
                isLoading={isLoading}
                autoPlayAudio={autoPlayAudio}
              />
            )}

            {studioMode === 'before-you-pay' && snapshot && (
              <BeforeYouPayPage
                snapshot={snapshot}
                onExploreInWhatIf={(prod, pr) => {
                  setSimulatingProduct(prod);
                  setSimulatingPrice(pr);
                  handleSimulateNew(prod, pr);
                  setStudioMode('simulator');
                }}
              />
            )}

            {studioMode === 'stress-test' && snapshot && (
              <StressTestPage snapshot={snapshot} />
            )}
          </div>
        )}

        {/* =========================================================================
            PILLAR 2: MY FINANCES (Snapshot, Health Dimensions, Expenses & Subs)
            ========================================================================= */}
        {currentTab === 'finances' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Snapshot Cards */}
            {snapshot && (
              <FinancialSnapshotCards 
                snapshot={snapshot} 
                onOpenObligations={() => {}}
              />
            )}

            {/* Financial Health Overview */}
            {snapshot && (
              <FinancialHealthOverview 
                snapshot={snapshot}
                onExploreDimension={() => {}}
              />
            )}

            {/* Expense Intelligence & Subscriptions */}
            {profile && (
              <ExpenseIntelligencePage
                transactions={transactions}
                profile={profile}
                onAskCopilot={(q) => {
                  setCurrentTab('studio');
                  setStudioMode('simulator');
                  handleSimulateNew(q, 65000);
                }}
              />
            )}
          </div>
        )}

        {/* =========================================================================
            PILLAR 3: GOAL PLANNER (Milestone targets and surplus allocation)
            ========================================================================= */}
        {currentTab === 'goals' && snapshot && (
          <GoalPlannerPage
            goals={goals}
            snapshot={snapshot}
            onGoalAdded={(newGoal) => setGoals([...goals, newGoal])}
          />
        )}
      </main>

      {/* Financial Digital Twin Modal */}
      {profile && (
        <DigitalTwinModal
          isOpen={isDigitalTwinOpen}
          onClose={() => setIsDigitalTwinOpen(false)}
          profile={profile}
          onSaveProfile={async (updated) => {
            setProfile(updated);
            await ApiService.updateProfile(updated);
            await loadUserData(updated.user_id);
          }}
        />
      )}

      {/* Quick 30-second Digital Twin Modal */}
      {profile && (
        <QuickOnboardingModal
          isOpen={isQuickTwinOpen}
          onClose={() => setIsQuickTwinOpen(false)}
          currentProfile={profile}
          onSaveProfile={async (updated) => {
            setProfile(updated);
            await ApiService.updateProfile(updated);
            await loadUserData(updated.user_id);
          }}
        />
      )}

      {/* Mobile Bottom Navigation */}
      <MobileNav
        currentTab={currentTab}
        onSelectTab={(t) => setCurrentTab(t)}
        onOpenTwin={() => setIsDigitalTwinOpen(true)}
      />
    </div>
  );
}

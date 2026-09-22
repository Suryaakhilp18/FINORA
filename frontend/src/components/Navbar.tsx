import React from 'react';
import { 
  Sparkles, ChevronRight, Target, PieChart, 
  Sun, Moon, ShieldCheck, Zap
} from 'lucide-react';
import { User, FinancialSnapshot } from '../types';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  user: User | null;
  snapshot: FinancialSnapshot | null;
  onResetDemo: () => void;
  onOpenTwin: () => void;
  onOpenQuickTwin?: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  user,
  snapshot: _snapshot,
  onResetDemo,
  onOpenTwin,
  onOpenQuickTwin,
  onLogout
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 w-full bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center space-x-6">
            <button 
              onClick={() => onSelectTab('studio')}
              className="flex items-center space-x-3 text-left group"
            >
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-sm group-hover:bg-indigo-500 transition-colors">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                    FINORA
                  </span>
                  <span className="px-1.5 py-0.5 text-[9px] font-bold tracking-wider uppercase bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 rounded border border-indigo-200 dark:border-indigo-800">
                    AI INTELLIGENCE
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block font-medium">
                  Think Before You Spend.
                </p>
              </div>
            </button>

            {/* Desktop Navigation Links (Uncluttered 3 Pillars) */}
            <nav className="hidden md:flex items-center space-x-1 pl-4 border-l border-slate-200 dark:border-slate-800">
              <button
                onClick={() => onSelectTab('studio')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                  currentTab === 'studio'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Decision Studio</span>
              </button>

              <button
                onClick={() => onSelectTab('finances')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                  currentTab === 'finances'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
              >
                <PieChart className="w-3.5 h-3.5" />
                <span>My Finances</span>
              </button>

              <button
                onClick={() => onSelectTab('goals')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                  currentTab === 'goals'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
              >
                <Target className="w-3.5 h-3.5" />
                <span>Goal Planner</span>
              </button>
            </nav>
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center space-x-2.5">
            {/* Quick 30s Twin Setup Button */}
            {onOpenQuickTwin && (
              <button
                onClick={onOpenQuickTwin}
                className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold hover:bg-indigo-100 transition-colors"
                title="Open 30-second 4-slider Digital Twin setup"
              >
                <span>⚡ 30s Setup</span>
              </button>
            )}
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-amber-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors shadow-sm"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </button>

            {/* Financial Digital Twin Trigger */}
            <button
              onClick={onOpenTwin}
              className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-indigo-500 transition-colors"
              title="View and edit your real-time Financial Digital Twin profile"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Digital Twin: Synced</span>
              <ChevronRight className="w-3 h-3 text-slate-400" />
            </button>

            {/* Instant Demo Reset for Hackathon Judges */}
            <button
              onClick={onResetDemo}
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-xs font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
              title="Reset state to canonical Aarav Sharma (21y, SDE, Bengaluru) demo persona"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Aarav (21y)</span>
            </button>

            {/* Logout / Exit App */}
            <button
              onClick={onLogout}
              className="p-1.5 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg transition-colors"
              title="Exit to Landing"
            >
              Exit
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

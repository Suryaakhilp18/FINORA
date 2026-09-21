import React from 'react';
import { Zap, PieChart, Target, User } from 'lucide-react';

interface MobileNavProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenTwin: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentTab, onSelectTab, onOpenTwin }) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 px-3 py-2 flex items-center justify-around shadow-lg transition-colors">
      <button
        onClick={() => onSelectTab('studio')}
        className={`flex flex-col items-center justify-center p-1.5 rounded-lg transition-colors ${
          currentTab === 'studio' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-500 dark:text-slate-400'
        }`}
      >
        <Zap className="w-5 h-5 mb-0.5" />
        <span className="text-[10px]">Studio</span>
      </button>

      <button
        onClick={() => onSelectTab('finances')}
        className={`flex flex-col items-center justify-center p-1.5 rounded-lg transition-colors ${
          currentTab === 'finances' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-500 dark:text-slate-400'
        }`}
      >
        <PieChart className="w-5 h-5 mb-0.5" />
        <span className="text-[10px]">Finances</span>
      </button>

      <button
        onClick={() => onSelectTab('goals')}
        className={`flex flex-col items-center justify-center p-1.5 rounded-lg transition-colors ${
          currentTab === 'goals' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-500 dark:text-slate-400'
        }`}
      >
        <Target className="w-5 h-5 mb-0.5" />
        <span className="text-[10px]">Goals</span>
      </button>

      <button
        onClick={onOpenTwin}
        className="flex flex-col items-center justify-center p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
      >
        <User className="w-5 h-5 mb-0.5" />
        <span className="text-[10px]">Twin</span>
      </button>
    </div>
  );
};

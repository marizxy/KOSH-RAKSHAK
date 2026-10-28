import React from 'react';

export interface TabItem {
  id: string;
  label: string;
  badge?: string | number;
  icon?: React.ReactNode;
}

interface PillNavigationProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (id: string) => void;
  accentColor?: 'blue' | 'emerald' | 'amber' | 'purple';
}

export const PillNavigation: React.FC<PillNavigationProps> = ({
  tabs,
  activeTab,
  onTabChange,
  accentColor = 'blue'
}) => {
  const colorMap = {
    blue: 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 border-blue-400/40',
    emerald: 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 border-emerald-400/40',
    amber: 'bg-amber-600 text-white shadow-lg shadow-amber-600/30 border-amber-400/40',
    purple: 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 border-purple-400/40'
  };

  return (
    <div className="w-full bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 shadow-md backdrop-blur-sm">
      <div className="flex items-center justify-between gap-1 sm:gap-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold tracking-tight transition-all duration-300 border ${
                isActive
                  ? `${colorMap[accentColor]} font-bold scale-[1.01]`
                  : 'text-slate-400 bg-transparent border-transparent hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {tab.icon && <span className="opacity-90">{tab.icon}</span>}
              <span className="truncate">{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-800 text-slate-400 group-hover:text-slate-200'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

import React from 'react';
import { FastForward, RotateCcw, AlertTriangle, Calendar, Bell, Lock } from 'lucide-react';
import { UserRole } from '../types';

interface TimeTravelSimulatorProps {
  daysOffset: number;
  simulatedDate: string;
  onSetDaysOffset: (days: number) => void;
  overdueCount: number;
  approachingCount: number;
  currentRole?: UserRole;
}

export const TimeTravelSimulator: React.FC<TimeTravelSimulatorProps> = ({
  daysOffset,
  simulatedDate,
  onSetDaysOffset,
  overdueCount,
  approachingCount,
  currentRole = 'bureau',
}) => {
  const isRegulatoryAuthority = currentRole === 'bureau' || currentRole === 'BUREAU_HEAD' || currentRole === 'regional' || currentRole === 'REGIONAL_OFFICER';

  return (
    <div className="bg-[#FFFFFF] border-b border-[#D4D1C7] px-4 py-2 sm:px-6 shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2.5">
        
        {/* Left: Indicator of current simulation time */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#EAE8E1] border border-[#D4D1C7] text-slate-800 text-xs font-medium">
            <Calendar className="w-3.5 h-3.5 text-[#14532D]" />
            <span>Simulated System Date:</span>
            <span className="font-mono font-bold text-[#14532D]">{simulatedDate}</span>
          </div>

          {daysOffset > 0 ? (
            <div className="flex items-center gap-1.5 text-xs text-amber-800 bg-amber-50 border border-amber-300 px-2 py-0.5 rounded font-mono font-semibold">
              <FastForward className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
              <span>+{daysOffset} Days Elapsed</span>
            </div>
          ) : (
            <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
              (Live Baseline: 26-Oct-2026)
            </span>
          )}
        </div>

        {/* Center / Right: Time Travel Jump Buttons OR Scoped Lock Notice */}
        {isRegulatoryAuthority ? (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mr-1">
              Maturity Fast-Forward:
            </span>

            <button
              onClick={() => onSetDaysOffset(15)}
              className={`px-2.5 py-1 text-xs rounded border transition-colors font-medium flex items-center gap-1 ${
                daysOffset === 15
                  ? 'bg-amber-700 text-white border-amber-800 font-bold'
                  : 'bg-[#F5F4F0] text-slate-700 hover:bg-slate-200 border-[#D4D1C7]'
              }`}
              title="Fast-forward 15 days to test Royal College maturity expiration"
            >
              <span>+15 Days</span>
              <span className="text-[10px] opacity-75">(T-0 Royal)</span>
            </button>

            <button
              onClick={() => onSetDaysOffset(30)}
              className={`px-2.5 py-1 text-xs rounded border transition-colors font-medium ${
                daysOffset === 30
                  ? 'bg-amber-700 text-white border-amber-800 font-bold'
                  : 'bg-[#F5F4F0] text-slate-700 hover:bg-slate-200 border-[#D4D1C7]'
              }`}
            >
              +30 Days
            </button>

            <button
              onClick={() => onSetDaysOffset(60)}
              className={`px-2.5 py-1 text-xs rounded border transition-colors font-medium flex items-center gap-1 ${
                daysOffset === 60
                  ? 'bg-crimson text-white bg-red-700 border-red-800 font-bold'
                  : 'bg-[#F5F4F0] text-slate-700 hover:bg-slate-200 border-[#D4D1C7]'
              }`}
              title="Fast-forward 60 days to trigger Multi-Tier Overdue Escalation alarms"
            >
              <span>+60 Days</span>
              <span className="text-[10px] opacity-75">(Multi-Tier Default)</span>
            </button>

            <button
              onClick={() => onSetDaysOffset(90)}
              className={`px-2.5 py-1 text-xs rounded border transition-colors font-medium ${
                daysOffset === 90
                  ? 'bg-red-800 text-white border-red-900 font-bold'
                  : 'bg-[#F5F4F0] text-slate-700 hover:bg-slate-200 border-[#D4D1C7]'
              }`}
            >
              +90 Days
            </button>

            {daysOffset > 0 && (
              <button
                onClick={() => onSetDaysOffset(0)}
                className="px-2.5 py-1 text-xs rounded bg-slate-800 text-slate-100 hover:bg-slate-900 border border-slate-700 flex items-center gap-1 transition-colors ml-1 font-medium"
                title="Reset System Date back to Baseline"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Date</span>
              </button>
            )}

            {/* Dynamic alerts badge */}
            <div className="flex items-center gap-2 ml-2 pl-2 border-l border-slate-300 text-xs">
              <div className="flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                <Bell className="w-3 h-3" />
                <span className="font-bold">{approachingCount}</span>
                <span className="text-[10px] uppercase font-semibold">Approaching</span>
              </div>
              <div className="flex items-center gap-1 text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                <AlertTriangle className="w-3 h-3" />
                <span className="font-bold">{overdueCount}</span>
                <span className="text-[10px] uppercase font-semibold">Overdue / Flagged</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>AICTE National Time Standard • Locked by Regulation Bureau HQ</span>
          </div>
        )}

      </div>
    </div>
  );
};

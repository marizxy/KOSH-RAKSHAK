import React, { useState } from 'react';
import { Target, ChevronUp, ChevronDown, Sparkles, CheckCircle2 } from 'lucide-react';

interface JudgeDemoBarProps {
  activeDemo: number | null;
  onSelectDemo: (demoNumber: number) => void;
}

export const JudgeDemoBar: React.FC<JudgeDemoBarProps> = ({
  activeDemo,
  onSelectDemo,
}) => {
  const [collapsed, setCollapsed] = useState(false);

  const demos = [
    {
      num: 1,
      tag: 'Demo 1',
      title: 'College FDR Intake & OCR',
      desc: 'Smart 99.7% OCR Auto-Extraction from SBI FDR',
    },
    {
      num: 2,
      tag: 'Demo 2',
      title: 'Forensic ELA & Math Forgery',
      desc: 'Catches Photoshop ₹35L edit + Quarterly Compounding mismatch',
    },
    {
      num: 3,
      tag: 'Demo 3',
      title: 'Bank CBS Handshake & Green Sheet',
      desc: 'Uncovers secret ₹22L overdraft loan & auto-drafts e-Office note',
    },
    {
      num: 4,
      tag: 'Demo 4',
      title: 'Time-Travel & Multi-Tier Escalation',
      desc: 'Simulate +60 days; triggers T-15/T-0 WhatsApp/SMS/Email logs',
    },
    {
      num: 5,
      tag: 'Demo 5',
      title: 'Renewal Lineage Chain',
      desc: 'Continuous lien verification with 0-Day coverage gap check',
    },
    {
      num: 6,
      tag: 'Demo 6',
      title: '5-Gate Release & QR Discharge Order',
      desc: 'Evaluates 5 gates, generates official letter + SHA-256 audit',
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#16202A] text-white border-t-2 border-amber-600 shadow-2xl transition-all duration-200">
      {/* Header bar / Minimizer */}
      <div className="px-4 py-1.5 bg-slate-900 flex items-center justify-between text-xs border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          <span className="font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
            <Target className="w-3.5 h-3.5" />
            SIH Judge Evaluation Scenarios (Instant Quick-Jump)
          </span>
          <span className="text-slate-400 text-[11px] hidden md:inline">
            Click any demo scenario to test all requirements of Problem Statement ID: 26265
          </span>
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-amber-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs select-none"
          title={collapsed ? "Expand Judge Evaluation Quick-Jump Bar" : "Minimize Judge Bar"}
        >
          <span>{collapsed ? 'Expand Quick Bar' : 'Minimize Bar'}</span>
          {collapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Button Scenarios Bar */}
      {!collapsed && (
        <div className="p-2 sm:px-4 max-w-7xl mx-auto overflow-x-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 min-w-[700px] lg:min-w-0">
            {demos.map((d) => {
              const isActive = activeDemo === d.num;
              return (
                <button
                  key={d.num}
                  onClick={() => onSelectDemo(d.num)}
                  className={`text-left p-2 rounded-sm border transition-all duration-150 flex flex-col justify-between ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 border-white font-semibold ring-2 ring-amber-300'
                      : 'bg-slate-800/90 text-slate-200 hover:bg-slate-700/90 border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-mono font-bold ${
                        isActive ? 'bg-slate-950 text-amber-300' : 'bg-slate-700 text-amber-400'
                      }`}
                    >
                      {d.tag}
                    </span>
                    {isActive && <CheckCircle2 className="w-3.5 h-3.5 text-slate-950" />}
                  </div>
                  <div>
                    <div className="font-bold text-xs truncate leading-snug">{d.title}</div>
                    <div
                      className={`text-[10px] leading-tight line-clamp-2 mt-0.5 ${
                        isActive ? 'text-slate-900' : 'text-slate-400'
                      }`}
                    >
                      {d.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

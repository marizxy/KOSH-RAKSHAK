import React, { useState } from 'react';
import { FDRInstrument, EscalationDispatchLog } from '../types';
import { formatGovDate, getDaysRemaining, formatInr } from '../utils/formatters';
import { EoaFreezingMatrix } from './EoaFreezingMatrix';
import { 
  Bell, 
  Clock, 
  Send, 
  Mail, 
  MessageSquare, 
  FileWarning, 
  AlertOctagon, 
  CheckCircle2, 
  ShieldAlert, 
  Eye, 
  X, 
  ExternalLink,
  Smartphone,
  Lock,
  Layers
} from 'lucide-react';

interface Module4ValidityEscalationsProps {
  instruments: FDRInstrument[];
  simulatedDate: string;
  dispatchLogs: EscalationDispatchLog[];
  onTriggerManualNotice?: (fdr: FDRInstrument, tier: 1 | 2 | 3) => void;
  onUpdateInstrument?: (updated: FDRInstrument) => void;
  userRole?: string;
  onOpenRenewalForInstrument?: (inst: FDRInstrument) => void;
}

export const Module4ValidityEscalations: React.FC<Module4ValidityEscalationsProps> = ({
  instruments,
  simulatedDate,
  dispatchLogs,
  onTriggerManualNotice,
  onUpdateInstrument,
  userRole = 'bureau',
  onOpenRenewalForInstrument,
}) => {
  const [subTab, setSubTab] = useState<'ESCALATION_TRACKER' | 'EOA_FREEZE_MATRIX'>('ESCALATION_TRACKER');
  const [selectedLog, setSelectedLog] = useState<EscalationDispatchLog | null>(null);
  const [activeTierFilter, setActiveTierFilter] = useState<number | 'ALL'>('ALL');

  // Filter logs by tier
  const filteredLogs = dispatchLogs.filter((log) => {
    if (activeTierFilter === 'ALL') return true;
    return log.tier === activeTierFilter;
  });

  const frozenCount = instruments.filter(
    (i) => i.eoaStatus.isFrozen || getDaysRemaining(i.maturityDate, simulatedDate) < 0
  ).length;

  const isBureau = userRole === 'bureau' || userRole === 'BUREAU_HEAD';

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-[#FFFFFF] border border-[#D4D1C7] p-4 rounded-sm shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#14532D]" />
              <h2 className="text-base font-bold text-slate-900">
                {isBureau 
                  ? 'Validity Tracking, Escalation Engine & Statutory EoA Freezing Matrix' 
                  : 'Regional Validity Tracking & 3-Tier Multi-Channel Escalation Monitor'}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {isBureau
                ? 'Autonomous regulatory countdown trackers, multi-channel webhooks, and automatic Extension of Approval (EoA) certificate withholding'
                : 'Regional office countdown trackers linked to autonomous WhatsApp, SMS, and NIC e-Office escalation dispatches'}
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#F5F4F0] px-3 py-1.5 rounded border border-[#D4D1C7] text-xs">
            <span className="text-slate-500">Active Clock:</span>
            <span className="font-mono font-bold text-slate-900">{simulatedDate}</span>
          </div>
        </div>
      </div>

      {/* Sub-View Switcher Tabs (EXCLUSIVELY visible if Bureau Head) */}
      {isBureau && (
        <div className="flex items-center space-x-2 border-b border-[#D4D1C7] pb-1">
          <button
            onClick={() => setSubTab('ESCALATION_TRACKER')}
            className={`flex items-center gap-2 py-2 px-3 text-xs font-bold rounded-t border-t border-x transition-colors ${
              subTab === 'ESCALATION_TRACKER'
                ? 'bg-white border-[#D4D1C7] text-slate-900 -mb-px border-b-2 border-b-white'
                : 'bg-stone-100 border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Bell className="w-3.5 h-3.5 text-[#14532D]" />
            <span>3-Tier Escalation Matrix & Multi-Channel Logs</span>
          </button>

          <button
            onClick={() => setSubTab('EOA_FREEZE_MATRIX')}
            className={`flex items-center gap-2 py-2 px-3 text-xs font-bold rounded-t border-t border-x transition-colors ${
              subTab === 'EOA_FREEZE_MATRIX'
                ? 'bg-white border-[#D4D1C7] text-slate-900 -mb-px border-b-2 border-b-white'
                : 'bg-stone-100 border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-red-700" />
            <span>Automated AICTE EoA Direct Freezing Matrix</span>
            <span className="bg-red-700 text-white text-[9px] px-1.5 py-0.2 rounded font-mono font-bold animate-pulse">
              {frozenCount} FROZEN
            </span>
          </button>
        </div>
      )}

      {/* Render Sub-View */}
      {isBureau && subTab === 'EOA_FREEZE_MATRIX' ? (
        <EoaFreezingMatrix
          instruments={instruments}
          simulatedDate={simulatedDate}
          onUpdateInstrument={onUpdateInstrument || (() => {})}
          userRole={userRole}
          onOpenRenewalForInstrument={onOpenRenewalForInstrument}
        />
      ) : (
        <>
          {/* SECTION 1: 3-Tier Escalation Architecture Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Tier 1 Card */}
        <div className="bg-[#FFFFFF] border border-stone-300 rounded-sm p-4 shadow-xs border-t-4 border-t-amber-500">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
              Tier 1: Advisory Window
            </span>
            <span className="text-[10px] font-mono bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-bold">
              T-90 & T-60 Days
            </span>
          </div>
          <h3 className="font-bold text-sm text-slate-900 mb-1">
            Automated Renewal Reminders
          </h3>
          <p className="text-xs text-slate-600 mb-3 leading-relaxed">
            Autonomous notifications dispatched to the Institution Nodal Officer and Registrar to begin the renewal process with the issuing bank.
          </p>
          <div className="bg-stone-50 p-2 rounded text-[11px] font-mono text-slate-600 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-amber-700" />
              <span>Official Email Dispatch</span>
            </span>
            <span className="text-emerald-700 font-bold">Automated</span>
          </div>
        </div>

        {/* Tier 2 Card */}
        <div className="bg-[#FFFFFF] border border-stone-300 rounded-sm p-4 shadow-xs border-t-4 border-t-orange-600">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-800">
              Tier 2: Compliance Warning
            </span>
            <span className="text-[10px] font-mono bg-orange-100 text-orange-900 px-2 py-0.5 rounded font-bold">
              T-30 & T-15 Days
            </span>
          </div>
          <h3 className="font-bold text-sm text-slate-900 mb-1">
            Urgent Principal Alert & SRO CC
          </h3>
          <p className="text-xs text-slate-600 mb-3 leading-relaxed">
            High-priority SMS and WhatsApp webhooks pushed directly to Institution Principal and Chairman, with direct carbon-copy to the Regional Scrutiny Officer.
          </p>
          <div className="bg-stone-50 p-2 rounded text-[11px] font-mono text-slate-600 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-orange-600" />
              <span>WhatsApp + SMS Webhook</span>
            </span>
            <span className="text-orange-700 font-bold">High Priority</span>
          </div>
        </div>

        {/* Tier 3 Card */}
        <div className="bg-[#FFFFFF] border border-stone-300 rounded-sm p-4 shadow-xs border-t-4 border-t-red-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-red-800">
              Tier 3: Default & Freeze
            </span>
            <span className="text-[10px] font-mono bg-red-100 text-red-900 px-2 py-0.5 rounded font-bold">
              T-0 Days (Past Maturity)
            </span>
          </div>
          <h3 className="font-bold text-sm text-slate-900 mb-1">
            Regulation Bureau Head Escalation
          </h3>
          <p className="text-xs text-slate-600 mb-3 leading-relaxed">
            FDR crossed maturity without replacement. Auto-escalated to AICTE HQ Competent Authority; institutional Extension of Approval (EoA) portal is placed on regulatory freeze.
          </p>
          <div className="bg-stone-50 p-2 rounded text-[11px] font-mono text-slate-600 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <AlertOctagon className="w-3.5 h-3.5 text-red-700" />
              <span>NIC e-Office File + EoA Freeze</span>
            </span>
            <span className="text-red-800 font-bold">Statutory Action</span>
          </div>
        </div>

      </div>

      {/* SECTION 2: Active Instruments Maturing Countdown Strip */}
      <div className="bg-[#FFFFFF] border border-[#D4D1C7] rounded-sm p-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#14532D]" />
            Live Monitored Instruments Approaching or Past Maturity
          </h3>
          <span className="text-xs text-slate-500 font-mono">
            Evaluated at date: {simulatedDate}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {instruments
            .filter((i) => {
              const days = getDaysRemaining(i.maturityDate, simulatedDate);
              return days <= 90;
            })
            .map((inst) => {
              const days = getDaysRemaining(inst.maturityDate, simulatedDate);
              const isPast = days < 0;
              const isCritical = days >= 0 && days <= 15;
              const isWarning = days > 15 && days <= 60;

              return (
                <div
                  key={inst.id}
                  className={`border rounded p-3 flex flex-col justify-between ${
                    isPast
                      ? 'border-red-400 bg-red-50/70'
                      : isCritical
                      ? 'border-orange-400 bg-orange-50/70'
                      : 'border-amber-300 bg-amber-50/50'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between mb-1">
                      <span className="font-mono text-xs font-bold text-slate-900 truncate">
                        {inst.fdrNumber}
                      </span>
                      <span
                        className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                          isPast
                            ? 'bg-red-700 text-white animate-pulse'
                            : isCritical
                            ? 'bg-orange-600 text-white'
                            : 'bg-amber-600 text-white'
                        }`}
                      >
                        {isPast ? `OVERDUE -${Math.abs(days)}d` : `${days} DAYS LEFT`}
                      </span>
                    </div>

                    <div className="font-bold text-xs text-slate-900 line-clamp-1 mb-1">
                      {inst.institutionName}
                    </div>

                    <div className="text-[11px] text-slate-600 flex items-center justify-between font-mono mb-2">
                      <span>Maturity: {formatGovDate(inst.maturityDate)}</span>
                      <span className="font-bold text-slate-800">{formatInr(inst.principalAmount)}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-stone-200/80 text-[10px] flex items-center justify-between">
                    <span className="font-medium text-slate-700">
                      {isPast ? 'Tier 3 Escalated' : isCritical ? 'Tier 2 Warning' : 'Tier 1 Advisory'}
                    </span>
                    <span className="font-mono text-slate-500">{inst.region} Desk</span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* SECTION 3: Multi-Channel Alert & Escalation Dispatch Ledger */}
      <div className="bg-[#FFFFFF] border border-[#D4D1C7] rounded-sm p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200 pb-3 mb-3">
          <div>
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Send className="w-4 h-4 text-[#14532D]" />
              Automated Dispatched Regulatory Notices Ledger
            </h3>
            <p className="text-xs text-slate-500">
              Live audit trail of dispatched emails, SMS, and WhatsApp webhooks with cryptographic delivery stamps
            </p>
          </div>

          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-500 font-semibold mr-1">Filter Tier:</span>
            <button
              onClick={() => setActiveTierFilter('ALL')}
              className={`px-2 py-0.5 rounded text-xs font-mono font-medium ${
                activeTierFilter === 'ALL'
                  ? 'bg-slate-800 text-white'
                  : 'bg-stone-100 text-slate-700 hover:bg-stone-200'
              }`}
            >
              All Tiers
            </button>
            <button
              onClick={() => setActiveTierFilter(1)}
              className={`px-2 py-0.5 rounded text-xs font-mono font-medium ${
                activeTierFilter === 1
                  ? 'bg-amber-600 text-white'
                  : 'bg-stone-100 text-slate-700 hover:bg-stone-200'
              }`}
            >
              Tier 1
            </button>
            <button
              onClick={() => setActiveTierFilter(2)}
              className={`px-2 py-0.5 rounded text-xs font-mono font-medium ${
                activeTierFilter === 2
                  ? 'bg-orange-600 text-white'
                  : 'bg-stone-100 text-slate-700 hover:bg-stone-200'
              }`}
            >
              Tier 2
            </button>
            <button
              onClick={() => setActiveTierFilter(3)}
              className={`px-2 py-0.5 rounded text-xs font-mono font-medium ${
                activeTierFilter === 3
                  ? 'bg-red-700 text-white'
                  : 'bg-stone-100 text-slate-700 hover:bg-stone-200'
              }`}
            >
              Tier 3
            </button>
          </div>
        </div>

        {/* Logs Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse gov-table">
            <thead>
              <tr>
                <th>Notice ID</th>
                <th>Channel & Tier</th>
                <th>FDR Number & Institution</th>
                <th>Recipient</th>
                <th>Subject & Regulatory Action</th>
                <th>Timestamp</th>
                <th className="text-right">Inspection</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => {
                return (
                  <tr key={log.id} className="transition-colors">
                    
                    <td className="font-mono text-xs text-slate-600 font-semibold">
                      {log.id}
                    </td>

                    <td>
                      <div className="flex items-center gap-1.5">
                        {log.channel === 'EMAIL' && <Mail className="w-3.5 h-3.5 text-blue-600" />}
                        {log.channel === 'WHATSAPP_WEBHOOK' && <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />}
                        {log.channel === 'NIC_E_OFFICE' && <AlertOctagon className="w-3.5 h-3.5 text-red-600" />}
                        <span className="font-mono text-xs font-bold text-slate-800">
                          {log.channel}
                        </span>
                      </div>
                      <div className="text-[10px] mt-0.5">
                        <span
                          className={`px-1.5 py-0.2 rounded font-mono font-bold ${
                            log.tier === 3
                              ? 'bg-red-100 text-red-800'
                              : log.tier === 2
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          Tier {log.tier} Escalation
                        </span>
                      </div>
                    </td>

                    <td className="max-w-[200px]">
                      <div className="font-mono font-bold text-slate-900 text-xs truncate">
                        {log.fdrNumber}
                      </div>
                      <div className="text-[11px] text-slate-600 truncate">
                        {log.institutionName}
                      </div>
                    </td>

                    <td className="max-w-[180px]">
                      <div className="text-xs text-slate-800 truncate font-mono">
                        {log.recipient}
                      </div>
                      <div className="text-[10px] text-emerald-700 font-medium">
                        ✓ {log.deliveryStatus}
                      </div>
                    </td>

                    <td className="max-w-[260px]">
                      <div className="font-bold text-slate-900 text-xs truncate">
                        {log.subject}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate font-serif">
                        {log.messageBody}
                      </div>
                    </td>

                    <td className="font-mono text-xs text-slate-600 whitespace-nowrap">
                      {log.timestamp}
                    </td>

                    <td className="text-right whitespace-nowrap">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="px-2 py-1 text-xs bg-stone-100 hover:bg-stone-200 border border-[#D4D1C7] rounded text-slate-700 font-medium flex items-center gap-1 ml-auto"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview</span>
                      </button>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Notice Preview Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#FFFFFF] border-2 border-[#D4D1C7] rounded shadow-2xl max-w-xl w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <FileWarning className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-base text-slate-900">
                  Dispatched Notice Preview: {selectedLog.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-1 rounded hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs font-mono bg-stone-50 p-3 rounded border border-stone-200">
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Channel:</span>
                <span className="font-bold text-slate-800">{selectedLog.channel} (Tier {selectedLog.tier})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Recipient:</span>
                <span className="font-bold text-slate-800 truncate max-w-[340px]">{selectedLog.recipient}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Dispatch Timestamp:</span>
                <span className="text-slate-700">{selectedLog.timestamp}</span>
              </div>
            </div>

            <div className="p-4 bg-stone-100 rounded border border-stone-300 font-serif text-slate-900 text-xs leading-relaxed space-y-2">
              <div className="font-bold font-sans text-sm text-slate-950 border-b border-stone-300 pb-1">
                {selectedLog.subject}
              </div>
              <p className="whitespace-pre-line">
                {selectedLog.messageBody}
              </p>
              <div className="pt-2 border-t border-stone-300 text-[10px] text-slate-500 font-sans">
                Notice Issued by Order of Member Secretary, AICTE, New Delhi • Reference: APH 2026-27 Section 1.5
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-1.5 text-xs bg-slate-800 text-white rounded hover:bg-slate-900 font-medium"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
        </>
      )}

    </div>
  );
};

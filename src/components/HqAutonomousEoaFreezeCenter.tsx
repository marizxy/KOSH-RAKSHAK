import React, { useState } from 'react';
import { FDRInstrument } from '../types';
import { formatGovDate, formatInr, getDaysRemaining } from '../utils/formatters';
import { EoaCertificateModal } from './EoaFreezingMatrix';
import { 
  Lock, 
  Unlock, 
  FileCheck, 
  AlertOctagon, 
  FileWarning, 
  Printer, 
  Download, 
  CheckCircle2, 
  X, 
  ShieldAlert, 
  ExternalLink,
  Award,
  Building2,
  Calendar,
  AlertTriangle,
  Zap,
  Check,
  RefreshCw,
  Search
} from 'lucide-react';

interface HqAutonomousEoaFreezeCenterProps {
  instruments: FDRInstrument[];
  simulatedDate: string;
  onUpdateInstrument: (updated: FDRInstrument) => void;
  onBulkFreezeAllDefaulters?: () => void;
  onOpenRenewalForInstrument?: (inst: FDRInstrument) => void;
}

export const HqAutonomousEoaFreezeCenter: React.FC<HqAutonomousEoaFreezeCenterProps> = ({
  instruments,
  simulatedDate,
  onUpdateInstrument,
  onBulkFreezeAllDefaulters,
  onOpenRenewalForInstrument,
}) => {
  const [selectedInstForCertificate, setSelectedInstForCertificate] = useState<FDRInstrument | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [freezeFilter, setFreezeFilter] = useState<'ALL' | 'FROZEN' | 'ACTIVE'>('ALL');
  const [bulkActionSuccess, setBulkActionSuccess] = useState<string | null>(null);

  // Compute live dynamic freeze state across all institutions
  const evaluatedInstitutions = instruments.map((inst) => {
    const daysLeft = getDaysRemaining(inst.maturityDate, simulatedDate);
    const isPastMaturity = daysLeft < 0;
    const hasUnresolvedDiscrepancy = inst.status === 'DISCREPANCY_FLAGGED' || inst.ghostEncumbrance.hasLitigationHold;
    const isRenewalComplete = inst.lineage.zeroGapVerified && inst.status === 'RENEWED';

    let isFrozen = inst.eoaStatus.isFrozen;
    let freezeReason = inst.eoaStatus.freezeReason;

    // Autonomous programmatic enforcement: if past maturity without renewal lineage, auto-freeze!
    if (isPastMaturity && !isRenewalComplete) {
      isFrozen = true;
      freezeReason = `AUTOMATIC PENAL FREEZE: FDR #${inst.fdrNumber} lapsed past maturity by ${Math.abs(daysLeft)} days without replacement lineage (APH 2026-27 Section 1.5)`;
    } else if (hasUnresolvedDiscrepancy && !inst.ghostEncumbrance.clearedByOfficer) {
      isFrozen = true;
    } else if (isRenewalComplete) {
      isFrozen = false;
      freezeReason = undefined;
    }

    return {
      ...inst,
      liveEoaFrozen: isFrozen,
      liveFreezeReason: freezeReason,
      daysLeft,
    };
  });

  const frozenCount = evaluatedInstitutions.filter((i) => i.liveEoaFrozen).length;
  const activeCount = evaluatedInstitutions.filter((i) => !i.liveEoaFrozen).length;

  // Filtered list
  const filteredInstitutions = evaluatedInstitutions.filter((item) => {
    const matchesSearch =
      item.institutionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.fdrNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.institutionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.region.toLowerCase().includes(searchQuery.toLowerCase());

    if (freezeFilter === 'FROZEN') return matchesSearch && item.liveEoaFrozen;
    if (freezeFilter === 'ACTIVE') return matchesSearch && !item.liveEoaFrozen;
    return matchesSearch;
  });

  // Execute Instant Nationwide Freeze on All Defaulters
  const handleExecuteNationwideFreeze = () => {
    let affectedCount = 0;
    evaluatedInstitutions.forEach((item) => {
      if ((item.daysLeft < 0 || item.status === 'DISCREPANCY_FLAGGED' || item.ghostEncumbrance.hasLitigationHold) && !item.eoaStatus.isFrozen) {
        affectedCount++;
        const updated: FDRInstrument = {
          ...item,
          eoaStatus: {
            ...item.eoaStatus,
            isFrozen: true,
            freezeReason: `NATIONWIDE HQ FREEZE: Non-compliant deposit under APH Section 1.5 executed by Bureau Head on ${simulatedDate}`,
            canDownload: false,
          },
        };
        onUpdateInstrument(updated);
      }
    });

    if (onBulkFreezeAllDefaulters) {
      onBulkFreezeAllDefaulters();
    }

    setBulkActionSuccess(`⚡ NATIONWIDE REGULATORY FREEZE EXECUTED: Extension of Approval (EoA) portal locked for all ${frozenCount} defaulting/flagged technical colleges.`);
    setTimeout(() => setBulkActionSuccess(null), 6000);
  };

  // Toggle single institution freeze/unfreeze
  const handleToggleFreeze = (inst: FDRInstrument) => {
    const nextState = !inst.eoaStatus.isFrozen;
    const updated: FDRInstrument = {
      ...inst,
      eoaStatus: {
        ...inst.eoaStatus,
        isFrozen: nextState,
        freezeReason: nextState ? 'Manual Administrative Freeze imposed by Regulation Bureau Head' : undefined,
        canDownload: !nextState,
      },
    };
    onUpdateInstrument(updated);
  };

  return (
    <div className="space-y-6">
      
      {/* Exclusive HQ Header Banner */}
      <div className="bg-[#FFFFFF] border-2 border-red-700 rounded-sm p-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded bg-red-50 border border-red-300 flex items-center justify-center shrink-0 mt-0.5">
              <Lock className="w-6 h-6 text-red-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold bg-red-900 text-white px-2 py-0.5 rounded uppercase">
                  EXCLUSIVE HQ MODULE 2 • SUPER ADMIN ENFORCEMENT
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  Regulatory Compliance Control Panel • AICTE HQ New Delhi
                </span>
              </div>
              <h2 className="text-base font-bold text-slate-900 mt-0.5">
                Autonomous AICTE EoA (Extension of Approval) Direct Freezing Matrix
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Master compliance control panel executing automated nationwide regulatory freezes—blocking unrenewed institutions from downloading academic approval certificates
              </p>
            </div>
          </div>

          {/* Master 1-Click Action */}
          <button
            onClick={handleExecuteNationwideFreeze}
            className="px-4 py-2 bg-red-800 hover:bg-red-900 text-white rounded font-bold text-xs shadow-md flex items-center gap-2 whitespace-nowrap self-start md:self-auto transition-colors animate-pulse"
          >
            <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>Execute Instant Nationwide Freeze on Defaulters</span>
          </button>
        </div>
      </div>

      {bulkActionSuccess && (
        <div className="p-3 bg-red-50 border-2 border-red-600 rounded text-xs text-red-950 font-bold font-mono flex items-center gap-2 shadow-xs">
          <AlertOctagon className="w-4 h-4 text-red-700 shrink-0" />
          <span>{bulkActionSuccess}</span>
        </div>
      )}

      {/* Top Status Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        <div className="bg-[#FFFFFF] border border-[#D4D1C7] p-4 rounded-sm shadow-xs border-l-4 border-l-slate-800">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs uppercase font-semibold tracking-wider">Total Enrolled Colleges</span>
            <Building2 className="w-4 h-4 text-slate-700" />
          </div>
          <div className="font-mono text-2xl font-bold text-slate-900">
            {instruments.length}
          </div>
          <div className="text-[11px] text-slate-600 mt-1">
            Academic Year 2027–28 Cycle
          </div>
        </div>

        <div className="bg-[#FFFFFF] border border-[#D4D1C7] p-4 rounded-sm shadow-xs border-l-4 border-l-red-600">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs uppercase font-semibold tracking-wider">EoA Certificates Frozen</span>
            <Lock className="w-4 h-4 text-red-600" />
          </div>
          <div className="font-mono text-2xl font-bold text-red-700">
            {frozenCount} <span className="text-sm font-normal text-slate-500 font-sans">/ {instruments.length}</span>
          </div>
          <div className="text-[11px] text-red-700 mt-1 font-semibold">
            Downloads Programmatically Blocked
          </div>
        </div>

        <div className="bg-[#FFFFFF] border border-[#D4D1C7] p-4 rounded-sm shadow-xs border-l-4 border-l-emerald-600">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs uppercase font-semibold tracking-wider">EoA Issued & Compliant</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="font-mono text-2xl font-bold text-emerald-700">
            {activeCount}
          </div>
          <div className="text-[11px] text-emerald-700 mt-1 font-semibold">
            Valid NIC Digital Seal
          </div>
        </div>

        <div className="bg-[#FFFFFF] border border-[#D4D1C7] p-4 rounded-sm shadow-xs border-l-4 border-l-amber-600">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs uppercase font-semibold tracking-wider">Active Regulatory Clock</span>
            <Calendar className="w-4 h-4 text-amber-700" />
          </div>
          <div className="font-mono text-xl font-bold text-slate-900">
            {simulatedDate}
          </div>
          <div className="text-[11px] text-slate-600 mt-1">
            Time-Travel Linked
          </div>
        </div>

      </div>

      {/* Statutory Regulation Rule Banner */}
      <div className="bg-amber-50 border-2 border-amber-300 rounded-sm p-4 text-xs text-amber-950 shadow-xs flex items-start gap-3">
        <FileWarning className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-sm text-amber-950 uppercase">
            MANDATORY APH 2026-27 CHAPTER 1, SECTION 1.5 REGULATORY ENFORCEMENT
          </span>
          <p className="mt-1 leading-relaxed text-slate-800">
            "No Technical Institution shall be granted Extension of Approval (EoA) or permitted to admit students if its mandatory Security Deposit FDR has matured without a continuous replacement lineage chain. The central portal autonomously freezes certificate generation upon maturity date passage."
          </p>
        </div>
      </div>

      {/* Main EoA Freezing Table */}
      <div className="bg-[#FFFFFF] border border-[#D4D1C7] rounded-sm shadow-xs overflow-hidden">
        <div className="p-4 bg-[#F8F7F4] border-b border-[#D4D1C7] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="font-bold text-sm text-slate-900">
              Institutional EoA Certificate Status Matrix (Academic Year 2027–28)
            </h3>
            <p className="text-xs text-slate-500">
              Autonomously evaluated against simulated system date {simulatedDate}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 bg-white p-0.5 rounded border border-[#D4D1C7] text-xs">
              <button
                onClick={() => setFreezeFilter('ALL')}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                  freezeFilter === 'ALL' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({instruments.length})
              </button>
              <button
                onClick={() => setFreezeFilter('FROZEN')}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                  freezeFilter === 'FROZEN' ? 'bg-red-700 text-white' : 'text-red-700 hover:bg-red-50'
                }`}
              >
                Frozen ({frozenCount})
              </button>
              <button
                onClick={() => setFreezeFilter('ACTIVE')}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                  freezeFilter === 'ACTIVE' ? 'bg-emerald-700 text-white' : 'text-emerald-700 hover:bg-emerald-50'
                }`}
              >
                Active ({activeCount})
              </button>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search college, region, FDR..."
                className="text-xs pl-8 pr-3 py-1 bg-white border border-[#D4D1C7] rounded text-slate-900 focus:outline-hidden w-48 sm:w-56"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse gov-table">
            <thead>
              <tr>
                <th>Institution & AICTE ID</th>
                <th>Linked FDR / Bank</th>
                <th>Maturity Status</th>
                <th>AY 2027-28 EoA Status</th>
                <th>Statutory Reason / Ground</th>
                <th className="text-right">Certificate & Override</th>
              </tr>
            </thead>
            <tbody>
              {filteredInstitutions.map((item) => (
                <tr key={item.id} className="transition-colors hover:bg-stone-50">
                  
                  {/* Institution */}
                  <td className="max-w-[220px]">
                    <div className="font-bold text-slate-900 text-xs truncate">
                      {item.institutionName}
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                      ID: {item.institutionId} • {item.region} Office
                    </div>
                  </td>

                  {/* FDR / Bank */}
                  <td>
                    <div className="font-mono text-xs font-bold text-slate-900">
                      {item.fdrNumber}
                    </div>
                    <div className="text-[11px] text-slate-600">
                      {item.bankName} ({formatInr(item.principalAmount)})
                    </div>
                  </td>

                  {/* Maturity Status */}
                  <td>
                    {item.daysLeft < 0 ? (
                      <span className="bg-red-100 text-red-900 px-1.5 py-0.5 rounded font-mono font-bold text-[10px] animate-pulse">
                        Lapsed by {Math.abs(item.daysLeft)}d
                      </span>
                    ) : item.daysLeft <= 30 ? (
                      <span className="bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-mono font-semibold text-[10px]">
                        {item.daysLeft}d left
                      </span>
                    ) : (
                      <span className="font-mono text-xs text-slate-700">
                        {formatGovDate(item.maturityDate)}
                      </span>
                    )}
                  </td>

                  {/* EoA Status */}
                  <td>
                    {item.liveEoaFrozen ? (
                      <span className="inline-flex items-center gap-1 bg-red-100 text-red-900 border border-red-300 px-2 py-0.5 rounded text-[11px] font-bold">
                        <Lock className="w-3 h-3 text-red-700" />
                        <span>FROZEN & WITHHELD</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-900 border border-emerald-300 px-2 py-0.5 rounded text-[11px] font-bold">
                        <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                        <span>ACTIVE & ISSUED</span>
                      </span>
                    )}
                  </td>

                  {/* Reason */}
                  <td className="max-w-[240px]">
                    <div className="text-xs text-slate-700 truncate" title={item.liveFreezeReason || 'All norms satisfied'}>
                      {item.liveFreezeReason ? (
                        <span className="text-red-800 font-medium">{item.liveFreezeReason}</span>
                      ) : (
                        <span className="text-emerald-800 font-medium">Valid continuous deposit lineage; compliant under APH 1.4</span>
                      )}
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                      Ref: {item.eoaStatus.certificateNumber}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      
                      {/* View Certificate */}
                      <button
                        onClick={() => setSelectedInstForCertificate(item)}
                        className={`px-2.5 py-1 text-xs rounded font-medium flex items-center gap-1 border transition-colors ${
                          item.liveEoaFrozen
                            ? 'bg-red-50 text-red-800 border-red-300 hover:bg-red-100'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                        }`}
                      >
                        <FileCheck className="w-3.5 h-3.5" />
                        <span>{item.liveEoaFrozen ? 'Inspect Frozen Stamp' : 'View Certificate'}</span>
                      </button>

                      {/* Bureau Head Override Button */}
                      <button
                        onClick={() => handleToggleFreeze(item)}
                        className="p-1.5 bg-stone-100 hover:bg-stone-200 border border-[#D4D1C7] rounded text-slate-700 transition-colors"
                        title={item.liveEoaFrozen ? 'Administrative Override: Unfreeze EoA' : 'Administrative Override: Impose EoA Freeze'}
                      >
                        {item.liveEoaFrozen ? (
                          <Unlock className="w-3.5 h-3.5 text-emerald-700" />
                        ) : (
                          <Lock className="w-3.5 h-3.5 text-red-700" />
                        )}
                      </button>

                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Official AICTE EoA Certificate Viewer Modal */}
      {selectedInstForCertificate && (
        <EoaCertificateModal
          instrument={selectedInstForCertificate}
          onClose={() => setSelectedInstForCertificate(null)}
        />
      )}

    </div>
  );
};

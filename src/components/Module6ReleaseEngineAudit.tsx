import React, { useState, useMemo, useEffect, useRef } from 'react';
import { FDRInstrument, AuditBlock, UserRole, DeficiencyNoticePayload, EscalationDispatchLog } from '../types';
import { formatInr, formatGovDate } from '../utils/formatters';
import { 
  buildDeficiencyPayload, 
  getInitialDeficiencyNotices, 
  createEscalationLogFromDeficiency, 
  getNodalOfficerContact 
} from '../services/deficiencyNotificationService';
import { DeficiencyEmailModal } from './DeficiencyEmailModal';
import { 
  ShieldCheck, 
  FileCheck, 
  QrCode, 
  CheckCircle2, 
  XCircle, 
  Lock, 
  Printer, 
  Download, 
  Award, 
  FileText, 
  Key, 
  X, 
  ExternalLink,
  Shield,
  Stamp,
  UserCheck,
  Search,
  Filter,
  Building2,
  Clock,
  AlertTriangle,
  Loader2,
  Check,
  ChevronRight,
  ArrowRight,
  Mail,
  Send,
  AlertOctagon
} from 'lucide-react';

interface Module6ReleaseEngineAuditProps {
  currentInstrument: FDRInstrument;
  auditBlocks: AuditBlock[];
  onSanctionGate5: (fdrId: string) => void;
  onVerifyChainIntegrity: () => boolean;
  chainVerifiedStatus: boolean | null;
  currentRole?: UserRole;
  allInstruments?: FDRInstrument[];
  onSelectInstrument?: (instrument: FDRInstrument) => void;
  simulatedDate?: string;
  onLogDeficiencyNotice?: (log: EscalationDispatchLog) => void;
}

interface GateStatusInfo {
  label: string;
  pillBg: string;
  pillText: string;
  pillBorder: string;
  isReadyForSanction: boolean;
  isSanctioned: boolean;
  isDeficient: boolean;
  tag: string;
  failedGateNames: string[];
}

export const Module6ReleaseEngineAudit: React.FC<Module6ReleaseEngineAuditProps> = ({
  currentInstrument,
  auditBlocks,
  onSanctionGate5,
  onVerifyChainIntegrity,
  chainVerifiedStatus,
  currentRole = 'bureau',
  allInstruments,
  onSelectInstrument,
  simulatedDate = '2026-10-26',
  onLogDeficiencyNotice,
}) => {
  const [selectedId, setSelectedId] = useState<string>(currentInstrument?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'DEFICIENT' | 'SANCTIONED'>('ALL');
  const [isSigning, setIsSigning] = useState(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Automated Deficiency Notification Engine State
  const [deficiencyNotices, setDeficiencyNotices] = useState<Record<string, DeficiencyNoticePayload>>(() =>
    getInitialDeficiencyNotices(allInstruments || [currentInstrument], simulatedDate)
  );
  const [selectedNoticeForModal, setSelectedNoticeForModal] = useState<DeficiencyNoticePayload | null>(null);
  const [isResendingEmail, setIsResendingEmail] = useState(false);
  const [emailDispatchToast, setEmailDispatchToast] = useState<string | null>(null);

  const [showDischargeModal, setShowDischargeModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'FIVE_GATES' | 'AUDIT_LEDGER'>('FIVE_GATES');
  const [isVerifyingChain, setIsVerifyingChain] = useState(false);
  const [chainVerificationResult, setChainVerificationResult] = useState<string | null>(null);

  const isBureauHead = currentRole === 'bureau' || currentRole === 'BUREAU_HEAD';
  const inspectionDeskRef = useRef<HTMLDivElement>(null);

  // Synchronize selectedId if parent passes a different currentInstrument
  useEffect(() => {
    if (currentInstrument?.id && (!selectedId || !allInstruments?.some(i => i.id === selectedId))) {
      setSelectedId(currentInstrument.id);
    }
  }, [currentInstrument?.id, allInstruments]);

  // Determine the active instrument under scrutiny
  const inspectedInstrument: FDRInstrument = useMemo(() => {
    if (!allInstruments || allInstruments.length === 0) return currentInstrument;
    const found = allInstruments.find((i) => i.id === selectedId);
    return found || currentInstrument || allInstruments[0];
  }, [allInstruments, selectedId, currentInstrument]);

  const gates = inspectedInstrument.fiveGates;

  // Helper to compute gate status badge details
  const getGateStatusInfo = (inst: FDRInstrument): GateStatusInfo => {
    const g = inst.fiveGates;
    if (g.gate5BureauSanction) {
      return {
        label: 'Gate 5 Sanctioned - Release Cleared',
        pillBg: 'bg-emerald-100',
        pillText: 'text-emerald-900',
        pillBorder: 'border-emerald-300',
        isReadyForSanction: false,
        isSanctioned: true,
        isDeficient: false,
        tag: 'SANCTIONED',
        failedGateNames: []
      };
    }
    if (g.gate1TenureCompleted && g.gate2BankCbsClear && g.gate3ZeroEvcDeficiency && g.gate4ZeroLegalHold) {
      return {
        label: 'All Gates Passed - Pending Bureau Sanction',
        pillBg: 'bg-amber-100',
        pillText: 'text-amber-950 font-bold',
        pillBorder: 'border-amber-400',
        isReadyForSanction: true,
        isSanctioned: false,
        isDeficient: false,
        tag: 'READY FOR SANCTION',
        failedGateNames: []
      };
    }
    const failed: string[] = [];
    if (!g.gate1TenureCompleted) failed.push('Gate 1 (Lock-in)');
    if (!g.gate2BankCbsClear) failed.push('Gate 2 (CBS Lien)');
    if (!g.gate3ZeroEvcDeficiency) failed.push('Gate 3 (EVC)');
    if (!g.gate4ZeroLegalHold) failed.push('Gate 4 (Legal)');

    if (failed.length === 1) {
      return {
        label: `${failed[0]} Failed`,
        pillBg: 'bg-red-50',
        pillText: 'text-red-900',
        pillBorder: 'border-red-300',
        isReadyForSanction: false,
        isSanctioned: false,
        isDeficient: true,
        tag: 'DEFICIENT',
        failedGateNames: failed
      };
    }
    return {
      label: `${failed.slice(0, 2).join(' & ')} Failed - Disqualified`,
      pillBg: 'bg-red-50',
      pillText: 'text-red-900',
      pillBorder: 'border-red-300',
      isReadyForSanction: false,
      isSanctioned: false,
      isDeficient: true,
      tag: 'DISQUALIFIED',
      failedGateNames: failed
    };
  };

  // Filter registry petitions for the Bureau Head
  const candidateInstruments = useMemo(() => {
    if (!allInstruments) return [];
    // Prioritize release petitions, overdue, discrepancy flagged, and approaching maturity
    return allInstruments;
  }, [allInstruments]);

  const filteredRegistryList = useMemo(() => {
    return candidateInstruments.filter((inst) => {
      const info = getGateStatusInfo(inst);
      
      // Filter by status tab
      if (statusFilter === 'PENDING' && !info.isReadyForSanction) return false;
      if (statusFilter === 'SANCTIONED' && !info.isSanctioned) return false;
      if (statusFilter === 'DEFICIENT' && !info.isDeficient) return false;

      // Filter by search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = inst.institutionName.toLowerCase().includes(q);
        const matchId = inst.institutionId.toLowerCase().includes(q);
        const matchFdr = inst.fdrNumber.toLowerCase().includes(q);
        const matchRegion = inst.region.toLowerCase().includes(q);
        const matchBank = inst.bankName.toLowerCase().includes(q);
        const matchStatus = info.label.toLowerCase().includes(q);
        return matchName || matchId || matchFdr || matchRegion || matchBank || matchStatus;
      }
      return true;
    });
  }, [candidateInstruments, statusFilter, searchQuery]);

  const registryStats = useMemo(() => {
    let pending = 0;
    let deficient = 0;
    let sanctioned = 0;
    candidateInstruments.forEach((inst) => {
      const info = getGateStatusInfo(inst);
      if (info.isReadyForSanction) pending++;
      else if (info.isSanctioned) sanctioned++;
      else if (info.isDeficient) deficient++;
    });
    return { total: candidateInstruments.length, pending, deficient, sanctioned };
  }, [candidateInstruments]);

  const handleSelectInstitution = (inst: FDRInstrument) => {
    setSelectedId(inst.id);
    setActiveTab('FIVE_GATES');
    if (onSelectInstrument) {
      onSelectInstrument(inst);
    }

    // Automated Deficiency Notification Trigger:
    // If the selected institution has failed prerequisite gates, ensure deficiency memo is logged and show confirmation toast
    const statusInfo = getGateStatusInfo(inst);
    if (statusInfo.isDeficient) {
      let notice = deficiencyNotices[inst.id];
      if (!notice) {
        notice = buildDeficiencyPayload(inst, simulatedDate);
        setDeficiencyNotices((prev) => ({ ...prev, [inst.id]: notice }));
        if (onLogDeficiencyNotice) {
          onLogDeficiencyNotice(createEscalationLogFromDeficiency(notice));
        }
      }
      setEmailDispatchToast(
        `✉️ Automated Statutory Deficiency Memo Dispatched to ${notice.nodalOfficerEmail} (Ref: ${notice.memoReferenceNumber} • 15-Day Window Active)`
      );
      setTimeout(() => setEmailDispatchToast(null), 6000);
    }

    // Auto-scroll viewport down to 5-Gate Compliance Inspection and Digital Sanction Desk
    setTimeout(() => {
      inspectionDeskRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  };

  const handleResendNotice = (targetNotice: DeficiencyNoticePayload) => {
    setIsResendingEmail(true);
    setTimeout(() => {
      const refreshed: DeficiencyNoticePayload = {
        ...targetNotice,
        dispatchedAt: `${simulatedDate} ${new Date().toLocaleTimeString('en-IN')} IST`,
        deliveryStatus: 'DELIVERED',
      };
      setDeficiencyNotices((prev) => ({ ...prev, [targetNotice.fdrId]: refreshed }));
      if (onLogDeficiencyNotice) {
        onLogDeficiencyNotice(createEscalationLogFromDeficiency(refreshed));
      }
      setIsResendingEmail(false);
      setEmailDispatchToast(
        `✓ Statutory Compliance Alert re-dispatched to ${refreshed.nodalOfficerEmail} [SMTP 250 OK: Delivered via NIC Mail Host]`
      );
      setTimeout(() => setEmailDispatchToast(null), 6000);
    }, 700);
  };

  const handleAuthorizeSanction = () => {
    setIsSigning(true);
    setTimeout(() => {
      onSanctionGate5(inspectedInstrument.id);
      setIsSigning(false);
      setSuccessNotice(`✓ Regulation Bureau Sanction Accorded for ${inspectedInstrument.institutionName}. FDR #${inspectedInstrument.fdrNumber} cleared for discharge. QR Release Order unlocked.`);
      setTimeout(() => setSuccessNotice(null), 6000);
    }, 800);
  };

  const handleVerifyChain = () => {
    setIsVerifyingChain(true);
    setTimeout(() => {
      const ok = onVerifyChainIntegrity();
      setIsVerifyingChain(false);
      setChainVerificationResult(
        ok
          ? '✓ Cryptographic Ledger Chain Integrity Verified: Zero Tampering Detected across all blocks.'
          : '⚠️ Integrity Error detected.'
      );
      setTimeout(() => setChainVerificationResult(null), 5000);
    }, 600);
  };

  const handleExportCsv = () => {
    const headers = ['Block Index', 'Timestamp', 'User Role', 'User ID', 'IP Address', 'Action', 'Previous Hash', 'Current Hash'];
    const rows = auditBlocks.map((b) => [
      b.blockIndex,
      b.timestamp,
      b.userRole,
      b.userIdentifier,
      b.ipAddress,
      `"${b.action}"`,
      b.previousHash,
      b.currentHash,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `AICTE_KOSH_Audit_Ledger_${inspectedInstrument.institutionId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const activeGateInfo = getGateStatusInfo(inspectedInstrument);

  // Active deficiency notice for current inspected instrument (computed if deficient)
  const activeDeficiencyNotice: DeficiencyNoticePayload | null = useMemo(() => {
    if (!activeGateInfo.isDeficient) return null;
    return (
      deficiencyNotices[inspectedInstrument.id] ||
      buildDeficiencyPayload(inspectedInstrument, simulatedDate)
    );
  }, [activeGateInfo.isDeficient, deficiencyNotices, inspectedInstrument, simulatedDate]);

  return (
    <div className="space-y-6">
      
      {/* ======================================================== */}
      {/* SECTION 1: BUREAU HEAD MASTER APPROVAL REGISTRY           */}
      {/* (Only rendered when logged in as Bureau Head / Super Admin) */}
      {/* ======================================================== */}
      {isBureauHead && (
        <div className="bg-[#FFFFFF] border border-[#D4D1C7] rounded-sm shadow-sm overflow-hidden">
          
          {/* Header Banner with GovTech Styling */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Stamp className="w-5 h-5 text-amber-400" />
                  <h2 className="text-sm md:text-base font-bold font-sans tracking-wide">
                    Bureau Head Master Approval Registry (Incoming College Requests)
                  </h2>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  Centralized clearance queue for Technical Institution Security Deposits, 8-Year Lock-in Refunds & Gate 5 Sanctions (APH 2026-27 Rule 14.2)
                </p>
              </div>

              {/* KPI Badge Strip */}
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className="px-2.5 py-1 bg-slate-800 rounded border border-slate-700 text-slate-300 font-mono">
                  Total Petitions: <strong className="text-white font-bold">{registryStats.total}</strong>
                </span>
                <span className="px-2.5 py-1 bg-amber-950/80 rounded border border-amber-500/60 text-amber-300 font-mono flex items-center gap-1.5 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  Pending Sanction: <strong className="text-white font-bold">{registryStats.pending}</strong>
                </span>
                <span className="px-2.5 py-1 bg-emerald-950/80 rounded border border-emerald-500/60 text-emerald-300 font-mono">
                  Sanctioned: <strong className="text-white font-bold">{registryStats.sanctioned}</strong>
                </span>
                <span className="px-2.5 py-1 bg-red-950/80 rounded border border-red-500/60 text-red-300 font-mono">
                  Deficient: <strong className="text-white font-bold">{registryStats.deficient}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Filter & Search Controls */}
          <div className="p-4 bg-stone-50 border-b border-[#D4D1C7] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by College Name, AICTE ID, FDR Number, Region, or Status..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-[#D4D1C7] rounded focus:outline-none focus:border-slate-800 font-sans"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => setStatusFilter('ALL')}
                className={`px-3 py-1.5 text-xs font-semibold rounded border transition-colors ${
                  statusFilter === 'ALL'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 hover:bg-stone-100 border-[#D4D1C7]'
                }`}
              >
                All Requests ({registryStats.total})
              </button>
              <button
                onClick={() => setStatusFilter('PENDING')}
                className={`px-3 py-1.5 text-xs font-semibold rounded border transition-colors flex items-center gap-1.5 ${
                  statusFilter === 'PENDING'
                    ? 'bg-amber-800 text-white border-amber-800'
                    : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border-amber-300'
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span>Pending Bureau Sanction ({registryStats.pending})</span>
              </button>
              <button
                onClick={() => setStatusFilter('DEFICIENT')}
                className={`px-3 py-1.5 text-xs font-semibold rounded border transition-colors flex items-center gap-1.5 ${
                  statusFilter === 'DEFICIENT'
                    ? 'bg-red-800 text-white border-red-800'
                    : 'bg-red-50 text-red-900 hover:bg-red-100 border-red-300'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                <span>Deficient / Disqualified ({registryStats.deficient})</span>
              </button>
              <button
                onClick={() => setStatusFilter('SANCTIONED')}
                className={`px-3 py-1.5 text-xs font-semibold rounded border transition-colors flex items-center gap-1.5 ${
                  statusFilter === 'SANCTIONED'
                    ? 'bg-emerald-800 text-white border-emerald-800'
                    : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border-emerald-300'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Sanctioned & Cleared ({registryStats.sanctioned})</span>
              </button>
            </div>
          </div>

          {/* Master Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse gov-table">
              <thead>
                <tr>
                  <th className="w-10 text-center">#</th>
                  <th>Institution Name & AICTE Permanent ID</th>
                  <th>Region</th>
                  <th>Target FDR & Amount</th>
                  <th>Current 5-Gate Compliance Status</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredRegistryList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-xs text-slate-500">
                      No institution requests match the selected search or filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredRegistryList.map((inst, idx) => {
                    const statusInfo = getGateStatusInfo(inst);
                    const isSelected = inst.id === inspectedInstrument.id;

                    return (
                      <tr 
                        key={inst.id}
                        onClick={() => handleSelectInstitution(inst)}
                        className={`cursor-pointer transition-colors ${
                          isSelected 
                            ? 'bg-amber-50/80 border-l-4 border-l-amber-600' 
                            : 'hover:bg-stone-50'
                        }`}
                      >
                        <td className="text-center font-mono text-xs text-slate-500">
                          {idx + 1}
                        </td>
                        
                        {/* Institution Name & ID */}
                        <td className="py-2.5">
                          <div className="flex items-start gap-2">
                            <Building2 className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? 'text-amber-700' : 'text-slate-400'}`} />
                            <div>
                              <div className="font-bold text-xs text-slate-900 leading-tight">
                                {inst.institutionName}
                              </div>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="font-mono text-[10px] text-slate-500 bg-stone-100 px-1.5 py-0.2 rounded border border-stone-200">
                                  ID: {inst.institutionId}
                                </span>
                                <span className="text-[10px] text-slate-400 font-sans">
                                  {inst.approvedPrograms[0]?.programName || 'Technical Program'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Region */}
                        <td>
                          <span className="font-mono text-xs px-2 py-0.5 rounded font-bold bg-slate-100 text-slate-800 border border-slate-200 whitespace-nowrap">
                            {inst.region}
                          </span>
                          <div className="text-[10px] text-slate-500 mt-0.5">{inst.branchName}</div>
                        </td>

                        {/* Target FDR & Amount */}
                        <td>
                          <div className="font-mono text-xs font-bold text-slate-900">
                            {inst.fdrNumber}
                          </div>
                          <div className="rupee-mono text-xs font-semibold text-emerald-800">
                            {formatInr(inst.principalAmount)}
                          </div>
                          <div className="text-[10px] text-slate-500 truncate max-w-[140px]" title={inst.bankName}>
                            {inst.bankName}
                          </div>
                        </td>

                        {/* Current 5-Gate Compliance Status */}
                        <td>
                          <div className="flex items-center gap-2">
                            <span className={`text-[11px] font-sans font-bold px-2 py-1 rounded border inline-flex items-center gap-1.5 ${statusInfo.pillBg} ${statusInfo.pillText} ${statusInfo.pillBorder}`}>
                              {statusInfo.isReadyForSanction && (
                                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                              )}
                              {statusInfo.isSanctioned && (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                              )}
                              {statusInfo.isDeficient && (
                                <XCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                              )}
                              <span>{statusInfo.label}</span>
                            </span>
                          </div>
                          {inst.fiveGates.blockReason && !statusInfo.isSanctioned && (
                            <div className="text-[10px] text-slate-500 mt-0.5 truncate max-w-[280px]" title={inst.fiveGates.blockReason}>
                              {inst.fiveGates.blockReason}
                            </div>
                          )}
                          {statusInfo.isDeficient && (
                            <div className="mt-1 flex items-center gap-1.5">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const notice = deficiencyNotices[inst.id] || buildDeficiencyPayload(inst, simulatedDate);
                                  setSelectedNoticeForModal(notice);
                                }}
                                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 hover:border-amber-400 transition-colors shadow-2xs"
                                title="Click to view dispatched official statutory deficiency memo"
                              >
                                <Mail className="w-3 h-3 text-amber-700 shrink-0" />
                                <span>Deficiency Memo Sent (T-15d)</span>
                              </button>
                            </div>
                          )}
                        </td>

                        {/* Row Action */}
                        <td className="text-right whitespace-nowrap">
                          {statusInfo.isReadyForSanction ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectInstitution(inst);
                              }}
                              className="px-3 py-1 bg-amber-700 hover:bg-amber-800 text-white rounded text-xs font-bold shadow-xs flex items-center gap-1.5 ml-auto transition-colors"
                            >
                              <Stamp className="w-3.5 h-3.5" />
                              <span>Inspect & Sanction Gate 5</span>
                            </button>
                          ) : isSelected ? (
                            <span className="px-2.5 py-1 bg-stone-200 text-slate-800 rounded text-xs font-bold font-mono inline-flex items-center gap-1">
                              <Check className="w-3.5 h-3.5 text-emerald-700" />
                              <span>Inspecting 5 Gates</span>
                            </span>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectInstitution(inst);
                              }}
                              className="px-2.5 py-1 bg-white hover:bg-stone-100 text-slate-700 border border-[#D4D1C7] rounded text-xs font-medium inline-flex items-center gap-1 transition-colors"
                            >
                              <span>Inspect 5-Gate Audit</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Bottom helper tip */}
          <div className="p-2.5 bg-stone-100 border-t border-[#D4D1C7] text-[11px] text-slate-600 font-mono flex items-center justify-between">
            <span>💡 Evaluator Tip: Click any row above to inspect the institution's complete 5-gate audit trail and grant digital Gate 5 sanction.</span>
            <span>Showing {filteredRegistryList.length} of {candidateInstruments.length} Institutional Petitions</span>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 2: 5-GATE STATUTORY SCRUTINY AUDIT & SANCTION    */}
      {/* ======================================================== */}
      
      {/* Top Header Card */}
      <div ref={inspectionDeskRef} className="bg-[#FFFFFF] border border-[#D4D1C7] p-4 rounded-sm shadow-xs scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#14532D]" />
              <h2 className="text-base font-bold text-slate-900">
                5-Gate Statutory Scrutiny Engine & Bank Discharge Authority
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Rigorous 5-tier statutory checklist evaluation, tamper-evident cryptographic chain, and bank discharge letters
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('FIVE_GATES')}
              className={`px-3 py-1.5 text-xs font-semibold rounded border transition-colors ${
                activeTab === 'FIVE_GATES'
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-stone-100 text-slate-700 hover:bg-stone-200 border-[#D4D1C7]'
              }`}
            >
              5-Gate Statutory Audit Desk
            </button>
            <button
              onClick={() => setActiveTab('AUDIT_LEDGER')}
              className={`px-3 py-1.5 text-xs font-semibold rounded border transition-colors ${
                activeTab === 'AUDIT_LEDGER'
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-stone-100 text-slate-700 hover:bg-stone-200 border-[#D4D1C7]'
              }`}
            >
              Tamper-Evident SHA-256 Ledger ({auditBlocks.length})
            </button>
          </div>
        </div>
      </div>

      {/* Real-time Confirmation Notice */}
      {successNotice && (
        <div className="p-3 bg-emerald-50 border-2 border-emerald-500 rounded text-xs text-emerald-950 font-semibold flex items-center justify-between gap-2 shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
            <span>{successNotice}</span>
          </div>
          <button
            onClick={() => setSuccessNotice(null)}
            className="text-emerald-700 hover:text-emerald-900 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Real-time Automated Email Dispatch Confirmation Notice */}
      {emailDispatchToast && (
        <div className="p-3 bg-amber-50 border-2 border-amber-500 rounded text-xs text-amber-950 font-semibold flex items-center justify-between gap-2 shadow-xs animate-fade-in">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-amber-700 shrink-0 animate-bounce" />
            <span>{emailDispatchToast}</span>
          </div>
          <button
            onClick={() => setEmailDispatchToast(null)}
            className="text-amber-700 hover:text-amber-900 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* TAB 1: 5-Gate Release Engine */}
      {activeTab === 'FIVE_GATES' && (
        <div className="space-y-6">
          
          {/* Target Institution Banner */}
          <div className="p-3 bg-slate-900 text-white rounded-sm border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-slate-400 uppercase">Inspecting Target Institution:</span>
              <strong className="text-white text-sm font-bold">{inspectedInstrument.institutionName}</strong>
              <span className="font-mono bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                AICTE ID: {inspectedInstrument.institutionId}
              </span>
            </div>
            <div className="flex items-center gap-3 font-mono">
              <span>FDR: <strong className="text-amber-300">#{inspectedInstrument.fdrNumber}</strong></span>
              <span>Amount: <strong className="text-emerald-400">{formatInr(inspectedInstrument.principalAmount)}</strong></span>
              <span>Region: <strong className="text-white">{inspectedInstrument.region}</strong></span>
            </div>
          </div>

          {/* Overall 5-Gate Status Banner */}
          <div className={`p-4 rounded-sm border ${
            gates.overallEligible
              ? 'bg-emerald-50 border-emerald-400 text-emerald-950 shadow-xs'
              : activeGateInfo.isReadyForSanction
              ? 'bg-amber-50 border-amber-400 text-amber-950 shadow-xs'
              : 'bg-red-50 border-red-300 text-red-950'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                {gates.overallEligible ? (
                  <CheckCircle2 className="w-7 h-7 text-emerald-700 shrink-0" />
                ) : activeGateInfo.isReadyForSanction ? (
                  <Stamp className="w-7 h-7 text-amber-700 shrink-0 animate-bounce" />
                ) : (
                  <XCircle className="w-7 h-7 text-red-700 shrink-0" />
                )}
                <div>
                  <h3 className="font-bold text-sm">
                    {gates.overallEligible
                      ? 'ALL 5 REGULATORY GATES PASSED: Instrument Eligible for Final Discharge'
                      : activeGateInfo.isReadyForSanction
                      ? '4 OF 5 STATUTORY GATES SATISFIED: Awaiting Gate 5 Regulation Bureau Head Sanction'
                      : 'RELEASE BLOCKED: Mandatory Statutory Gates Not Satisfied'}
                  </h3>
                  <div className="text-xs opacity-90 mt-0.5">
                    {gates.overallEligible
                      ? `Sanction File: ${gates.dischargeOrderNumber || 'F.No. AICTE/RB/DISCHARGE/2026/0912'} digitally signed. Official Bank Discharge Order unlocked.`
                      : activeGateInfo.isReadyForSanction
                      ? 'Lock-in tenure, CBS lien, EVC compliance, and vigilance checks are cleared. Ready for Bureau Head digital sign-off.'
                      : `Block Reason: ${gates.blockReason}`}
                  </div>
                </div>
              </div>

              {gates.overallEligible && (
                <button
                  onClick={() => setShowDischargeModal(true)}
                  className="px-4 py-2.5 text-xs font-bold rounded bg-emerald-800 hover:bg-emerald-900 text-white shadow flex items-center gap-2 whitespace-nowrap border border-emerald-600 transition-colors"
                >
                  <QrCode className="w-4 h-4 text-emerald-300" />
                  <span>Generate Official QR Release Order</span>
                </button>
              )}
            </div>
          </div>

          {/* ======================================================== */}
          {/* AUTOMATED STATUTORY DEFICIENCY EMAIL & ALERT DOSSIER     */}
          {/* ======================================================== */}
          {activeGateInfo.isDeficient && activeDeficiencyNotice && (
            <div className="bg-[#FFFDFB] border-2 border-red-500 rounded-sm p-4.5 shadow-xs space-y-3.5 animate-fade-in">
              
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-b border-red-200 pb-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded bg-red-100 border border-red-300 flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="w-5 h-5 text-red-700" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-mono font-bold bg-red-700 text-white px-2 py-0.5 rounded uppercase">
                        STATUTORY DEFICIENCY MEMO DISPATCHED
                      </span>
                      <span className="text-[10px] font-mono font-semibold text-red-900 bg-red-100 px-2 py-0.5 rounded border border-red-200">
                        15-DAY RECTIFICATION WINDOW ACTIVE
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 mt-1">
                      Automated Compliance Intimation Dispatched to Institutional Nodal Officer
                    </h3>
                    <p className="text-xs text-slate-600">
                      Pursuant to APH 2026-27 Chapter 1 Section 1.5, an official legal deficiency memo has been queued and delivered to the college official domain.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => setSelectedNoticeForModal(activeDeficiencyNotice)}
                    className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded flex items-center gap-2 shadow-xs transition-colors shrink-0"
                  >
                    <FileText className="w-4 h-4 text-amber-300" />
                    <span>View Dispatched Official Memo Payload</span>
                  </button>
                  <button
                    onClick={() => handleResendNotice(activeDeficiencyNotice)}
                    disabled={isResendingEmail}
                    className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold rounded flex items-center gap-1.5 transition-colors shrink-0"
                  >
                    {isResendingEmail ? (
                      <Loader2 className="w-4 h-4 animate-spin text-amber-700" />
                    ) : (
                      <Send className="w-3.5 h-3.5 text-amber-700" />
                    )}
                    <span>Re-send Warning</span>
                  </button>
                </div>
              </div>

              {/* Dossier Summary Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-2.5 bg-white rounded border border-red-200">
                  <div className="text-[10px] text-slate-500 uppercase">Registered Nodal Officer:</div>
                  <div className="font-bold text-slate-900 truncate" title={activeDeficiencyNotice.nodalOfficerEmail}>
                    {activeDeficiencyNotice.nodalOfficerEmail}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">{activeDeficiencyNotice.nodalOfficerName}</div>
                </div>

                <div className="p-2.5 bg-white rounded border border-red-200">
                  <div className="text-[10px] text-slate-500 uppercase">AICTE Memo Reference:</div>
                  <div className="font-bold text-slate-900 truncate" title={activeDeficiencyNotice.memoReferenceNumber}>
                    {activeDeficiencyNotice.memoReferenceNumber}
                  </div>
                  <div className="text-[10px] text-emerald-700 font-semibold">✓ SMTP 250 OK (Delivered)</div>
                </div>

                <div className="p-2.5 bg-white rounded border border-red-200">
                  <div className="text-[10px] text-slate-500 uppercase">Statutory Deadline:</div>
                  <div className="font-bold text-red-700">{activeDeficiencyNotice.rectificationDeadline}</div>
                  <div className="text-[10px] text-slate-500">15 Calendar Days Window</div>
                </div>

                <div className="p-2.5 bg-white rounded border border-red-200">
                  <div className="text-[10px] text-slate-500 uppercase">Enforcement Action:</div>
                  <div className="font-bold text-red-800">EoA 2027-28 Portal Locked</div>
                  <div className="text-[10px] text-red-600">Discharge Sanction Blocked</div>
                </div>
              </div>

              {/* Itemized Defect Breakdown */}
              <div className="p-3 bg-red-50/70 rounded border border-red-200 text-xs">
                <div className="font-bold text-red-950 mb-1.5 flex items-center gap-1.5">
                  <AlertOctagon className="w-3.5 h-3.5 text-red-700" />
                  <span>Itemized Non-Compliance Discrepancies Cited in Email:</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-slate-800 font-sans">
                  {activeDeficiencyNotice.failureReasons.map((reason, idx) => (
                    <li key={idx}>
                      <strong className="text-slate-900 font-mono text-[11px]">{activeDeficiencyNotice.failedGates[idx]}:</strong> {reason}
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* MANUAL BUREAU SANCTION REVIEW BOX                         */}
          {/* ======================================================== */}
          {isBureauHead && (
            <div className="border-2 border-emerald-800 bg-[#FAFCFA] rounded-sm p-5 shadow-xs space-y-4">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-3">
                <div className="flex items-center gap-2">
                  <Stamp className="w-5 h-5 text-emerald-800" />
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 font-sans">
                      Regulation Bureau Competent Authority Digital Sanction Desk
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Official statutory clearance under AICTE Approval Process Handbook (APH 2026-27 Rule 14.2 & Chapter 1 Section 1.6)
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300 uppercase">
                    NIC Parichay DSC Gate 5
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5 p-3 bg-white rounded border border-[#D4D1C7]">
                  <div className="font-bold text-slate-900 uppercase tracking-wider text-[10px] text-slate-500">
                    Sanctioning Executive Node
                  </div>
                  <div className="font-bold text-slate-900">Prof. Rajendra Prasad</div>
                  <div className="text-slate-600">Advisor & Regulation Bureau Head, AICTE HQ New Delhi</div>
                  <div className="text-[11px] font-mono text-emerald-800">
                    Digital Signing Key: NIC-DSC-AICTE-RB-77192 (Aadhaar e-Sign Class-3)
                  </div>
                </div>

                <div className="space-y-1.5 p-3 bg-white rounded border border-[#D4D1C7]">
                  <div className="font-bold text-slate-900 uppercase tracking-wider text-[10px] text-slate-500">
                    Statutory Prerequisite Clearance Summary
                  </div>
                  {activeGateInfo.isReadyForSanction || gates.overallEligible ? (
                    <div className="text-emerald-800 font-semibold space-y-0.5">
                      <div className="flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Lock-in Tenure: 8 full years elapsed</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Bank CBS: Unencumbered, nil overdrafts verified</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>EVC Scrutiny & Vigilance: Zero deficiencies or holds</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-red-700 font-semibold space-y-0.5">
                      <div className="flex items-center gap-1">
                        <X className="w-3.5 h-3.5 text-red-600 shrink-0" />
                        <span>Prerequisite Gates Incomplete ({gates.blockReason})</span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-normal">
                        Bureau sanction cannot be accorded until all preliminary statutory conditions are satisfied.
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Sanction Actions */}
              <div className="pt-2 border-t border-stone-200">
                {activeGateInfo.isReadyForSanction ? (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-amber-50/80 p-3 rounded border border-amber-300">
                    <div className="text-xs text-amber-950">
                      <strong>Executive Action Required:</strong> All 4 technical gates are verified. Click below to apply your official Class-3 digital signature and authorize unconditional discharge.
                    </div>
                    <button
                      onClick={handleAuthorizeSanction}
                      disabled={isSigning}
                      className="px-5 py-2.5 bg-[#14532D] hover:bg-[#0F3D21] text-white font-bold text-xs rounded shadow flex items-center justify-center gap-2 border border-emerald-600 transition-all shrink-0 active:scale-95"
                    >
                      {isSigning ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-emerald-300" />
                          <span>Applying Class-3 Digital Signature (NIC-DSC)...</span>
                        </>
                      ) : (
                        <>
                          <Stamp className="w-4 h-4 text-emerald-300" />
                          <span>Authorize & Digitally Sign Bureau Sanction</span>
                        </>
                      )}
                    </button>
                  </div>
                ) : gates.gate5BureauSanction ? (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-emerald-50 p-3 rounded border border-emerald-300">
                    <div className="flex items-center gap-2 text-xs text-emerald-950">
                      <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                      <div>
                        <strong>Bureau Sanction Accorded:</strong> Digitally authorized under Sanction File{' '}
                        <span className="font-mono font-bold">{gates.dischargeOrderNumber}</span>.
                      </div>
                    </div>
                    <button
                      onClick={() => setShowDischargeModal(true)}
                      className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded flex items-center gap-2 shadow shrink-0"
                    >
                      <QrCode className="w-4 h-4 text-emerald-300" />
                      <span>View & Print Official QR Release Order</span>
                    </button>
                  </div>
                ) : (
                  <div className="p-3 bg-stone-100 rounded border border-stone-300 flex items-center justify-between gap-2 text-xs text-slate-700">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-slate-500 shrink-0" />
                      <span>
                        <strong>Sanction Blocked:</strong> Prerequisite statutory gates (Gates 1-4) must be satisfied before Bureau Sanction can be accorded.
                      </span>
                    </div>
                    <span className="font-mono text-[10px] font-bold text-red-700 uppercase px-2 py-0.5 bg-red-100 rounded border border-red-200">
                      Rule 14.2 Sanction Locked
                    </span>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* The 5 Gates Detailed Cards */}
          <div className="space-y-3">
            
            {/* Gate 1 */}
            <div className="bg-[#FFFFFF] border border-[#D4D1C7] p-4 rounded-sm shadow-xs flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                  gates.gate1TenureCompleted ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-red-100 text-red-800 border border-red-300'
                }`}>
                  1
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900">
                    Gate 1: Mandatory Lock-in Tenure Completion (8 Years Elapsed)
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5">
                    Statutory Rule: APH 2026-27 Section 1.6(a) mandates uninterrupted 8-year lock-in from initial approval.
                  </div>
                  <div className={`text-[11px] font-mono mt-1 font-semibold ${gates.gate1TenureCompleted ? 'text-emerald-700' : 'text-red-700'}`}>
                    {gates.gate1Details}
                  </div>
                </div>
              </div>
              <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded ${
                gates.gate1TenureCompleted ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
              }`}>
                {gates.gate1TenureCompleted ? 'GATE 1: PASS' : 'GATE 1: FAIL'}
              </span>
            </div>

            {/* Gate 2 */}
            <div className="bg-[#FFFFFF] border border-[#D4D1C7] p-4 rounded-sm shadow-xs flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                  gates.gate2BankCbsClear ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-red-100 text-red-800 border border-red-300'
                }`}>
                  2
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900">
                    Gate 2: Independent Bank CBS Verification & Zero Encumbrance
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5">
                    Statutory Rule: Live SFMS handshake must certify zero loans, overdrafts, or third-party encumbrances against instrument.
                  </div>
                  <div className={`text-[11px] font-mono mt-1 font-semibold ${gates.gate2BankCbsClear ? 'text-emerald-700' : 'text-red-700'}`}>
                    {gates.gate2Details}
                  </div>
                </div>
              </div>
              <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded ${
                gates.gate2BankCbsClear ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
              }`}>
                {gates.gate2BankCbsClear ? 'GATE 2: PASS' : 'GATE 2: FAIL'}
              </span>
            </div>

            {/* Gate 3 */}
            <div className="bg-[#FFFFFF] border border-[#D4D1C7] p-4 rounded-sm shadow-xs flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                  gates.gate3ZeroEvcDeficiency ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-red-100 text-red-800 border border-red-300'
                }`}>
                  3
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900">
                    Gate 3: Zero Pending EVC / Regulatory Scrutiny Deficiencies
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5">
                    Statutory Rule: Final Expert Visit Committee (EVC) scrutiny report must record 100% compliance in faculty cadre ratio & labs.
                  </div>
                  <div className={`text-[11px] font-mono mt-1 font-semibold ${gates.gate3ZeroEvcDeficiency ? 'text-emerald-700' : 'text-red-700'}`}>
                    {gates.gate3Details}
                  </div>
                </div>
              </div>
              <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded ${
                gates.gate3ZeroEvcDeficiency ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
              }`}>
                {gates.gate3ZeroEvcDeficiency ? 'GATE 3: PASS' : 'GATE 3: FAIL'}
              </span>
            </div>

            {/* Gate 4 */}
            <div className="bg-[#FFFFFF] border border-[#D4D1C7] p-4 rounded-sm shadow-xs flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                  gates.gate4ZeroLegalHold ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-red-100 text-red-800 border border-red-300'
                }`}>
                  4
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900">
                    Gate 4: Zero Court Cases / Vigilance Holds / Student Fee Complaints
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5">
                    Statutory Rule: Clearance from AICTE Vigilance Cell and Legal Desk regarding student fee refunds or salary disputes.
                  </div>
                  <div className={`text-[11px] font-mono mt-1 font-semibold ${gates.gate4ZeroLegalHold ? 'text-emerald-700' : 'text-red-700'}`}>
                    {gates.gate4Details}
                  </div>
                </div>
              </div>
              <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded ${
                gates.gate4ZeroLegalHold ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
              }`}>
                {gates.gate4ZeroLegalHold ? 'GATE 4: PASS' : 'GATE 4: FAIL'}
              </span>
            </div>

            {/* Gate 5 */}
            <div className="bg-[#FFFFFF] border border-[#D4D1C7] p-4 rounded-sm shadow-xs flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                  gates.gate5BureauSanction ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-stone-200 text-slate-700'
                }`}>
                  5
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900">
                    Gate 5: Competent Authority (Regulation Bureau Head) Digital Sanction
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5">
                    Statutory Rule: Final executive authorization signed by Advisor & Regulation Bureau Head, AICTE HQ New Delhi under Regulation 14.2.
                  </div>
                  <div className={`text-[11px] font-mono mt-1 font-semibold ${gates.gate5BureauSanction ? 'text-emerald-700' : 'text-slate-600'}`}>
                    {gates.gate5Details}
                  </div>
                  
                  {/* Role-specific notices */}
                  {(currentRole === 'regional' || currentRole === 'REGIONAL_OFFICER') && (
                    <div className="mt-2 text-[10px] text-amber-800 bg-amber-50 border border-amber-200 px-2 py-1 rounded font-mono">
                      🔒 Regional Officer Notice: Final 5th-Gate sanction is restricted to AICTE Regulation Bureau Head (HQ New Delhi). Regional scrutiny notes have been submitted to headquarters.
                    </div>
                  )}

                  {(currentRole === 'college' || currentRole === 'INSTITUTION_NODAL') && (
                    <div className="mt-2 text-[10px] text-blue-800 bg-blue-50 border border-blue-200 px-2 py-1 rounded font-mono">
                      ℹ️ Institutional Petition Status: Gate checks 1 to 5 are strictly evaluated by AICTE. You will receive an official notification upon discharge sanction.
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end gap-2 shrink-0">
                <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded ${
                  gates.gate5BureauSanction ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-slate-700'
                }`}>
                  {gates.gate5BureauSanction ? 'GATE 5: SANCTIONED' : 'GATE 5: PENDING'}
                </span>

                {isBureauHead && !gates.gate5BureauSanction && activeGateInfo.isReadyForSanction && (
                  <button
                    onClick={handleAuthorizeSanction}
                    disabled={isSigning}
                    className="px-3 py-1 bg-amber-700 hover:bg-amber-800 text-white rounded text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Stamp className="w-3.5 h-3.5" />
                    <span>Authorize Gate 5 Sanction</span>
                  </button>
                )}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: Cryptographic SHA-256 Audit Ledger */}
      {activeTab === 'AUDIT_LEDGER' && (
        <div className="space-y-4">
          <div className="bg-[#FFFFFF] border border-[#D4D1C7] rounded-sm p-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 pb-3 mb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Key className="w-4 h-4 text-[#14532D]" />
                  Tamper-Evident SHA-256 Hash-Chained Audit Ledger
                </h3>
                <p className="text-xs text-slate-500">
                  Immutable chronological audit blocks where every action cryptographically hashes the previous block state
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                    currentRole === 'college' || currentRole === 'INSTITUTION_NODAL'
                      ? 'bg-blue-100 text-blue-900 border border-blue-300'
                      : currentRole === 'regional' || currentRole === 'REGIONAL_OFFICER'
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  }`}>
                    {currentRole === 'college' || currentRole === 'INSTITUTION_NODAL'
                      ? `Institutional Scope: ${inspectedInstrument.institutionName} (${auditBlocks.length} Contextual Blocks)`
                      : currentRole === 'regional' || currentRole === 'REGIONAL_OFFICER'
                      ? `Regional Scope: SRO / NRO Jurisdiction (${auditBlocks.length} Contextual Blocks)`
                      : `Super Admin Nationwide Scope (All ${auditBlocks.length} Blocks)`}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleVerifyChain}
                  disabled={isVerifyingChain}
                  className="px-3 py-1.5 text-xs font-semibold rounded bg-stone-800 hover:bg-stone-900 text-white flex items-center gap-1.5 transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{isVerifyingChain ? 'Recalculating Hashes...' : 'Verify Cryptographic Integrity'}</span>
                </button>

                <button
                  onClick={handleExportCsv}
                  className="px-3 py-1.5 text-xs font-semibold rounded bg-stone-100 hover:bg-stone-200 text-slate-700 border border-[#D4D1C7] flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {chainVerificationResult && (
              <div className="mb-3 p-2.5 bg-emerald-50 border border-emerald-300 rounded text-xs text-emerald-900 font-semibold font-mono flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{chainVerificationResult}</span>
              </div>
            )}

            {/* Audit Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse gov-table">
                <thead>
                  <tr>
                    <th>Block</th>
                    <th>Timestamp</th>
                    <th>Stakeholder Role</th>
                    <th>Action Executed</th>
                    <th>Details</th>
                    <th>Previous Hash (PrevHash)</th>
                    <th>Current Block Hash</th>
                  </tr>
                </thead>
                <tbody>
                  {auditBlocks.map((b) => (
                    <tr key={b.blockIndex}>
                      <td className="font-mono text-xs font-bold text-slate-800">
                        #{b.blockIndex}
                      </td>
                      <td className="font-mono text-xs text-slate-600 whitespace-nowrap">
                        {b.timestamp}
                      </td>
                      <td className="font-mono text-xs text-slate-800 whitespace-nowrap">
                        <span className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 font-bold">
                          {b.userRole}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-0.5">{b.userIdentifier}</div>
                      </td>
                      <td className="font-mono text-xs font-semibold text-slate-900">
                        {b.action}
                      </td>
                      <td className="text-xs text-slate-600 max-w-[240px]">
                        {b.details}
                        <div className="text-[10px] font-mono text-slate-400 mt-0.5">IP: {b.ipAddress}</div>
                      </td>
                      <td className="font-mono text-[10px] text-slate-500 max-w-[120px] truncate" title={b.previousHash}>
                        {b.previousHash.substring(0, 16)}...
                      </td>
                      <td className="font-mono text-[10px] text-emerald-800 font-semibold max-w-[120px] truncate" title={b.currentHash}>
                        {b.currentHash.substring(0, 16)}...
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: Printable Official AICTE QR Release Order         */}
      {/* ======================================================== */}
      {showDischargeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-[#FFFFFF] border-2 border-slate-700 rounded shadow-2xl max-w-2xl w-full my-8 p-6 space-y-4">
            
            {/* Modal Top Actions */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#14532D]" />
                <span className="font-bold text-sm text-slate-900">
                  Official AICTE Regulation Bureau Discharge Order (Print Preview)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-900 text-white rounded font-medium flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Document</span>
                </button>
                <button
                  onClick={() => setShowDischargeModal(false)}
                  className="p-1 rounded hover:bg-slate-100 text-slate-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* PRINTABLE OFFICIAL ORDER SHEET */}
            <div id="printable-release-order" className="border-2 border-slate-800 p-6 bg-[#FCFBF8] text-slate-900 font-serif space-y-4">
              
              {/* Official Header */}
              <div className="text-center border-b-2 border-slate-900 pb-3">
                <div className="text-[11px] font-sans font-bold uppercase tracking-widest text-slate-700">
                  ALL INDIA COUNCIL FOR TECHNICAL EDUCATION
                </div>
                <div className="text-[10px] font-sans text-slate-600">
                  (A STATUTORY BODY OF THE GOVERNMENT OF INDIA, MINISTRY OF EDUCATION)
                </div>
                <div className="text-xs font-sans text-slate-600">
                  Nelson Mandela Marg, Vasant Kunj, New Delhi - 110070
                </div>
                <h2 className="text-base font-bold font-sans uppercase tracking-wider text-slate-950 mt-2 bg-stone-100 py-1 border-y border-stone-300">
                  OFFICIAL ORDER FOR RELEASE & DISCHARGE OF SECURITY DEPOSIT FDR
                </h2>
              </div>

              {/* Order Metadata */}
              <div className="flex justify-between text-xs font-mono border-b border-stone-300 pb-2">
                <div>
                  <strong>File No:</strong> {gates.dischargeOrderNumber || 'F.No. AICTE/RB/DISCHARGE/2026/NWRO/0912'}
                </div>
                <div>
                  <strong>Date:</strong> {formatGovDate(gates.dischargeIssuedDate || new Date().toISOString().substring(0, 10))}
                </div>
              </div>

              {/* Addressed To */}
              <div className="text-xs text-slate-800 space-y-1">
                <div>To,</div>
                <div className="font-bold">The Branch Manager,</div>
                <div>{inspectedInstrument.bankName},</div>
                <div>{inspectedInstrument.branchName} (IFSC: {inspectedInstrument.ifscCode})</div>
              </div>

              {/* Subject */}
              <div className="text-xs text-slate-900 bg-stone-100 p-2.5 rounded border border-stone-200">
                <strong>Subject:</strong> Release of Security Deposit Fixed Deposit Receipt (FDR) #{inspectedInstrument.fdrNumber} amounting to {formatInr(inspectedInstrument.principalAmount)} held in joint custody with Member Secretary, AICTE.
              </div>

              {/* Directive Body */}
              <div className="text-xs text-slate-800 leading-relaxed space-y-2">
                <p>Sir/Madam,</p>
                <p>
                  I am directed to convey the sanction of the Competent Authority, AICTE under Chapter 1 Clause 1.6 of the Approval Process Handbook (APH 2026-27) for the unconditional release and discharge of the undermentioned Fixed Deposit Receipt:
                </p>
                
                {/* Instrument Table */}
                <table className="w-full text-left text-xs font-sans border-collapse border border-slate-400 my-2">
                  <tbody>
                    <tr className="border-b border-slate-300">
                      <td className="p-1.5 bg-stone-100 font-bold w-1/3">FDR Receipt Number:</td>
                      <td className="p-1.5 font-mono">{inspectedInstrument.fdrNumber}</td>
                    </tr>
                    <tr className="border-b border-slate-300">
                      <td className="p-1.5 bg-stone-100 font-bold">Principal Amount:</td>
                      <td className="p-1.5 rupee-mono font-bold">{formatInr(inspectedInstrument.principalAmount)}</td>
                    </tr>
                    <tr className="border-b border-slate-300">
                      <td className="p-1.5 bg-stone-100 font-bold">Name of Technical Institution:</td>
                      <td className="p-1.5">{inspectedInstrument.institutionName} (AICTE ID: {inspectedInstrument.institutionId})</td>
                    </tr>
                    <tr className="border-b border-slate-300">
                      <td className="p-1.5 bg-stone-100 font-bold">Completed Statutory Lock-in:</td>
                      <td className="p-1.5 font-mono">8 Full Years (From {formatGovDate(inspectedInstrument.issueDate)} to {formatGovDate(inspectedInstrument.maturityDate)})</td>
                    </tr>
                    <tr>
                      <td className="p-1.5 bg-stone-100 font-bold">AICTE Lien Status:</td>
                      <td className="p-1.5 text-emerald-800 font-bold">DISCHARGED & RELEASED HEREBY</td>
                    </tr>
                  </tbody>
                </table>

                <p>
                  The lien previously marked in your Core Banking System (CBS) in favor of the Member Secretary, AICTE is hereby <strong>REVOKED</strong>. You are authorized to credit the principal amount along with all accrued compound interest directly to the designated official operational account of the technical institution.
                </p>
              </div>

              {/* Bottom: Verifiable QR Code & Digital Signature */}
              <div className="pt-3 border-t-2 border-slate-800 flex items-center justify-between">
                
                {/* Verifiable QR Representation */}
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-white border border-slate-800 rounded">
                    <QrCode className="w-16 h-16 text-slate-900" />
                  </div>
                  <div className="text-[10px] font-mono text-slate-600">
                    <div className="font-bold text-slate-900">VERIFIABLE DIGITAL CERTIFICATE</div>
                    <div>Scan QR to verify AICTE digital ledger</div>
                    <div className="text-slate-400">Digest: {inspectedInstrument.sha256Hash.substring(0, 18)}...</div>
                  </div>
                </div>

                {/* Digital Signature Stamp */}
                <div className="text-right text-xs">
                  <div className="italic text-slate-800 font-serif">Prof. Rajendra Prasad</div>
                  <div className="font-bold text-slate-950 font-sans">Advisor & Regulation Bureau Head</div>
                  <div className="text-[10px] text-slate-600 font-sans">AICTE Headquarters, New Delhi</div>
                  <div className="text-[9px] font-mono text-emerald-800 mt-0.5">
                    Digitally Signed via NIC DSC • {formatGovDate(gates.dischargeIssuedDate || '2026-10-26')}
                  </div>
                </div>

              </div>

            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowDischargeModal(false)}
                className="px-4 py-1.5 text-xs bg-slate-800 text-white rounded hover:bg-slate-900 font-medium"
              >
                Close Order Sheet
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Official AICTE Statutory Deficiency Email Modal */}
      <DeficiencyEmailModal
        notice={selectedNoticeForModal}
        onClose={() => setSelectedNoticeForModal(null)}
        onResendNotice={handleResendNotice}
      />

    </div>
  );
};
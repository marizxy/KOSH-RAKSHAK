import React, { useState, useEffect, useRef, useMemo } from 'react';
import { FDRInstrument, GreenSheetNote } from '../types';
import { formatInr, formatGovDate } from '../utils/formatters';
import { 
  GitCompare, 
  CheckCircle2, 
  AlertTriangle, 
  FileSignature, 
  RefreshCw, 
  ShieldCheck, 
  Building, 
  Landmark, 
  FileText, 
  PenTool, 
  Check, 
  Stamp,
  AlertCircle,
  Search,
  ArrowDown,
  ShieldAlert,
  Sparkles
} from 'lucide-react';

interface Module3DualSourceTruthMatrixProps {
  currentInstrument: FDRInstrument;
  instruments?: FDRInstrument[];
  onUpdateInstrument: (updated: FDRInstrument) => void;
  onSelectInstrument?: (instrument: FDRInstrument) => void;
}

export const Module3DualSourceTruthMatrix: React.FC<Module3DualSourceTruthMatrixProps> = ({
  currentInstrument: propInstrument,
  instruments = [],
  onUpdateInstrument,
  onSelectInstrument,
}) => {
  // Candidate dataset fallback
  const dataset = useMemo(() => {
    return instruments.length > 0 ? instruments : [propInstrument];
  }, [instruments, propInstrument]);

  // Local active instrument state
  const [selectedInstId, setSelectedInstId] = useState<string>(propInstrument.id);
  const activeInstrument = dataset.find((i) => i.id === selectedInstId) || propInstrument;

  // Search filter for Registry table
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Ref for Smooth Scrolling to the bottom action desk
  const actionPanelRef = useRef<HTMLDivElement>(null);

  // Handshake State
  const [isHandshaking, setIsHandshaking] = useState(false);
  const [handshakeComplete, setHandshakeComplete] = useState(
    !!activeInstrument.bankCbs.handshakeTimestamp
  );

  // Green Sheet State
  const [isSigningNote, setIsSigningNote] = useState(false);
  const [draftedNoteText, setDraftedNoteText] = useState<string>('');
  const [recommendedAction, setRecommendedAction] = useState<
    'APPROVE_AND_LOCK' | 'ISSUE_SHOW_CAUSE' | 'ESCALATE_TO_VIGILANCE' | 'SANCTION_DISCHARGE'
  >('APPROVE_AND_LOCK');
  const [dispatchToast, setDispatchToast] = useState<{
    collegeName: string;
    action: string;
    timestamp: string;
    fdrNumber: string;
  } | null>(null);

  // Sync active instrument when prop changes
  useEffect(() => {
    if (propInstrument && propInstrument.id !== selectedInstId) {
      setSelectedInstId(propInstrument.id);
    }
  }, [propInstrument.id]);

  // Helper to generate dynamic draft note based on college facts and recommended action
  const generateDynamicDraft = (
    inst: FDRInstrument,
    action: 'APPROVE_AND_LOCK' | 'ISSUE_SHOW_CAUSE' | 'ESCALATE_TO_VIGILANCE' | 'SANCTION_DISCHARGE'
  ): string => {
    const dateStr = formatGovDate(new Date().toISOString().substring(0, 10));
    const refNo = `F.No. AICTE/RB/FDR/${inst.region}/${inst.institutionId}`;

    if (action === 'ESCALATE_TO_VIGILANCE') {
      if (inst.bankCbs.hasEncumbrance && inst.bankCbs.overdraftLoanAmount) {
        return `NOTE SHEET — SCRUTINY FILE REF: ${refNo}
Date: ${dateStr}

Subject: Critical Encumbrance Detection — Pledging of Encumbered Security Deposit FDR #${inst.fdrNumber} submitted by ${inst.institutionName}.

1. The institution submitted Fixed Deposit Receipt #${inst.fdrNumber} issued by ${inst.bankName} (${inst.branchName}) claiming an unencumbered regulatory deposit of ${formatInr(inst.principalAmount)} under APH 2026-27 Chapter 1 Clause 1.4.

2. Independent live cryptographic handshake with ${inst.bankName} Core Banking Host (${inst.bankCbs.cbsReferenceNumber || 'CBS-HOST-ACTIVE'}) revealed an active undisclosed commercial Overdraft Loan Facility of ${formatInr(inst.bankCbs.overdraftLoanAmount)} against this instrument.

3. Under AICTE Approval Process Handbook Appendix 16 (Penal Clauses) and Section 45 of Banking Regulation Act, pledging an encumbered deposit constitutes severe misrepresentation and financial default.

RECOMMENDATION: File escalated to Chief Vigilance Officer (CVO), AICTE HQ. Immediate Statutory Show-Cause notice dispatched to Institutional Chairman and Branch Manager. Institutional Extension of Approval (EoA) portal locked with immediate effect.`;
      }
      return `NOTE SHEET — SCRUTINY FILE REF: ${refNo}
Date: ${dateStr}

Subject: Forensic ELA & Actuarial Compounding Discrepancy Findings on FDR #${inst.fdrNumber} (${inst.institutionName}).

1. Multi-modal forensic scrutiny of FDR #${inst.fdrNumber} uploaded by ${inst.institutionName} detected high-frequency Error Level Analysis (ELA) pixel anomalies and non-native JPEG quantization traces (${inst.forensics.metadataModifiedBy || 'Adobe Photoshop artifact'}).

2. Actuarial compound interest recalculation (A = P * (1 + r/400)^4n) establishes that the printed maturity of ${formatInr(inst.printedMaturityAmount)} corresponds to an actual Principal of only ₹15 Lakhs, not the claimed ₹35 Lakhs. Net statutory shortfall is ${formatInr(Math.abs(inst.forensics.mathDiscrepancyDelta || 2000000))}.

3. Dual-source bank verification confirmed the deposit balance registered in ${inst.bankName} master records is only ${formatInr(inst.actualDeposit)}.

RECOMMENDATION: Serious forensic and financial forgery. File escalated to Vigilance Bureau for regulatory de-recognition, FIR registration, and suspension of student intake under APH Regulation 14(b).`;
    }

    if (action === 'ISSUE_SHOW_CAUSE') {
      if (inst.hasEitherSurvivorClause) {
        return `NOTE SHEET — SCRUTINY FILE REF: ${refNo}
Date: ${dateStr}

Subject: Statutory Deficiency — Invalid Joint Lien Mandate Clause on FDR #${inst.fdrNumber} (${inst.institutionName}).

1. Examination of the lien endorsement clause in FDR #${inst.fdrNumber} reveals the operational mandate registered as "Either or Survivor" between the Institution and AICTE.

2. In accordance with AICTE Approval Process Handbook 2026-27 Section 1.4(b), security deposits must strictly be maintained under exclusive Joint Lien encashable ONLY upon written AICTE discharge authority. The present mandate permits unilateral encashment by college management, violating regulatory safeguard norms.

RECOMMENDATION: Formal Statutory Deficiency / Show-Cause Notice dispatched to ${inst.institutionName}. Institution is granted 15 calendar days to submit a bank-certified Lien Endorsement Rectification Certificate failing which penal actions shall initiate.`;
      }
      return `NOTE SHEET — SCRUTINY FILE REF: ${refNo}
Date: ${dateStr}

Subject: Normative Security Deposit Shortfall on FDR #${inst.fdrNumber} (${inst.institutionName}).

1. Statutory audit of FDR #${inst.fdrNumber} against APH Table 4.1 program norms indicates a statutory deposit shortfall of ${formatInr(inst.depositDeficit || 2000000)}.

2. The institution has submitted an instrument for ${formatInr(inst.actualDeposit)} against the mandatory normative requirement of ${formatInr(inst.requiredDeposit)} for its approved technical programs.

RECOMMENDATION: Show-Cause Deficiency Memo dispatched requiring institution to furnish a supplemental FDR bridging the statutory gap within 15 calendar days.`;
    }

    if (action === 'SANCTION_DISCHARGE') {
      return `NOTE SHEET — SCRUTINY FILE REF: F.No. AICTE/RB/DISCHARGE/2026/${inst.region}/${inst.institutionId}
Date: ${dateStr}

Subject: Final Sanction for Release / Refund of Security Deposit FDR #${inst.fdrNumber} upon Statutory Lock-in Completion.

1. ${inst.institutionName} has completed the mandatory lock-in tenure under APH Clause 1.6(a) with exemplary compliance record.

2. Dual-Source Bank CBS verification confirms zero outstanding encumbrances, loans, or adverse claims against the deposit. EVC inspection records confirm zero pending faculty salary arrears or infrastructural deficiencies.

3. All 5 regulatory clearance gates stand verified and cleared.

RECOMMENDATION: Final Sanction accorded for the release of FDR #${inst.fdrNumber} (${formatInr(inst.principalAmount)}) with accrued interest. Issue formal QR-coded Discharge Order addressed to ${inst.bankName} Branch Manager.`;
    }

    // Default: APPROVE_AND_LOCK
    return `NOTE SHEET — SCRUTINY FILE REF: ${refNo}
Date: ${dateStr}

Subject: Statutory Verification & Final Registration of Security Deposit FDR #${inst.fdrNumber} (${inst.institutionName}).

1. ${inst.institutionName} has submitted Fixed Deposit Receipt #${inst.fdrNumber} issued by ${inst.bankName} (${inst.branchName}) for ${formatInr(inst.principalAmount)} in full compliance with APH 2026-27 program norms.

2. 6-Layer Multi-Modal AI scrutiny successfully cleared with a Trust Score of ${inst.forensics.trustScore}%. Error Level Analysis (ELA) and compounding actuarial mathematics confirm authenticity.

3. Live Bank CBS handshake confirmed valid Joint AICTE Lien with zero active encumbrances or commercial credit facilities.

RECOMMENDATION: Instrument approved, verified, and locked in the AICTE KOSH-Rakshak Central Repository for the designated statutory lock-in tenure.`;
  };

  // Determine initial action when active instrument changes
  useEffect(() => {
    let initialAction: 'APPROVE_AND_LOCK' | 'ISSUE_SHOW_CAUSE' | 'ESCALATE_TO_VIGILANCE' | 'SANCTION_DISCHARGE' = 'APPROVE_AND_LOCK';
    if (activeInstrument.bankCbs.hasEncumbrance || activeInstrument.forensics.mathMismatch || activeInstrument.forensics.elaTamperingDetected) {
      initialAction = 'ESCALATE_TO_VIGILANCE';
    } else if (activeInstrument.hasEitherSurvivorClause || activeInstrument.depositDeficit > 0) {
      initialAction = 'ISSUE_SHOW_CAUSE';
    } else if (activeInstrument.fiveGates?.overallEligible) {
      initialAction = 'SANCTION_DISCHARGE';
    } else {
      initialAction = 'APPROVE_AND_LOCK';
    }

    setRecommendedAction(initialAction);
    setDraftedNoteText(generateDynamicDraft(activeInstrument, initialAction));
    setHandshakeComplete(!!activeInstrument.bankCbs.handshakeTimestamp);
  }, [activeInstrument.id]);

  // Click & Smooth Scroll handler for "Review & Sign"
  const handleReviewAndSignClick = (inst: FDRInstrument) => {
    setSelectedInstId(inst.id);
    if (onSelectInstrument) {
      onSelectInstrument(inst);
    }

    // Determine appropriate action for this specific instrument
    let targetAction: 'APPROVE_AND_LOCK' | 'ISSUE_SHOW_CAUSE' | 'ESCALATE_TO_VIGILANCE' | 'SANCTION_DISCHARGE' = 'APPROVE_AND_LOCK';
    if (inst.bankCbs.hasEncumbrance || inst.forensics.mathMismatch || inst.forensics.elaTamperingDetected) {
      targetAction = 'ESCALATE_TO_VIGILANCE';
    } else if (inst.hasEitherSurvivorClause || inst.depositDeficit > 0) {
      targetAction = 'ISSUE_SHOW_CAUSE';
    } else if (inst.fiveGates?.overallEligible) {
      targetAction = 'SANCTION_DISCHARGE';
    } else {
      targetAction = 'APPROVE_AND_LOCK';
    }

    setRecommendedAction(targetAction);
    setDraftedNoteText(generateDynamicDraft(inst, targetAction));

    // Smooth scroll down to the bottom action desk
    setTimeout(() => {
      actionPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  // Handle Action Dropdown Change & Auto-Sync
  const handleActionChange = (action: 'APPROVE_AND_LOCK' | 'ISSUE_SHOW_CAUSE' | 'ESCALATE_TO_VIGILANCE' | 'SANCTION_DISCHARGE') => {
    setRecommendedAction(action);
    setDraftedNoteText(generateDynamicDraft(activeInstrument, action));
  };

  // Trigger live Bank CBS handshake simulation
  const handleTriggerHandshake = () => {
    setIsHandshaking(true);
    setTimeout(() => {
      setIsHandshaking(false);
      setHandshakeComplete(true);

      const timestamp = `${new Date().toLocaleTimeString('en-IN')} IST, ${formatGovDate(new Date().toISOString())}`;
      const updated: FDRInstrument = {
        ...activeInstrument,
        bankCbs: {
          ...activeInstrument.bankCbs,
          confirmed: true,
          handshakeTimestamp: timestamp,
          cbsReferenceNumber: activeInstrument.bankCbs.cbsReferenceNumber || `CBS-${activeInstrument.bankName.substring(0, 3).toUpperCase()}-2026-${Math.floor(1000000 + Math.random() * 9000000)}`,
        },
      };
      onUpdateInstrument(updated);
    }, 1200);
  };

  // Sign and dispatch green sheet note
  const handleSignNote = () => {
    if (!draftedNoteText || isSigningNote) return;
    setIsSigningNote(true);

    setTimeout(() => {
      setIsSigningNote(false);
      const newNote: GreenSheetNote = {
        id: 'NOTE-' + Date.now().toString().slice(-4),
        date: new Date().toISOString().substring(0, 10),
        author: 'Shri R. Krishnan, ITS',
        designation: 'Regional Scrutiny Officer',
        office: `AICTE ${activeInstrument.region} Regional Office`,
        noteContent: draftedNoteText,
        recommendedAction: recommendedAction,
        digitalSignature: `SHA256:e019${Date.now().toString(16)}... [NIC e-Token 2026 Verified]`,
        signed: true,
        timestamp: new Date().toLocaleTimeString('en-IN') + ' IST',
      };

      const updated: FDRInstrument = {
        ...activeInstrument,
        status: (recommendedAction === 'APPROVE_AND_LOCK' ? 'ACTIVE' : 'FLAGGED') as any,
        verificationStatus: (recommendedAction === 'APPROVE_AND_LOCK' ? 'BANK_CBS_CONFIRMED' : 'DISCREPANCY_FLAGGED') as any,
        greenSheetNotes: [newNote, ...activeInstrument.greenSheetNotes],
      };
      onUpdateInstrument(updated);

      // Dispatch confirmation toast
      setDispatchToast({
        collegeName: activeInstrument.institutionName,
        action: recommendedAction === 'APPROVE_AND_LOCK' 
          ? 'Approved & Locked' 
          : recommendedAction === 'ISSUE_SHOW_CAUSE'
          ? 'Deficiency Show-Cause Memo Issued'
          : recommendedAction === 'ESCALATE_TO_VIGILANCE'
          ? 'Escalated to Vigilance & EoA Locked'
          : '5-Gate Release Sanctioned',
        timestamp: new Date().toLocaleTimeString('en-IN') + ' IST',
        fdrNumber: activeInstrument.fdrNumber,
      });
      setTimeout(() => setDispatchToast(null), 6000);
    }, 800);
  };

  // Filtered institutions for Registry Table
  const filteredInstruments = dataset.filter((inst) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      inst.institutionName.toLowerCase().includes(q) ||
      inst.institutionId.toLowerCase().includes(q) ||
      inst.fdrNumber.toLowerCase().includes(q) ||
      inst.bankName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      
      {/* ======================================================== */}
      {/* 1. TOP HEADER & SUMMARY METRICS STRIP                    */}
      {/* ======================================================== */}
      <div className="bg-[#FFFFFF] border border-[#D4D1C7] p-4 rounded-sm shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <GitCompare className="w-5 h-5 text-[#14532D]" />
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Regional Dual-Source Verification Registry & e-Office Green Sheet Desk
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Compact tripartite cross-examination: Institutional Declarations vs AI Multi-Layer Forensic Results vs Bank Core Banking System (CBS) Ledger
            </p>
          </div>

          {/* Quick Metrics Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-mono bg-stone-100 text-slate-700 px-2.5 py-1 rounded border border-stone-300">
              Queue: <strong className="text-slate-900">{dataset.length} Colleges</strong>
            </span>
            <span className="text-[11px] font-mono bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded border border-emerald-200">
              Clean / Verified: <strong className="text-emerald-900">{dataset.filter(i => i.bankCbs.confirmed && !i.bankCbs.hasEncumbrance && !i.forensics.elaTamperingDetected).length}</strong>
            </span>
            <span className="text-[11px] font-mono bg-red-50 text-red-800 px-2.5 py-1 rounded border border-red-200">
              Vigilance / Encumbered: <strong className="text-red-900">{dataset.filter(i => i.bankCbs.hasEncumbrance || i.forensics.mathMismatch || i.forensics.elaTamperingDetected).length}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Confirmation Dispatch Toast */}
      {dispatchToast && (
        <div className="bg-emerald-50 border-2 border-emerald-600 rounded-sm p-3.5 shadow-sm flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
            <div>
              <div className="text-xs font-bold text-emerald-950">
                Official Note Sheet Digitally Signed & Dispatched with NIC e-Token (SHA-256 Verified)
              </div>
              <div className="text-[11px] text-emerald-800">
                Status updated to: <strong>{dispatchToast.action}</strong> for {dispatchToast.collegeName} (FDR #{dispatchToast.fdrNumber}) at {dispatchToast.timestamp}.
              </div>
            </div>
          </div>
          <span className="text-[10px] font-mono bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded font-bold uppercase">
            Queue Resolved
          </span>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. TOP SECTION: COMPACT REGISTRY TABLE                   */}
      {/* ======================================================== */}
      <div className="bg-[#FFFFFF] border border-[#D4D1C7] rounded-sm shadow-xs overflow-hidden">
        
        {/* Table Toolbar */}
        <div className="p-3 bg-stone-50 border-b border-[#D4D1C7] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#14532D]" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
              Master Institutional Scrutiny Registry ({filteredInstruments.length} Records)
            </h3>
          </div>

          {/* Search Input */}
          <div className="relative max-w-xs w-full">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search college, ID, or bank..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-[#D4D1C7] rounded focus:outline-hidden text-slate-800 placeholder:text-slate-400 font-sans"
            />
          </div>
        </div>

        {/* Compact Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-100/90 border-b border-[#D4D1C7] text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                <th className="py-2.5 px-3 border-r border-[#D4D1C7]/70">College Name / ID</th>
                <th className="py-2.5 px-3 border-r border-[#D4D1C7]/70">College Claim Data</th>
                <th className="py-2.5 px-3 border-r border-[#D4D1C7]/70">Forensic Extract (AI Results)</th>
                <th className="py-2.5 px-3 border-r border-[#D4D1C7]/70">Bank CBS Confirmation</th>
                <th className="py-2.5 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 text-xs">
              {filteredInstruments.map((inst) => {
                const isActive = inst.id === activeInstrument.id;
                const hasDiscrepancy = inst.bankCbs.hasEncumbrance || inst.forensics.mathMismatch || inst.forensics.elaTamperingDetected;
                const hasSurvivorLoophole = inst.hasEitherSurvivorClause;

                return (
                  <tr
                    key={inst.id}
                    className={`transition-colors ${
                      isActive 
                        ? 'bg-emerald-50/70 border-l-4 border-l-[#14532D]' 
                        : 'hover:bg-stone-50/80'
                    }`}
                  >
                    
                    {/* COLUMN 1: College Name / ID */}
                    <td className="py-2.5 px-3 border-r border-[#D4D1C7]/60 align-top">
                      <div className="font-bold text-slate-900 leading-snug">
                        {inst.institutionName}
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5 mt-1 font-mono text-[10px] text-slate-500">
                        <span className="bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded border border-slate-200">
                          ID: {inst.institutionId}
                        </span>
                        <span>•</span>
                        <span>AISHE: {inst.aisheCode}</span>
                        <span>•</span>
                        <span className="text-emerald-800 font-semibold">{inst.region}</span>
                      </div>
                    </td>

                    {/* COLUMN 2: College Claim Data */}
                    <td className="py-2.5 px-3 border-r border-[#D4D1C7]/60 align-top font-mono">
                      <div className="font-bold text-slate-900">
                        {formatInr(inst.principalAmount)}
                      </div>
                      <div className="text-[11px] text-slate-700 font-sans mt-0.5 truncate max-w-[190px]">
                        {inst.bankName}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate max-w-[190px]">
                        FDR #{inst.fdrNumber}
                      </div>
                      <div className="mt-1 text-[10px] font-sans">
                        {hasSurvivorLoophole ? (
                          <span className="text-amber-800 bg-amber-50 px-1 py-0.2 rounded border border-amber-200 font-semibold">
                            Mandate: Either or Survivor
                          </span>
                        ) : (
                          <span className="text-slate-600">
                            Claim: Exclusive Joint Lien
                          </span>
                        )}
                      </div>
                    </td>

                    {/* COLUMN 3: Forensic Extract (AI Results) */}
                    <td className="py-2.5 px-3 border-r border-[#D4D1C7]/60 align-top">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${
                          inst.forensics.trustScore >= 90
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : inst.forensics.trustScore >= 75
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-red-100 text-red-800 border border-red-300'
                        }`}>
                          Trust: {inst.forensics.trustScore}%
                        </span>
                        {inst.forensics.elaTamperingDetected && (
                          <span className="text-[9px] bg-red-100 text-red-800 px-1 py-0.2 rounded font-bold border border-red-300">
                            ELA Noise
                          </span>
                        )}
                      </div>

                      <div className="space-y-0.5 text-[11px]">
                        {inst.forensics.mathMismatch ? (
                          <div className="text-red-700 font-bold text-[10px]">
                            ⚠️ Math Shortfall: {formatInr(inst.forensics.mathDiscrepancyDelta || 0)}
                          </div>
                        ) : (
                          <div className="text-emerald-700 font-mono text-[10px]">
                            ✓ Compounding Recalculated
                          </div>
                        )}

                        {hasSurvivorLoophole ? (
                          <div className="text-amber-800 font-semibold text-[10px]">
                            ⚠️ Legal Loophole Detected
                          </div>
                        ) : (
                          <div className="text-slate-600 text-[10px]">
                            ✓ Joint Lien Mandate Intact
                          </div>
                        )}
                      </div>
                    </td>

                    {/* COLUMN 4: Bank CBS Confirmation */}
                    <td className="py-2.5 px-3 border-r border-[#D4D1C7]/60 align-top">
                      {inst.bankCbs.hasEncumbrance ? (
                        <div className="inline-block text-[10px] font-bold bg-red-100 text-red-900 border border-red-300 px-2 py-0.5 rounded animate-pulse">
                          ⚠️ SECRET OVERDRAFT: {formatInr(inst.bankCbs.overdraftLoanAmount || 0)}
                        </div>
                      ) : inst.bankCbs.confirmed ? (
                        <div className="inline-block text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded">
                          ✓ CBS CONFIRMED (UNENCUMBERED)
                        </div>
                      ) : (
                        <div className="inline-block text-[10px] font-bold bg-stone-100 text-stone-700 border border-stone-300 px-2 py-0.5 rounded">
                          PENDING CBS QUERY
                        </div>
                      )}

                      <div className="text-[11px] font-mono text-slate-700 mt-1">
                        Bank Master: <strong>{formatInr(inst.actualDeposit)}</strong>
                      </div>
                      <div className="text-[10px] font-mono text-slate-500 truncate max-w-[180px]">
                        Ref: {inst.bankCbs.cbsReferenceNumber || 'CBS-HOST-QUERY-PENDING'}
                      </div>
                    </td>

                    {/* COLUMN 5: Action */}
                    <td className="py-2.5 px-3 text-center align-middle whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleReviewAndSignClick(inst)}
                        className={`px-3 py-1.5 text-xs font-bold rounded flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer mx-auto ${
                          isActive
                            ? 'bg-[#14532D] text-white ring-2 ring-emerald-600 shadow-sm'
                            : 'bg-stone-800 hover:bg-[#14532D] text-white'
                        }`}
                      >
                        <FileSignature className="w-3.5 h-3.5 text-emerald-300" />
                        <span>Review & Sign</span>
                      </button>
                      {isActive && (
                        <span className="block text-[9px] font-mono text-emerald-800 font-bold mt-1 uppercase">
                          ● Active Dossier
                        </span>
                      )}
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Bottom Status Ribbon */}
        <div className="p-2.5 bg-stone-100 border-t border-[#D4D1C7] text-[11px] text-slate-600 font-mono flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
          <span>💡 Officer Tip: Click "Review & Sign" on any row to load the dossier and smooth-scroll to the auto-letter generator below.</span>
          <span>Active Selection: <strong className="text-slate-900">{activeInstrument.institutionName}</strong></span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. BOTTOM SECTION: AUTO-LETTER & DIGITAL SIGN ACTION DESK*/}
      {/* ======================================================== */}
      <div 
        ref={actionPanelRef} 
        className="bg-[#FFFFFF] border border-[#D4D1C7] rounded-sm p-4 shadow-xs scroll-mt-20"
      >
        
        {/* Action Desk Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 pb-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <FileSignature className="w-5 h-5 text-[#14532D]" />
              <h3 className="font-bold text-sm text-slate-900">
                Active Scrutiny Desk: Auto-Generated Note Sheet & NIC Digital Sign
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Inspecting: <strong className="text-slate-900">{activeInstrument.institutionName}</strong> (FDR #{activeInstrument.fdrNumber} • AICTE ID: {activeInstrument.institutionId})
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Live Bank CBS Handshake Button */}
            <button
              type="button"
              onClick={handleTriggerHandshake}
              disabled={isHandshaking}
              className={`px-3 py-1.5 text-xs font-bold rounded flex items-center gap-1.5 shadow-xs transition-all cursor-pointer ${
                isHandshaking
                  ? 'bg-slate-300 text-slate-600 cursor-not-allowed'
                  : 'bg-stone-100 hover:bg-stone-200 text-slate-800 border border-stone-300'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isHandshaking ? 'animate-spin text-emerald-700' : 'text-slate-600'}`} />
              <span>{isHandshaking ? 'Querying CBS...' : 'Query Bank CBS Host'}</span>
            </button>

            {/* Re-sync template button */}
            <button
              type="button"
              onClick={() => setDraftedNoteText(generateDynamicDraft(activeInstrument, recommendedAction))}
              className="px-3 py-1.5 text-xs font-semibold rounded bg-stone-100 hover:bg-stone-200 text-slate-800 border border-stone-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <PenTool className="w-3.5 h-3.5 text-slate-600" />
              <span>Reset Template</span>
            </button>
          </div>
        </div>

        {/* Grid Layout: Note Composer (Left) & Historical Audit Trail (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* LEFT COLUMN: Green Sheet Note Sheet Composer (7 Cols) */}
          <div className="lg:col-span-7 space-y-3">
            <div className="green-sheet p-4 rounded-sm border border-[#B7D5C4] relative shadow-inner space-y-3">
              
              {/* Official Government Note Sheet Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#B7D5C4] pb-2 text-xs font-serif text-slate-800 gap-1">
                <span className="font-bold uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
                  <Stamp className="w-3.5 h-3.5 text-emerald-800" />
                  GOVERNMENT OF INDIA • AICTE REGULATORY NOTE SHEET
                </span>
                <span className="font-mono text-[11px] text-emerald-900">
                  e-File: F.No. AICTE/RB/FDR/{activeInstrument.region}/{activeInstrument.institutionId}
                </span>
              </div>

              {/* Recommended Action Dropdown (Approve, Hold, Alert, Sanction) */}
              <div className="bg-white/80 border border-[#B7D5C4] p-2.5 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <label className="font-bold text-emerald-950 text-xs flex items-center gap-1.5 whitespace-nowrap">
                  <span>Recommended Action:</span>
                </label>
                <select
                  value={recommendedAction}
                  onChange={(e: any) => handleActionChange(e.target.value)}
                  className="py-1.5 px-3 text-xs bg-white border border-[#B7D5C4] rounded text-slate-900 focus:outline-hidden font-sans font-bold cursor-pointer w-full sm:max-w-md shadow-2xs"
                >
                  <option value="APPROVE_AND_LOCK">
                    Approve (Regulatory Compliance Verified & Lock in Repository)
                  </option>
                  <option value="ISSUE_SHOW_CAUSE">
                    Hold (Issue Show-Cause / Statutory Deficiency Memo - 15 Days)
                  </option>
                  <option value="ESCALATE_TO_VIGILANCE">
                    Alert (Escalate to Chief Vigilance Officer - Encumbrance / Forgery)
                  </option>
                  <option value="SANCTION_DISCHARGE">
                    Sanction (Authorize 5-Gate Final Release & QR Discharge Order)
                  </option>
                </select>
              </div>

              {/* Auto-populated Official Letter / Memo Textarea */}
              <div>
                <textarea
                  value={draftedNoteText}
                  onChange={(e) => setDraftedNoteText(e.target.value)}
                  placeholder="Official regulatory memo will be automatically generated here based on the selected action..."
                  rows={12}
                  className="w-full bg-transparent border-0 focus:outline-hidden text-xs text-slate-950 font-serif leading-relaxed placeholder:text-slate-500 resize-none p-1"
                />
              </div>

              {/* Prominent Action Button: Digitally Sign & Dispatch */}
              <div className="pt-3 border-t border-[#B7D5C4]">
                <button
                  type="button"
                  onClick={handleSignNote}
                  disabled={!draftedNoteText || isSigningNote}
                  className={`w-full py-2.5 px-4 text-xs font-bold rounded shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    !draftedNoteText || isSigningNote
                      ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                      : 'bg-[#14532D] hover:bg-[#15803D] text-white active:scale-98 border border-emerald-950'
                  }`}
                >
                  <Stamp className="w-4 h-4 text-emerald-200" />
                  <span>
                    {isSigningNote 
                      ? 'Applying NIC e-Token Signature & Cryptographic Dispatch...' 
                      : 'Digitally Sign & Dispatch Official Note Sheet via NIC e-Token'
                    }
                  </span>
                </button>
              </div>

            </div>
          </div>

          {/* RIGHT COLUMN: Chronological Historical e-Office Notes Trail (5 Cols) */}
          <div className="lg:col-span-5 space-y-3">
            
            {/* Quick Dossier Cross-Reference Box */}
            <div className="p-3 bg-stone-50 border border-stone-200 rounded text-xs space-y-2">
              <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wider flex items-center justify-between border-b border-stone-200 pb-1.5">
                <span>Active Instrument Attributes</span>
                <span className="font-mono text-[10px] text-slate-500">{activeInstrument.fdrNumber}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div>
                  <span className="text-[10px] text-slate-500 font-sans block">Bank:</span>
                  <span className="font-bold text-slate-800 truncate block">{activeInstrument.bankName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-sans block">Principal:</span>
                  <span className="font-bold text-slate-800 block">{formatInr(activeInstrument.principalAmount)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-sans block">CBS Status:</span>
                  <span className={`font-bold block ${activeInstrument.bankCbs.hasEncumbrance ? 'text-red-700' : 'text-emerald-700'}`}>
                    {activeInstrument.bankCbs.hasEncumbrance ? 'Secret Overdraft' : 'Confirmed Clean'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-sans block">Forensic Trust:</span>
                  <span className="font-bold text-slate-800 block">{activeInstrument.forensics.trustScore}% Trust</span>
                </div>
              </div>
            </div>

            {/* Historical Notes Audit Trail */}
            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between">
                <span>Historical e-Office Notes ({activeInstrument.greenSheetNotes.length})</span>
                <span className="font-mono text-[10px] text-slate-400">Chronological</span>
              </div>

              {activeInstrument.greenSheetNotes.length === 0 ? (
                <div className="p-4 bg-stone-50 border border-stone-200 rounded text-center text-xs text-slate-500">
                  No prior green sheet notes recorded for this instrument. Click "Digitally Sign & Dispatch" on the left to append the initial administrative note.
                </div>
              ) : (
                activeInstrument.greenSheetNotes.map((note) => (
                  <div
                    key={note.id}
                    className="green-sheet p-3.5 rounded-sm border border-[#B7D5C4] text-xs font-serif text-slate-800 shadow-2xs space-y-2"
                  >
                    <div className="flex items-center justify-between border-b border-[#B7D5C4]/60 pb-1.5 text-[11px]">
                      <span className="font-bold text-emerald-950">{note.author}</span>
                      <span className="font-mono text-slate-600">{formatGovDate(note.date)}</span>
                    </div>
                    <div className="text-[10px] text-slate-600 font-sans">
                      {note.designation} • {note.office}
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-900 whitespace-pre-line font-serif">
                      {note.noteContent}
                    </p>
                    <div className="pt-2 border-t border-[#B7D5C4]/60 flex items-center justify-between text-[10px] font-mono">
                      <span className="bg-emerald-100 text-emerald-900 px-1.5 py-0.5 rounded font-semibold font-sans">
                        {note.recommendedAction}
                      </span>
                      <span className="text-emerald-800 flex items-center gap-1 font-semibold truncate max-w-[170px]">
                        <Check className="w-3 h-3 text-emerald-600" />
                        {note.digitalSignature}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>

        </div>
      </div>

    </div>
  );
};

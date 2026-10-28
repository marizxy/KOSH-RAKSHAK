import React, { useState } from 'react';
import { FDRInstrument } from '../types';
import { formatInr, formatGovDate } from '../utils/formatters';
import { 
  Scale, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  ExternalLink, 
  ShieldAlert, 
  RefreshCw, 
  Lock, 
  Unlock, 
  Gavel, 
  Landmark, 
  Check, 
  X,
  FileCheck
} from 'lucide-react';

interface GhostEncumbranceScannerProps {
  currentInstrument: FDRInstrument;
  onUpdateInstrument: (updated: FDRInstrument) => void;
  userRole?: string;
}

export const GhostEncumbranceScanner: React.FC<GhostEncumbranceScannerProps> = ({
  currentInstrument,
  onUpdateInstrument,
  userRole = 'regional',
}) => {
  const [isSyncingNjdg, setIsSyncingNjdg] = useState(false);
  const [syncComplete, setSyncComplete] = useState(false);
  const [showClearanceModal, setShowClearanceModal] = useState(false);
  const [clearanceRemarks, setClearanceRemarks] = useState('');
  const [courtNocRef, setCourtNocRef] = useState('');

  const ghost = currentInstrument.ghostEncumbrance;
  const hasHold = ghost.hasLitigationHold && !ghost.clearedByOfficer;

  // Simulate live e-Courts / NJDG API synchronization
  const handleTriggerNjdgSync = () => {
    setIsSyncingNjdg(true);
    setSyncComplete(false);
    setTimeout(() => {
      setIsSyncingNjdg(false);
      setSyncComplete(true);
      const updated = {
        ...currentInstrument,
        ghostEncumbrance: {
          ...currentInstrument.ghostEncumbrance,
          njdgSyncTimestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' IST (NJDG Live Query)',
        },
      };
      onUpdateInstrument(updated);
    }, 1200);
  };

  // Regional Scrutiny Officer clears the legal hold upon verification of court NOC
  const handleClearLegalHold = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clearanceRemarks || !courtNocRef) return;

    const updated: FDRInstrument = {
      ...currentInstrument,
      ghostEncumbrance: {
        ...currentInstrument.ghostEncumbrance,
        clearedByOfficer: true,
        clearedAt: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' IST',
        clearedRemarks: clearanceRemarks,
      },
      fiveGates: {
        ...currentInstrument.fiveGates,
        gate4ZeroLegalHold: true,
        gate4Details: `PASS: Court Stay cleared by Regional Scrutiny Officer (NOC Ref: ${courtNocRef})`,
      },
    };
    onUpdateInstrument(updated);
    setShowClearanceModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-[#FFFFFF] border border-[#D4D1C7] p-4 rounded-sm shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Gavel className="w-5 h-5 text-[#14532D]" />
              <h2 className="text-base font-bold text-slate-900">
                AI "Ghost Encumbrance" & Legal Litigations Scanner
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Natural Language Processing (NLP) affidavit analyzer cross-referenced against e-Courts & National Judicial Data Grid (NJDG) APIs
            </p>
          </div>

          <button
            onClick={handleTriggerNjdgSync}
            disabled={isSyncingNjdg}
            className={`px-3 py-1.5 text-xs font-semibold rounded flex items-center gap-2 transition-all ${
              isSyncingNjdg
                ? 'bg-slate-300 text-slate-600 cursor-not-allowed'
                : 'bg-stone-800 hover:bg-stone-900 text-white shadow-xs'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncingNjdg ? 'animate-spin' : ''}`} />
            <span>{isSyncingNjdg ? 'Querying e-Courts / NJDG API...' : 'Trigger Live NJDG / e-Courts API Sync'}</span>
          </button>
        </div>
      </div>

      {/* High-Visibility Crimson Alert Card (If Court Attachment Detected) */}
      {hasHold ? (
        <div className="bg-red-50 border-2 border-red-500 rounded-sm p-4 text-xs text-red-950 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-6 h-6 text-red-700 shrink-0 mt-0.5 animate-pulse" />
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-sm text-red-900 uppercase tracking-wide">
                    CRITICAL: Legal Dispute / Ghost Encumbrance Detected via Affidavit Analysis & e-Courts API Match
                  </span>
                  <span className="bg-red-700 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded">
                    APPROVAL WORKFLOW LOCKED
                  </span>
                </div>

                <p className="text-slate-800 leading-relaxed font-sans text-xs">
                  <strong>Judicial Attachment Warning:</strong> e-Courts / NJDG registry cross-check has flagged an active judicial attachment or interim injunction order on institutional movable/fixed assets. The college's self-declaration Form 14 Affidavit of Non-Encumbrance contradicts live judicial records.
                </p>

                <div className="bg-white border border-red-300 p-2.5 rounded font-mono text-[11px] space-y-1 text-slate-800">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-sans">Active Case Number:</span>
                    <strong className="text-red-900">{ghost.caseNumber}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-sans">Court Jurisdiction:</span>
                    <span>{ghost.courtName}</span>
                  </div>
                  {ghost.petitioner && (
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-sans">Petitioner / Creditor:</span>
                      <span className="text-slate-700 truncate max-w-[280px]">{ghost.petitioner}</span>
                    </div>
                  )}
                  <div className="pt-1 text-red-800 font-sans text-[11px] border-t border-red-200">
                    <strong>Attachment Directive:</strong> {ghost.stayDetails}
                  </div>
                </div>

                <div className="text-[10px] font-mono text-slate-500">
                  Last Synced: {ghost.njdgSyncTimestamp}
                </div>
              </div>
            </div>

            {/* Clearance CTA for Regional Scrutiny Officer / Bureau Head */}
            {(userRole === 'regional' || userRole === 'bureau' || userRole === 'REGIONAL_OFFICER' || userRole === 'BUREAU_HEAD') && (
              <button
                onClick={() => setShowClearanceModal(true)}
                className="px-3 py-2 bg-red-800 hover:bg-red-900 text-white rounded text-xs font-bold whitespace-nowrap shadow flex items-center gap-1.5 self-start shrink-0 transition-colors"
              >
                <Unlock className="w-3.5 h-3.5" />
                <span>Review & Clear Legal Hold</span>
              </button>
            )}
          </div>
        </div>
      ) : ghost.clearedByOfficer ? (
        <div className="bg-emerald-50 border border-emerald-300 rounded p-3 text-xs text-emerald-950 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
            <div>
              <span className="font-bold text-emerald-900">
                LEGAL HOLD CLEARED BY REGIONAL SCRUTINY OFFICER:
              </span>
              <span className="ml-1 text-slate-700">{ghost.clearedRemarks}</span>
            </div>
          </div>
          <span className="font-mono text-[10px] text-emerald-800 shrink-0">
            Cleared at: {ghost.clearedAt}
          </span>
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-300 rounded p-3 text-xs text-emerald-950 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
            <div>
              <span className="font-bold text-emerald-900">
                NJDG & e-Courts Registry Clean:
              </span>
              <span className="ml-1 text-slate-700">
                Zero active court attachments, stays, or commercial debt recoveries flagged against this institutional ID.
              </span>
            </div>
          </div>
          <span className="font-mono text-[10px] text-emerald-800 shrink-0">
            Synced: {ghost.njdgSyncTimestamp}
          </span>
        </div>
      )}

      {/* Two-Column Deep-Dive: Affidavit NLP Analyzer vs Live NJDG Query */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Left: Form 14 Legal Undertaking / Affidavit NLP Analyzer */}
        <div className="bg-[#FFFFFF] border border-[#D4D1C7] rounded-sm p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-slate-600" />
                Institutional Form 14 Legal Undertaking & Affidavit
              </span>
              <span className="text-[10px] bg-blue-100 text-blue-800 font-mono font-semibold px-2 py-0.5 rounded">
                NLP Clause Scanned
              </span>
            </div>

            <div className="bg-stone-50 border border-stone-300 p-3 rounded font-serif text-xs text-slate-800 space-y-2 leading-relaxed">
              <div className="text-center font-sans font-bold text-slate-900 border-b border-stone-200 pb-1 text-[11px] uppercase">
                AFFIDAVIT ON NON-JUDICIAL STAMP PAPER (RS. 100)
              </div>
              <p>
                "I, the Secretary/Chairman of the sponsoring trust of <strong>{currentInstrument.institutionName}</strong>, do hereby solemnly affirm and declare that the Fixed Deposit Receipt #{currentInstrument.fdrNumber} for {formatInr(currentInstrument.principalAmount)} is free from all encumbrances, liens, or court attachments of any nature whatsoever..."
              </p>
              
              {hasHold && (
                <div className="p-2 bg-red-100/80 border border-red-300 rounded font-sans text-xs text-red-900 font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-red-700 shrink-0" />
                  <span>NLP MISMATCH DETECTED: Affirmation of zero encumbrances directly contradicted by e-Courts API finding.</span>
                </div>
              )}

              <p className="text-[11px] text-slate-600 italic">
                "...and that no third-party claims or debt recovery proceedings exist against the corpus pledged to AICTE."
              </p>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-stone-200 text-[10px] font-mono text-slate-500 flex justify-between">
            <span>Affidavit Hash: SHA256-AFF-0912</span>
            <span>NLP Semantic Confidence: 98.4%</span>
          </div>
        </div>

        {/* Right: National Judicial Data Grid (NJDG) Live Query Node */}
        <div className="bg-[#FFFFFF] border border-[#D4D1C7] rounded-sm p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Landmark className="w-4 h-4 text-slate-600" />
                NJDG & e-Courts Registry Cross-Reference
              </span>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                hasHold ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {hasHold ? 'LITIGATION HOLD ACTIVE' : 'ZERO DISPUTES MATCHED'}
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="bg-stone-50 p-2 rounded border border-stone-200">
                <div className="text-[10px] text-slate-500 font-sans">Query Target:</div>
                <div className="font-bold text-slate-900">{currentInstrument.institutionName}</div>
                <div className="text-[10px] text-slate-600">AICTE ID: {currentInstrument.institutionId} • State: {currentInstrument.region} Office</div>
              </div>

              <div className="bg-stone-50 p-2 rounded border border-stone-200">
                <div className="text-[10px] text-slate-500 font-sans">Connected Judicial Endpoints:</div>
                <div className="text-[11px] text-slate-700">
                  • High Courts of Judicature (e-Courts API v2)<br />
                  • District Commercial Courts & Debt Recovery Tribunals (DRT)<br />
                  • SARFAESI Asset Attachment Register (CERSAI)
                </div>
              </div>

              {hasHold && (
                <div className="p-2 bg-red-50 border border-red-300 rounded text-red-900 text-xs font-sans">
                  <strong>Statutory Impact under APH 1.4(d):</strong> When an FDR or institutional bank account is subject to court attachment, AICTE cannot enforce exclusive regulatory lien. Approval renewal or release order generation is suspended.
                </div>
              )}
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-stone-200 text-[10px] font-mono text-slate-500 flex justify-between">
            <span>Server: NJDG-GATEWAY-NIC-DELHI</span>
            <span>Status: 200 OK</span>
          </div>
        </div>

      </div>

      {/* MODAL: Regional Scrutiny Officer Legal Clearance Form */}
      {showClearanceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#FFFFFF] border-2 border-slate-700 rounded shadow-2xl max-w-lg w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center gap-2">
                <Gavel className="w-5 h-5 text-red-800" />
                <h3 className="font-bold text-sm text-slate-900">
                  Regional Scrutiny Officer Legal Clearance Desk
                </h3>
              </div>
              <button
                onClick={() => setShowClearanceModal(false)}
                className="p-1 text-slate-400 hover:text-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleClearLegalHold} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Court Certified NOC / Stay Vacation Order Reference *
                </label>
                <input
                  type="text"
                  required
                  value={courtNocRef}
                  onChange={(e) => setCourtNocRef(e.target.value)}
                  placeholder="e.g., Allahabad HC Order dt. 20-Oct-2026 in IA 02/2026"
                  className="w-full text-xs font-mono bg-white border border-[#D4D1C7] rounded p-2 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Scrutiny Findings & Legal Officer Justification *
                </label>
                <textarea
                  required
                  rows={4}
                  value={clearanceRemarks}
                  onChange={(e) => setClearanceRemarks(e.target.value)}
                  placeholder="Record formal reasons why this interim dispute does not encumber the AICTE security corpus..."
                  className="w-full text-xs font-sans bg-white border border-[#D4D1C7] rounded p-2 focus:outline-hidden"
                />
              </div>

              <div className="p-2.5 bg-amber-50 border border-amber-300 rounded text-[11px] text-amber-950">
                <strong>Statutory Undertaking:</strong> By issuing clearance, the Scrutiny Officer affirms that certified judicial documentation has been verified and Member Secretary AICTE's lien remains senior and unencumbered.
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowClearanceModal(false)}
                  className="px-3 py-1.5 bg-stone-200 text-slate-700 rounded font-medium text-xs hover:bg-stone-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#14532D] text-white rounded font-bold text-xs hover:bg-[#15803D]"
                >
                  Clear Legal Hold & Update Gate 4
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

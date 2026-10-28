import React, { useState } from 'react';
import { FDRInstrument } from '../types';
import { formatInr, formatGovDate } from '../utils/formatters';
import { GhostEncumbranceScanner } from './GhostEncumbranceScanner';
import { 
  Gavel, 
  Scale, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  RefreshCw, 
  Lock, 
  Unlock, 
  ShieldAlert, 
  ShieldCheck, 
  Building2, 
  Landmark,
  Eye,
  FileCheck,
  Check,
  X
} from 'lucide-react';

interface HqNationalLitigationMonitorProps {
  instruments: FDRInstrument[];
  onUpdateInstrument: (updated: FDRInstrument) => void;
}

export const HqNationalLitigationMonitor: React.FC<HqNationalLitigationMonitorProps> = ({
  instruments,
  onUpdateInstrument,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHoldFilter, setSelectedHoldFilter] = useState<'ALL' | 'HOLDS_ONLY' | 'CLEAN'>('ALL');
  const [isSyncingAll, setIsSyncingAll] = useState(false);
  const [syncSuccessMsg, setSyncSuccessMsg] = useState<string | null>(null);
  const [selectedInstForInspection, setSelectedInstForInspection] = useState<FDRInstrument | null>(null);

  // Compute litigation counts
  const totalAffidavitsScanned = instruments.length;
  const courtStaysCount = instruments.filter(
    (i) => i.ghostEncumbrance.hasLitigationHold && !i.ghostEncumbrance.clearedByOfficer
  ).length;
  const cbsOverdraftsCount = instruments.filter((i) => i.bankCbs.hasEncumbrance).length;
  const mandateLoopholesCount = instruments.filter((i) => i.hasEitherSurvivorClause).length;

  // Filtered list
  const filteredList = instruments.filter((item) => {
    const matchesSearch =
      item.institutionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.fdrNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.institutionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.ghostEncumbrance.caseNumber && item.ghostEncumbrance.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()));

    const hasAnyLegalIssue =
      item.ghostEncumbrance.hasLitigationHold ||
      item.bankCbs.hasEncumbrance ||
      item.hasEitherSurvivorClause;

    if (selectedHoldFilter === 'HOLDS_ONLY') return matchesSearch && hasAnyLegalIssue;
    if (selectedHoldFilter === 'CLEAN') return matchesSearch && !hasAnyLegalIssue;
    return matchesSearch;
  });

  // Trigger live nationwide NJDG sync
  const handleTriggerNationwideNjdgSync = () => {
    setIsSyncingAll(true);
    setSyncSuccessMsg(null);
    setTimeout(() => {
      setIsSyncingAll(false);
      setSyncSuccessMsg('✓ NJDG & e-Courts National Registry Sync Complete: Cross-referenced 24 High Courts, 39 Debt Recovery Tribunals (DRT), and public encumbrance registries.');
      setTimeout(() => setSyncSuccessMsg(null), 6000);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      
      {/* Exclusive HQ Header Banner */}
      <div className="bg-[#FFFFFF] border-2 border-stone-800 rounded-sm p-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded bg-stone-100 border border-stone-400 flex items-center justify-center shrink-0 mt-0.5">
              <Gavel className="w-6 h-6 text-slate-900" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold bg-slate-900 text-white px-2 py-0.5 rounded uppercase">
                  EXCLUSIVE HQ MODULE 3 • SUPER ADMIN SURVEILLANCE
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  Central Legal Surveillance Desk • AICTE HQ New Delhi
                </span>
              </div>
              <h2 className="text-base font-bold text-slate-900 mt-0.5">
                National Litigation & AI "Ghost Encumbrance" Surveillance Monitor
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Natural Language Processing (NLP) affidavit analyzer cross-referenced nationwide against simulated e-Courts and National Judicial Data Grid (NJDG) APIs
              </p>
            </div>
          </div>

          <button
            onClick={handleTriggerNationwideNjdgSync}
            disabled={isSyncingAll}
            className={`px-4 py-2 text-xs font-bold rounded flex items-center gap-2 transition-all shadow-xs self-start md:self-auto ${
              isSyncingAll
                ? 'bg-slate-300 text-slate-600 cursor-not-allowed'
                : 'bg-stone-800 hover:bg-stone-900 text-white'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncingAll ? 'animate-spin' : ''}`} />
            <span>{isSyncingAll ? 'Syncing 24 High Courts & DRTs...' : 'Trigger Nationwide NJDG & e-Courts Sync'}</span>
          </button>
        </div>
      </div>

      {syncSuccessMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded text-xs text-emerald-900 font-mono font-semibold flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{syncSuccessMsg}</span>
        </div>
      )}

      {/* Top Legal Health Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        {/* KPI 1 */}
        <div className="bg-[#FFFFFF] border border-[#D4D1C7] p-4 rounded-sm shadow-xs border-l-4 border-l-[#14532D]">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs uppercase font-semibold tracking-wider">Form 14 Affidavits Scanned</span>
            <FileText className="w-4 h-4 text-[#14532D]" />
          </div>
          <div className="rupee-mono text-2xl font-bold text-slate-900">
            {totalAffidavitsScanned} / {instruments.length}
          </div>
          <div className="text-[11px] text-slate-600 mt-1 flex items-center justify-between">
            <span>NLP Semantic Confidence</span>
            <span className="text-emerald-700 font-mono font-bold">98.4%</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-[#FFFFFF] border border-[#D4D1C7] p-4 rounded-sm shadow-xs border-l-4 border-l-red-600">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs uppercase font-semibold tracking-wider">High Court Stays / Attachments</span>
            <Gavel className="w-4 h-4 text-red-600" />
          </div>
          <div className="rupee-mono text-2xl font-bold text-red-700">
            {courtStaysCount}
          </div>
          <div className="text-[11px] text-red-700 mt-1 flex items-center justify-between">
            <span>WP(C) 4182/2025 (Allahabad HC)</span>
            <span className="text-[10px] bg-red-100 text-red-800 px-1 rounded font-bold">LOCKED</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-[#FFFFFF] border border-[#D4D1C7] p-4 rounded-sm shadow-xs border-l-4 border-l-orange-600">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs uppercase font-semibold tracking-wider">Secret Bank Loan Liens</span>
            <Landmark className="w-4 h-4 text-orange-600" />
          </div>
          <div className="rupee-mono text-2xl font-bold text-orange-700">
            {cbsOverdraftsCount}
          </div>
          <div className="text-[11px] text-slate-600 mt-1 flex items-center justify-between">
            <span>₹22L Overdraft (BOB-992318)</span>
            <span className="text-orange-800 font-mono font-bold">Lien Broken</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-[#FFFFFF] border border-[#D4D1C7] p-4 rounded-sm shadow-xs border-l-4 border-l-amber-600">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs uppercase font-semibold tracking-wider">Title Mandate Loopholes</span>
            <Scale className="w-4 h-4 text-amber-700" />
          </div>
          <div className="rupee-mono text-2xl font-bold text-amber-800">
            {mandateLoopholesCount}
          </div>
          <div className="text-[11px] text-slate-600 mt-1 flex items-center justify-between">
            <span>Either or Survivor (CNB-772190)</span>
            <span className="text-amber-800 font-mono font-bold">Rectify Mandate</span>
          </div>
        </div>

      </div>

      {/* Main National Legal Table */}
      <div className="bg-[#FFFFFF] border border-[#D4D1C7] rounded-sm shadow-xs overflow-hidden">
        <div className="p-4 bg-[#F8F7F4] border-b border-[#D4D1C7] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="font-bold text-sm text-slate-900">
              National Institutional Legal Status & Encumbrance Register
            </h3>
            <p className="text-xs text-slate-500">
              All 10 institutions cross-referenced between sworn Form 14 affidavits, Bank CBS records, and simulated NJDG API queries
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 bg-white p-0.5 rounded border border-[#D4D1C7] text-xs">
              <button
                onClick={() => setSelectedHoldFilter('ALL')}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                  selectedHoldFilter === 'ALL' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All (10)
              </button>
              <button
                onClick={() => setSelectedHoldFilter('HOLDS_ONLY')}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                  selectedHoldFilter === 'HOLDS_ONLY' ? 'bg-red-700 text-white' : 'text-red-700 hover:bg-red-50'
                }`}
              >
                Legal Holds / Flags (3)
              </button>
              <button
                onClick={() => setSelectedHoldFilter('CLEAN')}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                  selectedHoldFilter === 'CLEAN' ? 'bg-emerald-700 text-white' : 'text-emerald-700 hover:bg-emerald-50'
                }`}
              >
                Clean (7)
              </button>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search college, case, court..."
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
                <th>Sworn Form 14 Affidavit</th>
                <th>e-Courts / NJDG Finding</th>
                <th>Bank CBS Encumbrance</th>
                <th>Legal Hold Status</th>
                <th className="text-right">Inspection & Scrutiny</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.map((item) => {
                const ghost = item.ghostEncumbrance;
                const hasHold = ghost.hasLitigationHold && !ghost.clearedByOfficer;

                return (
                  <tr key={item.id} className="transition-colors hover:bg-stone-50">
                    
                    {/* Institution */}
                    <td className="max-w-[220px]">
                      <div className="font-bold text-slate-900 text-xs truncate">
                        {item.institutionName}
                      </div>
                      <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                        FDR: {item.fdrNumber} • {item.region} Office
                      </div>
                    </td>

                    {/* Affidavit NLP */}
                    <td>
                      <div className="flex items-center gap-1.5 text-xs">
                        <FileCheck className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                        <span className="font-semibold text-slate-800">Form 14 Affirmation</span>
                      </div>
                      <div className="text-[11px] text-slate-500 truncate max-w-[200px]">
                        {ghost.affidavitSummary || 'Solemnly affirmed zero encumbrances or court attachments.'}
                      </div>
                    </td>

                    {/* NJDG Finding */}
                    <td className="max-w-[220px]">
                      {hasHold ? (
                        <div>
                          <div className="inline-flex items-center gap-1 text-red-800 font-bold text-xs">
                            <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                            <span>{ghost.caseNumber}</span>
                          </div>
                          <div className="text-[10px] text-slate-600 truncate mt-0.5" title={ghost.stayDetails}>
                            {ghost.courtName}
                          </div>
                        </div>
                      ) : ghost.clearedByOfficer ? (
                        <div className="text-xs text-emerald-800">
                          <span className="font-bold">Hold Cleared by Officer</span>
                          <div className="text-[10px] text-slate-500">{ghost.clearedRemarks}</div>
                        </div>
                      ) : (
                        <div className="text-xs text-emerald-700 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>0 Court Matches (Clean)</span>
                        </div>
                      )}
                    </td>

                    {/* Bank CBS Encumbrance */}
                    <td>
                      {item.bankCbs.hasEncumbrance ? (
                        <span className="bg-orange-100 text-orange-900 border border-orange-300 px-2 py-0.5 rounded text-[10px] font-bold">
                          SECRET OVERDRAFT DETECTED
                        </span>
                      ) : item.hasEitherSurvivorClause ? (
                        <span className="bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded text-[10px] font-bold">
                          EITHER-OR-SURVIVOR DEFECT
                        </span>
                      ) : (
                        <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 px-2 py-0.5 rounded text-[10px] font-bold">
                          ZERO CBS ENCUMBRANCE
                        </span>
                      )}
                    </td>

                    {/* Legal Hold Status */}
                    <td>
                      {hasHold ? (
                        <span className="inline-flex items-center gap-1 bg-red-700 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded shadow-xs animate-pulse">
                          <Lock className="w-3 h-3 text-white" />
                          <span>LOCKED (STAY ORDER)</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-300 font-mono text-[10px] font-bold px-2 py-0.5 rounded">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>CLEAR TO PROCEED</span>
                        </span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="text-right whitespace-nowrap">
                      <button
                        onClick={() => setSelectedInstForInspection(item)}
                        className="px-2.5 py-1 text-xs bg-stone-100 hover:bg-stone-200 border border-[#D4D1C7] rounded text-slate-700 font-medium inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Legal Finding</span>
                      </button>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deep-Dive Inspection Modal */}
      {selectedInstForInspection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-[#FFFFFF] border-2 border-slate-700 rounded shadow-2xl max-w-4xl w-full my-8 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center gap-2">
                <Gavel className="w-5 h-5 text-slate-900" />
                <h3 className="font-bold text-sm text-slate-900">
                  National Legal Finding & Form 14 Affidavit Dossier
                </h3>
              </div>
              <button
                onClick={() => setSelectedInstForInspection(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <GhostEncumbranceScanner
              currentInstrument={selectedInstForInspection}
              onUpdateInstrument={(updated) => {
                onUpdateInstrument(updated);
                setSelectedInstForInspection(updated);
              }}
              userRole="bureau"
            />

            <div className="flex justify-end pt-2 border-t border-slate-200">
              <button
                onClick={() => setSelectedInstForInspection(null)}
                className="px-4 py-1.5 text-xs bg-slate-800 text-white rounded hover:bg-slate-900 font-medium"
              >
                Close Legal Dossier
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

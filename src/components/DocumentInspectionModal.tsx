import React, { useState } from 'react';
import { FDRInstrument } from '../types';
import { formatInr, formatGovDate } from '../utils/formatters';
import { X, Eye, ShieldAlert, CheckCircle2, FileText, Landmark, Stamp, Sparkles } from 'lucide-react';

interface DocumentInspectionModalProps {
  instrument: FDRInstrument | null;
  onClose: () => void;
}

export const DocumentInspectionModal: React.FC<DocumentInspectionModalProps> = ({
  instrument,
  onClose,
}) => {
  if (!instrument) return null;

  const [elaOverlay, setElaOverlay] = useState(instrument.forensics.elaTamperingDetected);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#FFFFFF] border-2 border-[#D4D1C7] rounded shadow-2xl max-w-4xl w-full my-8 overflow-hidden">
        
        {/* Top Header */}
        <div className="bg-[#16202A] text-white p-4 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-amber-400" />
            <div>
              <div className="text-[10px] uppercase font-mono tracking-wider text-amber-400 font-semibold">
                AICTE Official Instrument Scrutiny File
              </div>
              <h3 className="font-bold text-base leading-tight">
                {instrument.fdrNumber} — {instrument.institutionName}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setElaOverlay(!elaOverlay)}
              className={`px-2.5 py-1 text-xs rounded font-semibold transition-all flex items-center gap-1.5 ${
                elaOverlay
                  ? 'bg-red-700 text-white animate-pulse'
                  : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-600'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>ELA Heatmap: {elaOverlay ? 'ON' : 'OFF'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#F5F4F0]">
          
          {/* Left: Rendered Receipt */}
          <div className="bg-[#FFFDF7] border-2 border-slate-400 p-4 rounded-sm font-serif text-slate-900 shadow-md relative">
            <div className="text-center border-b border-slate-800 pb-2 mb-3">
              <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-slate-600">
                {instrument.bankName}
              </span>
              <div className="font-sans text-xs font-semibold text-slate-800">
                {instrument.branchName} • IFSC: {instrument.ifscCode}
              </div>
              <div className="text-[11px] font-sans font-bold uppercase mt-1 bg-stone-100 py-0.5 border-y border-stone-300">
                FIXED DEPOSIT RECEIPT • {instrument.fdrNumber}
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between border-b border-stone-200 pb-1">
                <span className="text-slate-500 font-sans">Institution:</span>
                <span className="font-bold text-slate-900 font-sans truncate max-w-[200px]">{instrument.institutionName}</span>
              </div>
              
              <div className="flex justify-between border-b border-stone-200 pb-1">
                <span className="text-slate-500 font-sans">AICTE Permanent ID:</span>
                <span className="font-mono font-bold text-slate-900">{instrument.institutionId}</span>
              </div>

              {/* Principal Box */}
              <div className="relative p-2 bg-stone-50 border border-stone-300 rounded">
                <div className="flex justify-between items-center">
                  <span className="font-sans font-bold text-slate-700">Principal Deposit:</span>
                  <span className="rupee-mono font-bold text-base text-slate-950">
                    {formatInr(instrument.principalAmount)}
                  </span>
                </div>

                {elaOverlay && instrument.forensics.elaTamperingDetected && (
                  <div className="absolute inset-0 bg-red-600/35 border-2 border-red-600 rounded flex items-center justify-between px-2 text-white font-sans text-[10px] font-bold animate-pulse">
                    <span>ELA Compression Artifact: Tampered Digit</span>
                    <span>Err: 94%</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 border-b border-stone-200 pb-1">
                <div>
                  <span className="text-slate-500 font-sans">Issue Date:</span>
                  <div className="font-mono font-bold">{formatGovDate(instrument.issueDate)}</div>
                </div>
                <div>
                  <span className="text-slate-500 font-sans">Maturity Date:</span>
                  <div className="font-mono font-bold">{formatGovDate(instrument.maturityDate)}</div>
                </div>
              </div>

              <div className="p-2 bg-amber-50 border border-amber-300 rounded text-[11px] font-sans">
                <div className="font-bold uppercase text-amber-900 text-[10px]">Lien Pledge Endorsement:</div>
                <div className={`mt-0.5 leading-tight ${instrument.hasEitherSurvivorClause ? 'text-red-700 font-bold' : 'text-slate-800'}`}>
                  "{instrument.lienPledgeClause}"
                </div>
              </div>

              <div className="text-[10px] font-mono text-slate-400 pt-2 flex justify-between">
                <span>SHA-256 Digest: {instrument.sha256Hash.substring(0, 16)}...</span>
                <span className="text-emerald-800 font-bold">CBS Linked</span>
              </div>
            </div>
          </div>

          {/* Right: Technical Verification Summary */}
          <div className="space-y-3.5">
            
            {/* Trust Score Box */}
            <div className="bg-white border border-[#D4D1C7] p-3 rounded shadow-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Document Integrity Trust Score
                </span>
                <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                  instrument.forensics.trustScore > 85 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                }`}>
                  {instrument.forensics.trustScore}% Trust
                </span>
              </div>
              <div className="w-full bg-stone-200 h-2 rounded overflow-hidden">
                <div
                  style={{ width: `${instrument.forensics.trustScore}%` }}
                  className={`h-full ${instrument.forensics.trustScore > 85 ? 'bg-emerald-600' : 'bg-red-600'}`}
                />
              </div>
            </div>

            {/* Actuarial Check Box */}
            <div className="bg-white border border-[#D4D1C7] p-3 rounded shadow-xs text-xs space-y-1.5 font-mono">
              <div className="font-bold text-slate-800 font-sans border-b border-stone-200 pb-1">
                Actuarial Indian Compounding Check
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Printed Maturity:</span>
                <span className="font-bold text-slate-900">{formatInr(instrument.printedMaturityAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Math Expected:</span>
                <span className={`font-bold ${instrument.forensics.mathMismatch ? 'text-red-700' : 'text-emerald-700'}`}>
                  {formatInr(instrument.mathExpectedMaturity)}
                </span>
              </div>
              {instrument.forensics.mathMismatch && (
                <div className="text-red-700 font-bold bg-red-50 p-1.5 rounded font-sans text-[11px]">
                  ⚠️ Mathematical Forgery Caught: Discrepancy delta of {formatInr(instrument.forensics.mathDiscrepancyDelta || 0)}.
                </div>
              )}
            </div>

            {/* CBS Verification Box */}
            <div className="bg-white border border-[#D4D1C7] p-3 rounded shadow-xs text-xs space-y-1 font-mono">
              <div className="font-bold text-slate-800 font-sans border-b border-stone-200 pb-1 flex justify-between">
                <span>Bank CBS Direct Ledger</span>
                <span className={instrument.bankCbs.hasEncumbrance ? 'text-red-700 font-bold' : 'text-emerald-700 font-bold'}>
                  {instrument.bankCbs.hasEncumbrance ? 'ENCUMBERED' : 'UNENCUMBERED'}
                </span>
              </div>
              <div className="text-[11px] text-slate-600 font-sans mt-1">
                {instrument.bankCbs.remarks}
              </div>
              {instrument.bankCbs.overdraftLoanAmount && (
                <div className="text-red-800 font-bold bg-red-100 p-1 rounded font-sans text-[11px]">
                  Active Overdraft Sanction: {formatInr(instrument.bankCbs.overdraftLoanAmount)}
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-[#EAE8E1] px-6 py-3 border-t border-[#D4D1C7] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs bg-slate-800 text-white rounded hover:bg-slate-900 font-medium"
          >
            Close Scrutiny File
          </button>
        </div>

      </div>
    </div>
  );
};

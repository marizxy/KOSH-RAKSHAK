import React, { useState } from 'react';
import { FDRInstrument } from '../types';
import { formatGovDate, formatInr, getDaysRemaining } from '../utils/formatters';
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
  AlertTriangle
} from 'lucide-react';

interface EoaFreezingMatrixProps {
  instruments: FDRInstrument[];
  simulatedDate: string;
  onUpdateInstrument: (updated: FDRInstrument) => void;
  userRole?: string;
  onOpenRenewalForInstrument?: (inst: FDRInstrument) => void;
}

export const EoaFreezingMatrix: React.FC<EoaFreezingMatrixProps> = ({
  instruments,
  simulatedDate,
  onUpdateInstrument,
  userRole = 'bureau',
  onOpenRenewalForInstrument,
}) => {
  const [selectedInstForCertificate, setSelectedInstForCertificate] = useState<FDRInstrument | null>(null);

  // Compute live EoA status based on days remaining and simulated date
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

  // Toggle freeze / unfreeze manually for Bureau Head
  const handleToggleFreeze = (inst: FDRInstrument) => {
    const nextState = !inst.eoaStatus.isFrozen;
    const updated: FDRInstrument = {
      ...inst,
      eoaStatus: {
        ...inst.eoaStatus,
        isFrozen: nextState,
        freezeReason: nextState ? 'Manual Administrative Freeze imposed by Bureau Head' : undefined,
        canDownload: !nextState,
      },
    };
    onUpdateInstrument(updated);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-[#FFFFFF] border border-[#D4D1C7] p-4 rounded-sm shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <AlertOctagon className="w-5 h-5 text-red-700" />
              <h2 className="text-base font-bold text-slate-900">
                Automated AICTE EoA (Extension of Approval) Direct Freezing Matrix
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Programmatic statutory enforcement: autonomously withholds academic year approval certificates upon deposit lapse or unrenewed FDR
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="bg-red-100 text-red-900 px-2.5 py-1 rounded border border-red-300 font-bold">
              {frozenCount} EoA Certificates Frozen
            </span>
            <span className="bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded border border-emerald-300 font-bold">
              {activeCount} Active & Issued
            </span>
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

      {/* EoA Freezing Ledger Table */}
      <div className="bg-[#FFFFFF] border border-[#D4D1C7] rounded-sm shadow-xs overflow-hidden">
        <div className="p-4 bg-[#F8F7F4] border-b border-[#D4D1C7] flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900">
            Institutional EoA Certificate Status Matrix (Academic Year 2027–28)
          </h3>
          <span className="text-xs text-slate-500 font-mono">
            Evaluated Date: {simulatedDate}
          </span>
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
                <th className="text-right">Certificate & Actions</th>
              </tr>
            </thead>
            <tbody>
              {evaluatedInstitutions.map((item) => (
                <tr key={item.id} className="transition-colors">
                  <td className="max-w-[220px]">
                    <div className="font-bold text-slate-900 text-xs truncate">
                      {item.institutionName}
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                      ID: {item.institutionId} • {item.region} Office
                    </div>
                  </td>

                  <td>
                    <div className="font-mono text-xs font-bold text-slate-900">
                      {item.fdrNumber}
                    </div>
                    <div className="text-[11px] text-slate-600">
                      {item.bankName} ({formatInr(item.principalAmount)})
                    </div>
                  </td>

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

                  <td className="max-w-[260px] text-xs">
                    {item.liveEoaFrozen ? (
                      <div className="text-red-900 font-semibold font-sans text-[11px] leading-tight">
                        {item.liveFreezeReason || 'Unresolved Regulatory Deficiency Hold'}
                      </div>
                    ) : (
                      <div className="text-emerald-800 font-mono text-[11px]">
                        ✓ All regulatory deposit norms satisfied
                      </div>
                    )}
                  </td>

                  <td className="text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedInstForCertificate(item)}
                        className={`px-2.5 py-1 text-xs rounded font-medium flex items-center gap-1 transition-colors ${
                          item.liveEoaFrozen
                            ? 'bg-red-50 text-red-800 border border-red-300 hover:bg-red-100'
                            : 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                        }`}
                      >
                        <FileCheck className="w-3.5 h-3.5" />
                        <span>{item.liveEoaFrozen ? 'Inspect Frozen EoA' : 'View Certificate'}</span>
                      </button>

                      {/* Bureau Head Emergency Override Toggle */}
                      {(userRole === 'bureau' || userRole === 'BUREAU_HEAD') && (
                        <button
                          onClick={() => handleToggleFreeze(item)}
                          className="p-1 bg-stone-100 hover:bg-stone-200 border border-[#D4D1C7] rounded text-slate-700"
                          title={item.liveEoaFrozen ? 'Administrative Override Unfreeze' : 'Impose Administrative Freeze'}
                        >
                          {item.liveEoaFrozen ? <Unlock className="w-3.5 h-3.5 text-emerald-700" /> : <Lock className="w-3.5 h-3.5 text-red-700" />}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* OFFICIAL EOA CERTIFICATE VIEWER MODAL */}
      {selectedInstForCertificate && (
        <EoaCertificateModal
          instrument={selectedInstForCertificate}
          onClose={() => setSelectedInstForCertificate(null)}
        />
      )}

    </div>
  );
};

export interface EoaCertificateModalProps {
  instrument: FDRInstrument;
  onClose: () => void;
}

export const EoaCertificateModal: React.FC<EoaCertificateModalProps> = ({ instrument, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#FFFFFF] border-2 border-slate-700 rounded shadow-2xl max-w-3xl w-full my-8 p-6 space-y-4">
        
        {/* Modal Controls */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-sm text-slate-900">
              Official AICTE Extension of Approval (EoA 2027–28) Viewer
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* THE OFFICIAL EOA CERTIFICATE DOCUMENT */}
        <div className={`relative border-4 p-8 bg-[#FCFBF8] text-slate-900 font-serif space-y-4 rounded-sm shadow-inner ${
          instrument.eoaStatus.isFrozen
            ? 'border-red-600 bg-red-50/20'
            : 'border-slate-800'
        }`}>
          
          {/* Massive Diagonal Crimson Stamp If Frozen */}
          {instrument.eoaStatus.isFrozen && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 overflow-hidden">
              <div className="transform -rotate-25 border-8 border-red-700/80 bg-red-100/90 text-red-800 font-sans font-black text-2xl sm:text-3xl uppercase tracking-widest px-6 py-4 shadow-2xl text-center leading-tight">
                PROVISIONAL EOA CERTIFICATE FROZEN
                <div className="text-xs font-mono font-bold text-red-900 mt-1">
                  WITHHELD UNDER AICTE APH REGULATION 1.5 DEFICIT HOLD
                </div>
              </div>
            </div>
          )}

          {/* Official AICTE Letterhead */}
          <div className="text-center border-b-2 border-slate-900 pb-3">
            <div className="text-xs font-sans font-bold uppercase tracking-widest text-slate-800">
              ALL INDIA COUNCIL FOR TECHNICAL EDUCATION
            </div>
            <div className="text-[10px] font-sans text-slate-600">
              Nelson Mandela Marg, Vasant Kunj, New Delhi - 110070 | www.aicte-india.org
            </div>
            <h2 className="text-base font-bold font-sans uppercase tracking-wider text-slate-950 mt-2 bg-stone-100 py-1 border-y border-stone-300">
              EXTENSION OF APPROVAL (EoA) FOR ACADEMIC YEAR 2027–28
            </h2>
          </div>

          {/* Certificate Metadata */}
          <div className="flex justify-between text-xs font-mono border-b border-stone-200 pb-2">
            <div>
              <strong>Certificate Ref:</strong> {instrument.eoaStatus.certificateNumber}
            </div>
            <div>
              <strong>Issue Date:</strong> {instrument.eoaStatus.isFrozen ? 'WITHHELD' : '26-Oct-2026'}
            </div>
          </div>

          {/* Addressed To */}
          <div className="text-xs text-slate-800 space-y-1">
            <div>To,</div>
            <div className="font-bold">The Principal / Director,</div>
            <div>{instrument.institutionName}</div>
            <div>Permanent AICTE ID: {instrument.institutionId} • AISHE: {instrument.aisheCode}</div>
          </div>

          {/* Directive Body */}
          <div className="text-xs text-slate-800 leading-relaxed space-y-2">
            <p>Sir/Madam,</p>
            <p>
              In terms of the provisions under the All India Council for Technical Education (Grant of Approvals for Technical Education) Regulations and Approval Process Handbook (APH 2026-27), I am directed to convey the status of Extension of Approval to the institution:
            </p>

            {/* Status Notice inside Certificate */}
            {instrument.eoaStatus.isFrozen ? (
              <div className="p-3 bg-red-100 border border-red-400 rounded text-red-950 font-sans text-xs">
                <strong>REGULATORY HOLD DIRECTIVE:</strong> Certificate issuance is <strong>SUSPENDED</strong>. The institution is restrained from admitting candidates until all security deposit deficits are liquidated and validated via the AICTE KOSH-Rakshak Portal.
              </div>
            ) : (
              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded text-emerald-950 font-sans text-xs">
                <strong>APPROVAL STATUS: EXTENSION OF APPROVAL ACCORDED.</strong> The security deposit corpus is verified compliant under APH Chapter 1. The institution is permitted to conduct approved programmes for AY 2027-28.
              </div>
            )}

            {/* Approved Programmes Table */}
            <table className="w-full text-left text-xs font-sans border-collapse border border-slate-300 my-2">
              <thead>
                <tr className="bg-stone-100 border-b border-slate-300">
                  <th className="p-1.5">Approved Programme</th>
                  <th className="p-1.5">Affiliating Body</th>
                  <th className="p-1.5">Intake Permitted</th>
                  <th className="p-1.5">Corpus Status</th>
                </tr>
              </thead>
              <tbody>
                {instrument.approvedPrograms.map((prog, idx) => (
                  <tr key={idx} className="border-b border-slate-200">
                    <td className="p-1.5">{prog.programName}</td>
                    <td className="p-1.5 font-serif text-[11px]">State Technical University</td>
                    <td className="p-1.5 font-mono">{prog.intake}</td>
                    <td className="p-1.5 font-mono">
                      {instrument.eoaStatus.isFrozen ? (
                        <span className="text-red-700 font-bold">FROZEN</span>
                      ) : (
                        <span className="text-emerald-700 font-bold">VALID</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bottom: Signature Block */}
          <div className="pt-3 border-t-2 border-slate-800 flex items-center justify-between text-xs">
            <div className="text-[10px] font-mono text-slate-500">
              <div>NIC Parichay e-Sign Token: VALID</div>
              <div>Verification URL: https://portal.aicte-india.org/eoa</div>
            </div>
            <div className="text-right">
              <div className="italic font-serif">Prof. Rajendra Prasad</div>
              <div className="font-bold font-sans">Advisor (Approval Bureau)</div>
              <div className="text-[10px] text-slate-600 font-sans">AICTE Headquarters, New Delhi</div>
            </div>
          </div>

        </div>

        {/* Modal Bottom Actions */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-slate-500 font-mono">
            Status: {instrument.eoaStatus.isFrozen ? 'DOWNLOAD RESTRICTED (HOLD)' : 'ELIGIBLE FOR DOWNLOAD'}
          </span>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs bg-stone-200 text-slate-700 rounded hover:bg-stone-300 font-medium"
            >
              Close
            </button>

            <button
              disabled={instrument.eoaStatus.isFrozen}
              onClick={() => window.print()}
              className={`px-4 py-1.5 text-xs font-bold rounded flex items-center gap-1.5 ${
                instrument.eoaStatus.isFrozen
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-[#14532D] hover:bg-[#15803D] text-white shadow'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download EoA Certificate (PDF)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

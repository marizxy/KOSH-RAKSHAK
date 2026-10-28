import React, { useState } from 'react';
import { FDRInstrument } from '../types';
import { formatInr, formatGovDate, getDaysRemaining } from '../utils/formatters';
import { GhostEncumbranceScanner } from './GhostEncumbranceScanner';
import { EoaCertificateModal } from './EoaFreezingMatrix';
import { 
  Building2, 
  ShieldAlert, 
  Upload, 
  Eye, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  ArrowRight,
  Landmark,
  Scale,
  FileSignature,
  Gavel,
  Lock,
  AlertOctagon,
  FileCheck,
  X
} from 'lucide-react';

interface CollegeScopedDashboardProps {
  instruments: FDRInstrument[];
  simulatedDate: string;
  onOpenIntake: () => void;
  onOpenRenewal: () => void;
  onOpenRelease: () => void;
  onInspectDocument: (inst: FDRInstrument) => void;
  onUpdateInstrument?: (updated: FDRInstrument) => void;
}

export const CollegeScopedDashboard: React.FC<CollegeScopedDashboardProps> = ({
  instruments,
  simulatedDate,
  onOpenIntake,
  onOpenRenewal,
  onOpenRelease,
  onInspectDocument,
  onUpdateInstrument,
}) => {
  const [showGhostModal, setShowGhostModal] = useState(false);
  const [showEoaModal, setShowEoaModal] = useState(false);

  // Scoped exclusively to Apex Institute of Technology (ID: 1-482910411)
  const collegeInstruments = instruments.filter(
    (i) => i.institutionId === '1-482910411' || i.institutionName.toLowerCase().includes('apex')
  );

  const mainInstrument = collegeInstruments[0] || instruments[0];
  const daysLeft = getDaysRemaining(mainInstrument.maturityDate, simulatedDate);
  const hasGhostHold = mainInstrument.ghostEncumbrance.hasLitigationHold && !mainInstrument.ghostEncumbrance.clearedByOfficer;

  return (
    <div className="space-y-6">
      
      {/* College Institutional Banner */}
      <div className="bg-[#FFFFFF] border-2 border-blue-200 rounded-sm p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0">
              <Building2 className="w-7 h-7 text-blue-900" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold bg-blue-100 text-blue-900 px-2 py-0.5 rounded uppercase">
                  INSTITUTION NODAL PORTAL
                </span>
                <span className="text-xs font-mono text-slate-500">
                  AICTE Permanent ID: <strong className="text-slate-900">1-482910411</strong>
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-0.5 leading-tight">
                Apex Institute of Technology & Management, Meerut
              </h2>
              <div className="text-xs text-slate-600 mt-1 flex flex-wrap items-center gap-3">
                <span>AISHE Code: <strong className="font-mono text-slate-800">C-38291</strong></span>
                <span>•</span>
                <span>Jurisdiction: <strong className="text-slate-800">AICTE NRO Kanpur</strong></span>
                <span>•</span>
                <span>Programmes: <strong className="text-slate-800">B.Tech Engineering (Intake 180)</strong></span>
              </div>
            </div>
          </div>

          {/* Quick Upload CTA */}
          <button
            onClick={onOpenIntake}
            className="px-4 py-2.5 text-xs font-bold rounded bg-blue-900 hover:bg-blue-950 text-white shadow flex items-center gap-2 whitespace-nowrap self-start md:self-auto"
          >
            <Upload className="w-4 h-4" />
            <span>Upload New / Replacement FDR</span>
          </button>
        </div>
      </div>

      {/* College-Scoped Top KPI Cards (No nationwide global charts) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        {/* KPI 1: Active Deposit Corpus */}
        <div className="bg-[#FFFFFF] border border-[#D4D1C7] p-4 rounded-sm shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs uppercase font-semibold tracking-wider">Deposited Security Corpus</span>
            <Landmark className="w-4 h-4 text-blue-900" />
          </div>
          <div className="rupee-mono text-2xl font-bold text-slate-900">
            {formatInr(mainInstrument.principalAmount)}
          </div>
          <div className="text-[11px] text-slate-600 mt-1 flex items-center justify-between">
            <span>FDR #{mainInstrument.fdrNumber}</span>
            <span className="font-mono text-blue-900 font-semibold">{mainInstrument.bankName}</span>
          </div>
        </div>

        {/* KPI 2: Statutory Requirement */}
        <div className="bg-[#FFFFFF] border border-[#D4D1C7] p-4 rounded-sm shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs uppercase font-semibold tracking-wider">Statutory Norm (APH 2026-27)</span>
            <Scale className="w-4 h-4 text-emerald-800" />
          </div>
          <div className="rupee-mono text-2xl font-bold text-emerald-800">
            {formatInr(mainInstrument.requiredDeposit)}
          </div>
          <div className="text-[11px] text-slate-600 mt-1 flex items-center justify-between">
            <span>B.Tech Intake 180</span>
            <span className="text-emerald-700 font-bold">100% Corpus Covered</span>
          </div>
        </div>

        {/* KPI 3: Lock-in Progress & Maturity */}
        <div className="bg-[#FFFFFF] border border-[#D4D1C7] p-4 rounded-sm shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs uppercase font-semibold tracking-wider">Lock-in Maturity Countdown</span>
            <Clock className="w-4 h-4 text-amber-700" />
          </div>
          <div className="font-mono text-xl font-bold text-slate-900">
            {daysLeft > 0 ? `${daysLeft} Days` : 'Lapsed / Expired'}
          </div>
          <div className="text-[11px] text-slate-600 mt-1 flex items-center justify-between">
            <span>Matures: {formatGovDate(mainInstrument.maturityDate)}</span>
            <span className="text-amber-800 font-mono font-medium">8-Yr Lock-in</span>
          </div>
        </div>

        {/* KPI 4: Regulatory Compliance State */}
        <div className="bg-[#FFFFFF] border border-[#D4D1C7] p-4 rounded-sm shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs uppercase font-semibold tracking-wider">Compliance Status</span>
            <ShieldAlert className="w-4 h-4 text-red-700" />
          </div>
          <div className="text-base font-bold text-red-700 leading-tight">
            Deficiency Notice Active
          </div>
          <div className="text-[11px] text-slate-600 mt-1 flex items-center justify-between">
            <span className="text-red-700 font-semibold font-mono">NRO Scrutiny Flag</span>
            <span className="text-[10px] bg-red-100 text-red-800 px-1.5 py-0.2 rounded font-bold uppercase">Show-Cause</span>
          </div>
        </div>

      </div>

      {/* 1. HIGH-VISIBILITY CRIMSON ALERT: Ghost Encumbrance & e-Courts NJDG Finding */}
      {hasGhostHold && (
        <div className="bg-red-50 border-2 border-red-600 rounded-sm p-4 text-xs text-red-950 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-6 h-6 text-red-700 shrink-0 mt-0.5 animate-pulse" />
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-sm text-red-900 uppercase tracking-wide">
                    CRITICAL: Legal Dispute / Ghost Encumbrance Detected via Affidavit Analysis & e-Courts API match
                  </span>
                  <span className="bg-red-700 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded">
                    APPROVAL WORKFLOW LOCKED
                  </span>
                </div>
                <p className="text-slate-800 leading-relaxed font-sans text-xs">
                  <strong>Affidavit Non-Encumbrance Contradiction:</strong> Institutional Form 14 Affidavit affirmed zero encumbrances. However, simulated e-Courts & National Judicial Data Grid (NJDG) cross-check flagged an active judicial attachment or commercial debt injunction against the college's bank accounts.
                </p>
                <div className="bg-white border border-red-300 p-2.5 rounded font-mono text-[11px] space-y-1 text-slate-800">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-sans">Active Case Ref:</span>
                    <strong className="text-red-900">{mainInstrument.ghostEncumbrance.caseNumber}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-sans">Court Jurisdiction:</span>
                    <span>{mainInstrument.ghostEncumbrance.courtName}</span>
                  </div>
                  <div className="pt-1 text-red-800 font-sans text-[11px] border-t border-red-200">
                    <strong>Attachment Directive:</strong> {mainInstrument.ghostEncumbrance.stayDetails}
                  </div>
                </div>
                <div className="text-[11px] text-red-800 font-semibold">
                  Notice: Final release and normative clearance cannot proceed until judicial clearance is reviewed by AICTE Regional Office (NRO Kanpur).
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowGhostModal(true)}
              className="px-3.5 py-2 bg-red-800 hover:bg-red-900 text-white rounded text-xs font-bold whitespace-nowrap shadow flex items-center gap-1.5 shrink-0 self-start sm:self-center transition-colors"
            >
              <Gavel className="w-3.5 h-3.5" />
              <span>Inspect e-Courts / NJDG Findings</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. AUTOMATED AICTE EoA DIRECT FREEZING BANNER */}
      {mainInstrument.eoaStatus.isFrozen && (
        <div className="bg-amber-50 border-2 border-red-500 rounded-sm p-4 text-xs text-slate-900 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertOctagon className="w-5 h-5 text-red-700 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-sm text-red-900 flex items-center gap-2">
                <span>Regulatory Compliance Hold: EoA Certificate Generation Frozen due to Unrenewed Security Deposit / Lapsed FDR</span>
                <span className="bg-red-200 text-red-900 font-mono text-[10px] px-2 py-0.2 rounded font-bold uppercase">
                  APH Clause 1.5
                </span>
              </div>
              <p className="text-slate-700 mt-1 leading-relaxed">
                Under APH 2026-27 Section 1.5, institutional portal access to download the Extension of Approval (EoA) Certificate for Academic Year 2027–28 has been withheld by AICTE Headquarters. {mainInstrument.eoaStatus.freezeReason || 'Mandatory Security Deposit Deficit / Tampering Flag'}.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowEoaModal(true)}
            className="px-3.5 py-2 bg-stone-800 hover:bg-stone-900 text-white rounded text-xs font-bold whitespace-nowrap shadow flex items-center gap-1.5 shrink-0 self-start sm:self-center transition-colors"
          >
            <FileCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Preview Frozen EoA Certificate</span>
          </button>
        </div>
      )}

      {/* Active Deficiency / Scrutiny Alert from AICTE NRO Kanpur */}
      <div className="bg-red-50 border-2 border-red-300 rounded-sm p-4 text-xs text-red-950 shadow-xs">
        <div className="flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-red-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-red-900">
                REGULATORY DEFICIENCY NOTICE REF: NRO/DEF/2026/419208
              </span>
              <span className="bg-red-200 text-red-900 text-[10px] font-mono px-1.5 py-0.2 rounded font-bold">
                15-Day Compliance Window
              </span>
            </div>
            <p className="text-slate-800 leading-relaxed font-sans">
              <strong>Notice Summary:</strong> The Regional Scrutiny Officer (AICTE NRO Kanpur) has identified a mathematical and visual discrepancy on uploaded FDR #PNB-2024-419208. The printed maturity value does not match quarterly compounding formulas for the claimed ₹35,00,000 principal. PNB CBS reports actual deposit is ₹15,00,000.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <button
                onClick={onOpenIntake}
                className="px-3 py-1.5 bg-red-800 hover:bg-red-900 text-white rounded font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Rectified Instrument via Intake Studio (Tab 2)</span>
              </button>

              <button
                onClick={onOpenRenewal}
                className="px-3 py-1.5 bg-blue-900 hover:bg-blue-950 text-white rounded font-semibold text-xs flex items-center gap-1.5 transition-colors"
              >
                <span>Submit Replacement Lineage (Tab 3)</span>
              </button>

              <button
                onClick={onOpenRelease}
                className="px-3 py-1.5 bg-stone-800 hover:bg-stone-900 text-white rounded font-semibold text-xs flex items-center gap-1.5 transition-colors"
              >
                <span>Petition for FDR Release (Tab 4)</span>
              </button>

              <button
                onClick={() => onInspectDocument(mainInstrument)}
                className="px-3 py-1.5 bg-white border border-red-300 text-red-900 hover:bg-red-100 rounded font-semibold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Inspect Flagged Receipt Scan</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* College Scoped Master Table */}
      <div className="bg-[#FFFFFF] border border-[#D4D1C7] rounded-sm shadow-xs overflow-hidden">
        <div className="p-4 bg-[#F8F7F4] border-b border-[#D4D1C7] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-900" />
            <h3 className="font-bold text-sm text-slate-900">
              Institutional FDR Instrument Portfolio (Apex Institute of Technology)
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {collegeInstruments.length} Record(s) Registered Under This AICTE ID
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse gov-table">
            <thead>
              <tr>
                <th>FDR Number</th>
                <th>Issuing Bank & Branch</th>
                <th>Principal Amount</th>
                <th>Interest Rate</th>
                <th>Maturity Date</th>
                <th>AICTE Lien Status</th>
                <th>Current Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {collegeInstruments.map((item) => (
                <tr key={item.id}>
                  <td className="font-mono font-bold text-slate-900 text-xs">
                    {item.fdrNumber}
                  </td>
                  <td>
                    <div className="font-bold text-slate-900 text-xs">{item.bankName}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{item.branchName} (IFSC: {item.ifscCode})</div>
                  </td>
                  <td className="rupee-mono font-bold text-slate-900">
                    {formatInr(item.principalAmount)}
                  </td>
                  <td className="font-mono text-xs text-slate-700">
                    {item.interestRatePct}% p.a.
                  </td>
                  <td className="font-mono text-xs text-slate-900">
                    {formatGovDate(item.maturityDate)}
                  </td>
                  <td>
                    <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                      Pending Verification
                    </span>
                  </td>
                  <td>
                    <span className="bg-red-100 text-red-900 px-2 py-0.5 rounded text-[11px] font-bold">
                      Discrepancy Flagged
                    </span>
                  </td>
                  <td className="text-right">
                    <button
                      onClick={() => onInspectDocument(item)}
                      className="px-2.5 py-1 text-xs bg-stone-100 hover:bg-stone-200 border border-[#D4D1C7] rounded text-slate-700 font-medium inline-flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ghost Encumbrance & e-Courts Finding Modal */}
      {showGhostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-[#FFFFFF] border-2 border-slate-700 rounded shadow-2xl max-w-4xl w-full my-8 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center gap-2">
                <Gavel className="w-5 h-5 text-red-700" />
                <h3 className="font-bold text-sm text-slate-900">
                  e-Courts NJDG Finding & Form 14 Affidavit Verification (College Nodal View)
                </h3>
              </div>
              <button
                onClick={() => setShowGhostModal(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 text-blue-900 text-xs rounded">
              <strong>College Notice:</strong> You are viewing the judicial scrutiny findings cross-referenced by AICTE KOSH-Rakshak. Clearance must be submitted to AICTE Regional Office (NRO Kanpur) with Certified Court NOC.
            </div>

            <GhostEncumbranceScanner
              currentInstrument={mainInstrument}
              onUpdateInstrument={onUpdateInstrument || (() => {})}
              userRole="college"
            />

            <div className="flex justify-end pt-2 border-t border-slate-200">
              <button
                onClick={() => setShowGhostModal(false)}
                className="px-4 py-1.5 text-xs bg-slate-800 text-white rounded hover:bg-slate-900 font-medium"
              >
                Close Finding
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Official AICTE EoA Certificate Viewer Modal */}
      {showEoaModal && (
        <EoaCertificateModal
          instrument={mainInstrument}
          onClose={() => setShowEoaModal(false)}
        />
      )}

    </div>
  );
};

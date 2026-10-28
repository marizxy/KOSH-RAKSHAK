import React from 'react';
import { DeficiencyNoticePayload } from '../types';
import { NationalEmblem } from './NationalEmblem';
import { 
  X, 
  Mail, 
  ShieldAlert, 
  Clock, 
  CheckCircle2, 
  Printer, 
  Download, 
  ExternalLink, 
  AlertTriangle, 
  Copy, 
  Building2,
  FileText
} from 'lucide-react';

interface DeficiencyEmailModalProps {
  notice: DeficiencyNoticePayload | null;
  onClose: () => void;
  onResendNotice?: (notice: DeficiencyNoticePayload) => void;
}

export const DeficiencyEmailModal: React.FC<DeficiencyEmailModalProps> = ({
  notice,
  onClose,
  onResendNotice,
}) => {
  if (!notice) return null;

  const handleCopyMemo = () => {
    const text = `AICTE STATUTORY DEFICIENCY MEMO\nRef: ${notice.memoReferenceNumber}\nDate: ${notice.dispatchedAt}\nTo: ${notice.nodalOfficerName} <${notice.nodalOfficerEmail}>\nSubject: ${notice.emailSubject}\nDeadline: ${notice.rectificationDeadline}\n\nDeficiencies:\n${notice.failureReasons.map((r, i) => `${i + 1}. ${r}`).join('\n')}\n\nRequired Actions:\n${notice.correctiveActions.map((a, i) => `${i + 1}. ${a}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    alert('Deficiency Memo content copied to clipboard.');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div 
        className="bg-white w-full max-w-4xl rounded-sm shadow-2xl border border-[#D4D1C7] overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top GovTech Ribbon */}
        <div className="bg-[#14532D] text-white px-5 py-3 flex items-center justify-between border-b-2 border-amber-500">
          <div className="flex items-center gap-3">
            <NationalEmblem className="w-7 h-7 text-amber-300 shrink-0" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded uppercase">
                  NIC e-Gov Mail Dispatched
                </span>
                <span className="text-xs text-emerald-100 font-mono">
                  SMTP Relay TLS 1.3 (250 OK)
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white leading-tight mt-0.5">
                Official AICTE Statutory Deficiency Intimation Memo & Compliance Hold
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-emerald-100 hover:text-white p-1.5 rounded hover:bg-emerald-800 transition-colors"
            title="Close Memo"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dispatch Verification Stamp Banner */}
        <div className="bg-emerald-50 px-5 py-2.5 border-b border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-emerald-950 font-mono">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>
              <strong>Cryptographic Dispatch Delivery Confirmed:</strong> Sent via NIC Mail Host (<code>164.100.14.88</code>)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span>Stamp: <strong>{notice.dispatchedAt}</strong></span>
          </div>
        </div>

        {/* Email Headers Section (Standard RFC 5322 MIME View) */}
        <div className="bg-stone-50 p-4 border-b border-[#D4D1C7] text-xs space-y-1.5 font-mono text-slate-700">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <span className="w-20 text-slate-500 font-semibold shrink-0 uppercase text-[10px]">From:</span>
            <span className="font-bold text-slate-900">{notice.emailHeaders.from}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <span className="w-20 text-slate-500 font-semibold shrink-0 uppercase text-[10px]">To:</span>
            <span className="font-bold text-blue-900 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
              {notice.emailHeaders.to}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <span className="w-20 text-slate-500 font-semibold shrink-0 uppercase text-[10px]">Cc:</span>
            <span className="text-slate-600 truncate">{notice.emailHeaders.cc}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <span className="w-20 text-slate-500 font-semibold shrink-0 uppercase text-[10px]">Subject:</span>
            <span className="font-bold text-red-950 font-sans">{notice.emailSubject}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-[11px] text-slate-500">
            <span className="w-20 uppercase text-[10px]">Message-ID:</span>
            <span className="truncate">{notice.emailHeaders.messageId}</span>
          </div>
        </div>

        {/* Formal Statutory Memo Body */}
        <div className="p-6 max-h-[55vh] overflow-y-auto space-y-5 text-slate-800 text-xs sm:text-sm font-sans leading-relaxed">
          
          {/* Institutional Heading */}
          <div className="text-center border-b border-stone-200 pb-4">
            <div className="text-xs uppercase tracking-widest font-mono text-slate-500">
              Government of India • Ministry of Education
            </div>
            <div className="font-serif text-lg font-bold text-slate-900 mt-1">
              ALL INDIA COUNCIL FOR TECHNICAL EDUCATION
            </div>
            <div className="text-xs text-slate-600">
              Regulation Bureau • Nelson Mandela Marg, Vasant Kunj, New Delhi - 110070
            </div>
            <div className="mt-2 inline-flex items-center gap-2 font-mono text-xs bg-stone-100 px-3 py-1 rounded border border-stone-300">
              <span>Official Memo Ref:</span>
              <strong className="text-slate-900">{notice.memoReferenceNumber}</strong>
            </div>
          </div>

          {/* Addressee */}
          <div className="bg-stone-50 p-3 rounded border border-stone-200 text-xs font-mono">
            <div className="font-bold text-slate-900">TO:</div>
            <div>The Institutional Nodal Officer & Registrar</div>
            <div className="font-bold text-slate-900">{notice.institutionName}</div>
            <div>AICTE Permanent ID: <strong className="text-slate-900">{notice.institutionId}</strong></div>
            <div>Official Email: <strong className="text-blue-800">{notice.nodalOfficerEmail}</strong></div>
          </div>

          {/* Notice Subject & Preamble */}
          <div className="space-y-2">
            <div className="font-bold text-slate-900 border-l-4 border-l-red-600 pl-3 py-0.5">
              SUBJECT: Intimation of Failed Statutory Prerequisite Audit for Regulatory Security Deposit FDR #{notice.fdrNumber} & Mandatory 15-Day Rectification Window.
            </div>
            <p className="text-slate-700">
              Sir / Madam,
            </p>
            <p className="text-slate-700 leading-normal">
              In accordance with statutory surveillance powers under the <em>All India Council for Technical Education Act, 1987</em> and the <em>Approval Process Handbook (APH 2026-27)</em>, an automated 5-Gate regulatory audit was executed against the Security Deposit / Fixed Deposit Receipt (FDR #{notice.fdrNumber}) submitted by your institution.
            </p>
            <p className="text-slate-700 leading-normal">
              The Competent Authority reports that your institution has <strong>FAILED</strong> to satisfy mandatory prerequisite compliance gates. Release or refund is blocked under Rule 14.2, and your institution is placed on regulatory compliance hold.
            </p>
          </div>

          {/* Itemized Defect Breakdown Card */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-xs uppercase tracking-wider text-red-900 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-red-600" />
              <span>Itemized Audit Deficiency Breakdown ({notice.failedGates.length} Gate{notice.failedGates.length === 1 ? '' : 's'} Failed)</span>
            </h4>

            <div className="border border-red-200 rounded overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-red-50 text-red-950 font-bold border-b border-red-200">
                  <tr>
                    <th className="p-2.5 w-1/4">Statutory Gate</th>
                    <th className="p-2.5 w-2/5">Identified Discrepancy / Deficiency</th>
                    <th className="p-2.5 w-1/3">Statutory Rule Citation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-red-100">
                  {notice.failedGates.map((gate, i) => (
                    <tr key={i} className="hover:bg-red-50/50">
                      <td className="p-2.5 font-bold text-slate-900 align-top">
                        {gate}
                      </td>
                      <td className="p-2.5 text-slate-800 align-top">
                        {notice.failureReasons[i] || 'Statutory condition unsatisfied.'}
                      </td>
                      <td className="p-2.5 font-mono text-[11px] text-red-800 align-top">
                        {notice.statutoryClauses[i] || 'APH 2026-27 Regulations'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mandatory Corrective Action Instructions */}
          <div className="bg-amber-50 border-2 border-amber-400 p-4 rounded space-y-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
              <span>Mandated Corrective Action Protocol (15-Day Statutory Window)</span>
            </h4>
            <div className="text-xs text-amber-950 space-y-1.5 leading-relaxed">
              <p>
                Under APH Chapter 1 Section 1.5, your institution is accorded an official rectification window of <strong>15 Calendar Days</strong>:
              </p>
              <div className="font-mono font-bold text-red-900 bg-white p-2 rounded border border-amber-300 inline-block text-xs">
                MANDATORY RECTIFICATION DEADLINE: {notice.rectificationDeadline}
              </div>
              <ul className="list-disc list-inside space-y-1 pt-1 text-slate-800">
                {notice.correctiveActions.map((act, idx) => (
                  <li key={idx}><strong>Step {idx + 1}:</strong> {act}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Statutory Enforcement Sanctions */}
          <div className="bg-stone-50 border border-stone-300 p-3.5 rounded text-xs space-y-1.5 text-slate-700">
            <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Statutory Penalties in Effect
            </div>
            <p>
              1. <strong>Extension of Approval (EoA 2027-28) Hold:</strong> Your institution's Extension of Approval certificate is currently <em>held in abeyance</em> and cannot be downloaded until all listed defects are reconciled.
            </p>
            <p>
              2. <strong>Autonomous Default Trigger:</strong> If compliance proof is not submitted before the deadline, an automated Tier 3 notification will trigger to the State Department of Technical Education and Affiliating University for intake reduction proceedings.
            </p>
          </div>

          {/* Signoff */}
          <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-xs">
            <div>
              <div className="font-mono text-[11px] text-slate-500">Authorized Digital Token:</div>
              <div className="font-mono font-bold text-emerald-800">{notice.emailHeaders.signingAuthority}</div>
              <div className="text-[10px] text-slate-400 font-mono">Digitally stamped via NIC Parichay Government Gateway</div>
            </div>
            <div className="text-right font-mono text-[11px] text-slate-500">
              <div>Regulation Bureau</div>
              <div>AICTE HQ, New Delhi</div>
            </div>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="bg-stone-100 px-5 py-3 border-t border-[#D4D1C7] flex flex-wrap items-center justify-between gap-2.5">
          <div className="text-[11px] text-slate-600 font-mono flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-emerald-700" />
            <span>Delivered to <strong>{notice.nodalOfficerEmail}</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyMemo}
              className="px-3 py-1.5 bg-white hover:bg-stone-200 text-slate-800 rounded border border-[#D4D1C7] text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Copy className="w-3.5 h-3.5 text-slate-600" />
              <span>Copy Memo Content</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-white hover:bg-stone-200 text-slate-800 rounded border border-[#D4D1C7] text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>Print Official Memo</span>
            </button>

            {onResendNotice && (
              <button
                onClick={() => onResendNotice(notice)}
                className="px-3.5 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Re-dispatch Notice</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-bold transition-colors"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

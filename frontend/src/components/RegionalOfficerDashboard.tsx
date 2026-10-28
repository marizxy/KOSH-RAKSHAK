import React, { useState } from 'react';
import { FileCheck, Shield, AlertTriangle, CheckCircle2, FileSignature, Send, Eye } from 'lucide-react';
import { PillNavigation, TabItem } from './PillNavigation';
import { AuditLedgerViewer } from './AuditLedgerViewer';

export const RegionalOfficerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('matrix');
  const [signedGreenSheet, setSignedGreenSheet] = useState<boolean>(false);

  const tabs: TabItem[] = [
    { id: 'matrix', label: 'Dual-Source Matrix', badge: '1 Discrepancy' },
    { id: 'inspection', label: 'Physical Inspection', badge: 'Form 16-B' },
    { id: 'validity', label: 'Validity Escalations', badge: '60 Days' },
    { id: 'enforcement', label: 'Enforcement Actions', badge: 'SRO/NRO' },
    { id: 'ledger', label: 'Audit Ledger', badge: 'RO Scope' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-emerald-500/30 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
              Regional Office Jurisdiction Command (SRO Chennai)
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                REGIONAL SCOPE
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Responsible for dual-source bank reconciliation, physical bank stamp audits, and Form 16-B green sheet digital signatures.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
            JURISDICTION: <strong className="text-white">TAMIL NADU & PUDUCHERRY</strong>
          </span>
        </div>
      </div>

      {/* Pill Navigation */}
      <PillNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        accentColor="emerald"
      />

      {/* Tab 1: Dual-Source Matrix */}
      {activeTab === 'matrix' && (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            Dual-Source Truth Matrix (College Upload vs Core Banking System)
          </h3>
          <p className="text-xs text-slate-300">
            Side-by-side reconciliation highlighting variance between what the college declared versus what the bank confirmed via CBS SFMS MT760.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <span className="text-xs font-mono font-bold text-blue-400 uppercase">1. College Declared Upload</span>
              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Instrument No:</span>
                  <span className="text-white">CAN-2024-551920</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Declared Principal:</span>
                  <span className="text-white font-bold">₹35,00,000</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Printed Maturity:</span>
                  <span className="text-white font-bold">₹61,68,320</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Lien Status:</span>
                  <span className="text-emerald-400">Claimed AICTE Joint Lien</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-slate-950 border border-amber-500/40 space-y-3">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase">2. Bank CBS Master Truth</span>
              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>CBS Reference:</span>
                  <span className="text-white">CBS-CANARA-9912048</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Actual Principal in Bank:</span>
                  <span className="text-amber-400 font-bold">₹15,00,000 (Shortfall: ₹20L)</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Actual Maturity in CBS:</span>
                  <span className="text-amber-400 font-bold">₹26,43,565</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Discrepancy Verdict:</span>
                  <span className="text-red-400 font-bold">PHOTO-ALTERED FORGERY</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Physical Inspection */}
      {activeTab === 'inspection' && (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
            <FileSignature className="w-5 h-5 text-emerald-400" />
            Form 16-B Physical Inspection & Dual-Source Green Sheet
          </h3>
          <p className="text-xs text-slate-300">
            Regional Officer physical verification of genuine bank fixed deposit receipt with joint lien seal.
          </p>

          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-white">Genuine Instrument: SBI-2023-881920</div>
              <div className="text-xs font-mono text-slate-400">College of Engineering, Guindy • ₹35,00,000 • State Bank of India</div>
            </div>

            <button
              onClick={() => setSignedGreenSheet(true)}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all duration-300 border ${
                signedGreenSheet
                  ? 'bg-emerald-600/20 text-emerald-400 border-emerald-500/40'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400/40 shadow-lg shadow-emerald-600/30'
              }`}
            >
              {signedGreenSheet ? '✓ GREEN SHEET DIGITALLY SIGNED' : 'AFFIX FORM 16-B SIGNATURE'}
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: Validity Escalations */}
      {activeTab === 'validity' && (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            60-Day Expiry & Renewal Lineage Escalation Matrix
          </h3>
          <p className="text-xs text-slate-300">
            FDRs approaching the mandatory 8-year maturity milestone are automatically flagged for renewal under APH 2026-27 rules.
          </p>

          <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-white font-mono">FDR #CAN-2018-992100 (Maturing in 42 Days)</div>
              <div className="text-xs text-slate-400">St. Peter&apos;s Engineering College • ₹35,00,000 • Maturity: 09-Dec-2026</div>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold">
              <Send className="w-3.5 h-3.5" /> Dispatch 30-Day Notice
            </button>
          </div>
        </div>
      )}

      {/* Tab 4: Enforcement Actions */}
      {activeTab === 'enforcement' && (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-400" />
            Regional Enforcement & Police / CBI Complaint Gateway
          </h3>
          <p className="text-xs text-slate-300">
            For criminal forgery under IPC 468/471 (Photoshop modified bank receipts), the Regional Officer forwards reports directly to the AICTE Chief Vigilance Officer.
          </p>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <span className="text-xs font-mono text-slate-300">Evidence Vault: Forensic Dossier for SRM Institute #CAN-2024-551920</span>
            <button className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono font-bold border border-slate-700">
              Download Cryptographic Dossier
            </button>
          </div>
        </div>
      )}

      {/* Tab 5: Audit Ledger */}
      {activeTab === 'ledger' && (
        <AuditLedgerViewer roleScope="REGIONAL_OFFICER" />
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { Shield, AlertTriangle, FileCheck, CheckCircle2, QrCode, Lock, Building, Scale, ArrowUpRight } from 'lucide-react';
import { PillNavigation, TabItem } from './PillNavigation';
import { AuditLedgerViewer } from './AuditLedgerViewer';
import { api } from '../services/api';

export const HqBureauDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('heatmap');
  const [sanctioning, setSanctioning] = useState<boolean>(false);
  const [dischargeOrder, setDischargeOrder] = useState<string | null>(null);

  const tabs: TabItem[] = [
    { id: 'heatmap', label: 'Heatmap & Forensics', badge: '3 Flags' },
    { id: 'penalty', label: 'Penalty & Inspection', badge: '₹2.0 Cr Deficit' },
    { id: 'litigation', label: 'National Litigation', badge: '1 Case' },
    { id: 'release', label: '5-Gate Release', badge: '1 Pending' },
    { id: 'ledger', label: 'Audit Ledger', badge: 'NIST SHA-256' }
  ];

  const handleGate5Sanction = async () => {
    setSanctioning(true);
    const res = await api.sanctionReleaseGate5('FDR-01-SBI-COMPLIANT', 'Prof. Rajendra Prasad, Advisor & Regulation Bureau Head');
    setDischargeOrder(res.dischargeOrderNumber);
    setSanctioning(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome & KPI Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Total Pledged Reserves</span>
          <div className="text-2xl font-black text-white font-mono mt-1">₹42.80 Cr</div>
          <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 mt-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> 1,248 Verified Endorsements
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-amber-500/30 shadow-xl">
          <span className="text-xs font-mono text-amber-400 uppercase tracking-wider">Deficit & Shortfall</span>
          <div className="text-2xl font-black text-amber-400 font-mono mt-1">₹2.00 Cr</div>
          <span className="text-[11px] text-amber-300 font-semibold flex items-center gap-1 mt-1">
            <AlertTriangle className="w-3.5 h-3.5" /> SRM Inst. Altered Deposit
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-red-500/30 shadow-xl">
          <span className="text-xs font-mono text-red-400 uppercase tracking-wider">Breached Overdraft Liens</span>
          <div className="text-2xl font-black text-red-400 font-mono mt-1">1 Critical</div>
          <span className="text-[11px] text-red-300 font-semibold flex items-center gap-1 mt-1">
            <Lock className="w-3.5 h-3.5" /> Saraswati Inst. (BOB ₹22L Loan)
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-blue-500/30 shadow-xl">
          <span className="text-xs font-mono text-blue-400 uppercase tracking-wider">Discharge Sanction Orders</span>
          <div className="text-2xl font-black text-blue-400 font-mono mt-1">84 Released</div>
          <span className="text-[11px] text-blue-300 font-semibold flex items-center gap-1 mt-1">
            <Shield className="w-3.5 h-3.5" /> 100% Zero-Deficit Compliance
          </span>
        </div>
      </div>

      {/* Modern Pill Navigation */}
      <PillNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        accentColor="blue"
      />

      {/* Tab 1: Heatmap & Forensics */}
      {activeTab === 'heatmap' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-400" />
              Nationwide Multi-Modal Forensic Scrutiny Matrix
            </h3>
            <p className="text-xs text-slate-300">
              The AI Forensics Engine scans all incoming FDRs across 6 defensive layers: Error Level Analysis, quarterly actuarial recalculation, and statutory lien clause NLP.
            </p>

            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-500/30 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-emerald-400">Layer 1 & 2: Error Level Analysis & Edge Invariance</div>
                  <div className="text-[11px] text-slate-400">JPEG quantization noise delta evaluated under 90% re-save</div>
                </div>
                <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold">CLEARED (98.4%)</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-amber-500/30 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-amber-400">Layer 3: Compound Interest Actuarial Verification</div>
                  <div className="text-[11px] text-slate-400">Formula A = P * (1 + r/400)^4n checked against printed maturity</div>
                </div>
                <span className="px-2 py-1 rounded bg-amber-500/10 text-amber-400 text-xs font-mono font-bold">1 FORGERY FLAGGED</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-red-500/30 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-red-400">Layer 4: Bank CBS Core Lien Handshake</div>
                  <div className="text-[11px] text-slate-400">Cross-checking negative lien and unauthorized overdraft facilities</div>
                </div>
                <span className="px-2 py-1 rounded bg-red-500/10 text-red-400 text-xs font-mono font-bold">1 OVERDRAFT BREACH</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              High-Risk Technical Enclave Watchlist
            </h3>

            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-slate-950/80 border border-red-500/30">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white">SRM Institute of Science & Tech</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-red-500/20 text-red-300 font-mono font-bold">TAMPERED FDR</span>
                </div>
                <p className="text-xs text-slate-400">
                  Principal claimed ₹35 Lakhs, but printed maturity ₹26,43,565 corresponds to ₹15 Lakhs deposit. Deficit: ₹20 Lakhs.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-amber-500/30">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white">Saraswati Institute of Tech & Mgmt</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">SECRET OVERDRAFT</span>
                </div>
                <p className="text-xs text-slate-400">
                  Bank of Baroda CBS query revealed ₹22,00,000 overdraft facility active against collateral.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-amber-500/30">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white">Apex Institute of Technology</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">LOOPHOLE CLAUSE</span>
                </div>
                <p className="text-xs text-slate-400">
                  Clause reads &quot;Either or Survivor&quot; permitting unilateral premature trust withdrawal. APH Sec 4.1 violation.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Penalty & Inspection */}
      {activeTab === 'penalty' && (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
            <Scale className="w-5 h-5 text-amber-400" />
            Statutory Deficit Penalty & EoA Freezing Engine
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            In accordance with AICTE APH 2026-27 Chapter IV, institutions with flagged collateral shortfalls or fraudulent ELA manipulations face automated withholding of Extension of Approval (EoA) and penalty proceedings.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="text-[11px] uppercase font-mono bg-slate-950 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Institution Name</th>
                  <th className="py-3 px-4">Permanent ID</th>
                  <th className="py-3 px-4">Required Deposit</th>
                  <th className="py-3 px-4">Actual Deposit</th>
                  <th className="py-3 px-4">Deficit Amount</th>
                  <th className="py-3 px-4">EoA Status</th>
                  <th className="py-3 px-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                <tr className="hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-sans font-semibold text-white">SRM Institute (Kattankulathur)</td>
                  <td className="py-3 px-4">1-3829104</td>
                  <td className="py-3 px-4">₹35,00,000</td>
                  <td className="py-3 px-4 text-amber-400">₹15,00,000</td>
                  <td className="py-3 px-4 text-red-400 font-bold">₹20,00,000</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 text-[10px] font-bold border border-red-500/30">
                      EOA_WITHHELD
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white text-[11px] font-bold">
                      Issue Show-Cause
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-sans font-semibold text-white">Saraswati Institute (Lucknow)</td>
                  <td className="py-3 px-4">1-9923841</td>
                  <td className="py-3 px-4">₹35,00,000</td>
                  <td className="py-3 px-4">₹35,00,000</td>
                  <td className="py-3 px-4 text-slate-400">₹0 (Breach)</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] font-bold border border-amber-500/30">
                      FROZEN_PENDING_INSPECTION
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-[11px] font-bold">
                      Order Recovery
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: National Litigation */}
      {activeTab === 'litigation' && (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
            <Building className="w-5 h-5 text-blue-400" />
            National Litigation & High Court Restraint Monitor
          </h3>
          <p className="text-xs text-slate-300">
            Real-time synchronization with e-Courts National Judicial Data Grid (NJDG) to intercept any attempts to prematurely encash FDRs under active sub-judice stay orders.
          </p>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white font-mono">W.P.(C) 4892/2024 (Delhi High Court)</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-bold border border-blue-500/30">
                STAY IN FORCE
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Hon&apos;ble High Court restrained unilateral encashment of technical corpus. Automated lock active on FDR #CAN-2024-551920.
            </p>
          </div>
        </div>
      )}

      {/* Tab 4: 5-Gate Release */}
      {activeTab === 'release' && (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-400" />
                5-Gate Sovereign Release & Discharge Engine
              </h3>
              <p className="text-xs text-slate-400">
                All 5 sequential gates must be cleared before the Bureau Head authorizes a cryptographic QR discharge order.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold">
              GATE 1-4 CLEARED
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/40 text-center">
              <div className="text-[10px] font-mono text-emerald-400 font-bold">GATE 1</div>
              <div className="text-xs font-bold text-white mt-1">RO No-Dues</div>
              <span className="text-[10px] text-emerald-400 font-mono mt-1 block">✓ Cleared</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/40 text-center">
              <div className="text-[10px] font-mono text-emerald-400 font-bold">GATE 2</div>
              <div className="text-xs font-bold text-white mt-1">Bank CBS MT760</div>
              <span className="text-[10px] text-emerald-400 font-mono mt-1 block">✓ Cleared</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/40 text-center">
              <div className="text-[10px] font-mono text-emerald-400 font-bold">GATE 3</div>
              <div className="text-xs font-bold text-white mt-1">EoA Status Clean</div>
              <span className="text-[10px] text-emerald-400 font-mono mt-1 block">✓ Cleared</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/40 text-center">
              <div className="text-[10px] font-mono text-emerald-400 font-bold">GATE 4</div>
              <div className="text-xs font-bold text-white mt-1">Litigation Clear</div>
              <span className="text-[10px] text-emerald-400 font-mono mt-1 block">✓ Cleared</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-blue-500/40 text-center">
              <div className="text-[10px] font-mono text-blue-400 font-bold">GATE 5</div>
              <div className="text-xs font-bold text-white mt-1">Bureau Head Sanction</div>
              <span className="text-[10px] text-blue-400 font-mono mt-1 block">
                {dischargeOrder ? '✓ Cleared' : 'Pending Signature'}
              </span>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-white">Eligible Instrument for Release:</div>
              <div className="text-xs font-mono text-slate-300">
                FDR #SBI-2023-881920 • ₹35,00,000 • College of Engineering, Guindy
              </div>
            </div>

            {dischargeOrder ? (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-mono block">DISCHARGE ORDER ISSUED</span>
                  <span className="text-xs font-mono font-bold text-emerald-400">{dischargeOrder}</span>
                </div>
                <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  <QrCode className="w-6 h-6" />
                </div>
              </div>
            ) : (
              <button
                onClick={handleGate5Sanction}
                disabled={sanctioning}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold font-mono transition-all duration-300 shadow-lg shadow-blue-600/30 border border-blue-400/40"
              >
                {sanctioning ? 'AFFIXING DIGITAL SIGNATURE...' : 'AUTHORIZE GATE 5 DISCHARGE'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Tab 5: Audit Ledger */}
      {activeTab === 'ledger' && (
        <AuditLedgerViewer roleScope="HQ_BUREAU" />
      )}
    </div>
  );
};

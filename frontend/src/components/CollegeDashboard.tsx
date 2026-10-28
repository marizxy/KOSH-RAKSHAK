import React, { useState } from 'react';
import { UploadCloud, Calculator, AlertTriangle, Clock, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { PillNavigation, TabItem } from './PillNavigation';
import { api } from '../services/api';

export const CollegeDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('intake');
  const [principal, setPrincipal] = useState<number>(3500000);
  const [ratePct, setRatePct] = useState<number>(7.25);
  const [tenureYears, setTenureYears] = useState<number>(8);
  const [printedMaturity, setPrintedMaturity] = useState<number>(6218753);
  const [mathResult, setMathResult] = useState<any>(null);

  const tabs: TabItem[] = [
    { id: 'intake', label: 'FDR Intake Studio', badge: 'Active Portal' },
    { id: 'renewal', label: 'Renewal Lineage', badge: '1 Instrument' },
    { id: 'calculator', label: 'Deficit Calculator', badge: 'APH 2026-27' },
    { id: 'notices', label: 'Deficiency Notices', badge: '0 Clean' }
  ];

  const handleCalculateMath = async () => {
    const res = await api.validateFdrMath(principal, ratePct, tenureYears, printedMaturity);
    setMathResult(res);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-amber-500/30 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
              College Nodal Officer Portal
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                INSTITUTION SCOPE
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              College of Engineering, Guindy, Anna University (Permanent ID: 1-10294811)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
            ✓ EOA STATUS: NORMAL (ACTIVE)
          </span>
        </div>
      </div>

      {/* Pill Navigation */}
      <PillNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        accentColor="amber"
      />

      {/* Tab 1: FDR Intake Studio */}
      {activeTab === 'intake' && (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-amber-400" />
              Statutory FDR Intake & Multi-Modal Scrutiny Studio
            </h3>
            <span className="text-xs font-mono text-slate-400">Step 1 of 3: Collateral Ingestion</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Fixed Deposit Number</label>
                <input
                  type="text"
                  defaultValue="SBI-2023-881920"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Bank & Branch Name</label>
                <input
                  type="text"
                  defaultValue="State Bank of India, Guindy SME Branch"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Principal Amount (₹)</label>
                <input
                  type="number"
                  value={principal}
                  onChange={(e) => setPrincipal(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Quarterly Compounding Rate (%)</label>
                <input
                  type="number"
                  step="0.05"
                  value={ratePct}
                  onChange={(e) => setRatePct(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Printed Maturity Amount on Certificate (₹)</label>
                <input
                  type="number"
                  value={printedMaturity}
                  onChange={(e) => setPrintedMaturity(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Statutory Joint Lien Clause</label>
                <textarea
                  rows={2}
                  defaultValue="Pledged jointly in favor of Member Secretary, AICTE, New Delhi. Non-encashable without written AICTE discharge order."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-sans text-xs focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-dashed border-slate-700 text-center space-y-2">
            <UploadCloud className="w-8 h-8 text-slate-400 mx-auto" />
            <div className="text-xs text-slate-300 font-semibold">
              Drop FDR scanned certificate (PDF or High-Res JPEG)
            </div>
            <p className="text-[11px] text-slate-500">
              The AI Forensics module will execute automated Error Level Analysis (ELA) and stamp edge validation on upload.
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={handleCalculateMath}
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold font-mono transition-all duration-300 shadow-lg shadow-amber-600/30"
            >
              PRE-SUBMISSION ACTUARIAL CHECK
            </button>
          </div>

          {mathResult && (
            <div className={`p-4 rounded-xl border text-xs font-mono ${
              mathResult.mathMismatchDetected ? 'bg-red-500/10 border-red-500/40 text-red-300' : 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
            }`}>
              <div className="font-bold flex items-center gap-2">
                {mathResult.mathMismatchDetected ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                {mathResult.mathMismatchDetected ? 'MATHEMATICAL DISCREPANCY DETECTED' : 'ACTUARIAL FORMULA MATHEMATICALLY VERIFIED'}
              </div>
              <div className="mt-1">
                Expected Maturity: ₹{mathResult.expectedMaturity?.toLocaleString('en-IN')} | Delta: ₹{mathResult.discrepancyDelta}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Renewal Lineage */}
      {activeTab === 'renewal' && (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" />
            Mandatory 8-Year Collateral Renewal Lineage
          </h3>
          <p className="text-xs text-slate-300">
            Current deposit history under sovereign lock with AICTE.
          </p>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Deposit No:</span>
              <span className="text-white font-bold">SBI-2023-881920</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Issue Date:</span>
              <span className="text-white">15-Aug-2023</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Maturity Date:</span>
              <span className="text-white">15-Aug-2031 (8 Years Active)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Current Status:</span>
              <span className="text-emerald-400 font-bold">ACTIVE & CBS CONFIRMED</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Deficit Calculator */}
      {activeTab === 'calculator' && (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
            <Calculator className="w-5 h-5 text-amber-400" />
            APH 2026-27 Table 4.1 Collateral Norms Calculator
          </h3>
          <p className="text-xs text-slate-300">
            Calculates required security deposit based on institutional category, location (Urban/Rural), and program type.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block mb-1">Technical Category</span>
              <span className="text-white font-bold">Engineering & Tech (UG)</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block mb-1">Geographic Classification</span>
              <span className="text-white font-bold">Urban (Chennai)</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block mb-1">Mandated Security Deposit</span>
              <span className="text-amber-400 font-bold">₹35,00,000 (8 Years)</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Deficiency Notices */}
      {activeTab === 'notices' && (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            Official Regulatory Communications & Show-Cause Record
          </h3>
          <div className="p-8 text-center bg-slate-950 rounded-xl border border-slate-800">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
            <div className="text-xs font-bold text-white font-mono">ZERO DEFICIENCY NOTICES PENDING</div>
            <p className="text-[11px] text-slate-400 mt-1">
              Your institution is 100% compliant with all AICTE Approval Process Handbook collateral mandates.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

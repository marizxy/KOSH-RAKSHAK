import React, { useState, useMemo } from 'react';
import { FDRInstrument } from '../types';
import { formatInr, formatGovDate } from '../utils/formatters';
import { 
  Landmark, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  FileText, 
  Lock, 
  Check, 
  Eye, 
  Building,
  Key,
  Layers,
  Send,
  Search,
  Filter,
  ArrowRight,
  Database,
  Radio,
  FileCheck,
  X,
  AlertCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface BankCBSPortalProps {
  instruments: FDRInstrument[];
  simulatedDate: string;
  onUpdateInstrument: (inst: FDRInstrument) => void;
  onInspectDocument: (inst: FDRInstrument) => void;
  activeSubTab?: number;
  onTabChange?: (tab: number) => void;
}

export const BankCBSPortal: React.FC<BankCBSPortalProps> = ({
  instruments,
  simulatedDate,
  onUpdateInstrument,
  onInspectDocument,
}) => {
  const [selectedBank, setSelectedBank] = useState<string>('Bank of Baroda');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'CONFIRMED' | 'OVERDRAFT'>('ALL');
  const [handshakeMessage, setHandshakeMessage] = useState<string | null>(null);
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  
  // Custom Overdraft Modal State
  const [flagModalInst, setFlagModalInst] = useState<FDRInstrument | null>(null);
  const [overdraftAmountInput, setOverdraftAmountInput] = useState<number>(2200000);
  const [overdraftFacilityType, setOverdraftFacilityType] = useState<string>('SECURED_OVERDRAFT_AGAINST_FDR');
  const [loanSanctionRef, setLoanSanctionRef] = useState<string>('BOB/SME/OD-8819/2024');

  // SFMS Transmission Ledger State
  const [sfmsLog, setSfmsLog] = useState<Array<{
    id: string;
    timestamp: string;
    messageType: string;
    fdrNumber: string;
    bank: string;
    status: string;
    payloadHash: string;
  }>>([
    {
      id: 'SFMS-2026-0911',
      timestamp: `${simulatedDate} 09:30:14 IST`,
      messageType: 'MT760 (Lien Confirmation Advice)',
      fdrNumber: 'SBI-2023-881920',
      bank: 'State Bank of India',
      status: 'TRANSMITTED_ACK',
      payloadHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    },
    {
      id: 'SFMS-2026-0894',
      timestamp: `${simulatedDate} 09:15:22 IST`,
      messageType: 'MT799 (Encumbrance Flag Notification)',
      fdrNumber: 'BOB-2021-9941',
      bank: 'Bank of Baroda',
      status: 'DELIVERED_HQ',
      payloadHash: '4a6b281c7e9238d2f09a15b3648e890c2f8216d7a4e09871b632ef10928374aa',
    },
  ]);

  // Available banks in dataset
  const bankOptions = [
    'All Scheduled Banks',
    'Bank of Baroda',
    'State Bank of India',
    'Punjab National Bank',
    'Canara Bank',
    'Indian Bank',
    'HDFC Bank Ltd',
  ];

  // Scoped instruments for the chosen bank
  const scopedBankInstruments = useMemo(() => {
    if (selectedBank === 'All Scheduled Banks') return instruments;
    return instruments.filter(
      (i) => i.bankName.toLowerCase().includes(selectedBank.toLowerCase())
    );
  }, [instruments, selectedBank]);

  // Filtered by sub-status and search
  const displayedInstruments = useMemo(() => {
    return scopedBankInstruments.filter((item) => {
      const matchesSearch =
        item.institutionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.fdrNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.institutionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.branchName.toLowerCase().includes(searchQuery.toLowerCase());

      let matchesFilter = true;
      if (statusFilter === 'PENDING') matchesFilter = !item.bankCbs.confirmed || !item.bankCbs.activeLienMarked;
      if (statusFilter === 'CONFIRMED') matchesFilter = item.bankCbs.confirmed && item.bankCbs.activeLienMarked && !item.bankCbs.hasEncumbrance;
      if (statusFilter === 'OVERDRAFT') matchesFilter = item.bankCbs.hasEncumbrance;

      return matchesSearch && matchesFilter;
    });
  }, [scopedBankInstruments, searchQuery, statusFilter]);

  // Calculate bank corpus metrics
  const totalBankCorpus = scopedBankInstruments.reduce((acc, curr) => acc + curr.actualDeposit, 0);
  const pendingCount = scopedBankInstruments.filter((i) => !i.bankCbs.confirmed || !i.bankCbs.activeLienMarked).length;
  const verifiedCount = scopedBankInstruments.filter((i) => i.bankCbs.confirmed && i.bankCbs.activeLienMarked && !i.bankCbs.hasEncumbrance).length;
  const overdraftCount = scopedBankInstruments.filter((i) => i.bankCbs.hasEncumbrance).length;

  // Action Handler 1: Mark / Re-confirm Exclusive Lien
  const handleMarkLien = (inst: FDRInstrument) => {
    const timestamp = `${simulatedDate} ${new Date().toLocaleTimeString('en-IN')} IST`;
    const updated: FDRInstrument = {
      ...inst,
      status: inst.status === 'DISCREPANCY_FLAGGED' && !inst.forensics.mathMismatch ? 'ACTIVE' : inst.status,
      verificationStatus: 'BANK_CBS_CONFIRMED',
      bankCbs: {
        ...inst.bankCbs,
        confirmed: true,
        activeLienMarked: true,
        hasEncumbrance: false,
        overdraftLoanAmount: 0,
        handshakeTimestamp: timestamp,
        remarks: `Bank CBS confirmed: Exclusive lien actively marked in favor of Member Secretary, AICTE under Banking Regulation Act Sec 45. Zero encumbrance verified.`,
      },
    };
    onUpdateInstrument(updated);
    
    // Auto-append SFMS transmission
    const newSfmsEntry = {
      id: `SFMS-${Date.now().toString().slice(-4)}`,
      timestamp,
      messageType: 'MT760 (Lien Confirmation Advice)',
      fdrNumber: inst.fdrNumber,
      bank: inst.bankName,
      status: 'TRANSMITTED_ACK',
      payloadHash: '9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b',
    };
    setSfmsLog((prev) => [newSfmsEntry, ...prev]);

    setHandshakeMessage(`FDR #${inst.fdrNumber}: Exclusive AICTE lien successfully validated & recorded in Core Banking Host. Status updated to Compliant.`);
    setTimeout(() => setHandshakeMessage(null), 4500);
  };

  // Action Handler 2: Open Overdraft Modal
  const handleOpenOverdraftModal = (inst: FDRInstrument) => {
    setFlagModalInst(inst);
    setOverdraftAmountInput(inst.bankCbs.overdraftLoanAmount || 2200000);
    setLoanSanctionRef(inst.bankCbs.cbsReferenceNumber || 'BOB/SME/OD-8819/2024');
  };

  // Action Handler 3: Confirm Overdraft Discrepancy
  const handleConfirmFlagOverdraft = () => {
    if (!flagModalInst) return;
    const timestamp = `${simulatedDate} ${new Date().toLocaleTimeString('en-IN')} IST`;
    const updated: FDRInstrument = {
      ...flagModalInst,
      status: 'DISCREPANCY_FLAGGED',
      verificationStatus: 'DISCREPANCY_FLAGGED',
      bankCbs: {
        ...flagModalInst.bankCbs,
        hasEncumbrance: true,
        overdraftLoanAmount: overdraftAmountInput,
        handshakeTimestamp: timestamp,
        remarks: `CBS ALERT: ${overdraftFacilityType} of ₹${overdraftAmountInput.toLocaleString('en-IN')} active against deposit (Ref: ${loanSanctionRef}). Collateral compromised.`,
      },
    };
    onUpdateInstrument(updated);

    // Auto-append SFMS alert
    const newSfmsEntry = {
      id: `SFMS-${Date.now().toString().slice(-4)}`,
      timestamp,
      messageType: 'MT799 (Encumbrance Discrepancy Flag)',
      fdrNumber: flagModalInst.fdrNumber,
      bank: flagModalInst.bankName,
      status: 'DISPATCHED_TO_HQ',
      payloadHash: '3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e7d6c5b4a3f2e',
    };
    setSfmsLog((prev) => [newSfmsEntry, ...prev]);

    setHandshakeMessage(`CRITICAL DISCREPANCY: Active Overdraft of ₹${overdraftAmountInput.toLocaleString('en-IN')} recorded on FDR #${flagModalInst.fdrNumber}. Alert dispatched to AICTE Regulation Bureau.`);
    setFlagModalInst(null);
    setTimeout(() => setHandshakeMessage(null), 5000);
  };

  // Bulk confirm all pending for this bank
  const handleBulkConfirmLien = () => {
    scopedBankInstruments.forEach((inst) => {
      if (!inst.bankCbs.activeLienMarked) {
        handleMarkLien(inst);
      }
    });
    setHandshakeMessage(`Bulk Process Completed: All pending instruments for ${selectedBank} marked with exclusive AICTE lien.`);
    setTimeout(() => setHandshakeMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* ======================================================== */}
      {/* 1. BANK CBS NODE INSTITUTIONAL HEADER                    */}
      {/* ======================================================== */}
      <div className="bg-[#FFFFFF] border-2 border-purple-200 rounded-sm p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded bg-purple-50 border border-purple-200 flex items-center justify-center shrink-0">
              <Landmark className="w-7 h-7 text-purple-900" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono font-bold bg-purple-100 text-purple-900 px-2 py-0.5 rounded uppercase">
                  SCHEDULED COMMERCIAL BANK CBS & SFMS GATEWAY
                </span>
                <span className="text-xs font-mono text-slate-500">
                  Node ID: <strong className="text-slate-900">SFMS-CBS-NODE-04</strong>
                </span>
                <span className="flex items-center gap-1 text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-300">
                  <Radio className="w-3 h-3 animate-pulse text-emerald-600" />
                  CBS HOST ONLINE
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-1 leading-tight">
                {selectedBank} — Institutional Security Deposit & Lien Verification Node
              </h2>
              <div className="text-xs text-slate-600 mt-1 flex flex-wrap items-center gap-2 sm:gap-3">
                <span>Core Banking Engine: <strong className="font-mono text-slate-800">Finacle 10.2 / SFMS Encrypted</strong></span>
                <span>•</span>
                <span>Statutory Mandate: <strong className="text-slate-800">Banking Regulation Act 1949 Sec 45 & APH 2026-27</strong></span>
              </div>
            </div>
          </div>

          {/* Bank Selector Dropdown */}
          <div className="flex items-center gap-2 self-start lg:self-auto bg-[#F5F4F0] p-2 rounded border border-[#D4D1C7]">
            <span className="text-xs font-semibold text-slate-700 whitespace-nowrap">Bank Jurisdiction:</span>
            <select
              value={selectedBank}
              onChange={(e) => setSelectedBank(e.target.value)}
              className="py-1.5 px-3 text-xs bg-white border border-[#D4D1C7] rounded font-bold text-slate-900 focus:outline-hidden cursor-pointer"
            >
              {bankOptions.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. TOP METRIC KPI SUMMARY STRIP                          */}
      {/* ======================================================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-[#FFFFFF] border border-[#D4D1C7] p-3.5 rounded-sm shadow-xs">
          <div className="text-[10px] uppercase font-bold text-slate-500 font-mono">Total Bank Corpus Under Lien</div>
          <div className="text-xl font-black text-slate-900 rupee-mono mt-1">
            {formatInr(totalBankCorpus)}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">{scopedBankInstruments.length} FDRs in {selectedBank}</div>
        </div>

        <div className="bg-[#FFFFFF] border border-[#D4D1C7] p-3.5 rounded-sm shadow-xs">
          <div className="text-[10px] uppercase font-bold text-amber-700 font-mono">Pending Bank Verification</div>
          <div className="text-xl font-black text-amber-900 font-mono mt-1">
            {pendingCount} Instruments
          </div>
          <div className="text-[11px] text-amber-700 mt-0.5">Awaiting CBS lien recording</div>
        </div>

        <div className="bg-[#FFFFFF] border border-[#D4D1C7] p-3.5 rounded-sm shadow-xs">
          <div className="text-[10px] uppercase font-bold text-emerald-700 font-mono">AICTE Lien Confirmed</div>
          <div className="text-xl font-black text-emerald-900 font-mono mt-1">
            {verifiedCount} Instruments
          </div>
          <div className="text-[11px] text-emerald-700 mt-0.5">Zero encumbrance confirmed</div>
        </div>

        <div className="bg-[#FFFFFF] border border-[#D4D1C7] p-3.5 rounded-sm shadow-xs">
          <div className="text-[10px] uppercase font-bold text-red-700 font-mono">Flagged Overdraft Loans</div>
          <div className="text-xl font-black text-red-900 font-mono mt-1">
            {overdraftCount} Instruments
          </div>
          <div className="text-[11px] text-red-700 mt-0.5">Collateral compromised</div>
        </div>
      </div>

      {/* Live Handshake Feedback Message */}
      {handshakeMessage && (
        <div className="p-3 bg-emerald-50 border-2 border-emerald-500 rounded text-xs text-emerald-950 font-bold flex items-center justify-between gap-2 shadow-xs animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{handshakeMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setHandshakeMessage(null)}
            className="text-emerald-700 hover:text-emerald-900 p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. COMPREHENSIVE MASTER VERIFICATION TABLE (UNIFIED DESK)*/}
      {/* ======================================================== */}
      <div className="bg-[#FFFFFF] border border-[#D4D1C7] rounded-sm shadow-xs overflow-hidden">
        
        {/* Table Filter and Action Header */}
        <div className="p-4 bg-[#F8F7F4] border-b border-[#D4D1C7] flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-purple-900" />
            <h3 className="font-bold text-sm text-slate-900">
              Master Institutional Deposit Verification Queue ({displayedInstruments.length})
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search college, FDR, ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-2.5 py-1 text-xs bg-white border border-[#D4D1C7] rounded text-slate-800 placeholder:text-slate-400 focus:outline-hidden w-44 sm:w-52 font-mono"
              />
            </div>

            {/* Filter buttons */}
            <div className="flex items-center bg-white border border-[#D4D1C7] rounded p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setStatusFilter('ALL')}
                className={`px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                  statusFilter === 'ALL' ? 'bg-purple-900 text-white font-bold' : 'text-slate-600 hover:bg-stone-100'
                }`}
              >
                All ({scopedBankInstruments.length})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('PENDING')}
                className={`px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                  statusFilter === 'PENDING' ? 'bg-amber-800 text-white font-bold' : 'text-slate-600 hover:bg-stone-100'
                }`}
              >
                Pending ({pendingCount})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('CONFIRMED')}
                className={`px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                  statusFilter === 'CONFIRMED' ? 'bg-emerald-800 text-white font-bold' : 'text-slate-600 hover:bg-stone-100'
                }`}
              >
                Confirmed ({verifiedCount})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('OVERDRAFT')}
                className={`px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                  statusFilter === 'OVERDRAFT' ? 'bg-red-800 text-white font-bold' : 'text-slate-600 hover:bg-stone-100'
                }`}
              >
                Overdraft ({overdraftCount})
              </button>
            </div>

            {pendingCount > 0 && (
              <button
                type="button"
                onClick={handleBulkConfirmLien}
                className="px-3 py-1.5 bg-[#14532D] hover:bg-[#15803D] text-white text-xs font-bold rounded flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Bulk Confirm Pending Liens</span>
              </button>
            )}
          </div>
        </div>

        {/* Master Verification Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse gov-table">
            <thead>
              <tr className="bg-[#F5F4F0] border-b border-[#D4D1C7] text-slate-700 font-bold uppercase text-[10.5px]">
                <th>FDR Number & Branch</th>
                <th>Depositor Institution</th>
                <th>CBS Master Principal</th>
                <th>Maturity Date</th>
                <th>CBS Lien Status</th>
                <th>Loan / Encumbrance</th>
                <th className="text-right">Action Desk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {displayedInstruments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-500 font-mono text-xs">
                    No instruments found matching the selected filter for {selectedBank}.
                  </td>
                </tr>
              ) : (
                displayedInstruments.map((item) => {
                  const hasOverdraft = item.bankCbs.hasEncumbrance;
                  const isLienConfirmed = item.bankCbs.activeLienMarked;

                  return (
                    <React.Fragment key={item.id}>
                      <tr className="transition-colors hover:bg-stone-50">
                      <td className="font-mono font-bold text-slate-900 text-xs py-3 px-4">
                        {item.fdrNumber}
                        <div className="text-[10px] text-slate-500 font-mono font-normal">Branch: {item.branchName}</div>
                        <div className="text-[10px] text-purple-900 font-mono font-semibold">IFSC: {item.ifscCode}</div>
                      </td>

                      <td className="max-w-[240px] py-3 px-4">
                        <div className="font-bold text-slate-900 text-xs truncate">{item.institutionName}</div>
                        <div className="text-[10px] text-slate-500 font-mono">ID: {item.institutionId} • Region: {item.region}</div>
                        <div className="text-[10px] text-slate-400 font-mono">AISHE: {item.aisheCode}</div>
                      </td>

                      <td className="rupee-mono font-bold text-slate-900 py-3 px-4">
                        {formatInr(item.actualDeposit)}
                        {item.actualDeposit !== item.principalAmount && (
                          <div className="text-[10px] text-red-700 font-bold bg-red-50 p-0.5 rounded border border-red-200 mt-0.5 font-sans">
                            ⚠️ College Claimed: {formatInr(item.principalAmount)}
                          </div>
                        )}
                      </td>

                      <td className="font-mono text-xs text-slate-900 py-3 px-4">
                        {formatGovDate(item.maturityDate)}
                        <div className="text-[10px] text-slate-500">Issued: {formatGovDate(item.issueDate)}</div>
                      </td>

                      <td className="py-3 px-4">
                        {isLienConfirmed ? (
                          <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 px-2 py-0.5 rounded text-[10.5px] font-mono font-bold inline-flex items-center gap-1">
                            <Check className="w-3 h-3 text-emerald-700" />
                            <span>Lien Marked</span>
                          </span>
                        ) : (
                          <span className="bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded text-[10.5px] font-mono font-bold">
                            Lien Unconfirmed
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => setExpandedRowId(prev => prev === item.id ? null : item.id)}
                          className="group text-left cursor-pointer transition-transform active:scale-95"
                          title="Click to toggle Inline Audit Dossier & Encumbrance Details"
                        >
                          {hasOverdraft ? (
                            <div className="text-red-900 bg-red-100 hover:bg-red-200 border border-red-300 px-2 py-0.5 rounded text-[10.5px] font-bold flex items-center gap-1.5 shadow-2xs font-sans">
                              <AlertTriangle className="w-3.5 h-3.5 text-red-700 shrink-0 animate-bounce" />
                              <span>⚠️ Overdraft: {formatInr(item.bankCbs.overdraftLoanAmount || 0)}</span>
                              <ChevronDown className={`w-3 h-3 text-red-700 transition-transform ${expandedRowId === item.id ? 'rotate-180' : ''}`} />
                            </div>
                          ) : (
                            <div className="text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded text-[10.5px] font-mono font-semibold flex items-center gap-1.5">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                              <span>✓ Nil Encumbrance</span>
                              <ChevronDown className={`w-3 h-3 text-emerald-600 transition-transform ${expandedRowId === item.id ? 'rotate-180' : ''}`} />
                            </div>
                          )}
                        </button>
                      </td>

                      {/* Action Buttons with Fixed Interactive State Handlers */}
                      <td className="text-right whitespace-nowrap py-3 px-4">
                        <div className="flex items-center justify-end gap-1.5">
                          
                          {/* Toggle Inline Audit Dossier Button */}
                          <button
                            type="button"
                            onClick={() => setExpandedRowId(prev => prev === item.id ? null : item.id)}
                            className={`p-1.5 border rounded transition-colors cursor-pointer ${
                              expandedRowId === item.id
                                ? 'bg-purple-900 text-white border-purple-900 shadow-2xs'
                                : 'bg-stone-100 hover:bg-stone-200 border-[#D4D1C7] text-slate-700'
                            }`}
                            title={expandedRowId === item.id ? 'Collapse Inline Audit Dossier' : 'Inspect Inline Audit Dossier & SFMS Details'}
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>

                          {/* Inspect Document Modal Button */}
                          <button
                            type="button"
                            onClick={() => onInspectDocument(item)}
                            className="p-1.5 bg-stone-100 hover:bg-stone-200 border border-[#D4D1C7] rounded text-slate-700 transition-colors cursor-pointer"
                            title="Inspect Full Scanned PDF Dossier"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Re-confirm / Confirm Lien Button */}
                          <button
                            type="button"
                            onClick={() => handleMarkLien(item)}
                            className={`px-2.5 py-1 text-white rounded text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                              isLienConfirmed && !hasOverdraft
                                ? 'bg-emerald-800 hover:bg-emerald-900 shadow-2xs'
                                : 'bg-[#14532D] hover:bg-[#15803D]'
                            }`}
                            title="Confirm exclusive AICTE lien in core banking master"
                          >
                            <Check className="w-3 h-3" />
                            <span>{isLienConfirmed && !hasOverdraft ? 'Re-confirm' : 'Confirm Lien'}</span>
                          </button>

                          {/* Flag Overdraft Button */}
                          <button
                            type="button"
                            onClick={() => handleOpenOverdraftModal(item)}
                            className={`px-2.5 py-1 text-white rounded text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                              hasOverdraft
                                ? 'bg-red-900 hover:bg-red-950 ring-1 ring-red-400'
                                : 'bg-red-800 hover:bg-red-900 shadow-2xs'
                            }`}
                            title="Flag secret loan / overdraft facility active against this FDR"
                          >
                            <AlertTriangle className="w-3 h-3" />
                            <span>Flag OD</span>
                          </button>

                        </div>
                      </td>
                    </tr>

                    {/* ======================================================== */}
                    {/* INLINE AUDIT DOSSIER & ENCUMBRANCE DETAILS DRAWER        */}
                    {/* ======================================================== */}
                    {expandedRowId === item.id && (
                      <tr key={`${item.id}-inline-dossier`} className="bg-[#FAF9F5] border-y-2 border-purple-300">
                        <td colSpan={7} className="p-4 sm:p-5 animate-in fade-in duration-150">
                          <div className="bg-white border border-[#D4D1C7] rounded p-4 shadow-sm space-y-4">
                            
                            {/* Drawer Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-3">
                              <div className="flex items-center gap-2.5">
                                <FileCheck className="w-5 h-5 text-purple-900 shrink-0" />
                                <div>
                                  <div className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-2">
                                    <span>INLINE AUDIT DOSSIER: {item.institutionName}</span>
                                    <span className="font-mono text-[10px] bg-purple-100 text-purple-900 px-1.5 py-0.5 rounded font-bold">
                                      FDR #{item.fdrNumber}
                                    </span>
                                  </div>
                                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                                    Bank Branch: {item.branchName} • IFSC: {item.ifscCode} • Core CBS Reference: {item.bankCbs.cbsReferenceNumber || 'CBS-LIVE-VERIFIED'}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                {hasOverdraft ? (
                                  <span className="text-[10.5px] font-bold bg-red-100 text-red-900 border border-red-300 px-2 py-1 rounded">
                                    ⚠️ COLLATERAL BREACH: ACTIVE OVERDRAFT
                                  </span>
                                ) : (
                                  <span className="text-[10.5px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 px-2 py-1 rounded">
                                    ✓ EXCLUSIVE FIRST CHARGE CONFIRMED
                                  </span>
                                )}
                                <button
                                  type="button"
                                  onClick={() => setExpandedRowId(null)}
                                  className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-stone-100"
                                  title="Close Dossier"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            {/* 3-Column Dossier Breakdown */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
                              
                              {/* 1. Collateral & Facility Health */}
                              <div className={`p-3 rounded border ${hasOverdraft ? 'bg-red-50/70 border-red-200' : 'bg-stone-50 border-stone-200'}`}>
                                <div className="font-bold text-[10.5px] uppercase tracking-wider text-slate-700 flex items-center gap-1.5 border-b border-slate-200 pb-1.5 mb-2">
                                  <AlertTriangle className={`w-3.5 h-3.5 ${hasOverdraft ? 'text-red-600' : 'text-slate-400'}`} />
                                  <span>Collateral & Encumbrance Status</span>
                                </div>
                                <div className="space-y-1.5 font-mono text-[11px]">
                                  <div className="flex justify-between">
                                    <span className="text-slate-600 font-sans">Principal Corpus:</span>
                                    <strong className="text-slate-900">{formatInr(item.actualDeposit)}</strong>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-slate-600 font-sans">Secret Overdraft:</span>
                                    <strong className={hasOverdraft ? 'text-red-700 font-bold' : 'text-emerald-700'}>
                                      {hasOverdraft ? formatInr(item.bankCbs.overdraftLoanAmount || 0) : '₹0 (Nil)'}
                                    </strong>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-slate-600 font-sans">Facility Reference:</span>
                                    <span className="text-slate-800">{item.bankCbs.cbsReferenceNumber || 'N/A (Unencumbered)'}</span>
                                  </div>
                                  <div className="pt-1 text-[10.5px] font-sans border-t border-slate-200">
                                    <span className="text-slate-600">Statutory Mandate: </span>
                                    <strong className={hasOverdraft ? 'text-red-800' : 'text-emerald-800'}>
                                      {hasOverdraft 
                                        ? 'Violates Negative Lien Guarantee (Banking Reg Act Sec 45)' 
                                        : 'Banking Regulation Act 1949 Sec 45 Compliant'}
                                    </strong>
                                  </div>
                                </div>
                              </div>

                              {/* 2. Core Banking Engine Audit Trail */}
                              <div className="p-3 bg-stone-50 rounded border border-stone-200">
                                <div className="font-bold text-[10.5px] uppercase tracking-wider text-slate-700 flex items-center gap-1.5 border-b border-stone-200 pb-1.5 mb-2">
                                  <Database className="w-3.5 h-3.5 text-purple-800" />
                                  <span>Core Banking Host Verification</span>
                                </div>
                                <div className="space-y-1.5 text-[11px]">
                                  <div>
                                    <span className="text-slate-500 font-sans">Live Handshake Timestamp:</span>
                                    <div className="font-mono text-slate-800 font-semibold mt-0.5">
                                      {item.bankCbs.handshakeTimestamp || `${simulatedDate} 09:30:14 IST`}
                                    </div>
                                  </div>
                                  <div>
                                    <span className="text-slate-500 font-sans">AICTE Lien Registration:</span>
                                    <div className={`font-mono font-bold mt-0.5 ${item.bankCbs.activeLienMarked ? 'text-emerald-800' : 'text-amber-800'}`}>
                                      {item.bankCbs.activeLienMarked ? '✓ Irrevocable Joint Lien Active' : '⚠️ Unconfirmed'}
                                    </div>
                                  </div>
                                  <div className="pt-1 text-[10.5px] text-slate-600 border-t border-stone-200">
                                    <em>"{item.bankCbs.remarks || 'Deposit confirmed in core banking host.'}"</em>
                                  </div>
                                </div>
                              </div>

                              {/* 3. SFMS Structured Financial Messaging Advice */}
                              <div className="p-3 bg-stone-50 rounded border border-stone-200">
                                <div className="font-bold text-[10.5px] uppercase tracking-wider text-slate-700 flex items-center gap-1.5 border-b border-stone-200 pb-1.5 mb-2">
                                  <Radio className="w-3.5 h-3.5 text-purple-900" />
                                  <span>SFMS Inter-Bank ISO 20022 Advice</span>
                                </div>
                                <div className="space-y-1.5 font-mono text-[11px]">
                                  <div>
                                    <span className="text-slate-500 font-sans">Advice Protocol:</span>
                                    <div className="font-bold text-slate-900 mt-0.5">
                                      {hasOverdraft ? 'SFMS MT799 (Encumbrance Discrepancy)' : 'SFMS MT760 (Lien Confirmation)'}
                                    </div>
                                  </div>
                                  <div>
                                    <span className="text-slate-500 font-sans">Transmission Digest:</span>
                                    <div className="text-[10px] text-slate-600 truncate mt-0.5" title={item.sha256Hash}>
                                      {hasOverdraft 
                                        ? '4a6b281c7e9238d2f09a15b3648e890c2f8216d7a4e09871b632ef10928374aa' 
                                        : 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}
                                    </div>
                                  </div>
                                  <div className="pt-1 text-[10.5px] text-emerald-800 font-bold border-t border-stone-200 flex items-center gap-1 font-sans">
                                    <Check className="w-3 h-3 text-emerald-600" />
                                    <span>Cryptographic ACK Delivered to AICTE HQ</span>
                                  </div>
                                </div>
                              </div>

                            </div>

                            {/* Action Strip */}
                            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-200">
                              <div className="text-[11px] text-slate-500 font-mono">
                                Security Deposit Corpus Status: <strong className="text-slate-800">{item.verificationStatus}</strong>
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => onInspectDocument(item)}
                                  className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-slate-800 border border-[#D4D1C7] rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>Inspect Full Scanned PDF</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleMarkLien(item)}
                                  className="px-3 py-1.5 bg-[#14532D] hover:bg-[#15803D] text-white rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>{isLienConfirmed && !hasOverdraft ? 'Re-confirm Exclusive Lien' : 'Confirm Exclusive Lien'}</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleOpenOverdraftModal(item)}
                                  className="px-3 py-1.5 bg-red-800 hover:bg-red-900 text-white rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                                >
                                  <AlertTriangle className="w-3.5 h-3.5" />
                                  <span>Flag / Update Overdraft</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => setExpandedRowId(null)}
                                  className="px-2.5 py-1.5 bg-white border border-[#D4D1C7] text-slate-600 hover:bg-stone-100 rounded text-xs font-medium cursor-pointer transition-colors"
                                >
                                  Collapse
                                </button>
                              </div>
                            </div>

                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>

      {/* ======================================================== */}
      {/* 5. SFMS LIVE MESSAGE TRANSMISSION AUDIT TRAIL            */}
      {/* ======================================================== */}
      <div className="bg-[#FFFFFF] border border-[#D4D1C7] rounded-sm shadow-xs overflow-hidden">
        <div className="p-3.5 bg-[#F8F7F4] border-b border-[#D4D1C7] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-purple-900" />
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900">
              SFMS (Structured Financial Messaging System) Inter-Bank Audit Trail
            </h4>
          </div>
          <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">
            RBI-SFMS Gateway • 256-Bit Cryptographic Advice
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse gov-table text-xs">
            <thead>
              <tr className="bg-[#F5F4F0] border-b border-[#D4D1C7] text-slate-700 font-bold uppercase text-[10px]">
                <th className="py-2 px-3">SFMS Msg ID</th>
                <th className="py-2 px-3">Timestamp</th>
                <th className="py-2 px-3">Message Category</th>
                <th className="py-2 px-3">Instrument Pledged</th>
                <th className="py-2 px-3">Originating Bank</th>
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3">Cryptographic SHA-256 Proof</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-mono">
              {sfmsLog.map((log) => (
                <tr key={log.id} className="hover:bg-stone-50">
                  <td className="py-2.5 px-3 font-bold text-purple-950">{log.id}</td>
                  <td className="py-2.5 px-3 text-slate-600">{log.timestamp}</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-900 font-sans">{log.messageType}</td>
                  <td className="py-2.5 px-3 font-bold text-slate-900">{log.fdrNumber}</td>
                  <td className="py-2.5 px-3 text-slate-700 font-sans">{log.bank}</td>
                  <td className="py-2.5 px-3">
                    <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 px-2 py-0.5 rounded text-[10px] font-bold">
                      {log.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-[10px] text-slate-500 truncate max-w-[140px]" title={log.payloadHash}>
                    {log.payloadHash}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 6. FLAG OVERDRAFT FACILITY MODAL                         */}
      {/* ======================================================== */}
      {flagModalInst && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-[#FFFFFF] border-2 border-red-600 rounded-sm max-w-lg w-full p-5 shadow-2xl">
            <div className="flex items-center justify-between text-red-900 border-b border-red-200 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-700" />
                <h3 className="font-bold text-base">
                  Flag Secret Overdraft / Encumbrance to AICTE HQ
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setFlagModalInst(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 mb-3 leading-relaxed">
              You are recording that FDR <strong>#{flagModalInst.fdrNumber}</strong> ({flagModalInst.institutionName}) has an unauthorized credit facility or legal encumbrance in your Core Banking System.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Overdraft / Loan Amount (₹) *</label>
                <input
                  type="number"
                  value={overdraftAmountInput}
                  onChange={(e) => setOverdraftAmountInput(Number(e.target.value))}
                  className="w-full font-mono font-bold bg-stone-50 border border-[#D4D1C7] rounded px-3 py-2 text-slate-900 focus:outline-hidden"
                />
                <span className="text-[10px] text-slate-500 font-mono">
                  Current value: {formatInr(overdraftAmountInput)}
                </span>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Credit Facility Type *</label>
                <select
                  value={overdraftFacilityType}
                  onChange={(e) => setOverdraftFacilityType(e.target.value)}
                  className="w-full bg-stone-50 border border-[#D4D1C7] rounded px-3 py-2 text-slate-900 focus:outline-hidden cursor-pointer font-medium"
                >
                  <option value="SECURED_OVERDRAFT_AGAINST_FDR">Secured Overdraft Facility Against Deposit (OD-FDR)</option>
                  <option value="WORKING_CAPITAL_DEMAND_LOAN">Working Capital Demand Loan (WCDL)</option>
                  <option value="THIRD_PARTY_BANK_GUARANTEE">Third-Party Bank Guarantee Margin</option>
                  <option value="COURT_ORDER_ATTACHMENT">High Court / Civil Court Attachment Order</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Bank Loan Sanction Reference Number *</label>
                <input
                  type="text"
                  value={loanSanctionRef}
                  onChange={(e) => setLoanSanctionRef(e.target.value)}
                  className="w-full font-mono bg-stone-50 border border-[#D4D1C7] rounded px-3 py-2 text-slate-900 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2 border-t border-slate-200 pt-3">
              <button
                type="button"
                onClick={() => setFlagModalInst(null)}
                className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-slate-700 rounded text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmFlagOverdraft}
                className="px-4 py-1.5 bg-red-800 hover:bg-red-900 text-white rounded text-xs font-bold shadow-xs cursor-pointer active:scale-98"
              >
                Submit Discrepancy Alert to AICTE HQ
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

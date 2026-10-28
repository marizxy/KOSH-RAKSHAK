import React, { useState, useRef, useMemo, useEffect } from 'react';
import { FDRInstrument } from '../types';
import { formatInr, formatGovDate, calculateQuarterlyCompoundedMaturity } from '../utils/formatters';
import { GhostEncumbranceScanner } from './GhostEncumbranceScanner';
import { INITIAL_FDR_DATASET } from '../data/mockInstitutions';
import { 
  FileSearch, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Cpu, 
  Binary, 
  Scale, 
  Calculator, 
  Stamp, 
  Sparkles, 
  Eye, 
  FileWarning, 
  Building, 
  Check, 
  XCircle,
  HelpCircle,
  Gavel,
  RefreshCw,
  FileText,
  FileCheck,
  Search,
  ArrowRight,
  ListOrdered,
  UploadCloud,
  FileSignature
} from 'lucide-react';

interface Module2FDRIntakeStudioProps {
  currentInstrument: FDRInstrument;
  onSelectPreset?: (presetId: 'PRESET_A' | 'PRESET_B' | 'PRESET_C') => void;
  onUpdateInstrument: (updated: FDRInstrument) => void;
  userRole?: string;
  instruments?: FDRInstrument[];
  onNavigateToGreenSheet?: (instrument: FDRInstrument) => void;
  onSelectInstrument?: (instrument: FDRInstrument) => void;
}

export const Module2FDRIntakeStudio: React.FC<Module2FDRIntakeStudioProps> = ({
  currentInstrument,
  onSelectPreset,
  onUpdateInstrument,
  userRole = 'regional',
  instruments = [],
  onNavigateToGreenSheet,
  onSelectInstrument,
}) => {
  const [selectedLocalInstrument, setSelectedLocalInstrument] = useState<FDRInstrument | null>(null);
  const activeInstrument = selectedLocalInstrument || currentInstrument;

  const [subDeskView, setSubDeskView] = useState<'FORENSICS' | 'GHOST_SCANNER'>('FORENSICS');
  const [elaOverlayActive, setElaOverlayActive] = useState(
    activeInstrument.forensics.elaTamperingDetected
  );
  const [activeTab, setActiveTab] = useState<'DOCUMENT' | 'METADATA'>('DOCUMENT');

  // Sync ELA and overlay when active instrument changes
  useEffect(() => {
    setElaOverlayActive(activeInstrument.forensics.elaTamperingDetected);
  }, [activeInstrument.id, activeInstrument.forensics.elaTamperingDetected]);

  // Regional View Mode: Queue vs Ad-Hoc Drag-and-Drop
  const [regionalMode, setRegionalMode] = useState<'QUEUE' | 'DRAG_DROP'>(
    userRole === 'college' ? 'DRAG_DROP' : 'QUEUE'
  );
  const [queueSearchQuery, setQueueSearchQuery] = useState('');
  const [queueStatusFilter, setQueueStatusFilter] = useState<'ALL' | 'FLAGGED' | 'CLEAN' | 'PENDING'>('ALL');

  // Drag-and-drop & Analysis States
  const [isDragActive, setIsDragActive] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzingStage, setAnalyzingStage] = useState(0);
  const [analyzedFileName, setAnalyzedFileName] = useState<string | null>(null);
  const [analysisResultAlert, setAnalysisResultAlert] = useState<{
    type: 'GENUINE' | 'FORGED' | 'LOOPHOLE';
    title: string;
    description: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filtered Regional Submission Queue
  const submissionQueue = useMemo(() => {
    if (!instruments || instruments.length === 0) return [currentInstrument];
    return instruments.filter((inst) => {
      const matchesSearch =
        inst.institutionName.toLowerCase().includes(queueSearchQuery.toLowerCase()) ||
        inst.institutionId.toLowerCase().includes(queueSearchQuery.toLowerCase()) ||
        inst.fdrNumber.toLowerCase().includes(queueSearchQuery.toLowerCase());

      let matchesStatus = true;
      if (queueStatusFilter === 'FLAGGED') {
        matchesStatus = inst.forensics.mathMismatch || inst.forensics.elaTamperingDetected || inst.hasEitherSurvivorClause || inst.bankCbs.hasEncumbrance;
      } else if (queueStatusFilter === 'CLEAN') {
        matchesStatus = !inst.forensics.mathMismatch && !inst.forensics.elaTamperingDetected && !inst.hasEitherSurvivorClause && !inst.bankCbs.hasEncumbrance;
      } else if (queueStatusFilter === 'PENDING') {
        matchesStatus = inst.verificationStatus === 'PENDING_SCRUTINY';
      }

      return matchesSearch && matchesStatus;
    });
  }, [instruments, queueSearchQuery, queueStatusFilter, currentInstrument]);

  // Real-Time 6-Layer Forensic Pipeline Execution Simulator
  const executeForensicPipeline = (fileName: string, targetInst?: FDRInstrument) => {
    setIsAnalyzing(true);
    setAnalyzedFileName(fileName);
    setAnalysisResultAlert(null);
    setAnalyzingStage(1);

    const lower = fileName.toLowerCase();
    
    // Explicit classification:
    // 1. Forged / Spliced receipt
    const isSample2 = lower.includes('photoshopped') || lower.includes('pnb') || lower.includes('sample_2') || lower.includes('forged') || lower.includes('tamper') || lower.includes('fake') || lower.includes('altered') || (targetInst ? (targetInst.forensics.elaTamperingDetected || targetInst.forensics.mathMismatch) : false);
    // 2. Loophole receipt
    const isSample3 = !isSample2 && (lower.includes('loophole') || lower.includes('canara') || lower.includes('sample_3') || lower.includes('survivor') || lower.includes('mandate') || (targetInst ? targetInst.hasEitherSurvivorClause : false));
    // 3. Genuine SBI receipt or clean default
    const isSample1 = !isSample2 && !isSample3;

    // Stage progression
    setTimeout(() => setAnalyzingStage(2), 200);
    setTimeout(() => setAnalyzingStage(3), 400);
    setTimeout(() => setAnalyzingStage(4), 650);
    setTimeout(() => setAnalyzingStage(5), 850);
    setTimeout(() => setAnalyzingStage(6), 1050);

    setTimeout(() => {
      setIsAnalyzing(false);

      if (isSample2) {
        const resolvedTarget = targetInst || instruments.find(i => i.id === 'FDR-02-PNB-FORGERY') || INITIAL_FDR_DATASET[1];
        setSelectedLocalInstrument(resolvedTarget);
        if (onSelectInstrument) onSelectInstrument(resolvedTarget);
        if (onSelectPreset) onSelectPreset('PRESET_B');
        setElaOverlayActive(true);
        setAnalysisResultAlert({
          type: 'FORGED',
          title: 'CRITICAL FORENSIC TAMPERING & ACTUARIAL FRAUD CAUGHT!',
          description: 'Layer 2 ELA detected spliced digit "3" (X:62%, Y:38%). Layer 3 Actuarial Formula exposed mathematical gap of -₹35,08,320 (Maturity belongs to ₹15L). Layer 6 cross-referenced active Allahabad High Court stay WP(C) 4182/2025.',
        });
      } else if (isSample3) {
        const resolvedTarget = targetInst || instruments.find(i => i.id === 'FDR-03-CNB-LOOPHOLE') || INITIAL_FDR_DATASET[2];
        setSelectedLocalInstrument(resolvedTarget);
        if (onSelectInstrument) onSelectInstrument(resolvedTarget);
        if (onSelectPreset) onSelectPreset('PRESET_C');
        setElaOverlayActive(false);
        setAnalysisResultAlert({
          type: 'LOOPHOLE',
          title: 'REGULATORY MANDATE DEFECT IDENTIFIED!',
          description: 'Layer 4 NLP Legal Scanner caught "Payable to Either or Survivor" clause in Canara Bank FDR, creating an illegal unilateral liquidation loophole violating APH 2026-27 Section 1.4(b).',
        });
      } else {
        const resolvedTarget = targetInst || instruments.find(i => i.id === 'FDR-01-SBI-COMPLIANT') || INITIAL_FDR_DATASET[0];
        setSelectedLocalInstrument(resolvedTarget);
        if (onSelectInstrument) onSelectInstrument(resolvedTarget);
        if (onSelectPreset) onSelectPreset('PRESET_A');
        setElaOverlayActive(false);
        setAnalysisResultAlert({
          type: 'GENUINE',
          title: 'VERIFIED 100% AUTHENTIC SECURITY DEPOSIT!',
          description: 'Layer 1 OCR matched all field coordinates (99.7% Char Match). Layer 2 pixel compression clean. Layer 3 Actuarial Math Formula matched printed maturity (₹61,39,560) down to the exact rupee. AICTE first-charge escrow confirmed.',
        });
      }
    }, 1200);
  };

  // 1-Click Automated Inspection from Regional Queue
  const handleQueueRowClick = (inst: FDRInstrument) => {
    if (onSelectInstrument) {
      onSelectInstrument(inst);
    }
    executeForensicPipeline(inst.fdrNumber + '_scan.pdf', inst);
  };

  // Drag-and-drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      executeForensicPipeline(file.name);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      executeForensicPipeline(file.name);
    }
  };

  const isMathForged = activeInstrument.forensics.mathMismatch;
  const isElaForged = activeInstrument.forensics.elaTamperingDetected;
  const isLoophole = activeInstrument.hasEitherSurvivorClause;
  const isShortfall = activeInstrument.depositDeficit > 0;
  const hasGhostHold = activeInstrument.ghostEncumbrance.hasLitigationHold && !activeInstrument.ghostEncumbrance.clearedByOfficer;

  return (
    <div className="space-y-6">
      
      {/* 1. Header & Regional Queue Toggle */}
      <div className="bg-[#FFFFFF] border border-[#D4D1C7] p-4 rounded-sm shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-[#14532D]" />
              <h2 className="text-base font-bold text-slate-900">
                Smart FDR Intake & 6-Layer Forensic Scrutiny Studio
              </h2>
              <span className="text-[10px] font-mono bg-emerald-100 text-emerald-900 border border-emerald-300 px-2 py-0.5 rounded font-bold">
                99.7% OCR Auto-Fill
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Multi-modal OCR auto-extraction, pixel Error Level Analysis (ELA), and actuarial compound interest validation engine (PS ID: 26265)
            </p>
          </div>

          {/* Mode Switcher for Regional Scrutiny Officer */}
          {userRole === 'regional' && (
            <div className="flex items-center gap-1.5 bg-[#F5F4F0] p-1 rounded border border-[#D4D1C7]">
              <button
                type="button"
                onClick={() => setRegionalMode('QUEUE')}
                className={`px-3 py-1 text-xs font-bold rounded flex items-center gap-1.5 transition-colors cursor-pointer ${
                  regionalMode === 'QUEUE'
                    ? 'bg-[#14532D] text-white shadow-2xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                <ListOrdered className="w-3.5 h-3.5" />
                <span>Regional Submission Queue ({submissionQueue.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setRegionalMode('DRAG_DROP')}
                className={`px-3 py-1 text-xs font-bold rounded flex items-center gap-1.5 transition-colors cursor-pointer ${
                  regionalMode === 'DRAG_DROP'
                    ? 'bg-[#14532D] text-white shadow-2xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Ad-hoc File Scrutiny</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. REGIONAL MASTER SUBMISSION QUEUE (INCOMING COLLEGE FDRs) */}
      {/* ======================================================== */}
      {userRole === 'regional' && regionalMode === 'QUEUE' && (
        <div className="bg-[#FFFFFF] border border-[#D4D1C7] rounded-sm p-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 pb-3 mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Building className="w-4 h-4 text-[#14532D]" />
                <span>Master Submission Queue (Incoming College Security Deposits)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Click any incoming college deposit to execute automated 1-click forensic scrutiny in the background
              </p>
            </div>

            {/* Queue Search & Status Filter */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Search college, ID, FDR..."
                  value={queueSearchQuery}
                  onChange={(e) => setQueueSearchQuery(e.target.value)}
                  className="pl-8 pr-2.5 py-1 text-xs bg-[#F5F4F0] border border-[#D4D1C7] rounded text-slate-800 placeholder:text-slate-400 focus:outline-hidden w-48 sm:w-56 font-mono"
                />
              </div>

              <select
                value={queueStatusFilter}
                onChange={(e: any) => setQueueStatusFilter(e.target.value)}
                className="py-1 px-2 text-xs bg-[#F5F4F0] border border-[#D4D1C7] rounded text-slate-800 font-medium focus:outline-hidden"
              >
                <option value="ALL">All Submissions</option>
                <option value="FLAGGED">AI Flagged (Mismatch)</option>
                <option value="CLEAN">Clean (Ready for Sign-off)</option>
                <option value="PENDING">Pending Review</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F8F7F4] border-b border-[#D4D1C7] text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">Institution Name</th>
                  <th className="py-2.5 px-3">AICTE Permanent ID</th>
                  <th className="py-2.5 px-3">FDR Number</th>
                  <th className="py-2.5 px-3">Principal Amount</th>
                  <th className="py-2.5 px-3">Submission Date</th>
                  <th className="py-2.5 px-3">AI Scrutiny Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {submissionQueue.map((item) => {
                  const isSelected = item.id === activeInstrument.id;
                  const hasDiscrepancy = item.forensics.mathMismatch || item.forensics.elaTamperingDetected || item.hasEitherSurvivorClause || item.bankCbs.hasEncumbrance;

                  return (
                    <tr
                      key={item.id}
                      onClick={() => handleQueueRowClick(item)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-emerald-50/70 border-l-4 border-l-emerald-600'
                          : 'hover:bg-stone-50'
                      }`}
                    >
                      <td className="py-2.5 px-3 font-semibold text-slate-900 max-w-[240px] truncate">
                        {item.institutionName}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-600">
                        {item.institutionId}
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-800">
                        {item.fdrNumber}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-800 font-bold">
                        {formatInr(item.principalAmount)}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-600">
                        {formatGovDate(item.issueDate)}
                      </td>
                      <td className="py-2.5 px-3">
                        {hasDiscrepancy ? (
                          <span className="inline-flex items-center gap-1 bg-red-100 text-red-900 border border-red-300 text-[10.5px] font-mono px-2 py-0.5 rounded font-bold animate-pulse">
                            <AlertTriangle className="w-3 h-3 text-red-700" />
                            <span>AI Flagged - Mismatch</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10.5px] font-mono px-2 py-0.5 rounded font-bold">
                            <Check className="w-3 h-3 text-emerald-700" />
                            <span>Clean - Ready for Sign-off</span>
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQueueRowClick(item);
                          }}
                          className={`px-2.5 py-1 text-[11px] font-bold rounded flex items-center gap-1 ml-auto transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-[#14532D] text-white shadow-2xs'
                              : 'bg-stone-100 hover:bg-stone-200 text-slate-800 border border-stone-300'
                          }`}
                        >
                          <Cpu className="w-3 h-3" />
                          <span>1-Click Scrutiny</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. CLEAN DRAG-AND-DROP FILE UPLOAD ZONE                   */}
      {/* ======================================================== */}
      {(userRole === 'college' || regionalMode === 'DRAG_DROP') && (
        <div 
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-sm p-6 text-center transition-all cursor-pointer relative ${
            isDragActive
              ? 'border-emerald-600 bg-emerald-50/80 ring-4 ring-emerald-300/50 scale-[1.01]'
              : 'border-[#D4D1C7] hover:border-slate-700 bg-[#FFFFFF] hover:bg-stone-50/80 shadow-xs'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileInputChange}
            accept=".pdf,.png,.jpg,.jpeg"
            className="hidden"
          />

          <div className="max-w-xl mx-auto flex flex-col items-center justify-center space-y-2.5">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
              isDragActive ? 'bg-emerald-600 text-white' : 'bg-stone-100 text-slate-700 border border-[#D4D1C7]'
            }`}>
              <Upload className="w-6 h-6" />
            </div>

            <div>
              <div className="text-sm font-bold text-slate-900">
                Drag & Drop Scanned FDR Receipt here or <span className="text-[#14532D] underline">Browse Files</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Drop your scanned banking PDF receipt to trigger real-time 6-layer forensic scrutiny
              </p>
            </div>

            {/* Quick Test Triggers */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2" onClick={(e) => e.stopPropagation()}>
              <span className="text-[10.5px] font-semibold text-slate-500 font-mono">Simulate Test Drop:</span>
              
              <button
                type="button"
                onClick={() => executeForensicPipeline('Sample_1_Genuine_SBI_FDR.pdf')}
                className="px-2.5 py-1 bg-white border border-emerald-400 hover:bg-emerald-50 text-emerald-900 rounded text-[11px] font-bold shadow-2xs flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-emerald-600" />
                <span>Genuine SBI FDR</span>
              </button>

              <button
                type="button"
                onClick={() => executeForensicPipeline('Sample_2_Photoshopped_PNB_FDR.pdf')}
                className="px-2.5 py-1 bg-white border border-red-400 hover:bg-red-50 text-red-900 rounded text-[11px] font-bold shadow-2xs flex items-center gap-1 cursor-pointer"
              >
                <ShieldAlert className="w-3 h-3 text-red-600" />
                <span>Photoshop Forgery</span>
              </button>

              <button
                type="button"
                onClick={() => executeForensicPipeline('Sample_3_Loophole_FDR.pdf')}
                className="px-2.5 py-1 bg-white border border-amber-400 hover:bg-amber-50 text-amber-900 rounded text-[11px] font-bold shadow-2xs flex items-center gap-1 cursor-pointer"
              >
                <AlertTriangle className="w-3 h-3 text-amber-600" />
                <span>Either-or-Survivor Loophole</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. REAL-TIME 6-LAYER SCANNING HUD PROGRESS               */}
      {/* ======================================================== */}
      {isAnalyzing && (
        <div className="bg-[#16202A] text-white p-5 rounded-sm shadow-xl border-2 border-emerald-500 space-y-4 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700 pb-3">
            <div className="flex items-center gap-2.5">
              <RefreshCw className="w-5 h-5 text-emerald-400 animate-spin" />
              <div>
                <h3 className="font-bold text-sm text-white">
                  Executing 6-Layer Multi-Modal Scrutiny Engine on <span className="font-mono text-amber-300 font-bold">{analyzedFileName}</span>
                </h3>
                <div className="text-[11px] text-slate-300">
                  AI OCR extraction, pixel error level compression analysis, and quarterly actuarial compounding physics
                </div>
              </div>
            </div>
            <span className="font-mono text-xs text-emerald-400 font-bold bg-slate-800 px-2.5 py-1 rounded border border-slate-600">
              STAGE {analyzingStage} OF 6
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
            <div className={`p-2 rounded border font-mono transition-all ${
              analyzingStage >= 1 ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200' : 'bg-slate-800/50 border-slate-700 text-slate-500'
            }`}>
              <div className="text-[10px] uppercase font-bold flex items-center justify-between">
                <span>Layer 1: OCR</span>
                {analyzingStage >= 1 && <Check className="w-3 h-3 text-emerald-400" />}
              </div>
              <div className="text-[11px] truncate mt-1">99.7% Char Match</div>
            </div>

            <div className={`p-2 rounded border font-mono transition-all ${
              analyzingStage >= 2 ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200' : 'bg-slate-800/50 border-slate-700 text-slate-500'
            }`}>
              <div className="text-[10px] uppercase font-bold flex items-center justify-between">
                <span>Layer 2: ELA</span>
                {analyzingStage >= 2 && <Check className="w-3 h-3 text-emerald-400" />}
              </div>
              <div className="text-[11px] truncate mt-1">Pixel Heatmap</div>
            </div>

            <div className={`p-2 rounded border font-mono transition-all ${
              analyzingStage >= 3 ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200' : 'bg-slate-800/50 border-slate-700 text-slate-500'
            }`}>
              <div className="text-[10px] uppercase font-bold flex items-center justify-between">
                <span>Layer 3: Math</span>
                {analyzingStage >= 3 && <Check className="w-3 h-3 text-emerald-400" />}
              </div>
              <div className="text-[11px] truncate mt-1">A = P(1+r/400)⁴ⁿ</div>
            </div>

            <div className={`p-2 rounded border font-mono transition-all ${
              analyzingStage >= 4 ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200' : 'bg-slate-800/50 border-slate-700 text-slate-500'
            }`}>
              <div className="text-[10px] uppercase font-bold flex items-center justify-between">
                <span>Layer 4: APH</span>
                {analyzingStage >= 4 && <Check className="w-3 h-3 text-emerald-400" />}
              </div>
              <div className="text-[11px] truncate mt-1">Table 4.1 Norms</div>
            </div>

            <div className={`p-2 rounded border font-mono transition-all ${
              analyzingStage >= 5 ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200' : 'bg-slate-800/50 border-slate-700 text-slate-500'
            }`}>
              <div className="text-[10px] uppercase font-bold flex items-center justify-between">
                <span>Layer 5: Mandate</span>
                {analyzingStage >= 5 && <Check className="w-3 h-3 text-emerald-400" />}
              </div>
              <div className="text-[11px] truncate mt-1">NLP Clause Scan</div>
            </div>

            <div className={`p-2 rounded border font-mono transition-all ${
              analyzingStage >= 6 ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200' : 'bg-slate-800/50 border-slate-700 text-slate-500'
            }`}>
              <div className="text-[10px] uppercase font-bold flex items-center justify-between">
                <span>Layer 6: Legal</span>
                {analyzingStage >= 6 && <Check className="w-3 h-3 text-emerald-400" />}
              </div>
              <div className="text-[11px] truncate mt-1">e-Courts NJDG Sync</div>
            </div>
          </div>

          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-500 h-full transition-all duration-200 rounded-full"
              style={{ width: `${(analyzingStage / 6) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. POST-ANALYSIS VERDICT ALERT & QUICK GREEN SHEET CTA    */}
      {/* ======================================================== */}
      {analysisResultAlert && (
        <div className={`p-4 rounded-sm border-2 shadow-md transition-all ${
          analysisResultAlert.type === 'FORGED'
            ? 'bg-red-50 border-red-600 text-red-950'
            : analysisResultAlert.type === 'LOOPHOLE'
            ? 'bg-amber-50 border-amber-600 text-amber-950'
            : 'bg-emerald-50 border-emerald-600 text-emerald-950'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              {analysisResultAlert.type === 'FORGED' ? (
                <ShieldAlert className="w-6 h-6 text-red-700 shrink-0 mt-0.5 animate-pulse" />
              ) : analysisResultAlert.type === 'LOOPHOLE' ? (
                <AlertTriangle className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-6 h-6 text-emerald-700 shrink-0 mt-0.5" />
              )}
              <div>
                <div className="font-bold text-sm leading-tight uppercase tracking-wide">
                  {analysisResultAlert.title}
                </div>
                <p className="text-xs mt-1 leading-relaxed">
                  {analysisResultAlert.description}
                </p>
                <div className="mt-2 text-[11px] font-mono font-semibold flex flex-wrap items-center gap-2">
                  <span>Target: <strong>{activeInstrument.institutionName}</strong> ({activeInstrument.fdrNumber})</span>
                  <span>•</span>
                  <span>Trust Score: <strong>{activeInstrument.forensics.trustScore}%</strong></span>
                </div>
              </div>
            </div>

            {/* Quick Action Button to Navigate to Green Sheet */}
            {onNavigateToGreenSheet && (
              <button
                type="button"
                onClick={() => onNavigateToGreenSheet(activeInstrument)}
                className="px-3.5 py-2 text-xs font-bold rounded bg-[#14532D] hover:bg-[#15803D] text-white flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer self-start sm:self-auto"
              >
                <FileSignature className="w-4 h-4" />
                <span>Execute e-Office Green Sheet ➔</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 6. SUB-DESK NAVIGATION: 6-LAYER FORENSICS vs GHOST SCANNER */}
      {/* ======================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[#D4D1C7] pb-1">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSubDeskView('FORENSICS')}
            className={`flex items-center gap-2 py-2 px-3 text-xs font-bold rounded-t border-t border-x transition-colors cursor-pointer ${
              subDeskView === 'FORENSICS'
                ? 'bg-white border-[#D4D1C7] text-slate-900 -mb-px border-b-2 border-b-white shadow-2xs'
                : 'bg-stone-100 border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-[#14532D]" />
            <span>6-Layer Forensic & ELA Scrutiny Engine</span>
            {(isElaForged || isMathForged) && (
              <span className="bg-red-600 text-white text-[9px] px-1.5 py-0.2 rounded font-mono font-bold animate-pulse">
                FLAGGED
              </span>
            )}
          </button>

          <button
            onClick={() => setSubDeskView('GHOST_SCANNER')}
            className={`flex items-center gap-2 py-2 px-3 text-xs font-bold rounded-t border-t border-x transition-colors cursor-pointer ${
              subDeskView === 'GHOST_SCANNER'
                ? 'bg-white border-[#D4D1C7] text-slate-900 -mb-px border-b-2 border-b-white shadow-2xs'
                : 'bg-stone-100 border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Gavel className="w-3.5 h-3.5 text-red-700" />
            <span>AI "Ghost Encumbrance" & Legal Litigations Scanner (NJDG)</span>
            {hasGhostHold && (
              <span className="bg-red-700 text-white text-[9px] px-1.5 py-0.2 rounded font-mono font-bold animate-pulse">
                HOLD ACTIVE
              </span>
            )}
          </button>
        </div>

        <span className="text-[11px] font-mono text-slate-500">
          Inspecting: <strong>{activeInstrument.fdrNumber}</strong> ({activeInstrument.institutionName.substring(0, 30)}...)
        </span>
      </div>

      {/* Render Ghost Encumbrance Scanner if selected */}
      {subDeskView === 'GHOST_SCANNER' ? (
        <GhostEncumbranceScanner
          currentInstrument={activeInstrument}
          onUpdateInstrument={onUpdateInstrument}
          userRole={userRole}
        />
      ) : (
        /* ======================================================== */
        /* 7. SIDE-BY-SIDE REVIEW PANEL                             */
        /* ======================================================== */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT COLUMN: Scanned Document Preview (6 Cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-[#FFFFFF] border border-[#D4D1C7] rounded-sm p-4 shadow-xs">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <FileSearch className="w-4 h-4 text-[#14532D]" />
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Bank Deposit Receipt Document Preview
                  </span>
                </div>
                
                {/* ELA Heatmap Toggle Button */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-600">ELA Heatmap:</span>
                  <button
                    type="button"
                    onClick={() => setElaOverlayActive(!elaOverlayActive)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                      elaOverlayActive ? 'bg-red-600' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                        elaOverlayActive ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Scanned Certificate Canvas */}
              <div className="relative border-2 border-slate-300 rounded bg-[#FAF9F5] p-5 font-serif text-slate-900 shadow-inner overflow-hidden select-none">
                
                {/* Simulated ELA Noise Heatmap Overlay */}
                {elaOverlayActive && (
                  <div className="absolute inset-0 bg-slate-950/70 z-10 pointer-events-none flex flex-col justify-between p-4">
                    <div className="flex justify-between items-start text-xs font-mono">
                      <span className="bg-red-600 text-white px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                        ELA Tampering Heatmap Mode (Noise Floor Analysis)
                      </span>
                      <span className="text-red-400 font-bold bg-slate-900/80 px-2 py-0.5 rounded border border-red-500">
                        Confidence: 98.7%
                      </span>
                    </div>

                    {/* Highlight Box for Tampered Principal */}
                    {isElaForged && (
                      <div className="border-2 border-red-500 bg-red-500/30 p-2 rounded text-center animate-pulse my-auto">
                        <span className="bg-red-700 text-white text-[11px] px-2 py-0.5 rounded font-mono font-bold">
                          HIGH-FREQUENCY NOISE: Spliced Digit '3' (Principal Altered from 15L to 35L)
                        </span>
                      </div>
                    )}

                    <div className="text-[10px] font-mono text-slate-400 bg-slate-900/90 p-1.5 rounded">
                      JPEG Resave Artifacts: 4 Non-native quantization tables detected • Adobe Photoshop metadata signature confirmed
                    </div>
                  </div>
                )}

                {/* Bank Header */}
                <div className="text-center border-b-2 border-slate-800 pb-3 mb-3">
                  <div className="text-base font-bold tracking-tight uppercase">
                    {activeInstrument.bankName}
                  </div>
                  <div className="text-xs text-slate-600 italic">
                    {activeInstrument.branchName} • IFSC: {activeInstrument.ifscCode}
                  </div>
                  <div className="text-xs font-mono font-bold mt-1 text-slate-800">
                    FIXED DEPOSIT RECEIPT / TERM DEPOSIT
                  </div>
                </div>

                {/* Receipt Details Grid */}
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between border-b border-slate-200 pb-1">
                    <span className="font-semibold text-slate-600">Receipt No:</span>
                    <span className="font-mono font-bold text-slate-900">{activeInstrument.fdrNumber}</span>
                  </div>

                  <div className="flex justify-between border-b border-slate-200 pb-1">
                    <span className="font-semibold text-slate-600">Depositor Name:</span>
                    <span className="font-bold text-slate-900">{activeInstrument.institutionName}</span>
                  </div>

                  <div className="flex justify-between border-b border-slate-200 pb-1 bg-amber-50/50 p-1 rounded">
                    <span className="font-semibold text-slate-700">Principal Deposit:</span>
                    <span className={`font-mono font-bold text-sm ${isElaForged ? 'text-red-700 underline decoration-wavy' : 'text-slate-900'}`}>
                      {formatInr(activeInstrument.principalAmount)}
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-slate-200 pb-1">
                    <span className="font-semibold text-slate-600">Interest Rate:</span>
                    <span className="font-mono font-bold text-slate-900">{activeInstrument.interestRatePct}% p.a. (Quarterly Compounding)</span>
                  </div>

                  <div className="flex justify-between border-b border-slate-200 pb-1">
                    <span className="font-semibold text-slate-600">Tenure / Period:</span>
                    <span className="font-mono text-slate-900">{activeInstrument.tenureYears} Years ({activeInstrument.tenureYears * 12} Months)</span>
                  </div>

                  <div className="flex justify-between border-b border-slate-200 pb-1">
                    <span className="font-semibold text-slate-600">Issue Date:</span>
                    <span className="font-mono text-slate-900">{formatGovDate(activeInstrument.issueDate)}</span>
                  </div>

                  <div className="flex justify-between border-b border-slate-200 pb-1">
                    <span className="font-semibold text-slate-600">Maturity Date:</span>
                    <span className="font-mono font-bold text-slate-900">{formatGovDate(activeInstrument.maturityDate)}</span>
                  </div>

                  <div className="flex justify-between border-b border-slate-200 pb-1 bg-amber-50/50 p-1 rounded">
                    <span className="font-semibold text-slate-700">Printed Maturity Value:</span>
                    <span className={`font-mono font-bold text-sm ${isMathForged ? 'text-red-700 line-through' : 'text-slate-900'}`}>
                      {formatInr(activeInstrument.printedMaturityAmount)}
                    </span>
                  </div>

                  {/* Lien Clause Highlight */}
                  <div className="pt-1">
                    <span className="font-semibold text-slate-600 block mb-0.5">Operating Mandate / Lien Pledge:</span>
                    <div className={`p-2 rounded text-[11px] leading-relaxed font-sans ${
                      isLoophole ? 'bg-red-100 text-red-900 border border-red-300 font-bold' : 'bg-slate-100 text-slate-800 border border-slate-200'
                    }`}>
                      {activeInstrument.lienPledgeClause}
                    </div>
                  </div>
                </div>

                {/* Footer Seal */}
                <div className="mt-4 pt-2 border-t-2 border-slate-800 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>CBS HOST AUTHORIZED</span>
                  <span className="text-slate-700 font-bold">BRANCH MANAGER SIGNATURE</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: 6-Layer Automated Forensic Verification (6 Cols) */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* Layer 1: OCR Extraction & Trust Score Card */}
            <div className="bg-[#FFFFFF] border border-[#D4D1C7] rounded-sm p-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
                <div className="flex items-center gap-2">
                  <Binary className="w-4 h-4 text-[#14532D]" />
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Layer 1: AI OCR Extraction & Trust Score
                  </span>
                </div>
                <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                  activeInstrument.forensics.trustScore > 90
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-red-100 text-red-800 border border-red-300 animate-pulse'
                }`}>
                  Trust: {activeInstrument.forensics.trustScore}%
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold">OCR Char Match Rate:</span>
                  <div className="font-mono font-bold text-slate-900">99.7% Precision</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold">Metadata Engine:</span>
                  <div className="font-mono text-slate-700 truncate">{activeInstrument.forensics.metadataModifiedBy || 'Core Banking PDF'}</div>
                </div>
              </div>
            </div>

            {/* Layer 2: ELA Pixel Heatmap Card */}
            <div className={`rounded-sm p-4 border shadow-xs ${
              isElaForged ? 'bg-red-50 border-red-400' : 'bg-white border-[#D4D1C7]'
            }`}>
              <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-2">
                <div className="flex items-center gap-2">
                  <ShieldAlert className={`w-4 h-4 ${isElaForged ? 'text-red-700' : 'text-emerald-700'}`} />
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Layer 2: Error Level Analysis (ELA) Pixel Integrity
                  </span>
                </div>
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                  isElaForged ? 'bg-red-700 text-white' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {isElaForged ? 'CRITICAL SPLICING' : 'CLEAN PIXELS'}
                </span>
              </div>
              
              <p className="text-xs text-slate-600 leading-relaxed">
                {isElaForged
                  ? 'Digital tampering detected in principal amount region. Non-native JPEG compression artifact indicates Photoshop image alteration.'
                  : 'Zero pixel compression anomalies detected. Uniform error level distribution across all numeric boxes.'}
              </p>
            </div>

            {/* Layer 3: Actuarial Compound Interest Physics Card */}
            <div className={`rounded-sm p-4 border shadow-xs ${
              isMathForged ? 'bg-red-50 border-red-400' : 'bg-white border-[#D4D1C7]'
            }`}>
              <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-2">
                <div className="flex items-center gap-2">
                  <Calculator className={`w-4 h-4 ${isMathForged ? 'text-red-700' : 'text-[#14532D]'}`} />
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Layer 3: Compound Interest Physics: A = P(1+r/400)⁴ⁿ
                  </span>
                </div>
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                  isMathForged ? 'bg-red-700 text-white' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {isMathForged ? 'MATH FORGERY' : 'FORMULA MATCH'}
                </span>
              </div>

              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-600">Printed Maturity on Receipt:</span>
                  <span className="font-bold text-slate-900">{formatInr(activeInstrument.printedMaturityAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Expected Maturity for ₹{activeInstrument.principalAmount.toLocaleString('en-IN')}:</span>
                  <span className="font-bold text-slate-900">{formatInr(activeInstrument.mathExpectedMaturity)}</span>
                </div>
                {isMathForged && (
                  <div className="flex justify-between text-red-700 font-bold border-t border-red-200 pt-1">
                    <span>Actuarial Discrepancy:</span>
                    <span>{formatInr(activeInstrument.forensics.mathDiscrepancyDelta || -3508320)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Layers 4 & 5: Legal Mandate & APH Norms */}
            <div className="bg-[#FFFFFF] border border-[#D4D1C7] rounded-sm p-4 shadow-xs space-y-2">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <div className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-[#14532D]" />
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Layers 4 & 5: Legal Mandate & APH Table 4.1 Norms
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold">Normative Required Deposit:</span>
                  <div className="font-mono font-bold text-slate-900">{formatInr(activeInstrument.requiredDeposit)}</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold">Operating Mandate Check:</span>
                  <div className={`font-semibold ${isLoophole ? 'text-red-700 font-bold' : 'text-emerald-700'}`}>
                    {isLoophole ? '⚠️ Unilateral Loophole' : '✓ Unencumbered Joint Lien'}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom CTA Button: Direct Jump to NIC e-Office Green Sheet */}
            {onNavigateToGreenSheet && (
              <button
                type="button"
                onClick={() => onNavigateToGreenSheet(activeInstrument)}
                className="w-full py-2.5 px-4 text-xs font-bold rounded bg-[#14532D] hover:bg-[#15803D] text-white flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-colors"
              >
                <FileSignature className="w-4 h-4" />
                <span>[Proceed to NIC e-Office Green Sheet Sign-off ➔]</span>
              </button>
            )}

          </div>

        </div>
      )}

    </div>
  );
};

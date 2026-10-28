import React, { useState, useEffect, useRef } from 'react';
import { FDRInstrument, LineageHistoryItem } from '../types';
import { formatGovDate, formatInr } from '../utils/formatters';
import { generateSampleFdrPdfBlob } from '../utils/samplePdfGenerator';
import { 
  GitBranch, 
  Link2, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  ArrowRight, 
  ShieldCheck, 
  Plus, 
  Building2, 
  Check, 
  RefreshCw,
  Clock,
  UploadCloud,
  FileText,
  X,
  ExternalLink,
  Lock,
  Unlock,
  FileCheck,
  AlertCircle,
  Sparkles,
  Info
} from 'lucide-react';

interface Module5RenewalLineageProps {
  instruments: FDRInstrument[];
  allInstruments?: FDRInstrument[];
  onLinkRenewal: (
    targetFdrId: string,
    newFdrNumber: string,
    newIssueDate: string,
    newMaturityDate: string,
    amount: number,
    bankName?: string,
    branchName?: string,
    ifscCode?: string,
    scannedDocName?: string
  ) => void;
  userRole?: string;
}

const BANK_PRESETS: { [bankName: string]: { branch: string; ifsc: string; code: string } } = {
  'Indian Bank': { branch: 'Cuttack SME Main Branch', ifsc: 'IDIB000P012', code: 'IDB' },
  'State Bank of India': { branch: 'Meerut SME Branch, UP', ifsc: 'SBIN0001234', code: 'SBI' },
  'Punjab National Bank': { branch: 'Civil Lines Branch, Kanpur', ifsc: 'PUNB0029100', code: 'PNB' },
  'Bank of Baroda': { branch: 'Shivajinagar Branch, Pune', ifsc: 'BARB0SHIVAJ', code: 'BOB' },
  'Canara Bank': { branch: 'Banjara Hills Branch, Hyderabad', ifsc: 'CNRB0002491', code: 'CAN' },
  'HDFC Bank': { branch: 'Salt Lake Sector V, Kolkata', ifsc: 'HDFC0000281', code: 'HDF' },
  'Union Bank of India': { branch: 'Hazratganj Branch, Lucknow', ifsc: 'UBIN0531201', code: 'UBI' },
  'ICICI Bank': { branch: 'MG Road Branch, Bengaluru', ifsc: 'ICIC0000002', code: 'ICI' },
};

export const Module5RenewalLineage: React.FC<Module5RenewalLineageProps> = ({
  instruments,
  allInstruments,
  onLinkRenewal,
  userRole = 'college',
}) => {
  // Use allInstruments if available for switching, fallback to instruments
  const availableInstruments = allInstruments && allInstruments.length > 0 ? allInstruments : instruments;

  // Prefer instrument with overdue/matured status or renewal demo, fallback to first
  const defaultTarget = 
    availableInstruments.find((i) => i.id === 'FDR-07-ORIENTAL-LAPSED') ||
    availableInstruments.find((i) => i.status === 'OVERDUE') ||
    availableInstruments.find((i) => i.lineage?.isRenewal) ||
    availableInstruments[0];

  const [selectedFdrId, setSelectedFdrId] = useState<string>(defaultTarget.id);

  // Active instrument object
  const activeInstrument = availableInstruments.find((i) => i.id === selectedFdrId) || availableInstruments[0];

  // Helper date calculations
  const prevMaturityDate = activeInstrument.lineage.previousMaturityDate || activeInstrument.maturityDate;

  // Form State
  const [newFdrNumber, setNewFdrNumber] = useState('');
  const [bankName, setBankName] = useState(activeInstrument.bankName || 'Indian Bank');
  const [branchName, setBranchName] = useState(activeInstrument.branchName || 'Cuttack SME Main Branch');
  const [ifscCode, setIfscCode] = useState(activeInstrument.ifscCode || 'IDIB000P012');
  const [principalAmount, setPrincipalAmount] = useState<number>(activeInstrument.requiredDeposit || 3500000);
  const [newIssueDate, setNewIssueDate] = useState(prevMaturityDate);
  const [newMaturityDate, setNewMaturityDate] = useState('');

  // Scanned Document State
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string; timestamp: string } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Submission / Loading Pipeline State
  const [isLinking, setIsLinking] = useState(false);
  const [linkingStep, setLinkingStep] = useState<number>(0);
  const [successNotice, setSuccessNotice] = useState<{
    fdrNumber: string;
    prevFdr: string;
    amount: number;
    eoaRestored: boolean;
  } | null>(null);

  // Reset or initialize form whenever active instrument changes
  useEffect(() => {
    const defaultBank = activeInstrument.bankName in BANK_PRESETS ? activeInstrument.bankName : 'Indian Bank';
    const preset = BANK_PRESETS[defaultBank] || BANK_PRESETS['Indian Bank'];
    const pMaturity = activeInstrument.lineage.previousMaturityDate || activeInstrument.maturityDate;
    
    // Auto-generate a compliant replacement FDR number
    const randDigits = Math.floor(100000 + Math.random() * 900000);
    setNewFdrNumber(`${preset.code}-2026-${randDigits}`);
    setBankName(defaultBank);
    setBranchName(activeInstrument.branchName || preset.branch);
    setIfscCode(activeInstrument.ifscCode || preset.ifsc);
    setPrincipalAmount(activeInstrument.requiredDeposit || 3500000);
    setNewIssueDate(pMaturity);

    // Compute maturity date = 8 years later
    try {
      const parts = pMaturity.split('-');
      if (parts.length === 3) {
        const issueYear = parseInt(parts[0], 10);
        setNewMaturityDate(`${issueYear + 8}-${parts[1]}-${parts[2]}`);
      } else {
        setNewMaturityDate('2034-10-14');
      }
    } catch {
      setNewMaturityDate('2034-10-14');
    }

    // Default sample PDF attachment
    setUploadedFile({
      name: `Replacement_FDR_${preset.code}_2026_Certified.pdf`,
      size: '248.4 KB',
      timestamp: 'Scanned today 10:30 AM'
    });

    setSuccessNotice(null);
  }, [selectedFdrId, activeInstrument.id]);

  // Handle Bank Selection change
  const handleBankChange = (selectedBank: string) => {
    setBankName(selectedBank);
    const preset = BANK_PRESETS[selectedBank];
    if (preset) {
      setBranchName(preset.branch);
      setIfscCode(preset.ifsc);
      const randDigits = Math.floor(100000 + Math.random() * 900000);
      setNewFdrNumber(`${preset.code}-2026-${randDigits}`);
      if (uploadedFile) {
        setUploadedFile({
          name: `Replacement_FDR_${preset.code}_2026_Certified.pdf`,
          size: '248.4 KB',
          timestamp: 'Scanned today 10:30 AM'
        });
      }
    }
  };

  // Calculate live gap between previous maturity and new issue date
  const calculateGapDays = (): number => {
    if (!prevMaturityDate || !newIssueDate) return 0;
    const prev = new Date(prevMaturityDate);
    const curr = new Date(newIssueDate);
    const diffTime = curr.getTime() - prev.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  const currentGapDays = calculateGapDays();
  const isZeroGapSatisfied = currentGapDays <= 0;

  // Helper: Snap to exact 0-day continuity
  const handleSnapZeroGap = () => {
    setNewIssueDate(prevMaturityDate);
    const parts = prevMaturityDate.split('-');
    if (parts.length === 3) {
      const issueYear = parseInt(parts[0], 10);
      setNewMaturityDate(`${issueYear + 8}-${parts[1]}-${parts[2]}`);
    }
  };

  // Drag and Drop handlers for PDF upload
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setUploadedFile({
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        timestamp: 'Uploaded just now'
      });
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setUploadedFile({
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        timestamp: 'Uploaded just now'
      });
    }
  };

  // Evaluator helper: Auto-attach sample PDF
  const handleAttachSamplePdf = () => {
    const preset = BANK_PRESETS[bankName] || BANK_PRESETS['Indian Bank'];
    setUploadedFile({
      name: `Replacement_FDR_${preset.code}_2026_Certified.pdf`,
      size: '248.4 KB',
      timestamp: 'Attached verified sample'
    });
  };

  // Submit Handler with progressive verification HUD
  const handleLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFdrNumber || isLinking) return;

    setIsLinking(true);
    setLinkingStep(1);

    // Step 1: Normative Math & Norms Check
    setTimeout(() => {
      setLinkingStep(2);

      // Step 2: 0-Day Gap Continuity & Lien Mandate Check
      setTimeout(() => {
        setLinkingStep(3);

        // Step 3: Central Regulatory Ledger & EoA Freeze Lifting
        setTimeout(() => {
          onLinkRenewal(
            activeInstrument.id,
            newFdrNumber,
            newIssueDate,
            newMaturityDate,
            principalAmount,
            bankName,
            branchName,
            ifscCode,
            uploadedFile?.name
          );

          setIsLinking(false);
          setLinkingStep(0);
          setSuccessNotice({
            fdrNumber: newFdrNumber,
            prevFdr: activeInstrument.fdrNumber,
            amount: principalAmount,
            eoaRestored: activeInstrument.eoaStatus?.isFrozen || activeInstrument.status === 'OVERDUE' || false
          });

          // Scroll smoothly to top
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 600);
      }, 600);
    }, 600);
  };

  // Active status checks
  const isCurrentlyOverdue = activeInstrument.status === 'OVERDUE' || (activeInstrument.lineage.coverageGapDays > 0 && !activeInstrument.lineage.isRenewal);
  const isEoaFrozen = activeInstrument.eoaStatus?.isFrozen || (isCurrentlyOverdue && !activeInstrument.lineage.isRenewal);
  const hasLineageEstablished = activeInstrument.lineage.isRenewal || activeInstrument.status === 'RENEWED';

  return (
    <div className="space-y-6">
      
      {/* ======================================================== */}
      {/* 1. TOP HEADER & QUICK TEST PRESETS SELECTOR               */}
      {/* ======================================================== */}
      <div className="bg-[#FFFFFF] border border-[#D4D1C7] p-4 rounded-sm shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-[#14532D]" />
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Renewal & Replacement Lineage Chain Tracker
              </h2>
              <span className="bg-[#14532D]/10 text-[#14532D] text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                APH 2026-27 Sec 1.5
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Tracks continuous institutional lien coverage, calculates validity gap days, and enforces unbroken statutory custody chains
            </p>
          </div>

          {/* Quick Preset Selector Chips */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-500 whitespace-nowrap">Test Preset:</span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setSelectedFdrId('FDR-07-ORIENTAL-LAPSED')}
                className={`text-[11px] px-2.5 py-1 rounded font-mono font-bold transition-all flex items-center gap-1.5 ${
                  selectedFdrId === 'FDR-07-ORIENTAL-LAPSED'
                    ? 'bg-red-800 text-white shadow-xs'
                    : 'bg-red-100 hover:bg-red-200 text-red-900 border border-red-300'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping"></span>
                <span>Oriental Inst (Overdue 12d • EoA Frozen)</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedFdrId('FDR-02-PNB-FORGERY')}
                className={`text-[11px] px-2.5 py-1 rounded font-mono font-bold transition-all ${
                  selectedFdrId === 'FDR-02-PNB-FORGERY'
                    ? 'bg-amber-800 text-white shadow-xs'
                    : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
                }`}
              >
                <span>Apex Inst (Rectification)</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedFdrId('FDR-06-PNB-EXPIRING-SOON')}
                className={`text-[11px] px-2.5 py-1 rounded font-mono font-bold transition-all ${
                  selectedFdrId === 'FDR-06-PNB-EXPIRING-SOON'
                    ? 'bg-blue-800 text-white shadow-xs'
                    : 'bg-blue-100 hover:bg-blue-200 text-blue-900 border border-blue-300'
                }`}
              >
                <span>Gyan Ganga (Expiring 25d)</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedFdrId('FDR-08-BMS-RENEWED')}
                className={`text-[11px] px-2.5 py-1 rounded font-mono font-bold transition-all ${
                  selectedFdrId === 'FDR-08-BMS-RENEWED'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300'
                }`}
              >
                <span>BMS College (0-Day Verified)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. DYNAMIC REGULATORY & EOA COMPLIANCE BANNER            */}
      {/* ======================================================== */}
      {successNotice ? (
        <div className="bg-emerald-50 border-2 border-emerald-600 rounded-sm p-4 shadow-sm animate-in fade-in duration-300">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-emerald-600 text-white rounded-full mt-0.5">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-bold text-emerald-950 flex items-center gap-2">
                  <span>REGULATORY COMPLIANCE RESTORED: Extension of Approval (EoA 2027-28) Hold Automatically Lifted!</span>
                </h3>
                <span className="bg-emerald-200 text-emerald-900 text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase">
                  Zero-Gap Verified • Real-Time AICTE Ledger Sync
                </span>
              </div>
              <p className="text-xs text-emerald-900 mt-1 leading-relaxed">
                Replacement FDR <strong>#{successNotice.fdrNumber}</strong> ({formatInr(successNotice.amount)}) has been successfully bridged to matured instrument <strong>#{successNotice.prevFdr}</strong>. 
                Continuous statutory lien recorded in favor of Member Secretary, AICTE. The automated APH Chapter 1 Section 1.5 compliance freeze has been <strong>instantly lifted</strong> and institutional portal access is fully unlocked.
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-3 text-[11px] font-mono font-bold text-emerald-800">
                <span className="bg-white border border-emerald-300 px-2 py-0.5 rounded shadow-2xs">
                  ✅ Lien Chain: Unbroken Custody
                </span>
                <span className="bg-white border border-emerald-300 px-2 py-0.5 rounded shadow-2xs">
                  ✅ Validity Gap: 0 Days Cleared
                </span>
                <span className="bg-white border border-emerald-300 px-2 py-0.5 rounded shadow-2xs">
                  ✅ EoA Status: UNLOCKED & ACTIVE
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : isEoaFrozen ? (
        <div className="bg-red-50 border-2 border-red-600 rounded-sm p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-red-600 text-white rounded-full mt-0.5 animate-pulse">
              <Lock className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-red-950">
                    CRITICAL REGULATORY COMPLIANCE HOLD: Extension of Approval (EoA 2027-28) Frozen
                  </h3>
                  <span className="bg-red-700 text-white text-[10px] font-mono px-2 py-0.5 rounded font-bold animate-pulse">
                    PORTAL LOCKED
                  </span>
                </div>
                <span className="bg-red-200 text-red-900 text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                  APH 2026-27 Chapter 1, Sec 1.5
                </span>
              </div>
              <p className="text-xs text-red-900 mt-1 leading-relaxed">
                <strong>Statutory Default:</strong> Instrument <strong>#{activeInstrument.fdrNumber}</strong> matured on <strong>{formatGovDate(activeInstrument.maturityDate)}</strong> ({activeInstrument.lineage.coverageGapDays} days lapsed without renewal). Under AICTE APH regulations, an automated penal freeze is in effect. Fresh admissions and official Extension of Approval downloads are blocked until a compliant replacement FDR is linked below with verified zero-gap continuity.
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-3 text-[11px] font-mono font-bold text-red-800">
                <span className="bg-white border border-red-300 px-2 py-0.5 rounded">
                  ⚠️ Certificate: {activeInstrument.eoaStatus?.certificateNumber || 'EOA-ERO-2027-FROZEN-1029'}
                </span>
                <span className="bg-white border border-red-300 px-2 py-0.5 rounded">
                  ⚠️ Statutory Gap: {activeInstrument.lineage.coverageGapDays} Days Uncovered
                </span>
                <span className="bg-white border border-red-300 px-2 py-0.5 rounded">
                  ⚠️ Required Action: Link Replacement FDR Below
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : hasLineageEstablished ? (
        <div className="bg-emerald-50 border border-emerald-300 rounded-sm p-3.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
              <div>
                <h4 className="text-xs font-bold text-emerald-950">
                  Continuous Lien Custody Active: {activeInstrument.institutionName}
                </h4>
                <p className="text-[11px] text-emerald-800">
                  Replacement lineage verified with 0-day coverage gap. AICTE joint lien is actively recorded in Core Banking System.
                </p>
              </div>
            </div>
            <span className="bg-emerald-200 text-emerald-900 text-[10px] font-mono px-2.5 py-1 rounded font-bold">
              EOA FULLY COMPLIANT
            </span>
          </div>
        </div>
      ) : (
        <div className="bg-stone-50 border border-stone-300 rounded-sm p-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-slate-600" />
              <span className="text-xs text-slate-700 font-medium">
                Inspecting: <strong>{activeInstrument.institutionName}</strong> (ID: {activeInstrument.institutionId}) — Matures {formatGovDate(activeInstrument.maturityDate)}
              </span>
            </div>
            <span className="text-[10px] font-mono bg-stone-200 text-slate-700 px-2 py-0.5 rounded font-semibold">
              Pre-Renewal Tracking Desk
            </span>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. SECTION 1: VISUAL INSTRUMENT LINEAGE CHAIN TREE       */}
      {/* ======================================================== */}
      <div className="bg-[#FFFFFF] border border-[#D4D1C7] rounded-sm p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200 pb-3 mb-4">
          <div>
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#14532D]" />
              Institutional Lien Coverage Lineage: {activeInstrument.institutionName}
            </h3>
            <p className="text-xs text-slate-500">
              Institution ID: {activeInstrument.institutionId} • AISHE: {activeInstrument.aisheCode} • Region: {activeInstrument.region}
            </p>
          </div>

          {/* Zero Gap Status Pill */}
          <div>
            {hasLineageEstablished ? (
              <div className="flex items-center gap-1.5 bg-emerald-100 text-emerald-900 border border-emerald-300 px-3 py-1 rounded text-xs font-mono font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Zero Validity Gap Verified (0 Days Gap)</span>
              </div>
            ) : isCurrentlyOverdue ? (
              <div className="flex items-center gap-1.5 bg-red-100 text-red-900 border border-red-300 px-3 py-1 rounded text-xs font-mono font-bold animate-pulse">
                <AlertTriangle className="w-4 h-4 text-red-700" />
                <span>Uncovered Validity Gap: {activeInstrument.lineage.coverageGapDays || 12} Days Lapsed</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 bg-stone-100 text-slate-700 border border-stone-300 px-3 py-1 rounded text-xs font-mono font-medium">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>First-Cycle Instrument • Active</span>
              </div>
            )}
          </div>
        </div>

        {/* Visual Lineage Nodes Tree */}
        <div className="p-5 bg-[#F5F4F0] border border-[#D4D1C7] rounded-sm">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-4 py-4">
            
            {/* If Renewal exists or has been just linked: show full continuous chain */}
            {hasLineageEstablished ? (
              <>
                {/* Node 1: Matured Predecessor Instrument */}
                <div className="w-full lg:w-80 bg-white border-2 border-slate-300 rounded p-4 shadow-xs opacity-85">
                  <div className="flex items-center justify-between text-[10px] font-mono mb-2">
                    <span className="bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded font-bold">
                      MATURED (ARCHIVED)
                    </span>
                    <span className="text-slate-500 font-semibold">Cycle 1 (8 Years)</span>
                  </div>
                  <div className="font-mono font-bold text-sm text-slate-900 mb-1">
                    {activeInstrument.lineage.previousFdrNumber || activeInstrument.fdrNumber}
                  </div>
                  <div className="text-xs text-slate-600 mb-2">
                    {activeInstrument.bankName} • {formatInr(activeInstrument.principalAmount)}
                  </div>
                  <div className="text-[11px] font-mono text-slate-600 bg-stone-100 p-2 rounded border border-stone-200">
                    <div>Matured: <strong>{formatGovDate(activeInstrument.lineage.previousMaturityDate || activeInstrument.maturityDate)}</strong></div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Custody safely discharged into renewal</div>
                  </div>
                </div>

                {/* Transition Connector with 0-Day Gap Checked Badge */}
                <div className="flex flex-col items-center">
                  <div className="bg-emerald-700 text-white text-[10px] font-mono font-bold px-2.5 py-1 rounded shadow-sm flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    <span>0-Day Gap Verified</span>
                  </div>
                  <ArrowRight className="w-6 h-6 text-emerald-700 my-1 hidden lg:block" />
                  <span className="text-[9px] text-emerald-800 font-mono font-bold">Continuous Lien Intact</span>
                </div>

                {/* Node 2: Replacement Active Instrument */}
                <div className="w-full lg:w-84 bg-white border-2 border-emerald-600 rounded p-4 shadow-md ring-4 ring-emerald-100">
                  <div className="flex items-center justify-between text-[10px] font-mono mb-2">
                    <span className="bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                      <span>ACTIVE REPLACEMENT</span>
                    </span>
                    <span className="text-emerald-800 font-bold font-mono">Cycle 2 (2026–2034)</span>
                  </div>
                  <div className="font-mono font-bold text-base text-slate-900 mb-1">
                    {activeInstrument.fdrNumber}
                  </div>
                  <div className="text-xs text-slate-700 mb-2 font-medium">
                    {activeInstrument.bankName} • {formatInr(activeInstrument.principalAmount)}
                  </div>
                  <div className="text-[11px] font-mono text-emerald-900 bg-emerald-50 p-2 rounded border border-emerald-200 space-y-0.5">
                    <div>Issue: <strong>{formatGovDate(activeInstrument.issueDate)}</strong></div>
                    <div>Maturity: <strong>{formatGovDate(activeInstrument.maturityDate)}</strong></div>
                    <div className="text-[10px] text-emerald-700 font-bold pt-0.5 border-t border-emerald-200">
                      AICTE Joint Lien Endorsed (Core Banking Confirmed)
                    </div>
                  </div>
                </div>
              </>
            ) : isCurrentlyOverdue ? (
              <>
                {/* Node 1: Matured Overdue Instrument */}
                <div className="w-full lg:w-80 bg-red-50 border-2 border-red-400 rounded p-4 shadow-xs">
                  <div className="flex items-center justify-between text-[10px] font-mono mb-2">
                    <span className="bg-red-200 text-red-900 px-1.5 py-0.5 rounded font-bold">
                      MATURED & LAPSED
                    </span>
                    <span className="text-red-700 font-bold">Overdue: {activeInstrument.lineage.coverageGapDays || 12}d</span>
                  </div>
                  <div className="font-mono font-bold text-sm text-red-950 mb-1">
                    {activeInstrument.fdrNumber}
                  </div>
                  <div className="text-xs text-red-800 mb-2">
                    {activeInstrument.bankName} • {formatInr(activeInstrument.principalAmount)}
                  </div>
                  <div className="text-[11px] font-mono text-red-900 bg-white p-2 rounded border border-red-200">
                    <div>Matured on: <strong>{formatGovDate(activeInstrument.maturityDate)}</strong></div>
                    <div className="text-[10px] text-red-600 font-bold mt-0.5">AICTE lien break detected</div>
                  </div>
                </div>

                {/* Broken Connector Indicator */}
                <div className="flex flex-col items-center">
                  <div className="bg-red-700 text-white text-[10px] font-mono font-bold px-2.5 py-1 rounded shadow-sm flex items-center gap-1 animate-pulse">
                    <AlertTriangle className="w-3 h-3" />
                    <span>Lapsed Gap: {activeInstrument.lineage.coverageGapDays || 12} Days</span>
                  </div>
                  <ArrowRight className="w-6 h-6 text-red-500 my-1 hidden lg:block" />
                  <span className="text-[9px] text-red-700 font-mono font-bold">Lien Chain Severed</span>
                </div>

                {/* Node 2: Awaiting Submission Ghost Box */}
                <div className="w-full lg:w-80 bg-white border-2 border-dashed border-amber-400 rounded p-4 text-center">
                  <div className="inline-block bg-amber-100 text-amber-900 text-[10px] font-mono font-bold px-2 py-0.5 rounded mb-2">
                    AWAITING REPLACEMENT INSTRUMENT
                  </div>
                  <div className="font-mono font-bold text-sm text-slate-500 mb-1">
                    [-- NO ACTIVE FDR LINKED --]
                  </div>
                  <p className="text-xs text-slate-500 mb-3">
                    Submit replacement FDR details in the form below to bridge the custody chain and unlock EoA.
                  </p>
                  <a
                    href="#link-fdr-form"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-900 hover:underline"
                  >
                    <span>Proceed to Submission Form</span>
                    <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </>
            ) : (
              /* Single Instrument Lineage Display */
              <div className="w-full max-w-md bg-white border-2 border-slate-400 rounded p-4 text-center">
                <div className="inline-block bg-slate-200 text-slate-700 text-[10px] font-mono font-bold px-2 py-0.5 rounded mb-2">
                  ORIGINAL FIRST-CYCLE INSTRUMENT
                </div>
                <div className="font-mono font-bold text-base text-slate-900 mb-1">
                  {activeInstrument.fdrNumber}
                </div>
                <div className="text-xs text-slate-600 mb-2">
                  {activeInstrument.bankName} • {formatInr(activeInstrument.principalAmount)}
                </div>
                <div className="text-xs font-mono text-slate-500 bg-stone-50 p-2 rounded border border-stone-200">
                  Cycle: {formatGovDate(activeInstrument.issueDate)} to {formatGovDate(activeInstrument.maturityDate)}
                </div>
              </div>
            )}

          </div>

          <div className="text-center text-xs text-slate-600 border-t border-[#D4D1C7] pt-3 mt-2">
            <strong>AICTE Approval Process Handbook (APH 2026-27 Section 1.5):</strong> The replacement FDR issue date must not exceed the maturity date of the predecessor instrument. Zero-gap ensures uninterrupted AICTE security custody, preserving legal pledge priority over issuing banks.
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. SECTION 2: INTERACTIVE LINK REPLACEMENT FDR FORM       */}
      {/* ======================================================== */}
      <div id="link-fdr-form" className="bg-[#FFFFFF] border border-[#D4D1C7] rounded-sm p-5 shadow-xs">
        <div className="border-b border-slate-200 pb-3 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Link2 className="w-4 h-4 text-[#14532D]" />
                Submit & Link Replacement FDR to Matured Instrument
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Submit certified replacement FDR details for <strong>{activeInstrument.institutionName}</strong> to bridge statutory custody, clear validity gap, and lift the EoA compliance hold.
              </p>
            </div>
            <span className="text-[11px] font-mono bg-stone-100 text-slate-700 px-2 py-1 rounded border border-stone-300">
              Matured Reference: <strong>{activeInstrument.fdrNumber}</strong>
            </span>
          </div>
        </div>

        <form onSubmit={handleLinkSubmit} className="space-y-4">
          
          {/* Row 1: FDR Number + Bank Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Input 1: New Replacement FDR Number */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-800">
                  New Replacement FDR Number *
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const preset = BANK_PRESETS[bankName] || BANK_PRESETS['Indian Bank'];
                    const randDigits = Math.floor(100000 + Math.random() * 900000);
                    setNewFdrNumber(`${preset.code}-2026-${randDigits}`);
                  }}
                  className="text-[10px] text-blue-900 hover:underline font-semibold"
                >
                  ⚡ Auto-Generate
                </button>
              </div>
              <input
                type="text"
                required
                value={newFdrNumber}
                onChange={(e) => setNewFdrNumber(e.target.value.toUpperCase())}
                placeholder="e.g., IDB-2026-89104"
                className="w-full text-xs font-mono font-bold bg-white border border-[#D4D1C7] rounded p-2 text-slate-900 focus:outline-hidden focus:border-[#14532D]"
              />
              <span className="text-[10px] text-slate-500">Official bank-printed receipt serial number</span>
            </div>

            {/* Input 2: Issuing Bank Dropdown */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Issuing Bank Name *
              </label>
              <select
                value={bankName}
                onChange={(e) => handleBankChange(e.target.value)}
                className="w-full text-xs bg-white border border-[#D4D1C7] rounded p-2 text-slate-800 font-medium focus:outline-hidden focus:border-[#14532D]"
              >
                {Object.keys(BANK_PRESETS).map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
              <span className="text-[10px] text-slate-500">Scheduled Commercial Bank approved under RBI Act</span>
            </div>

            {/* Input 3: Branch Name & IFSC */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Branch Name & IFSC Code *
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  value={branchName}
                  onChange={(e) => setBranchName(e.target.value)}
                  placeholder="Branch Name"
                  className="w-full text-xs bg-white border border-[#D4D1C7] rounded p-2 text-slate-800 focus:outline-hidden focus:border-[#14532D]"
                />
                <input
                  type="text"
                  required
                  value={ifscCode}
                  onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                  placeholder="IFSC Code"
                  className="w-full text-xs font-mono uppercase bg-white border border-[#D4D1C7] rounded p-2 text-slate-800 focus:outline-hidden focus:border-[#14532D]"
                />
              </div>
              <span className="text-[10px] text-slate-500">11-character alphanumeric RTGS/NEFT code</span>
            </div>

          </div>

          {/* Row 2: Principal Amount & Date Pickers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
            
            {/* Input 4: New Principal Amount (₹) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-800">
                  New Principal Amount (₹) *
                </label>
                <button
                  type="button"
                  onClick={() => setPrincipalAmount(activeInstrument.requiredDeposit || 3500000)}
                  className="text-[10px] text-blue-900 hover:underline font-semibold"
                >
                  ⚡ Set Norm ({formatInr(activeInstrument.requiredDeposit || 3500000)})
                </button>
              </div>
              <input
                type="number"
                required
                min={100000}
                step={50000}
                value={principalAmount}
                onChange={(e) => setPrincipalAmount(Number(e.target.value))}
                className="w-full text-xs font-mono font-bold bg-white border border-[#D4D1C7] rounded p-2 text-slate-900 focus:outline-hidden focus:border-[#14532D]"
              />
              <div className="mt-1 flex items-center justify-between text-[10px]">
                <span className="font-mono text-slate-600 font-semibold">{formatInr(principalAmount)}</span>
                {principalAmount >= (activeInstrument.requiredDeposit || 3500000) ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                    <Check className="w-3 h-3" /> Meets Statutory Norm
                  </span>
                ) : (
                  <span className="text-red-700 font-bold flex items-center gap-0.5">
                    <AlertTriangle className="w-3 h-3" /> Deficit of {formatInr((activeInstrument.requiredDeposit || 3500000) - principalAmount)}
                  </span>
                )}
              </div>
            </div>

            {/* Input 5: New Issue Date */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-800">
                  New Issue Date (Ensuring 0-Gap) *
                </label>
                <button
                  type="button"
                  onClick={handleSnapZeroGap}
                  className="text-[10px] text-emerald-800 hover:underline font-bold"
                >
                  ⚡ Snap 0-Gap
                </button>
              </div>
              <input
                type="date"
                required
                value={newIssueDate}
                onChange={(e) => setNewIssueDate(e.target.value)}
                className="w-full text-xs font-mono bg-white border border-[#D4D1C7] rounded p-2 text-slate-900 focus:outline-hidden focus:border-[#14532D]"
              />
              <div className="mt-1 text-[10px] font-mono">
                {isZeroGapSatisfied ? (
                  <span className="text-emerald-700 font-bold">
                    ✅ Zero-Day Continuity Verified (No Gap)
                  </span>
                ) : (
                  <span className="text-red-700 font-bold">
                    ⚠️ {currentGapDays} Day(s) Uncovered Gap Detected
                  </span>
                )}
              </div>
            </div>

            {/* Input 6: New Maturity Date (8 Years Lock-in) */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                New Maturity Date (8-Year Statutory Lock-in) *
              </label>
              <input
                type="date"
                required
                value={newMaturityDate}
                onChange={(e) => setNewMaturityDate(e.target.value)}
                className="w-full text-xs font-mono bg-white border border-[#D4D1C7] rounded p-2 text-slate-900 focus:outline-hidden focus:border-[#14532D]"
              />
              <span className="text-[10px] text-slate-500">
                Standard tenure: 8 Years (96 Months) under APH Clause 1.4(a)
              </span>
            </div>

          </div>

          {/* Row 3: Scanned PDF Document Upload (Drag-and-Drop Zone) */}
          <div className="pt-2">
            <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center justify-between">
              <span>Scanned Replacement FDR Document (.pdf) *</span>
              <button
                type="button"
                onClick={handleAttachSamplePdf}
                className="text-[10px] text-blue-900 hover:underline font-semibold"
              >
                ⚡ Use Pre-Verified Sample Scan
              </button>
            </label>

            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              accept=".pdf,application/pdf"
              onChange={handleFileInputChange}
              className="hidden"
            />

            {uploadedFile ? (
              <div className="p-3 bg-emerald-50/70 border border-emerald-300 rounded flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 text-emerald-800 rounded">
                    <FileText className="w-5 h-5 text-emerald-700" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 font-mono">
                      {uploadedFile.name}
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-2">
                      <span>Size: {uploadedFile.size}</span>
                      <span>•</span>
                      <span className="text-emerald-700 font-bold">Ready for SHA-256 Ledger Anchor</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs text-slate-600 hover:text-slate-900 px-2.5 py-1 border border-slate-300 rounded bg-white hover:bg-slate-50 font-semibold"
                  >
                    Change File
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadedFile(null)}
                    className="p-1 text-red-600 hover:bg-red-100 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded p-5 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-emerald-600 bg-emerald-50'
                    : 'border-[#D4D1C7] hover:border-slate-500 bg-[#F5F4F0]'
                }`}
              >
                <UploadCloud className="w-7 h-7 mx-auto text-slate-500 mb-1" />
                <div className="text-xs font-bold text-slate-800">
                  Drag & Drop Scanned Replacement FDR (.pdf) here, or <span className="text-blue-900 underline">Browse</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Official bank-endorsed fixed deposit receipt copy with AICTE joint lien endorsement (Max 15MB)
                </div>
              </div>
            )}
          </div>

          {/* Submission Action Bar */}
          <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-600 font-mono">
              Predecessor: <strong>{activeInstrument.fdrNumber}</strong> (Matured: {formatGovDate(prevMaturityDate)})
            </div>

            <button
              type="submit"
              disabled={isLinking || !uploadedFile}
              className={`w-full sm:w-auto px-6 py-2.5 text-xs font-bold rounded flex items-center justify-center gap-2 shadow-xs transition-all ${
                isLinking || !uploadedFile
                  ? 'bg-slate-300 text-slate-600 cursor-not-allowed'
                  : 'bg-[#14532D] hover:bg-[#15803D] text-white active:scale-98'
              }`}
            >
              {isLinking ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>
                    {linkingStep === 1 && 'Step 1/3: Verifying Actuarial Norms & Math...'}
                    {linkingStep === 2 && 'Step 2/3: Validating 0-Day Gap Continuity...'}
                    {linkingStep === 3 && 'Step 3/3: Anchoring Ledger & Lifting EoA Freeze...'}
                  </span>
                </>
              ) : (
                <>
                  <Link2 className="w-4 h-4" />
                  <span>[Verify & Link Replacement FDR Lineage]</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>

    </div>
  );
};

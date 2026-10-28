import React, { useState, useMemo } from 'react';
import { FDRInstrument, RegionalOffice } from '../types';
import { formatInr, formatCrores, formatGovDate, getDaysRemaining } from '../utils/formatters';
import { 
  Building2, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Eye, 
  Layers, 
  ArrowUpRight, 
  BarChart3, 
  ShieldCheck, 
  Clock, 
  Landmark,
  FileSignature,
  MapPin,
  TrendingDown,
  Scale,
  ShieldAlert,
  Gavel,
  Lock,
  ChevronRight,
  ExternalLink,
  Award
} from 'lucide-react';

interface NationwideRiskHeatmapProps {
  instruments: FDRInstrument[];
  simulatedDate: string;
  onSelectInstrumentForInspection: (instrument: FDRInstrument) => void;
  onOpenIntakeStudioWithInstrument: (instrument: FDRInstrument) => void;
  onOpenScrutinyMatrix: (instrument: FDRInstrument) => void;
  onOpenReleaseEngine: (instrument: FDRInstrument) => void;
  onOpenEoaMatrix?: () => void;
  onOpenLitigationMonitor?: () => void;
}

interface StateRiskData {
  state: string;
  region: string;
  city: string;
  institutionCount: number;
  totalCorpus: number;
  riskLevel: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'MONITORING' | 'CLEAN';
  riskScore: number; // 0 to 100
  primaryRiskReason: string;
  discrepancies: number;
  legalHolds: number;
  overdueCount: number;
}

export const NationwideRiskHeatmap: React.FC<NationwideRiskHeatmapProps> = ({
  instruments,
  simulatedDate,
  onSelectInstrumentForInspection,
  onOpenIntakeStudioWithInstrument,
  onOpenScrutinyMatrix,
  onOpenReleaseEngine,
}) => {
  const [selectedStateFilter, setSelectedStateFilter] = useState<string>('ALL');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'ALL' | 'CRITICAL' | 'SHORTFALLS' | 'LEGAL_STAYS'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDossierInstrument, setSelectedDossierInstrument] = useState<FDRInstrument | null>(null);

  const scrollToMasterTable = () => {
    document.getElementById('master-repository-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Regional aggregated risk breakdown dynamically updated against simulatedDate
  const stateRiskMatrix: StateRiskData[] = useMemo(() => {
    // 1. Kerala calculation (Royal College of Engineering, Thrissur)
    const keralaInst = instruments.find((i) => i.id === 'FDR-06A-ROYAL-14DAYS');
    const daysLeftKerala = keralaInst 
      ? getDaysRemaining(keralaInst.maturityDate, simulatedDate) 
      : getDaysRemaining('2026-11-09', simulatedDate);
    const isKeralaOverdue = daysLeftKerala < 0 || keralaInst?.status === 'OVERDUE';

    // 2. West Bengal calculation (Techno India Institute, Salt Lake, Kolkata)
    const wbInst = instruments.find((i) => i.id === 'FDR-06B-TECHNO-42DAYS');
    const daysLeftWb = wbInst 
      ? getDaysRemaining(wbInst.maturityDate, simulatedDate) 
      : getDaysRemaining('2026-12-07', simulatedDate);
    const isWbOverdue = daysLeftWb < 0 || wbInst?.status === 'OVERDUE';

    // 3. Madhya Pradesh calculation (Shri Ram College of Technology, Bhopal)
    const mpInst = instruments.find((i) => i.id === 'FDR-06C-SHRIRAM-76DAYS');
    const daysLeftMp = mpInst 
      ? getDaysRemaining(mpInst.maturityDate, simulatedDate) 
      : getDaysRemaining('2027-01-10', simulatedDate);
    const isMpOverdue = daysLeftMp < 0 || mpInst?.status === 'OVERDUE';

    // 4. Bihar calculation (Oriental Institute of Technology, Patna)
    const biharInst = instruments.find((i) => i.id === 'FDR-07-IDB-OVERDUE');
    const daysOverdueBihar = Math.abs(
      biharInst 
        ? getDaysRemaining(biharInst.maturityDate, simulatedDate) 
        : getDaysRemaining('2026-10-14', simulatedDate)
    );

    return [
      {
        state: 'Uttar Pradesh',
        region: 'NRO',
        city: 'Meerut / Kanpur',
        institutionCount: 1,
        totalCorpus: 3500000,
        riskLevel: 'CRITICAL',
        riskScore: 92,
        primaryRiskReason: 'Altered Principal Forgery (₹15L to ₹35L) + Active Allahabad High Court Stay Order',
        discrepancies: 1,
        legalHolds: 1,
        overdueCount: 0,
      },
      {
        state: 'Maharashtra',
        region: 'WRO',
        city: 'Pune / Mumbai',
        institutionCount: 1,
        totalCorpus: 3500000,
        riskLevel: 'HIGH',
        riskScore: 84,
        primaryRiskReason: 'Secret Bank Overdraft Loan (₹22L) marked against FDR without AICTE knowledge',
        discrepancies: 1,
        legalHolds: 0,
        overdueCount: 0,
      },
      {
        state: 'Bihar',
        region: 'ERO',
        city: 'Patna',
        institutionCount: 1,
        totalCorpus: 3500000,
        riskLevel: 'CRITICAL',
        riskScore: 89,
        primaryRiskReason: `Default: Lapsed ${daysOverdueBihar} days past maturity without replacement lineage; EoA frozen`,
        discrepancies: 0,
        legalHolds: 0,
        overdueCount: 1,
      },
      {
        state: 'Telangana',
        region: 'SCRO',
        city: 'Hyderabad',
        institutionCount: 1,
        totalCorpus: 3500000,
        riskLevel: 'MODERATE',
        riskScore: 68,
        primaryRiskReason: 'Illegal "Either-or-Survivor" mandate loophole permitting unilateral trust liquidation',
        discrepancies: 1,
        legalHolds: 0,
        overdueCount: 0,
      },
      {
        state: 'Karnataka',
        region: 'SWRO',
        city: 'Bengaluru',
        institutionCount: 1,
        totalCorpus: 3500000,
        riskLevel: 'MODERATE',
        riskScore: 61,
        primaryRiskReason: 'Statutory Normative Deficit of ₹15L under APH 2026-27 Table 4.1 composite norms',
        discrepancies: 1,
        legalHolds: 0,
        overdueCount: 0,
      },
      {
        state: 'Kerala',
        region: 'SWRO',
        city: 'Thrissur',
        institutionCount: 1,
        totalCorpus: 3500000,
        riskLevel: isKeralaOverdue ? 'CRITICAL' : 'MODERATE',
        riskScore: isKeralaOverdue ? 91 : 54,
        primaryRiskReason: isKeralaOverdue
          ? `Default: Lapsed ${Math.abs(daysLeftKerala)} day${Math.abs(daysLeftKerala) === 1 ? '' : 's'} past maturity without replacement lineage; EoA frozen`
          : `Maturing in ${daysLeftKerala} days without active replacement submission (T-15 escalation active)`,
        discrepancies: 0,
        legalHolds: 0,
        overdueCount: isKeralaOverdue ? 1 : 0,
      },
      {
        state: 'West Bengal',
        region: 'ERO',
        city: 'Kolkata',
        institutionCount: 1,
        totalCorpus: 3500000,
        riskLevel: isWbOverdue ? 'CRITICAL' : daysLeftWb <= 15 ? 'HIGH' : 'MONITORING',
        riskScore: isWbOverdue ? 88 : daysLeftWb <= 15 ? 68 : 32,
        primaryRiskReason: isWbOverdue
          ? `Default: Lapsed ${Math.abs(daysLeftWb)} day${Math.abs(daysLeftWb) === 1 ? '' : 's'} past maturity without replacement lineage; EoA frozen`
          : daysLeftWb <= 15
          ? `Maturing in ${daysLeftWb} days; Tier 2 urgent compliance alert dispatched`
          : `Maturing in ${daysLeftWb} days; T-60 advisory dispatched; CBS handshake confirmed clean`,
        discrepancies: 0,
        legalHolds: 0,
        overdueCount: isWbOverdue ? 1 : 0,
      },
      {
        state: 'Madhya Pradesh',
        region: 'CRO',
        city: 'Bhopal',
        institutionCount: 1,
        totalCorpus: 3500000,
        riskLevel: isMpOverdue ? 'CRITICAL' : daysLeftMp <= 15 ? 'HIGH' : daysLeftMp <= 60 ? 'MODERATE' : 'MONITORING',
        riskScore: isMpOverdue ? 86 : daysLeftMp <= 15 ? 65 : daysLeftMp <= 60 ? 46 : 24,
        primaryRiskReason: isMpOverdue
          ? `Default: Lapsed ${Math.abs(daysLeftMp)} day${Math.abs(daysLeftMp) === 1 ? '' : 's'} past maturity without replacement lineage; EoA frozen`
          : daysLeftMp <= 15
          ? `Maturing in ${daysLeftMp} days; Tier 2 urgent compliance alert dispatched`
          : daysLeftMp <= 60
          ? `Maturing in ${daysLeftMp} days; Tier 1 reminder active; bank CBS confirmed`
          : `Maturing in ${daysLeftMp} days; T-90 advisory dispatched; CBS confirmed in good standing`,
        discrepancies: 0,
        legalHolds: 0,
        overdueCount: isMpOverdue ? 1 : 0,
      },
      {
        state: 'Rajasthan',
        region: 'NWRO',
        city: 'Jaipur',
        institutionCount: 1,
        totalCorpus: 3500000,
        riskLevel: 'CLEAN',
        riskScore: 5,
        primaryRiskReason: '100% Compliant: Full 8-year lock-in completed, all 5 release gates passed; release eligible',
        discrepancies: 0,
        legalHolds: 0,
        overdueCount: 0,
      },
      {
        state: 'Tamil Nadu',
        region: 'SRO',
        city: 'Chennai',
        institutionCount: 1,
        totalCorpus: 3500000,
        riskLevel: 'CLEAN',
        riskScore: 4,
        primaryRiskReason: '100% Compliant: Genuine SBI Term Deposit, active lien verified, zero encumbrance',
        discrepancies: 0,
        legalHolds: 0,
        overdueCount: 0,
      },
    ];
  }, [instruments, simulatedDate]);

  // Filtered institutions
  const filteredList = useMemo(() => {
    return instruments.filter((item) => {
      const matchesSearch =
        item.institutionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.fdrNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.institutionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.bankName.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // Category filter triggered from top metric cards
      if (activeCategoryFilter === 'CRITICAL') {
        const isCriticalOrHigh = 
          item.status === 'OVERDUE' || 
          item.status === 'DISCREPANCY_FLAGGED' || 
          item.region === 'NRO' || 
          item.region === 'WRO' || 
          item.region === 'ERO';
        if (!isCriticalOrHigh) return false;
      } else if (activeCategoryFilter === 'SHORTFALLS') {
        const hasShortfall = item.actualDeposit !== item.principalAmount || item.forensics.mathMismatch || item.status === 'DISCREPANCY_FLAGGED';
        if (!hasShortfall) return false;
      } else if (activeCategoryFilter === 'LEGAL_STAYS') {
        const hasLegalStay = item.ghostEncumbrance.hasLitigationHold;
        if (!hasLegalStay) return false;
      }

      if (selectedStateFilter === 'ALL') return true;

      const itemStateMatch = 
        (selectedStateFilter === 'Kerala' && (item.institutionName.includes('Thrissur') || item.branchName.includes('Kerala'))) ||
        (selectedStateFilter === 'West Bengal' && (item.institutionName.includes('Kolkata') || item.branchName.includes('Kolkata'))) ||
        (selectedStateFilter === 'Madhya Pradesh' && (item.institutionName.includes('Bhopal') || item.branchName.includes('Bhopal'))) ||
        (selectedStateFilter === 'Bihar' && item.institutionName.includes('Patna')) ||
        (selectedStateFilter === 'Uttar Pradesh' && (item.institutionName.includes('Meerut') || item.institutionName.includes('Lucknow'))) ||
        (selectedStateFilter === 'Maharashtra' && (item.institutionName.includes('Navi Mumbai') || item.branchName.includes('Mumbai'))) ||
        (selectedStateFilter === 'Karnataka' && item.institutionName.includes('Bengaluru')) ||
        (selectedStateFilter === 'Rajasthan' && item.institutionName.includes('Jaipur')) ||
        (selectedStateFilter === 'Tamil Nadu' && item.institutionName.includes('Chennai')) ||
        (selectedStateFilter === 'Telangana' && item.institutionName.includes('Hyderabad'));
      
      if (!itemStateMatch) {
        const stateData = stateRiskMatrix.find((s) => s.state === selectedStateFilter);
        return stateData ? item.region === stateData.region : true;
      }

      return true;
    });
  }, [instruments, searchQuery, selectedStateFilter, activeCategoryFilter, stateRiskMatrix]);

  // Total nationwide metrics
  const totalNationalCorpus = instruments.reduce((acc, curr) => acc + curr.actualDeposit, 0);
  const criticalStates = stateRiskMatrix.filter((s) => s.riskLevel === 'CRITICAL' || s.riskLevel === 'HIGH');
  const criticalCount = criticalStates.length;
  const totalDiscrepancies = instruments.filter(
    (i) => i.status === 'DISCREPANCY_FLAGGED' || i.forensics.mathMismatch || i.forensics.elaTamperingDetected
  ).length;

  // Handle smart arrow button click on table row: Opens the comprehensive scrutiny dossier drawer
  const handleSmartArrowClick = (item: FDRInstrument) => {
    setSelectedDossierInstrument(item);
  };

  // Direct workspace jump from dossier drawer
  const handleJumpToForensics = (item: FDRInstrument) => {
    onOpenIntakeStudioWithInstrument(item);
    setSelectedDossierInstrument(null);
  };

  const handleJumpToTruthMatrix = (item: FDRInstrument) => {
    onOpenScrutinyMatrix(item);
    setSelectedDossierInstrument(null);
  };

  const handleJumpToReleaseEngine = (item: FDRInstrument) => {
    onOpenReleaseEngine(item);
    setSelectedDossierInstrument(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Exclusive HQ Header Banner */}
      <div className="bg-[#FFFFFF] border-2 border-amber-600 rounded-sm p-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded bg-amber-50 border border-amber-300 flex items-center justify-center shrink-0 mt-0.5">
              <Landmark className="w-6 h-6 text-amber-900" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold bg-amber-900 text-amber-100 px-2 py-0.5 rounded uppercase">
                  EXCLUSIVE HQ MODULE 1 • SUPER ADMIN COMMAND
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  AICTE Regulation Bureau • HQ New Delhi
                </span>
              </div>
              <h2 className="text-base font-bold text-slate-900 mt-0.5">
                Nationwide FDR Security Deposit Corpus & Geographical Risk Heatmap
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Macro-level statutory surveillance monitoring all institutional security deposit portfolios across all regional jurisdictions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-300 rounded text-xs text-emerald-900 font-mono font-bold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>NATIONWIDE SURVEILLANCE ACTIVE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Macro KPI Cards (Interactive In-Page Quick Filters) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        {/* KPI 1 */}
        <div 
          onClick={() => {
            setSelectedStateFilter('ALL');
            setActiveCategoryFilter('ALL');
            setSearchQuery('');
            scrollToMasterTable();
          }}
          className={`bg-[#FFFFFF] border p-4 rounded-sm shadow-xs border-l-4 border-l-[#14532D] cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md ${
            activeCategoryFilter === 'ALL' && selectedStateFilter === 'ALL' ? 'border-[#14532D] ring-2 ring-emerald-300/60 bg-emerald-50/10' : 'border-[#D4D1C7]'
          }`}
          title="Click to reset filters and view full nationwide repository"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs uppercase font-semibold tracking-wider">Total Nationwide Corpus</span>
            <Landmark className="w-4 h-4 text-[#14532D]" />
          </div>
          <div className="rupee-mono text-2xl font-bold text-slate-900">
            {formatCrores(totalNationalCorpus)}
          </div>
          <div className="text-[11px] text-slate-600 mt-1 flex items-center justify-between">
            <span>{instruments.length} Institutions Enrolled</span>
            <span className="text-emerald-700 font-bold font-mono">Click to View All</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div 
          onClick={() => {
            setActiveCategoryFilter(activeCategoryFilter === 'CRITICAL' ? 'ALL' : 'CRITICAL');
            setSelectedStateFilter('ALL');
            scrollToMasterTable();
          }}
          className={`bg-[#FFFFFF] border p-4 rounded-sm shadow-xs border-l-4 border-l-red-600 cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md ${
            activeCategoryFilter === 'CRITICAL' ? 'border-red-600 ring-2 ring-red-300 bg-red-50/20' : 'border-[#D4D1C7]'
          }`}
          title="Click to isolate Critical & High Risk jurisdictions in table below"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs uppercase font-semibold tracking-wider">High Risk / Critical States</span>
            <ShieldAlert className="w-4 h-4 text-red-600" />
          </div>
          <div className="rupee-mono text-2xl font-bold text-red-700">
            {criticalCount} <span className="text-sm font-normal text-slate-500 font-sans">/ 10 Jurisdictions</span>
          </div>
          <div className="text-[11px] text-slate-600 mt-1 flex items-center justify-between">
            <span className="text-red-700 font-semibold font-mono truncate max-w-[200px]" title={criticalStates.map(s => s.state).join(', ')}>
              {criticalStates.map(s => s.state.substring(0, 2).toUpperCase()).join(', ')} Flagged
            </span>
            <span className="text-[10px] bg-red-100 text-red-800 px-1.5 py-0.2 rounded font-bold">
              {activeCategoryFilter === 'CRITICAL' ? 'FILTER APPLIED' : 'FILTER IN-PAGE'}
            </span>
          </div>
        </div>

        {/* KPI 3 */}
        <div 
          onClick={() => {
            setActiveCategoryFilter(activeCategoryFilter === 'SHORTFALLS' ? 'ALL' : 'SHORTFALLS');
            setSelectedStateFilter('ALL');
            scrollToMasterTable();
          }}
          className={`bg-[#FFFFFF] border p-4 rounded-sm shadow-xs border-l-4 border-l-amber-600 cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md ${
            activeCategoryFilter === 'SHORTFALLS' ? 'border-amber-600 ring-2 ring-amber-300 bg-amber-50/20' : 'border-[#D4D1C7]'
          }`}
          title="Click to isolate statutory deposit shortfalls in table below"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs uppercase font-semibold tracking-wider">Statutory Deposit Shortfalls</span>
            <Scale className="w-4 h-4 text-amber-700" />
          </div>
          <div className="rupee-mono text-2xl font-bold text-amber-800">
            ₹35,00,000
          </div>
          <div className="text-[11px] text-slate-600 mt-1 flex items-center justify-between">
            <span>Apex (₹20L) + Metro (₹15L)</span>
            <span className="text-amber-800 font-bold font-mono">
              {activeCategoryFilter === 'SHORTFALLS' ? 'FILTER APPLIED' : 'FILTER IN-PAGE'}
            </span>
          </div>
        </div>

        {/* KPI 4 */}
        <div 
          onClick={() => {
            setActiveCategoryFilter(activeCategoryFilter === 'LEGAL_STAYS' ? 'ALL' : 'LEGAL_STAYS');
            setSelectedStateFilter('ALL');
            scrollToMasterTable();
          }}
          className={`bg-[#FFFFFF] border p-4 rounded-sm shadow-xs border-l-4 border-l-blue-700 cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md ${
            activeCategoryFilter === 'LEGAL_STAYS' ? 'border-blue-700 ring-2 ring-blue-300 bg-blue-50/20' : 'border-[#D4D1C7]'
          }`}
          title="Click to isolate judicial stays and attachments in table below"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs uppercase font-semibold tracking-wider">Judicial Attachments / Stays</span>
            <Gavel className="w-4 h-4 text-blue-700" />
          </div>
          <div className="rupee-mono text-2xl font-bold text-blue-900">
            1 Active Hold
          </div>
          <div className="text-[11px] text-slate-600 mt-1 flex items-center justify-between">
            <span>Allahabad HC WP(C) 4182</span>
            <span className="text-blue-800 font-semibold font-mono">
              {activeCategoryFilter === 'LEGAL_STAYS' ? 'FILTER APPLIED' : 'FILTER IN-PAGE'}
            </span>
          </div>
        </div>

      </div>

      {/* SECTION 2: INTERACTIVE STATE-WISE & REGIONAL RISK HEATMAP */}
      <div className="bg-[#FFFFFF] border border-[#D4D1C7] rounded-sm p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 pb-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#14532D]" />
              <h3 className="font-bold text-sm text-slate-900">
                Interactive State-Wise Statutory Regulatory Risk Heatmap (All India Overview)
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Click any jurisdiction card to isolate regional compliance dossiers, default probabilities, and active institutional files
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Filter View:</span>
            <button
              onClick={() => setSelectedStateFilter('ALL')}
              className={`px-2.5 py-1 text-xs rounded border transition-colors ${
                selectedStateFilter === 'ALL'
                  ? 'bg-slate-900 text-white border-slate-900 font-bold'
                  : 'bg-stone-100 hover:bg-stone-200 text-slate-700 border-stone-300'
              }`}
            >
              All Regions (10)
            </button>
          </div>
        </div>

        {/* Heatmap Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {stateRiskMatrix.map((item) => {
            const isSelected = selectedStateFilter === item.state;
            
            let badgeBg = 'bg-emerald-100 text-emerald-900 border-emerald-300';
            let cardBorder = 'border-stone-300 hover:border-slate-500';
            
            if (item.riskLevel === 'CRITICAL') {
              badgeBg = 'bg-red-700 text-white border-red-800 font-bold';
              cardBorder = isSelected ? 'border-red-600 ring-2 ring-red-400 bg-red-50/40' : 'border-red-300 bg-red-50/15 hover:border-red-500';
            } else if (item.riskLevel === 'HIGH') {
              badgeBg = 'bg-orange-600 text-white border-orange-700 font-bold';
              cardBorder = isSelected ? 'border-orange-600 ring-2 ring-orange-400 bg-orange-50/40' : 'border-orange-300 bg-orange-50/15 hover:border-orange-500';
            } else if (item.riskLevel === 'MODERATE') {
              badgeBg = 'bg-amber-100 text-amber-900 border-amber-300 font-semibold';
              cardBorder = isSelected ? 'border-amber-600 ring-2 ring-amber-400 bg-amber-50/40' : 'border-amber-300 hover:border-amber-500';
            } else if (item.riskLevel === 'MONITORING') {
              badgeBg = 'bg-blue-100 text-blue-900 border-blue-300 font-semibold';
              cardBorder = isSelected ? 'border-blue-600 ring-2 ring-blue-400 bg-blue-50/40' : 'border-blue-200 hover:border-blue-400';
            } else {
              cardBorder = isSelected ? 'border-emerald-600 ring-2 ring-emerald-400 bg-emerald-50/40' : 'border-emerald-300 hover:border-emerald-500';
            }

            return (
              <div
                key={item.state}
                onClick={() => {
                  setSelectedStateFilter(isSelected ? 'ALL' : item.state);
                  setActiveCategoryFilter('ALL');
                  scrollToMasterTable();
                }}
                className={`p-3 rounded border transition-all cursor-pointer flex flex-col justify-between ${cardBorder}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-xs text-slate-900 truncate">
                      {item.state}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-slate-500 bg-stone-100 px-1 rounded">
                      {item.region}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[9px] px-1.5 py-0.2 rounded border uppercase font-mono ${badgeBg}`}>
                      {item.riskLevel} RISK
                    </span>
                    <span className="text-[10px] font-mono text-slate-600 font-semibold">
                      Score: {item.riskScore}/100
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-700 leading-tight line-clamp-3 mb-2">
                    {item.primaryRiskReason}
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span>Corpus: {formatInr(item.totalCorpus)}</span>
                  <span className="text-[#14532D] font-bold">
                    {isSelected ? '✓ ACTIVE' : 'FILTER ↓'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {selectedStateFilter !== 'ALL' && (
          <div className="mt-3 p-2.5 bg-blue-50 border border-blue-200 rounded text-xs text-blue-950 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-700 shrink-0" />
              <span>
                Filtering Central Regulatory Ledger strictly to <strong>{selectedStateFilter}</strong> regional jurisdiction.
              </span>
            </div>
            <button
              onClick={() => setSelectedStateFilter('ALL')}
              className="text-xs font-bold text-blue-800 hover:underline"
            >
              Clear Filter (Show All 10)
            </button>
          </div>
        )}
      </div>

      {/* SECTION 3: CENTRAL FDR REGULATORY REPOSITORY MASTER TABLE */}
      <div id="master-repository-section" className="bg-[#FFFFFF] border border-[#D4D1C7] rounded-sm shadow-xs overflow-hidden scroll-mt-24">
        
        {/* Active Filter Banner */}
        {(selectedStateFilter !== 'ALL' || activeCategoryFilter !== 'ALL') && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
            <div className="flex items-center gap-2 text-amber-950 font-medium">
              <Filter className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span>
                Active In-Page Filter: {selectedStateFilter !== 'ALL' ? `State Jurisdiction: ${selectedStateFilter}` : `Macro Category: ${activeCategoryFilter}`}
                <strong className="ml-1 font-mono">({filteredList.length} matching institutional record{filteredList.length === 1 ? '' : 's'})</strong>
              </span>
            </div>
            <button
              onClick={() => {
                setSelectedStateFilter('ALL');
                setActiveCategoryFilter('ALL');
                setSearchQuery('');
              }}
              className="text-xs font-bold text-amber-800 hover:text-amber-950 bg-white border border-amber-300 px-2.5 py-0.5 rounded shadow-2xs self-start sm:self-auto cursor-pointer"
            >
              Reset Filter (Show All 10 Records)
            </button>
          </div>
        )}

        <div className="p-4 bg-[#F8F7F4] border-b border-[#D4D1C7] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#14532D]" />
              <h3 className="font-bold text-sm text-slate-900">
                Central FDR Regulatory Repository Master Ledger (Nationwide Bureau View)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Live status, dual-source CBS handshake, forensic trust score, and one-click workspace jump desk
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search college, FDR, bank, IFSC..."
                className="text-xs pl-8 pr-3 py-1.5 bg-white border border-[#D4D1C7] rounded focus:outline-hidden text-slate-900 w-52 sm:w-64"
              />
            </div>
            <span className="text-xs text-slate-500 font-mono">
              {filteredList.length} of {instruments.length} Records
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse gov-table">
            <thead>
              <tr>
                <th>Institution & AICTE ID</th>
                <th>FDR Number & Bank</th>
                <th>Principal Corpus</th>
                <th>Maturity & Countdown</th>
                <th>CBS Truth Check</th>
                <th>Regulatory Status</th>
                <th className="text-right">Scrutiny Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.map((item) => {
                const daysRemaining = getDaysRemaining(item.maturityDate, simulatedDate);
                const isOverdue = daysRemaining < 0;
                const isApproaching = daysRemaining >= 0 && daysRemaining <= 90;

                return (
                  <tr key={item.id} className="transition-colors hover:bg-stone-50">
                    
                    {/* Institution */}
                    <td className="max-w-[240px]">
                      <div className="font-bold text-slate-900 leading-tight truncate">
                        {item.institutionName}
                      </div>
                      <div className="text-[11px] font-mono text-slate-500 mt-0.5 flex items-center gap-2">
                        <span>ID: {item.institutionId}</span>
                        <span>•</span>
                        <span className="bg-slate-100 px-1 rounded">{item.aisheCode}</span>
                        <span>•</span>
                        <span className="font-semibold text-slate-700">{item.region} Office</span>
                      </div>
                    </td>

                    {/* FDR / Bank */}
                    <td>
                      <div className="font-mono font-semibold text-slate-900 text-xs flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-slate-500" />
                        <span>{item.fdrNumber}</span>
                      </div>
                      <div className="text-[11px] text-slate-600 truncate max-w-[180px]">
                        {item.bankName}
                      </div>
                      <div className="text-[10px] font-mono text-slate-400">
                        IFSC: {item.ifscCode}
                      </div>
                    </td>

                    {/* Principal */}
                    <td>
                      <div className="rupee-mono font-bold text-slate-900">
                        {formatInr(item.principalAmount)}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {item.interestRatePct}% p.a.
                      </div>
                      {item.depositDeficit > 0 && (
                        <div className="text-[10px] text-red-700 font-semibold font-mono">
                          Deficit: {formatInr(item.depositDeficit)}
                        </div>
                      )}
                    </td>

                    {/* Maturity Date */}
                    <td>
                      <div className="font-mono text-xs text-slate-900 font-medium">
                        {formatGovDate(item.maturityDate)}
                      </div>
                      <div className="text-[11px] mt-0.5">
                        {isOverdue ? (
                          <span className="text-red-700 bg-red-50 border border-red-200 px-1.5 py-0.2 rounded font-mono font-bold text-[10px]">
                            Lapsed by {Math.abs(daysRemaining)}d
                          </span>
                        ) : isApproaching ? (
                          <span className="text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded font-mono font-semibold text-[10px]">
                            {daysRemaining}d left
                          </span>
                        ) : (
                          <span className="text-slate-500 text-[11px]">
                            {item.tenureYears} Yrs Lock-in
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Source Verification Badge */}
                    <td>
                      {item.bankCbs.confirmed ? (
                        <div className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded text-[11px] font-medium">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>CBS Confirmed</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1 bg-red-50 text-red-800 border border-red-300 px-2 py-0.5 rounded text-[11px] font-medium">
                          <AlertTriangle className="w-3 h-3 text-red-600" />
                          <span>Mismatch / Loan</span>
                        </div>
                      )}
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                        Trust: <strong>{item.forensics.trustScore}%</strong>
                      </div>
                    </td>

                    {/* Regulatory Status */}
                    <td>
                      {item.status === 'ACTIVE' && (
                        <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-[#DCFCE7] text-[#15803D] border border-emerald-300">
                          Active & Valid
                        </span>
                      )}
                      {item.status === 'RENEWED' && (
                        <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-300">
                          Renewed (Continuous)
                        </span>
                      )}
                      {item.status === 'DISCREPANCY_FLAGGED' && (
                        <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-[#FEE2E2] text-[#B91C1C] border border-red-300">
                          Discrepancy Flagged
                        </span>
                      )}
                      {item.status === 'APPROACHING_MATURITY' && (
                        <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-[#FEF3C7] text-[#B45309] border border-amber-300">
                          Maturing Soon
                        </span>
                      )}
                      {item.status === 'OVERDUE' && (
                        <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-red-100 text-red-900 border border-red-400">
                          Overdue / Frozen
                        </span>
                      )}
                      {item.status === 'RELEASE_REQUESTED' && (
                        <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-purple-100 text-purple-900 border border-purple-300">
                          Release Sanction Ready
                        </span>
                      )}
                    </td>

                    {/* Actions: Eye, Layers, FileSignature, ArrowUpRight */}
                    <td className="text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        
                        {/* 1. Inspect Document Scan */}
                        <button
                          onClick={() => onSelectInstrumentForInspection(item)}
                          className="p-1.5 text-slate-600 hover:text-slate-900 bg-stone-100 hover:bg-stone-200 border border-[#D4D1C7] rounded"
                          title="Inspect Hi-Res Document Scan & ELA Overlay"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* 2. Run 6-Layer Forensic Engine */}
                        <button
                          onClick={() => onOpenIntakeStudioWithInstrument(item)}
                          className="p-1.5 text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded"
                          title="Run 6-Layer Forensic Scrutiny Engine"
                        >
                          <Layers className="w-3.5 h-3.5" />
                        </button>

                        {/* 3. Open Dual-Source Truth Matrix & e-Office Green Sheet */}
                        <button
                          onClick={() => onOpenScrutinyMatrix(item)}
                          className="p-1.5 text-blue-800 hover:text-blue-950 bg-blue-50 hover:bg-blue-100 border border-blue-300 rounded"
                          title="Open Dual-Source Truth Matrix & e-Office Green Sheet"
                        >
                          <FileSignature className="w-3.5 h-3.5" />
                        </button>

                        {/* 4. THE ARROW ACTION BUTTON: Opens Comprehensive Scrutiny Dossier & Direct Jump Desk */}
                        <button
                          onClick={() => handleSmartArrowClick(item)}
                          className="p-1.5 text-purple-900 hover:text-white bg-purple-100 hover:bg-purple-800 border border-purple-400 rounded transition-all shadow-xs group"
                          title="Open Comprehensive Scrutiny Dossier & Quick-Jump Desk"
                        >
                          <ArrowUpRight className="w-3.5 h-3.5 group-hover:scale-125 transition-transform" />
                        </button>

                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* COMPREHENSIVE SCRUTINY DOSSIER & QUICK-ACTION DRAWER / MODAL */}
      {selectedDossierInstrument && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-[#FFFFFF] border-2 border-slate-700 rounded shadow-2xl max-w-3xl w-full my-8 p-6 space-y-4">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded bg-purple-100 border border-purple-300 flex items-center justify-center text-purple-900">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    Comprehensive Scrutiny Dossier & Direct Workspace Jump
                  </h3>
                  <div className="text-xs text-slate-500 font-mono">
                    FDR #{selectedDossierInstrument.fdrNumber} • {selectedDossierInstrument.institutionName}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedDossierInstrument(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-800"
              >
                ✕
              </button>
            </div>

            {/* Dossier 4-Card Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
              <div className="bg-stone-50 p-2.5 rounded border border-stone-200">
                <span className="text-slate-500 font-sans text-[11px]">Principal Amount</span>
                <div className="font-bold text-slate-900 text-sm">{formatInr(selectedDossierInstrument.principalAmount)}</div>
                <div className="text-[10px] text-slate-500">{selectedDossierInstrument.bankName}</div>
              </div>

              <div className="bg-stone-50 p-2.5 rounded border border-stone-200">
                <span className="text-slate-500 font-sans text-[11px]">CBS Status</span>
                <div className={`font-bold ${selectedDossierInstrument.bankCbs.confirmed ? 'text-emerald-700' : 'text-red-700'}`}>
                  {selectedDossierInstrument.bankCbs.confirmed ? 'CBS Confirmed' : 'CBS Discrepancy'}
                </div>
                <div className="text-[10px] text-slate-500">Trust: {selectedDossierInstrument.forensics.trustScore}%</div>
              </div>

              <div className="bg-stone-50 p-2.5 rounded border border-stone-200">
                <span className="text-slate-500 font-sans text-[11px]">Maturity Date</span>
                <div className="font-bold text-slate-900">{formatGovDate(selectedDossierInstrument.maturityDate)}</div>
                <div className="text-[10px] text-slate-500">{getDaysRemaining(selectedDossierInstrument.maturityDate, simulatedDate)}d remaining</div>
              </div>

              <div className="bg-stone-50 p-2.5 rounded border border-stone-200">
                <span className="text-slate-500 font-sans text-[11px]">EoA Status</span>
                <div className={`font-bold ${selectedDossierInstrument.eoaStatus.isFrozen ? 'text-red-700' : 'text-emerald-700'}`}>
                  {selectedDossierInstrument.eoaStatus.isFrozen ? 'WITHHELD / FROZEN' : 'ACTIVE'}
                </div>
                <div className="text-[10px] text-slate-500">AY 2027-28</div>
              </div>
            </div>

            {/* Active Finding / Case Notice */}
            <div className="p-3 bg-stone-100 rounded border border-stone-300 text-xs text-slate-800 space-y-1">
              <div className="font-bold font-sans text-slate-950 flex items-center justify-between">
                <span>Regulatory Finding & Audit Notes:</span>
                <span className="font-mono text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded">
                  {selectedDossierInstrument.aphClauseReference}
                </span>
              </div>
              <p className="leading-relaxed font-sans">
                {selectedDossierInstrument.fiveGates.blockReason || 'Instrument is under active regulatory lifecycle surveillance. All five statutory gates evaluated.'}
              </p>
              {selectedDossierInstrument.ghostEncumbrance.hasLitigationHold && (
                <div className="p-2 bg-red-100 border border-red-300 text-red-900 rounded font-semibold text-[11px] flex items-center gap-1.5">
                  <Gavel className="w-3.5 h-3.5 text-red-700 shrink-0" />
                  <span>Litigation Hold Active: {selectedDossierInstrument.ghostEncumbrance.caseNumber} ({selectedDossierInstrument.ghostEncumbrance.courtName})</span>
                </div>
              )}
            </div>

            {/* Direct Workspace Action Buttons */}
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-slate-500 block mb-2">
                One-Click Direct Workspace Navigation:
              </span>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                
                {/* 1. Go to 6-Layer Forensic Studio */}
                <button
                  onClick={() => handleJumpToForensics(selectedDossierInstrument)}
                  className="p-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 rounded text-left transition-colors flex items-start gap-2"
                >
                  <Layers className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold">6-Layer Forensic Studio</div>
                    <div className="text-[10px] text-emerald-700 mt-0.5">Inspect ELA heatmap & quarterly math calculation</div>
                  </div>
                </button>

                {/* 2. Go to Dual-Source Truth Matrix */}
                <button
                  onClick={() => handleJumpToTruthMatrix(selectedDossierInstrument)}
                  className="p-3 bg-blue-50 hover:bg-blue-100 border border-blue-300 text-blue-900 rounded text-left transition-colors flex items-start gap-2"
                >
                  <FileSignature className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold">Dual-Source CBS Matrix</div>
                    <div className="text-[10px] text-blue-700 mt-0.5">Execute live CBS handshake & sign Green Sheet</div>
                  </div>
                </button>

                {/* 3. Go to 5-Gate Release Engine */}
                <button
                  onClick={() => handleJumpToReleaseEngine(selectedDossierInstrument)}
                  className="p-3 bg-purple-50 hover:bg-purple-100 border border-purple-300 text-purple-900 rounded text-left transition-colors flex items-start gap-2"
                >
                  <Award className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold">5-Gate Release Engine</div>
                    <div className="text-[10px] text-purple-700 mt-0.5">Review 5 gates, grant sanction & QR order</div>
                  </div>
                </button>

              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex justify-between items-center pt-2 border-t border-slate-200">
              <button
                onClick={() => {
                  onSelectInstrumentForInspection(selectedDossierInstrument);
                  setSelectedDossierInstrument(null);
                }}
                className="px-3 py-1.5 text-xs bg-stone-100 hover:bg-stone-200 text-slate-800 border border-[#D4D1C7] rounded font-medium flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Open Hi-Res Document Inspection Scan</span>
              </button>

              <button
                onClick={() => setSelectedDossierInstrument(null)}
                className="px-4 py-1.5 text-xs bg-slate-800 hover:bg-slate-900 text-white rounded font-medium"
              >
                Close Dossier
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

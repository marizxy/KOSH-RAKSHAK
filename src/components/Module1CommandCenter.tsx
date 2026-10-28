import React, { useState, useMemo } from 'react';
import { FDRInstrument, RegionalOffice, InstrumentStatus, VerificationStage, UserRole } from '../types';
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
  FileCheck, 
  Clock, 
  Landmark,
  FileSignature
} from 'lucide-react';

interface Module1CommandCenterProps {
  instruments: FDRInstrument[];
  simulatedDate: string;
  onSelectInstrumentForInspection: (instrument: FDRInstrument) => void;
  onOpenIntakeStudioWithInstrument?: (instrument: FDRInstrument) => void;
  onOpenScrutinyMatrix: (instrument: FDRInstrument) => void;
  onOpenReleaseEngine: (instrument: FDRInstrument) => void;
  onOpenLineage: (instrument: FDRInstrument) => void;
  currentRole?: UserRole;
}

export const Module1CommandCenter: React.FC<Module1CommandCenterProps> = ({
  instruments,
  simulatedDate,
  onSelectInstrumentForInspection,
  onOpenIntakeStudioWithInstrument,
  onOpenScrutinyMatrix,
  onOpenReleaseEngine,
  onOpenLineage,
  currentRole = 'bureau',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedBank, setSelectedBank] = useState<string>('ALL');
  const [selectedDossierInstrument, setSelectedDossierInstrument] = useState<FDRInstrument | null>(null);

  // Compute live KPI metrics based on simulatedDate
  const metrics = useMemo(() => {
    let totalCorpus = 0;
    let verifiedCount = 0;
    let pendingScrutinyCount = 0;
    let discrepancyCount = 0;
    let maturingIn30 = 0;
    let maturingIn60 = 0;
    let maturingIn90 = 0;
    let overdueCount = 0;
    let releasePendingCount = 0;

    instruments.forEach((item) => {
      totalCorpus += item.actualDeposit;
      if (item.verificationStatus === 'BANK_CBS_CONFIRMED' || item.verificationStatus === 'RELEASE_READY') {
        verifiedCount++;
      }
      if (item.verificationStatus === 'PENDING_SCRUTINY') {
        pendingScrutinyCount++;
      }
      if (item.status === 'DISCREPANCY_FLAGGED' || item.forensics.mathMismatch || item.forensics.elaTamperingDetected) {
        discrepancyCount++;
      }
      if (item.status === 'RELEASE_REQUESTED') {
        releasePendingCount++;
      }

      const daysLeft = getDaysRemaining(item.maturityDate, simulatedDate);
      if (daysLeft < 0) {
        overdueCount++;
      } else if (daysLeft <= 30) {
        maturingIn30++;
      } else if (daysLeft <= 60) {
        maturingIn60++;
      } else if (daysLeft <= 90) {
        maturingIn90++;
      }
    });

    return {
      totalCorpus,
      verifiedCount,
      pendingScrutinyCount,
      discrepancyCount,
      maturingIn30,
      maturingIn60,
      maturingIn90,
      overdueCount,
      releasePendingCount,
      totalCount: instruments.length,
    };
  }, [instruments, simulatedDate]);

  // Unique lists for filters
  const regions = useMemo(() => {
    const list = Array.from(new Set(instruments.map((i) => i.region)));
    return ['ALL', ...list];
  }, [instruments]);

  const banks = useMemo(() => {
    const list = Array.from(new Set(instruments.map((i) => i.bankName)));
    return ['ALL', ...list];
  }, [instruments]);

  // Filtered dataset
  const filteredInstruments = useMemo(() => {
    return instruments.filter((item) => {
      const matchesSearch =
        item.institutionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.fdrNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.institutionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.aisheCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.bankName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRegion = selectedRegion === 'ALL' || item.region === selectedRegion;
      const matchesBank = selectedBank === 'ALL' || item.bankName === selectedBank;
      
      let matchesStatus = true;
      if (selectedStatus === 'ACTIVE') matchesStatus = item.status === 'ACTIVE' || item.status === 'RENEWED';
      else if (selectedStatus === 'DISCREPANCY') matchesStatus = item.status === 'DISCREPANCY_FLAGGED';
      else if (selectedStatus === 'APPROACHING') matchesStatus = item.status === 'APPROACHING_MATURITY';
      else if (selectedStatus === 'OVERDUE') matchesStatus = item.status === 'OVERDUE';
      else if (selectedStatus === 'RELEASE_REQUESTED') matchesStatus = item.status === 'RELEASE_REQUESTED';

      return matchesSearch && matchesRegion && matchesBank && matchesStatus;
    });
  }, [instruments, searchQuery, selectedRegion, selectedBank, selectedStatus]);

  // Region breakdown calculation
  const regionBreakdown = useMemo(() => {
    const map: Record<string, { total: number; compliant: number; discrepancies: number }> = {};
    instruments.forEach((i) => {
      if (!map[i.region]) {
        map[i.region] = { total: 0, compliant: 0, discrepancies: 0 };
      }
      map[i.region].total++;
      if (i.status === 'DISCREPANCY_FLAGGED') {
        map[i.region].discrepancies++;
      } else {
        map[i.region].compliant++;
      }
    });
    return map;
  }, [instruments]);

  return (
    <div className="space-y-6">
      
      {/* SECTION 1: Top KPI Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        
        {/* KPI 1: Total Corpus */}
        <div className="bg-[#FFFFFF] border border-[#D4D1C7] p-3.5 rounded-sm shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs uppercase font-semibold tracking-wider">Total Deposit Corpus</span>
            <Landmark className="w-4 h-4 text-[#14532D]" />
          </div>
          <div className="rupee-mono text-2xl font-bold text-slate-900">
            {formatCrores(metrics.totalCorpus)}
          </div>
          <div className="text-[11px] text-slate-600 mt-1 flex items-center justify-between">
            <span>{metrics.totalCount} Active Instruments</span>
            <span className="text-[#14532D] font-medium font-mono">100% Pledged</span>
          </div>
        </div>

        {/* KPI 2: Dual-Source Verified vs Pending */}
        <div className="bg-[#FFFFFF] border border-[#D4D1C7] p-3.5 rounded-sm shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs uppercase font-semibold tracking-wider">Dual-Source Verified</span>
            <ShieldCheck className="w-4 h-4 text-[#15803D]" />
          </div>
          <div className="rupee-mono text-2xl font-bold text-[#15803D]">
            {metrics.verifiedCount} <span className="text-sm font-normal text-slate-500">/ {metrics.totalCount}</span>
          </div>
          <div className="text-[11px] text-slate-600 mt-1 flex items-center justify-between">
            <span>Bank CBS Confirmed</span>
            <span className="text-emerald-700 font-mono font-medium">{Math.round((metrics.verifiedCount / metrics.totalCount) * 100)}% Verified</span>
          </div>
        </div>

        {/* KPI 3: High Risk Fraud & Discrepancies */}
        <div className="bg-[#FFFFFF] border border-[#D4D1C7] p-3.5 rounded-sm shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs uppercase font-semibold tracking-wider">Discrepancy / Fraud Flag</span>
            <AlertTriangle className="w-4 h-4 text-[#B91C1C]" />
          </div>
          <div className="rupee-mono text-2xl font-bold text-[#B91C1C]">
            {metrics.discrepancyCount}
          </div>
          <div className="text-[11px] text-red-700 mt-1 flex items-center justify-between">
            <span>Photoshopped / Loan Lien</span>
            <span className="font-semibold uppercase text-[10px] bg-red-100 px-1 rounded">Immediate Action</span>
          </div>
        </div>

        {/* KPI 4: Maturing Soon */}
        <div className="bg-[#FFFFFF] border border-[#D4D1C7] p-3.5 rounded-sm shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs uppercase font-semibold tracking-wider">Maturing &lt;90 Days</span>
            <Clock className="w-4 h-4 text-[#B45309]" />
          </div>
          <div className="rupee-mono text-2xl font-bold text-[#B45309]">
            {metrics.maturingIn30 + metrics.maturingIn60 + metrics.maturingIn90}
          </div>
          <div className="text-[11px] text-slate-600 mt-1 flex items-center justify-between">
            <span className="text-red-700 font-medium font-mono">{metrics.maturingIn30} in &lt;30d</span>
            <span className="text-amber-700 font-medium font-mono">{metrics.maturingIn60} in &lt;60d</span>
            <span className="text-slate-600 font-medium font-mono">{metrics.maturingIn90} in &lt;90d</span>
          </div>
        </div>

        {/* KPI 5: Overdue Escalations & Release Requests */}
        <div className="bg-[#FFFFFF] border border-[#D4D1C7] p-3.5 rounded-sm shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs uppercase font-semibold tracking-wider">Overdue & Sanction Pending</span>
            <FileSignature className="w-4 h-4 text-purple-700" />
          </div>
          <div className="rupee-mono text-2xl font-bold text-slate-900">
            {metrics.overdueCount} <span className="text-xs font-normal text-slate-500 font-sans">Overdue | </span>
            <span className="text-purple-700">{metrics.releasePendingCount}</span> <span className="text-xs font-normal text-slate-500 font-sans">Refund</span>
          </div>
          <div className="text-[11px] text-slate-600 mt-1 flex items-center justify-between">
            <span className="text-red-700 font-medium font-mono">{metrics.overdueCount} Tier-3 Escalated</span>
            <span className="text-purple-700 font-medium font-mono">5-Gate Review</span>
          </div>
        </div>

      </div>

      {/* SECTION 2: Analytics Visuals Strip */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Chart 1: 12-Month Maturity & Renewal Cashflow Timeline */}
        <div className="bg-[#FFFFFF] border border-[#D4D1C7] p-4 rounded-sm shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200">
            <div>
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-[#14532D]" />
                12-Month Institutional FDR Maturity & Renewal Cashflow Timeline
              </h3>
              <p className="text-xs text-slate-500">
                Projected capital renewal schedule across all participating technical colleges (FY 2026–27)
              </p>
            </div>
            <span className="text-[11px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
              Corpus: ₹3.50 Cr Total
            </span>
          </div>

          {/* Timeline visualization */}
          <div className="h-44 flex items-end justify-between gap-2 pt-6 px-2">
            {[
              { month: 'Oct 26', amount: 35, count: 1, alert: true, label: 'Lapsed (Patna)' },
              { month: 'Nov 26', amount: 35, count: 1, alert: true, label: 'T-14d (Thrissur)' },
              { month: 'Dec 26', amount: 35, count: 1, alert: false, label: 'T-42d (Kolkata)' },
              { month: 'Jan 27', amount: 35, count: 1, alert: false, label: 'T-76d (Bhopal)' },
              { month: 'Feb 27', amount: 0, count: 0, alert: false, label: '—' },
              { month: 'Mar 27', amount: 70, count: 2, alert: false, label: 'Renewal Peak' },
              { month: 'Apr 27', amount: 35, count: 1, alert: false, label: 'Cycle 1' },
              { month: 'May 27', amount: 35, count: 1, alert: false, label: 'Shortfall Hedged' },
              { month: 'Jun 27', amount: 0, count: 0, alert: false, label: '—' },
              { month: 'Jul 27', amount: 35, count: 1, alert: false, label: 'Review' },
              { month: 'Aug 27', amount: 0, count: 0, alert: false, label: '—' },
              { month: 'Sep 27', amount: 35, count: 1, alert: false, label: 'MNIT Discharged' },
            ].map((item, idx) => {
              const heightPct = Math.max(12, Math.min(100, (item.amount / 70) * 100));
              return (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                  {/* Tooltip */}
                  <div className="absolute -top-10 hidden group-hover:flex flex-col items-center z-10 pointer-events-none">
                    <div className="bg-slate-900 text-white text-[10px] px-2 py-1 rounded shadow whitespace-nowrap font-mono">
                      {item.month}: ₹{item.amount}L ({item.label})
                    </div>
                    <div className="w-1.5 h-1.5 bg-slate-900 rotate-45 -mt-0.5"></div>
                  </div>

                  <div className="text-[10px] font-mono text-slate-500 mb-1 opacity-80">
                    {item.amount > 0 ? `₹${item.amount}L` : ''}
                  </div>

                  <div
                    style={{ height: `${heightPct}%` }}
                    className={`w-full rounded-t-xs transition-all duration-200 ${
                      item.alert
                        ? 'bg-amber-600 hover:bg-amber-700'
                        : item.amount > 0
                        ? 'bg-[#14532D] hover:bg-[#15803D]'
                        : 'bg-stone-200'
                    }`}
                  />
                  <div className="text-[10px] font-mono text-slate-600 mt-2 rotate-0 truncate max-w-[42px] text-center">
                    {item.month}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-2.5 mt-2">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#14532D]" />
                <span>Normal Regulatory Holding</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-amber-600" />
                <span>Critical / Lapsed Attention Required</span>
              </span>
            </div>
            <span className="font-mono text-slate-600">Quarterly Compound Rate Benchmark: 7.00% – 7.30%</span>
          </div>
        </div>

        {/* Visual 2: Regional Compliance Breakdown & Verification Funnel */}
        <div className="bg-[#FFFFFF] border border-[#D4D1C7] p-4 rounded-sm shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#14532D]" />
                Regional Breakdown & Funnel
              </h3>
              <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded font-mono text-slate-600">
                8 Regions Active
              </span>
            </div>

            {/* Region Bars */}
            <div className="space-y-2 mb-4">
              {Object.entries(regionBreakdown).slice(0, 5).map(([reg, val]) => (
                <div key={reg} className="text-xs">
                  <div className="flex justify-between text-slate-700 mb-0.5 font-medium">
                    <span className="font-mono">{reg} Office</span>
                    <span className="font-mono text-[11px]">
                      {val.total} FDRs {val.discrepancies > 0 ? `(${val.discrepancies} flagged)` : '✓'}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded bg-stone-100 overflow-hidden flex">
                    <div
                      style={{ width: `${(val.compliant / val.total) * 100}%` }}
                      className="bg-emerald-700 h-full"
                    />
                    {val.discrepancies > 0 && (
                      <div
                        style={{ width: `${(val.discrepancies / val.total) * 100}%` }}
                        className="bg-red-600 h-full"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Verification Funnel */}
          <div className="bg-stone-50 border border-stone-200 p-2.5 rounded-sm">
            <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1.5">
              4-Tier Regulatory Trust Funnel
            </div>
            <div className="grid grid-cols-4 gap-1 text-center font-mono text-[10px]">
              <div className="bg-white border border-slate-200 p-1 rounded">
                <div className="font-bold text-slate-800">100%</div>
                <div className="text-[9px] text-slate-500 truncate">Uploaded</div>
              </div>
              <div className="bg-white border border-slate-200 p-1 rounded">
                <div className="font-bold text-amber-700">80%</div>
                <div className="text-[9px] text-slate-500 truncate">AI Forensic</div>
              </div>
              <div className="bg-white border border-slate-200 p-1 rounded">
                <div className="font-bold text-emerald-700">70%</div>
                <div className="text-[9px] text-slate-500 truncate">CBS Match</div>
              </div>
              <div className="bg-white border border-slate-200 p-1 rounded">
                <div className="font-bold text-blue-700">60%</div>
                <div className="text-[9px] text-slate-500 truncate">HQ Sanction</div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* SECTION 3: Central Repository Master Table */}
      <div className="bg-[#FFFFFF] border border-[#D4D1C7] rounded-sm shadow-xs overflow-hidden">
        
        {/* Table Top Controls & Search */}
        <div className="p-4 bg-[#F8F7F4] border-b border-[#D4D1C7] flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#14532D]" />
            <div>
              <h3 className="font-bold text-sm text-slate-900 leading-tight">
                {(currentRole === 'regional' || currentRole === 'REGIONAL_OFFICER')
                  ? 'Regional FDR Regulatory Scrutiny Repository (SRO & NRO Jurisdiction)'
                  : 'Nationwide Central FDR Regulatory Repository Master'}
              </h3>
              <div className="text-xs text-slate-500">
                Showing {filteredInstruments.length} of {instruments.length} institutional security deposit instruments
                {(currentRole === 'regional' || currentRole === 'REGIONAL_OFFICER') && ' under Regional Scrutiny oversight'}
              </div>
            </div>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search College, FDR#, AISHE..."
                className="pl-8 pr-3 py-1.5 text-xs bg-white border border-[#D4D1C7] rounded-sm focus:outline-hidden focus:border-slate-800 w-48 sm:w-60"
              />
            </div>

            {/* Region Filter */}
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="py-1.5 px-2 text-xs bg-white border border-[#D4D1C7] rounded-sm text-slate-700 focus:outline-hidden"
            >
              <option value="ALL">All Regions</option>
              {regions.filter(r => r !== 'ALL').map((r) => (
                <option key={r} value={r}>{r} Region</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="py-1.5 px-2 text-xs bg-white border border-[#D4D1C7] rounded-sm text-slate-700 focus:outline-hidden"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active / Renewed</option>
              <option value="DISCREPANCY">Discrepancy / Forgery</option>
              <option value="APPROACHING">Approaching Maturity</option>
              <option value="OVERDUE">Overdue / Lapsed</option>
              <option value="RELEASE_REQUESTED">Release Requested</option>
            </select>

            {/* Bank Filter */}
            <select
              value={selectedBank}
              onChange={(e) => setSelectedBank(e.target.value)}
              className="py-1.5 px-2 text-xs bg-white border border-[#D4D1C7] rounded-sm text-slate-700 focus:outline-hidden"
            >
              <option value="ALL">All Banks</option>
              {banks.filter(b => b !== 'ALL').map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>

          </div>

        </div>

        {/* Master Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse gov-table">
            <thead>
              <tr>
                <th className="w-12">No.</th>
                <th>Institution & AISHE</th>
                <th>FDR Instrument / Bank</th>
                <th>Principal Amount</th>
                <th>Maturity Date & Tenure</th>
                <th>Source Verification</th>
                <th>Regulatory Status</th>
                <th className="text-right">Scrutiny Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInstruments.map((item, index) => {
                const daysRemaining = getDaysRemaining(item.maturityDate, simulatedDate);
                const isOverdue = daysRemaining < 0;
                const isApproaching = daysRemaining >= 0 && daysRemaining <= 90;

                return (
                  <tr key={item.id} className="transition-colors">
                    
                    {/* Index */}
                    <td className="font-mono text-slate-500 text-xs">
                      {String(index + 1).padStart(2, '0')}
                    </td>

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
                        <span className="font-semibold text-slate-700">{item.region}</span>
                      </div>
                    </td>

                    {/* FDR / Bank */}
                    <td>
                      <div className="font-mono font-semibold text-slate-900 text-xs flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-slate-500" />
                        <span>{item.fdrNumber}</span>
                      </div>
                      <div className="text-[11px] text-slate-600 truncate max-w-[200px]">
                        {item.bankName} ({item.branchName.split(',')[0]})
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
                        {item.interestRatePct}% p.a. (Compounded Qtr)
                      </div>
                      {item.depositDeficit > 0 && (
                        <div className="text-[10px] text-red-700 font-semibold font-mono">
                          Shortfall: {formatInr(item.depositDeficit)}
                        </div>
                      )}
                    </td>

                    {/* Maturity Date */}
                    <td>
                      <div className="font-mono text-xs text-slate-900 font-medium">
                        {formatGovDate(item.maturityDate)}
                      </div>
                      <div className="text-[11px] mt-0.5 flex items-center gap-1">
                        {isOverdue ? (
                          <span className="text-red-700 bg-red-50 border border-red-200 px-1.5 py-0.2 rounded font-mono font-bold text-[10px]">
                            Lapsed by {Math.abs(daysRemaining)} days
                          </span>
                        ) : isApproaching ? (
                          <span className="text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded font-mono font-semibold text-[10px]">
                            {daysRemaining} days left
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
                          <span>Bank CBS Confirmed</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1 bg-red-50 text-red-800 border border-red-300 px-2 py-0.5 rounded text-[11px] font-medium">
                          <AlertTriangle className="w-3 h-3 text-red-600" />
                          <span>Bank Mismatch / Unverified</span>
                        </div>
                      )}
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        Trust: {item.forensics.trustScore}%
                      </div>
                    </td>

                    {/* Regulatory Status */}
                    <td>
                      {item.status === 'ACTIVE' && (
                        <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-[#DCFCE7] text-[#15803D] border border-emerald-300">
                          Verified & Active
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
                          Default / Overdue
                        </span>
                      )}
                      {item.status === 'RELEASE_REQUESTED' && (
                        <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-purple-100 text-purple-900 border border-purple-300">
                          {item.fiveGates.overallEligible ? 'Release Sanction Ready' : 'Release In Review'}
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        
                        {/* Inspect Document Modal */}
                        <button
                          onClick={() => onSelectInstrumentForInspection(item)}
                          className="p-1.5 text-slate-600 hover:text-slate-900 bg-stone-100 hover:bg-stone-200 border border-[#D4D1C7] rounded"
                          title="Inspect Document & ELA Forensic Heatmap"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Open Intake / 6-Layer Studio */}
                        <button
                          onClick={() => onOpenIntakeStudioWithInstrument && onOpenIntakeStudioWithInstrument(item)}
                          className="p-1.5 text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded"
                          title="Run 6-Layer AI, ELA & Compound Interest Scrutiny"
                        >
                          <Layers className="w-3.5 h-3.5" />
                        </button>

                        {/* Open Dual Source CBS & Green Sheet */}
                        <button
                          onClick={() => onOpenScrutinyMatrix(item)}
                          className="p-1.5 text-blue-800 hover:text-blue-950 bg-blue-50 hover:bg-blue-100 border border-blue-300 rounded"
                          title="Open Dual-Source Truth Matrix & e-Office Green Sheet"
                        >
                          <FileSignature className="w-3.5 h-3.5" />
                        </button>

                        {/* Comprehensive Scrutiny Dossier & Direct Jump Desk */}
                        <button
                          onClick={() => setSelectedDossierInstrument(item)}
                          className="p-1.5 text-purple-900 hover:text-white bg-purple-100 hover:bg-purple-800 border border-purple-400 rounded transition-all shadow-xs group"
                          title="Open Comprehensive Scrutiny Dossier & Direct Workspace Jump"
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
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
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
                  onClick={() => {
                    onOpenIntakeStudioWithInstrument && onOpenIntakeStudioWithInstrument(selectedDossierInstrument);
                    setSelectedDossierInstrument(null);
                  }}
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
                  onClick={() => {
                    onOpenScrutinyMatrix(selectedDossierInstrument);
                    setSelectedDossierInstrument(null);
                  }}
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
                  onClick={() => {
                    onOpenReleaseEngine(selectedDossierInstrument);
                    setSelectedDossierInstrument(null);
                  }}
                  className="p-3 bg-purple-50 hover:bg-purple-100 border border-purple-300 text-purple-900 rounded text-left transition-colors flex items-start gap-2"
                >
                  <ArrowUpRight className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
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

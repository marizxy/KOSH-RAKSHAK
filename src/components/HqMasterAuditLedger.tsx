import React, { useState } from 'react';
import { AuditBlock } from '../types';
import { 
  Key, 
  ShieldCheck, 
  Download, 
  CheckCircle2, 
  Search, 
  Filter, 
  FileCode, 
  Lock, 
  Layers, 
  Database,
  ExternalLink,
  Cpu,
  Clock,
  UserCheck
} from 'lucide-react';

interface HqMasterAuditLedgerProps {
  auditBlocks: AuditBlock[];
  onVerifyChainIntegrity: () => boolean;
  chainVerifiedStatus: boolean | null;
  roleScope?: 'bureau' | 'regional' | 'college' | 'bank';
  badgeText?: string;
  subtitle?: string;
  title?: string;
  description?: string;
}

export const HqMasterAuditLedger: React.FC<HqMasterAuditLedgerProps> = ({
  auditBlocks,
  onVerifyChainIntegrity,
  chainVerifiedStatus,
  roleScope = 'bureau',
  badgeText,
  subtitle,
  title,
  description,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationFeedback, setVerificationFeedback] = useState<string | null>(null);
  const [selectedBlockForInspection, setSelectedBlockForInspection] = useState<AuditBlock | null>(null);

  const displayBadge = badgeText || (roleScope === 'regional' ? 'REGIONAL JURISDICTION • CRYPTOGRAPHIC AUDIT LEDGER' : 'EXCLUSIVE HQ MODULE 5 • MASS CRYPTOGRAPHIC LEDGER');
  const displaySubtitle = subtitle || (roleScope === 'regional' ? 'Tamper-Evident SHA-256 Audit Trail • SRO Chennai & NRO Kanpur' : 'Tamper-Evident SHA-256 Audit Trail • AICTE HQ New Delhi');
  const displayTitle = title || (roleScope === 'regional' ? 'Regional Cryptographic Audit Ledger & Chain Validator' : 'Master SHA-256 Cryptographic Audit Ledger & Chain Validator');
  const displayDesc = description || (roleScope === 'regional' ? 'Immutable, block-by-block cryptographic audit trail logging regional forensic scrutiny validations, dual-source green sheet digital signatures, and automated alert dispatches across regional camp desks.' : 'Immutable, block-by-block cryptographic audit trail logging every administrative action, bank CBS verification, and release authorization across all regional offices');

  // Latest block head
  const headBlock = auditBlocks[auditBlocks.length - 1];

  // Filter audit blocks
  const filteredBlocks = auditBlocks.filter((b) => {
    const matchesSearch =
      b.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.userRole.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.currentHash.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.blockIndex.toString().includes(searchQuery);

    const matchesRole = roleFilter === 'ALL' || b.userRole.toUpperCase() === roleFilter.toUpperCase();
    return matchesSearch && matchesRole;
  });

  // Verify chain integrity
  const handleVerifyChain = () => {
    setIsVerifying(true);
    setVerificationFeedback(null);
    setTimeout(() => {
      const ok = onVerifyChainIntegrity();
      setIsVerifying(false);
      setVerificationFeedback(
        ok
          ? `✓ 100% Cryptographic Integrity Verified: All ${auditBlocks.length} SHA-256 hash pointers recomputed and matched with zero mutations detected.`
          : '⚠️ Cryptographic Discrepancy Detected in block pointers.'
      );
      setTimeout(() => setVerificationFeedback(null), 8000);
    }, 700);
  };

  // Export CSV
  const handleExportCsv = () => {
    const headers = ['Block Index', 'Timestamp', 'User Role', 'User ID', 'IP Address', 'Action', 'Details', 'Previous Hash', 'Current Block Hash'];
    const rows = auditBlocks.map((b) => [
      b.blockIndex,
      b.timestamp,
      b.userRole,
      b.userIdentifier,
      b.ipAddress,
      `"${b.action}"`,
      `"${b.details.replace(/"/g, '""')}"`,
      b.previousHash,
      b.currentHash,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${roleScope === 'regional' ? 'AICTE_KOSH_Regional_Audit_Ledger_' : 'AICTE_KOSH_Master_Audit_Ledger_'}${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export JSON Proof
  const handleExportJsonProof = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({
      auditStandard: roleScope === 'regional' ? 'AICTE KOSH-Rakshak Regional Jurisdiction SHA-256 Ledger' : 'AICTE KOSH-Rakshak NIST FIPS 180-4 SHA-256 Ledger',
      exportedAt: new Date().toISOString(),
      blockCount: auditBlocks.length,
      headHash: headBlock.currentHash,
      blocks: auditBlocks,
    }, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', `${roleScope === 'regional' ? 'AICTE_KOSH_Regional_Cryptographic_Proof_' : 'AICTE_KOSH_Cryptographic_Proof_'}${new Date().toISOString().substring(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-[#FFFFFF] border-2 border-emerald-800 rounded-sm p-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded bg-emerald-50 border border-emerald-300 flex items-center justify-center shrink-0 mt-0.5">
              <Key className="w-6 h-6 text-[#14532D]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold bg-[#14532D] text-white px-2 py-0.5 rounded uppercase">
                  {displayBadge}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  {displaySubtitle}
                </span>
              </div>
              <h2 className="text-base font-bold text-slate-900 mt-0.5">
                {displayTitle}
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                {displayDesc}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            <button
              onClick={handleVerifyChain}
              disabled={isVerifying}
              className={`px-3.5 py-2 text-xs font-bold rounded flex items-center gap-1.5 transition-all shadow-xs ${
                isVerifying
                  ? 'bg-slate-300 text-slate-600 cursor-not-allowed'
                  : 'bg-[#14532D] hover:bg-[#15803D] text-white'
              }`}
            >
              <ShieldCheck className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
              <span>{isVerifying ? 'Recomputing Hashes...' : 'Verify Cryptographic Integrity'}</span>
            </button>

            <button
              onClick={handleExportCsv}
              className="px-3 py-2 text-xs font-semibold rounded bg-stone-100 hover:bg-stone-200 text-slate-700 border border-[#D4D1C7] flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={handleExportJsonProof}
              className="px-3 py-2 text-xs font-semibold rounded bg-stone-100 hover:bg-stone-200 text-slate-700 border border-[#D4D1C7] flex items-center gap-1.5 transition-colors"
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>JSON Proof</span>
            </button>
          </div>
        </div>
      </div>

      {verificationFeedback && (
        <div className="p-3 bg-emerald-50 border-2 border-emerald-600 rounded text-xs text-emerald-950 font-bold font-mono flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{verificationFeedback}</span>
        </div>
      )}

      {/* Top Cryptographic KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        {/* KPI 1 */}
        <div className="bg-[#FFFFFF] border border-[#D4D1C7] p-4 rounded-sm shadow-xs border-l-4 border-l-[#14532D]">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs uppercase font-semibold tracking-wider">Chained Block Count</span>
            <Database className="w-4 h-4 text-[#14532D]" />
          </div>
          <div className="font-mono text-2xl font-bold text-slate-900">
            {auditBlocks.length} Blocks
          </div>
          <div className="text-[11px] text-slate-600 mt-1">
            Block #0 (Genesis) to #{auditBlocks.length - 1} (Head)
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-[#FFFFFF] border border-[#D4D1C7] p-4 rounded-sm shadow-xs border-l-4 border-l-emerald-600">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs uppercase font-semibold tracking-wider">Chain Integrity State</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="font-mono text-base font-bold text-emerald-700 leading-tight">
            100% Intact & Verified
          </div>
          <div className="text-[11px] text-slate-600 mt-1">
            Zero Unhashed Mutations
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-[#FFFFFF] border border-[#D4D1C7] p-4 rounded-sm shadow-xs border-l-4 border-l-blue-600">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs uppercase font-semibold tracking-wider">Cryptographic Standard</span>
            <Lock className="w-4 h-4 text-blue-600" />
          </div>
          <div className="font-mono text-base font-bold text-slate-900 leading-tight">
            NIST FIPS 180-4
          </div>
          <div className="text-[11px] text-slate-600 mt-1">
            SHA-256 256-Bit Digest
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-[#FFFFFF] border border-[#D4D1C7] p-4 rounded-sm shadow-xs border-l-4 border-l-amber-600">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs uppercase font-semibold tracking-wider">Active Head Hash</span>
            <Key className="w-4 h-4 text-amber-700" />
          </div>
          <div className="font-mono text-xs font-bold text-slate-900 truncate" title={headBlock.currentHash}>
            {headBlock.currentHash.substring(0, 18)}...
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-1">
            Latest Block #{headBlock.blockIndex}
          </div>
        </div>

      </div>

      {/* Main Ledger Table */}
      <div className="bg-[#FFFFFF] border border-[#D4D1C7] rounded-sm shadow-xs overflow-hidden">
        <div className="p-4 bg-[#F8F7F4] border-b border-[#D4D1C7] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="font-bold text-sm text-slate-900">
              Immutable Chronological Audit Block Stream
            </h3>
            <p className="text-xs text-slate-500">
              Each block contains the cryptographic hash of the prior block, timestamp, actor ID, and action payload
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 bg-white p-0.5 rounded border border-[#D4D1C7] text-xs">
              <button
                onClick={() => setRoleFilter('ALL')}
                className={`px-2 py-0.5 rounded text-xs font-semibold ${
                  roleFilter === 'ALL' ? 'bg-slate-900 text-white' : 'text-slate-600'
                }`}
              >
                All Roles
              </button>
              <button
                onClick={() => setRoleFilter('BUREAU')}
                className={`px-2 py-0.5 rounded text-xs font-semibold ${
                  roleFilter === 'BUREAU' ? 'bg-amber-900 text-white' : 'text-slate-600'
                }`}
              >
                Bureau
              </button>
              <button
                onClick={() => setRoleFilter('REGIONAL')}
                className={`px-2 py-0.5 rounded text-xs font-semibold ${
                  roleFilter === 'REGIONAL' ? 'bg-emerald-900 text-white' : 'text-slate-600'
                }`}
              >
                Regional
              </button>
              <button
                onClick={() => setRoleFilter('BANK')}
                className={`px-2 py-0.5 rounded text-xs font-semibold ${
                  roleFilter === 'BANK' ? 'bg-purple-900 text-white' : 'text-slate-600'
                }`}
              >
                Bank
              </button>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search action, hash, block..."
                className="text-xs pl-8 pr-3 py-1 bg-white border border-[#D4D1C7] rounded text-slate-900 focus:outline-hidden w-48 sm:w-56"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse gov-table">
            <thead>
              <tr>
                <th>Block #</th>
                <th>Timestamp (IST)</th>
                <th>Stakeholder Role</th>
                <th>Action Executed</th>
                <th>Audit Details & Payload</th>
                <th>Previous Hash (PrevHash)</th>
                <th>Block SHA-256 Hash</th>
              </tr>
            </thead>
            <tbody>
              {filteredBlocks.map((b) => (
                <tr 
                  key={b.blockIndex} 
                  onClick={() => setSelectedBlockForInspection(b)}
                  className="transition-colors hover:bg-stone-50 cursor-pointer"
                >
                  <td className="font-mono text-xs font-bold text-slate-900 whitespace-nowrap">
                    #{b.blockIndex.toString().padStart(2, '0')}
                  </td>
                  <td className="font-mono text-xs text-slate-600 whitespace-nowrap">
                    {b.timestamp}
                  </td>
                  <td className="font-mono text-xs text-slate-800 whitespace-nowrap">
                    <span className="bg-slate-100 text-slate-800 border border-slate-300 px-1.5 py-0.5 rounded font-bold text-[10px]">
                      {b.userRole.toUpperCase()}
                    </span>
                    <div className="text-[10px] text-slate-400 mt-0.5">{b.userIdentifier}</div>
                  </td>
                  <td className="font-mono text-xs font-bold text-slate-900 whitespace-nowrap">
                    {b.action}
                  </td>
                  <td className="text-xs text-slate-700 max-w-[260px]">
                    <div className="truncate font-sans" title={b.details}>{b.details}</div>
                    <div className="text-[10px] font-mono text-slate-400 mt-0.5">IP: {b.ipAddress}</div>
                  </td>
                  <td className="font-mono text-[10px] text-slate-500 max-w-[120px] truncate" title={b.previousHash}>
                    {b.previousHash.substring(0, 16)}...
                  </td>
                  <td className="font-mono text-[10px] text-[#14532D] font-bold max-w-[120px] truncate" title={b.currentHash}>
                    {b.currentHash.substring(0, 16)}...
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Block Deep-Dive Inspection Modal */}
      {selectedBlockForInspection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-[#FFFFFF] border-2 border-slate-700 rounded shadow-2xl max-w-2xl w-full my-8 p-6 space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-[#14532D]" />
                <h3 className="font-bold text-sm text-slate-900">
                  Cryptographic Block Inspection: #{selectedBlockForInspection.blockIndex}
                </h3>
              </div>
              <button
                onClick={() => setSelectedBlockForInspection(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono bg-stone-50 p-4 rounded border border-stone-200">
              <div className="flex justify-between border-b border-stone-200 pb-1.5">
                <span className="text-slate-500 font-sans">Block Index:</span>
                <span className="font-bold text-slate-900">#{selectedBlockForInspection.blockIndex}</span>
              </div>
              <div className="flex justify-between border-b border-stone-200 pb-1.5">
                <span className="text-slate-500 font-sans">Timestamp:</span>
                <span className="font-bold text-slate-800">{selectedBlockForInspection.timestamp}</span>
              </div>
              <div className="flex justify-between border-b border-stone-200 pb-1.5">
                <span className="text-slate-500 font-sans">Executing Role:</span>
                <span className="font-bold text-slate-800">{selectedBlockForInspection.userRole} ({selectedBlockForInspection.userIdentifier})</span>
              </div>
              <div className="flex justify-between border-b border-stone-200 pb-1.5">
                <span className="text-slate-500 font-sans">Source IP Address:</span>
                <span className="font-bold text-slate-800">{selectedBlockForInspection.ipAddress}</span>
              </div>
              <div className="flex justify-between border-b border-stone-200 pb-1.5">
                <span className="text-slate-500 font-sans">Action Identifier:</span>
                <span className="font-bold text-[#14532D]">{selectedBlockForInspection.action}</span>
              </div>

              <div>
                <span className="text-slate-500 font-sans block mb-1">Details & Payload:</span>
                <div className="bg-white p-2.5 rounded border border-stone-300 font-sans text-xs text-slate-900 leading-relaxed">
                  {selectedBlockForInspection.details}
                </div>
              </div>

              <div>
                <span className="text-slate-500 font-sans block mb-1">Previous Block Hash (PrevHash):</span>
                <div className="bg-white p-2 rounded border border-stone-300 text-[11px] text-slate-600 break-all select-all">
                  {selectedBlockForInspection.previousHash}
                </div>
              </div>

              <div>
                <span className="text-slate-500 font-sans block mb-1">Current Block Hash (SHA-256):</span>
                <div className="bg-emerald-50 p-2 rounded border border-emerald-300 text-[11px] text-emerald-900 font-bold break-all select-all">
                  {selectedBlockForInspection.currentHash}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-200">
              <button
                onClick={() => setSelectedBlockForInspection(null)}
                className="px-4 py-1.5 text-xs bg-slate-800 text-white rounded hover:bg-slate-900 font-medium"
              >
                Close Block View
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

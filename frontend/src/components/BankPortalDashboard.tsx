import React, { useState } from 'react';
import { Landmark, RefreshCw, CheckCircle2, AlertTriangle, ShieldCheck, Send } from 'lucide-react';
import { PillNavigation, TabItem } from './PillNavigation';
import { api } from '../services/api';

export const BankPortalDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('cbs');
  const [fdrNumber, setFdrNumber] = useState<string>('SBI-2023-881920');
  const [syncing, setSyncing] = useState<boolean>(false);
  const [handshakeResult, setHandshakeResult] = useState<any>(null);

  const tabs: TabItem[] = [
    { id: 'cbs', label: 'CBS Sync Engine', badge: 'Online' },
    { id: 'sfms', label: 'SFMS MT760 Gateway', badge: 'Swift Sync' },
    { id: 'encumbrance', label: 'Encumbrance Scanner', badge: 'Anti-Overdraft' },
    { id: 'audit', label: 'Audit Trail', badge: 'NIST SHA-256' }
  ];

  const handleCbsSync = async () => {
    setSyncing(true);
    const res = await api.triggerBankCbsHandshake(fdrNumber, 'SBI');
    setHandshakeResult(res);
    setSyncing(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-purple-500/30 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/40 flex items-center justify-center">
            <Landmark className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
              Bank Core Banking System (CBS) Sync Gateway
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30">
                SCHEDULED COMMERCIAL BANK
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              State Bank of India (Treasury & Sovereign Institutional Deposits Branch)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
            CBS INTERFACE: <strong className="text-white">API REST + SFMS MT760</strong>
          </span>
        </div>
      </div>

      {/* Pill Navigation */}
      <PillNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        accentColor="purple"
      />

      {/* Tab 1: CBS Sync Engine */}
      {activeTab === 'cbs' && (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-purple-400" />
              Automated Core Banking System Handshake
            </h3>
            <span className="text-xs font-mono text-slate-400">Direct Core Database Verification</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <input
              type="text"
              value={fdrNumber}
              onChange={(e) => setFdrNumber(e.target.value)}
              placeholder="Enter FDR Instrument Number..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:border-purple-500 focus:outline-none"
            />
            <button
              onClick={handleCbsSync}
              disabled={syncing}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold font-mono transition-all duration-300 shadow-lg shadow-purple-600/30"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
              <span>{syncing ? 'CONNECTING TO CORE CBS...' : 'TRIGGER CBS HANDSHAKE'}</span>
            </button>
          </div>

          {handshakeResult && (
            <div className="p-5 rounded-xl bg-slate-950 border border-purple-500/40 font-mono text-xs space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold mb-2">
                <CheckCircle2 className="w-4 h-4" />
                CBS CORE HANDSHAKE SUCCESSFUL
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-slate-300">
                <div>CBS Reference: <span className="text-white">{handshakeResult.cbsReferenceNumber}</span></div>
                <div>Handshake Time: <span className="text-white">{handshakeResult.handshakeTimestamp}</span></div>
                <div>AICTE Lien Flag: <span className="text-emerald-400 font-bold">{handshakeResult.lienRegisteredWithAicte ? 'LOCKED IN FAVOR OF AICTE' : 'NOT MARKED'}</span></div>
                <div>Encumbrance Flag: <span className="text-slate-300">{handshakeResult.activeEncumbrances ? 'BREACH DETECTED' : 'ZERO ENCUMBRANCE'}</span></div>
              </div>
              <p className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-2 mt-2">
                {handshakeResult.remarks}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: SFMS MT760 Gateway */}
      {activeTab === 'sfms' && (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
            <Landmark className="w-5 h-5 text-purple-400" />
            Structured Financial Messaging System (SFMS) MT760 Protocol
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Bank sends structured SWIFT/SFMS MT760 messages directly to AICTE KOSH-Rakshak, locking the deposit irrevocably until a cryptographically signed discharge order is received.
          </p>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Protocol:</span>
              <span className="text-purple-400 font-bold">RBI SFMS MT760 SECURE LIEN</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Gateway Status:</span>
              <span className="text-emerald-400 font-bold">ACTIVE & SYNCED</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Encumbrance Scanner */}
      {activeTab === 'encumbrance' && (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            Negative Lien & Secret Overdraft Detector
          </h3>
          <p className="text-xs text-slate-300">
            Real-time audit scanner that alerts AICTE if any bank branch issues loans, overdrafts, or bank guarantees against educational corpus deposits.
          </p>

          <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 flex items-center justify-between">
            <div className="text-xs font-mono">
              <div className="text-white font-bold">Bank of Baroda (Hazratganj) Alert:</div>
              <div className="text-amber-400">Overdraft loan of ₹22,00,000 against FDR #BOB-2021-992318</div>
            </div>
            <span className="px-2.5 py-1 rounded bg-red-500/10 text-red-400 font-mono text-[10px] font-bold border border-red-500/30">
              BREACH FLAGGED
            </span>
          </div>
        </div>
      )}

      {/* Tab 4: Audit Trail */}
      {activeTab === 'audit' && (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            Banking Core Immutable Ledger Audit Trail
          </h3>
          <p className="text-xs text-slate-300">
            All banking handshake queries and SFMS lien status changes are cryptographically sealed.
          </p>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-400">
            All queries cryptographically hashed into NIST FIPS 180-4 SHA-256 blocks with millisecond timestamps.
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { UserRole } from '../types';
import { NationalEmblem } from './NationalEmblem';
import { 
  Shield, 
  Building2, 
  UserCheck, 
  Landmark, 
  Lock, 
  KeyRound, 
  ArrowRight, 
  CheckCircle2, 
  Award, 
  AlertTriangle,
  RefreshCw,
  FileCheck,
  Zap,
  Globe,
  Scale
} from 'lucide-react';

interface OfficialGovLoginGatewayProps {
  onLogin: (role: UserRole) => void;
  onEnterAsDemo?: (demoNumber: number) => void;
}

export const OfficialGovLoginGateway: React.FC<OfficialGovLoginGatewayProps> = ({
  onLogin,
  onEnterAsDemo,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('regional');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authSuccessMsg, setAuthSuccessMsg] = useState<string | null>(null);

  // Form states
  const [collegeId, setCollegeId] = useState('1-482910411');
  const [collegePassword, setCollegePassword] = useState('ApexSecure@2026');
  const [aisheCode, setAisheCode] = useState('C-38291');
  const [collegeCaptcha, setCollegeCaptcha] = useState('7K9M2');

  const [regionalId, setRegionalId] = useState('arun.verma.sro@nic.in');
  const [regionalTokenPin, setRegionalTokenPin] = useState('NIC#Token9912');
  const [regionalCamp, setRegionalCamp] = useState('SRO Chennai & NRO Kanpur (Regional Camp Desks)');

  const [bureauId, setBureauId] = useState('head.regulation@aicte-india.org');
  const [bureauPin, setBureauPin] = useState('BureauHead#9041');
  const [bureauOtp, setBureauOtp] = useState('849201');

  const [bankId, setBankId] = useState('cbs.compliance.sbi@sbi.co.in');
  const [bankIfscKey, setBankIfscKey] = useState('SBIN0001055');
  const [sfmsKey, setSfmsKey] = useState('SFMS#Host9921');

  // Trigger login simulation
  const handleAuthenticate = (roleToLogin: UserRole) => {
    setIsAuthenticating(true);
    setAuthSuccessMsg(null);
    setTimeout(() => {
      setIsAuthenticating(false);
      setAuthSuccessMsg(`✓ Authentication Successful. Granting role-scoped access for ${roleToLogin.toUpperCase()}...`);
      setTimeout(() => {
        onLogin(roleToLogin);
      }, 400);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#F5F4F0] text-[#1E293B] flex flex-col justify-between font-sans selection:bg-amber-100 selection:text-amber-900">
      
      {/* 1. Official Government Header Strip */}
      <header className="border-b border-[#D4D1C7] bg-[#FFFFFF] shadow-xs">
        {/* Top 3px Tricolor Strip */}
        <div className="h-[3px] w-full flex">
          <div className="w-1/3 bg-[#D97706]" />
          <div className="w-1/3 bg-[#FFFFFF]" />
          <div className="w-1/3 bg-[#15803D]" />
        </div>

        {/* Official Gov Header Content */}
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-3.5">
            {/* Authentic State Emblem of India (Ashoka Lion Capital with Satyameva Jayate) */}
            <div className="shrink-0 flex items-center justify-center py-0.5">
              <NationalEmblem className="w-12 h-16 drop-shadow-2xs" theme="dark" />
            </div>

            <div className="border-l-2 border-[#D4D1C7] pl-3.5 space-y-0.5">
              <div className="text-[10.5px] uppercase font-bold tracking-wider text-[#D97706] flex flex-wrap items-center gap-1.5 leading-none">
                <span>GOVERNMENT OF INDIA</span>
                <span className="text-slate-300 font-normal">|</span>
                <span>MINISTRY OF EDUCATION</span>
              </div>
              <h1 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                All India Council for Technical Education
              </h1>
              <div className="text-xs text-slate-600 flex flex-wrap items-center gap-1.5 leading-tight">
                <span className="font-bold text-slate-900">AICTE KOSH-Rakshak</span>
                <span className="text-slate-400">—</span>
                <span>National Security Deposit & FDR Regulatory Lifecycle Portal</span>
                <span className="bg-[#14532D] text-white text-[9.5px] font-mono font-bold px-1.5 py-0.2 rounded shadow-2xs">
                  PS ID: 26265
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="flex items-center gap-1.5 bg-[#F5F4F0] border border-[#D4D1C7] px-2.5 py-1.5 rounded-sm text-slate-800 font-mono text-[11px] shadow-2xs">
              <Lock className="w-3.5 h-3.5 text-emerald-700" />
              <span className="font-semibold">NIC Parichay SSO Enabled</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#F5F4F0] border border-[#D4D1C7] px-2.5 py-1.5 rounded-sm text-slate-800 font-mono text-[11px] shadow-2xs">
              <Award className="w-3.5 h-3.5 text-amber-700" />
              <span className="font-semibold">APH 2026-27 Normative Schedule</span>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Main Portal Gateway & Role Login Container */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 w-full flex-1 flex flex-col justify-center">
        
        {authSuccessMsg && (
          <div className="mb-4 p-3 bg-emerald-50 border-2 border-emerald-600 rounded text-xs text-emerald-950 font-bold font-mono flex items-center gap-2 shadow-xs animate-pulse">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{authSuccessMsg}</span>
          </div>
        )}

        <div className="max-w-2xl mx-auto w-full my-4">
          
          {/* Centered Enterprise GovTech Login Gateway */}
          <div className="bg-[#FFFFFF] border-2 border-[#D4D1C7] rounded-sm shadow-lg flex flex-col justify-between overflow-hidden">
            
            {/* Gateway Role Selector Header Tabs */}
            <div>
              <div className="bg-[#F8F7F4] border-b border-[#D4D1C7] p-3 flex items-center justify-between">
                <div>
                  <span className="text-[11px] uppercase font-bold tracking-wider text-slate-700">
                    Official Portal Authentication Desk
                  </span>
                  <div className="text-[11px] text-slate-500">
                    Select your authorized stakeholder persona to proceed
                  </div>
                </div>
                <span className="text-[10px] bg-slate-200 text-slate-800 px-2 py-0.5 rounded font-mono font-bold">
                  STRICT RBAC
                </span>
              </div>

              {/* 4 Persona Select Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-[#D4D1C7] bg-[#F5F4F0] text-xs font-semibold">
                
                {/* 1. College */}
                <button
                  onClick={() => setSelectedRole('college')}
                  className={`p-3 text-left border-r border-[#D4D1C7] transition-colors flex flex-col justify-between ${
                    selectedRole === 'college'
                      ? 'bg-white text-blue-900 border-b-2 border-b-blue-900 font-bold shadow-xs'
                      : 'text-slate-600 hover:bg-stone-200'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <Building2 className="w-3.5 h-3.5 text-blue-700" />
                    <span className="text-[10px] uppercase font-mono">Role 1</span>
                  </div>
                  <div className="leading-tight text-xs font-bold truncate">College Nodal</div>
                  <div className="text-[10px] text-slate-500 truncate mt-0.5">Institution Portal</div>
                </button>

                {/* 2. Regional */}
                <button
                  onClick={() => setSelectedRole('regional')}
                  className={`p-3 text-left border-r border-[#D4D1C7] transition-colors flex flex-col justify-between ${
                    selectedRole === 'regional'
                      ? 'bg-white text-emerald-900 border-b-2 border-b-emerald-900 font-bold shadow-xs'
                      : 'text-slate-600 hover:bg-stone-200'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
                    <span className="text-[10px] uppercase font-mono">Role 2</span>
                  </div>
                  <div className="leading-tight text-xs font-bold truncate">Regional Scrutiny</div>
                  <div className="text-[10px] text-slate-500 truncate mt-0.5">SRO / NRO Desk</div>
                </button>

                {/* 3. Bureau Head */}
                <button
                  onClick={() => setSelectedRole('bureau')}
                  className={`p-3 text-left border-r border-[#D4D1C7] transition-colors flex flex-col justify-between ${
                    selectedRole === 'bureau'
                      ? 'bg-white text-amber-900 border-b-2 border-b-amber-900 font-bold shadow-xs'
                      : 'text-slate-600 hover:bg-stone-200'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <Shield className="w-3.5 h-3.5 text-amber-700" />
                    <span className="text-[10px] uppercase font-mono">Role 3</span>
                  </div>
                  <div className="leading-tight text-xs font-bold truncate">Bureau Head</div>
                  <div className="text-[10px] text-slate-500 truncate mt-0.5">HQ Super Admin</div>
                </button>

                {/* 4. Bank */}
                <button
                  onClick={() => setSelectedRole('bank')}
                  className={`p-3 text-left transition-colors flex flex-col justify-between ${
                    selectedRole === 'bank'
                      ? 'bg-white text-purple-900 border-b-2 border-b-purple-900 font-bold shadow-xs'
                      : 'text-slate-600 hover:bg-stone-200'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <Landmark className="w-3.5 h-3.5 text-purple-700" />
                    <span className="text-[10px] uppercase font-mono">Role 4</span>
                  </div>
                  <div className="leading-tight text-xs font-bold truncate">Issuing Bank</div>
                  <div className="text-[10px] text-slate-500 truncate mt-0.5">CBS / SFMS Node</div>
                </button>

              </div>

              {/* Dynamic Credential Forms Per Stakeholder */}
              <div className="p-6">
                
                {/* 1. College Form */}
                {selectedRole === 'college' && (
                  <form onSubmit={(e) => { e.preventDefault(); handleAuthenticate('college'); }} className="space-y-4">
                    <div className="p-3 bg-blue-50/80 border border-blue-200 rounded text-xs text-blue-950 flex items-start gap-2">
                      <Building2 className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                      <div>
                        <strong>Institution Nodal Officer Login:</strong> Scoped strictly to your college repository (Apex Institute of Technology, Meerut). Nationwide metrics and regional scrutiny notes are completely hidden.
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">AICTE Permanent Institution ID</label>
                        <input
                          type="text"
                          value={collegeId}
                          onChange={(e) => setCollegeId(e.target.value)}
                          className="w-full font-mono bg-stone-50 border border-[#D4D1C7] rounded px-3 py-2 text-slate-900 focus:outline-hidden focus:border-blue-900"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">AISHE Institutional Code</label>
                        <input
                          type="text"
                          value={aisheCode}
                          onChange={(e) => setAisheCode(e.target.value)}
                          className="w-full font-mono bg-stone-50 border border-[#D4D1C7] rounded px-3 py-2 text-slate-900 focus:outline-hidden focus:border-blue-900"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">Institutional Portal Password</label>
                        <input
                          type="password"
                          value={collegePassword}
                          onChange={(e) => setCollegePassword(e.target.value)}
                          className="w-full font-mono bg-stone-50 border border-[#D4D1C7] rounded px-3 py-2 text-slate-900 focus:outline-hidden focus:border-blue-900"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">Security Captcha</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={collegeCaptcha}
                            onChange={(e) => setCollegeCaptcha(e.target.value)}
                            className="w-full font-mono font-bold bg-stone-50 border border-[#D4D1C7] rounded px-3 py-2 text-slate-900 focus:outline-hidden"
                          />
                          <span className="px-3 py-2 bg-stone-200 text-slate-800 font-mono font-black rounded border border-stone-300 tracking-widest select-none">
                            7K9M2
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isAuthenticating}
                      className="w-full py-2.5 bg-blue-900 hover:bg-blue-950 text-white rounded font-bold text-xs shadow flex items-center justify-center gap-2 transition-colors"
                    >
                      {isAuthenticating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                      <span>{isAuthenticating ? 'Authenticating with AICTE Gateway...' : 'Authenticate & Enter College Portal →'}</span>
                    </button>
                  </form>
                )}

                {/* 2. Regional Form */}
                {selectedRole === 'regional' && (
                  <form onSubmit={(e) => { e.preventDefault(); handleAuthenticate('regional'); }} className="space-y-4">
                    <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded text-xs text-emerald-950 flex items-start gap-2">
                      <UserCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                      <div>
                        <strong>Regional Scrutiny Authority Login:</strong> Scoped to institutions within SRO Chennai and NRO Kanpur jurisdictions. Full 6-Layer Forensic Engine & e-Office Green Sheet sign-off enabled.
                      </div>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">NIC Parichay SSO Username / Official Email</label>
                        <input
                          type="email"
                          value={regionalId}
                          onChange={(e) => setRegionalId(e.target.value)}
                          className="w-full font-mono bg-stone-50 border border-[#D4D1C7] rounded px-3 py-2 text-slate-900 focus:outline-hidden focus:border-emerald-900"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-700 font-semibold mb-1">NIC Digital Token Security PIN</label>
                          <input
                            type="password"
                            value={regionalTokenPin}
                            onChange={(e) => setRegionalTokenPin(e.target.value)}
                            className="w-full font-mono bg-stone-50 border border-[#D4D1C7] rounded px-3 py-2 text-slate-900 focus:outline-hidden focus:border-emerald-900"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-700 font-semibold mb-1">Assigned Regional Jurisdiction</label>
                          <input
                            type="text"
                            value={regionalCamp}
                            readOnly
                            className="w-full font-sans text-xs bg-stone-100 border border-stone-300 rounded px-3 py-2 text-slate-700 cursor-not-allowed"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isAuthenticating}
                      className="w-full py-2.5 bg-[#14532D] hover:bg-[#15803D] text-white rounded font-bold text-xs shadow flex items-center justify-center gap-2 transition-colors"
                    >
                      {isAuthenticating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                      <span>{isAuthenticating ? 'Validating NIC Parichay Token...' : 'Authenticate & Enter Regional Scrutiny Desk →'}</span>
                    </button>
                  </form>
                )}

                {/* 3. Bureau Head Form */}
                {selectedRole === 'bureau' && (
                  <form onSubmit={(e) => { e.preventDefault(); handleAuthenticate('bureau'); }} className="space-y-4">
                    <div className="p-3 bg-amber-50/80 border border-amber-200 rounded text-xs text-amber-950 flex items-start gap-2">
                      <Shield className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <strong>AICTE Regulation Bureau Head (Super Admin):</strong> Nationwide command access across all regions with authority to execute instant nationwide EoA freezes, inspect the master cryptographic audit ledger, and sanction 5th-Gate releases.
                      </div>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">Competent Authority SSO Identifier</label>
                        <input
                          type="email"
                          value={bureauId}
                          onChange={(e) => setBureauId(e.target.value)}
                          className="w-full font-mono bg-stone-50 border border-[#D4D1C7] rounded px-3 py-2 text-slate-900 focus:outline-hidden focus:border-amber-900"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-700 font-semibold mb-1">Bureau Head Digital e-Sign PIN</label>
                          <input
                            type="password"
                            value={bureauPin}
                            onChange={(e) => setBureauPin(e.target.value)}
                            className="w-full font-mono bg-stone-50 border border-[#D4D1C7] rounded px-3 py-2 text-slate-900 focus:outline-hidden focus:border-amber-900"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-700 font-semibold mb-1">Two-Factor Authenticator (2FA OTP)</label>
                          <input
                            type="text"
                            value={bureauOtp}
                            onChange={(e) => setBureauOtp(e.target.value)}
                            className="w-full font-mono font-bold tracking-widest bg-stone-50 border border-[#D4D1C7] rounded px-3 py-2 text-slate-900 focus:outline-hidden"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isAuthenticating}
                      className="w-full py-2.5 bg-amber-900 hover:bg-amber-950 text-white rounded font-bold text-xs shadow flex items-center justify-center gap-2 transition-colors"
                    >
                      {isAuthenticating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                      <span>{isAuthenticating ? 'Sanctioning Super Admin Access...' : 'Authenticate & Enter Nationwide Command Center →'}</span>
                    </button>
                  </form>
                )}

                {/* 4. Bank Form */}
                {selectedRole === 'bank' && (
                  <form onSubmit={(e) => { e.preventDefault(); handleAuthenticate('bank'); }} className="space-y-4">
                    <div className="p-3 bg-purple-50/80 border border-purple-200 rounded text-xs text-purple-950 flex items-start gap-2">
                      <Landmark className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                      <div>
                        <strong>Scheduled Commercial Bank Node (CBS / SFMS):</strong> Authorized to verify deposit authenticity in Core Banking (Finacle/BaNCS), confirm AICTE lien markings, and flag secret overdraft loans.
                      </div>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">Bank CBS Compliance Officer ID</label>
                        <input
                          type="email"
                          value={bankId}
                          onChange={(e) => setBankId(e.target.value)}
                          className="w-full font-mono bg-stone-50 border border-[#D4D1C7] rounded px-3 py-2 text-slate-900 focus:outline-hidden focus:border-purple-900"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-700 font-semibold mb-1">Core Banking Node IFSC Key</label>
                          <input
                            type="text"
                            value={bankIfscKey}
                            onChange={(e) => setBankIfscKey(e.target.value)}
                            className="w-full font-mono bg-stone-50 border border-[#D4D1C7] rounded px-3 py-2 text-slate-900 focus:outline-hidden"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-700 font-semibold mb-1">SFMS Host Security Key</label>
                          <input
                            type="password"
                            value={sfmsKey}
                            onChange={(e) => setSfmsKey(e.target.value)}
                            className="w-full font-mono bg-stone-50 border border-[#D4D1C7] rounded px-3 py-2 text-slate-900 focus:outline-hidden"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isAuthenticating}
                      className="w-full py-2.5 bg-purple-900 hover:bg-purple-950 text-white rounded font-bold text-xs shadow flex items-center justify-center gap-2 transition-colors"
                    >
                      {isAuthenticating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Landmark className="w-4 h-4" />}
                      <span>{isAuthenticating ? 'Connecting to Core Banking Host...' : 'Authenticate & Enter Bank CBS Node →'}</span>
                    </button>
                  </form>
                )}

              </div>
            </div>

            {/* Subtle Quick Demo Fill & Enter Bar (Mandated for evaluator convenience) */}
            <div className="bg-[#F8F7F4] border-t border-[#D4D1C7] p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-[11px] font-mono text-slate-500">
                Live Evaluator Presentation Shortcut:
              </span>

              <button
                type="button"
                onClick={() => handleAuthenticate(selectedRole)}
                className="px-3 py-1.5 bg-white border border-[#D4D1C7] hover:bg-stone-100 rounded text-xs font-bold text-slate-800 flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
                <span>[Quick Demo Fill & Enter as {selectedRole.toUpperCase()}]</span>
              </button>
            </div>

          </div>

        </div>

      </main>

      {/* 3. Official NIC Government Footer */}
      <footer className="border-t border-[#D4D1C7] bg-[#16202A] text-slate-400 text-xs py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div>
            <div className="text-slate-300 font-semibold">
              All India Council for Technical Education (AICTE), New Delhi
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Designed, Developed and Hosted by National Informatics Centre (NIC) • Government of India
            </div>
          </div>

          <div className="text-[11px] font-mono text-slate-400">
            Portal Version: 2.6.4-GOV • System Clock: 26-Oct-2026 IST • 256-Bit Cryptographic Ledger
          </div>
        </div>
      </footer>

    </div>
  );
};

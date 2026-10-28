import React, { useState, useEffect } from 'react';
import { UserRole } from '../types';
import { NationalEmblem } from './NationalEmblem';
import { Shield, Clock, Award, ChevronDown, UserCheck, LogOut, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onOpenLoginModal: () => void;
  onLogout?: () => void;
  simulatedDate: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  onOpenLoginModal,
  onLogout,
  simulatedDate,
}) => {
  const [istTime, setIstTime] = useState<string>('');
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      };
      setIstTime(new Intl.DateTimeFormat('en-IN', options).format(now));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const getRoleDetails = (role: UserRole) => {
    if (role === 'college' || role === 'INSTITUTION_NODAL') {
      return {
        title: 'Institution Nodal Officer',
        subtitle: 'Apex Inst. of Tech (ID: 1-482910411)',
        badge: 'College Portal',
        color: 'bg-blue-900 text-blue-100 border-blue-700',
      };
    }
    if (role === 'regional' || role === 'REGIONAL_OFFICER') {
      return {
        title: 'Regional Scrutiny Officer',
        subtitle: 'AICTE SRO / NRO (NIC Parichay)',
        badge: 'Regional Desk',
        color: 'bg-emerald-900 text-emerald-100 border-emerald-700',
      };
    }
    if (role === 'bureau' || role === 'BUREAU_HEAD') {
      return {
        title: 'Regulation Bureau Head',
        subtitle: 'AICTE HQ New Delhi (Super Admin)',
        badge: 'Nationwide Authority',
        color: 'bg-amber-900 text-amber-100 border-amber-700',
      };
    }
    if (role === 'bank' || role === 'BANK_NODE') {
      return {
        title: 'Issuing Bank Node',
        subtitle: 'Bank CBS / SFMS Compliance Desk',
        badge: 'Bank CBS Desk',
        color: 'bg-purple-900 text-purple-100 border-purple-700',
      };
    }
    return {
      title: 'Regulation Bureau Head',
      subtitle: 'AICTE HQ New Delhi',
      badge: 'Authority',
      color: 'bg-slate-800 text-white border-slate-700',
    };
  };

  const currentRoleInfo = getRoleDetails(currentRole);

  return (
    <header className="sticky top-0 z-50 shadow-md">
      {/* 3px Top Tricolor Accent Strip */}
      <div className="h-[3px] w-full flex">
        <div className="w-1/3 bg-[#D97706]" />
        <div className="w-1/3 bg-[#FFFFFF]" />
        <div className="w-1/3 bg-[#15803D]" />
      </div>

      {/* Main GovTech Header Banner */}
      <div className="bg-[#16202A] text-white px-4 py-2.5 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          
          {/* Left: Official Emblem & Portal Title */}
          <div className="flex items-center gap-3.5">
            {/* Authentic National Emblem of India (Ashoka Lion Capital with Satyameva Jayate) */}
            <div className="flex items-center gap-2.5">
              <div className="w-11 h-14 bg-white/95 rounded-xs border border-amber-500/40 flex items-center justify-center p-1 shadow-xs shrink-0">
                <NationalEmblem className="w-9 h-12" theme="dark" />
              </div>
              <div className="border-l border-slate-700 pl-3 py-0.5 space-y-0.5">
                <div className="text-[10px] tracking-wider uppercase font-semibold text-amber-400 flex flex-wrap items-center gap-1.5 leading-none">
                  <span>GOVERNMENT OF INDIA</span>
                  <span className="text-slate-500">•</span>
                  <span>MINISTRY OF EDUCATION</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base sm:text-lg tracking-tight text-white leading-tight">
                    AICTE KOSH-Rakshak
                  </span>
                  <span className="text-[10px] bg-[#14532D] text-emerald-200 px-1.5 py-0.5 rounded font-mono font-medium border border-emerald-500/40">
                    PS-26265
                  </span>
                </div>
                <div className="text-[11px] text-slate-300 hidden sm:block leading-tight">
                  All India Council for Technical Education • Integrated Security Deposit & FDR Lifecycle Portal
                </div>
              </div>
            </div>
          </div>

          {/* Right: Regulatory Badges, Clock, Role Switcher */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs">
            
            {/* Regulatory Framework Badge */}
            <div className="flex items-center gap-1.5 bg-slate-800/90 border border-slate-700 px-2.5 py-1.5 rounded-sm text-slate-200">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-medium">Mandate:</span>
              <span className="font-mono text-amber-300 font-semibold">APH 2026-27</span>
            </div>

            {/* Live IST Clock & Date */}
            <div className="flex items-center gap-1.5 bg-slate-800/90 border border-slate-700 px-2.5 py-1.5 rounded-sm font-mono text-slate-200">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>{simulatedDate}</span>
              <span className="text-slate-500">|</span>
              <span className="text-emerald-400 font-semibold">{istTime || '17:50:46'} IST</span>
            </div>

            {/* 1-Click Instant Persona Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-sm border font-medium transition-all ${currentRoleInfo.color}`}
                title="Switch Stakeholder Role"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <div className="text-left leading-tight">
                  <div className="font-bold flex items-center gap-1">
                    <span>{currentRoleInfo.title}</span>
                    <span className="text-[9px] uppercase px-1 py-0.2 rounded bg-white/20">
                      {currentRoleInfo.badge}
                    </span>
                  </div>
                  <div className="text-[10px] opacity-80 max-w-[150px] truncate">
                    {currentRoleInfo.subtitle}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 ml-1 opacity-70" />
              </button>

              {roleMenuOpen && (
                <div className="absolute right-0 mt-1.5 w-72 bg-[#FFFFFF] text-[#1E293B] border border-[#D4D1C7] rounded shadow-xl py-1 z-50">
                  <div className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider text-slate-500 border-b border-slate-200 bg-slate-50">
                    Switch Stakeholder Role (Instant Demo)
                  </div>
                  
                  <button
                    onClick={() => { onRoleChange('college'); setRoleMenuOpen(false); }}
                    className={`w-full px-3 py-2 text-left flex items-start gap-2 hover:bg-slate-100 transition-colors border-b border-slate-100 ${(currentRole === 'college' || currentRole === 'INSTITUTION_NODAL') ? 'bg-blue-50 font-semibold' : ''}`}
                  >
                    <div className="mt-0.5 w-2 h-2 rounded-full bg-blue-600" />
                    <div>
                      <div className="font-bold text-xs text-slate-900">Persona 1: Institution Nodal Officer</div>
                      <div className="text-[11px] text-slate-600">College Portal (Scoped: Apex Inst. ID: 1-482910411)</div>
                    </div>
                  </button>

                  <button
                    onClick={() => { onRoleChange('regional'); setRoleMenuOpen(false); }}
                    className={`w-full px-3 py-2 text-left flex items-start gap-2 hover:bg-slate-100 transition-colors border-b border-slate-100 ${(currentRole === 'regional' || currentRole === 'REGIONAL_OFFICER') ? 'bg-emerald-50 font-semibold' : ''}`}
                  >
                    <div className="mt-0.5 w-2 h-2 rounded-full bg-emerald-600" />
                    <div>
                      <div className="font-bold text-xs text-slate-900">Persona 2: Regional Scrutiny Officer</div>
                      <div className="text-[11px] text-slate-600">SRO / NRO (6-Layer AI, CBS Handshake, Green Sheet)</div>
                    </div>
                  </button>

                  <button
                    onClick={() => { onRoleChange('bureau'); setRoleMenuOpen(false); }}
                    className={`w-full px-3 py-2 text-left flex items-start gap-2 hover:bg-slate-100 transition-colors border-b border-slate-100 ${(currentRole === 'bureau' || currentRole === 'BUREAU_HEAD') ? 'bg-amber-50 font-semibold' : ''}`}
                  >
                    <div className="mt-0.5 w-2 h-2 rounded-full bg-amber-600" />
                    <div>
                      <div className="font-bold text-xs text-slate-900">Persona 3: AICTE Regulation Bureau Head</div>
                      <div className="text-[11px] text-slate-600">HQ New Delhi (Nationwide Command, 5th-Gate QR Sanction)</div>
                    </div>
                  </button>

                  <button
                    onClick={() => { onRoleChange('bank'); setRoleMenuOpen(false); }}
                    className={`w-full px-3 py-2 text-left flex items-start gap-2 hover:bg-slate-100 transition-colors ${(currentRole === 'bank' || currentRole === 'BANK_NODE') ? 'bg-purple-50 font-semibold' : ''}`}
                  >
                    <div className="mt-0.5 w-2 h-2 rounded-full bg-purple-600" />
                    <div>
                      <div className="font-bold text-xs text-slate-900">Persona 4: Issuing Bank Node</div>
                      <div className="text-[11px] text-slate-600">CBS Desk (Confirm Lien, Flag Overdraft Loans)</div>
                    </div>
                  </button>

                  {onLogout && (
                    <div className="p-1 border-t border-slate-200 bg-stone-50">
                      <button
                        onClick={() => { setRoleMenuOpen(false); onLogout(); }}
                        className="w-full px-3 py-1.5 text-left text-xs text-slate-700 hover:text-slate-900 hover:bg-stone-200 rounded flex items-center gap-2 font-medium"
                      >
                        <LogOut className="w-3.5 h-3.5 text-amber-700" />
                        <span>Sign Out to Official Gov Gateway</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Gateway Login / Sign Out Button */}
            <button
              onClick={onLogout ? onLogout : onOpenLoginModal}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 transition-colors shadow-xs"
              title="Return to Official Government Gateway Login Screen"
            >
              <LogOut className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline font-semibold">Sign Out / Gov Gateway</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

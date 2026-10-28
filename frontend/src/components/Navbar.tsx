import React from 'react';
import { Shield, Lock, Landmark, FileCheck, Building2 } from 'lucide-react';
import { UserRole } from '../types';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRole, onRoleChange }) => {
  const roles: { id: UserRole; label: string; icon: React.ReactNode; badge: string; color: string }[] = [
    { id: 'COLLEGE', label: 'College Nodal', icon: <Building2 className="w-4 h-4" />, badge: 'Anna Univ / Guindy', color: 'from-amber-600 to-orange-600' },
    { id: 'RO', label: 'Regional Officer', icon: <FileCheck className="w-4 h-4" />, badge: 'SRO Chennai', color: 'from-emerald-600 to-teal-600' },
    { id: 'HQ', label: 'HQ Bureau', icon: <Shield className="w-4 h-4" />, badge: 'New Delhi Apex', color: 'from-blue-600 to-indigo-600' },
    { id: 'BANK', label: 'Bank Official', icon: <Landmark className="w-4 h-4" />, badge: 'SBI CBS Gateway', color: 'from-purple-600 to-violet-600' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand & National Emblem */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-600 to-orange-700 flex items-center justify-center shadow-lg shadow-amber-500/20 border border-amber-400/40">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-white font-mono">
                  AICTE <span className="text-amber-400">KOSH-RAKSHAK</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  APH 2026-27
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                National Multi-Agency Collateral Security & Anti-Fraud Architecture
              </p>
            </div>
          </div>

          {/* Role Switching Segmented Control */}
          <div className="flex items-center bg-slate-950/80 p-1.5 rounded-xl border border-slate-800 shadow-inner">
            {roles.map((r) => {
              const active = currentRole === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => onRoleChange(r.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 ${
                    active
                      ? `bg-gradient-to-r ${r.color} text-white shadow-md shadow-blue-900/40 border border-white/20`
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  {r.icon}
                  <span>{r.label}</span>
                </button>
              );
            })}
          </div>

          {/* Security & Sovereign Session Status */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>SHA-256 LEDGER ACTIVE</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
              <Lock className="w-3.5 h-3.5 text-slate-500" />
              <span>NIC PARICHAY SSO</span>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};

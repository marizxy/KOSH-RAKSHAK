import React from 'react';
import { UserRole } from '../types';
import { NationalEmblem } from './NationalEmblem';
import { Shield, Building2, UserCheck, Landmark, CheckCircle, ArrowRight, X, KeyRound, Lock } from 'lucide-react';

interface LoginGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRole: (role: UserRole) => void;
  currentRole: UserRole;
}

export const LoginGatewayModal: React.FC<LoginGatewayModalProps> = ({
  isOpen,
  onClose,
  onSelectRole,
  currentRole,
}) => {
  if (!isOpen) return null;

  const rolesConfig = [
    {
      role: 'college' as UserRole,
      title: 'Institution Nodal Officer',
      org: 'College Level (Apex Inst. ID: 1-482910411)',
      authMethod: 'AICTE Permanent ID & AISHE Code',
      credentials: 'ID: 1-482910411 | AISHE: C-38291',
      description: 'Scoped portal for College Registrar/Director to view their own FDR corpus, upload newly created FDRs, run OCR pre-checks, track renewals, and submit refund petitions.',
      color: 'border-blue-300 hover:border-blue-600 bg-white hover:bg-blue-50/40',
      icon: Building2,
      badgeText: 'Institutional Scope',
      badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
    },
    {
      role: 'regional' as UserRole,
      title: 'Regional Scrutiny Officer',
      org: 'AICTE Regional Office (SRO / NRO Desk)',
      authMethod: 'NIC Parichay SSO / Official e-Office ID',
      credentials: 'User: ro.sro.chennai@aicte-india.org',
      description: 'Regional jurisdiction view: reviews submitted FDRs, activates 6-Layer AI and Forensic ELA scanner, executes live Bank CBS handshakes, and drafts digitally signed e-Office Green Sheets.',
      color: 'border-emerald-300 hover:border-emerald-600 bg-white hover:bg-emerald-50/40',
      icon: UserCheck,
      badgeText: 'Regional Authority',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    },
    {
      role: 'bureau' as UserRole,
      title: 'Regulation Bureau Head',
      org: 'AICTE Headquarters, New Delhi (Super Admin)',
      authMethod: 'Competent Authority Digital Token',
      credentials: 'User: head.regulation@aicte-india.org',
      description: 'Nationwide command view of total institutional security deposits, multi-tier overdue escalation sanctioning, and 5th-Gate Final Sanction for Release Orders.',
      color: 'border-amber-300 hover:border-amber-600 bg-white hover:bg-amber-50/40',
      icon: Shield,
      badgeText: 'Super Admin',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
    },
    {
      role: 'bank' as UserRole,
      title: 'Authorized Issuing Bank Node',
      org: 'Scheduled Commercial Banks (CBS / SFMS Compliance Desk)',
      authMethod: 'SFMS / CBS API Verification Gateway',
      credentials: 'Desk: sbi.cbs.compliance@sbi.co.in',
      description: 'Bank verification node to validate deposit authenticity in core banking (Finacle/BaNCS), confirm exclusive AICTE lien marking, and flag hidden overdrafts.',
      color: 'border-purple-300 hover:border-purple-600 bg-white hover:bg-purple-50/40',
      icon: Landmark,
      badgeText: 'Banking Node',
      badgeClass: 'bg-purple-100 text-purple-800 border-purple-200',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#F5F4F0] border-2 border-[#D4D1C7] rounded shadow-2xl overflow-hidden my-8">
        
        {/* Top Header */}
        <div className="bg-[#16202A] text-white p-5 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-14 rounded-xs bg-white/95 flex items-center justify-center border border-amber-500/40 p-1 shrink-0 shadow-xs">
                <NationalEmblem className="w-9 h-12" theme="dark" />
              </div>
              <div>
                <div className="text-[10.5px] uppercase tracking-wider text-amber-400 font-semibold flex items-center gap-1.5">
                  <span>GOVERNMENT OF INDIA</span>
                  <span className="text-slate-400">|</span>
                  <span>AICTE REGULATION BUREAU</span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold tracking-tight">
                  Single-Window Financial Compliance Gateway
                </h2>
                <div className="text-xs text-slate-300">
                  Select your stakeholder role to enter the secure FDR lifecycle portal (Problem Statement ID: 26265)
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-sm hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Security Notice Strip */}
        <div className="bg-[#EAE8E1] px-5 py-2.5 border-b border-[#D4D1C7] text-xs flex items-center justify-between text-slate-700">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-700" />
            <span>
              <strong>NIC Parichay & SFMS Secured:</strong> All sessions are cryptographically signed with SHA-256 audit ledger tracking.
            </span>
          </div>
          <span className="font-mono text-[11px] text-slate-600">APH 2026-27 COMPLIANT</span>
        </div>

        {/* Role Cards Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {rolesConfig.map((item) => {
            const Icon = item.icon;
            const isSelected = currentRole === item.role || 
              (currentRole === 'INSTITUTION_NODAL' && item.role === 'college') ||
              (currentRole === 'REGIONAL_OFFICER' && item.role === 'regional') ||
              (currentRole === 'BUREAU_HEAD' && item.role === 'bureau') ||
              (currentRole === 'BANK_NODE' && item.role === 'bank');
            return (
              <div
                key={item.role}
                className={`border rounded p-4.5 flex flex-col justify-between transition-all duration-150 ${item.color} ${isSelected ? 'ring-2 ring-emerald-600 bg-emerald-50/30' : ''}`}
              >
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded bg-slate-100 text-slate-800 border border-slate-300">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-slate-900 leading-tight">
                          {item.title}
                        </h3>
                        <div className="text-[11px] font-medium text-slate-600">
                          {item.org}
                        </div>
                      </div>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-semibold border ${item.badgeClass}`}>
                      {item.badgeText}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 mb-3 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="bg-stone-50 border border-stone-200 p-2 rounded text-[11px] font-mono text-slate-600 mb-4">
                    <div className="flex items-center gap-1.5 text-slate-800 font-semibold mb-0.5">
                      <KeyRound className="w-3 h-3 text-slate-500" />
                      <span>{item.authMethod}</span>
                    </div>
                    <div className="text-slate-500 truncate">{item.credentials}</div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onSelectRole(item.role);
                    onClose();
                  }}
                  className={`w-full py-2 px-3 rounded text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    isSelected
                      ? 'bg-emerald-800 hover:bg-emerald-900 text-white'
                      : 'bg-slate-800 hover:bg-slate-900 text-white'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-emerald-300" />
                      <span>Currently Active (Continue)</span>
                    </>
                  ) : (
                    <>
                      <span>1-Click Instant Demo Login</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="bg-[#EAE8E1] px-6 py-3 border-t border-[#D4D1C7] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-2">
          <span>Official Portal of All India Council for Technical Education, New Delhi</span>
          <span className="font-mono text-[11px]">Server: NIC-RAILTEL-NODE-03 | SSL 256-bit</span>
        </div>
      </div>
    </div>
  );
};

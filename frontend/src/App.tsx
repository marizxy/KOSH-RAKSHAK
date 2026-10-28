import React, { useState } from 'react';
import { UserRole } from './types';
import { Navbar } from './components/Navbar';
import { HqBureauDashboard } from './components/HqBureauDashboard';
import { CollegeDashboard } from './components/CollegeDashboard';
import { RegionalOfficerDashboard } from './components/RegionalOfficerDashboard';
import { BankPortalDashboard } from './components/BankPortalDashboard';

export const App: React.FC = () => {
  const [currentRole, setCurrentRole] = useState<UserRole>('HQ');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Official Government Navigation Header */}
      <Navbar currentRole={currentRole} onRoleChange={setCurrentRole} />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentRole === 'HQ' && <HqBureauDashboard />}
        {currentRole === 'RO' && <RegionalOfficerDashboard />}
        {currentRole === 'COLLEGE' && <CollegeDashboard />}
        {currentRole === 'BANK' && <BankPortalDashboard />}
      </main>

      {/* Sovereign Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-6 mt-12 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>AICTE KOSH-Rakshak v2.6.4 • Approval Process Handbook 2026-27</span>
          <span>Sovereign Government Tech • All India Council for Technical Education, New Delhi</span>
          <span>NIST FIPS 180-4 SHA-256 Verified</span>
        </div>
      </footer>
    </div>
  );
};

export default App;

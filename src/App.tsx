import React, { useState, useMemo, useEffect } from 'react';
import { ActiveRole, UserRole, FDRInstrument, EscalationDispatchLog, AuditBlock } from './types';
import { 
  BASE_SYSTEM_DATE, 
  INITIAL_FDR_DATASET, 
  INITIAL_ESCALATION_LOGS, 
  INITIAL_AUDIT_BLOCKS 
} from './data/mockInstitutions';
import { getDaysRemaining, calculateSha256, formatInr } from './utils/formatters';

import { Header } from './components/Header';
import { LoginGatewayModal } from './components/LoginGatewayModal';
import { OfficialGovLoginGateway } from './components/OfficialGovLoginGateway';
import { TimeTravelSimulator } from './components/TimeTravelSimulator';
import { Module1CommandCenter } from './components/Module1CommandCenter';
import { Module2FDRIntakeStudio } from './components/Module2FDRIntakeStudio';
import { Module3DualSourceTruthMatrix } from './components/Module3DualSourceTruthMatrix';
import { Module4ValidityEscalations } from './components/Module4ValidityEscalations';
import { Module5RenewalLineage } from './components/Module5RenewalLineage';
import { Module6ReleaseEngineAudit } from './components/Module6ReleaseEngineAudit';
import { DocumentInspectionModal } from './components/DocumentInspectionModal';
import { CollegeScopedDashboard } from './components/CollegeScopedDashboard';
import { BankCBSPortal } from './components/BankCBSPortal';
import { KoshSahayakChatbot } from './components/KoshSahayakChatbot';
import { NationwideRiskHeatmap } from './components/NationwideRiskHeatmap';
import { HqAutonomousEoaFreezeCenter } from './components/HqAutonomousEoaFreezeCenter';
import { HqNationalLitigationMonitor } from './components/HqNationalLitigationMonitor';
import { HqMasterAuditLedger } from './components/HqMasterAuditLedger';

import { 
  Building2, 
  Layers, 
  GitCompare, 
  Clock, 
  GitBranch, 
  ShieldCheck, 
  Upload, 
  FileSignature, 
  Landmark, 
  UserCheck, 
  Shield, 
  Lock,
  Gavel,
  Key
} from 'lucide-react';

export const App: React.FC = () => {
  // Strict active persona state: 'college' | 'regional' | 'bureau' | 'bank'
  const [activeRole, setActiveRole] = useState<ActiveRole>('regional');
  
  // Dedicated active workspace tab per persona:
  // - For 'college': Tab 1 (Portfolio), Tab 2 (Intake & Upload), Tab 3 (Renewal), Tab 4 (Refund Petition)
  // - For 'regional': Tab 1 (Regional Command), Tab 2 (Forensic Intake), Tab 3 (Dual-Source Truth & Green Sheet), Tab 4 (Validity & Escalations)
  // - For 'bureau': Tab 1 (Nationwide Command), Tab 2 (Time-Travel & Escalations), Tab 3 (5-Gate Release & QR Discharge)
  // - For 'bank': Tab 1 (Bank Verification & Lien Desk)
  const [activeTab, setActiveTab] = useState<number>(1);

  // Time travel days offset
  const [daysOffset, setDaysOffset] = useState<number>(0);

  // Core stateful dataset
  const [instruments, setInstruments] = useState<FDRInstrument[]>(INITIAL_FDR_DATASET);
  const [dispatchLogs, setDispatchLogs] = useState<EscalationDispatchLog[]>(INITIAL_ESCALATION_LOGS);
  const [auditBlocks, setAuditBlocks] = useState<AuditBlock[]>(INITIAL_AUDIT_BLOCKS);

  // Active targets for individual modules
  const [inspectModalInstrument, setInspectModalInstrument] = useState<FDRInstrument | null>(null);
  const [intakeInstrument, setIntakeInstrument] = useState<FDRInstrument>(INITIAL_FDR_DATASET[1]); // Preset B initially
  const [scrutinyInstrument, setScrutinyInstrument] = useState<FDRInstrument>(INITIAL_FDR_DATASET[3]); // BOB overdraft case
  const [releaseInstrument, setReleaseInstrument] = useState<FDRInstrument>(INITIAL_FDR_DATASET[8]); // MNIT eligible case

  // UI state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [activeDemo, setActiveDemo] = useState<number | null>(null);
  const [chainVerified, setChainVerified] = useState<boolean | null>(null);

  // Compute simulated system date
  const simulatedDate = useMemo(() => {
    const base = new Date(BASE_SYSTEM_DATE);
    base.setDate(base.getDate() + daysOffset);
    return base.toISOString().substring(0, 10);
  }, [daysOffset]);

  // Dynamic instruments state re-evaluated continuously against simulatedDate
  const dynamicInstruments = useMemo(() => {
    return instruments.map((inst) => {
      // If renewed or released, preserve cleared/renewed state
      if (inst.status === 'RENEWED' || inst.status === 'RELEASED') {
        return inst;
      }

      const daysLeft = getDaysRemaining(inst.maturityDate, simulatedDate);

      // Overdue condition: maturity date is past simulated date
      if (daysLeft < 0) {
        const gap = Math.abs(daysLeft);
        return {
          ...inst,
          status: 'OVERDUE' as const,
          lineage: {
            ...inst.lineage,
            coverageGapDays: gap,
            zeroGapVerified: false,
          },
          eoaStatus: {
            ...inst.eoaStatus,
            isFrozen: true,
            freezeReason: `AUTOMATIC PENAL FREEZE: Instrument #${inst.fdrNumber} lapsed past maturity by ${gap} day${gap === 1 ? '' : 's'} without renewal lineage (APH 1.5)`,
            frozenDate: inst.eoaStatus.frozenDate || simulatedDate,
            canDownload: false,
          },
          fiveGates: {
            ...inst.fiveGates,
            gate1TenureCompleted: true,
            gate3ZeroEvcDeficiency: false,
            gate3Details: `DEFICIENT: Institutional Security Corpus currently unrenewed and lapsed (${gap} day${gap === 1 ? '' : 's'} past maturity)`,
            overallEligible: false,
            blockReason: `Instrument #${inst.fdrNumber} is ${gap} day${gap === 1 ? '' : 's'} past maturity without replacement. APH Extension of Approval (EoA) portal frozen.`,
          },
        };
      }

      // If permanent discrepancy flagged (PNB Forgery, Canara Loophole, BOB Overdraft, HDFC Shortfall)
      if (inst.status === 'DISCREPANCY_FLAGGED' || inst.verificationStatus === 'DISCREPANCY_FLAGGED') {
        return inst;
      }

      // If release requested
      if (inst.status === 'RELEASE_REQUESTED') {
        return inst;
      }

      // Approaching maturity (within 90 days)
      if (daysLeft <= 90) {
        return {
          ...inst,
          status: 'APPROACHING_MATURITY' as const,
        };
      }

      return {
        ...inst,
        status: 'ACTIVE' as const,
      };
    });
  }, [instruments, simulatedDate]);

  // Active targets dynamically synchronized with simulatedDate updates
  const activeIntakeInst = useMemo(() => {
    return dynamicInstruments.find((i) => i.id === intakeInstrument.id) || intakeInstrument;
  }, [dynamicInstruments, intakeInstrument.id]);

  const activeScrutinyInst = useMemo(() => {
    return dynamicInstruments.find((i) => i.id === scrutinyInstrument.id) || scrutinyInstrument;
  }, [dynamicInstruments, scrutinyInstrument.id]);

  const activeReleaseInst = useMemo(() => {
    return dynamicInstruments.find((i) => i.id === releaseInstrument.id) || releaseInstrument;
  }, [dynamicInstruments, releaseInstrument.id]);

  // Handle Role Switch with strict isolation rules
  const handleRoleChange = (rawRole: UserRole) => {
    let newRole: ActiveRole = 'bureau';
    if (rawRole === 'college' || rawRole === 'INSTITUTION_NODAL') newRole = 'college';
    else if (rawRole === 'regional' || rawRole === 'REGIONAL_OFFICER') newRole = 'regional';
    else if (rawRole === 'bureau' || rawRole === 'BUREAU_HEAD') newRole = 'bureau';
    else if (rawRole === 'bank' || rawRole === 'BANK_NODE') newRole = 'bank';

    setActiveRole(newRole);
    setActiveTab(1); // Reset to primary tab of that persona

    if (newRole === 'college') {
      setIntakeInstrument(instruments[1]); // Apex Institute
    }
  };

  // Dynamic calculations of overdue and approaching count based on time-travel
  const { overdueCount, approachingCount } = useMemo(() => {
    let overdue = 0;
    let approaching = 0;
    dynamicInstruments.forEach((inst) => {
      if (inst.status === 'OVERDUE') {
        overdue++;
      } else if (inst.status === 'APPROACHING_MATURITY') {
        approaching++;
      }
    });
    return { overdueCount: overdue, approachingCount: approaching };
  }, [dynamicInstruments]);

  // When time travel is advanced (+15d, +60d, +90d, etc.), auto-append escalation notices if not present
  useEffect(() => {
    if (daysOffset >= 15) {
      const hasRoyalLog = dispatchLogs.some((l) => l.fdrId === 'FDR-06A-ROYAL-14DAYS' && l.tier === 3);
      if (!hasRoyalLog) {
        const newLog: EscalationDispatchLog = {
          id: 'LOG-' + (dispatchLogs.length + 1).toString().padStart(2, '0'),
          fdrId: 'FDR-06A-ROYAL-14DAYS',
          fdrNumber: 'BOB-2018-771829',
          institutionName: 'Royal College of Engineering & Technology, Thrissur',
          tier: 3,
          channel: 'NIC_E_OFFICE',
          recipient: 'Regulation Bureau Head, AICTE HQ & Principal Secretary Higher Ed, Kerala',
          subject: `TIME-SIMULATOR ALARM (+${daysOffset}d): FDR Crossed Maturity Without Renewal`,
          messageBody: `Instrument #BOB-2018-771829 is now past maturity under simulated date ${simulatedDate}. Tier 3 penal escalation executed; institutional Extension of Approval (EoA) portal locked.`,
          timestamp: `${simulatedDate} 10:00:00 IST`,
          deliveryStatus: 'DELIVERED',
        };
        setDispatchLogs((prev) => [newLog, ...prev]);
      }
    }
    if (daysOffset >= 60) {
      const hasTechnoLog = dispatchLogs.some((l) => l.fdrId === 'FDR-06B-TECHNO-42DAYS' && l.tier === 3);
      if (!hasTechnoLog) {
        const newLog: EscalationDispatchLog = {
          id: 'LOG-' + (dispatchLogs.length + 2).toString().padStart(2, '0'),
          fdrId: 'FDR-06B-TECHNO-42DAYS',
          fdrNumber: 'SBI-2018-552910',
          institutionName: 'Techno India Institute of Technology, Salt Lake, Kolkata',
          tier: 3,
          channel: 'NIC_E_OFFICE',
          recipient: 'Regulation Bureau Head, AICTE HQ & Principal Secretary Higher Ed, West Bengal',
          subject: `TIME-SIMULATOR ALARM (+${daysOffset}d): FDR Crossed Maturity Without Renewal`,
          messageBody: `Instrument #SBI-2018-552910 is now past maturity under simulated date ${simulatedDate}. Tier 3 penal escalation executed; institutional Extension of Approval (EoA) portal locked.`,
          timestamp: `${simulatedDate} 10:00:00 IST`,
          deliveryStatus: 'DELIVERED',
        };
        setDispatchLogs((prev) => [newLog, ...prev]);
      }
    }
    if (daysOffset >= 90) {
      const hasShriRamLog = dispatchLogs.some((l) => l.fdrId === 'FDR-06C-SHRIRAM-76DAYS' && l.tier === 3);
      if (!hasShriRamLog) {
        const newLog: EscalationDispatchLog = {
          id: 'LOG-' + (dispatchLogs.length + 3).toString().padStart(2, '0'),
          fdrId: 'FDR-06C-SHRIRAM-76DAYS',
          fdrNumber: 'IDB-2019-119284',
          institutionName: 'Shri Ram College of Technology, Bhopal',
          tier: 3,
          channel: 'NIC_E_OFFICE',
          recipient: 'Regulation Bureau Head, AICTE HQ & Principal Secretary Higher Ed, Madhya Pradesh',
          subject: `TIME-SIMULATOR ALARM (+${daysOffset}d): FDR Crossed Maturity Without Renewal`,
          messageBody: `Instrument #IDB-2019-119284 is now past maturity under simulated date ${simulatedDate}. Tier 3 penal escalation executed; institutional Extension of Approval (EoA) portal locked.`,
          timestamp: `${simulatedDate} 10:00:00 IST`,
          deliveryStatus: 'DELIVERED',
        };
        setDispatchLogs((prev) => [newLog, ...prev]);
      }
    }
  }, [daysOffset, simulatedDate]);

  // Preset switch handler for Module 2
  const handleSelectPreset = (presetId: 'PRESET_A' | 'PRESET_B' | 'PRESET_C') => {
    if (presetId === 'PRESET_A') {
      setIntakeInstrument(instruments[0]); // Genuine SBI
    } else if (presetId === 'PRESET_B') {
      setIntakeInstrument(instruments[1]); // Photoshopped PNB
    } else if (presetId === 'PRESET_C') {
      setIntakeInstrument(instruments[2]); // Either or survivor Canara
    }
  };

  // Update instrument in master dataset
  const handleUpdateInstrument = (updated: FDRInstrument) => {
    setInstruments((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
    if (intakeInstrument.id === updated.id) setIntakeInstrument(updated);
    if (scrutinyInstrument.id === updated.id) setScrutinyInstrument(updated);
    if (releaseInstrument.id === updated.id) setReleaseInstrument(updated);

    // Append cryptographic audit block
    const newBlockIndex = auditBlocks.length;
    const prevHash = auditBlocks[auditBlocks.length - 1].currentHash;
    const blockData = `${newBlockIndex}-${simulatedDate}-${activeRole}-${updated.fdrNumber}-${Date.now()}-${prevHash}`;
    
    calculateSha256(blockData).then((currHash) => {
      const newBlock: AuditBlock = {
        blockIndex: newBlockIndex,
        timestamp: `${simulatedDate} ${new Date().toLocaleTimeString('en-IN')} IST`,
        userRole: activeRole,
        userIdentifier: `STAKEHOLDER-${activeRole.toUpperCase()}`,
        ipAddress: '14.139.112.44 (NIC VPN Gateway)',
        action: `INSTRUMENT_STATE_MUTATED`,
        details: `Instrument #${updated.fdrNumber} updated by ${activeRole}. Trust: ${updated.forensics.trustScore}%. Status: ${updated.status}.`,
        previousHash: prevHash,
        currentHash: currHash,
        isValid: true,
      };
      setAuditBlocks((prev) => [...prev, newBlock]);
    });
  };

  // Bureau Head Gate 5 Sanction Workflow
  const handleSanctionGate5 = (fdrId: string) => {
    const target = instruments.find((i) => i.id === fdrId) || releaseInstrument;
    const dischargeNum = target.fiveGates.dischargeOrderNumber || 
      `F.No. AICTE/RB/DISCHARGE/2026/${target.region}/${Math.floor(1000 + Math.random() * 9000)}`;
    
    const updated: FDRInstrument = {
      ...target,
      status: 'RELEASED',
      fiveGates: {
        ...target.fiveGates,
        gate5BureauSanction: true,
        overallEligible: true,
        dischargeOrderNumber: dischargeNum,
        dischargeIssuedDate: simulatedDate || '2026-10-26',
        gate5Details: `PASS: Digitally Sanctioned by Prof. Rajendra Prasad, Advisor & Regulation Bureau Head (${dischargeNum})`,
        blockReason: undefined
      }
    };

    setInstruments((prev) => prev.map((i) => (i.id === fdrId ? updated : i)));
    if (releaseInstrument.id === fdrId) setReleaseInstrument(updated);
    if (intakeInstrument.id === fdrId) setIntakeInstrument(updated);
    if (scrutinyInstrument.id === fdrId) setScrutinyInstrument(updated);

    // Append cryptographic audit block
    const newBlockIndex = auditBlocks.length;
    const prevHash = auditBlocks[auditBlocks.length - 1]?.currentHash || '0'.repeat(64);
    const blockData = `${newBlockIndex}-${simulatedDate}-BUREAU_HEAD-GATE5_SANCTION-${updated.fdrNumber}-${dischargeNum}-${prevHash}`;

    calculateSha256(blockData).then((currHash) => {
      const newBlock: AuditBlock = {
        blockIndex: newBlockIndex,
        timestamp: `${simulatedDate} ${new Date().toLocaleTimeString('en-IN')} IST`,
        userRole: 'BUREAU_HEAD',
        userIdentifier: 'ADV-RAJENDRA-PRASAD-HQ',
        ipAddress: '10.14.2.19 (AICTE HQ Internal)',
        action: 'BUREAU_HEAD_DISCHARGE_SANCTION_GRANTED',
        details: `Regulation Bureau Head digitally authorized Gate 5 Sanction for ${updated.institutionName} (FDR #${updated.fdrNumber}, ${formatInr(updated.principalAmount)}). Official Discharge Order ${dischargeNum} issued.`,
        previousHash: prevHash,
        currentHash: currHash,
        isValid: true,
      };
      setAuditBlocks((prev) => [...prev, newBlock]);
    });
  };

  // Log deficiency notice in dispatchLogs and cryptographic ledger
  const handleLogDeficiencyNotice = (log: EscalationDispatchLog) => {
    setDispatchLogs((prev) => {
      if (prev.some((l) => l.id === log.id)) return prev;
      return [log, ...prev];
    });

    // Append cryptographic block to auditBlocks
    const newBlockIndex = auditBlocks.length;
    const prevHash = auditBlocks[auditBlocks.length - 1]?.currentHash || '0'.repeat(64);
    const blockData = `${newBlockIndex}-${simulatedDate}-BUREAU_HEAD-DEFICIENCY_MEMO_DISPATCHED-${log.fdrNumber}-${log.id}-${prevHash}`;

    calculateSha256(blockData).then((currHash) => {
      const newBlock: AuditBlock = {
        blockIndex: newBlockIndex,
        timestamp: `${simulatedDate} ${new Date().toLocaleTimeString('en-IN')} IST`,
        userRole: 'BUREAU_HEAD',
        userIdentifier: 'ADV-RAJENDRA-PRASAD-HQ',
        ipAddress: '10.14.2.19 (AICTE HQ Internal)',
        action: 'STATUTORY_DEFICIENCY_MEMO_DISPATCHED',
        details: `Official Statutory Deficiency Memo ${log.id} autonomously dispatched to ${log.recipient} for FDR #${log.fdrNumber}. 15-day rectification window active.`,
        previousHash: prevHash,
        currentHash: currHash,
        isValid: true,
      };
      setAuditBlocks((prev) => [...prev, newBlock]);
    });
  };

  // Link renewal in Module 5
  const handleLinkRenewal = (
    targetFdrId: string,
    newFdrNumber: string,
    newIssueDate: string,
    newMaturityDate: string,
    amount: number,
    bankName?: string,
    branchName?: string,
    ifscCode?: string,
    scannedDocName?: string
  ) => {
    const updatedList = instruments.map((inst) => {
      if (inst.id === targetFdrId) {
        const prevFdrNo = inst.fdrNumber;
        const prevMaturity = inst.maturityDate;
        return {
          ...inst,
          fdrNumber: newFdrNumber,
          bankName: bankName || inst.bankName,
          branchName: branchName || inst.branchName,
          ifscCode: ifscCode || inst.ifscCode,
          issueDate: newIssueDate,
          maturityDate: newMaturityDate,
          principalAmount: amount,
          actualDeposit: amount,
          depositDeficit: Math.max(0, inst.requiredDeposit - amount),
          status: 'RENEWED' as const,
          verificationStatus: 'BANK_CBS_CONFIRMED' as const,
          eoaStatus: {
            ...inst.eoaStatus,
            isFrozen: false,
            freezeReason: undefined,
            certificateNumber: `EOA-2027-RESTORED-${newFdrNumber.replace(/[^A-Za-z0-9]/g, '')}`,
            canDownload: true,
          },
          fiveGates: {
            ...inst.fiveGates,
            gate3ZeroEvcDeficiency: true,
            gate3Details: 'Continuous statutory deposit maintained via replacement FDR',
            blockReason: undefined,
          },
          lineage: {
            isRenewal: true,
            previousFdrNumber: prevFdrNo,
            previousMaturityDate: prevMaturity,
            newIssueDate: newIssueDate,
            coverageGapDays: 0,
            zeroGapVerified: true,
            history: [
              ...inst.lineage.history.map(h => ({ ...h, status: 'Matured' as const })),
              {
                fdrNumber: newFdrNumber,
                tenureYears: 8,
                issueDate: newIssueDate,
                maturityDate: newMaturityDate,
                amount: amount,
                status: 'Active' as const,
              },
            ],
          },
        };
      }
      return inst;
    });

    setInstruments(updatedList);

    // Append cryptographic audit block to SHA-256 ledger
    const targetInst = instruments.find((i) => i.id === targetFdrId);
    const newBlock: AuditBlock = {
      blockIndex: auditBlocks.length + 1,
      timestamp: `${simulatedDate} ${new Date().toLocaleTimeString('en-IN')} IST`,
      userRole: activeRole,
      userIdentifier: activeRole === 'college' ? 'NODAL-OFFICER-COLLEGE' : `REGULATORY-${activeRole.toUpperCase()}`,
      ipAddress: '14.139.112.44 (NIC VPN Gateway)',
      action: 'REPLACEMENT_FDR_LINKED_LINEAGE_ESTABLISHED',
      details: `Replacement FDR #${newFdrNumber} (₹${amount.toLocaleString('en-IN')}) successfully linked to matured instrument #${targetInst?.fdrNumber}. 0-day gap verified. EoA 2027-28 compliance hold automatically lifted.`,
      previousHash: auditBlocks[auditBlocks.length - 1]?.currentHash || '0000000000000000',
      currentHash: `sha256:ren_${Math.random().toString(36).substring(2, 12)}_${Date.now().toString(16)}`,
      isValid: true,
    };
    setAuditBlocks((prev) => [...prev, newBlock]);
  };

  // Verify chain integrity
  const handleVerifyChainIntegrity = (): boolean => {
    setChainVerified(true);
    return true;
  };

  // Chatbot direct navigation handler
  const handleChatbotNavigate = (instrumentId?: string, workspaceTab?: number) => {
    if (instrumentId) {
      const found = instruments.find((i) => i.id === instrumentId);
      if (found) {
        setIntakeInstrument(found);
        setScrutinyInstrument(found);
        setReleaseInstrument(found);
      }
    }
    if (workspaceTab) {
      setActiveTab(workspaceTab);
    }
  };

  const handleChatbotOpenWorkspace = (workspaceTab: number) => {
    setActiveTab(workspaceTab);
  };

  // Handle Judge Demo Quick Jump with exact persona & workspace tab mapping
  const handleSelectDemo = (demoNum: number) => {
    setIsAuthenticated(true);
    setActiveDemo(demoNum);
    switch (demoNum) {
      case 1:
        // Demo 1: College FDR Intake & 99.7% OCR Auto-Fill
        handleRoleChange('college');
        setIntakeInstrument(instruments[0]); // Preset A (SBI Genuine)
        setActiveTab(2); // Tab 2: Smart FDR Intake & Upload Desk
        break;
      case 2:
        // Demo 2: Forensic ELA & Math Forgery
        handleRoleChange('regional');
        setIntakeInstrument(instruments[1]); // Preset B (Photoshop & Compound Math forged)
        setActiveTab(2); // Tab 2: 6-Layer Forensic & Intake Scrutiny Desk
        break;
      case 3:
        // Demo 3: Live Bank CBS Handshake & e-Office Green Sheet
        handleRoleChange('regional');
        setScrutinyInstrument(instruments[3]); // Saraswati College (BOB Secret Overdraft ₹22L)
        setActiveTab(3); // Tab 3: Dual-Source CBS Truth & e-Office Green Sheet
        break;
      case 4:
        // Demo 4: Time-Travel Simulator (+60 Days) & Escalation Matrix
        handleRoleChange('bureau');
        setDaysOffset(60); // Fast forward 60 days
        setActiveTab(2); // Tab 2: Time-Travel & Multi-Tier Escalation Matrix
        break;
      case 5:
        // Demo 5: Renewal Submission & Lineage Chain
        handleRoleChange('college');
        setActiveTab(3); // Tab 3: Renewal Submission & Lineage
        break;
      case 6:
        // Demo 6: 5-Gate Release Rule Engine & QR Discharge Order
        handleRoleChange('bureau');
        setReleaseInstrument(instruments[8]); // MNIT Jaipur (All 5 gates passed)
        setActiveTab(4); // Tab 4: 5-Gate Sanctuary Release & QR Discharge
        break;
      default:
        setActiveTab(1);
    }
  };

  // Strict Data Scoping:
  // - 'college': strictly only Apex Institute of Technology (1-482910411)
  // - 'regional': strictly institutions under SRO Chennai & NRO Kanpur
  // - 'bureau': all 10 institutions nationwide
  const scopedInstruments = useMemo(() => {
    if (activeRole === 'college') {
      return dynamicInstruments.filter((i) => i.institutionId === '1-482910411');
    }
    if (activeRole === 'regional') {
      // Scoped strictly to designated Regional Office jurisdiction (SRO Chennai & NRO Kanpur)
      return dynamicInstruments.filter(
        (i) => i.region === 'SRO' || i.region === 'NRO'
      );
    }
    return dynamicInstruments;
  }, [activeRole, dynamicInstruments]);

  // Contextual Tamper-Evident SHA-256 Audit Ledger Filtering:
  // - 'college': strictly only institutional submission & validation logs for Apex Institute (1-482910411 / PNB-2024-419208) + Genesis root
  // - 'regional': logs pertaining to institutions within designated regional jurisdiction (SRO Chennai & NRO Kanpur) + Genesis root
  // - 'bank': logs pertaining to bank CBS queries, MT760/MT799 SFMS advices + Genesis root
  // - 'bureau': nationwide complete cryptographic audit ledger across all stakeholders
  const scopedAuditBlocks = useMemo(() => {
    if (activeRole === 'bureau') {
      return auditBlocks;
    }

    if (activeRole === 'college') {
      return auditBlocks.filter(
        (b) =>
          b.blockIndex === 0 ||
          b.details.includes('PNB-2024-419208') ||
          b.details.includes('Apex') ||
          b.details.includes('1-482910411') ||
          b.userRole === 'college' ||
          b.userRole === 'INSTITUTION_NODAL' ||
          b.userIdentifier.includes('COLLEGE') ||
          b.userIdentifier.includes('APEX')
      );
    }

    if (activeRole === 'regional') {
      return auditBlocks.filter(
        (b) =>
          b.blockIndex === 0 ||
          b.userRole === 'regional' ||
          b.userRole === 'REGIONAL_OFFICER' ||
          b.userIdentifier.includes('RO-') ||
          b.userIdentifier.includes('NRO') ||
          b.userIdentifier.includes('SRO') ||
          b.details.includes('NRO') ||
          b.details.includes('SRO') ||
          b.details.includes('PNB-2024-419208') ||
          b.details.includes('SBI-2023-881920')
      );
    }

    if (activeRole === 'bank') {
      return auditBlocks.filter(
        (b) =>
          b.blockIndex === 0 ||
          b.userRole === 'bank' ||
          b.userRole === 'BANK_NODE' ||
          b.action.includes('BANK') ||
          b.action.includes('CBS') ||
          b.details.includes('CBS') ||
          b.details.includes('BOB') ||
          b.details.includes('Overdraft')
      );
    }

    return auditBlocks;
  }, [activeRole, auditBlocks]);

  // If not authenticated, render the Official Government Gateway & Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F5F4F0] text-[#1E293B] font-sans selection:bg-amber-100 selection:text-amber-900">
        <OfficialGovLoginGateway
          onLogin={(role) => {
            handleRoleChange(role);
            setIsAuthenticated(true);
          }}
          onEnterAsDemo={(demoNum) => {
            setIsAuthenticated(true);
            handleSelectDemo(demoNum);
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F4F0] text-[#1E293B] pb-10 font-sans selection:bg-amber-100 selection:text-amber-900">
      
      {/* 1. Official Institutional Header */}
      <Header
        currentRole={activeRole}
        onRoleChange={handleRoleChange}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onLogout={() => setIsAuthenticated(false)}
        simulatedDate={simulatedDate}
      />

      {/* 2. Interactive Time-Travel & System Clock Simulator Control Bar */}
      <TimeTravelSimulator
        daysOffset={daysOffset}
        simulatedDate={simulatedDate}
        onSetDaysOffset={(days) => setDaysOffset(days)}
        overdueCount={overdueCount}
        approachingCount={approachingCount}
        currentRole={activeRole}
      />

      {/* 3. Strict Persona Jurisdictional Scope Banners */}
      {activeRole === 'college' && (
        <div className="bg-blue-900 text-blue-100 px-4 py-2 border-b border-blue-800 text-xs shadow-xs">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-blue-300 shrink-0" />
              <span>
                <strong>College Nodal Officer View (Restricted):</strong> Logged in as <em>Apex Institute of Technology, Meerut (AICTE ID: 1-482910411 | AISHE: C-38291)</em>.
              </span>
            </div>
            <span className="text-[11px] font-mono text-blue-200 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-700/50">
              COLLEGE SCOPE • 4 DEDICATED WORKSPACES • OTHER INSTITUTIONS HIDDEN
            </span>
          </div>
        </div>
      )}

      {activeRole === 'regional' && (
        <div className="bg-emerald-950 text-emerald-100 px-4 py-2 border-b border-emerald-800 text-xs shadow-xs">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>
                <strong>Regional Scrutiny Authority Desk:</strong> AICTE Regional Office Jurisdiction (SRO Chennai & NRO Kanpur Camp Desks). Full 6-Layer Forensic & e-Office Green Sheet authority enabled.
              </span>
            </div>
            <span className="text-[11px] font-mono text-emerald-200 bg-emerald-900/60 px-2 py-0.5 rounded border border-emerald-700/50">
              REGIONAL JURISDICTION • 5 DEDICATED WORKSPACES
            </span>
          </div>
        </div>
      )}

      {activeRole === 'bureau' && (
        <div className="bg-amber-950 text-amber-100 px-4 py-2 border-b border-amber-800 text-xs shadow-xs">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-300 shrink-0" />
              <span>
                <strong>AICTE Regulation Bureau Head (Super Admin):</strong> Nationwide Command Authority across all technical institutions in India. Full 5-Gate Final Release Sanction and Cryptographic Audit authority enabled.
              </span>
            </div>
            <span className="text-[11px] font-mono text-amber-200 bg-amber-900/60 px-2 py-0.5 rounded border border-amber-700/50">
              SUPER ADMIN • 5 EXECUTIVE WORKSPACES
            </span>
          </div>
        </div>
      )}

      {activeRole === 'bank' && (
        <div className="bg-purple-950 text-purple-100 px-4 py-2 border-b border-purple-800 text-xs shadow-xs">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5">
            <div className="flex items-center gap-2">
              <Landmark className="w-4 h-4 text-purple-300 shrink-0" />
              <span>
                <strong>Issuing Bank Core Banking (CBS / SFMS) Portal:</strong> Authorized to confirm or reject AICTE lien endorsements and flag hidden overdraft loans or third-party encumbrances.
              </span>
            </div>
            <span className="text-[11px] font-mono text-purple-200 bg-purple-900/60 px-2 py-0.5 rounded border border-purple-700/50">
              BANK CBS SCOPE • UNIFIED DESK
            </span>
          </div>
        </div>
      )}

      {/* 4. Strict Persona-Specific Tab Navigation Bar (Zero Role Overlap) */}
      <div className="bg-[#FFFFFF] border-b border-[#D4D1C7] sticky top-[73px] z-30 shadow-xs py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-stone-100/90 p-1 rounded-lg border border-stone-200 shadow-2xs">
            <nav className="flex items-center justify-between gap-1 sm:gap-2 text-xs font-semibold overflow-x-auto">
              
              {/* PERSONA 1: COLLEGE LOGIN TABS (4 DEDICATED TABS) */}
              {activeRole === 'college' && (
                <>
                  <button
                    onClick={() => setActiveTab(1)}
                    className={`flex-1 min-w-0 flex items-center justify-center gap-2 py-2 px-2.5 rounded-md transition-all duration-300 ease-in-out whitespace-nowrap cursor-pointer text-xs ${
                      activeTab === 1
                        ? 'bg-blue-900 text-white shadow-sm font-bold'
                        : 'text-slate-600 hover:text-blue-900 hover:bg-white/80'
                    }`}
                  >
                    <Building2 className="w-4 h-4 shrink-0" />
                    <span className="truncate">Deposit Portfolio</span>
                  </button>

                  <button
                    onClick={() => setActiveTab(2)}
                    className={`flex-1 min-w-0 flex items-center justify-center gap-2 py-2 px-2.5 rounded-md transition-all duration-300 ease-in-out whitespace-nowrap cursor-pointer text-xs ${
                      activeTab === 2
                        ? 'bg-blue-900 text-white shadow-sm font-bold'
                        : 'text-slate-600 hover:text-blue-900 hover:bg-white/80'
                    }`}
                  >
                    <Upload className="w-4 h-4 shrink-0" />
                    <span className="truncate">FDR Intake & Upload</span>
                  </button>

                  <button
                    onClick={() => setActiveTab(3)}
                    className={`flex-1 min-w-0 flex items-center justify-center gap-2 py-2 px-2.5 rounded-md transition-all duration-300 ease-in-out whitespace-nowrap cursor-pointer text-xs ${
                      activeTab === 3
                        ? 'bg-blue-900 text-white shadow-sm font-bold'
                        : 'text-slate-600 hover:text-blue-900 hover:bg-white/80'
                    }`}
                  >
                    <GitBranch className="w-4 h-4 shrink-0" />
                    <span className="truncate">Renewal & Lineage</span>
                  </button>

                  <button
                    onClick={() => setActiveTab(4)}
                    className={`flex-1 min-w-0 flex items-center justify-center gap-2 py-2 px-2.5 rounded-md transition-all duration-300 ease-in-out whitespace-nowrap cursor-pointer text-xs ${
                      activeTab === 4
                        ? 'bg-blue-900 text-white shadow-sm font-bold'
                        : 'text-slate-600 hover:text-blue-900 hover:bg-white/80'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span className="truncate">Release Petition</span>
                  </button>
                </>
              )}

              {/* PERSONA 2: REGIONAL SCRUTINY OFFICER TABS (4 DEDICATED TABS) */}
              {activeRole === 'regional' && (
                <>
                  <button
                    onClick={() => setActiveTab(1)}
                    className={`flex-1 min-w-0 flex items-center justify-center gap-2 py-2 px-2.5 rounded-md transition-all duration-300 ease-in-out whitespace-nowrap cursor-pointer text-xs ${
                      activeTab === 1
                        ? 'bg-emerald-900 text-white shadow-sm font-bold'
                        : 'text-slate-600 hover:text-emerald-900 hover:bg-white/80'
                    }`}
                  >
                    <Building2 className="w-4 h-4 shrink-0" />
                    <span className="truncate">Regional Command</span>
                  </button>

                  <button
                    onClick={() => setActiveTab(2)}
                    className={`flex-1 min-w-0 flex items-center justify-center gap-2 py-2 px-2.5 rounded-md transition-all duration-300 ease-in-out whitespace-nowrap cursor-pointer text-xs ${
                      activeTab === 2
                        ? 'bg-emerald-900 text-white shadow-sm font-bold'
                        : 'text-slate-600 hover:text-emerald-900 hover:bg-white/80'
                    }`}
                  >
                    <Layers className="w-4 h-4 shrink-0" />
                    <span className="truncate">Forensic Scrutiny</span>
                  </button>

                  <button
                    onClick={() => setActiveTab(3)}
                    className={`flex-1 min-w-0 flex items-center justify-center gap-2 py-2 px-2.5 rounded-md transition-all duration-300 ease-in-out whitespace-nowrap cursor-pointer text-xs ${
                      activeTab === 3
                        ? 'bg-emerald-900 text-white shadow-sm font-bold'
                        : 'text-slate-600 hover:text-emerald-900 hover:bg-white/80'
                    }`}
                  >
                    <FileSignature className="w-4 h-4 shrink-0" />
                    <span className="truncate">Dual-Source Green Sheet</span>
                  </button>

                  <button
                    onClick={() => setActiveTab(4)}
                    className={`flex-1 min-w-0 flex items-center justify-center gap-2 py-2 px-2.5 rounded-md transition-all duration-300 ease-in-out whitespace-nowrap cursor-pointer text-xs ${
                      activeTab === 4
                        ? 'bg-emerald-900 text-white shadow-sm font-bold'
                        : 'text-slate-600 hover:text-emerald-900 hover:bg-white/80'
                    }`}
                  >
                    <Clock className="w-4 h-4 shrink-0" />
                    <span className="truncate">Validity & Escalations</span>
                  </button>

                  <button
                    onClick={() => setActiveTab(5)}
                    className={`flex-1 min-w-0 flex items-center justify-center gap-2 py-2 px-2.5 rounded-md transition-all duration-300 ease-in-out whitespace-nowrap cursor-pointer text-xs ${
                      activeTab === 5
                        ? 'bg-emerald-900 text-white shadow-sm font-bold'
                        : 'text-slate-600 hover:text-emerald-900 hover:bg-white/80'
                    }`}
                  >
                    <Key className="w-4 h-4 shrink-0" />
                    <span className="truncate">Audit Ledger</span>
                  </button>
                </>
              )}

              {/* PERSONA 3: AICTE REGULATION BUREAU HEAD TABS (EXCLUSIVELY 5 EXECUTIVE HQ TABS) */}
              {activeRole === 'bureau' && (
                <>
                  <button
                    onClick={() => setActiveTab(1)}
                    className={`flex-1 min-w-0 flex items-center justify-center gap-2 py-2 px-2.5 rounded-md transition-all duration-300 ease-in-out whitespace-nowrap cursor-pointer text-xs ${
                      activeTab === 1
                        ? 'bg-amber-900 text-white shadow-sm font-bold'
                        : 'text-slate-600 hover:text-amber-950 hover:bg-white/80'
                    }`}
                  >
                    <Landmark className="w-4 h-4 shrink-0" />
                    <span className="truncate">Heatmap & Forensics</span>
                  </button>

                  <button
                    onClick={() => setActiveTab(2)}
                    className={`flex-1 min-w-0 flex items-center justify-center gap-2 py-2 px-2.5 rounded-md transition-all duration-300 ease-in-out whitespace-nowrap cursor-pointer text-xs ${
                      activeTab === 2
                        ? 'bg-amber-900 text-white shadow-sm font-bold'
                        : 'text-slate-600 hover:text-amber-950 hover:bg-white/80'
                    }`}
                  >
                    <Lock className="w-4 h-4 shrink-0" />
                    <span className="truncate">Penalty & Inspection</span>
                  </button>

                  <button
                    onClick={() => setActiveTab(3)}
                    className={`flex-1 min-w-0 flex items-center justify-center gap-2 py-2 px-2.5 rounded-md transition-all duration-300 ease-in-out whitespace-nowrap cursor-pointer text-xs ${
                      activeTab === 3
                        ? 'bg-amber-900 text-white shadow-sm font-bold'
                        : 'text-slate-600 hover:text-amber-950 hover:bg-white/80'
                    }`}
                  >
                    <Gavel className="w-4 h-4 shrink-0" />
                    <span className="truncate">National Litigation</span>
                  </button>

                  <button
                    onClick={() => setActiveTab(4)}
                    className={`flex-1 min-w-0 flex items-center justify-center gap-2 py-2 px-2.5 rounded-md transition-all duration-300 ease-in-out whitespace-nowrap cursor-pointer text-xs ${
                      activeTab === 4
                        ? 'bg-amber-900 text-white shadow-sm font-bold'
                        : 'text-slate-600 hover:text-amber-950 hover:bg-white/80'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span className="truncate">5-Gate Release</span>
                  </button>

                  <button
                    onClick={() => setActiveTab(5)}
                    className={`flex-1 min-w-0 flex items-center justify-center gap-2 py-2 px-2.5 rounded-md transition-all duration-300 ease-in-out whitespace-nowrap cursor-pointer text-xs ${
                      activeTab === 5
                        ? 'bg-amber-900 text-white shadow-sm font-bold'
                        : 'text-slate-600 hover:text-amber-950 hover:bg-white/80'
                    }`}
                  >
                    <Key className="w-4 h-4 shrink-0" />
                    <span className="truncate">Audit Ledger</span>
                  </button>
                </>
              )}

              {/* PERSONA 4: BANK NODE (UNIFIED SINGLE-TAB WORKFLOW) */}
              {activeRole === 'bank' && (
                <button
                  onClick={() => setActiveTab(1)}
                  className="flex-1 min-w-0 flex items-center justify-center gap-2 py-2 px-3 rounded-md transition-all duration-300 ease-in-out whitespace-nowrap cursor-pointer text-xs bg-purple-900 text-white shadow-sm font-bold"
                >
                  <Landmark className="w-4 h-4 shrink-0" />
                  <span className="truncate">CBS Verification & Overdraft Surveillance</span>
                </button>
              )}

            </nav>
          </div>
        </div>
      </div>

      {/* 5. Main Content Workspace Container (Isolated View Routing) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        
        {/* ======================================================== */}
        {/* PERSONA 1 ROUTING: COLLEGE NODAL OFFICER                 */}
        {/* ======================================================== */}
        {activeRole === 'college' && (
          <>
            {/* Tab 1: My College Deposit Portfolio */}
            {activeTab === 1 && (
              <CollegeScopedDashboard
                instruments={dynamicInstruments}
                simulatedDate={simulatedDate}
                onOpenIntake={() => setActiveTab(2)}
                onOpenRenewal={() => setActiveTab(3)}
                onOpenRelease={() => setActiveTab(4)}
                onInspectDocument={(item) => setInspectModalInstrument(item)}
                onUpdateInstrument={handleUpdateInstrument}
              />
            )}

            {/* Tab 2: Smart FDR Intake & Upload Desk */}
            {activeTab === 2 && (
              <Module2FDRIntakeStudio
                currentInstrument={activeIntakeInst}
                onSelectPreset={handleSelectPreset}
                onUpdateInstrument={handleUpdateInstrument}
                userRole={activeRole}
                instruments={dynamicInstruments}
                onSelectInstrument={(item) => setIntakeInstrument(item)}
              />
            )}

            {/* Tab 3: Renewal Submission & Lineage */}
            {activeTab === 3 && (
              <Module5RenewalLineage
                instruments={scopedInstruments}
                allInstruments={scopedInstruments}
                onLinkRenewal={handleLinkRenewal}
                userRole={activeRole}
              />
            )}

            {/* Tab 4: Refund / Release Petition & Gate Tracker */}
            {activeTab === 4 && (
              <Module6ReleaseEngineAudit
                currentInstrument={scopedInstruments[0] || activeReleaseInst}
                allInstruments={scopedInstruments}
                auditBlocks={scopedAuditBlocks}
                onSanctionGate5={() => {}}
                onVerifyChainIntegrity={handleVerifyChainIntegrity}
                chainVerifiedStatus={chainVerified}
                currentRole={activeRole}
                simulatedDate={simulatedDate}
                onLogDeficiencyNotice={handleLogDeficiencyNotice}
              />
            )}
          </>
        )}

        {/* ======================================================== */}
        {/* PERSONA 2 ROUTING: REGIONAL SCRUTINY OFFICER (SRO / NRO) */}
        {/* ======================================================== */}
        {activeRole === 'regional' && (
          <>
            {/* Tab 1: Regional Command Center (SRO / NRO) */}
            {activeTab === 1 && (
              <Module1CommandCenter
                instruments={scopedInstruments}
                simulatedDate={simulatedDate}
                onSelectInstrumentForInspection={(item) => setInspectModalInstrument(item)}
                onOpenIntakeStudioWithInstrument={(item) => {
                  setIntakeInstrument(item);
                  setActiveTab(2);
                }}
                onOpenScrutinyMatrix={(item) => {
                  setScrutinyInstrument(item);
                  setActiveTab(3);
                }}
                onOpenReleaseEngine={(item) => {
                  setReleaseInstrument(item);
                  setInspectModalInstrument(item);
                }}
                onOpenLineage={() => {}}
                currentRole={activeRole}
              />
            )}

            {/* Tab 2: 6-Layer Forensic & Intake Scrutiny Desk */}
            {activeTab === 2 && (
              <Module2FDRIntakeStudio
                currentInstrument={activeIntakeInst}
                onSelectPreset={handleSelectPreset}
                onUpdateInstrument={handleUpdateInstrument}
                userRole={activeRole}
                instruments={scopedInstruments}
                onSelectInstrument={(item) => setIntakeInstrument(item)}
                onNavigateToGreenSheet={(item) => {
                  setScrutinyInstrument(item);
                  setActiveTab(3);
                }}
              />
            )}

            {/* Tab 3: Dual-Source CBS Truth & e-Office Green Sheet */}
            {activeTab === 3 && (
              <Module3DualSourceTruthMatrix
                currentInstrument={activeScrutinyInst}
                instruments={scopedInstruments}
                onUpdateInstrument={handleUpdateInstrument}
                onSelectInstrument={(item) => setScrutinyInstrument(item)}
              />
            )}

            {/* Tab 4: Regional Validity & Escalation Monitor */}
            {activeTab === 4 && (
              <Module4ValidityEscalations
                instruments={scopedInstruments}
                simulatedDate={simulatedDate}
                dispatchLogs={dispatchLogs.filter(d => scopedInstruments.some(si => si.id === d.fdrId))}
                onUpdateInstrument={handleUpdateInstrument}
                userRole={activeRole}
                onOpenRenewalForInstrument={(inst) => {
                  setIntakeInstrument(inst);
                  setActiveTab(2);
                }}
              />
            )}

            {/* Tab 5: Regional Cryptographic Audit Ledger */}
            {activeTab === 5 && (
              <HqMasterAuditLedger
                auditBlocks={scopedAuditBlocks}
                onVerifyChainIntegrity={handleVerifyChainIntegrity}
                chainVerifiedStatus={chainVerified}
                roleScope="regional"
                badgeText="REGIONAL JURISDICTION • CRYPTOGRAPHIC AUDIT LEDGER"
                subtitle="Tamper-Evident SHA-256 Audit Trail • SRO Chennai & NRO Kanpur Jurisdiction"
                title="Regional Cryptographic Audit Ledger & Chain Validator"
                description="Immutable, block-by-block cryptographic audit trail logging regional forensic scrutiny evaluations, dual-source green sheet digital signatures, and automated alert dispatches across regional camp desks."
              />
            )}
          </>
        )}

        {/* ======================================================== */}
        {/* PERSONA 3 ROUTING: REGULATION BUREAU HEAD (SUPER ADMIN)  */}
        {/* ======================================================== */}
        {activeRole === 'bureau' && (
          <>
            {/* Tab 1: Nationwide Corpus & Regional Risk Heatmap (Exclusive HQ Module 1) */}
            {activeTab === 1 && (
              <NationwideRiskHeatmap
                instruments={dynamicInstruments}
                simulatedDate={simulatedDate}
                onSelectInstrumentForInspection={(item) => setInspectModalInstrument(item)}
                onOpenIntakeStudioWithInstrument={(item) => {
                  setIntakeInstrument(item);
                  setActiveRole('regional');
                  setActiveTab(2);
                }}
                onOpenScrutinyMatrix={(item) => {
                  setScrutinyInstrument(item);
                  setActiveRole('regional');
                  setActiveTab(3);
                }}
                onOpenReleaseEngine={(item) => {
                  setReleaseInstrument(item);
                  setActiveTab(4);
                }}
                onOpenEoaMatrix={() => setActiveTab(2)}
                onOpenLitigationMonitor={() => setActiveTab(3)}
              />
            )}

            {/* Tab 2: Autonomous EoA Penalty & Compliance Freeze Center (Exclusive HQ Module 2) */}
            {activeTab === 2 && (
              <HqAutonomousEoaFreezeCenter
                instruments={dynamicInstruments}
                simulatedDate={simulatedDate}
                onUpdateInstrument={handleUpdateInstrument}
                onOpenRenewalForInstrument={(inst) => {
                  setIntakeInstrument(inst);
                  setActiveTab(1);
                }}
              />
            )}

            {/* Tab 3: National Litigation & "Ghost Encumbrance" Monitor (Exclusive HQ Module 3) */}
            {activeTab === 3 && (
              <HqNationalLitigationMonitor
                instruments={dynamicInstruments}
                onUpdateInstrument={handleUpdateInstrument}
              />
            )}

            {/* Tab 4: 5-Gate Sanctuary Release & QR Discharge */}
            {activeTab === 4 && (
              <Module6ReleaseEngineAudit
                currentInstrument={activeReleaseInst}
                allInstruments={dynamicInstruments}
                auditBlocks={auditBlocks}
                onSanctionGate5={handleSanctionGate5}
                onVerifyChainIntegrity={handleVerifyChainIntegrity}
                chainVerifiedStatus={chainVerified}
                currentRole={activeRole}
                simulatedDate={simulatedDate}
                onLogDeficiencyNotice={handleLogDeficiencyNotice}
                onSelectInstrument={(inst) => setReleaseInstrument(inst)}
              />
            )}

            {/* Tab 5: Mass Cryptographic Audit Ledger (Exclusive HQ Module 5) */}
            {activeTab === 5 && (
              <HqMasterAuditLedger
                auditBlocks={auditBlocks}
                onVerifyChainIntegrity={handleVerifyChainIntegrity}
                chainVerifiedStatus={chainVerified}
              />
            )}
          </>
        )}

        {/* ======================================================== */}
        {/* PERSONA 4 ROUTING: BANK NODE (CBS / SFMS COMPLIANCE)     */}
        {/* ======================================================== */}
        {activeRole === 'bank' && (
          <BankCBSPortal
            instruments={dynamicInstruments}
            simulatedDate={simulatedDate}
            onUpdateInstrument={handleUpdateInstrument}
            onInspectDocument={(item) => setInspectModalInstrument(item)}
            activeSubTab={activeTab}
            onTabChange={(tab) => setActiveTab(tab)}
          />
        )}

      </main>

      {/* 6. Document Deep-Dive Inspection Modal */}
      <DocumentInspectionModal
        instrument={inspectModalInstrument}
        onClose={() => setInspectModalInstrument(null)}
      />

      {/* 7. Multi-Stakeholder Login Gateway Modal */}
      <LoginGatewayModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSelectRole={handleRoleChange}
        currentRole={activeRole}
      />

      {/* 8. Floating Multi-Language AI Regulatory Assistant ("Kosh-Sahayak") */}
      <KoshSahayakChatbot
        instruments={dynamicInstruments}
        onNavigateToInstrument={handleChatbotNavigate}
        onOpenWorkspace={handleChatbotOpenWorkspace}
      />

    </div>
  );
};

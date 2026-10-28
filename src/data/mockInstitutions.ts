import { FDRInstrument, EscalationDispatchLog, AuditBlock, GhostEncumbranceDetails, EoaRegulatoryStatus } from '../types';
import { calculateQuarterlyCompoundedMaturity } from '../utils/formatters';

export const BASE_SYSTEM_DATE = '2026-10-26';

export const INITIAL_FDR_DATASET: FDRInstrument[] = [
  // 1. Fully Verified & Compliant Instrument
  {
    id: 'FDR-01-SBI-COMPLIANT',
    fdrNumber: 'SBI-2023-881920',
    institutionId: '1-10294811',
    institutionName: 'College of Engineering, Guindy, Anna University',
    aisheCode: 'C-24891',
    region: 'SRO',
    bankName: 'State Bank of India',
    branchName: 'Guindy SME Branch, Chennai',
    ifscCode: 'SBIN0001055',
    issueDate: '2023-08-15',
    maturityDate: '2031-08-15',
    tenureYears: 8,
    principalAmount: 3500000,
    interestRatePct: 7.25,
    printedMaturityAmount: 6216270,
    mathExpectedMaturity: calculateQuarterlyCompoundedMaturity(3500000, 7.25, 8),
    lienPledgeClause: 'Pledged jointly in favor of Member Secretary, AICTE, New Delhi. Non-encashable and non-transferable without written AICTE discharge order.',
    lienValid: true,
    hasEitherSurvivorClause: false,
    category: 'Urban',
    approvedPrograms: [
      { programName: 'B.Tech Engineering & Technology (Intake 240)', intake: 240, normativeDepositPerProgram: 3500000 }
    ],
    requiredDeposit: 3500000,
    actualDeposit: 3500000,
    depositDeficit: 0,
    verificationStatus: 'BANK_CBS_CONFIRMED',
    status: 'ACTIVE',
    bankCbs: {
      confirmed: true,
      handshakeTimestamp: '2026-10-24T14:22:10 IST',
      hasEncumbrance: false,
      activeLienMarked: true,
      cbsReferenceNumber: 'CBS-SBI-2026-9912048',
      bankBranchIfsc: 'SBIN0001055',
      remarks: 'Lien marked in CBS Master against AICTE. Zero encumbrance.'
    },
    forensics: {
      elaTamperingDetected: false,
      tamperedRegions: [],
      metadataModifiedBy: 'State Bank Core Banking Host (Linux SFMS PDF Generator)',
      fontMismatchDetected: false,
      trustScore: 99.4,
      mathMismatch: false,
      mathExpectedMaturity: calculateQuarterlyCompoundedMaturity(3500000, 7.25, 8),
      clausesFlagged: []
    },
    lineage: {
      isRenewal: false,
      coverageGapDays: 0,
      zeroGapVerified: true,
      history: [
        { fdrNumber: 'SBI-2023-881920', tenureYears: 8, issueDate: '2023-08-15', maturityDate: '2031-08-15', amount: 3500000, status: 'Active' }
      ]
    },
    fiveGates: {
      gate1TenureCompleted: false,
      gate1Details: 'Tenure elapsed: 3.2 of 8 years required (APH Clause 1.4(a))',
      gate2BankCbsClear: true,
      gate2Details: 'CBS Verified: Lien actively marked, zero overdrafts',
      gate3ZeroEvcDeficiency: true,
      gate3Details: 'EVC Scrutiny Clear: Zero infrastructure deficiencies',
      gate4ZeroLegalHold: true,
      gate4Details: 'Vigilance & Court Check: Zero pending complaints or holds',
      gate5BureauSanction: false,
      gate5Details: 'Pending lock-in completion before Bureau sanction',
      overallEligible: false,
      blockReason: 'Lock-in period in progress (5 years remaining).'
    },
    greenSheetNotes: [
      {
        id: 'NOTE-001',
        date: '2023-08-20',
        author: 'Shri R. Krishnan, ITS',
        designation: 'Regional Scrutiny Officer',
        office: 'AICTE Southern Regional Office (SRO Chennai)',
        noteContent: 'Submitted FDR verified against SBI CBS node. AICTE lien recorded under APH 2023-24 Normative Schedule. Approved for institutional security deposit ledger.',
        recommendedAction: 'APPROVE_AND_LOCK',
        digitalSignature: 'SHA256:8f2a991b10a9c4... [Verified by NIC Digital Token]',
        signed: true,
        timestamp: '2023-08-20 16:45:00 IST'
      }
    ],
    escalationTier: 0,
    aphClauseReference: 'APH 2026-27 Chapter 1, Section 1.4(a)',
    sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    ghostEncumbrance: {
    "hasLitigationHold": false,
    "njdgSyncTimestamp": "2026-10-24 14:00 IST"
},
    eoaStatus: {
    "isFrozen": false,
    "academicYear": "2027-28",
    "certificateNumber": "EOA-SRO-2027-ACTIVE-8819",
    "canDownload": true
}
  },

  // 2. Pixel + Mathematical Compound-Interest Forgery Case
  {
    id: 'FDR-02-PNB-FORGERY',
    fdrNumber: 'PNB-2024-419208',
    institutionId: '1-482910411',
    institutionName: 'Apex Institute of Technology & Management, Meerut',
    aisheCode: 'C-38291',
    region: 'NRO',
    bankName: 'Punjab National Bank',
    branchName: 'Meerut Cantt Branch',
    ifscCode: 'PUNB0029100',
    issueDate: '2024-04-10',
    maturityDate: '2032-04-10',
    tenureYears: 8,
    principalAmount: 3500000, // Altered in Photoshop from 15,00,000!
    interestRatePct: 7.10,
    printedMaturityAmount: 2631240, // Note: This maturity amount actually belongs to 15,00,000!
    mathExpectedMaturity: calculateQuarterlyCompoundedMaturity(3500000, 7.10, 8), // 61,39,560!
    lienPledgeClause: 'Pledged to Member Secretary, AICTE, New Delhi.',
    lienValid: true,
    hasEitherSurvivorClause: false,
    category: 'Urban',
    approvedPrograms: [
      { programName: 'B.Tech Engineering (Intake 180)', intake: 180, normativeDepositPerProgram: 3500000 }
    ],
    requiredDeposit: 3500000,
    actualDeposit: 1500000, // Actual deposited in bank is only 15L!
    depositDeficit: 2000000,
    verificationStatus: 'DISCREPANCY_FLAGGED',
    status: 'DISCREPANCY_FLAGGED',
    bankCbs: {
      confirmed: false,
      handshakeTimestamp: '2026-10-25T11:05:44 IST',
      hasEncumbrance: true,
      activeLienMarked: false,
      cbsReferenceNumber: 'CBS-ERR-PNB-AMT-MISMATCH',
      bankBranchIfsc: 'PUNB0029100',
      remarks: 'ALERT: PNB CBS confirms FDR issued for only ₹15,00,000. Institution submitted receipt claiming ₹35,00,000.'
    },
    forensics: {
      elaTamperingDetected: true,
      tamperedRegions: [
        {
          id: 'TR-01',
          label: 'Principal Numeric Box',
          xPct: 62,
          yPct: 38,
          widthPct: 24,
          heightPct: 8,
          description: 'High-frequency ELA pixel noise detected. Digit "3" spliced over original "1" with non-native antialiasing.',
          severity: 'CRITICAL'
        },
        {
          id: 'TR-02',
          label: 'Principal Amount in Words',
          xPct: 20,
          yPct: 48,
          widthPct: 60,
          heightPct: 7,
          description: 'Font kerning mismatch: "Thirty Five" font metrics differ from PNB pre-printed core banking template.',
          severity: 'CRITICAL'
        }
      ],
      metadataModifiedBy: 'Adobe Photoshop 2024 (Macintosh; PDF/X-1a) on 2024-04-12T19:30:12+05:30',
      fontMismatchDetected: true,
      trustScore: 12.5,
      mathMismatch: true,
      mathExpectedMaturity: 6139560,
      mathDiscrepancyDelta: -3508320, // Huge shortfall between expected maturity of 35L and printed maturity!
      clausesFlagged: ['MATHEMATICAL_FORGERY_DETECTED', 'PIXEL_ELA_MANIPULATION', 'METADATA_TAMPERING_PHOTOSHOP']
    },
    lineage: {
      isRenewal: false,
      coverageGapDays: 0,
      zeroGapVerified: false,
      history: []
    },
    fiveGates: {
      gate1TenureCompleted: false,
      gate1Details: 'FAILED: Instrument fraudulent',
      gate2BankCbsClear: false,
      gate2Details: 'FAILED: Bank CBS reports actual amount is ₹15,00,000, not ₹35,00,000',
      gate3ZeroEvcDeficiency: false,
      gate3Details: 'FAILED: Submission of forged instrument violates Regulation 14(b)',
      gate4ZeroLegalHold: false,
      gate4Details: 'FAILED: Referred to AICTE Vigilance Cell',
      gate5BureauSanction: false,
      gate5Details: 'REJECTED: Show-Cause Deficiency Notice initiated',
      overallEligible: false,
      blockReason: 'Severe Tampering & Financial Forgery Detected by ELA and Compound Interest Engine.'
    },
    greenSheetNotes: [
      {
        id: 'NOTE-002',
        date: '2026-10-25',
        author: 'Dr. Alok Verma',
        designation: 'Regional Scrutiny Officer',
        office: 'AICTE Northern Regional Office (NRO Kanpur)',
        noteContent: 'CRITICAL FINDING: Document uploaded by Apex Institute of Technology exhibits severe pixel manipulation on Principal Amount box. ELA heatmap confirms artifact boundary at (X:62%, Y:38%). Actuarial compound interest recalculation reveals printed maturity ₹26,31,240 matches ₹15 Lakhs principal, NOT the claimed ₹35 Lakhs. Bank CBS handshake confirms PNB only issued ₹15 Lakhs deposit. Show-Cause notice under APH Clause 1.4(d) is drafted below.',
        recommendedAction: 'ESCALATE_TO_VIGILANCE',
        digitalSignature: 'SHA256:d199fa84092b... [Signed via NIC Token]',
        signed: true,
        timestamp: '2026-10-25 15:30:22 IST'
      }
    ],
    escalationTier: 3,
    aphClauseReference: 'APH 2026-27 Chapter 1, Section 1.4(d) & Appendix 16 (Penal Clauses)',
    sha256Hash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    ghostEncumbrance: {
    "hasLitigationHold": true,
    "caseNumber": "WP(C) 4182/2025 (Allahabad HC)",
    "courtName": "High Court of Judicature at Allahabad",
    "petitioner": "Consortium of Lenders (Lead: SBI Meerut)",
    "respondent": "Apex Educational & Research Trust & Ors",
    "stayDetails": "CRITICAL: Interim Judicial Attachment Order on institutional fixed deposits & bank accounts for ₹1.20 Cr recovery.",
    "njdgSyncTimestamp": "2026-10-25 09:30 IST (e-Courts NJDG Sync)",
    "affidavitSummary": "Institutional Form 14 Affidavit falsely affirmed zero encumbrances. NJDG API cross-check detected active High Court property attachment."
},
    eoaStatus: {
    "isFrozen": true,
    "academicYear": "2027-28",
    "freezeReason": "PENAL FREEZE: Active e-Courts Property Attachment & Document Forgery under Regulation 14(b)",
    "frozenDate": "2026-10-25",
    "certificateNumber": "EOA-NRO-2027-FROZEN-0419",
    "canDownload": false
}
  },

  // 3. "Either-or-Survivor" Legal Lien Loophole Case
  {
    id: 'FDR-03-CNB-LOOPHOLE',
    fdrNumber: 'CNB-2022-772190',
    institutionId: '1-38102918',
    institutionName: 'Vidya Jyothi Institute of Engineering & Technology, Hyderabad',
    aisheCode: 'C-19823',
    region: 'SCRO',
    bankName: 'Canara Bank',
    branchName: 'Abids Main Branch, Hyderabad',
    ifscCode: 'CNRB0001822',
    issueDate: '2022-11-04',
    maturityDate: '2030-11-04',
    tenureYears: 8,
    principalAmount: 3500000,
    interestRatePct: 7.00,
    printedMaturityAmount: 6097825,
    mathExpectedMaturity: calculateQuarterlyCompoundedMaturity(3500000, 7.00, 8),
    lienPledgeClause: 'Payable to Principal, Vidya Jyothi Institute OR Member Secretary, AICTE (Either or Survivor Mode of Operation)',
    lienValid: false,
    hasEitherSurvivorClause: true,
    category: 'Urban',
    approvedPrograms: [
      { programName: 'B.Tech CSE & ECE (Intake 180)', intake: 180, normativeDepositPerProgram: 3500000 }
    ],
    requiredDeposit: 3500000,
    actualDeposit: 3500000,
    depositDeficit: 0,
    verificationStatus: 'DISCREPANCY_FLAGGED',
    status: 'DISCREPANCY_FLAGGED',
    bankCbs: {
      confirmed: true,
      handshakeTimestamp: '2026-10-23T16:12:00 IST',
      hasEncumbrance: false,
      activeLienMarked: false, // Bank did not mark absolute AICTE lien due to either-or-survivor!
      cbsReferenceNumber: 'CBS-CNB-2026-004128',
      bankBranchIfsc: 'CNRB0001822',
      remarks: 'Operational mandate registered as "Either or Survivor". College can prematurely withdraw without AICTE counter-signature.'
    },
    forensics: {
      elaTamperingDetected: false,
      tamperedRegions: [],
      metadataModifiedBy: 'Canara Bank CBS Portal (HP Unix SFMS Output)',
      fontMismatchDetected: false,
      trustScore: 48.0,
      mathMismatch: false,
      mathExpectedMaturity: calculateQuarterlyCompoundedMaturity(3500000, 7.00, 8),
      clausesFlagged: ['EITHER_OR_SURVIVOR_LOOPHOLE_DETECTED', 'LACKS_EXCLUSIVE_AICTE_DISCHARGE_CLAUSE']
    },
    lineage: {
      isRenewal: false,
      coverageGapDays: 0,
      zeroGapVerified: true,
      history: []
    },
    fiveGates: {
      gate1TenureCompleted: false,
      gate1Details: 'Tenure in progress (4 years completed)',
      gate2BankCbsClear: false,
      gate2Details: 'FAILED: Lien mandate allows college unilateral liquidation without AICTE consent',
      gate3ZeroEvcDeficiency: true,
      gate3Details: 'EVC Clear',
      gate4ZeroLegalHold: true,
      gate4Details: 'Zero legal disputes',
      gate5BureauSanction: false,
      gate5Details: 'BLOCKED: Strict APH pledge mandate rectification required',
      overallEligible: false,
      blockReason: 'Mandatory Joint Pledge Clause Violated: "Either or Survivor" clause detected.'
    },
    greenSheetNotes: [
      {
        id: 'NOTE-003',
        date: '2026-10-24',
        author: 'Smt. K. Ratna Prabha',
        designation: 'Senior Legal & Scrutiny Officer',
        office: 'AICTE South Central Regional Office (SCRO Hyderabad)',
        noteContent: 'LEGAL SCRUTINY ALERT: FDR #CNB-2022-772190 contains invalid operational clause: "Either or Survivor". Under AICTE APH Chapter 1 Clause 1.4(b), the Fixed Deposit must strictly be in joint name with Member Secretary AICTE and encashable ONLY with prior written AICTE sanction. An "Either or Survivor" clause enables the college society to unilaterally liquidate the corpus without AICTE notice. Direction issued to replace with rectifying endorsement within 15 days.',
        recommendedAction: 'ISSUE_SHOW_CAUSE',
        digitalSignature: 'SHA256:7b11c9a038e... [Signed by Legal Officer]',
        signed: true,
        timestamp: '2026-10-24 17:15:30 IST'
      }
    ],
    escalationTier: 2,
    aphClauseReference: 'APH 2026-27 Chapter 1, Section 1.4(b)',
    sha256Hash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    ghostEncumbrance: {
    "hasLitigationHold": false,
    "njdgSyncTimestamp": "2026-10-23 16:00 IST"
},
    eoaStatus: {
    "isFrozen": false,
    "academicYear": "2027-28",
    "certificateNumber": "EOA-SCRO-2027-ACTIVE-7721",
    "canDownload": true
}
  },

  // 4. Institution Claimed vs. Bank CBS Mismatch & Secret Overdraft Case
  {
    id: 'FDR-04-BOB-OVERDRAFT',
    fdrNumber: 'BOB-2021-992318',
    institutionId: '1-77291024',
    institutionName: 'Saraswati College of Engineering, Navi Mumbai',
    aisheCode: 'C-45910',
    region: 'WRO',
    bankName: 'Bank of Baroda',
    branchName: 'Vashi Sector 17 Branch, Navi Mumbai',
    ifscCode: 'BARB0VASHIX',
    issueDate: '2021-06-18',
    maturityDate: '2029-06-18',
    tenureYears: 8,
    principalAmount: 3500000,
    interestRatePct: 7.20,
    printedMaturityAmount: 6191760,
    mathExpectedMaturity: calculateQuarterlyCompoundedMaturity(3500000, 7.20, 8),
    lienPledgeClause: 'Pledged jointly to Member Secretary AICTE New Delhi.',
    lienValid: true,
    hasEitherSurvivorClause: false,
    category: 'Urban',
    approvedPrograms: [
      { programName: 'B.Tech Civil & Mechanical (Intake 120)', intake: 120, normativeDepositPerProgram: 3500000 }
    ],
    requiredDeposit: 3500000,
    actualDeposit: 3500000,
    depositDeficit: 0,
    verificationStatus: 'DISCREPANCY_FLAGGED',
    status: 'DISCREPANCY_FLAGGED',
    bankCbs: {
      confirmed: false,
      handshakeTimestamp: '2026-10-26T10:15:22 IST',
      hasEncumbrance: true,
      overdraftLoanAmount: 2200000,
      activeLienMarked: true,
      cbsReferenceNumber: 'CBS-BOB-OD-88192001',
      bankBranchIfsc: 'BARB0VASHIX',
      remarks: 'SECRET OVERDRAFT DETECTED: Bank of Baroda Finacle CBS records active Overdraft Facility of ₹22,00,000 availed against this FDR on 2024-03-15. Net available security is only ₹13,00,000.'
    },
    forensics: {
      elaTamperingDetected: false,
      tamperedRegions: [],
      metadataModifiedBy: 'Finacle 10.2 Core Banking Engine (Bank of Baroda)',
      fontMismatchDetected: false,
      trustScore: 35.0,
      mathMismatch: false,
      mathExpectedMaturity: calculateQuarterlyCompoundedMaturity(3500000, 7.20, 8),
      clausesFlagged: ['BANK_CBS_ENCUMBRANCE_OVERDRAFT_FOUND', 'CORPUS_IMPAIRED_BY_LOAN']
    },
    lineage: {
      isRenewal: false,
      coverageGapDays: 0,
      zeroGapVerified: true,
      history: []
    },
    fiveGates: {
      gate1TenureCompleted: false,
      gate1Details: '5.3 years completed of 8 years',
      gate2BankCbsClear: false,
      gate2Details: 'FAILED: Active Overdraft of ₹22,00,000 marked by Bank of Baroda',
      gate3ZeroEvcDeficiency: true,
      gate3Details: 'EVC Clear',
      gate4ZeroLegalHold: false,
      gate4Details: 'WARNING: Institutional breach of financial pledge undertaking',
      gate5BureauSanction: false,
      gate5Details: 'BLOCKED: Encumbrance must be closed immediately',
      overallEligible: false,
      blockReason: 'Secret Encumbrance / Overdraft Loan of ₹22,00,000 availed against regulatory FDR.'
    },
    greenSheetNotes: [
      {
        id: 'NOTE-004',
        date: '2026-10-26',
        author: 'Shri Vikram Deshmukh',
        designation: 'Regional Officer & Joint Director',
        office: 'AICTE Western Regional Office (WRO Mumbai)',
        noteContent: 'FINANCIAL IRREGULARITY: College claimed this deposit of ₹35,00,000 is unencumbered and exclusively pledged to AICTE. However, live Finacle CBS Handshake executed with Bank of Baroda Vashi Branch reveals an active Overdraft Loan (A/c #OD-88192001) of ₹22,00,000 was sanctioned to the college society using this FDR as collateral! This constitutes a willful breach of regulatory trust under APH 2026-27 Appendix 16. Show-Cause notice issued to Principal & Bank Branch Manager.',
        recommendedAction: 'ISSUE_SHOW_CAUSE',
        digitalSignature: 'SHA256:3c88019b22e... [Signed by Regional Director]',
        signed: true,
        timestamp: '2026-10-26 12:45:10 IST'
      }
    ],
    escalationTier: 3,
    aphClauseReference: 'APH 2026-27 Chapter 1, Section 1.4(c) & Banking Regulation Act Sec 45',
    sha256Hash: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
    ghostEncumbrance: {
    "hasLitigationHold": true,
    "caseNumber": "DRT/MUM/2024/910",
    "courtName": "Debts Recovery Tribunal (DRT-II Mumbai)",
    "petitioner": "Bank of Baroda Asset Recovery Branch",
    "respondent": "Saraswati Education Society",
    "stayDetails": "Pledged FDR compromised by undisclosed ₹22,00,000 overdraft facility.",
    "njdgSyncTimestamp": "2026-10-26 10:15 IST"
},
    eoaStatus: {
    "isFrozen": true,
    "academicYear": "2027-28",
    "freezeReason": "COMPLIANCE HOLD: Unauthorized ₹22L Bank Overdraft Loan against Pledged Security Corpus",
    "frozenDate": "2026-10-26",
    "certificateNumber": "EOA-WRO-2027-FROZEN-9923",
    "canDownload": false
}
  },

  // 5. APH Normative Deposit Shortfall Case
  {
    id: 'FDR-05-HDFC-SHORTFALL',
    fdrNumber: 'HDFC-2023-339101',
    institutionId: '1-90182744',
    institutionName: 'Metro City Institute of Technology & Management Studies, Bengaluru',
    aisheCode: 'C-29104',
    region: 'SWRO',
    bankName: 'HDFC Bank Ltd',
    branchName: 'Koramangala 80ft Road, Bengaluru',
    ifscCode: 'HDFC0000053',
    issueDate: '2023-05-12',
    maturityDate: '2031-05-12',
    tenureYears: 8,
    principalAmount: 3500000,
    interestRatePct: 7.25,
    printedMaturityAmount: 6216270,
    mathExpectedMaturity: calculateQuarterlyCompoundedMaturity(3500000, 7.25, 8),
    lienPledgeClause: 'Held in joint account with Member Secretary, AICTE New Delhi.',
    lienValid: true,
    hasEitherSurvivorClause: false,
    category: 'Urban',
    approvedPrograms: [
      { programName: 'B.Tech Engineering (Intake 240)', intake: 240, normativeDepositPerProgram: 3500000 },
      { programName: 'MBA Management (Intake 120)', intake: 120, normativeDepositPerProgram: 1500000 }
    ],
    requiredDeposit: 5000000, // Urban B.Tech (35L) + MBA (15L) = 50 Lakhs!
    actualDeposit: 3500000,
    depositDeficit: 1500000, // 15 Lakhs Shortfall!
    verificationStatus: 'DISCREPANCY_FLAGGED',
    status: 'DISCREPANCY_FLAGGED',
    bankCbs: {
      confirmed: true,
      handshakeTimestamp: '2026-10-22T14:40:00 IST',
      hasEncumbrance: false,
      activeLienMarked: true,
      cbsReferenceNumber: 'CBS-HDFC-2026-889102',
      bankBranchIfsc: 'HDFC0000053',
      remarks: 'FDR is genuine for ₹35,00,000. However AICTE APH intake requires ₹50,00,000 total corpus.'
    },
    forensics: {
      elaTamperingDetected: false,
      tamperedRegions: [],
      metadataModifiedBy: 'HDFC Finacle Corporate Export',
      fontMismatchDetected: false,
      trustScore: 92.0,
      mathMismatch: false,
      mathExpectedMaturity: calculateQuarterlyCompoundedMaturity(3500000, 7.25, 8),
      clausesFlagged: ['APH_NORMATIVE_DEPOSIT_DEFICIT_FLAG']
    },
    lineage: {
      isRenewal: false,
      coverageGapDays: 0,
      zeroGapVerified: true,
      history: []
    },
    fiveGates: {
      gate1TenureCompleted: false,
      gate1Details: '3.4 years elapsed of 8 years',
      gate2BankCbsClear: true,
      gate2Details: 'Bank deposit verified genuine',
      gate3ZeroEvcDeficiency: false,
      gate3Details: 'FAILED: Statutory deposit deficit of ₹15,00,000 under APH Table 4.1',
      gate4ZeroLegalHold: true,
      gate4Details: 'No court cases',
      gate5BureauSanction: false,
      gate5Details: 'BLOCKED: Supplementary FDR of ₹15,00,000 mandatory',
      overallEligible: false,
      blockReason: 'Normative Deposit Shortfall: Institution submitted ₹35L against statutory requirement of ₹50L for B.Tech + MBA.'
    },
    greenSheetNotes: [
      {
        id: 'NOTE-005',
        date: '2026-10-22',
        author: 'Dr. C. G. Sreenivasa',
        designation: 'Regional Scrutiny Officer',
        office: 'AICTE South Western Regional Office (SWRO Bengaluru)',
        noteContent: 'REGULATORY AUDIT DEFICIENCY: Metro City Institute was approved for B.Tech (₹35 Lakhs normative) and MBA (₹15 Lakhs normative). Under APH 2026-27 Table 4.1, combined deposit required is ₹50,00,000. The institution has only provided FDR for ₹35,00,000, resulting in an unhedged regulatory shortfall of ₹15,00,000. Institutional EoA portal locked until supplementary FDR is submitted.',
        recommendedAction: 'ISSUE_SHOW_CAUSE',
        digitalSignature: 'SHA256:ef220188ca9... [Signed by Scrutiny Officer]',
        signed: true,
        timestamp: '2026-10-22 16:00:15 IST'
      }
    ],
    escalationTier: 1,
    aphClauseReference: 'APH 2026-27 Chapter 4, Table 4.1 (Corpus Schedule for Multi-Disciplinary Colleges)',
    sha256Hash: 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d',
    ghostEncumbrance: {
    "hasLitigationHold": false,
    "njdgSyncTimestamp": "2026-10-22 14:00 IST"
},
    eoaStatus: {
    "isFrozen": true,
    "academicYear": "2027-28",
    "freezeReason": "STATUTORY DEFICIT: Unhedged deposit shortfall of ₹15,00,000 under APH Table 4.1",
    "frozenDate": "2026-10-22",
    "certificateNumber": "EOA-SWRO-2027-FROZEN-3391",
    "canDownload": false
}
  },

  // 6a. Approaching Maturity Warning (14 Days)
  {
    id: 'FDR-06A-ROYAL-14DAYS',
    fdrNumber: 'BOB-2018-771829',
    institutionId: '1-66291033',
    institutionName: 'Royal College of Engineering & Technology, Thrissur',
    aisheCode: 'C-41029',
    region: 'SWRO',
    bankName: 'Bank of Baroda',
    branchName: 'Thrissur Round South, Kerala',
    ifscCode: 'BARB0THRISX',
    issueDate: '2018-11-09',
    maturityDate: '2026-11-09', // 14 days from 2026-10-26!
    tenureYears: 8,
    principalAmount: 3500000,
    interestRatePct: 7.20,
    printedMaturityAmount: 6191760,
    mathExpectedMaturity: calculateQuarterlyCompoundedMaturity(3500000, 7.20, 8),
    lienPledgeClause: 'Held under exclusive lien to Member Secretary AICTE New Delhi.',
    lienValid: true,
    hasEitherSurvivorClause: false,
    category: 'Rural',
    approvedPrograms: [
      { programName: 'B.Tech Engineering (Intake 180)', intake: 180, normativeDepositPerProgram: 3500000 }
    ],
    requiredDeposit: 3500000,
    actualDeposit: 3500000,
    depositDeficit: 0,
    verificationStatus: 'BANK_CBS_CONFIRMED',
    status: 'APPROACHING_MATURITY',
    bankCbs: {
      confirmed: true,
      handshakeTimestamp: '2026-10-25T09:12:00 IST',
      hasEncumbrance: false,
      activeLienMarked: true,
      cbsReferenceNumber: 'CBS-BOB-2026-449102',
      bankBranchIfsc: 'BARB0THRISX',
      remarks: 'Deposit maturing on 09-Nov-2026. Renewal request awaited from college.'
    },
    forensics: {
      elaTamperingDetected: false,
      tamperedRegions: [],
      metadataModifiedBy: 'Bank of Baroda Finacle 10',
      fontMismatchDetected: false,
      trustScore: 98.2,
      mathMismatch: false,
      mathExpectedMaturity: calculateQuarterlyCompoundedMaturity(3500000, 7.20, 8),
      clausesFlagged: ['MATURITY_CRITICAL_WINDOW_T_MINUS_14_DAYS']
    },
    lineage: {
      isRenewal: false,
      coverageGapDays: 0,
      zeroGapVerified: true,
      history: [
        { fdrNumber: 'BOB-2018-771829', tenureYears: 8, issueDate: '2018-11-09', maturityDate: '2026-11-09', amount: 3500000, status: 'Active' }
      ]
    },
    fiveGates: {
      gate1TenureCompleted: true,
      gate1Details: '8 Years completed on 09-Nov-2026',
      gate2BankCbsClear: true,
      gate2Details: 'CBS Verified unencumbered',
      gate3ZeroEvcDeficiency: true,
      gate3Details: 'EVC Clear',
      gate4ZeroLegalHold: true,
      gate4Details: 'No holds',
      gate5BureauSanction: false,
      gate5Details: 'Institution must either renew or request formal release',
      overallEligible: false,
      blockReason: 'Maturing in 14 days. Final renewal / release option pending.'
    },
    greenSheetNotes: [
      {
        id: 'NOTE-006A',
        date: '2026-10-20',
        author: 'Shri K. Mathew',
        designation: 'Scrutiny Officer',
        office: 'AICTE SWRO Camp Desk (Kerala)',
        noteContent: 'CRITICAL RENEWAL ALERT: Instrument BOB-2018-771829 matures in 14 days. Tier 2 automated warning dispatched via SMS and WhatsApp to Principal and Chairman. If not renewed prior to 09-Nov-2026, penal action under APH Section 1.5 will trigger automatically.',
        recommendedAction: 'ISSUE_SHOW_CAUSE',
        digitalSignature: 'SHA256:44b901a189f... [NIC Token]',
        signed: true,
        timestamp: '2026-10-20 11:20:00 IST'
      }
    ],
    escalationTier: 2,
    aphClauseReference: 'APH 2026-27 Chapter 1, Section 1.5 (Renewal Obligations)',
    sha256Hash: '1f82c8d1694a450e47896f45f761dac6116d299ecbe753d0774780ef5e53c5f9',
    ghostEncumbrance: {
    "hasLitigationHold": false,
    "njdgSyncTimestamp": "2026-10-25 09:00 IST"
},
    eoaStatus: {
    "isFrozen": false,
    "academicYear": "2027-28",
    "certificateNumber": "EOA-SWRO-2027-ACTIVE-7718",
    "canDownload": true
}
  },

  // 6b. Approaching Maturity Warning (42 Days)
  {
    id: 'FDR-06B-TECHNO-42DAYS',
    fdrNumber: 'SBI-2018-552910',
    institutionId: '1-88192044',
    institutionName: 'Techno India Institute of Technology, Salt Lake, Kolkata',
    aisheCode: 'C-33829',
    region: 'ERO',
    bankName: 'State Bank of India',
    branchName: 'Salt Lake Sector V, Kolkata',
    ifscCode: 'SBIN0006789',
    issueDate: '2018-12-07',
    maturityDate: '2026-12-07', // 42 days from 2026-10-26
    tenureYears: 8,
    principalAmount: 3500000,
    interestRatePct: 7.25,
    printedMaturityAmount: 6216270,
    mathExpectedMaturity: calculateQuarterlyCompoundedMaturity(3500000, 7.25, 8),
    lienPledgeClause: 'Held under joint custody with Member Secretary AICTE New Delhi.',
    lienValid: true,
    hasEitherSurvivorClause: false,
    category: 'Urban',
    approvedPrograms: [
      { programName: 'B.Tech IT & ECE (Intake 180)', intake: 180, normativeDepositPerProgram: 3500000 }
    ],
    requiredDeposit: 3500000,
    actualDeposit: 3500000,
    depositDeficit: 0,
    verificationStatus: 'BANK_CBS_CONFIRMED',
    status: 'APPROACHING_MATURITY',
    bankCbs: {
      confirmed: true,
      handshakeTimestamp: '2026-10-24T15:00:00 IST',
      hasEncumbrance: false,
      activeLienMarked: true,
      cbsReferenceNumber: 'CBS-SBI-2026-118290',
      bankBranchIfsc: 'SBIN0006789',
      remarks: 'Deposit in good standing. Maturing on 07-Dec-2026.'
    },
    forensics: {
      elaTamperingDetected: false,
      tamperedRegions: [],
      metadataModifiedBy: 'SBI CBS Host',
      fontMismatchDetected: false,
      trustScore: 98.9,
      mathMismatch: false,
      mathExpectedMaturity: calculateQuarterlyCompoundedMaturity(3500000, 7.25, 8),
      clausesFlagged: ['MATURITY_APPROACHING_T_MINUS_42_DAYS']
    },
    lineage: {
      isRenewal: false,
      coverageGapDays: 0,
      zeroGapVerified: true,
      history: [
        { fdrNumber: 'SBI-2018-552910', tenureYears: 8, issueDate: '2018-12-07', maturityDate: '2026-12-07', amount: 3500000, status: 'Active' }
      ]
    },
    fiveGates: {
      gate1TenureCompleted: false,
      gate1Details: '7.9 Years completed (42 days to maturity)',
      gate2BankCbsClear: true,
      gate2Details: 'CBS Verified',
      gate3ZeroEvcDeficiency: true,
      gate3Details: 'EVC Clear',
      gate4ZeroLegalHold: true,
      gate4Details: 'No holds',
      gate5BureauSanction: false,
      gate5Details: 'Pending lock-in completion',
      overallEligible: false,
      blockReason: 'Lock-in maturing in 42 days.'
    },
    greenSheetNotes: [],
    escalationTier: 1,
    aphClauseReference: 'APH 2026-27 Chapter 1, Section 1.5',
    sha256Hash: '7a8819bc2910fa88201a0918caef019283746192834719283019283746192834',
    ghostEncumbrance: {
    "hasLitigationHold": false,
    "njdgSyncTimestamp": "2026-10-24 15:00 IST"
},
    eoaStatus: {
    "isFrozen": false,
    "academicYear": "2027-28",
    "certificateNumber": "EOA-ERO-2027-ACTIVE-5529",
    "canDownload": true
}
  },

  // 6c. Approaching Maturity Warning (76 Days)
  {
    id: 'FDR-06C-SHRIRAM-76DAYS',
    fdrNumber: 'IDB-2019-119284',
    institutionId: '1-77192019',
    institutionName: 'Shri Ram College of Technology, Bhopal',
    aisheCode: 'C-22910',
    region: 'CRO',
    bankName: 'Indian Bank',
    branchName: 'MP Nagar Zone II, Bhopal',
    ifscCode: 'IDIB000B029',
    issueDate: '2019-01-10',
    maturityDate: '2027-01-10', // 76 days from 2026-10-26
    tenureYears: 8,
    principalAmount: 3500000,
    interestRatePct: 7.15,
    printedMaturityAmount: 6165580,
    mathExpectedMaturity: calculateQuarterlyCompoundedMaturity(3500000, 7.15, 8),
    lienPledgeClause: 'Exclusively pledged in favor of Member Secretary AICTE New Delhi.',
    lienValid: true,
    hasEitherSurvivorClause: false,
    category: 'Urban',
    approvedPrograms: [
      { programName: 'B.Tech Engineering (Intake 180)', intake: 180, normativeDepositPerProgram: 3500000 }
    ],
    requiredDeposit: 3500000,
    actualDeposit: 3500000,
    depositDeficit: 0,
    verificationStatus: 'BANK_CBS_CONFIRMED',
    status: 'APPROACHING_MATURITY',
    bankCbs: {
      confirmed: true,
      handshakeTimestamp: '2026-10-20T11:00:00 IST',
      hasEncumbrance: false,
      activeLienMarked: true,
      cbsReferenceNumber: 'CBS-IDB-2026-90192',
      bankBranchIfsc: 'IDIB000B029',
      remarks: 'FDR in order. Maturing in 76 days.'
    },
    forensics: {
      elaTamperingDetected: false,
      tamperedRegions: [],
      metadataModifiedBy: 'Indian Bank Core Banking Output',
      fontMismatchDetected: false,
      trustScore: 99.1,
      mathMismatch: false,
      mathExpectedMaturity: calculateQuarterlyCompoundedMaturity(3500000, 7.15, 8),
      clausesFlagged: ['MATURITY_APPROACHING_T_MINUS_76_DAYS']
    },
    lineage: {
      isRenewal: false,
      coverageGapDays: 0,
      zeroGapVerified: true,
      history: [
        { fdrNumber: 'IDB-2019-119284', tenureYears: 8, issueDate: '2019-01-10', maturityDate: '2027-01-10', amount: 3500000, status: 'Active' }
      ]
    },
    fiveGates: {
      gate1TenureCompleted: false,
      gate1Details: '7.8 Years completed',
      gate2BankCbsClear: true,
      gate2Details: 'CBS Verified',
      gate3ZeroEvcDeficiency: true,
      gate3Details: 'EVC Clear',
      gate4ZeroLegalHold: true,
      gate4Details: 'No holds',
      gate5BureauSanction: false,
      gate5Details: 'Pending lock-in completion',
      overallEligible: false,
      blockReason: 'Maturing in 76 days. Tier 1 advisory reminder sent.'
    },
    greenSheetNotes: [],
    escalationTier: 1,
    aphClauseReference: 'APH 2026-27 Chapter 1, Section 1.5',
    sha256Hash: '99a1829bc1029481902819284918293849182938491829384918293849182938',
    ghostEncumbrance: {
    "hasLitigationHold": false,
    "njdgSyncTimestamp": "2026-10-20 11:00 IST"
},
    eoaStatus: {
    "isFrozen": false,
    "academicYear": "2027-28",
    "certificateNumber": "EOA-CRO-2027-ACTIVE-1192",
    "canDownload": true
}
  },

  // 7. Matured & Unrenewed Overdue Escalation Case (12 Days Past Maturity)
  {
    id: 'FDR-07-IDB-OVERDUE',
    fdrNumber: 'IDB-2018-102938',
    institutionId: '1-66281099',
    institutionName: 'Oriental Institute of Technology, Patna',
    aisheCode: 'C-51829',
    region: 'ERO',
    bankName: 'Indian Bank',
    branchName: 'Patna Main Branch, Fraser Road',
    ifscCode: 'IDIB000P012',
    issueDate: '2018-10-14',
    maturityDate: '2026-10-14', // 12 days ago from 2026-10-26!
    tenureYears: 8,
    principalAmount: 3500000,
    interestRatePct: 7.20,
    printedMaturityAmount: 6191760,
    mathExpectedMaturity: calculateQuarterlyCompoundedMaturity(3500000, 7.20, 8),
    lienPledgeClause: 'Pledged to Member Secretary AICTE New Delhi.',
    lienValid: true,
    hasEitherSurvivorClause: false,
    category: 'Urban',
    approvedPrograms: [
      { programName: 'B.Tech Engineering (Intake 180)', intake: 180, normativeDepositPerProgram: 3500000 }
    ],
    requiredDeposit: 3500000,
    actualDeposit: 3500000,
    depositDeficit: 0,
    verificationStatus: 'BANK_CBS_CONFIRMED',
    status: 'OVERDUE',
    bankCbs: {
      confirmed: true,
      handshakeTimestamp: '2026-10-26T08:00:00 IST',
      hasEncumbrance: false,
      activeLienMarked: true,
      cbsReferenceNumber: 'CBS-IDB-MATURED-OVERDUE-01',
      bankBranchIfsc: 'IDIB000P012',
      remarks: 'FDR matured on 14-Oct-2026. Deposit is currently lying overdue without renewal instructions.'
    },
    forensics: {
      elaTamperingDetected: false,
      tamperedRegions: [],
      metadataModifiedBy: 'Indian Bank CBS Host',
      fontMismatchDetected: false,
      trustScore: 98.0,
      mathMismatch: false,
      mathExpectedMaturity: calculateQuarterlyCompoundedMaturity(3500000, 7.20, 8),
      clausesFlagged: ['INSTRUMENT_OVERDUE_12_DAYS', 'AUTOMATIC_EOA_FREEZE_TRIGGERED']
    },
    lineage: {
      isRenewal: false,
      coverageGapDays: 12,
      zeroGapVerified: false,
      history: [
        { fdrNumber: 'IDB-2018-102938', tenureYears: 8, issueDate: '2018-10-14', maturityDate: '2026-10-14', amount: 3500000, status: 'Matured' }
      ]
    },
    fiveGates: {
      gate1TenureCompleted: true,
      gate1Details: 'Tenure completed 14-Oct-2026',
      gate2BankCbsClear: true,
      gate2Details: 'Deposit confirmed at bank, but unrenewed',
      gate3ZeroEvcDeficiency: false,
      gate3Details: 'DEFICIENT: Institutional Security Corpus currently unrenewed and lapsed',
      gate4ZeroLegalHold: true,
      gate4Details: 'No court holds',
      gate5BureauSanction: false,
      gate5Details: 'ESCALATED: Regulation Bureau Head sanction required for penal freeze',
      overallEligible: false,
      blockReason: 'Instrument 12 days past maturity without replacement. APH Extension of Approval (EoA) portal frozen.'
    },
    greenSheetNotes: [
      {
        id: 'NOTE-007',
        date: '2026-10-26',
        author: 'Prof. Rajendra Prasad',
        designation: 'Advisor & Regulation Bureau Head',
        office: 'AICTE Headquarters, Nelson Mandela Marg, New Delhi',
        noteContent: 'TIER-3 ESCALATION SANCTION: Oriental Institute of Technology has failed to submit replacement FDR despite T-90, T-60, and T-15 automated notifications. Under APH 2026-27 Chapter 1 Section 1.5, the institution is in regulatory default. Ordered that: (1) Institution Extension of Approval (EoA 2027-28) portal is immediately FROZEN; (2) Formal show-cause notice dispatched; (3) State DTE notified of intake suspension risk.',
        recommendedAction: 'ESCALATE_TO_VIGILANCE',
        digitalSignature: 'SHA256:bb001192fa883... [Digitally Sanctioned by Bureau Head]',
        signed: true,
        timestamp: '2026-10-26 14:10:00 IST'
      }
    ],
    escalationTier: 3,
    aphClauseReference: 'APH 2026-27 Chapter 1, Section 1.5 & Section 1.7 (Penal Actions for Defaulters)',
    sha256Hash: 'a8b9c0d1e2f30415263748596a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b',
    ghostEncumbrance: {
    "hasLitigationHold": false,
    "njdgSyncTimestamp": "2026-10-26 08:00 IST"
},
    eoaStatus: {
    "isFrozen": true,
    "academicYear": "2027-28",
    "freezeReason": "AUTOMATIC PENAL FREEZE: Instrument lapsed past maturity by 12 days without renewal lineage (APH 1.5)",
    "frozenDate": "2026-10-15",
    "certificateNumber": "EOA-ERO-2027-FROZEN-1029",
    "canDownload": false
}
  },

  // 8. Renewed FDR with Complete Lineage Chain (Zero Gap Verified)
  {
    id: 'FDR-08-BMS-RENEWED',
    fdrNumber: 'SBI-2026-8812',
    institutionId: '1-22910488',
    institutionName: 'BMS College of Engineering, Bengaluru',
    aisheCode: 'C-13920',
    region: 'SWRO',
    bankName: 'State Bank of India',
    branchName: 'Bull Temple Road, Basavanagudi, Bengaluru',
    ifscCode: 'SBIN0040003',
    issueDate: '2026-03-31',
    maturityDate: '2034-03-31',
    tenureYears: 8,
    principalAmount: 3500000,
    interestRatePct: 7.30,
    printedMaturityAmount: 6241030,
    mathExpectedMaturity: calculateQuarterlyCompoundedMaturity(3500000, 7.30, 8),
    lienPledgeClause: 'Pledged jointly in favor of Member Secretary, AICTE New Delhi as renewal of FDR #SBI-2018-9941.',
    lienValid: true,
    hasEitherSurvivorClause: false,
    category: 'Urban',
    approvedPrograms: [
      { programName: 'B.Tech Engineering (Intake 240)', intake: 240, normativeDepositPerProgram: 3500000 }
    ],
    requiredDeposit: 3500000,
    actualDeposit: 3500000,
    depositDeficit: 0,
    verificationStatus: 'BANK_CBS_CONFIRMED',
    status: 'RENEWED',
    bankCbs: {
      confirmed: true,
      handshakeTimestamp: '2026-04-02T10:30:00 IST',
      hasEncumbrance: false,
      activeLienMarked: true,
      cbsReferenceNumber: 'CBS-SBI-REN-2026-00918',
      bankBranchIfsc: 'SBIN0040003',
      remarks: 'Renewal verified. Old FDR #SBI-2018-9941 rolled over into #SBI-2026-8812 with continuous AICTE lien.'
    },
    forensics: {
      elaTamperingDetected: false,
      tamperedRegions: [],
      metadataModifiedBy: 'State Bank SFMS Automated Certificate Engine',
      fontMismatchDetected: false,
      trustScore: 99.8,
      mathMismatch: false,
      mathExpectedMaturity: calculateQuarterlyCompoundedMaturity(3500000, 7.30, 8),
      clausesFlagged: []
    },
    lineage: {
      isRenewal: true,
      previousFdrNumber: 'SBI-2018-9941',
      previousMaturityDate: '2026-03-31',
      newIssueDate: '2026-03-31',
      coverageGapDays: 0,
      zeroGapVerified: true,
      history: [
        { fdrNumber: 'SBI-2018-9941', tenureYears: 8, issueDate: '2018-03-31', maturityDate: '2026-03-31', amount: 3500000, status: 'Matured' },
        { fdrNumber: 'SBI-2026-8812', tenureYears: 8, issueDate: '2026-03-31', maturityDate: '2034-03-31', amount: 3500000, status: 'Active' }
      ]
    },
    fiveGates: {
      gate1TenureCompleted: false,
      gate1Details: 'New 8-year renewal tenure active (2026-2034)',
      gate2BankCbsClear: true,
      gate2Details: 'CBS Verified renewal with continuous lien',
      gate3ZeroEvcDeficiency: true,
      gate3Details: 'EVC Clear: NAAC A++ Autonomous College',
      gate4ZeroLegalHold: true,
      gate4Details: 'Zero legal disputes',
      gate5BureauSanction: false,
      gate5Details: 'Not applicable (Active Renewal in effect)',
      overallEligible: false,
      blockReason: 'Active renewed instrument with zero coverage gap.'
    },
    greenSheetNotes: [
      {
        id: 'NOTE-008',
        date: '2026-04-03',
        author: 'Dr. C. G. Sreenivasa',
        designation: 'Regional Scrutiny Officer',
        office: 'AICTE South Western Regional Office (SWRO Bengaluru)',
        noteContent: 'RENEWAL LINEAGE VERIFICATION: Replacement FDR #SBI-2026-8812 submitted against matured instrument #SBI-2018-9941. Lineage tracker verifies issue date matches maturity date exactly (Coverage Gap = 0 Days). Bank CBS confirms uninterrupted AICTE lien endorsement. Renewal recorded in Central Master.',
        recommendedAction: 'APPROVE_AND_LOCK',
        digitalSignature: 'SHA256:9011928374a... [NIC Token Verified]',
        signed: true,
        timestamp: '2026-04-03 15:20:00 IST'
      }
    ],
    escalationTier: 0,
    aphClauseReference: 'APH 2026-27 Chapter 1, Section 1.5 (Renewal Lineage Verification)',
    sha256Hash: 'bc41029384819203847192847192837481928374819283748192837481928374',
    ghostEncumbrance: {
    "hasLitigationHold": false,
    "njdgSyncTimestamp": "2026-04-02 10:00 IST"
},
    eoaStatus: {
    "isFrozen": false,
    "academicYear": "2027-28",
    "certificateNumber": "EOA-SWRO-2027-ACTIVE-8812",
    "canDownload": true
}
  },

  // 9. Eligible Release / Refund Case (All 5 Gates Passed)
  {
    id: 'FDR-09-MNIT-RELEASE-ELIGIBLE',
    fdrNumber: 'SBI-2018-004128',
    institutionId: '1-55102933',
    institutionName: 'Malaviya National Institute of Engineering (Autonomous), Jaipur',
    aisheCode: 'C-11209',
    region: 'NWRO',
    bankName: 'State Bank of India',
    branchName: 'MNIT Campus Branch, JLN Marg, Jaipur',
    ifscCode: 'SBIN0031122',
    issueDate: '2018-09-10',
    maturityDate: '2026-09-10', // Completed 8 years in Sep 2026!
    tenureYears: 8,
    principalAmount: 3500000,
    interestRatePct: 7.25,
    printedMaturityAmount: 6216270,
    mathExpectedMaturity: calculateQuarterlyCompoundedMaturity(3500000, 7.25, 8),
    lienPledgeClause: 'Pledged jointly in favor of Member Secretary AICTE New Delhi.',
    lienValid: true,
    hasEitherSurvivorClause: false,
    category: 'Urban',
    approvedPrograms: [
      { programName: 'B.Tech Engineering & Architecture (Intake 240)', intake: 240, normativeDepositPerProgram: 3500000 }
    ],
    requiredDeposit: 3500000,
    actualDeposit: 3500000,
    depositDeficit: 0,
    verificationStatus: 'RELEASE_READY',
    status: 'RELEASE_REQUESTED',
    bankCbs: {
      confirmed: true,
      handshakeTimestamp: '2026-10-24T12:00:00 IST',
      hasEncumbrance: false,
      activeLienMarked: true,
      cbsReferenceNumber: 'CBS-SBI-JAIPUR-901928',
      bankBranchIfsc: 'SBIN0031122',
      remarks: 'FDR completed 8-year lock-in. Bank CBS confirmed unencumbered. Awaiting AICTE Discharge Order.'
    },
    forensics: {
      elaTamperingDetected: false,
      tamperedRegions: [],
      metadataModifiedBy: 'SBI Core Banking Production System',
      fontMismatchDetected: false,
      trustScore: 99.7,
      mathMismatch: false,
      mathExpectedMaturity: calculateQuarterlyCompoundedMaturity(3500000, 7.25, 8),
      clausesFlagged: []
    },
    lineage: {
      isRenewal: false,
      coverageGapDays: 0,
      zeroGapVerified: true,
      history: [
        { fdrNumber: 'SBI-2018-004128', tenureYears: 8, issueDate: '2018-09-10', maturityDate: '2026-09-10', amount: 3500000, status: 'Matured' }
      ]
    },
    fiveGates: {
      gate1TenureCompleted: true,
      gate1Details: 'PASS: Full 8-year lock-in completed on 10-Sep-2026 (APH Clause 1.6(a))',
      gate2BankCbsClear: true,
      gate2Details: 'PASS: Live Bank CBS Handshake confirms unencumbered corpus, zero loans',
      gate3ZeroEvcDeficiency: true,
      gate3Details: 'PASS: Final EVC Scrutiny Report confirms zero faculty or infrastructure deficiency',
      gate4ZeroLegalHold: true,
      gate4Details: 'PASS: AICTE Vigilance and Student Grievance Portal reports zero pending complaints',
      gate5BureauSanction: false,
      gate5Details: 'PENDING: Awaiting Competent Authority (Regulation Bureau Head) Digital Sanction under Rule 14.2',
      overallEligible: false,
      blockReason: 'Awaiting Gate 5 Competent Authority Digital Sanction. Gates 1 to 4 successfully satisfied.',
      dischargeOrderNumber: 'F.No. AICTE/RB/DISCHARGE/2026/NWRO/0912'
    },
    greenSheetNotes: [
      {
        id: 'NOTE-009',
        date: '2026-10-25',
        author: 'Prof. Rajendra Prasad',
        designation: 'Advisor & Regulation Bureau Head',
        office: 'AICTE Headquarters, New Delhi',
        noteContent: 'FINAL SANCTION FOR RELEASE: College has successfully completed the mandatory 8-year lock-in. All 5 regulatory gates stand satisfied with zero deficiencies. Sanction is hereby accorded for the release of FDR #SBI-2018-004128 amounting to ₹35,00,000 along with accrued interest. Issue formal QR-coded Discharge Order addressed to SBI Branch Manager.',
        recommendedAction: 'SANCTION_DISCHARGE',
        digitalSignature: 'SHA256:3910f2a9910... [NIC Digital Token - Bureau Head]',
        signed: true,
        timestamp: '2026-10-25 18:20:00 IST'
      }
    ],
    escalationTier: 0,
    aphClauseReference: 'APH 2026-27 Chapter 1, Section 1.6 (Refund and Release Protocol)',
    sha256Hash: '11223344556677889900aabbccddeeff00112233445566778899aabbccddeeff',
    ghostEncumbrance: {
    "hasLitigationHold": false,
    "njdgSyncTimestamp": "2026-10-24 12:00 IST"
},
    eoaStatus: {
    "isFrozen": false,
    "academicYear": "2027-28",
    "certificateNumber": "EOA-NWRO-2027-ACTIVE-0041",
    "canDownload": true
}
  },

  // 10. Blocked Release / Refund Case
  {
    id: 'FDR-10-GREENWOOD-BLOCKED',
    fdrNumber: 'PNB-2021-667102',
    institutionId: '1-88291055',
    institutionName: 'Greenwood Institute of Engineering & Technology, Lucknow',
    aisheCode: 'C-33910',
    region: 'NRO',
    bankName: 'Punjab National Bank',
    branchName: 'Hazratganj Branch, Lucknow',
    ifscCode: 'PUNB0012900',
    issueDate: '2021-07-20',
    maturityDate: '2029-07-20',
    tenureYears: 8,
    principalAmount: 3500000,
    interestRatePct: 7.10,
    printedMaturityAmount: 6139560,
    mathExpectedMaturity: calculateQuarterlyCompoundedMaturity(3500000, 7.10, 8),
    lienPledgeClause: 'Pledged jointly to Member Secretary AICTE New Delhi.',
    lienValid: true,
    hasEitherSurvivorClause: false,
    category: 'Urban',
    approvedPrograms: [
      { programName: 'B.Tech Engineering (Intake 180)', intake: 180, normativeDepositPerProgram: 3500000 }
    ],
    requiredDeposit: 3500000,
    actualDeposit: 3500000,
    depositDeficit: 0,
    verificationStatus: 'BANK_CBS_CONFIRMED',
    status: 'RELEASE_REQUESTED',
    bankCbs: {
      confirmed: true,
      handshakeTimestamp: '2026-10-25T14:10:00 IST',
      hasEncumbrance: false,
      activeLienMarked: true,
      cbsReferenceNumber: 'CBS-PNB-2026-LKO-991',
      bankBranchIfsc: 'PUNB0012900',
      remarks: 'Deposit valid in CBS. AICTE lien intact.'
    },
    forensics: {
      elaTamperingDetected: false,
      tamperedRegions: [],
      metadataModifiedBy: 'PNB Core Banking Host',
      fontMismatchDetected: false,
      trustScore: 97.5,
      mathMismatch: false,
      mathExpectedMaturity: calculateQuarterlyCompoundedMaturity(3500000, 7.10, 8),
      clausesFlagged: ['PREMATURE_RELEASE_REQUEST_AT_5_YEARS', 'PENDING_FACULTY_SALARY_EVC_DEFICIENCY']
    },
    lineage: {
      isRenewal: false,
      coverageGapDays: 0,
      zeroGapVerified: true,
      history: [
        { fdrNumber: 'PNB-2021-667102', tenureYears: 8, issueDate: '2021-07-20', maturityDate: '2029-07-20', amount: 3500000, status: 'Active' }
      ]
    },
    fiveGates: {
      gate1TenureCompleted: false,
      gate1Details: 'FAILED: Only 5.2 years elapsed of mandatory 8-year lock-in period (APH Clause 1.6(a))',
      gate2BankCbsClear: true,
      gate2Details: 'PASS: CBS indicates unencumbered deposit',
      gate3ZeroEvcDeficiency: false,
      gate3Details: 'FAILED: Active EVC Inspection Deficiency #EVC-NRO-2026-819 (Arrears of 7th CPC Faculty Salaries & Deficient Cadre Ratio)',
      gate4ZeroLegalHold: true,
      gate4Details: 'PASS: No court stay order',
      gate5BureauSanction: false,
      gate5Details: 'REJECTED: Competent Authority refused sanction under Rule 14.2',
      overallEligible: false,
      blockReason: 'Release application rejected: Premature application at 5 years + Outstanding EVC Faculty Salary Deficiency.'
    },
    greenSheetNotes: [
      {
        id: 'NOTE-010',
        date: '2026-10-26',
        author: 'Dr. Alok Verma',
        designation: 'Regional Scrutiny Officer',
        office: 'AICTE Northern Regional Office (NRO Kanpur)',
        noteContent: 'REJECTION OF RELEASE PETITION: Greenwood Institute has requested premature refund of security deposit after only 5.2 years of operation. Furthermore, the college is facing pending compliance issues under EVC Report Ref: EVC-NRO-2026-819 concerning unpaid faculty salaries. Release is strictly prohibited under APH Chapter 1 Clause 1.6(a). Release order generation BLOCKED.',
        recommendedAction: 'REJECT_UNENCUMBERED',
        digitalSignature: 'SHA256:889911fa002... [Signed by Scrutiny Officer]',
        signed: true,
        timestamp: '2026-10-26 15:00:00 IST'
      }
    ],
    escalationTier: 0,
    aphClauseReference: 'APH 2026-27 Chapter 1, Section 1.6(a) & (c)',
    sha256Hash: '99887766554433221100ffeeddccbbaa99887766554433221100ffeeddccbbaa',
    ghostEncumbrance: {
    "hasLitigationHold": false,
    "njdgSyncTimestamp": "2026-10-25 14:00 IST"
},
    eoaStatus: {
    "isFrozen": true,
    "academicYear": "2027-28",
    "freezeReason": "REGULATORY DEFICIENCY HOLD: Premature 5-Year Release Petition & Active Faculty Salary Arrears",
    "frozenDate": "2026-10-25",
    "certificateNumber": "EOA-NRO-2027-FROZEN-6671",
    "canDownload": false
}
  }
];

export const INITIAL_ESCALATION_LOGS: EscalationDispatchLog[] = [
  {
    id: 'LOG-01',
    fdrId: 'FDR-07-IDB-OVERDUE',
    fdrNumber: 'IDB-2018-102938',
    institutionName: 'Oriental Institute of Technology, Patna',
    tier: 3,
    channel: 'NIC_E_OFFICE',
    recipient: 'Regulation Bureau Head, AICTE HQ & Principal Secretary Higher Ed, Bihar',
    subject: 'DEFAULT NOTICE: AICTE Security Deposit Unrenewed Past Maturity (APH 1.5 Penal Action)',
    messageBody: 'URGENT REGULATORY ACTION: Instrument #IDB-2018-102938 of ₹35,00,000 has lapsed 12 days ago without replacement. EoA portal has been placed under freeze. Institution is liable for intake reduction.',
    timestamp: '2026-10-26 14:15:00 IST',
    deliveryStatus: 'DELIVERED'
  },
  {
    id: 'LOG-02',
    fdrId: 'FDR-06A-ROYAL-14DAYS',
    fdrNumber: 'BOB-2018-771829',
    institutionName: 'Royal College of Engineering & Technology, Thrissur',
    tier: 2,
    channel: 'WHATSAPP_WEBHOOK',
    recipient: '+91 94471 28910 (Principal) & SWRO Scrutiny Desk',
    subject: 'CRITICAL REMINDER: AICTE FDR Maturing in 14 Days',
    messageBody: 'Dear Principal, Security Deposit FDR #BOB-2018-771829 matures on 09-Nov-2026. Please upload renewal deposit or discharge application via AICTE KOSH-Rakshak portal immediately to prevent regulatory freeze.',
    timestamp: '2026-10-26 09:30:00 IST',
    deliveryStatus: 'DELIVERED'
  },
  {
    id: 'LOG-03',
    fdrId: 'FDR-06B-TECHNO-42DAYS',
    fdrNumber: 'SBI-2018-552910',
    institutionName: 'Techno India Institute of Technology, Salt Lake',
    tier: 1,
    channel: 'EMAIL',
    recipient: 'nodal.officer@technoindia.edu.in, registrar@technoindia.edu.in',
    subject: 'AICTE Regulatory Notice: FDR Maturing in 42 Days',
    messageBody: 'Notice under APH 2026-27 Section 1.5: Fixed Deposit Receipt #SBI-2018-552910 (₹35,00,000) will mature on 07-Dec-2026. Initiate renewal workflow at bank to ensure continuous lien coverage.',
    timestamp: '2026-10-26 08:00:00 IST',
    deliveryStatus: 'DELIVERED'
  },
  {
    id: 'LOG-04',
    fdrId: 'FDR-04-BOB-OVERDRAFT',
    fdrNumber: 'BOB-2021-992318',
    institutionName: 'Saraswati College of Engineering, Navi Mumbai',
    tier: 3,
    channel: 'EMAIL',
    recipient: 'governing.council@scoe.edu.in, vashi.bm@bankofbaroda.com',
    subject: 'SHOW-CAUSE NOTICE: Unauthorized Overdraft Loan Against Pledged AICTE Security Deposit',
    messageBody: 'Finacle CBS verification reveals active overdraft facility of ₹22,00,000 against pledged instrument. AICTE lien has been compromised. Rectify within 7 working days failing which penal clauses of Appendix 16 will apply.',
    timestamp: '2026-10-26 11:30:00 IST',
    deliveryStatus: 'DELIVERED'
  }
];

export const INITIAL_AUDIT_BLOCKS: AuditBlock[] = [
  {
    blockIndex: 0,
    timestamp: '2026-10-26 09:00:00 IST',
    userRole: 'BUREAU_HEAD',
    userIdentifier: 'ADV-REG-HQ-01',
    ipAddress: '10.24.18.9 (NIC RailTel VPN)',
    action: 'GENESIS_PORTAL_INITIALIZATION',
    details: 'AICTE KOSH-Rakshak Genesis Ledger established under APH 2026-27 mandate.',
    previousHash: '0000000000000000000000000000000000000000000000000000000000000000',
    currentHash: '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
    isValid: true
  },
  {
    blockIndex: 1,
    timestamp: '2026-10-26 10:15:22 IST',
    userRole: 'REGIONAL_OFFICER',
    userIdentifier: 'RO-WRO-MUMBAI-04',
    ipAddress: '14.139.112.44 (WRO NIC Gateway)',
    action: 'BANK_CBS_QUERY_EXECUTED',
    details: 'Dual-Source Bank CBS query triggered for BOB-2021-992318. Secret Overdraft of ₹22,00,000 uncovered.',
    previousHash: '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
    currentHash: 'b4a8e0f6c2d11e9a08f5d6c7b8a912e34f567890abcdef1234567890abcdef12',
    isValid: true
  },
  {
    blockIndex: 2,
    timestamp: '2026-10-26 11:45:10 IST',
    userRole: 'INSTITUTION_NODAL',
    userIdentifier: 'NODAL-APEX-1-482910411',
    ipAddress: '115.242.18.99 (Apex Campus Meerut)',
    action: 'FDR_DEPOSIT_RECEIPT_SUBMITTED',
    details: 'Apex Institute of Technology & Management (AICTE ID: 1-482910411) submitted FDR #PNB-2024-419208 claiming ₹35,00,000 security deposit for B.Tech program.',
    previousHash: 'b4a8e0f6c2d11e9a08f5d6c7b8a912e34f567890abcdef1234567890abcdef12',
    currentHash: 'c1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2',
    isValid: true
  },
  {
    blockIndex: 3,
    timestamp: '2026-10-26 12:30:15 IST',
    userRole: 'REGIONAL_OFFICER',
    userIdentifier: 'RO-NRO-KANPUR-02',
    ipAddress: '14.139.60.18 (NRO Campus)',
    action: 'FORENSIC_ELA_SCAN_COMPLETED',
    details: '6-Layer Forensic Engine analyzed FDR #PNB-2024-419208 (Apex Institute of Technology). ELA tampering flagged in Principal box + Actuarial math mismatch of ₹35.08 Lakhs.',
    previousHash: 'c1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2',
    currentHash: 'c7d8e9f0a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef012345678',
    isValid: true
  },
  {
    blockIndex: 4,
    timestamp: '2026-10-26 14:10:00 IST',
    userRole: 'BUREAU_HEAD',
    userIdentifier: 'ADV-REG-HQ-01',
    ipAddress: '10.24.18.9 (AICTE HQ Delhi)',
    action: 'TIER3_DEFAULT_ESCALATION_SANCTIONED',
    details: 'Overdue instrument #IDB-2018-102938 placed under statutory EoA freeze.',
    previousHash: 'c7d8e9f0a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef012345678',
    currentHash: 'd8e9f01234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    isValid: true
  },
  {
    blockIndex: 5,
    timestamp: '2026-10-26 15:45:00 IST',
    userRole: 'BUREAU_HEAD',
    userIdentifier: 'ADV-REG-HQ-01',
    ipAddress: '10.24.18.9 (AICTE HQ Delhi)',
    action: 'FIVE_GATE_DISCHARGE_ORDER_ISSUED',
    details: 'FDR #SBI-2018-004128 passed all 5 gates. Official QR Release Order F.No. AICTE/RB/DISCHARGE/2026/NWRO/0912 generated.',
    previousHash: 'd8e9f01234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    currentHash: 'e9f01234567890abcdef1234567890abcdef1234567890abcdef123456789012',
    isValid: true
  }
];

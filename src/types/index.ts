export type ActiveRole = 'college' | 'regional' | 'bureau' | 'bank';

export type UserRole = 
  | ActiveRole
  | 'INSTITUTION_NODAL' 
  | 'REGIONAL_OFFICER' 
  | 'BUREAU_HEAD' 
  | 'BANK_NODE';

export type RegionalOffice = 'SRO' | 'WRO' | 'NRO' | 'ERO' | 'SWRO' | 'SCRO' | 'NWRO' | 'CRO';

export type InstrumentStatus = 
  | 'ACTIVE' 
  | 'DISCREPANCY_FLAGGED' 
  | 'APPROACHING_MATURITY' 
  | 'OVERDUE' 
  | 'RENEWED' 
  | 'RELEASE_REQUESTED' 
  | 'RELEASED';

export type VerificationStage = 
  | 'PENDING_SCRUTINY' 
  | 'AI_FORENSIC_CLEARED' 
  | 'BANK_CBS_CONFIRMED' 
  | 'DISCREPANCY_FLAGGED' 
  | 'RELEASE_READY' 
  | 'RELEASED';

export interface TamperedRegion {
  id: string;
  label: string;
  xPct: number;
  yPct: number;
  widthPct: number;
  heightPct: number;
  description: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
}

export interface ApprovedProgramNorm {
  programName: string;
  intake: number;
  normativeDepositPerProgram: number;
}

export interface BankCbsStatus {
  confirmed: boolean;
  handshakeTimestamp?: string;
  hasEncumbrance: boolean;
  overdraftLoanAmount?: number;
  activeLienMarked: boolean;
  cbsReferenceNumber?: string;
  bankBranchIfsc?: string;
  remarks?: string;
}

export interface ForensicDetails {
  elaTamperingDetected: boolean;
  tamperedRegions: TamperedRegion[];
  metadataModifiedBy?: string;
  fontMismatchDetected: boolean;
  trustScore: number; // 0 to 100%
  mathMismatch: boolean;
  mathExpectedMaturity: number;
  mathDiscrepancyDelta?: number;
  clausesFlagged: string[];
}

export interface LineageHistoryItem {
  fdrNumber: string;
  tenureYears: number;
  issueDate: string;
  maturityDate: string;
  amount: number;
  status: 'Matured' | 'Active' | 'Superseded';
}

export interface LineageDetails {
  isRenewal: boolean;
  previousFdrNumber?: string;
  previousMaturityDate?: string;
  newIssueDate?: string;
  coverageGapDays: number;
  zeroGapVerified: boolean;
  history: LineageHistoryItem[];
}

export interface FiveGateChecklist {
  gate1TenureCompleted: boolean;
  gate1Details: string;
  gate2BankCbsClear: boolean;
  gate2Details: string;
  gate3ZeroEvcDeficiency: boolean;
  gate3Details: string;
  gate4ZeroLegalHold: boolean;
  gate4Details: string;
  gate5BureauSanction: boolean;
  gate5Details: string;
  overallEligible: boolean;
  blockReason?: string;
  dischargeOrderNumber?: string;
  dischargeIssuedDate?: string;
}

export interface GreenSheetNote {
  id: string;
  date: string;
  author: string;
  designation: string;
  office: string;
  noteContent: string;
  recommendedAction: 'APPROVE_AND_LOCK' | 'ISSUE_SHOW_CAUSE' | 'ESCALATE_TO_VIGILANCE' | 'REJECT_UNENCUMBERED' | 'SANCTION_DISCHARGE';
  digitalSignature: string;
  signed: boolean;
  timestamp: string;
}

export interface GhostEncumbranceDetails {
  hasLitigationHold: boolean;
  caseNumber?: string;
  courtName?: string;
  petitioner?: string;
  respondent?: string;
  stayDetails?: string;
  njdgSyncTimestamp?: string;
  affidavitSummary?: string;
  clearedByOfficer?: boolean;
  clearedAt?: string;
  clearedRemarks?: string;
}

export interface EoaRegulatoryStatus {
  isFrozen: boolean;
  academicYear: string;
  freezeReason?: string;
  frozenDate?: string;
  certificateNumber: string;
  canDownload: boolean;
}

export interface FDRInstrument {
  id: string;
  fdrNumber: string;
  institutionId: string;
  institutionName: string;
  aisheCode: string;
  region: RegionalOffice;
  bankName: string;
  branchName: string;
  ifscCode: string;
  issueDate: string; // YYYY-MM-DD
  maturityDate: string; // YYYY-MM-DD
  tenureYears: number;
  principalAmount: number;
  interestRatePct: number;
  printedMaturityAmount: number;
  mathExpectedMaturity: number;
  lienPledgeClause: string;
  lienValid: boolean;
  hasEitherSurvivorClause: boolean;
  category: 'Urban' | 'Rural';
  approvedPrograms: ApprovedProgramNorm[];
  requiredDeposit: number;
  actualDeposit: number;
  depositDeficit: number;
  verificationStatus: VerificationStage;
  status: InstrumentStatus;
  bankCbs: BankCbsStatus;
  forensics: ForensicDetails;
  lineage: LineageDetails;
  fiveGates: FiveGateChecklist;
  greenSheetNotes: GreenSheetNote[];
  escalationTier: 0 | 1 | 2 | 3;
  ghostEncumbrance: GhostEncumbranceDetails;
  eoaStatus: EoaRegulatoryStatus;
  aphClauseReference: string;
  sha256Hash: string;
}

export interface EscalationDispatchLog {
  id: string;
  fdrId: string;
  fdrNumber: string;
  institutionName: string;
  tier: 1 | 2 | 3;
  channel: 'EMAIL' | 'SMS' | 'WHATSAPP_WEBHOOK' | 'NIC_E_OFFICE';
  recipient: string;
  subject: string;
  messageBody: string;
  timestamp: string;
  deliveryStatus: 'DELIVERED' | 'ACKNOWLEDGED' | 'QUEUED';
}

export interface AuditBlock {
  blockIndex: number;
  timestamp: string;
  userRole: UserRole;
  userIdentifier: string;
  ipAddress: string;
  action: string;
  details: string;
  previousHash: string;
  currentHash: string;
  isValid?: boolean;
}

export interface DemoPreset {
  id: string;
  name: string;
  badge: string;
  description: string;
  fdrData: Partial<FDRInstrument>;
}

export interface DeficiencyNoticePayload {
  id: string;
  fdrId: string;
  fdrNumber: string;
  institutionId: string;
  institutionName: string;
  nodalOfficerEmail: string;
  nodalOfficerName: string;
  memoReferenceNumber: string;
  dispatchedAt: string;
  deliveryStatus: 'DELIVERED' | 'DISPATCHED' | 'ACKNOWLEDGED';
  failedGates: string[];
  failureReasons: string[];
  correctiveActions: string[];
  statutoryClauses: string[];
  rectificationDeadline: string;
  academicYearHold: string;
  emailSubject: string;
  emailHeaders: {
    from: string;
    to: string;
    cc: string;
    messageId: string;
    signingAuthority: string;
  };
  summaryNotice: string;
}

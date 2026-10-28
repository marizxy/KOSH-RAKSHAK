export type UserRole = 'COLLEGE' | 'RO' | 'HQ' | 'BANK';

export interface Institution {
  id: string;
  permanentId: string;
  name: string;
  aisheCode: string;
  region: 'SRO' | 'NRO' | 'WRO' | 'ERO' | 'NWRO' | 'SWRO' | 'CRO' | 'SCRO';
  state: string;
  city: string;
  category: 'Urban' | 'Rural';
  nodalOfficerName: string;
  nodalOfficerEmail: string;
  nodalOfficerMobile: string;
  eoaStatus: 'NORMAL' | 'FROZEN_PENDING_INSPECTION' | 'EOA_WITHHELD' | 'PENALTY_PROCEEDINGS';
}

export interface FDRInstrument {
  id: string;
  fdrNumber: string;
  institutionId: string;
  institutionName: string;
  region: string;
  bankName: string;
  bankCode: string;
  branchName: string;
  ifscCode: string;
  issueDate: string;
  maturityDate: string;
  tenureYears: number;
  principalAmount: number;
  interestRatePct: number;
  printedMaturityAmount: number;
  mathExpectedMaturity: number;
  lienPledgeClause: string;
  hasEitherSurvivorClause: boolean;
  requiredDeposit: number;
  actualDeposit: number;
  depositDeficit: number;
  status: 'ACTIVE' | 'MATURING_SOON' | 'EXPIRED' | 'DEFICIT_PENALTY' | 'FLAGGED' | 'RELEASED';
  verificationStatus: 'PENDING_UPLOAD' | 'BANK_CBS_CONFIRMED' | 'DISCREPANCY_FLAGGED' | 'PENDING_BANK_CONFIRMATION';
  sha256Hash: string;
  lastInspectedAt?: string;
}

export interface AuditBlock {
  blockIndex: number;
  timestamp: string;
  userRole: string;
  userIdentifier: string;
  ipAddress?: string;
  action: string;
  details: string;
  previousHash: string;
  currentHash: string;
  isValid: boolean;
}

export interface ReleaseGateStatus {
  cleared: boolean;
  signedBy?: string | null;
  date?: string | null;
  remarks?: string;
}

export interface FiveGateReleaseRecord {
  fdrId: string;
  fdrNumber: string;
  collegeName: string;
  gates: {
    gate1_no_dues: ReleaseGateStatus;
    gate2_dual_source_bank: ReleaseGateStatus;
    gate3_eoa_clean: ReleaseGateStatus;
    gate4_litigation_clear: ReleaseGateStatus;
    gate5_bureau_head_sanction: ReleaseGateStatus;
  };
  status: 'INCOMPLETE_GATES' | 'READY_FOR_FINAL_SANCTION' | 'DISCHARGED';
  dischargeOrderNumber?: string | null;
}

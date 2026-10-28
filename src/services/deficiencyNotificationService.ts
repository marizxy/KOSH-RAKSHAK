import { FDRInstrument, DeficiencyNoticePayload, EscalationDispatchLog } from '../types';
import { formatGovDate } from '../utils/formatters';

/**
 * Institutional Nodal Officer Contact Registry
 */
export const INSTITUTIONAL_CONTACT_MAP: Record<string, { name: string; email: string; phone: string }> = {
  '1-482910411': {
    name: 'Dr. S. K. Sharma (Principal & Director)',
    email: 'nodal.officer@apexmeerut.ac.in',
    phone: '+91 98371 44021',
  },
  '1-88291055': {
    name: 'Dr. Rajesh Srivastava (Director & Nodal Head)',
    email: 'nodal.director@greenwoodlucknow.edu.in',
    phone: '+91 94150 99214',
  },
  '1-77291024': {
    name: 'Dr. M. S. Gaikwad (Principal & Registrar)',
    email: 'principal@saraswaticoe.ac.in',
    phone: '+91 98220 19284',
  },
  '1-99201948': {
    name: 'Prof. T. V. Rao (Dean & Institutional Nodal Officer)',
    email: 'nodal.officer@stxaviershyd.edu.in',
    phone: '+91 94401 88291',
  },
  '1-90182744': {
    name: 'Dr. Ananya Roy (Registrar & Statutory Compliance Officer)',
    email: 'registrar@metrocity.edu.in',
    phone: '+91 98450 33910',
  },
  '1-66281099': {
    name: 'Prof. A. K. Verma (Director & Authorized Signatory)',
    email: 'director@orientalpatna.ac.in',
    phone: '+91 94310 10293',
  },
  '1-66291033': {
    name: 'Dr. K. Mathew (Principal)',
    email: 'principal@royalcet.ac.in',
    phone: '+91 94471 28910',
  },
  '1-88192044': {
    name: 'Prof. S. Banerjee (Registrar & Nodal Officer)',
    email: 'nodal.officer@technoindia.edu.in',
    phone: '+91 98300 55291',
  },
  '1-77192019': {
    name: 'Dr. P. K. Sharma (Director)',
    email: 'director@shriram.edu.in',
    phone: '+91 94250 11928',
  },
  '1-10294811': {
    name: 'Dr. V. Velmurugan (Dean & Authorized Officer)',
    email: 'registrar@annauniv.edu',
    phone: '+91 94440 88192',
  },
  '1-22910488': {
    name: 'Dr. S. Muralidhara (Principal)',
    email: 'principal@bmsce.ac.in',
    phone: '+91 98440 22910',
  },
  '1-55102933': {
    name: 'Dr. R. K. Vyas (Registrar)',
    email: 'registrar@mnit.ac.in',
    phone: '+91 94140 55102',
  },
};

/**
 * Get institutional contact details with deterministic fallback
 */
export const getNodalOfficerContact = (inst: FDRInstrument) => {
  if (INSTITUTIONAL_CONTACT_MAP[inst.institutionId]) {
    return INSTITUTIONAL_CONTACT_MAP[inst.institutionId];
  }
  const domain = inst.institutionName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 12);
  return {
    name: 'Institutional Nodal Officer & Registrar',
    email: `nodal.officer@${domain}.edu.in`,
    phone: '+91 98100 00000',
  };
};

/**
 * Builds an official statutory deficiency payload from an evaluated FDRInstrument
 */
export const buildDeficiencyPayload = (
  inst: FDRInstrument,
  simulatedDate: string
): DeficiencyNoticePayload => {
  const contact = getNodalOfficerContact(inst);
  const gates = inst.fiveGates;

  const failedGates: string[] = [];
  const failureReasons: string[] = [];
  const correctiveActions: string[] = [];
  const statutoryClauses: string[] = [];

  // Gate 1: Lock-in tenure check
  if (!gates.gate1TenureCompleted) {
    failedGates.push('Gate 1: Mandatory Lock-in Tenure Completion (8 Years)');
    failureReasons.push(
      gates.gate1Details ||
        `Mandatory statutory lock-in period incomplete. Security deposit must remain locked in joint name with AICTE Member Secretary for 8 continuous years.`
    );
    correctiveActions.push(
      'Maintain active fixed deposit until maturity date or submit formal Governing Council board resolution for premature program closure under APH Clause 1.6(a).'
    );
    statutoryClauses.push('APH 2026-27 Chapter 1, Section 1.6(a) (Mandatory 8-Year Lock-in Norm)');
  }

  // Gate 2: Bank CBS unencumbered lien check
  if (!gates.gate2BankCbsClear) {
    failedGates.push('Gate 2: Bank CBS Direct Handshake & Unencumbered Lien');
    failureReasons.push(
      gates.gate2Details ||
        `Core Banking System (CBS) audit indicates unauthorized lien compromise, overdraft facility, or non-conforming deposit mandate.`
    );
    correctiveActions.push(
      'Liquidate all collateralized loans/overdrafts immediately. Request issuing bank branch manager to transmit certified SFMS MT760 confirmation confirming AICTE exclusive joint lien.'
    );
    statutoryClauses.push('APH 2026-27 Chapter 1, Section 1.4(c) & Banking Regulation Act 1949 Sec 45');
  }

  // Gate 3: EVC compliance & normative corpus check
  if (!gates.gate3ZeroEvcDeficiency) {
    failedGates.push('Gate 3: Zero Outstanding Regulatory & EVC Deficiencies');
    failureReasons.push(
      gates.gate3Details ||
        `Active statutory deficiency recorded on AICTE portal (e.g. faculty salary arrears, infrastructure deficit, or unrenewed expired corpus).`
    );
    correctiveActions.push(
      'Submit institutional compliance affidavit and evidence of rectification (e.g. supplementary FDR for deficit, replacement FDR lineage link, or EVC clearance certificate).'
    );
    statutoryClauses.push('APH 2026-27 Chapter 1, Section 1.5 & Chapter 4 Table 4.1');
  }

  // Gate 4: Vigilance & court litigation hold check
  if (!gates.gate4ZeroLegalHold) {
    failedGates.push('Gate 4: Zero Legal Disputes, Judicial Stays or Vigilance Holds');
    failureReasons.push(
      gates.gate4Details ||
        `National Judicial Data Grid (NJDG) / AICTE Vigilance alert: Active court stay, DRT recovery proceedings, or pending vigilance inquiry detected.`
    );
    correctiveActions.push(
      'Furnish certified High Court / DRT decree or unconditional withdrawal order demonstrating dissolution of judicial attachment on security corpus.'
    );
    statutoryClauses.push('APH 2026-27 Appendix 16 (Prohibition of Encumbered Collateral in Judicial Proceedings)');
  }

  // Calculate 15-day rectification window
  const baseDate = new Date(simulatedDate);
  const deadlineDate = new Date(baseDate);
  deadlineDate.setDate(deadlineDate.getDate() + 15);
  const deadlineIso = deadlineDate.toISOString().substring(0, 10);
  const formattedDeadline = formatGovDate(deadlineIso);

  const cleanFdrId = inst.fdrNumber.replace(/[^A-Za-z0-9]/g, '');
  const refNum = `F.No. AICTE/RB/DEFICIENCY/2026/${inst.region}/${cleanFdrId.slice(-6) || '771920'}`;
  const noticeId = `DEF-MEMO-${cleanFdrId}`;

  const messageId = `<def-memo-${cleanFdrId}-${Date.now()}@nicmail.aicte-india.org>`;
  const subject = `[OFFICIAL AICTE STATUTORY MEMO] Mandatory Security Deposit Deficiency & Compliance Hold — ${inst.institutionName} [Ref: ${refNum}]`;

  return {
    id: noticeId,
    fdrId: inst.id,
    fdrNumber: inst.fdrNumber,
    institutionId: inst.institutionId,
    institutionName: inst.institutionName,
    nodalOfficerEmail: contact.email,
    nodalOfficerName: contact.name,
    memoReferenceNumber: refNum,
    dispatchedAt: `${simulatedDate} 10:14:22 IST`,
    deliveryStatus: 'DELIVERED',
    failedGates,
    failureReasons,
    correctiveActions,
    statutoryClauses,
    rectificationDeadline: `${formattedDeadline} (15 Calendar Days from Scrutiny Notice)`,
    academicYearHold: 'Academic Year 2027-28 Extension of Approval (EoA)',
    emailSubject: subject,
    emailHeaders: {
      from: 'Regulation Bureau Head <regulation.bureau@aicte-india.org>',
      to: `${contact.name} <${contact.email}>`,
      cc: `Regional Officer (AICTE ${inst.region} Camp Desk) <ro.${inst.region.toLowerCase()}@aicte-india.org>, Member Secretary AICTE <ms@aicte-india.org>`,
      messageId,
      signingAuthority: 'Prof. Rajendra Prasad, Advisor & Regulation Bureau Head, AICTE HQ New Delhi (NIC Digital DSC)',
    },
    summaryNotice: `Statutory deficiency notice dispatched to ${contact.email} citing failure in ${failedGates.length} prerequisite gate${failedGates.length === 1 ? '' : 's'}. 15-day corrective action window active until ${formattedDeadline}.`,
  };
};

/**
 * Converts a DeficiencyNoticePayload into an EscalationDispatchLog for cross-dashboard visibility
 */
export const createEscalationLogFromDeficiency = (
  notice: DeficiencyNoticePayload
): EscalationDispatchLog => {
  return {
    id: `LOG-DEF-${notice.fdrNumber.replace(/[^A-Za-z0-9]/g, '')}`,
    fdrId: notice.fdrId,
    fdrNumber: notice.fdrNumber,
    institutionName: notice.institutionName,
    tier: 3,
    channel: 'EMAIL',
    recipient: `${notice.nodalOfficerEmail} (${notice.nodalOfficerName})`,
    subject: notice.emailSubject,
    messageBody: `STATUTORY DEFICIENCY MEMO [${notice.memoReferenceNumber}]: Prerequisite 5-gate audit evaluation failed (${notice.failedGates.join(', ')}). Corrective compliance required by ${notice.rectificationDeadline}. Extension of Approval (EoA 2027-28) portal locked.`,
    timestamp: notice.dispatchedAt,
    deliveryStatus: 'DELIVERED',
  };
};

/**
 * Pre-seeds initial statutory deficiency notices for deficient institutions in the dataset
 */
export const getInitialDeficiencyNotices = (
  instruments: FDRInstrument[],
  simulatedDate: string
): Record<string, DeficiencyNoticePayload> => {
  const map: Record<string, DeficiencyNoticePayload> = {};

  instruments.forEach((inst) => {
    const gates = inst.fiveGates;
    const isDeficient =
      !gates.gate1TenureCompleted ||
      !gates.gate2BankCbsClear ||
      !gates.gate3ZeroEvcDeficiency ||
      !gates.gate4ZeroLegalHold ||
      inst.status === 'OVERDUE' ||
      inst.status === 'DISCREPANCY_FLAGGED';

    // Eligible compliant institutions (e.g. MNIT Jaipur) do not have deficiency notices
    if (isDeficient && !gates.overallEligible) {
      map[inst.id] = buildDeficiencyPayload(inst, simulatedDate);
    }
  });

  return map;
};

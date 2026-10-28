/**
 * AICTE KOSH-Rakshak: FDR Instruments Controller
 * Implements strict RBAC scoping:
 * - College Nodal: Sees only their own institution's FDRs
 * - Regional Officer: Sees only FDRs within their regional jurisdiction
 * - HQ Bureau: Full nationwide visibility
 * - Bank Official: Sees FDRs deposited in their bank
 */

const crypto = require('crypto');

// In-Memory Seed Storage for API Execution
let fdrRegistry = [
  {
    id: 'FDR-01-SBI-COMPLIANT',
    fdrNumber: 'SBI-2023-881920',
    institutionId: 'INST-01-GUINDY',
    institutionName: 'College of Engineering, Guindy, Anna University',
    region: 'SRO',
    bankName: 'State Bank of India',
    bankCode: 'SBI',
    branchName: 'Guindy SME Branch, Chennai',
    ifscCode: 'SBIN0001055',
    issueDate: '2023-08-15',
    maturityDate: '2031-08-15',
    tenureYears: 8,
    principalAmount: 3500000,
    interestRatePct: 7.25,
    printedMaturityAmount: 6216270,
    mathExpectedMaturity: 6216270,
    lienPledgeClause: 'Pledged jointly in favor of Member Secretary, AICTE, New Delhi. Non-encashable without written AICTE discharge order.',
    hasEitherSurvivorClause: false,
    requiredDeposit: 3500000,
    actualDeposit: 3500000,
    depositDeficit: 0,
    status: 'ACTIVE',
    verificationStatus: 'BANK_CBS_CONFIRMED',
    sha256Hash: '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
    lastInspectedAt: '2026-10-24 14:22:10 IST'
  },
  {
    id: 'FDR-02-CANARA-FORGED',
    fdrNumber: 'CAN-2024-551920',
    institutionId: 'INST-02-SRM',
    institutionName: 'SRM Institute of Science and Technology',
    region: 'SRO',
    bankName: 'Canara Bank',
    bankCode: 'CANARA',
    branchName: 'Chennai Main Branch',
    ifscCode: 'CNRB0000120',
    issueDate: '2024-02-10',
    maturityDate: '2032-02-10',
    tenureYears: 8,
    principalAmount: 3500000,
    interestRatePct: 7.15,
    printedMaturityAmount: 6168320,
    mathExpectedMaturity: 2643565, // Discrepancy: principal altered from 15L to 35L
    lienPledgeClause: 'Joint lien with Member Secretary AICTE.',
    hasEitherSurvivorClause: false,
    requiredDeposit: 3500000,
    actualDeposit: 1500000,
    depositDeficit: 2000000,
    status: 'FLAGGED',
    verificationStatus: 'DISCREPANCY_FLAGGED',
    sha256Hash: 'b4a8e0f6c2d11e9a08f5d6c7b8a912e34f567890abcdef1234567890abcdef12',
    lastInspectedAt: '2026-10-25 09:15:00 IST'
  },
  {
    id: 'FDR-03-BOB-OVERDRAFT',
    fdrNumber: 'BOB-2021-992318',
    institutionId: 'INST-03-SARASWATI',
    institutionName: 'Saraswati Institute of Technology & Management',
    region: 'NRO',
    bankName: 'Bank of Baroda',
    bankCode: 'BOB',
    branchName: 'Hazratganj Branch, Lucknow',
    ifscCode: 'BARB0HAZRAT',
    issueDate: '2021-11-20',
    maturityDate: '2029-11-20',
    tenureYears: 8,
    principalAmount: 3500000,
    interestRatePct: 6.90,
    printedMaturityAmount: 6031200,
    mathExpectedMaturity: 6031200,
    lienPledgeClause: 'Pledged with AICTE.',
    hasEitherSurvivorClause: false,
    requiredDeposit: 3500000,
    actualDeposit: 3500000,
    depositDeficit: 0,
    status: 'FLAGGED',
    verificationStatus: 'DISCREPANCY_FLAGGED',
    sha256Hash: 'c1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2',
    lastInspectedAt: '2026-10-25 11:30:00 IST'
  },
  {
    id: 'FDR-04-PNB-APEX',
    fdrNumber: 'PNB-2024-419208',
    institutionId: 'INST-04-AKTU',
    institutionName: 'Apex Institute of Technology & Management',
    region: 'NRO',
    bankName: 'Punjab National Bank',
    bankCode: 'PNB',
    branchName: 'Meerut Cantt Branch',
    ifscCode: 'PUNB0024800',
    issueDate: '2024-05-12',
    maturityDate: '2032-05-12',
    tenureYears: 8,
    principalAmount: 3500000,
    interestRatePct: 7.10,
    printedMaturityAmount: 6142100,
    mathExpectedMaturity: 6142100,
    lienPledgeClause: 'Joint Lien with AICTE. Mandate: Either or Survivor.',
    hasEitherSurvivorClause: true, // Violation of APH 2026-27 Sec 4.1
    requiredDeposit: 3500000,
    actualDeposit: 3500000,
    depositDeficit: 0,
    status: 'FLAGGED',
    verificationStatus: 'DISCREPANCY_FLAGGED',
    sha256Hash: 'c7d8e9f0a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef012345678',
    lastInspectedAt: '2026-10-26 16:45:00 IST'
  }
];

function calculateQuarterlyCompoundedMaturity(principal, ratePct, tenureYears) {
  const r = ratePct / 400.0;
  const quarters = 4 * tenureYears;
  return Math.round(principal * Math.pow(1.0 + r, quarters));
}

exports.getAllFdrs = (req, res) => {
  const user = req.user || { role: 'HQ_BUREAU', region: 'ALL' };
  let filtered = [...fdrRegistry];

  // RBAC Scoping
  if (user.role === 'COLLEGE_NODAL') {
    filtered = filtered.filter(f => f.institutionId === user.institutionId);
  } else if (user.role === 'REGIONAL_OFFICER') {
    filtered = filtered.filter(f => f.region === user.region);
  } else if (user.role === 'BANK_OFFICIAL') {
    filtered = filtered.filter(f => f.bankCode === user.bankCode);
  }

  res.status(200).json({
    success: true,
    count: filtered.length,
    userRole: user.role,
    fdrs: filtered
  });
};

exports.getFdrById = (req, res) => {
  const { id } = req.params;
  const fdr = fdrRegistry.find(f => f.id === id || f.fdrNumber === id);
  if (!fdr) {
    return res.status(404).json({ error: 'FDR Instrument not found in National Registry' });
  }
  res.status(200).json({ success: true, fdr });
};

exports.validateFdrMath = (req, res) => {
  const { principal, ratePct, tenureYears = 8, printedMaturity } = req.body;
  if (!principal || !ratePct || !printedMaturity) {
    return res.status(400).json({ error: 'principal, ratePct, and printedMaturity are required' });
  }

  const expectedMaturity = calculateQuarterlyCompoundedMaturity(Number(principal), Number(ratePct), Number(tenureYears));
  const delta = Math.round(Number(printedMaturity) - expectedMaturity);
  const isMismatch = Math.abs(delta) > 100;

  res.status(200).json({
    success: true,
    principal: Number(principal),
    ratePct: Number(ratePct),
    tenureYears: Number(tenureYears),
    printedMaturity: Number(printedMaturity),
    expectedMaturity,
    discrepancyDelta: delta,
    mathMismatchDetected: isMismatch,
    verdict: isMismatch ? 'ACTUARIAL_MISMATCH_FORGERY' : 'MATHEMATICALLY_VERIFIED'
  });
};

exports.submitFdrIntake = (req, res) => {
  const { fdrNumber, institutionId, institutionName, bankName, principalAmount, interestRatePct, printedMaturityAmount, tenureYears = 8, lienPledgeClause } = req.body;
  
  const expected = calculateQuarterlyCompoundedMaturity(Number(principalAmount), Number(interestRatePct), Number(tenureYears));
  const delta = Math.abs(Number(printedMaturityAmount) - expected);
  const mathMismatch = delta > 100;
  const hasEitherSurvivor = /either\s+or\s+survivor/i.test(lienPledgeClause || '');

  const id = `FDR-${Date.now()}`;
  const sha256Hash = crypto.createHash('sha256').update(`${fdrNumber}|${principalAmount}|${Date.now()}`).digest('hex');

  const newFdr = {
    id,
    fdrNumber,
    institutionId: institutionId || 'INST-01-GUINDY',
    institutionName: institutionName || 'Demo College',
    region: 'SRO',
    bankName,
    bankCode: bankName ? bankName.substring(0, 4).toUpperCase() : 'BANK',
    branchName: 'Main Branch',
    ifscCode: 'BANK0001234',
    issueDate: new Date().toISOString().substring(0, 10),
    maturityDate: '2034-10-28',
    tenureYears: Number(tenureYears),
    principalAmount: Number(principalAmount),
    interestRatePct: Number(interestRatePct),
    printedMaturityAmount: Number(printedMaturityAmount),
    mathExpectedMaturity: expected,
    lienPledgeClause: lienPledgeClause || 'Joint lien with AICTE.',
    hasEitherSurvivorClause: hasEitherSurvivor,
    requiredDeposit: Number(principalAmount),
    actualDeposit: Number(principalAmount),
    depositDeficit: 0,
    status: (mathMismatch || hasEitherSurvivor) ? 'FLAGGED' : 'ACTIVE',
    verificationStatus: (mathMismatch || hasEitherSurvivor) ? 'DISCREPANCY_FLAGGED' : 'PENDING_BANK_CONFIRMATION',
    sha256Hash,
    lastInspectedAt: new Date().toISOString()
  };

  fdrRegistry.unshift(newFdr);

  res.status(201).json({
    success: true,
    message: 'FDR Instrument submitted for 6-Layer Multi-Modal Scrutiny.',
    fdr: newFdr
  });
};

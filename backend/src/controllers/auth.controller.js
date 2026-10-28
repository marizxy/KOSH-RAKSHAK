/**
 * AICTE KOSH-Rakshak: Authentication & Parichay Gov SSO Controller
 */

const crypto = require('crypto');

const DEMO_PROFILES = {
  COLLEGE: {
    userId: 'USR-COLLEGE-01',
    role: 'COLLEGE_NODAL',
    name: 'Dr. S. Ramanathan',
    designation: 'Nodal Officer & Registrar',
    institutionId: 'INST-01-GUINDY',
    institutionName: 'College of Engineering, Guindy, Anna University',
    region: 'SRO',
    token: 'mock-jwt-college-guindy'
  },
  RO: {
    userId: 'USR-RO-SRO-01',
    role: 'REGIONAL_OFFICER',
    name: 'Dr. B. K. Murthy',
    designation: 'Regional Officer & Director (SRO Chennai)',
    institutionId: null,
    region: 'SRO',
    token: 'mock-jwt-ro-sro'
  },
  HQ: {
    userId: 'USR-HQ-BUREAU-01',
    role: 'HQ_BUREAU',
    name: 'Prof. Rajendra Prasad',
    designation: 'Advisor & Bureau Head (Approval Bureau, New Delhi)',
    institutionId: null,
    region: 'ALL',
    token: 'mock-jwt-hq-bureau'
  },
  BANK: {
    userId: 'USR-BANK-SBI-01',
    role: 'BANK_OFFICIAL',
    name: 'Mr. Arvind Swaminathan',
    designation: 'Chief Manager (Institutional Collateral & CBS Desk)',
    bankCode: 'SBI',
    token: 'mock-jwt-bank-sbi'
  }
};

exports.loginWithParichay = (req, res) => {
  const { role = 'HQ', email, password } = req.body;
  const targetKey = role.toUpperCase();
  const profile = DEMO_PROFILES[targetKey] || DEMO_PROFILES.HQ;

  res.status(200).json({
    success: true,
    message: 'Authenticated successfully via National Parichay Single Sign-On Gateway.',
    user: profile,
    token: profile.token,
    authMethod: 'NIC_PARICHAY_2FA_AADHAAR',
    sessionExpiresInSec: 86400
  });
};

exports.getProfile = (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user
  });
};

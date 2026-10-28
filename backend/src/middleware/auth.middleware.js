/**
 * AICTE KOSH-Rakshak: Role-Based Access Control (RBAC) & Sovereign Identity Middleware
 * Roles: COLLEGE_NODAL | REGIONAL_OFFICER | HQ_BUREAU | BANK_OFFICIAL
 */

const crypto = require('crypto');

const DEMO_TOKENS = {
  'mock-jwt-college-guindy': {
    userId: 'USR-COLLEGE-01',
    role: 'COLLEGE_NODAL',
    name: 'Dr. S. Ramanathan',
    institutionId: 'INST-01-GUINDY',
    region: 'SRO'
  },
  'mock-jwt-ro-sro': {
    userId: 'USR-RO-SRO-01',
    role: 'REGIONAL_OFFICER',
    name: 'Regional Officer (Southern Region)',
    region: 'SRO'
  },
  'mock-jwt-hq-bureau': {
    userId: 'USR-HQ-BUREAU-01',
    role: 'HQ_BUREAU',
    name: 'Prof. Rajendra Prasad, Advisor (Approval Bureau)',
    region: 'ALL'
  },
  'mock-jwt-bank-sbi': {
    userId: 'USR-BANK-SBI-01',
    role: 'BANK_OFFICIAL',
    name: 'Chief Manager, SBI Treasury & Institutional Banking',
    bankCode: 'SBI'
  }
};

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // In demo / test environment, default to HQ Bureau if unauthenticated
    req.user = {
      userId: 'USR-HQ-BUREAU-01',
      role: 'HQ_BUREAU',
      name: 'Prof. Rajendra Prasad (AICTE HQ Bureau)',
      institutionId: null,
      region: 'ALL'
    };
    return next();
  }

  const token = authHeader.split(' ')[1];
  const matchedUser = DEMO_TOKENS[token];

  if (matchedUser) {
    req.user = matchedUser;
    return next();
  }

  // Parse standard JWT payload if available
  try {
    const payloadBase64 = token.split('.')[1];
    if (payloadBase64) {
      const decoded = JSON.parse(Buffer.from(payloadBase64, 'base64').toString());
      req.user = decoded;
      return next();
    }
  } catch {
    // Fallback
  }

  return res.status(401).json({
    error: 'UNAUTHORIZED',
    message: 'Invalid or expired Government SSO Parichay Token'
  });
}

function requireRole(allowedRoles) {
  const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'UNAUTHENTICATED' });
    }

    if (!rolesArray.includes(req.user.role) && req.user.role !== 'HQ_BUREAU') {
      return res.status(403).json({
        error: 'FORBIDDEN',
        message: `Role ${req.user.role} does not possess statutory authorization for this action. Required: ${rolesArray.join(', ')}`
      });
    }

    next();
  };
}

module.exports = {
  authenticate,
  requireRole
};

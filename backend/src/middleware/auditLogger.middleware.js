/**
 * AICTE KOSH-Rakshak: Cryptographic Audit Interceptor Middleware
 * Intercepts write requests (POST/PUT/PATCH/DELETE) and appends a SHA-256 block to the ledger
 */

const crypto = require('crypto');

// In-memory Ledger Chain for Backend API
const globalAuditChain = [
  {
    blockIndex: 0,
    timestamp: '2026-10-26 09:00:00 IST',
    userRole: 'HQ_BUREAU',
    userIdentifier: 'ADV-REG-HQ-01',
    ipAddress: '10.24.18.9 (NIC RailTel)',
    action: 'GENESIS_PORTAL_INITIALIZATION',
    details: 'AICTE KOSH-Rakshak Genesis Ledger established under APH 2026-27 mandate.',
    previousHash: '0'.repeat(64),
    currentHash: '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
    isValid: true
  }
];

function recordAuditBlock({ userRole, userIdentifier, ipAddress, action, details }) {
  const previousBlock = globalAuditChain[globalAuditChain.length - 1];
  const newIndex = globalAuditChain.length;
  const timestamp = `${new Date().toISOString().substring(0, 10)} ${new Date().toLocaleTimeString('en-IN')} IST`;
  
  const payload = `${newIndex}|${timestamp}|${userRole}|${userIdentifier}|${ipAddress}|${action}|${details}|${previousBlock.currentHash}`;
  const currentHash = crypto.createHash('sha256').update(payload).digest('hex');

  const block = {
    blockIndex: newIndex,
    timestamp,
    userRole,
    userIdentifier,
    ipAddress,
    action,
    details,
    previousHash: previousBlock.currentHash,
    currentHash,
    isValid: true
  };

  globalAuditChain.push(block);
  return block;
}

function auditInterceptor(actionName) {
  return (req, res, next) => {
    res.on('finish', () => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const userRole = req.user ? req.user.role : 'ANONYMOUS';
        const userIdentifier = req.user ? (req.user.name || req.user.userId) : 'SYSTEM';
        const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
        const details = `Path: ${req.originalUrl} | Method: ${req.method} | Body: ${JSON.stringify(req.body).substring(0, 100)}`;

        recordAuditBlock({
          userRole,
          userIdentifier,
          ipAddress,
          action: actionName || `${req.method}_${req.baseUrl}`,
          details
        });
      }
    });
    next();
  };
}

module.exports = {
  globalAuditChain,
  recordAuditBlock,
  auditInterceptor
};

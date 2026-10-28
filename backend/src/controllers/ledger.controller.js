/**
 * AICTE KOSH-Rakshak: Cryptographic Audit Ledger Controller
 * Standard: NIST FIPS 180-4 SHA-256 Tamper-Proof Chain
 */

const crypto = require('crypto');
const { globalAuditChain, recordAuditBlock } = require('../middleware/auditLogger.middleware');

function verifyChain(chain) {
  for (let i = 1; i < chain.length; i++) {
    const current = chain[i];
    const previous = chain[i - 1];

    const payload = `${current.blockIndex}|${current.timestamp}|${current.userRole}|${current.userIdentifier}|${current.ipAddress}|${current.action}|${current.details}|${current.previousHash}`;
    const calculatedHash = crypto.createHash('sha256').update(payload).digest('hex');

    if (current.currentHash !== calculatedHash) {
      return { valid: false, brokenIndex: current.blockIndex, reason: 'HASH_PAYLOAD_TAMPERED' };
    }
    if (current.previousHash !== previous.currentHash) {
      return { valid: false, brokenIndex: current.blockIndex, reason: 'POINTER_DISCONTINUITY' };
    }
  }
  return { valid: true, blockCount: chain.length, headHash: chain[chain.length - 1].currentHash };
}

exports.getAuditBlocks = (req, res) => {
  const { roleScope } = req.query;
  let blocks = [...globalAuditChain];

  if (roleScope && roleScope !== 'ALL') {
    blocks = blocks.filter(b => b.userRole === roleScope || b.userRole === 'HQ_BUREAU');
  }

  res.status(200).json({
    success: true,
    totalBlocks: blocks.length,
    chainIntegrity: verifyChain(globalAuditChain),
    blocks
  });
};

exports.verifyLedgerIntegrity = (req, res) => {
  const integrity = verifyChain(globalAuditChain);
  res.status(200).json({
    success: true,
    integrity,
    cryptographicStandard: 'NIST FIPS 180-4 SHA-256',
    verifiedAt: new Date().toISOString()
  });
};

exports.appendAuditBlock = (req, res) => {
  const { action, details } = req.body;
  const user = req.user || { role: 'BUREAU_HEAD', name: 'Authorized Official' };

  const block = recordAuditBlock({
    userRole: user.role,
    userIdentifier: user.name,
    ipAddress: req.ip || '127.0.0.1',
    action: action || 'MANUAL_AUDIT_NOTATION',
    details: details || 'Manual regulatory scrutiny endorsement recorded.'
  });

  res.status(201).json({
    success: true,
    message: 'Block sealed and linked to sovereign audit chain.',
    block
  });
};

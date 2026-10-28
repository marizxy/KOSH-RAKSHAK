/**
 * AICTE KOSH-Rakshak: Cryptographic Audit Ledger Engine
 * Standard: NIST FIPS 180-4 SHA-256 Immutable Hash Chain
 * Purpose: Block-by-block tamper-evident audit logging for regulatory scrutiny
 */

import crypto from 'crypto';

export class AuditBlock {
  constructor(blockIndex, timestamp, userRole, userIdentifier, ipAddress, action, details, previousHash) {
    this.blockIndex = blockIndex;
    this.timestamp = timestamp;
    this.userRole = userRole;
    this.userIdentifier = userIdentifier;
    this.ipAddress = ipAddress;
    this.action = action;
    this.details = details;
    this.previousHash = previousHash;
    this.currentHash = this.calculateHash();
    this.isValid = true;
  }

  calculateHash() {
    const payload = `${this.blockIndex}|${this.timestamp}|${this.userRole}|${this.userIdentifier}|${this.ipAddress}|${this.action}|${this.details}|${this.previousHash}`;
    return crypto.createHash('sha256').update(payload).digest('hex');
  }
}

export class CryptographicAuditLedger {
  constructor() {
    this.chain = [];
    this.initGenesisBlock();
  }

  initGenesisBlock() {
    const genesis = new AuditBlock(
      0,
      '2026-10-26 09:00:00 IST',
      'BUREAU_HEAD',
      'ADV-REG-HQ-01',
      '10.24.18.9 (NIC RailTel VPN)',
      'GENESIS_PORTAL_INITIALIZATION',
      'AICTE KOSH-Rakshak Genesis Ledger established under APH 2026-27 mandate.',
      '0'.repeat(64)
    );
    this.chain.push(genesis);
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  appendBlock(userRole, userIdentifier, ipAddress, action, details) {
    const prevBlock = this.getLatestBlock();
    const newIndex = this.chain.length;
    const timestamp = `${new Date().toISOString().substring(0, 10)} ${new Date().toLocaleTimeString('en-IN')} IST`;
    
    const block = new AuditBlock(
      newIndex,
      timestamp,
      userRole,
      userIdentifier,
      ipAddress,
      action,
      details,
      prevBlock.currentHash
    );
    this.chain.push(block);
    return block;
  }

  verifyChainIntegrity() {
    for (let i = 1; i < this.chain.length; i++) {
      const current = this.chain[i];
      const previous = this.chain[i - 1];

      // 1. Verify recalculation of current block's hash
      if (current.currentHash !== current.calculateHash()) {
        return {
          valid: false,
          error: `Block #${current.blockIndex} payload has been tampered with.`
        };
      }

      // 2. Verify backward cryptographic pointer
      if (current.previousHash !== previous.currentHash) {
        return {
          valid: false,
          error: `Block #${current.blockIndex} previousHash mismatch with Block #${previous.blockIndex}.`
        };
      }
    }

    return {
      valid: true,
      blockCount: this.chain.length,
      headHash: this.getLatestBlock().currentHash
    };
  }
}

const ledger = new CryptographicAuditLedger();
ledger.appendBlock(
  'REGIONAL_OFFICER',
  'RO-NRO-KANPUR-02',
  '14.139.60.18',
  'FORENSIC_ELA_SCAN_COMPLETED',
  'Analyzed FDR #PNB-2024-419208 for Apex Institute. Math shortfall flagged.'
);
ledger.appendBlock(
  'BUREAU_HEAD',
  'ADV-RAJENDRA-PRASAD-HQ',
  '10.14.2.19',
  'GATE5_SANCTION_GRANTED',
  'Authorized QR Release Order F.No. AICTE/RB/DISCHARGE/2026/0912.'
);

console.log('✓ Cryptographic Audit Ledger Engine Verified:', ledger.verifyChainIntegrity());

/**
 * Unit Test: Cryptographic Audit Ledger & Merkle Proofs
 * Standard: NIST FIPS 180-4 SHA-256
 */

import assert from 'assert';
import crypto from 'crypto';
import { CryptographicAuditLedger } from '../../blockchain-ledger/ledger_engine.js';
import { MerkleTree } from '../../blockchain-ledger/merkle_tree.js';

console.log('--- Running Blockchain & Merkle Ledger Unit Tests ---');

// Test 1: Ledger Genesis Block Initialization
const ledger = new CryptographicAuditLedger();
assert.strictEqual(ledger.chain.length, 1);
assert.strictEqual(ledger.chain[0].blockIndex, 0);
assert.strictEqual(ledger.chain[0].previousHash, '0'.repeat(64));
console.log('✓ Test 1 Passed: Genesis block initialized with NIST zero-padding.');

// Test 2: Sequential Block Chaining & Integrity
ledger.appendBlock(
  'REGIONAL_OFFICER',
  'RO-SRO-CHENNAI-01',
  '14.139.182.10',
  'DUAL_SOURCE_VERIFIED',
  'Matched SBI Form 16-B against CBS Master.'
);
ledger.appendBlock(
  'BUREAU_HEAD',
  'ADV-HQ-01',
  '10.24.18.9',
  'GATE5_SANCTION_APPROVED',
  'Discharge sanctioned for Guindy College.'
);

assert.strictEqual(ledger.chain.length, 3);
const integrity = ledger.verifyChainIntegrity();
assert.strictEqual(integrity.valid, true);
console.log('✓ Test 2 Passed: 3-block ledger chain verified with zero tampering.');

// Test 3: Merkle Tree Generation & Cryptographic Proof of Reserves
const fdrBatch = [
  'SBI-881920:3500000',
  'CAN-551920:3500000',
  'BOB-992318:3500000',
  'PNB-419208:3500000'
];

const tree = new MerkleTree(fdrBatch);
const root = tree.getRoot();
assert.strictEqual(root.length, 64);

const proof = tree.getProof(1);
const isProofValid = MerkleTree.verifyProof(fdrBatch[1], proof, root);
assert.strictEqual(isProofValid, true);
console.log('✓ Test 3 Passed: Merkle tree root and inclusion proof cryptographically verified.');

console.log('All Blockchain & Merkle Ledger Tests Passed Successfully!');

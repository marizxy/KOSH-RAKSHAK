/**
 * AICTE KOSH-Rakshak: Merkle Tree Cryptographic Batch Verification Engine
 * Standard: NIST FIPS 180-4 SHA-256
 * Purpose: Provides Zero-Knowledge / Cryptographic Proof of Reserves for FDR Batches
 */

import crypto from 'crypto';

export class MerkleTree {
  constructor(leaves = []) {
    this.leaves = leaves.map(leaf => this.hash(leaf));
    this.layers = [this.leaves];
    this.buildTree();
  }

  hash(data) {
    return crypto.createHash('sha256').update(String(data)).digest('hex');
  }

  buildTree() {
    if (this.leaves.length === 0) {
      this.root = '0'.repeat(64);
      return;
    }

    let currentLayer = this.leaves;
    while (currentLayer.length > 1) {
      const nextLayer = [];
      for (let i = 0; i < currentLayer.length; i += 2) {
        const left = currentLayer[i];
        // If odd number of leaves, duplicate the last leaf
        const right = i + 1 < currentLayer.length ? currentLayer[i + 1] : left;
        const combinedHash = this.hash(left + right);
        nextLayer.push(combinedHash);
      }
      this.layers.push(nextLayer);
      currentLayer = nextLayer;
    }
    this.root = currentLayer[0];
  }

  getRoot() {
    return this.root;
  }

  getProof(leafIndex) {
    if (leafIndex < 0 || leafIndex >= this.leaves.length) {
      throw new Error(`Leaf index ${leafIndex} out of bounds`);
    }

    const proof = [];
    let currentIndex = leafIndex;

    for (let layerIndex = 0; layerIndex < this.layers.length - 1; layerIndex++) {
      const layer = this.layers[layerIndex];
      const isRightNode = currentIndex % 2 === 1;
      const pairIndex = isRightNode ? currentIndex - 1 : currentIndex + 1;

      if (pairIndex < layer.length) {
        proof.push({
          position: isRightNode ? 'left' : 'right',
          data: layer[pairIndex]
        });
      } else {
        // Paired with itself if odd
        proof.push({
          position: 'right',
          data: layer[currentIndex]
        });
      }

      currentIndex = Math.floor(currentIndex / 2);
    }

    return proof;
  }

  static verifyProof(leafData, proof, rootHash) {
    let currentHash = crypto.createHash('sha256').update(String(leafData)).digest('hex');

    for (const step of proof) {
      if (step.position === 'left') {
        currentHash = crypto.createHash('sha256').update(step.data + currentHash).digest('hex');
      } else {
        currentHash = crypto.createHash('sha256').update(currentHash + step.data).digest('hex');
      }
    }

    return currentHash === rootHash;
  }
}

// Self-Test
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('Testing Merkle Tree Proof of Reserve Generation...');
  const fdrTransactions = [
    'SBI-2023-881920:3500000:GUINDY_ANNA_UNIV',
    'CAN-2024-551920:3500000:SRM_KATTANKULATHUR',
    'BOB-2021-992318:3500000:SARASWATI_TECH_LKO',
    'PNB-2024-419208:3500000:APEX_MEERUT_AKTU'
  ];

  const tree = new MerkleTree(fdrTransactions);
  console.log('✓ Merkle Root Digest:', tree.getRoot());

  const leafToVerify = fdrTransactions[0];
  const proof = tree.getProof(0);
  const isValid = MerkleTree.verifyProof(leafToVerify, proof, tree.getRoot());
  console.log('✓ Cryptographic Inclusion Proof Validated:', isValid);
}

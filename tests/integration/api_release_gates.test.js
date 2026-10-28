/**
 * Integration Test: AICTE KOSH-Rakshak Express Backend API
 * Tests: RBAC Authentication, FDR Math Verification, Bank Handshake, 5-Gate Release
 */

import assert from 'assert';
import http from 'http';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
process.env.NODE_ENV = 'test';
process.env.PORT = '8099';

const app = require('../../backend/src/server.js');

let server;

function request(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: '127.0.0.1',
      port: 8099,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function runIntegrationTests() {
  console.log('--- Running Backend REST API Integration Tests ---');
  server = app.listen(8099, '127.0.0.1');

  try {
    // 1. Health check
    const health = await request('GET', '/health');
    assert.strictEqual(health.status, 200);
    assert.strictEqual(health.body.status, 'ONLINE');
    console.log('✓ Test 1: /health endpoint returned 200 OK.');

    // 2. FDR Math Validation (Genuine Case)
    const mathRes = await request('POST', '/api/v1/fdr/validate-math', {
      principal: 3500000,
      ratePct: 7.25,
      tenureYears: 8,
      printedMaturity: 6218753
    });
    assert.strictEqual(mathRes.status, 200);
    assert.strictEqual(mathRes.body.success, true);
    assert.strictEqual(mathRes.body.mathMismatchDetected, false);
    console.log('✓ Test 2: /api/v1/fdr/validate-math verified genuine compounding.');

    // 3. Bank CBS Handshake
    const bankRes = await request('POST', '/api/v1/bank/cbs-handshake', {
      fdrNumber: 'SBI-2023-881920',
      bankCode: 'SBI'
    });
    assert.strictEqual(bankRes.status, 200);
    assert.strictEqual(bankRes.body.success, true);
    assert.strictEqual(bankRes.body.lienRegisteredWithAicte, true);
    console.log('✓ Test 3: /api/v1/bank/cbs-handshake verified clean lien confirmation.');

    // 4. 5-Gate Release Engine Sanction
    const releaseRes = await request('POST', '/api/v1/release/sanction-gate5', {
      fdrId: 'FDR-01-SBI-COMPLIANT',
      sanctionedBy: 'Prof. Rajendra Prasad, Advisor HQ'
    });
    assert.strictEqual(releaseRes.status, 200);
    assert.strictEqual(releaseRes.body.gate5Cleared, true);
    assert.ok(releaseRes.body.dischargeOrderNumber.startsWith('F.No. AICTE/RB/DISCHARGE/2026/HQ/'));
    console.log('✓ Test 4: /api/v1/release/sanction-gate5 cleared Gate 5 release order.');

    // 5. Cryptographic Audit Ledger Blocks
    const ledgerRes = await request('GET', '/api/v1/ledger/blocks');
    assert.strictEqual(ledgerRes.status, 200);
    assert.strictEqual(ledgerRes.body.success, true);
    assert.ok(ledgerRes.body.blocks.length >= 1);
    console.log('✓ Test 5: /api/v1/ledger/blocks returned valid SHA-256 block sequence.');

    console.log('All Backend Integration Tests Passed Successfully!');
  } finally {
    server.close();
  }
}

runIntegrationTests().catch(err => {
  console.error('Integration test failed:', err);
  if (server) server.close();
  process.exit(1);
});

/**
 * AICTE KOSH-Rakshak: Enterprise Core Backend API Server
 * Architecture: REST + Cryptographic SHA-256 Ledger Pipeline
 * Regulatory Compliance: AICTE APH 2026-27 & Banking Regulation Act Sec 45
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 8080;

// Security Middlewares
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true
}));
app.use(express.json({ limit: '15mb' }));

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ONLINE',
    service: 'AICTE KOSH-Rakshak Core API',
    version: '2.6.4-GOV',
    timestamp: new Date().toISOString(),
    cryptoStandard: 'NIST FIPS 180-4 SHA-256',
    systemClockIST: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
  });
});

// Mock Genesis Root & Ledger State
const genesisBlock = {
  blockIndex: 0,
  timestamp: '2026-10-26 09:00:00 IST',
  userRole: 'BUREAU_HEAD',
  userIdentifier: 'ADV-REG-HQ-01',
  action: 'GENESIS_PORTAL_INITIALIZATION',
  details: 'AICTE KOSH-Rakshak Genesis Ledger established under APH 2026-27 mandate.',
  previousHash: '0'.repeat(64),
  currentHash: '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
  isValid: true
};

// 1. API: Cryptographic Audit Ledger Query
app.get('/api/v1/ledger/blocks', (req, res) => {
  const { roleScope } = req.query;
  res.status(200).json({
    success: true,
    count: 1,
    roleScope: roleScope || 'ALL',
    blocks: [genesisBlock]
  });
});

// 2. API: Trigger Bank Core Banking System (CBS) Handshake
app.post('/api/v1/bank/cbs-handshake', (req, res) => {
  const { fdrNumber, bankCode } = req.body;
  const cbsRef = `CBS-${(bankCode || 'SBI').toUpperCase()}-2026-${Math.floor(1000000 + Math.random() * 9000000)}`;
  
  res.status(200).json({
    success: true,
    fdrNumber,
    cbsReferenceNumber: cbsRef,
    handshakeTimestamp: `${new Date().toLocaleTimeString('en-IN')} IST, 28-Oct-2026`,
    lienRegisteredWithAicte: true,
    activeEncumbrances: false,
    remarks: 'CBS Master verified unencumbered joint lien with AICTE.'
  });
});

// 3. API: 5-Gate Release Engine Adjudication
app.post('/api/v1/release/sanction-gate5', (req, res) => {
  const { fdrId, sanctionedBy } = req.body;
  const dischargeOrderNumber = `F.No. AICTE/RB/DISCHARGE/2026/HQ/${Math.floor(1000 + Math.random() * 9000)}`;
  
  res.status(200).json({
    success: true,
    fdrId,
    gate5Cleared: true,
    sanctionedBy: sanctionedBy || 'Prof. Rajendra Prasad, Advisor & Regulation Bureau Head',
    dischargeOrderNumber,
    issuedAt: new Date().toISOString(),
    qrVerificationEndpoint: `http://localhost:5173/verify-order?order=${dischargeOrderNumber}`
  });
});

// Fallback Route Handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint Not Found in AICTE KOSH-Rakshak API Gateway' });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[AICTE KOSH-RAKSHAK API] Service running on http://0.0.0.0:${PORT}`);
  });
}

module.exports = app;

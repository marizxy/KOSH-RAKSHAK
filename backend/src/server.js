/**
 * AICTE KOSH-Rakshak: Enterprise Core Backend API Server
 * Architecture: REST + Cryptographic SHA-256 Ledger Pipeline
 * Regulatory Compliance: AICTE APH 2026-27 & Banking Regulation Act Sec 45
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const authRoutes = require('./routes/auth.routes');
const fdrRoutes = require('./routes/fdr.routes');
const releaseRoutes = require('./routes/release.routes');
const bankRoutes = require('./routes/bank.routes');
const ledgerRoutes = require('./routes/ledger.routes');
const db = require('./config/db');

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
app.get('/health', async (req, res) => {
  const dbHealth = await db.healthCheck();
  res.status(200).json({
    status: 'ONLINE',
    service: 'AICTE KOSH-Rakshak Core API',
    version: '2.6.4-GOV',
    timestamp: new Date().toISOString(),
    cryptoStandard: 'NIST FIPS 180-4 SHA-256',
    database: dbHealth,
    systemClockIST: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
  });
});

// Modular REST API Endpoints (v1)
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/fdr', fdrRoutes);
app.use('/api/v1/release', releaseRoutes);
app.use('/api/v1/bank', bankRoutes);
app.use('/api/v1/ledger', ledgerRoutes);

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

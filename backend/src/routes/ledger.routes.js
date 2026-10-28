const express = require('express');
const router = express.Router();
const ledgerController = require('../controllers/ledger.controller');
const { authenticate, requireRole } = require('../middleware/auth.middleware');

router.get('/blocks', ledgerController.getAuditBlocks);
router.get('/verify', ledgerController.verifyLedgerIntegrity);
router.post('/append', authenticate, requireRole(['HQ_BUREAU', 'REGIONAL_OFFICER']), ledgerController.appendAuditBlock);

module.exports = router;

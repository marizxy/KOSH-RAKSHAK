const express = require('express');
const router = express.Router();
const bankController = require('../controllers/bank.controller');
const { authenticate, requireRole } = require('../middleware/auth.middleware');
const { auditInterceptor } = require('../middleware/auditLogger.middleware');

router.post('/cbs-handshake', authenticate, auditInterceptor('BANK_CBS_HANDSHAKE_QUERY'), bankController.triggerCbsHandshake);
router.post('/register-lien', authenticate, requireRole(['BANK_OFFICIAL', 'HQ_BUREAU']), auditInterceptor('SFMS_MT760_LIEN_REGISTRATION'), bankController.registerLienSfms);
router.post('/flag-encumbrance', authenticate, requireRole(['BANK_OFFICIAL', 'HQ_BUREAU']), auditInterceptor('ENCUMBRANCE_BREACH_FLAGGED'), bankController.flagEncumbranceBreach);

module.exports = router;

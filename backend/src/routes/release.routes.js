const express = require('express');
const router = express.Router();
const releaseController = require('../controllers/release.controller');
const { authenticate, requireRole } = require('../middleware/auth.middleware');
const { auditInterceptor } = require('../middleware/auditLogger.middleware');

router.get('/status/:fdrId', authenticate, releaseController.getReleaseStatus);
router.post('/sanction-gate5', authenticate, requireRole(['HQ_BUREAU']), auditInterceptor('GATE5_SANCTION_RELEASE'), releaseController.sanctionGate5);
router.get('/verify-order/:orderNo', releaseController.verifyDischargeOrder);

module.exports = router;

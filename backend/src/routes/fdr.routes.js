const express = require('express');
const router = express.Router();
const fdrController = require('../controllers/fdr.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { auditInterceptor } = require('../middleware/auditLogger.middleware');

router.get('/', authenticate, fdrController.getAllFdrs);
router.get('/:id', authenticate, fdrController.getFdrById);
router.post('/validate-math', fdrController.validateFdrMath);
router.post('/intake', authenticate, auditInterceptor('FDR_INTAKE_SUBMISSION'), fdrController.submitFdrIntake);

module.exports = router;

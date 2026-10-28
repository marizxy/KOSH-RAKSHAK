const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.post('/login', authController.loginWithParichay);
router.get('/profile', authenticate, authController.getProfile);

module.exports = router;

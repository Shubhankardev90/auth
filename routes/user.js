const express = require('express');
const { register, profile, login, forgotPassword, resetPassword } = require('../controller/user');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/register', register);
router.post('/login', login)
router.get('/profile', auth ,profile);
router.get('/forgot-password', forgotPassword)
router.get('/reset-password', resetPassword)

module.exports = router;
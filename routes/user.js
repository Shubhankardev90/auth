const express = require('express');
const { register, profile, login } = require('../controller/user');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/register', register);
router.post('/login', login)
router.get('/profile', auth ,profile);

module.exports = router;
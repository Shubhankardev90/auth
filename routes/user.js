const express = require('express');
const { register, profile } = require('../controller/user');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/register', register);
router.get('/profile', auth ,profile);

module.exports = router;
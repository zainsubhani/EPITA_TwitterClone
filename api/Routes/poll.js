const express = require('express');
const { createPoll, votePoll } = require('../Controller/pollController');
const auth = require('../MiddleWare/auth');
const router = express.Router();

router.post('/create', auth, createPoll);
router.post('/vote', auth, votePoll);

module.exports = router;
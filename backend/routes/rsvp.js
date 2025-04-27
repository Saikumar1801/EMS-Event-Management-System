const express = require('express');
const { rsvpEvent } = require('../controllers/rsvpController');
const { authenticate } = require('../middlewares/auth');

const router = express.Router();

router.post('/:eventId', authenticate, rsvpEvent);

module.exports = router;

const express = require('express');
const {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent
} = require('../controllers/eventController');
const { authenticate } = require('../middlewares/auth');

const router = express.Router();

// Create event (authenticated users only)
router.post('/', authenticate, createEvent);

// Get all events (public)
router.get('/', getEvents);

// Get single event (public)
router.get('/:eventId', getEvent);

// Update event (authenticated host only)
router.put('/:eventId', authenticate, updateEvent);

// Delete event (authenticated host only)
router.delete('/:eventId', authenticate, deleteEvent);

module.exports = router;
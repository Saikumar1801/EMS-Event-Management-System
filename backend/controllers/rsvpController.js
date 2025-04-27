const RSVP = require('../models/rsvp');
const Event = require('../models/event');

exports.rsvpEvent = async (req, res) => {
  const { eventId } = req.params;
  const { status } = req.body;

  try {
    const rsvp = await RSVP.findOneAndUpdate(
      { user: req.user.id, event: eventId },
      { status },
      { new: true, upsert: true }
    );
    
    const event = await Event.findById(eventId);
    event.attendees.push(req.user.id);
    await event.save();

    res.json(rsvp);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const Event = require('../models/event');

exports.createEvent = async (req, res) => {
  const { title, description, date, location } = req.body;
  
  try {
    // Validate required fields
    if (!title || !description || !date || !location) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate date format
    if (isNaN(new Date(date).getTime())) {
      return res.status(400).json({ error: 'Invalid date format' });
    }

    const event = new Event({
      title,
      description,
      date: new Date(date), // Ensure proper date format
      location,
      host: req.user.id, // From authenticated user
    });

    await event.save();
    res.status(201).json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Server error while creating event' });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate('host', 'name email')
      .populate('attendees', 'name email')
      .sort({ date: 1 }); // Sort by date ascending
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Server error while fetching events' });
  }
};

exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId)
      .populate('host', 'name email')
      .populate('attendees', 'name email');
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ error: 'Server error while fetching event' });
  }
};

exports.updateEvent = async (req, res) => {
  const { title, description, date, location } = req.body;
  
  try {
    // Check if event exists and user is the host
    const event = await Event.findOne({
      _id: req.params.eventId,
      host: req.user.id
    });

    if (!event) {
      return res.status(404).json({ 
        error: 'Event not found or you are not the host' 
      });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.eventId,
      { 
        title: title || event.title,
        description: description || event.description,
        date: date ? new Date(date) : event.date,
        location: location || event.location 
      },
      { new: true, runValidators: true }
    ).populate('host', 'name email');

    res.json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Server error while updating event' });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    // Check if event exists and user is the host
    const event = await Event.findOneAndDelete({
      _id: req.params.eventId,
      host: req.user.id
    });

    if (!event) {
      return res.status(404).json({ 
        error: 'Event not found or you are not the host' 
      });
    }

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Server error while deleting event' });
  }
};
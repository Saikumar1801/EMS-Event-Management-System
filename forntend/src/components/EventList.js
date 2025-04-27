import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import './EventList.css';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const location = useLocation();
  const successMessage = location.state?.message;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/events`);
        setEvents(response.data);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="eventlist-container">
      <h2>All Events</h2>

      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}

      {loading ? (
        <p>Loading events...</p>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : events.length > 0 ? (
        <div className="eventlist-grid">
          {events.map(event => (
            <Link 
              to={`/events/${event._id}`} 
              key={event._id} 
              className="event-card"
              state={{ event }} // Pass the event data via state
            >
              <h3>{event.title}</h3>
              <p>{new Date(event.date).toLocaleDateString()}</p>
              <p>{event.location}</p>
            </Link>
          ))}
        </div>
      ) : (
        <p>No events found.</p>
      )}
    </div>
  );
};

export default EventList;

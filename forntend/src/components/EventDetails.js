// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './EventDetails.css';

import { useLocation, useNavigate } from 'react-router-dom';

const EventDetails = () => {
  const { state } = useLocation();
  const { eventId } = useParams();
  const [event, setEvent] = useState(state?.event || null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!event) {
      const fetchEvent = async () => {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/events/${eventId}`
          );
          setEvent(response.data);
        } catch (error) {
          console.error("Error fetching event:", error);
          navigate('/events');
        }
      };
      fetchEvent();
    }
  }, [eventId, event, navigate]);

  if (!event) return <div>Loading...</div>;

  return (
    <div className="event-details">
      {location.state?.message && (
        <div className="success-message">
          {location.state.message}
        </div>
      )}
      <h2>{event.title}</h2>
      {/* Rest of your event details */}
    </div>
  );
};

export default EventDetails;
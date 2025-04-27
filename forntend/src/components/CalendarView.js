// eslint-disable-next-line no-unused-vars
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './CalendarView.css';

const localizer = momentLocalizer(moment);

const CalendarView = () => {
  const [events, setEvents] = useState([]);
  const [view, setView] = useState('month');
  const [date, setDate] = useState(new Date());
  const { authToken, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/events`, {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        });
        
        const formattedEvents = response.data.map(event => ({
          id: event._id,
          title: event.title,
          start: new Date(event.date),
          end: new Date(new Date(event.date).getTime() + 2 * 60 * 60 * 1000), // Default 2 hour duration
          location: event.location,
          description: event.description,
          host: event.host
        }));
        
        setEvents(formattedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    if (authToken) {
      fetchEvents();
    }
  }, [authToken]);

  const handleSelectEvent = (event) => {
    navigate(`/events/${event.id}`);
  };

  const handleSelectSlot = (slotInfo) => {
    const start = slotInfo.start;
    const end = slotInfo.end || new Date(start.getTime() + 2 * 60 * 60 * 1000);
    navigate(`/create-event?start=${start.toISOString()}&end=${end.toISOString()}`);
  };

  return (
    <div className="calendar-page">
      {/* Navigation Bar */}
      <nav className="calendar-navbar">
        <div className="nav-logo">Event Calendar</div>
        <div className="nav-links">
          <button onClick={() => navigate('/events')}>All Events</button>
          <button onClick={() => navigate('/create-event')}>Create Event</button>
          <div className="user-info">
            <span>{user?.name}</span>
          </div>
        </div>
      </nav>

      {/* Calendar Component */}
      <div className="calendar-container">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          views={['month', 'week', 'day', 'agenda']}
          view={view}
          onView={setView}
          date={date}
          onNavigate={setDate}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          selectable
          style={{ height: 'calc(100vh - 80px)' }}
          eventPropGetter={(event) => ({
            style: {
              backgroundColor: '#3174ad',
              borderRadius: '4px',
              border: 'none',
              color: 'white'
            }
          })}
        />
      </div>
    </div>
  );
};

export default CalendarView;
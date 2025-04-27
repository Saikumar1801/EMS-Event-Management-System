// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { authToken, user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">Eventify 🎉</Link>
      </div>
      <div className="navbar-links">
        <Link to="/calendar">Calendar</Link>
        <Link to="/create-event">Create Event</Link>
        <Link to="/events">Events</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
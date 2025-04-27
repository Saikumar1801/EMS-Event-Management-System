// eslint-disable-next-line no-unused-vars
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const { authToken } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Event Management System</h1>
        <p>Organize, manage, and track all your events in one place</p>
        
        {!authToken ? (
          <div className="auth-buttons">
            <button 
              onClick={() => navigate('/login')} 
              className="login-button"
            >
              Login
            </button>
            <button 
              onClick={() => navigate('/login?register=true')} 
              className="register-button"
            >
              Register
            </button>
          </div>
        ) : (
          <button 
            onClick={() => navigate('/calendar')} 
            className="cta-button"
          >
            Go to Event Calendar
          </button>
        )}
      </div>

      <div className="features-section">
        <h2>Key Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Create Events</h3>
            <p>Easily create new events with all necessary details</p>
          </div>
          <div className="feature-card">
            <h3>Manage Events</h3>
            <p>Update or cancel your events anytime</p>
          </div>
          <div className="feature-card">
            <h3>Calendar View</h3>
            <p>See all your events in a beautiful calendar layout</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
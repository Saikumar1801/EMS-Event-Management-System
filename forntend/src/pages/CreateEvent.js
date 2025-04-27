import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './CreateEvent.css';

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: new Date(),
    location: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const { authToken, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authToken) {
      navigate('/login', { state: { from: '/create-event' } });
    }
  }, [authToken, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({ ...prev, date }));
    if (errors.date) {
      setErrors(prev => ({ ...prev, date: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.date) newErrors.date = 'Date is required';
    else if (new Date(formData.date) < new Date()) newErrors.date = 'Date must be in the future';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/events`,
        {
          title: formData.title,
          description: formData.description,
          date: formData.date.toISOString(),
          location: formData.location,
          host: user?._id
        },
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Redirect to Event List with success message
      navigate('/events', {
        state: {
          message: 'Event created successfully!'
        }
      });

    } catch (error) {
      console.error('Error creating event:', error);
      let errorMessage = 'Failed to create event. Please try again.';
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = 'Session expired. Please login again.';
        } else if (error.response.data?.error) {
          errorMessage = error.response.data.error;
        }
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout. Please check your connection.';
      }
      setServerError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-event-container">
      <h2>Create New Event</h2>
      {serverError && (
        <div className="error-message server-error">
          {serverError}
          {serverError.includes('Session expired') && (
            <button 
              onClick={() => navigate('/login', { state: { from: '/create-event' } })}
              className="login-redirect-button"
            >
              Go to Login
            </button>
          )}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="create-event-form" noValidate>
        <div className="form-group">
          <label htmlFor="event-title">Title *</label>
          <input
            id="event-title"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={errors.title ? 'error' : ''}
            aria-invalid={!!errors.title}
            aria-describedby={errors.title ? 'title-error' : undefined}
          />
          {errors.title && <span id="title-error" className="error-message">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="event-description">Description *</label>
          <textarea
            id="event-description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={errors.description ? 'error' : ''}
            aria-invalid={!!errors.description}
            aria-describedby={errors.description ? 'description-error' : undefined}
          />
          {errors.description && <span id="description-error" className="error-message">{errors.description}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="event-date">Date and Time *</label>
          <DatePicker
            id="event-date"
            selected={formData.date}
            onChange={handleDateChange}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="MMMM d, yyyy h:mm aa"
            minDate={new Date()}
            className={`date-picker-input ${errors.date ? 'error' : ''}`}
            aria-invalid={!!errors.date}
            aria-describedby={errors.date ? 'date-error' : undefined}
          />
          {errors.date && <span id="date-error" className="error-message">{errors.date}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="event-location">Location *</label>
          <input
            id="event-location"
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className={errors.location ? 'error' : ''}
            aria-invalid={!!errors.location}
            aria-describedby={errors.location ? 'location-error' : undefined}
          />
          {errors.location && <span id="location-error" className="error-message">{errors.location}</span>}
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="submit-button"
          aria-busy={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="spinner" aria-hidden="true"></span>
              Creating...
            </>
          ) : (
            'Create Event'
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateEvent;

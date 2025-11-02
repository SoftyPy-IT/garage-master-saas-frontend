// components/Calendar.js
import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import './Calendar.css';

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    start: '',
    end: '',
    description: ''
  });

  // OAuth Configuration
  const clientId = import.meta.env.REACT_APP_GOOGLE_CLIENT_ID;
  const redirectUri = import.meta.env.REACT_APP_GOOGLE_REDIRECT_URI;
  const scope = 'https://www.googleapis.com/auth/calendar';

  // Check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem('google_access_token');
    if (token) {
      setIsAuthenticated(true);
      fetchEvents(token);
    }
    
    // Handle OAuth callback
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get('access_token');
      
      if (accessToken) {
        localStorage.setItem('google_access_token', accessToken);
        setIsAuthenticated(true);
        fetchEvents(accessToken);
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);

  const signIn = () => {
    const authUrl = `${process.env.REACT_APP_GOOGLE_AUTH_URI}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&response_type=token&include_granted_scopes=true`;
    window.location.href = authUrl;
  };

  const signOut = () => {
    localStorage.removeItem('google_access_token');
    setIsAuthenticated(false);
    setEvents([]);
  };

  const fetchEvents = async (accessToken) => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${process.env.REACT_APP_GOOGLE_CALENDAR_ID}/events?key=${process.env.REACT_APP_GOOGLE_CALENDAR_API_KEY}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        const formattedEvents = data.items?.map(event => ({
          id: event.id,
          title: event.summary || 'No Title',
          start: event.start?.dateTime || event.start?.date,
          end: event.end?.dateTime || event.end?.date,
          description: event.description,
          backgroundColor: event.backgroundColor
        })) || [];
        setEvents(formattedEvents);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const addEventToGoogleCalendar = async (eventData) => {
    const accessToken = localStorage.getItem('google_access_token');
    
    const event = {
      summary: eventData.title,
      description: eventData.description,
      start: {
        dateTime: new Date(eventData.start).toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      end: {
        dateTime: new Date(eventData.end).toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      }
    };

    try {
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${process.env.REACT_APP_GOOGLE_CALENDAR_ID}/events?key=${process.env.REACT_APP_GOOGLE_CALENDAR_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(event)
        }
      );

      if (response.ok) {
        await fetchEvents(accessToken);
        return await response.json();
      }
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  const handleAddEvent = async () => {
    if (!newEvent.title || !newEvent.start || !newEvent.end) {
      alert('Please fill in all required fields');
      return;
    }

    await addEventToGoogleCalendar(newEvent);
    setShowModal(false);
    setNewEvent({ title: '', start: '', end: '', description: '' });
  };

  if (!isAuthenticated) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2>Connect Google Calendar</h2>
          <p>Sign in with Google to manage your calendar events</p>
          <button className="btn btn-google" onClick={signIn}>
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <h2>My Calendar - softypyit@gmail.com</h2>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            Add Event
          </button>
          <button className="btn btn-secondary" onClick={signOut}>
            Sign Out
          </button>
        </div>
      </div>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        initialView="dayGridMonth"
        editable={true}
        selectable={true}
        events={events}
        dateClick={(arg) => {
          setNewEvent({
            title: '',
            start: arg.dateStr + 'T09:00:00',
            end: arg.dateStr + 'T10:00:00',
            description: ''
          });
          setShowModal(true);
        }}
        eventClick={(info) => {
          alert(`Event: ${info.event.title}\nStart: ${info.event.start}\nEnd: ${info.event.end}`);
        }}
        height="600px"
      />

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add New Event</h3>
            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                value={newEvent.title}
                onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                placeholder="Event title"
                required
              />
            </div>
            <div className="form-group">
              <label>Start Date & Time *</label>
              <input
                type="datetime-local"
                value={newEvent.start}
                onChange={(e) => setNewEvent({...newEvent, start: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>End Date & Time *</label>
              <input
                type="datetime-local"
                value={newEvent.end}
                onChange={(e) => setNewEvent({...newEvent, end: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={newEvent.description}
                onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                placeholder="Event description"
                rows="3"
              />
            </div>
            <div className="modal-actions">
              <button className="btn btn-primary" onClick={handleAddEvent}>
                Add to Calendar
              </button>
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
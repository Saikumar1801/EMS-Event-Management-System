import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import CalendarView from './components/CalendarView';
import CreateEvent from './pages/CreateEvent';
import EventList from './components/EventList';
import EventPage from './pages/EventPage';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/calendar" element={<CalendarView />} />
            <Route path="/events" element={<EventList />} />
            <Route path="/create-event" element={<CreateEvent />} />
            <Route path="/eventpage" element={<EventPage />} />
          </Route>

          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import EventHome from './pages/EventHome';
import EventMenu from './pages/EventMenu';
import EventProgram from './pages/EventProgram';
import EventInfo from './pages/EventInfo';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminEventManager from './pages/AdminEventManager';
import AdminCreateEvent from './pages/AdminCreateEvent';
import AdminEditEvent from './pages/AdminEditEvent';
import './styles.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes publiques */}
        <Route path="/event/:slug" element={<EventHome />} />
        <Route path="/event/:slug/menu" element={<EventMenu />} />
        <Route path="/event/:slug/program" element={<EventProgram />} />
        <Route path="/event/:slug/info" element={<EventInfo />} />
        
        {/* Routes admin */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/event/:slug" element={<AdminEventManager />} />
        <Route path="/admin/event/:slug/edit" element={<AdminEditEvent />} />
        <Route path="/admin/create" element={<AdminCreateEvent />} />
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        
        {/* Redirect par défaut */}
        <Route path="/" element={<Navigate to="/admin/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);

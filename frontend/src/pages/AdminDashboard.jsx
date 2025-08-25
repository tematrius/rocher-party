import React, { useState, useEffect } from 'react';
import { API_BASE } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { 
  FiCalendar, 
  FiMapPin, 
  FiUsers, 
  FiPlay, 
  FiPause, 
  FiSettings,
  FiLogOut,
  FiEye,
  FiEyeOff,
  FiPlus,
  FiEdit2,
  FiTrash2
} from 'react-icons/fi';

function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const adminToken = localStorage.getItem('adminToken');
  const adminUser = JSON.parse(localStorage.getItem('adminUser') || 'null');

  useEffect(() => {
    if (!adminToken || !adminUser) {
      navigate('/admin/login');
      return;
    }
    fetchEvents();
  }, [adminToken, adminUser, navigate]);

  const fetchEvents = async () => {
    try {
  const response = await fetch(`${API_BASE}/admin/events`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });

      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      } else if (response.status === 401) {
        logout();
      } else {
        setError('Erreur lors du chargement des événements');
      }
    } catch (err) {
      setError('Erreur de connexion');
      console.error('Fetch events error:', err);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  const togglePublish = async (slug, currentStatus) => {
    try {
  const response = await fetch(`${API_BASE}/admin/events/${slug}/publish`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ isPublished: !currentStatus })
      });

      if (response.ok) {
        fetchEvents(); // Recharger la liste
      } else {
        alert('Erreur lors de la mise à jour');
      }
    } catch (err) {
      console.error('Toggle publish error:', err);
      alert('Erreur de connexion');
    }
  };

  const deleteEvent = async (slug, eventName) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer l'événement "${eventName}" ?\n\nCette action est irréversible.`)) {
      return;
    }

    try {
  const response = await fetch(`${API_BASE}/admin/events/${slug}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        }
      });

      if (response.ok) {
        alert('Événement supprimé avec succès');
        fetchEvents(); // Recharger la liste
      } else {
        const errorData = await response.json();
        alert(errorData.error?.message || 'Erreur lors de la suppression');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Erreur lors de la suppression');
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="admin-loading">
          <div className="spinner"></div>
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="admin-header-content">
          <h1>Dashboard Administration</h1>
          <div className="admin-header-actions">
            <span className="admin-user">👤 {adminUser.username}</span>
            <button onClick={logout} className="admin-logout-btn">
              <FiLogOut /> Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="admin-main">
        <div className="admin-stats">
          <div className="stat-card">
            <FiCalendar className="stat-icon" />
            <div className="stat-content">
              <h3>{events.length}</h3>
              <p>Événements</p>
            </div>
          </div>
          <div className="stat-card">
            <FiPlay className="stat-icon" />
            <div className="stat-content">
              <h3>{events.filter(e => e.isPublished).length}</h3>
              <p>Publiés</p>
            </div>
          </div>
          <div className="stat-card">
            <FiPause className="stat-icon" />
            <div className="stat-content">
              <h3>{events.filter(e => !e.isPublished).length}</h3>
              <p>En attente</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="admin-error">
            {error}
          </div>
        )}

        <div className="admin-section">
          <div className="section-header">
            <h2>Événements</h2>
            <Link to="/admin/create" className="btn-primary">
              <FiPlus /> Nouvel événement
            </Link>
          </div>

          <div className="events-grid">
            {events.map(event => (
              <div key={event.id} className={`event-card ${event.isPublished ? 'published' : 'draft'}`}>
                <div className="event-card-header">
                  <h3>{event.name}</h3>
                  <div className="event-status">
                    <button
                      className={`status-toggle ${event.isPublished ? 'published' : 'draft'}`}
                      onClick={() => togglePublish(event.slug, event.isPublished)}
                      title={event.isPublished ? 'Dépublier' : 'Publier'}
                    >
                      {event.isPublished ? <FiEye /> : <FiEyeOff />}
                    </button>
                  </div>
                </div>

                <div className="event-card-body">
                  <div className="event-info">
                    <div className="event-detail">
                      <FiCalendar className="detail-icon" />
                      <span>{formatDate(event.startAt)}</span>
                    </div>
                    {event.venue?.name && (
                      <div className="event-detail">
                        <FiMapPin className="detail-icon" />
                        <span>{event.venue.name}</span>
                      </div>
                    )}
                    <div className="event-detail">
                      <FiUsers className="detail-icon" />
                      <span>{event.completedSteps}/{event.programSteps} étapes</span>
                    </div>
                  </div>

                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: `${event.programSteps > 0 ? (event.completedSteps / event.programSteps) * 100 : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>

                <div className="event-card-footer">
                  <Link 
                    to={`/admin/event/${event.slug}`} 
                    className="btn-secondary"
                  >
                    <FiSettings /> Gérer
                  </Link>
                  
                  <Link 
                    to={`/admin/event/${event.slug}/edit`} 
                    className="btn-primary"
                  >
                    <FiEdit2 /> Modifier
                  </Link>
                  
                  <button
                    onClick={() => deleteEvent(event.slug, event.name)}
                    className="btn-danger"
                    title="Supprimer l'événement"
                  >
                    <FiTrash2 />
                  </button>
                  
                  <a 
                    href={`/event/${event.slug}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-outline"
                  >
                    <FiEye /> Voir
                  </a>
                </div>
              </div>
            ))}
          </div>

          {events.length === 0 && !loading && (
            <div className="empty-state">
              <FiCalendar className="empty-icon" />
              <h3>Aucun événement</h3>
              <p>Créez votre premier événement pour commencer.</p>
              <Link to="/admin/create" className="btn-primary">
                <FiPlus /> Créer un événement
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;

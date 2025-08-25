import React, { useState, useEffect } from 'react';
import { API_BASE } from '../services/api';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  FiArrowLeft, 
  FiCalendar, 
  FiMapPin, 
  FiCheck, 
  FiX, 
  FiPlay,
  FiPause,
  FiEye,
  FiRefreshCw,
  FiUsers
} from 'react-icons/fi';

function AdminEventManager() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(null);

  const adminToken = localStorage.getItem('adminToken');

  useEffect(() => {
    if (!adminToken) {
      navigate('/admin/login');
      return;
    }
    fetchEvent();
  }, [slug, adminToken, navigate]);

  const fetchEvent = async () => {
    try {
  const response = await fetch(`${API_BASE}/admin/events/${slug}`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });

      if (response.ok) {
        const data = await response.json();
        setEvent(data);
      } else if (response.status === 401) {
        navigate('/admin/login');
      } else {
        setError('Événement non trouvé');
      }
    } catch (err) {
      setError('Erreur de connexion');
      console.error('Fetch event error:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleStepCompletion = async (stepIndex, currentStatus) => {
    setUpdating(stepIndex);
    try {
  const response = await fetch(`${API_BASE}/admin/events/${slug}/program/${stepIndex}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ completed: !currentStatus })
      });

      if (response.ok) {
        // Mettre à jour localement
        setEvent(prev => ({
          ...prev,
          program: prev.program.map((step, index) => 
            index === stepIndex 
              ? { ...step, completed: !currentStatus, completedAt: !currentStatus ? new Date() : null }
              : step
          )
        }));
      } else {
        alert('Erreur lors de la mise à jour');
      }
    } catch (err) {
      console.error('Toggle step error:', err);
      alert('Erreur de connexion');
    } finally {
      setUpdating(null);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (minutes) => {
    if (!minutes) return '';
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h${mins}` : `${hours}h`;
  };

  const getCompletionRate = () => {
    if (!event?.program?.length) return 0;
    return Math.round((event.program.filter(step => step.completed).length / event.program.length) * 100);
  };

  if (loading) {
    return (
      <div className="admin-event-manager">
        <div className="admin-loading">
          <div className="spinner"></div>
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="admin-event-manager">
        <div className="admin-error">
          <h2>Erreur</h2>
          <p>{error}</p>
          <Link to="/admin/dashboard" className="btn-primary">
            <FiArrowLeft /> Retour au dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-event-manager">
      <header className="admin-event-header">
        <div className="admin-event-header-content">
          <div className="header-navigation">
            <Link to="/admin/dashboard" className="back-button">
              <FiArrowLeft /> Dashboard
            </Link>
          </div>
          
          <div className="event-title-section">
            <h1>{event.name}</h1>
            <div className="event-meta">
              <div className="meta-item">
                <FiCalendar />
                <span>{formatDate(event.startAt)}</span>
              </div>
              {event.venue?.name && (
                <div className="meta-item">
                  <FiMapPin />
                  <span>{event.venue.name}</span>
                </div>
              )}
              <div className="meta-item">
                <FiUsers />
                <span>{getCompletionRate()}% terminé</span>
              </div>
            </div>
          </div>

          <div className="header-actions">
            <a 
              href={`/event/${slug}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-outline"
            >
              <FiEye /> Voir l'événement
            </a>
            <button 
              onClick={fetchEvent} 
              className="btn-secondary"
              disabled={loading}
            >
              <FiRefreshCw /> Actualiser
            </button>
          </div>
        </div>

        <div className="progress-section">
          <div className="progress-bar-large">
            <div 
              className="progress-fill"
              style={{ width: `${getCompletionRate()}%` }}
            ></div>
          </div>
          <div className="progress-text">
            {event.program.filter(step => step.completed).length} / {event.program.length} étapes terminées
          </div>
        </div>
      </header>

      <main className="admin-event-main">
        <div className="program-section">
          <h2>Gestion du Programme</h2>
          <div className="program-list">
            {event.program
              .sort((a, b) => a.order - b.order)
              .map((step, index) => (
                <div 
                  key={step._id || index} 
                  className={`program-step ${step.completed ? 'completed' : 'pending'}`}
                >
                  <div className="step-status">
                    <button
                      className={`status-button ${step.completed ? 'completed' : 'pending'}`}
                      onClick={() => toggleStepCompletion(index, step.completed)}
                      disabled={updating === index}
                    >
                      {updating === index ? (
                        <div className="mini-spinner"></div>
                      ) : step.completed ? (
                        <FiCheck />
                      ) : (
                        <FiPlay />
                      )}
                    </button>
                  </div>

                  <div className="step-content">
                    <div className="step-header">
                      <h3>{step.title}</h3>
                      <div className="step-meta">
                        {step.durationMin && (
                          <span className="duration">{formatDuration(step.durationMin)}</span>
                        )}
                        <span className="order">#{step.order}</span>
                      </div>
                    </div>
                    
                    {step.description && (
                      <p className="step-description">{step.description}</p>
                    )}
                    
                    {step.completed && step.completedAt && (
                      <div className="completion-info">
                        <FiCheck className="check-icon" />
                        <span>Terminé le {formatDate(step.completedAt)}</span>
                      </div>
                    )}
                  </div>

                  <div className="step-actions">
                    <button
                      className={`toggle-button ${step.completed ? 'mark-pending' : 'mark-complete'}`}
                      onClick={() => toggleStepCompletion(index, step.completed)}
                      disabled={updating === index}
                    >
                      {step.completed ? (
                        <>
                          <FiX /> Marquer en attente
                        </>
                      ) : (
                        <>
                          <FiCheck /> Marquer terminé
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
          </div>

          {event.program.length === 0 && (
            <div className="empty-program">
              <FiCalendar className="empty-icon" />
              <h3>Aucune étape de programme</h3>
              <p>Cet événement n'a pas encore de programme défini.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminEventManager;

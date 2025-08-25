import React, { useState, useEffect } from 'react';
import { API_BASE } from '../services/api';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  FiArrowLeft, 
  FiCalendar, 
  FiMapPin, 
  FiSave,
  FiPlus,
  FiX,
  FiClock,
  FiType,
  FiAlignLeft
} from 'react-icons/fi';
import ImageUpload from '../components/ImageUpload';
import './AdminCreateEvent.css';

function AdminEditEvent() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [error, setError] = useState('');
  
  const [eventData, setEventData] = useState({
    name: '',
    description: '',
    startAt: '',
    endAt: '',
    venue: {
      name: '',
      address: '',
      city: ''
    },
    program: [],
    menus: [],
    isPublished: false
  });

  // Charger les données de l'événement existant
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const adminToken = localStorage.getItem('adminToken');
  const response = await fetch(`${API_BASE}/admin/events/${slug}`, {
          headers: {
            'Authorization': `Bearer ${adminToken}`
          }
        });

        if (response.ok) {
          const event = await response.json();
          
          // Formatter les dates pour les inputs datetime-local
          const formatDateForInput = (date) => {
            if (!date) return '';
            return new Date(date).toISOString().slice(0, 16);
          };

          setEventData({
            name: event.name || '',
            description: event.description || '',
            startAt: formatDateForInput(event.startAt),
            endAt: formatDateForInput(event.endAt),
            venue: {
              name: event.venue?.name || '',
              address: event.venue?.address || '',
              city: event.venue?.city || ''
            },
            program: event.program || [],
            menus: event.menus || [],
            isPublished: event.isPublished || false
          });
        } else {
          setError('Erreur lors du chargement de l\'événement');
        }
      } catch (err) {
        console.error('Fetch event error:', err);
        setError('Erreur de connexion');
      } finally {
        setLoadingEvent(false);
      }
    };

    if (slug) {
      fetchEvent();
    }
  }, [slug]);

  const handleInputChange = (field, value, nested = null) => {
    if (nested) {
      setEventData(prev => ({
        ...prev,
        [nested]: {
          ...prev[nested],
          [field]: value
        }
      }));
    } else {
      setEventData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  // Gestion du programme
  const addProgramStep = () => {
    const newStep = {
      title: '',
      description: '',
      time: '',
      completed: false,
      order: eventData.program.length + 1
    };
    setEventData(prev => ({
      ...prev,
      program: [...prev.program, newStep]
    }));
  };

  const updateProgramStep = (index, field, value) => {
    setEventData(prev => ({
      ...prev,
      program: prev.program.map((step, i) => 
        i === index ? { ...step, [field]: value } : step
      )
    }));
  };

  const removeProgramStep = (index) => {
    setEventData(prev => ({
      ...prev,
      program: prev.program.filter((_, i) => i !== index)
        .map((step, i) => ({ ...step, order: i + 1 }))
    }));
  };

  // Gestion du menu
  const addMenuItem = () => {
    const newItem = {
      name: '',
      description: '',
      imageUrl: ''
    };
    setEventData(prev => ({
      ...prev,
      menus: [...prev.menus, newItem]
    }));
  };

  const updateMenuItem = (index, field, value) => {
    setEventData(prev => ({
      ...prev,
      menus: prev.menus.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeMenuItem = (index) => {
    setEventData(prev => ({
      ...prev,
      menus: prev.menus.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const adminToken = localStorage.getItem('adminToken');
      console.log('Données envoyées:', eventData);

  const response = await fetch(`${API_BASE}/admin/events/${slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(eventData)
      });

      const responseData = await response.json();
      console.log('Réponse serveur:', responseData);

      if (response.ok) {
        alert('Événement modifié avec succès !');
        navigate('/admin/dashboard');
      } else {
        console.error('Erreur serveur:', responseData);
        if (responseData.error?.details) {
          const detailsText = responseData.error.details
            .map(d => `${d.field}: ${d.message}`)
            .join('\n');
          setError(`Erreur de validation:\n${detailsText}`);
        } else {
          setError(responseData.error?.message || 'Erreur lors de la modification');
        }
      }
    } catch (err) {
      console.error('Network error:', err);
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  if (loadingEvent) {
    return (
      <div className="admin-create-event">
        <div className="loading">
          <p>Chargement de l'événement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-create-event">
      <header className="admin-create-header">
        <div className="admin-create-header-content">
          <div className="header-navigation">
            <Link to="/admin/dashboard" className="back-button">
              <FiArrowLeft /> Retour au dashboard
            </Link>
          </div>
          <h1>Modifier l'événement</h1>
        </div>
      </header>

      <main className="admin-create-main">
        <form onSubmit={handleSubmit} className="create-event-form">
          {error && (
            <div className="admin-error">
              {error}
            </div>
          )}

          {/* Informations de base */}
          <div className="form-section">
            <h2>Informations générales</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  <FiType className="form-icon" />
                  Nom de l'événement *
                </label>
                <input
                  id="name"
                  type="text"
                  className="form-input"
                  value={eventData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Soirée d'anniversaire..."
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label">
                <FiAlignLeft className="form-icon" />
                Description
              </label>
              <textarea
                id="description"
                className="form-textarea"
                value={eventData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Description de votre événement..."
                rows="4"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="startAt" className="form-label">
                  <FiCalendar className="form-icon" />
                  Date et heure de début *
                </label>
                <input
                  id="startAt"
                  type="datetime-local"
                  className="form-input"
                  value={eventData.startAt}
                  onChange={(e) => handleInputChange('startAt', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="endAt" className="form-label">
                  <FiClock className="form-icon" />
                  Date et heure de fin
                </label>
                <input
                  id="endAt"
                  type="datetime-local"
                  className="form-input"
                  value={eventData.endAt}
                  onChange={(e) => handleInputChange('endAt', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Lieu */}
          <div className="form-section">
            <h2>Lieu de l'événement</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="venue-name" className="form-label">
                  <FiMapPin className="form-icon" />
                  Nom du lieu
                </label>
                <input
                  id="venue-name"
                  type="text"
                  className="form-input"
                  value={eventData.venue.name}
                  onChange={(e) => handleInputChange('name', e.target.value, 'venue')}
                  placeholder="Restaurant Le Rocher, Salle des fêtes..."
                />
              </div>

              <div className="form-group flex-2">
                <label htmlFor="venue-address" className="form-label">
                  Adresse
                </label>
                <input
                  id="venue-address"
                  type="text"
                  className="form-input"
                  value={eventData.venue.address}
                  onChange={(e) => handleInputChange('address', e.target.value, 'venue')}
                  placeholder="123 rue de la Paix..."
                />
              </div>

              <div className="form-group">
                <label htmlFor="venue-city" className="form-label">
                  Ville
                </label>
                <input
                  id="venue-city"
                  type="text"
                  className="form-input"
                  value={eventData.venue.city}
                  onChange={(e) => handleInputChange('city', e.target.value, 'venue')}
                  placeholder="Paris..."
                />
              </div>
            </div>
          </div>

          {/* Programme */}
          <div className="form-section">
            <div className="section-header">
              <h2>Programme de la soirée</h2>
              <button
                type="button"
                onClick={addProgramStep}
                className="btn-outline"
              >
                <FiPlus /> Ajouter une étape
              </button>
            </div>

            <div className="program-steps">
              {eventData.program.map((step, index) => (
                <div key={index} className="program-step-form">
                  <div className="step-header">
                    <span className="step-number">{index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeProgramStep(index)}
                      className="remove-button"
                    >
                      <FiX />
                    </button>
                  </div>

                  <div className="form-row">
                    <div className="form-group flex-2">
                      <label className="form-label">
                        <FiType className="form-icon" />
                        Titre de l'étape
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        value={step.title}
                        onChange={(e) => updateProgramStep(index, 'title', e.target.value)}
                        placeholder="Accueil des invités, Dîner..."
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        <FiClock className="form-icon" />
                        Heure
                      </label>
                      <input
                        type="time"
                        className="form-input"
                        value={step.time}
                        onChange={(e) => updateProgramStep(index, 'time', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <FiAlignLeft className="form-icon" />
                      Description
                    </label>
                    <textarea
                      className="form-textarea"
                      value={step.description}
                      onChange={(e) => updateProgramStep(index, 'description', e.target.value)}
                      placeholder="Détails de cette étape..."
                      rows="3"
                    />
                  </div>
                </div>
              ))}

              {eventData.program.length === 0 && (
                <div className="empty-program">
                  <p>Aucune étape ajoutée. Cliquez sur "Ajouter une étape" pour commencer.</p>
                </div>
              )}
            </div>
          </div>

          {/* Menu */}
          <div className="form-section">
            <div className="section-header">
              <h2>Menu</h2>
              <button
                type="button"
                onClick={addMenuItem}
                className="btn-outline"
              >
                <FiPlus /> Ajouter un plat
              </button>
            </div>

            <div className="menu-items">
              {eventData.menus.map((item, index) => (
                <div key={index} className="menu-item-form">
                  <div className="form-row">
                    <div className="form-group flex-2">
                      <label className="form-label">
                        <FiType className="form-icon" />
                        Nom du plat
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        value={item.name}
                        onChange={(e) => updateMenuItem(index, 'name', e.target.value)}
                        placeholder="Salade César, Pizza Margherita..."
                      />
                    </div>

                    <div className="form-group flex-3">
                      <label className="form-label">
                        <FiAlignLeft className="form-icon" />
                        Description
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        value={item.description}
                        onChange={(e) => updateMenuItem(index, 'description', e.target.value)}
                        placeholder="Avec croûtons, parmesan et sauce César..."
                      />
                    </div>

                    <div className="form-group">
                      <button
                        type="button"
                        onClick={() => removeMenuItem(index)}
                        className="remove-button"
                        style={{ marginTop: '1.5rem' }}
                      >
                        <FiX />
                      </button>
                    </div>
                  </div>
                  
                  {/* Image Upload */}
                  <div className="form-group">
                    <label className="form-label">
                      Image du plat (optionnel)
                    </label>
                    <ImageUpload
                      currentImage={item.imageUrl}
                      onImageChange={(imageUrl) => updateMenuItem(index, 'imageUrl', imageUrl)}
                      placeholder={`Ajouter une image pour "${item.name || 'ce plat'}"`}
                    />
                  </div>
                </div>
              ))}

              {eventData.menus.length === 0 && (
                <div className="empty-menu">
                  <p>Aucun plat ajouté. Cliquez sur "Ajouter un plat" pour commencer.</p>
                </div>
              )}
            </div>
          </div>

          {/* Publication */}
          <div className="form-section">
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={eventData.isPublished}
                  onChange={(e) => handleInputChange('isPublished', e.target.checked)}
                />
                <span className="checkmark"></span>
                Publier immédiatement cet événement
              </label>
              <small className="form-help">
                Si coché, l'événement sera visible publiquement. Sinon, il restera en brouillon.
              </small>
            </div>
          </div>

          {/* Actions */}
          <div className="form-actions">
            <Link to="/admin/dashboard" className="btn-outline">
              Annuler
            </Link>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>Modification en cours...</>
              ) : (
                <>
                  <FiSave /> Sauvegarder les modifications
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default AdminEditEvent;

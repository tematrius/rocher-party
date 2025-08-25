import React, { useState } from 'react';
import { API_BASE } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
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

function AdminCreateEvent() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [eventData, setEventData] = useState({
    name: '',
    slug: '',
    startAt: '',
    endAt: '',
    venue: {
      name: '',
      address: '',
      googleMapsLink: ''
    },
    program: [],
    menus: [],
    isPublished: false
  });

  const adminToken = localStorage.getItem('adminToken');

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[àáâãäå]/g, 'a')
      .replace(/[èéêë]/g, 'e')
      .replace(/[ìíîï]/g, 'i')
      .replace(/[òóôõö]/g, 'o')
      .replace(/[ùúûü]/g, 'u')
      .replace(/[ç]/g, 'c')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  };

  const handleInputChange = (field, value) => {
    setEventData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Auto-générer le slug quand le nom change
    if (field === 'name') {
      setEventData(prev => ({
        ...prev,
        slug: generateSlug(value)
      }));
    }
  };

  const handleVenueChange = (field, value) => {
    setEventData(prev => ({
      ...prev,
      venue: {
        ...prev.venue,
        [field]: value
      }
    }));
  };

  // Gestion du programme
  const addProgramStep = () => {
    const newStep = {
      title: '',
      description: '',
      order: eventData.program.length + 1,
      durationMin: 30
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

    // Validation de base
    if (!eventData.name || !eventData.slug || !eventData.startAt) {
      setError('Nom, slug et date de début sont obligatoires');
      setLoading(false);
      return;
    }

    try {
      console.log('📤 Envoi des données:', eventData);
  const response = await fetch(`${API_BASE}/admin/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(eventData)
      });

      const data = await response.json();

      if (response.ok) {
        console.log('✅ Événement créé:', data);
        navigate('/admin/dashboard');
      } else {
        console.error('❌ Erreur de création:', data);
        if (data.error?.details) {
          const errorDetails = data.error.details.map(d => `${d.field}: ${d.message}`).join('\n');
          setError(`${data.error.message}\n\nDétails:\n${errorDetails}`);
        } else {
          setError(data.error?.message || 'Erreur lors de la création');
        }
      }
    } catch (err) {
      console.error('Create event error:', err);
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-create-event">
      <header className="admin-create-header">
        <div className="admin-create-header-content">
          <div className="header-navigation">
            <Link to="/admin/dashboard" className="back-button">
              <FiArrowLeft /> Retour au dashboard
            </Link>
          </div>
          <h1>Créer un nouvel événement</h1>
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

              <div className="form-group">
                <label htmlFor="slug" className="form-label">
                  <FiType className="form-icon" />
                  Slug (URL) *
                </label>
                <input
                  id="slug"
                  type="text"
                  className="form-input"
                  value={eventData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  placeholder="soiree-anniversaire"
                  required
                />
                <small className="form-help">
                  URL: /event/{eventData.slug}
                </small>
              </div>
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
                  <FiCalendar className="form-icon" />
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
            <h2>Lieu</h2>
            
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
                onChange={(e) => handleVenueChange('name', e.target.value)}
                placeholder="Salle des fêtes..."
              />
            </div>

            <div className="form-group">
              <label htmlFor="venue-address" className="form-label">
                <FiMapPin className="form-icon" />
                Adresse
              </label>
              <input
                id="venue-address"
                type="text"
                className="form-input"
                value={eventData.venue.address}
                onChange={(e) => handleVenueChange('address', e.target.value)}
                placeholder="123 Rue de la Fête, Paris"
              />
            </div>

            <div className="form-group">
              <label htmlFor="venue-maps" className="form-label">
                <FiMapPin className="form-icon" />
                Lien Google Maps
              </label>
              <input
                id="venue-maps"
                type="url"
                className="form-input"
                value={eventData.venue.googleMapsLink}
                onChange={(e) => handleVenueChange('googleMapsLink', e.target.value)}
                placeholder="https://maps.google.com/..."
              />
            </div>
          </div>

          {/* Programme */}
          <div className="form-section">
            <div className="section-header">
              <h2>Programme</h2>
              <button 
                type="button" 
                onClick={addProgramStep}
                className="btn-primary btn-small"
              >
                <FiPlus /> Ajouter une étape
              </button>
            </div>

            <div className="program-steps">
              {eventData.program.map((step, index) => (
                <div key={index} className="program-step-form">
                  <div className="step-form-header">
                    <span className="step-number">#{step.order}</span>
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
                        placeholder="Accueil, Dîner, Spectacle..."
                      />
                    </div>

                    <div className="form-group flex-1">
                      <label className="form-label">
                        <FiClock className="form-icon" />
                        Durée (min)
                      </label>
                      <input
                        type="number"
                        className="form-input"
                        value={step.durationMin}
                        onChange={(e) => updateProgramStep(index, 'durationMin', parseInt(e.target.value) || 0)}
                        min="1"
                        placeholder="30"
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
                      placeholder="Description de cette étape..."
                      rows="2"
                    />
                  </div>
                </div>
              ))}

              {eventData.program.length === 0 && (
                <div className="empty-program">
                  <p>Aucune étape de programme. Cliquez sur "Ajouter une étape" pour commencer.</p>
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
                className="btn-primary btn-small"
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
                <>
                  <div className="mini-spinner"></div>
                  Création...
                </>
              ) : (
                <>
                  <FiSave />
                  Créer l'événement
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default AdminCreateEvent;

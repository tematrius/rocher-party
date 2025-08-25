import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FiInfo, FiMapPin, FiImage } from 'react-icons/fi';
import { getPublicEvent, getFullEvent } from '../services/api';
import Header from '../components/Header';
import LockedMessage from '../components/LockedMessage';

function EventInfo() {
  const { slug } = useParams();
  const [publicEvent, setPublicEvent] = useState(null);
  const [fullEvent, setFullEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        // D'abord récupérer les données publiques pour vérifier si verrouillé
        const publicData = await getPublicEvent(slug);
        setPublicEvent(publicData);

        if (!publicData.locked) {
          const fullData = await getFullEvent(slug);
          setFullEvent(fullData);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [slug]);

  if (loading) return <div className="loading">Chargement...</div>;
  if (error) return <div className="error">Erreur : {error}</div>;
  if (!publicEvent) return <div className="error">Événement non trouvé</div>;

  return (
    <div className="event-info">
      <Header eventName={publicEvent.name} isLocked={publicEvent.locked} />

      <main className="main-content">
        {publicEvent.locked ? (
          <LockedMessage 
            eventName={publicEvent.name}
            startTime={publicEvent.startAt}
          />
        ) : (
          <>
            <h1 className="section-title">
              <FiInfo />
              Informations pratiques
            </h1>

            {fullEvent?.venue && (
              <div className="venue-info">
                <h2 className="venue-name">
                  <FiMapPin style={{ display: 'inline', marginRight: '0.5rem' }} />
                  {fullEvent.venue.name}
                </h2>
                <p className="venue-address">{fullEvent.venue.address}</p>
                {fullEvent.venue.googleMapsLink && (
                  <a 
                    href={fullEvent.venue.googleMapsLink} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="maps-button"
                  >
                    <FiMapPin />
                    Ouvrir dans Google Maps
                  </a>
                )}
              </div>
            )}

            <div className="info-blocks">
              {fullEvent?.infos?.map((info, index) => (
                <div key={index} className="info-block">
                  <h2 className="info-title">{info.title}</h2>
                  {info.imageUrl && (
                    <img src={info.imageUrl} alt={info.title} className="info-image" />
                  )}
                  <div className="info-content">
                    {info.content}
                  </div>
                </div>
              ))}
            </div>

            {fullEvent?.media && fullEvent.media.length > 0 && (
              <div className="media-gallery">
                <h2 className="section-title">
                  <FiImage />
                  Galerie
                </h2>
                <div className="media-grid">
                  {fullEvent.media.map((media, index) => (
                    <div key={index} className="media-item">
                      {media.type === 'image' ? (
                        <img src={media.url} alt={media.title} />
                      ) : (
                        <video src={media.url} controls />
                      )}
                      {media.title && <p className="media-title">{media.title}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(!fullEvent?.infos || fullEvent.infos.length === 0) && (!fullEvent?.media || fullEvent.media.length === 0) && (
              <div className="no-content">
                <p>Aucune information supplémentaire disponible.</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default EventInfo;

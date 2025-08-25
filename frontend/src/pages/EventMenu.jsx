import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FiCoffee } from 'react-icons/fi';
import { getPublicEvent, getFullEvent } from '../services/api';
import Header from '../components/Header';
import LockedMessage from '../components/LockedMessage';

function EventMenu() {
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
    <div className="event-menu">
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
              <FiCoffee />
              Menu
            </h1>

            <div className="menu-grid">
              {fullEvent?.menus?.map((item, index) => (
                <div key={index} className="menu-item">
                  {item.imageUrl && (
                    <img src={item.imageUrl} alt={item.name} className="menu-image" />
                  )}
                  <div className="menu-content">
                    <h3 className="menu-title">{item.name}</h3>
                    {item.description && <p className="menu-description">{item.description}</p>}
                    {item.tags && (
                      <div className="menu-tags">
                        {item.tags.map((tag, i) => (
                          <span key={i} className="menu-tag">{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {(!fullEvent?.menus || fullEvent.menus.length === 0) && (
              <div className="no-content">
                <p>Aucun menu disponible pour le moment.</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default EventMenu;

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FiList, FiCoffee, FiInfo, FiCheckCircle, FiClock } from 'react-icons/fi';
import { getPublicEvent, getFullEvent } from '../services/api';
import Header from '../components/Header';
import Countdown from '../components/Countdown';

function EventHome() {
  const { slug } = useParams();
  const [event, setEvent] = useState(null);
  const [fullEvent, setFullEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const publicData = await getPublicEvent(slug);
      setEvent(publicData);
      
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

  useEffect(() => {
    fetchEvent();
  }, [slug]);

  const handleCountdownEnd = () => {
    fetchEvent(); // Recharger les données quand le compte à rebours se termine
  };

  if (loading) return <div className="loading">Chargement...</div>;
  if (error) return <div className="error">Erreur : {error}</div>;
  if (!event) return <div className="error">Événement non trouvé</div>;

  return (
    <div className="event-home">
      <Header eventName={event.name} venue={event.venue} isLocked={event.locked} />

      <main className="main-content">
        {event.locked ? (
          <Countdown 
            serverNow={event.now} 
            startAt={event.startAt} 
            onEnd={handleCountdownEnd}
          />
        ) : (
          <>
            <div className="navigation">
              <a href={`/event/${slug}/program`} className="nav-button">
                <FiList className="nav-icon" />
                Programme
              </a>
              <a href={`/event/${slug}/menu`} className="nav-button">
                <FiCoffee className="nav-icon" />
                Menu
              </a>
              <a href={`/event/${slug}/info`} className="nav-button">
                <FiInfo className="nav-icon" />
                Infos pratiques
              </a>
            </div>
            
            {fullEvent?.program && (
              <div className="program-section">
                <h2 className="section-title">
                  <FiList />
                  Programme en cours
                </h2>
                <div className="program-list">
                  {fullEvent.program.map((step, index) => (
                    <div key={index} className={`program-step ${step.completed ? 'completed' : ''}`}>
                      <div className="step-header">
                        <h3 className="step-title">{step.title}</h3>
                        <div className={`step-status ${step.completed ? 'completed' : 'pending'}`}>
                          {step.completed ? (
                            <>
                              <FiCheckCircle />
                              Terminé
                            </>
                          ) : (
                            <>
                              <FiClock />
                              En cours
                            </>
                          )}
                        </div>
                      </div>
                      {step.description && <p className="step-description">{step.description}</p>}
                      <div className="step-meta">
                        {step.durationMin && <span>{step.durationMin} min</span>}
                        {step.completedAt && (
                          <span>Terminé à {new Date(step.completedAt).toLocaleTimeString()}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default EventHome;

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { FiList, FiCheckCircle, FiClock, FiWifi, FiWifiOff } from 'react-icons/fi';
import { getPublicEvent, getFullEvent } from '../services/api';
import socketService from '../services/socket';
import Header from '../components/Header';
import LockedMessage from '../components/LockedMessage';

// DEBUG: Vérifie si API_BASE est accessible
try {
  // eslint-disable-next-line no-undef
  console.log('EventProgram API_BASE:', API_BASE);
} catch (e) {
  console.error('EventProgram: API_BASE is not defined', e);
}

function EventProgram() {
  const { slug } = useParams();
  const [publicEvent, setPublicEvent] = useState(null);
  const [fullEvent, setFullEvent] = useState(null);
  const [program, setProgram] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  // Gestion des mises à jour temps réel
  const handleStepUpdate = useCallback((data) => {
    console.log('🔄 Mise à jour temps réel reçue:', data);
    
    setProgram(prevProgram => {
      const newProgram = [...prevProgram];
      if (newProgram[data.stepIndex]) {
        newProgram[data.stepIndex] = {
          ...newProgram[data.stepIndex],
          completed: data.step.completed,
          completedAt: data.step.completedAt
        };
      }
      return newProgram;
    });

    setLastUpdate(new Date().toLocaleTimeString());
    
    // Notification visuelle optionnelle
    if (data.step.completed) {
      console.log(`✅ Étape terminée: ${data.step.title}`);
    }
  }, []);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        // D'abord récupérer les données publiques pour vérifier si verrouillé
        const publicData = await getPublicEvent(slug);
        setPublicEvent(publicData);

        if (!publicData.locked) {
          const fullData = await getFullEvent(slug);
          setFullEvent(fullData);
          setProgram(fullData.program || []);
          
          // Connecter Socket.io et rejoindre l'événement
          socketService.connect();
          socketService.joinEvent(slug);
          
          // Écouter les mises à jour du programme
          socketService.onStepUpdate(handleStepUpdate);
          
          // État de connexion
          const socket = socketService.socket;
          if (socket) {
            socket.on('connect', () => setSocketConnected(true));
            socket.on('disconnect', () => setSocketConnected(false));
            setSocketConnected(socket.connected);
          }
        }
      } catch (err) {
        setError(err.message);
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();

    // Cleanup
    return () => {
      socketService.offStepUpdate(handleStepUpdate);
    };
  }, [slug, handleStepUpdate]);

  if (loading) return <div className="loading">Chargement...</div>;
  if (error) return <div className="error">Erreur : {error}</div>;
  if (!publicEvent) return <div className="error">Événement non trouvé</div>;

  return (
    <div className="event-program">
      <Header eventName={publicEvent.name} isLocked={publicEvent.locked} />

      <main className="main-content">
        {publicEvent.locked ? (
          <LockedMessage 
            eventName={publicEvent.name}
            startTime={publicEvent.startAt}
          />
        ) : (
          <>
            <div className="program-header">
              <h1 className="section-title">
                <FiList />
                Programme
              </h1>
              
              <div className="real-time-status">
                <div className={`connection-status ${socketConnected ? 'connected' : 'disconnected'}`}>
                  {socketConnected ? (
                    <>
                      <FiWifi className="status-icon" />
                      <span>Temps réel</span>
                    </>
                  ) : (
                    <>
                      <FiWifiOff className="status-icon" />
                      <span>Hors ligne</span>
                    </>
                  )}
                </div>
                {lastUpdate && (
                  <div className="last-update">
                    Dernière mise à jour: {lastUpdate}
                  </div>
                )}
              </div>
            </div>

            <div className="program-list">
              {program.map((step, index) => (
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
                          En attente
                        </>
                      )}
                    </div>
                  </div>
                  
                  {step.description && <p className="step-description">{step.description}</p>}
                  
                  <div className="step-meta">
                    {step.durationMin && <span className="duration">{step.durationMin} min</span>}
                    {step.completedAt && (
                      <span className="completed-time">
                        Terminé à {new Date(step.completedAt).toLocaleTimeString()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {program.length === 0 && (
              <div className="no-content">
                <p>Aucun programme disponible pour le moment.</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default EventProgram;

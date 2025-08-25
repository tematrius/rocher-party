import React from 'react';
import { FiLock, FiClock } from 'react-icons/fi';

function LockedMessage({ eventName, startTime }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="locked-message">
      <div className="locked-content">
        <div className="locked-icon">
          <FiLock />
        </div>
        <h2 className="locked-title">Événement non encore disponible</h2>
        <p className="locked-description">
          L'événement <strong>{eventName}</strong> n'a pas encore commencé.
        </p>
        <div className="locked-time">
          <FiClock style={{ display: 'inline', marginRight: '0.5rem' }} />
          Début prévu le <strong>{formatDate(startTime)}</strong>
        </div>
        <p className="locked-info">
          Revenez à l'heure prévue pour accéder au programme, menu et informations de l'événement.
        </p>
        <a href={`/event/${window.location.pathname.split('/')[2]}`} className="back-to-countdown">
          Retour au compte à rebours
        </a>
      </div>
    </div>
  );
}

export default LockedMessage;

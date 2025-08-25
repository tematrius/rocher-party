import React, { useState, useEffect } from 'react';
import { FiClock } from 'react-icons/fi';

function Countdown({ serverNow, startAt, onEnd }) {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    const start = new Date(startAt).getTime();
    const server = new Date(serverNow).getTime();
    const client = Date.now();
    const skew = server - client; // correction de dérive

    // Calculer le temps restant initial
    const initialRemaining = Math.max(0, start - (Date.now() + skew));
    setRemaining(initialRemaining);

    // Mettre à jour chaque seconde
    const id = setInterval(() => {
      const t = Math.max(0, start - (Date.now() + skew));
      setRemaining(t);
      if (t === 0) {
        clearInterval(id);
        onEnd?.();
      }
    }, 1000);

    return () => clearInterval(id);
  }, [startAt, serverNow, onEnd]); // Dépendances simplifiées

  const s = Math.floor(remaining / 1000);
  const dd = Math.floor(s / 86400);
  const hh = Math.floor((s % 86400) / 3600);
  const mm = Math.floor((s % 3600) / 60);
  const ss = s % 60;

  return (
    <div className="countdown-section">
      <h2 className="countdown-title">
        <FiClock style={{ display: 'inline', marginRight: '0.5rem' }} />
        L'événement commence dans :
      </h2>
      <div className="countdown-display">
        <div className="time-unit">
          <span className="time-number">{dd.toString().padStart(2, '0')}</span>
          <span className="time-label">jours</span>
        </div>
        <div className="time-unit">
          <span className="time-number">{hh.toString().padStart(2, '0')}</span>
          <span className="time-label">heures</span>
        </div>
        <div className="time-unit">
          <span className="time-number">{mm.toString().padStart(2, '0')}</span>
          <span className="time-label">minutes</span>
        </div>
        <div className="time-unit">
          <span className="time-number">{ss.toString().padStart(2, '0')}</span>
          <span className="time-label">secondes</span>
        </div>
      </div>
    </div>
  );
}

export default Countdown;

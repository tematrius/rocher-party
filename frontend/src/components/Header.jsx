import React, { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { 
  FiMenu, 
  FiX, 
  FiHome, 
  FiList, 
  FiCoffee, 
  FiInfo,
  FiMapPin,
  FiArrowLeft
} from 'react-icons/fi';

function Header({ eventName, venue, isLocked = false }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { slug } = useParams();
  const location = useLocation();

  const navItems = [
    { path: `/event/${slug}`, label: 'Accueil', icon: FiHome },
    { path: `/event/${slug}/program`, label: 'Programme', icon: FiList },
    { path: `/event/${slug}/menu`, label: 'Menu', icon: FiCoffee },
    { path: `/event/${slug}/info`, label: 'Infos', icon: FiInfo },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isHomePage = location.pathname === `/event/${slug}`;
  
  // Toujours montrer la navigation quand ce n'est pas la page d'accueil, même si c'est verrouillé
  const showNavigation = !isHomePage;

  return (
    <>
      <header className="event-header">
        <div className="header-content">
          <h1 className="event-title">{eventName}</h1>
          {showNavigation && (
            <button 
              className="mobile-menu-button"
              onClick={toggleMenu}
              aria-label="Menu"
            >
              {isMenuOpen ? <FiX /> : <FiMenu />}
            </button>
          )}
        </div>
        
        {venue && isHomePage && (
          <div className="venue-info">
            <div className="venue-name">
              <FiMapPin style={{ display: 'inline', marginRight: '0.5rem' }} />
              {venue.name}
            </div>
            <div className="venue-address">{venue.address}</div>
            {venue.googleMapsLink && (
              <a 
                href={venue.googleMapsLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="maps-button"
              >
                <FiMapPin />
                Itinéraire
              </a>
            )}
          </div>
        )}
      </header>

      {showNavigation && (
        <nav 
          className={`main-navigation ${isMenuOpen ? 'open' : ''}`}
          onClick={() => setIsMenuOpen(false)}
        >
          <div className="nav-content" onClick={(e) => e.stopPropagation()}>
            <ul className="nav-list">
              <li className="nav-item">
                <a href={`/event/${slug}`} className="nav-link">
                  <FiArrowLeft className="nav-icon" />
                  Retour à l'accueil
                </a>
              </li>
              {navItems.slice(1).map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path} className="nav-item">
                    <a 
                      href={item.path} 
                      className={`nav-link ${isActive ? 'active' : ''}`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Icon className="nav-icon" />
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>
      )}
    </>
  );
}

export default Header;

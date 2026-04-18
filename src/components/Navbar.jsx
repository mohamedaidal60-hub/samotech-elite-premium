import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, PhoneCall } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="flex items-center gap-2">
          {/* We will map the logo animation here later, for now text/icon */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <PhoneCall size={32} color="var(--color-primary)" />
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-dark)' }}>Growth <span style={{ color: 'var(--color-primary)'}}>Partners</span></span>
          </div>
        </Link>
        <div className="nav-links">
          <Link to="/" className="nav-link">Accueil</Link>
          <Link to="/partenariat" className="nav-link">Partenariat B2B</Link>
          <Link to="/candidat" className="nav-link">Recrutement</Link>
          <div className="language-selector flex" style={{ gap: '0.5rem', alignItems: 'center' }}>
            <Globe size={20} />
            <select style={{ background: 'transparent', border: 'none', cursor: 'pointer', outline: 'none' }}>
              <option value="fr">FR</option>
              <option value="en">EN</option>
              <option value="ar">AR</option>
            </select>
          </div>
        </div>
      </div>
    </nav>
  );
}

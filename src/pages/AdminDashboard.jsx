import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Building2, ClipboardCheck, Download, ExternalLink, Trash2 } from 'lucide-react';

export default function AdminDashboard() {
  const [partners, setPartners] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [activeTab, setActiveTab] = useState('partners');

  useEffect(() => {
    // Load from local storage for simulation
    const savedPartners = JSON.parse(localStorage.getItem('gp_partners') || '[]');
    const savedCandidates = JSON.parse(localStorage.getItem('gp_candidates') || '[]');
    setPartners(savedPartners);
    setCandidates(savedCandidates);
  }, []);

  const deleteItem = (type, id) => {
    if (type === 'partners') {
      const updated = partners.filter(p => p.id !== id);
      setPartners(updated);
      localStorage.setItem('gp_partners', JSON.stringify(updated));
    } else {
      const updated = candidates.filter(c => c.id !== id);
      setCandidates(updated);
      localStorage.setItem('gp_candidates', JSON.stringify(updated));
    }
  };

  return (
    <div className="admin-layout" style={{ paddingTop: '80px' }}>
      <aside className="sidebar">
        <h2 style={{ marginBottom: '2rem', fontSize: '1.2rem' }}>Administration GP</h2>
        <nav>
          <button 
            onClick={() => setActiveTab('partners')}
            style={{ 
              width: '100%', padding: '1rem', background: activeTab === 'partners' ? 'var(--color-primary)' : 'transparent',
              border: 'none', color: 'white', textAlign: 'left', borderRadius: '8px', cursor: 'pointer', marginBottom: '0.5rem',
              display: 'flex', alignItems: 'center', gap: '10px'
            }}
          >
            <Building2 size={20} /> Partenariats
          </button>
          <button 
            onClick={() => setActiveTab('candidates')}
            style={{ 
              width: '100%', padding: '1rem', background: activeTab === 'candidates' ? 'var(--color-primary)' : 'transparent',
              border: 'none', color: 'white', textAlign: 'left', borderRadius: '8px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '10px'
            }}
          >
            <Users size={20} /> Recrutement
          </button>
        </nav>
      </aside>

      <main className="admin-content">
        <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '2rem' }}>{activeTab === 'partners' ? 'Demandes de Partenariat' : 'Candidatures Recues'}</h1>
          <div style={{ background: 'white', padding: '0.5rem 1rem', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
            Total: {activeTab === 'partners' ? partners.length : candidates.length}
          </div>
        </header>

        <div className="premium-card" style={{ padding: '0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: 'var(--color-gray)' }}>
              <tr>
                {activeTab === 'partners' ? (
                  <>
                    <th style={{ padding: '1rem', textAlign: 'left' }}>Entité</th>
                    <th style={{ padding: '1rem', textAlign: 'left' }}>Contact</th>
                    <th style={{ padding: '1rem', textAlign: 'left' }}>Services</th>
                    <th style={{ padding: '1rem', textAlign: 'left' }}>Positions</th>
                    <th style={{ padding: '1rem', textAlign: 'center' }}>Actions</th>
                  </>
                ) : (
                  <>
                    <th style={{ padding: '1rem', textAlign: 'left' }}>Portrait</th>
                    <th style={{ padding: '1rem', textAlign: 'left' }}>Candidat</th>
                    <th style={{ padding: '1rem', textAlign: 'left' }}>Score Test</th>
                    <th style={{ padding: '1rem', textAlign: 'left' }}>Statut</th>
                    <th style={{ padding: '1rem', textAlign: 'center' }}>Actions</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {activeTab === 'partners' ? (
                partners.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '1rem' }}><strong>{p.entite}</strong></td>
                    <td style={{ padding: '1rem' }}>{p.prenom} {p.nom}<br/><small>{p.mail}</small></td>
                    <td style={{ padding: '1rem' }}>{p.services.join(', ')}</td>
                    <td style={{ padding: '1rem' }}>{p.positions}</td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <button onClick={() => deleteItem('partners', p.id)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))
              ) : (
                candidates.map(c => (
                  <tr key={c.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '1rem' }}>
                      <img src={c.selfie || 'https://via.placeholder.com/50'} alt="Selfie" style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }} />
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <strong>{c.prenom} {c.nom}</strong><br/>
                      <small>{c.mail}</small><br/>
                      <small>{c.langues.join(' / ')}</small>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ 
                        padding: '0.25rem 0.5rem', borderRadius: '4px', background: c.testScore >= 80 ? '#d4edda' : '#f8d7da',
                        color: c.testScore >= 80 ? '#155724' : '#721c24', fontWeight: 'bold'
                      }}>
                        {c.testScore}%
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      {c.testScore >= 80 ? '✅ Admissible' : '❌ Échec'}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center', display: 'flex', gap: '10px', justifyContent: 'center' }}>
                      <button 
                        title="Télécharger CV"
                        style={{ background: 'var(--color-primary)', color: 'white', border: 'none', padding: '5px', borderRadius: '4px', cursor: 'pointer' }}
                        onClick={() => alert("Génération du CV PDF à partir de l'audio...")}
                      >
                        <Download size={18} />
                      </button>
                      <button onClick={() => deleteItem('candidates', c.id)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {(activeTab === 'partners' ? partners.length : candidates.length) === 0 && (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#999' }}>
              Aucune donnée disponible pour le moment.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Building2, Download, Trash2, ShieldCheck } from 'lucide-react';
import sql from '../lib/db';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessType, setAccessType] = useState(null);
  const [password, setPassword] = useState('');
  const [partners, setPartners] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [activeTab, setActiveTab] = useState('partners');
  const [loading, setLoading] = useState(false);

  // Mots de passe pour les accès
  const PASSWORDS = {
    partners: 'PARTNER2026',
    candidates: 'CANDIDATE2026'
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, accessType]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (accessType === 'partners') {
        const data = await sql`SELECT * FROM partners ORDER BY created_at DESC`;
        setPartners(data);
        setActiveTab('partners');
      } else if (accessType === 'candidates') {
        const data = await sql`SELECT * FROM candidates ORDER BY created_at DESC`;
        setCandidates(data);
        setActiveTab('candidates');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === PASSWORDS.partners) {
      setAccessType('partners');
      setIsAuthenticated(true);
    } else if (password === PASSWORDS.candidates) {
      setAccessType('candidates');
      setIsAuthenticated(true);
    } else {
      alert("Mot de passe incorrect");
    }
  };

  const deleteItem = async (type, id) => {
    if (!window.confirm("Supprimer cet élément ?")) return;
    try {
      if (type === 'partners') {
        await sql`DELETE FROM partners WHERE id = ${id}`;
        setPartners(partners.filter(p => p.id !== id));
      } else {
        await sql`DELETE FROM candidates WHERE id = ${id}`;
        setCandidates(candidates.filter(c => c.id !== id));
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{ paddingTop: '150px', textAlign: 'center' }}>
        <div className="premium-card" style={{ maxWidth: '400px', margin: '0 auto', padding: '2rem' }}>
          <ShieldCheck size={48} style={{ marginBottom: '1rem', color: 'var(--color-primary)' }} />
          <h3>Accès Administration</h3>
          <form onSubmit={handleLogin} style={{ marginTop: '1rem' }}>
            <input 
              type="password" 
              placeholder="Mot de passe" 
              className="form-control" 
              style={{ textAlign: 'center', marginBottom: '1rem' }}
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <button className="btn-primary" style={{ width: '100%' }}>Désactiver le verrouillage</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout" style={{ paddingTop: '80px' }}>
      <aside className="sidebar">
        <h2 style={{ marginBottom: '2rem', fontSize: '1.2rem' }}>Administration GP</h2>
        <nav>
          {accessType === 'partners' && (
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
          )}
          {accessType === 'candidates' && (
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
          )}
        </nav>
        <button 
          onClick={() => setIsAuthenticated(false)}
          style={{ width: '100%', marginTop: '2rem', background: 'transparent', border: '1px solid white', color: 'white', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer' }}
        >
          Déconnexion
        </button>
      </aside>

      <main className="admin-content">
        <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '2rem' }}>{activeTab === 'partners' ? 'Demandes de Partenariat' : 'Candidatures Recues'}</h1>
          <div style={{ background: 'white', padding: '0.5rem 1rem', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', color: 'black' }}>
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
                        padding: '0.25rem 0.5rem', borderRadius: '4px', background: c.test_score >= 80 ? '#d4edda' : '#f8d7da',
                        color: c.test_score >= 80 ? '#155724' : '#721c24', fontWeight: 'bold'
                      }}>
                        {c.test_score}%
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      {c.test_score >= 80 ? '✅ Admissible' : '❌ Échec'}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center', display: 'flex', gap: '10px', justifyContent: 'center' }}>
                      <button 
                        title="Détails"
                        style={{ background: 'var(--color-primary)', color: 'white', border: 'none', padding: '5px', borderRadius: '4px', cursor: 'pointer' }}
                        onClick={() => alert(`Analyse IA: ${c.ai_transcription}`)}
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
          {(activeTab === 'partners' ? partners.length : candidates.length) === 0 && !loading && (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#999' }}>
              Aucune donnée disponible.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

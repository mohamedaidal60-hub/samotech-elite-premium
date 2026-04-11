import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogIn, Lock, Mail } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('aidalmimo@gmail.com');
  const [password, setPassword] = useState('@sba-Trs40');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Identifiants incorrects');
    }
  };

  return (
    <div style={{ 
      height: '100vh', 
      width: '100vw', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'radial-gradient(circle at top right, #1e293b, #0f172a, #020617)'
    }}>
      <div className="premium-card glass-morphism" style={{ width: '400px', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>GROWTH PARTNERS</h1>
          <p style={{ color: 'var(--text-muted)' }}>Enterprise Resource Planning</p>
        </div>

        {error && (
          <div style={{ 
            backgroundColor: 'rgba(239, 68, 68, 0.1)', 
            color: 'var(--error)', 
            padding: '12px', 
            borderRadius: '8px', 
            marginBottom: '20px',
            fontSize: '14px',
            border: '1px solid rgba(239, 68, 68, 0.2)'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ position: 'relative' }}>
            <Mail style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-dim)' }} size={18} />
            <input 
              type="email" 
              className="input-field" 
              placeholder="Email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ paddingLeft: '40px' }}
              required
            />
          </div>
          <div style={{ position: 'relative' }}>
            <Lock style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-dim)' }} size={18} />
            <input 
              type="password" 
              className="input-field" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ paddingLeft: '40px' }}
              required
            />
          </div>
          <button className="btn-primary" type="submit" disabled={isLoading} style={{ marginTop: '10px', height: '48px' }}>
            {isLoading ? 'Connexion...' : <><LogIn size={20} /> Se connecter</>}
          </button>
        </form>

        <div style={{ marginTop: '30px', textAlign: 'center', fontSize: '12px', color: 'var(--text-dim)' }}>
           © {new Date().getFullYear()} Growth Partners Group. Tous droits réservés.
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

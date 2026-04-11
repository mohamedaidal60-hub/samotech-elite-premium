import React, { useState } from 'react';
import { 
  Users, 
  ShieldAlert, 
  Settings, 
  Key, 
  Plus, 
  Check, 
  X,
  Lock,
  MessageSquare
} from 'lucide-react';

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'roles' | 'api'>('users');
  const [users, setUsers] = useState([
    { id: 1, name: 'Admin Principal', email: 'admin@growthpartners.com', role: 'admin', lastActive: '2h ago' },
    { id: 2, name: 'Sarah Toumi', email: 's.toumi@growthpartners.com', role: 'supervisor', lastActive: '10m ago' },
    { id: 3, name: 'Mehdi Ben', email: 'm.ben@growthpartners.com', role: 'teleoperator', lastActive: 'Now' },
    { id: 4, name: 'Linda S.', email: 'l.s@growthpartners.com', role: 'quality_agent', lastActive: '1d ago' },
  ]);

  const [roles, setRoles] = useState([
    { id: 1, name: 'Teleoperator', permissions: ['Make Calls', 'View Sales', 'Self Profile'] },
    { id: 2, name: 'Supervisor', permissions: ['Make Calls', 'Validate Sales', 'View Team'] },
    { id: 3, name: 'Quality Agent', permissions: ['View Recordings', 'Approve/Reject Sales', 'Export Reports'] },
    { id: 4, name: 'Admin', permissions: ['All Access', 'User Management', 'Roles & API'] },
  ]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '24px' }}>Administration Système</h1>
        <button className="btn-primary"><Plus size={18} /> Nouvel Utilisateur</button>
      </div>

      <div className="premium-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)' }}>
          <button 
            onClick={() => setActiveTab('users')}
            style={{ 
              padding: '15px 25px', 
              background: 'none', 
              border: 'none', 
              color: activeTab === 'users' ? 'white' : 'var(--text-dim)',
              borderBottom: activeTab === 'users' ? '2px solid var(--accent-primary)' : 'none',
              cursor: 'pointer',
              fontWeight: activeTab === 'users' ? '600' : '400'
            }}
          >
            Utilisateurs
          </button>
          <button 
            onClick={() => setActiveTab('roles')}
            style={{ 
              padding: '15px 25px', 
              background: 'none', 
              border: 'none', 
              color: activeTab === 'roles' ? 'white' : 'var(--text-dim)',
              borderBottom: activeTab === 'roles' ? '2px solid var(--accent-primary)' : 'none',
              cursor: 'pointer',
              fontWeight: activeTab === 'roles' ? '600' : '400'
            }}
          >
            Rôles & Permissions
          </button>
          <button 
            onClick={() => setActiveTab('api')}
            style={{ 
              padding: '15px 25px', 
              background: 'none', 
              border: 'none', 
              color: activeTab === 'api' ? 'white' : 'var(--text-dim)',
              borderBottom: activeTab === 'api' ? '2px solid var(--accent-primary)' : 'none',
              cursor: 'pointer',
              fontWeight: activeTab === 'api' ? '600' : '400'
            }}
          >
            Configuration API
          </button>
        </div>

        <div style={{ padding: '30px' }}>
          {activeTab === 'users' && (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)', fontSize: '12px', color: 'var(--text-dim)' }}>
                  <th style={{ paddingBottom: '15px' }}>NOM</th>
                  <th style={{ paddingBottom: '15px' }}>EMAIL</th>
                  <th style={{ paddingBottom: '15px' }}>RÔLE</th>
                  <th style={{ paddingBottom: '15px' }}>DERNIÈRE ACTIVITÉ</th>
                  <th style={{ paddingBottom: '15px' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #1e2d42', fontSize: '14px' }}>
                    <td style={{ padding: '15px 0', fontWeight: 'bold' }}>{u.name}</td>
                    <td style={{ padding: '15px 0' }}>{u.email}</td>
                    <td style={{ padding: '15px 0' }}>
                       <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--accent-secondary)' }}>{u.role.replace('_', ' ')}</span>
                    </td>
                    <td style={{ padding: '15px 0', color: 'var(--text-dim)' }}>{u.lastActive}</td>
                    <td style={{ padding: '15px 0' }}>
                       <div style={{ display: 'flex', gap: '10px' }}>
                          <button style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer' }}><Settings size={14} /></button>
                          <button style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer' }}><Lock size={14} /></button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'roles' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
               {roles.map(r => (
                 <div key={r.id} className="premium-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                       <h3 style={{ fontSize: '16px' }}>{r.name}</h3>
                       <button style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer' }}>Modifier</button>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                       {r.permissions.map((p, i) => (
                         <span key={i} className="badge-blue" style={{ fontSize: '10px' }}>{p}</span>
                       ))}
                    </div>
                 </div>
               ))}
            </div>
          )}

          {activeTab === 'api' && (
            <div style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
               <div style={{ padding: '20px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)', display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                  <ShieldAlert className="pulse" size={24} style={{ color: 'var(--accent-primary)' }} />
                  <div>
                    <h4 style={{ marginBottom: '5px' }}>Mode Super-Admin</h4>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Ces paramètres contrôlent les intégrations globales du système (Supabase, Neon, OpenAI for transcription, etc.).</p>
                  </div>
               </div>

               <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '12px', color: 'var(--text-dim)' }}>NEON DATABASE URL</label>
                    <div style={{ position: 'relative' }}>
                       <Key style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-dim)' }} size={16} />
                       <input type="password" value="postgresql://neondb_owner:************" className="input-field" style={{ paddingLeft: '40px' }} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '12px', color: 'var(--text-dim)' }}>OPENAI API KEY (Audio Transcription)</label>
                    <div style={{ position: 'relative' }}>
                       <Key style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-dim)' }} size={16} />
                       <input type="password" value="sk-***************" className="input-field" style={{ paddingLeft: '40px' }} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '12px', color: 'var(--text-dim)' }}>GPTrans NETLIFY API</label>
                    <div style={{ position: 'relative' }}>
                       <Key style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-dim)' }} size={16} />
                       <input type="password" value="***************" className="input-field" style={{ paddingLeft: '40px' }} />
                    </div>
                  </div>
                  <button className="btn-primary" style={{ marginTop: '10px' }}>Enregistrer et Synchroniser</button>
               </div>
            </div>
          )}
        </div>
      </div>

      <div className="premium-card glass-morphism">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}><MessageSquare size={20} /> Chat Interne Admin</h3>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Messages entre administrateurs et superviseurs.</p>
        <div style={{ marginTop: '15px', padding: '15px', background: 'var(--bg-main)', borderRadius: '12px', border: '1px solid var(--border)', fontSize: '13px' }}>
           <div style={{ marginBottom: '10px' }}>
             <strong style={{ color: 'var(--accent-primary)' }}>Admin:</strong> Bienvenue sur la version v2.1 de GROWTH PARTNERS ERP.
           </div>
           <div>
             <strong style={{ color: 'var(--accent-secondary)' }}>Sarah Toumi:</strong> Merci, l'interface est superbe !
           </div>
        </div>
        <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
           <input type="text" className="input-field" placeholder="Votre message..." />
           <button className="btn-primary">Envoyer</button>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Play, 
  CheckCircle, 
  XCircle, 
  Download, 
  FileAudio,
  User,
  Activity
} from 'lucide-react';

const QualityPage: React.FC = () => {
  const [recordings, setRecordings] = useState([
    { id: 1, agent: 'Sarah Toumi', client: 'Orange FR', date: '11/04, 14:20', duration: '5:12', status: 'pending', transcript: "Bonjour, Growth Partners à l'appareil... Oui, l'offre fibre est disponible..." },
    { id: 2, agent: 'Mehdi Ben', client: 'Canal+', date: '11/04, 14:15', duration: '3:45', status: 'sale_approved', transcript: "C'est validé monsieur, vous recevrez le contrat prochainement..." },
    { id: 3, agent: 'Yassine K.', client: 'EDF GDF', date: '11/04, 13:55', duration: '2:30', status: 'rejected', transcript: "Non mais vous n'avez pas compris... [Bruit de fond]" },
  ]);

  const [activeRecording, setActiveRecording] = useState(recordings[0]);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 450px', gap: '25px', height: '100%' }}>
      {/* Left List of Recordings */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h1 style={{ fontSize: '24px' }}>Contrôle Qualité & Vérification</h1>
        <div className="premium-card">
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
             <h3 style={{ fontSize: '16px' }}>Enregistrements Récents</h3>
             <button className="small" style={{ color: 'var(--accent-primary)', background: 'none', border: 'none', cursor: 'pointer' }}>Plus de filtres</button>
           </div>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {recordings.map(rec => (
                <div 
                  key={rec.id} 
                  onClick={() => setActiveRecording(rec)}
                  style={{ 
                    padding: '15px', 
                    borderRadius: '12px', 
                    border: '1px solid var(--border)', 
                    background: activeRecording.id === rec.id ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255,255,255,0.02)',
                    borderColor: activeRecording.id === rec.id ? 'var(--accent-primary)' : 'var(--border)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    position: 'relative'
                  }}>
                  {rec.status === 'sale_approved' && (
                    <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                       <CheckCircle size={16} style={{ color: 'var(--success)' }} />
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                     <div style={{ padding: '10px', background: 'var(--bg-main)', borderRadius: '10px', color: 'var(--accent-secondary)' }}><FileAudio size={24} /></div>
                     <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 'bold' }}>{rec.client}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Agent: {rec.agent} • {rec.date}</div>
                     </div>
                     <div style={{ textAlign: 'right', fontSize: '13px', color: 'var(--text-dim)' }}>{rec.duration}</div>
                  </div>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Right Detailed Preview & Player */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="premium-card glass-morphism" style={{ position: 'sticky', top: '20px' }}>
           <h3 style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}><Play size={18} /> Écoute de l'appel</h3>
           <div style={{ padding: '20px', background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: '12px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '15px' }}>
                 <div style={{ color: 'var(--text-muted)' }}>0:00</div>
                 <div style={{ flex: 1, height: '4px', background: 'var(--border)', alignSelf: 'center', position: 'relative', borderRadius: '2px' }}>
                   <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: '40%', background: 'var(--accent-primary)', borderRadius: '2px' }} />
                   <div style={{ position: 'absolute', top: '-6px', left: '40%', width: '16px', height: '16px', background: 'var(--accent-primary)', borderRadius: '50%', boxShadow: '0 0 10px rgba(59,130,246,0.5)' }} />
                 </div>
                 <div style={{ color: 'var(--text-muted)' }}>{activeRecording.duration}</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                 <button className="btn-primary" style={{ height: '40px', width: '40px', borderRadius: '50%', padding: 0 }}><Play size={20} /></button>
              </div>
           </div>

           <h3 style={{ marginBottom: '10px', fontSize: '14px' }}>Transcription de l'appel</h3>
           <div style={{ 
              padding: '15px', 
              background: 'rgba(255,255,255,0.02)', 
              borderRadius: '12px', 
              border: '1px solid var(--border)', 
              fontSize: '13px', 
              lineHeight: '1.6', 
              color: 'var(--text-muted)',
              marginBottom: '25px',
              fontStyle: 'italic'
           }}>
             "{activeRecording.transcript}"
           </div>

           <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button className="btn-primary" style={{ background: 'var(--success)' }}><CheckCircle size={18} /> Valider la Vente</button>
              <button className="btn-primary" style={{ background: 'var(--error)' }}><XCircle size={18} /> Rejeter l'Appel</button>
              <button className="btn-primary" style={{ background: 'none', border: '1px solid var(--border)', color: 'white' }}><Download size={18} /> Télécharger Audio</button>
           </div>
        </div>

        <div className="premium-card">
           <h3 style={{ marginBottom: '15px' }}>Résumé de la Session</h3>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                 <span style={{ color: 'var(--text-dim)' }}>Taux de validation</span>
                 <span>78%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                 <span style={{ color: 'var(--text-dim)' }}>Appels vérifiés</span>
                 <span>12/15</span>
              </div>
              <div style={{ marginTop: '5px', padding: '10px', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.1)', fontSize: '11px', color: 'var(--error)' }}>
                 Attention: 3 ventes en attente de vérification depuis 24h.
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default QualityPage;

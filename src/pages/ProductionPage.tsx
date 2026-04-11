import React, { useState, useEffect } from 'react';
import { 
  PhoneCall, 
  Mic, 
  User, 
  History, 
  TrendingUp, 
  Plus, 
  CheckCircle,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProductionPage: React.FC = () => {
  const [isCalling, setIsCalling] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [transcription, setTranscription] = useState('');
  const [logs, setLogs] = useState([
    { id: 1, client: 'Jean Dupont', status: 'Sale', time: '14:20', duration: '5:12' },
    { id: 2, client: 'Sophie Martin', status: 'Callback', time: '13:55', duration: '2:30' },
    { id: 3, client: 'Gérard Mercier', status: 'Not Interested', time: '13:20', duration: '1:15' },
  ]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isCalling) {
      timer = setInterval(() => {
        setCallDuration(d => d + 1);
        if (callDuration % 3 === 0) {
          const sentences = [
            "Bonjour monsieur...", 
            "Je vous contacte...", 
            "Oui, Growth Partners...", 
            "C'est une offre exceptionnelle...", 
            "D'accord, je valide..."
          ];
          setTranscription(prev => prev + (prev ? ' ' : '') + sentences[Math.floor(Math.random() * sentences.length)]);
        }
      }, 1000);
    } else {
      setCallDuration(0);
      setTranscription('');
    }
    return () => clearInterval(timer);
  }, [isCalling, callDuration]);

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const handleCall = () => {
    setIsCalling(!isCalling);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 400px', gap: '20px', height: '100%' }}>
      {/* Left: Teleoperator Dialer / Calling area */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="premium-card" style={{ 
          height: '400px', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center',
          gap: '30px',
          background: isCalling ? 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, rgba(10,15,26,1) 100%)' : 'var(--bg-card)',
          transition: 'all 0.5s ease'
        }}>
          {isCalling ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ position: 'relative', marginBottom: '40px' }}>
                <div className="pulse" style={{ 
                  width: '120px', 
                  height: '120px', 
                  borderRadius: '50%', 
                  background: 'var(--accent-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  boxShadow: '0 0 40px rgba(59, 130, 246, 0.4)'
                }}>
                  <PhoneCall size={48} />
                </div>
              </div>
              <h2 style={{ fontSize: '28px', marginBottom: '10px' }}>Appel en cours...</h2>
              <div style={{ fontSize: '36px', fontWeight: 'bold', fontFamily: 'monospace', color: 'var(--accent-secondary)' }}>
                {formatTime(callDuration)}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center' }}>
               <h1 style={{ fontSize: '32px', marginBottom: '10px' }}>Prêt pour l'appel</h1>
               <p style={{ color: 'var(--text-muted)' }}>Campagne: Fibre Optique Entreprise</p>
               <button onClick={handleCall} className="btn-primary" style={{ width: '200px', height: '60px', borderRadius: '30px', fontSize: '18px', marginTop: '30px' }}>
                 Lancer l'appel
               </button>
            </div>
          )}
        </div>

        <div className="premium-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '15px' }}>
           <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Mic size={18} /> Transcription IA Directe</h3>
           <div style={{ flex: 1, padding: '15px', background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: '12px', overflowY: 'auto', fontSize: '14px', lineHeight: '1.6', color: 'var(--text-muted)' }}>
             {transcription || "Silence... En attente de parole."}
             {isCalling && <span className="pulse" style={{ display: 'inline-block', width: '2px', height: '14px', background: 'var(--accent-primary)', marginLeft: '4px' }} />}
           </div>
           
           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
             <button className="btn-primary" style={{ background: 'var(--success)' }}><CheckCircle size={16} /> Vente</button>
             <button className="btn-secondary" style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'none', color: 'white' }}>Rappel</button>
             <button className="btn-secondary" style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'none', color: 'white' }}>Inexistants</button>
             <button className="btn-secondary" style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'none', color: 'var(--error)' }}>Refus</button>
           </div>
        </div>
      </div>

      {/* Right: History and Stats */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="premium-card">
           <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
             <History size={18} /> Historique Appels
           </h3>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
             {logs.map(log => (
               <div key={log.id} style={{ padding: '12px', border: '1px solid var(--border)', borderRadius: '12px', background: 'rgba(255,255,255,0.02)' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                   <span style={{ fontWeight: '600', fontSize: '14px' }}>{log.client}</span>
                   <span className="badge" style={{ backgroundColor: log.status === 'Sale' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)', color: log.status === 'Sale' ? 'var(--success)' : 'var(--warning)', fontSize: '10px' }}>
                     {log.status}
                   </span>
                 </div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)' }}>
                   <span>{log.time}</span>
                   <span>{log.duration}</span>
                 </div>
               </div>
             ))}
           </div>
        </div>

        <div className="premium-card">
          <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
             <TrendingUp size={18} /> Vos Statistiques
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
             <div style={{ textAlign: 'center', padding: '15px', background: 'rgba(59,130,246,0.05)', borderRadius: '12px' }}>
               <div style={{ fontSize: '24px', fontWeight: 'bold' }}>42</div>
               <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>APPELS</div>
             </div>
             <div style={{ textAlign: 'center', padding: '15px', background: 'rgba(16, 185, 129,0.05)', borderRadius: '12px' }}>
               <div style={{ fontSize: '24px', fontWeight: 'bold' }}>5</div>
               <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>VENTES</div>
             </div>
          </div>
          <button className="btn-primary" style={{ width: '100%', marginTop: '20px', background: 'none', border: '1px solid var(--border)', color: 'white' }}>
            <FileText size={16} /> Compte-rendu
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductionPage;

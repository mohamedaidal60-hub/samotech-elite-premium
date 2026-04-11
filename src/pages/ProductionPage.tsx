import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, 
  MicOff, 
  PhoneCall, 
  Save, 
  FileText, 
  History,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Send,
  User,
  AudioLines
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const ProductionPage: React.FC = () => {
  const { user } = useAuth();
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [classification, setClassification] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'idle' | 'calling' | 'recorded'>('idle');
  
  // Real-time voice simulation
  const [audioLevels, setAudioLevels] = useState<number[]>(Array(20).fill(0));
  
  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setAudioLevels(Array(20).fill(0).map(() => Math.random() * 100));
        // Simulate transcription growing
        if (Math.random() > 0.7) {
          const phrases = ["Bonjour, comment allez-vous?", "Oui, je comprends votre besoin.", "Notre offre est limitée.", "Voulez-vous valider?", "Parfait, je note."];
          setTranscript(prev => prev + " " + phrases[Math.floor(Math.random() * phrases.length)]);
        }
      }, 150);
    } else {
      setAudioLevels(Array(20).fill(0));
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleStartCall = () => {
    if (!phone) return alert("Veuillez saisir un numéro client");
    setStatus('calling');
    setIsRecording(true);
  };

  const handleEndCall = () => {
    setIsRecording(false);
    setStatus('recorded');
  };

  const handleSave = async () => {
    if (!classification) return alert("Veuillez classifier l'appel");
    
    const { error } = await supabase.from('calls').insert({
      agent_id: user?.id,
      customer_phone: phone,
      classification,
      transcription: transcript,
      summary: transcript.substring(0, 100) + "...",
      is_sale: classification === 'sale',
      quality_status: 'pending'
    });

    if (error) {
      alert("Erreur lors de la sauvegarde: " + error.message);
    } else {
      alert(classification === 'sale' ? "Vente enregistrée ! La qualité a été notifiée." : "Appel classifié avec succès.");
      setPhone('');
      setTranscript('');
      setClassification('');
      setStatus('idle');
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <PhoneCall className="text-blue-500" />
          Production & Appels
        </h1>
        <p className="text-slate-400 text-sm mt-1">Interface de production temps-réel avec IA Transcription.</p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Call Controls */}
        <div className="xl:col-span-2 space-y-6">
          <section className="glass-card p-8 border-slate-800 relative overflow-hidden">
            {isRecording && (
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-blue-500 to-red-500 animate-pulse" />
            )}
            
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="space-y-4 flex-1">
                <label className="text-xs uppercase tracking-widest font-bold text-slate-500">Numéro du Prospect</label>
                <div className="flex gap-2">
                  <input 
                    type="tel" 
                    value={phone}
                    onInput={(e:any) => setPhone(e.target.value)}
                    disabled={status !== 'idle'}
                    placeholder="+213..." 
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-lg font-bold text-white outline-none focus:border-blue-500 transition-all"
                  />
                  {status === 'idle' ? (
                    <button 
                      onClick={handleStartCall}
                      className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20"
                    >
                      APPELER
                    </button>
                  ) : status === 'calling' ? (
                    <button 
                      onClick={handleEndCall}
                      className="bg-rose-600 hover:bg-rose-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-rose-500/20"
                    >
                      RACCROCHER
                    </button>
                  ) : (
                    <button 
                      onClick={() => setStatus('idle')}
                      className="bg-slate-700 text-white px-6 py-3 rounded-xl font-bold"
                    >
                      NOUVEAU
                    </button>
                  )}
                </div>
              </div>

              <div className="w-full md:w-48 h-24 bg-slate-950 rounded-2xl border border-slate-800 flex items-end justify-center gap-1 p-4 overflow-hidden">
                {audioLevels.map((level, i) => (
                  <motion.div 
                    key={i}
                    animate={{ height: `${level}%` }}
                    className={`w-1 rounded-full ${isRecording ? 'bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.5)]' : 'bg-slate-800'}`}
                  />
                ))}
              </div>
            </div>

            <div className="mt-10 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-400 flex items-center gap-2">
                  <AudioLines size={16} className={isRecording ? 'text-red-500 animate-pulse' : ''} />
                  TRANSCRIPTION TEMPS RÉEL (IA)
                </h3>
                {isRecording && <span className="text-[10px] text-red-500 font-bold uppercase animate-pulse">Enregistrement actif</span>}
              </div>
              <div className="w-full h-48 bg-slate-950/50 border border-slate-800 rounded-2xl p-6 overflow-y-auto text-slate-300 font-medium leading-relaxed italic">
                {transcript || (status === 'calling' ? "Écoute en cours..." : "En attente d'appel...")}
                {isRecording && <span className="inline-block w-2 h-4 bg-blue-500 ml-1 animate-bounce" />}
              </div>
            </div>
          </section>

          {/* Classification */}
          <section className={`glass-card p-8 border-slate-800 transition-all ${status === 'recorded' ? 'opacity-100 scale-100' : 'opacity-50 pointer-events-none scale-[0.98]'}`}>
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <FileText className="text-cyan-500" />
              Classification de l'Appel
            </h3>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { id: 'sale', label: 'VENTE', icon: CheckCircle, color: 'hover:bg-emerald-500/20 hover:text-emerald-400 hover:border-emerald-500/40 text-emerald-500' },
                { id: 'not_interested', label: 'PAS INTÉRESSÉ', icon: XCircle, color: 'hover:bg-rose-500/20 hover:text-rose-400 hover:border-rose-500/40 text-rose-500' },
                { id: 'callback', label: 'RAPPELER', icon: Clock, color: 'hover:bg-amber-500/20 hover:text-amber-400 hover:border-amber-500/40 text-amber-500' },
                { id: 'wrong_number', label: 'FAUX NUMÉRO', icon: AlertCircle, color: 'hover:bg-slate-500/20 hover:text-slate-400 hover:border-slate-500/40 text-slate-500' },
              ].map((cat) => (
                <button 
                  key={cat.id}
                  onClick={() => setClassification(cat.id)}
                  className={`flex flex-col items-center justify-center p-6 border rounded-2xl transition-all gap-3 ${classification === cat.id ? 'bg-blue-600/20 border-blue-500 text-blue-400 scale-105' : 'bg-slate-900/50 border-slate-800 ' + cat.color}`}
                >
                  <cat.icon size={28} />
                  <span className="text-[10px] font-extrabold tracking-widest uppercase">{cat.label}</span>
                </button>
              ))}
            </div>

            <div className="mt-8 flex justify-end">
              <button 
                onClick={handleSave}
                className="btn-primary"
              >
                <Save size={20} />
                ENREGISTRER LA FICHE
              </button>
            </div>
          </section>
        </div>

        {/* Sidebar Status */}
        <div className="space-y-6">
          <section className="glass-card p-6 border-slate-800">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <History size={18} className="text-blue-400" />
              Derniers Appels
            </h3>
            <div className="space-y-3">
              {[
                { name: "John Doe", time: "10:24", status: "Vente" },
                { name: "Marie C.", time: "09:55", status: "Rappeler" },
                { name: "Ahmed B.", time: "09:30", status: "Faux No" }
              ].map((call, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-xl border border-slate-800">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold">
                    {call.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-white">{call.name}</p>
                    <p className="text-[10px] text-slate-500">{call.time}</p>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-blue-400">{call.status}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="glass-card p-6 border-slate-800 bg-blue-600/5">
            <h3 className="font-bold text-white mb-2 flex items-center gap-2">
              <Mic size={18} className="text-blue-500" />
              Qualité & Audit
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Toutes les transcriptions sont conservées 3 mois. En cas de vente, le département Qualité est alerté instantanément pour validation.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProductionPage;

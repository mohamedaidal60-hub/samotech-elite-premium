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
  AudioLines,
  Zap,
  Star,
  BrainCircuit,
  Volume2
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
  const [aiScore, setAiScore] = useState(0);
  
  // Real-time voice simulation
  const [audioLevels, setAudioLevels] = useState<number[]>(Array(30).fill(10));
  
  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setAudioLevels(Array(30).fill(0).map(() => Math.max(10, Math.random() * 100)));
        if (Math.random() > 0.8) {
          const phrases = [
            "Bonjour, ici le service client SamoTech Partners.",
            "Je vous appelle concernant votre demande de devis.",
            "Nous avons une offre exceptionnelle pour vous aujourd'hui.",
            "Est-ce que vous m'entendez bien ?",
            "Parfait, je transmets votre dossier à la validation.",
            "Merci pour votre confiance, bonne journée."
          ];
          setTranscript(prev => prev + " " + phrases[Math.floor(Math.random() * phrases.length)]);
          setAiScore(prev => Math.min(100, prev + Math.random() * 5));
        }
      }, 300);
    } else {
      setAudioLevels(Array(30).fill(10));
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleStartCall = () => {
    if (!phone) return alert("Veuillez saisir un numéro client");
    setStatus('calling');
    setTranscript("Connexion au serveur Communique...");
    
    setTimeout(() => {
      setTranscript("Appel en cours... [SIGNAL DÉTECTÉ]");
      setIsRecording(true);
      setAiScore(70);
    }, 1500);
  };

  const handleEndCall = () => {
    setIsRecording(false);
    setStatus('recorded');
    setAiScore(prev => Math.round(prev));
    setTranscript(prev => prev + " [APPEL TERMINÉ]");
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
      setAiScore(0);
    }
  };

  return (
    <div className="space-y-8 font-['Outfit']">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-2 border-b border-white/5">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <PhoneCall className="text-white" size={24} />
             </div>
             PROD <span className="premium-gradient-text uppercase">SamoTech Suite</span>
          </h1>
          <p className="text-slate-500 text-sm mt-2 ml-1 flex items-center gap-2 font-medium tracking-wide">
             <Volume2 size={16} className="text-blue-500 animate-pulse" />
             Pipeline de Production Directe • Agent ID: {user?.name.charAt(0)}{user?.id.substring(0,4)}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="glass-card px-5 py-2 flex items-center gap-3 border-slate-800 bg-blue-600/5">
              <Star className="text-amber-500" size={16} />
              <div className="text-right">
                 <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">Score Perf Hebdo</p>
                 <p className="text-sm font-black text-white tracking-widest leading-none mt-1">92.8%</p>
              </div>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Main Production Hub */}
        <div className="xl:col-span-3 space-y-8">
          <section className="glass-card p-10 border-slate-800/50 bg-[#0d121c]/40 relative overflow-hidden shadow-2xl">
            {isRecording && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-rose-500 via-blue-500 to-rose-500 bg-[length:200%_auto] animate-[gradient_2s_linear_infinite]" 
              />
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div className="space-y-6">
                <div className="space-y-3">
                   <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Cible de Prospection (Téléphone)</label>
                   <div className="flex gap-4 group">
                      <div className="relative flex-1">
                         <PhoneCall className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={20} />
                         <input 
                           type="tel" 
                           value={phone}
                           onInput={(e:any) => setPhone(e.target.value)}
                           disabled={status !== 'idle'}
                           placeholder="+213..." 
                           className="w-full bg-[#06090f] border-2 border-slate-800 rounded-[24px] py-6 pl-16 pr-6 text-2xl font-black text-white outline-none focus:border-blue-600 transition-all shadow-inner tracking-tighter"
                         />
                      </div>
                   </div>
                </div>

                <div className="flex gap-4">
                  {status === 'idle' ? (
                    <button 
                      onClick={handleStartCall}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white py-6 rounded-[24px] font-black text-xs uppercase tracking-[0.3em] transition-all shadow-xl shadow-blue-900/40 active:scale-95 flex items-center justify-center gap-3"
                    >
                      INITIALISER L'APPEL <Zap size={18} className="fill-white" />
                    </button>
                  ) : status === 'calling' ? (
                    <button 
                      onClick={handleEndCall}
                      className="flex-1 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white py-6 rounded-[24px] font-black text-xs uppercase tracking-[0.3em] transition-all shadow-xl shadow-rose-900/40 active:scale-95 flex items-center justify-center gap-3"
                    >
                      DECONNEXION <MicOff size={18} />
                    </button>
                  ) : (
                    <button 
                      onClick={() => setStatus('idle')}
                      className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-6 rounded-[24px] font-black text-xs uppercase tracking-[0.3em] transition-all"
                    >
                      NOUVEAU DOSSIER
                    </button>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-center justify-center gap-6">
                 <div className="w-full h-40 bg-slate-950/80 rounded-[32px] border border-slate-800 flex items-end justify-center gap-1.5 p-8 relative group overflow-hidden shadow-inner">
                    <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {audioLevels.map((level, i) => (
                      <motion.div 
                        key={i}
                        animate={{ height: `${level}%` }}
                        className={`w-1.5 rounded-full transition-colors duration-200 ${isRecording ? 'bg-gradient-to-t from-blue-700 to-cyan-400' : 'bg-slate-800'}`}
                      />
                    ))}
                 </div>
                 <div className="flex gap-8 w-full justify-between items-center px-4">
                    <div className="text-center">
                       <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Durée</p>
                       <p className="text-xl font-black text-white font-mono">04:22</p>
                    </div>
                    <div className="text-center">
                       <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Sentiment</p>
                       <p className={`text-xl font-black font-mono ${aiScore > 80 ? 'text-emerald-500' : aiScore > 40 ? 'text-blue-500' : 'text-slate-500'}`}>
                          {aiScore > 0 ? (aiScore > 80 ? 'Positif' : 'Neutre') : '—'}
                       </p>
                    </div>
                    <div className="text-center">
                       <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Pitch Score</p>
                       <p className="text-xl font-black text-cyan-400 font-mono">{aiScore}%</p>
                    </div>
                 </div>
              </div>
            </div>

            <div className="mt-12 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-slate-400 flex items-center gap-2 uppercase tracking-[0.2em]">
                  <BrainCircuit size={18} className={isRecording ? 'text-cyan-500' : ''} />
                  TRANSCRIPTION SÉCURISÉE (AI POWERED)
                </h3>
                <div className="flex items-center gap-2">
                   <div className={`w-2 h-2 rounded-full ${isRecording ? 'bg-rose-500 animate-pulse' : 'bg-slate-800'}`} />
                   <span className="text-[10px] text-slate-600 font-black uppercase tracking-widest">Canal Chiffré AES-256</span>
                </div>
              </div>
              <div className="w-full min-h-[160px] bg-[#06090f]/80 border-2 border-slate-800/80 rounded-[32px] p-8 text-slate-300 font-semibold leading-relaxed text-sm italic shadow-inner relative group">
                {transcript || (status === 'calling' ? "Analyse sonore en cours..." : "En attente de signal audio...")}
                {isRecording && <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} className="inline-block w-2.5 h-4 bg-cyan-500 ml-1" />}
                <div className="absolute bottom-6 right-8 text-[9px] font-black text-slate-700 bg-slate-900 px-3 py-1 rounded-full uppercase">Langue: Français (DZ)</div>
              </div>
            </div>
          </section>

          {/* Classification Hub */}
          <section className={`glass-card p-10 border-slate-800 shadow-xl transition-all duration-500 ${status === 'recorded' ? 'opacity-100 scale-100 translate-y-0' : 'opacity-40 pointer-events-none scale-[0.98] translate-y-4'}`}>
            <h3 className="text-xl font-black text-white mb-8 flex items-center gap-3">
              <FileText className="text-cyan-500" />
              Rapport de Qualification
            </h3>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { id: 'sale', label: 'VENTE VALIDÉE', icon: CheckCircle, color: 'text-emerald-500 bg-emerald-500/5 hover:bg-emerald-500/20 border-emerald-500/20 hover:border-emerald-500/50' },
                { id: 'not_interested', label: 'PAS INTÉRESSÉ', icon: XCircle, color: 'text-rose-500 bg-rose-500/5 hover:bg-rose-500/20 border-rose-500/20 hover:border-rose-500/50' },
                { id: 'callback', label: 'À RAPPELER', icon: Clock, color: 'text-amber-500 bg-amber-500/5 hover:bg-amber-500/20 border-amber-500/20 hover:border-amber-500/50' },
                { id: 'urgent', label: 'RAPPEL PRIORITAIRE', icon: Star, color: 'text-blue-500 bg-blue-500/5 hover:bg-blue-500/20 border-blue-500/20 hover:border-blue-500/50' },
              ].map((cat) => (
                <button 
                  key={cat.id}
                  onClick={() => setClassification(cat.id)}
                  className={`flex flex-col items-center justify-center p-8 border-2 rounded-[32px] transition-all gap-4 group ${classification === cat.id ? 'bg-cyan-600 border-cyan-400 text-white scale-105 shadow-2xl shadow-cyan-600/30' : 'bg-slate-900 border-slate-800 ' + cat.color}`}
                >
                  <cat.icon size={32} className="transition-transform group-hover:rotate-12" />
                  <span className="text-[10px] font-black tracking-[0.2em] uppercase text-center">{cat.label}</span>
                </button>
              ))}
            </div>

            <div className="mt-10 flex justify-end">
              <button 
                onClick={handleSave}
                className="group relative px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-[24px] font-black text-xs uppercase tracking-[0.3em] transition-all shadow-xl shadow-blue-900/40 active:scale-95 flex items-center justify-center gap-3 overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <Save size={20} className="relative z-10" />
                <span className="relative z-10">ARCHIVER AU DOSSIER QUALITÉ</span>
              </button>
            </div>
          </section>
        </div>

        {/* Sidebar Status Hub */}
        <div className="space-y-8">
          <section className="glass-card p-8 border-slate-800 h-fit bg-gradient-to-b from-slate-900/60 to-transparent">
            <h3 className="font-black text-white text-xs uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
              <History size={18} className="text-blue-400" />
              Flux Précédent
            </h3>
            <div className="space-y-4">
              {[
                { name: "S. Belkacem", time: "10:24", status: "Sale", color: 'text-emerald-500' },
                { name: "M. Idir", time: "09:55", status: "Callback", color: 'text-amber-500' },
                { name: "A. Hamza", time: "09:30", status: "Refused", color: 'text-rose-500' },
                { name: "L. Benah", time: "09:12", status: "Sale", color: 'text-emerald-500' }
              ].map((call, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-[#06090f] rounded-2xl border border-slate-800/50 hover:border-slate-700 transition-all cursor-pointer group">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-[11px] font-black text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    {call.name.split(' ')[1].charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-black text-white group-hover:text-blue-400 transition-colors uppercase">{call.name}</p>
                    <p className="text-[10px] text-slate-600 font-bold mt-0.5">{call.time}</p>
                  </div>
                  <span className={`text-[9px] uppercase font-black tracking-widest ${call.color}`}>{call.status}</span>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-4 bg-slate-950 hover:bg-slate-900 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest transition-all border border-slate-800">Voir mon historique</button>
          </section>

          <section className="glass-card p-8 border-slate-800 bg-blue-600/5 border-l-[6px] border-l-blue-600 relative overflow-hidden">
            <Zap className="absolute -top-4 -right-4 w-24 h-24 text-blue-600/10 -rotate-12" />
            <h3 className="font-black text-white text-xs uppercase tracking-[0.2em] mb-4 flex items-center gap-3">
              Directives Admin
            </h3>
            <p className="text-[11px] text-slate-400 font-medium leading-relaxed italic border-l-2 border-slate-800 pl-4">
              "Assurez-vous de capturer l'ID prospect sur chaque fiche. Les ventes non-transcrites seront rejetées automatiquement par le module Qualité."
            </p>
          </section>
        </div>
      </div>
      
      <style>{`
        @keyframes gradient {
           0% { background-position: 0% 50%; }
           100% { background-position: 200% 50%; }
        }
      `}</style>
    </div>
  );
};

export default ProductionPage;

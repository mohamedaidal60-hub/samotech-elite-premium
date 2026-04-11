import React, { useState, useEffect } from 'react';
import { 
  ShieldUnlock, 
  Calendar, 
  User, 
  LogOut, 
  CheckCircle,
  Plus,
  Trash2,
  Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';

const AgentPortal: React.FC = () => {
  const [agents, setAgents] = useState<any[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string>('');
  const [pin, setPin] = useState('');
  const [currentAgent, setCurrentAgent] = useState<any>(null);
  const [absences, setAbsences] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Form states
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [motif, setMotif] = useState('');

  useEffect(() => {
    const loadAgents = async () => {
      const { data } = await supabase.from('agents').select('id, nom').order('nom');
      setAgents(data || []);
    };
    loadAgents();
  }, []);

  const handleLogin = async () => {
    if (!selectedAgent || !pin) return alert("Sélectionnez votre nom et votre PIN");
    setLoading(true);
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .eq('id', selectedAgent)
      .eq('code_pin', pin)
      .maybeSingle();
    
    setLoading(false);
    if (error || !data) return alert("Code PIN incorrect");
    setCurrentAgent(data);
    loadMyAbsences(data.id);
  };

  const loadMyAbsences = async (agentId: string) => {
    const { data } = await supabase
      .from('absences')
      .select('*')
      .eq('agent_id', agentId)
      .order('date_debut', { ascending: false });
    setAbsences(data || []);
  };

  const handleDeclarer = async () => {
    if (!startDate || !endDate) return alert("Veuillez saisir les dates");
    if (endDate < startDate) return alert("La date de fin ne peut pas être avant le début");

    const { error } = await supabase.from('absences').insert({
      agent_id: currentAgent.id,
      agent_nom: currentAgent.nom,
      date_debut: startDate,
      date_fin: endDate,
      motif,
      cree_par: 'agent'
    });

    if (error) return alert(error.message);
    alert("Absence déclarée !");
    setStartDate('');
    setEndDate('');
    setMotif('');
    loadMyAbsences(currentAgent.id);
  };

  const handleAnnuler = async (id: number) => {
    if (!confirm("Annuler cette absence ?")) return;
    await supabase.from('absences').delete().eq('id', id);
    loadMyAbsences(currentAgent.id);
  };

  if (!currentAgent) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md glass-card p-10 border-slate-800 space-y-10">
          <div className="text-center">
             <h1 className="text-3xl font-black text-white mb-2 tracking-tighter">GP<span className="text-blue-500">TRANS</span></h1>
             <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Portail Agent Mobile</p>
          </div>
          
          <div className="space-y-6">
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Sélectionnez votre nom</label>
                <select 
                  value={selectedAgent}
                  onChange={(e) => setSelectedAgent(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl text-white outline-none focus:border-blue-500 appearance-none"
                >
                  <option value="">— Votre Nom —</option>
                  {agents.map(a => <option key={a.id} value={a.id}>{a.nom}</option>)}
                </select>
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Code PIN Sécurisé</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700" size={18} />
                  <input 
                    type="password" 
                    maxLength={6} 
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="••••" 
                    className="w-full bg-slate-950 border border-slate-800 py-4 pl-12 pr-4 rounded-xl text-white outline-none focus:border-blue-500 placeholder:text-slate-800 font-mono tracking-[0.5em]" 
                  />
                </div>
             </div>
             <button onClick={handleLogin} className="w-full btn-primary justify-center py-4 font-black text-xs tracking-[0.3em]">
               {loading ? 'CHARGEMENT...' : 'SE CONNECTER'}
             </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-8 p-4 font-['Outfit']">
      <header className="flex justify-between items-center">
         <div>
            <h2 className="text-xl font-black text-white uppercase tracking-tight">Bonjour, {currentAgent.nom} 👋</h2>
            <p className="text-slate-500 text-xs font-medium">Déclarez vos absences ici.</p>
         </div>
         <button onClick={() => setCurrentAgent(null)} className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-500 hover:text-white transition-all">
            <LogOut size={20} />
         </button>
      </header>

      <main className="space-y-8">
         <section className="glass-card p-8 border-slate-800 space-y-6">
            <h3 className="text-xs font-black text-blue-400 uppercase tracking-[0.2em] flex items-center gap-2">
               <Plus size={16} /> Nouvelle Déclaration
            </h3>
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-500 uppercase">Début</label>
                  <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white outline-none text-xs" />
               </div>
               <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-500 uppercase">Fin</label>
                  <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white outline-none text-xs" />
               </div>
            </div>
            <div className="space-y-2">
               <label className="text-[9px] font-black text-slate-500 uppercase">Motif (Facultatif)</label>
               <input 
                 type="text" 
                 value={motif} 
                 onChange={(e) => setMotif(e.target.value)} 
                 placeholder="Ex: RDV Médical, Congé..." 
                 className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white outline-none text-xs placeholder:text-slate-800" 
               />
            </div>
            <button onClick={handleDeclarer} className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-xl shadow-lg shadow-blue-500/20 transition-all">
               VALIDER LA DÉCLARATION
            </button>
         </section>

         <section className="space-y-4">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Mes Dossiers Récents</h3>
            <div className="space-y-3">
               {absences.map((a, i) => (
                 <div key={i} className="glass-card p-4 border-slate-800 flex items-center justify-between group">
                    <div>
                       <p className="text-xs font-black text-white uppercase tracking-tight">Du {a.date_debut} au {a.date_fin}</p>
                       <p className="text-[10px] text-slate-500 font-medium mt-1">{a.motif || 'Aucun motif spécifié'}</p>
                       <span className="mt-2 inline-flex items-center gap-1.5 text-[8px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/20">
                          Enregistré
                       </span>
                    </div>
                    <button onClick={() => handleAnnuler(a.id)} className="p-2 text-slate-700 hover:text-rose-500 transition-colors">
                       <Trash2 size={16} />
                    </button>
                 </div>
               ))}
               {absences.length === 0 && <p className="text-center py-10 text-slate-700 text-xs italic font-bold tracking-widest uppercase">Aucune absence déclarée</p>}
            </div>
         </section>
      </main>
    </div>
  );
};

export default AgentPortal;

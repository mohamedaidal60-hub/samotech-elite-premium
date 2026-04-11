import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Clock, 
  Calendar, 
  Search, 
  Plus, 
  Download,
  Settings,
  Info,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';

const HRPage: React.FC = () => {
  const [agents, setAgents] = useState<any[]>([]);
  const [absences, setAbsences] = useState<any[]>([]);
  const [view, setView] = useState<'roster' | 'absences' | 'settings'>('absences');
  const [presenceApi, setPresenceApi] = useState('https://api.presencesheque.com/v1');

  useEffect(() => {
    const loadData = async () => {
      const { data: p } = await supabase.from('agents').select('*').order('nom');
      setAgents(p || []);
      
      const { data: a } = await supabase.from('absences').select('*').order('date_debut', { ascending: false });
      setAbsences(a || []);
    };
    loadData();
  }, []);

  const handleValidate = async (id: number) => {
    await supabase.from('absences').update({ valide: true }).eq('id', id);
    setAbsences(absences.map(a => a.id === id ? { ...a, valide: true } : a));
  };

  return (
    <div className="space-y-8 font-['Outfit']">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-slate-800/50">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <Users className="text-blue-500" />
            Gestion Ressources Humaines
          </h1>
          <p className="text-slate-400 text-sm mt-1 font-medium">Supervision des effectifs et planning des absences (GPTrans Sync).</p>
        </div>
        
        <div className="flex bg-slate-900/50 p-1 rounded-2xl border border-slate-800">
          {[
            { id: 'absences', label: 'Absences', icon: Calendar },
            { id: 'roster', label: 'Effectif', icon: Users },
            { id: 'settings', label: 'Config Presence', icon: Settings }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setView(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all font-bold text-[10px] uppercase tracking-widest ${view === tab.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:text-white'}`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <main>
        <AnimatePresence mode="wait">
          {view === 'absences' ? (
            <motion.div 
              key="absences"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { label: 'Absents (Aujourd\'hui)', count: absences.filter(a => {
                    const t = new Date().toISOString().split('T')[0];
                    return a.date_debut <= t && a.date_fin >= t;
                  }).length, color: 'text-rose-500' },
                  { label: 'Total Agents', count: agents.length, color: 'text-blue-500' },
                  { label: 'En attente', count: absences.filter(a => !a.valide).length, color: 'text-amber-500' },
                  { label: 'Taux de force', count: '94%', color: 'text-emerald-500' },
                ].map((kpi, idx) => (
                  <div key={idx} className="glass-card p-6 border-slate-800/50">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{kpi.label}</p>
                    <h3 className={`text-3xl font-black ${kpi.color}`}>{kpi.count}</h3>
                  </div>
                ))}
              </div>

              <div className="glass-card border-slate-800 overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/40">
                  <h2 className="text-lg font-black text-white flex items-center gap-2">
                    <Calendar size={18} className="text-blue-500" />
                    Planning des Absences
                  </h2>
                  <button className="flex items-center gap-2 text-[10px] font-black text-blue-400 hover:text-blue-300 uppercase tracking-widest">
                    <Download size={16} /> EXPORT ANALYTIQUE
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-900/60 text-slate-500 text-[10px] uppercase tracking-[0.2em] font-black">
                        <th className="px-8 py-5">Collaborateur</th>
                        <th className="px-8 py-5">Période</th>
                        <th className="px-8 py-5">Motif</th>
                        <th className="px-8 py-5">Origine</th>
                        <th className="px-8 py-5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {absences.map((abs, i) => (
                        <tr key={i} className="hover:bg-slate-800/20 transition-all group">
                          <td className="px-8 py-5 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-black text-slate-500 group-hover:bg-blue-600/20 group-hover:text-blue-500 transition-all uppercase text-xs">
                              {abs.agent_nom.charAt(0)}
                            </div>
                            <span className="font-black text-white uppercase text-sm">{abs.agent_nom}</span>
                          </td>
                          <td className="px-8 py-5">
                             <div className="flex flex-col">
                                <span className="text-xs font-black text-slate-200">Du {abs.date_debut}</span>
                                <span className="text-[10px] font-bold text-slate-500">Au {abs.date_fin}</span>
                             </div>
                          </td>
                          <td className="px-8 py-5 text-xs text-slate-400 font-medium italic">
                             {abs.motif || '—'}
                          </td>
                          <td className="px-8 py-5">
                             <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${abs.cree_par === 'admin' ? 'bg-blue-500/10 text-blue-500' : 'bg-slate-800 text-slate-400'}`}>
                                {abs.cree_par}
                             </span>
                          </td>
                          <td className="px-8 py-5 text-right">
                             {!abs.valide ? (
                               <button onClick={() => handleValidate(abs.id)} className="p-2 text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-all">
                                  <CheckCircle size={20} />
                               </button>
                             ) : (
                               <span className="text-emerald-500"><CheckCircle size={20} className="inline opacity-50" /></span>
                             )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          ) : view === 'roster' ? (
            <motion.div 
               key="roster"
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {agents.map((agent, i) => (
                <div key={i} className="glass-card p-8 border-slate-800/50 group hover:border-blue-500/40 transition-all flex flex-col gap-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4">
                     <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-[8px] font-black text-slate-600 uppercase tracking-widest">#{agent.code_pin}</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-3xl bg-slate-900 flex items-center justify-center text-xl font-black text-slate-500 group-hover:bg-blue-600/10 group-hover:text-blue-500 transition-all border border-slate-800 uppercase">
                      {agent.nom.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-white font-black uppercase text-sm tracking-tight">{agent.nom}</h3>
                      <p className="text-blue-400 text-[10px] uppercase font-black tracking-[0.2em] mt-1">{agent.role}</p>
                    </div>
                  </div>
                  <div className="pt-6 border-t border-slate-800 flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
                     <span>Accès Portail OK</span>
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                  </div>
                </div>
              ))}
              <button className="glass-card p-8 border-dashed border-slate-700/50 flex flex-col items-center justify-center gap-4 text-slate-600 hover:text-blue-400 hover:border-blue-500/30 transition-all group">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:bg-blue-600/10 transition-all">
                   <Plus size={24} />
                </div>
                <span className="font-black text-[10px] uppercase tracking-[0.3em]">Ajouter Agent</span>
              </button>
            </motion.div>
          ) : (
            <motion.div 
               key="settings"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="max-w-xl mx-auto space-y-8 py-10"
            >
              <div className="glass-card p-10 border-slate-800 space-y-10 bg-blue-600/5">
                <div className="text-center space-y-3">
                  <div className="w-20 h-20 mx-auto rounded-3xl bg-blue-600/10 flex items-center justify-center text-blue-500 mb-6">
                     <Settings size={40} />
                  </div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">Synchronisation API</h2>
                  <p className="text-slate-500 text-sm font-medium">Liez vos pointeuses externes via API Presence Sheque.</p>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">URL Endpoint Presence</label>
                    <input 
                      type="text" 
                      value={presenceApi}
                      onChange={(e) => setPresenceApi(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white outline-none focus:border-blue-500 font-bold" 
                    />
                  </div>
                  
                  <div className="flex gap-4 p-5 bg-blue-500/10 rounded-[24px] border border-blue-500/20 items-start">
                    <Info className="text-blue-500 shrink-0" size={20} />
                    <p className="text-[11px] text-blue-300 leading-relaxed font-medium italic">
                      Les absences déclarées ici sont synchronisées en temps réel avec l'application Driver de GPTrans.
                    </p>
                  </div>

                  <button className="w-full btn-primary justify-center py-5 font-black text-xs tracking-[0.3em]">TESTER LA CONNEXION</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default HRPage;

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Clock, 
  Calendar, 
  Search, 
  Filter, 
  Plus, 
  Download,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';

const HRPage: React.FC = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [view, setView] = useState<'roster' | 'attendance' | 'settings'>('attendance');
  const [presenceApi, setPresenceApi] = useState('https://api.presencesheque.com/v1');
  const [apiKey, setApiKey] = useState('************************');

  useEffect(() => {
    const loadData = async () => {
      const { data: p } = await supabase.from('profiles').select('*');
      setEmployees(p || []);
      
      const { data: a } = await supabase.from('attendance').select('*, profiles(full_name)').order('check_in', { ascending: false });
      setAttendance(a || []);
    };
    loadData();
  }, []);

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-slate-800/50">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Users className="text-blue-500" />
            Gestion RH & Pointage
          </h1>
          <p className="text-slate-400 text-sm mt-1">Supervision des effectifs, assiduité et synchronisation Presence Sheque.</p>
        </div>
        
        <div className="flex bg-slate-900/50 p-1 rounded-2xl border border-slate-800">
          {[
            { id: 'attendance', label: 'Pointage Live', icon: Clock },
            { id: 'roster', label: 'Effectif', icon: Users },
            { id: 'settings', label: 'APIs Presence', icon: Settings }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setView(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all font-bold text-xs uppercase tracking-widest ${view === tab.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white'}`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <main className="space-y-6">
        <AnimatePresence mode="wait">
          {view === 'attendance' ? (
            <motion.div 
              key="attendance"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { label: 'Présents', count: '131', sub: 'Sur 142 totaux', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                  { label: 'Retards', count: '8', sub: 'Moyenne < 15min', color: 'text-amber-500', bg: 'bg-amber-500/10' },
                  { label: 'Absences', count: '3', sub: 'Non justifiées', color: 'text-rose-500', bg: 'bg-rose-500/10' },
                  { label: 'Taux Présence', count: '92.3%', sub: 'Semaine en cours', color: 'text-blue-500', bg: 'bg-blue-500/10' },
                ].map((kpi, idx) => (
                  <div key={idx} className="glass-card p-6 border-slate-800">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{kpi.label}</p>
                    <h3 className={`text-2xl font-extrabold ${kpi.color}`}>{kpi.count}</h3>
                    <p className="text-[10px] text-slate-500 mt-2">{kpi.sub}</p>
                  </div>
                ))}
              </div>

              <div className="glass-card border-slate-800 overflow-hidden">
                <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/40">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Calendar size={18} className="text-blue-500" />
                    Pointages du Jour — {new Date().toLocaleDateString('fr-FR')}
                  </h2>
                  <button className="flex items-center gap-2 text-xs font-bold text-blue-400 hover:text-blue-300">
                    <Download size={16} /> EXPORT EXCEL
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-900/60 text-slate-500 text-[10px] uppercase tracking-[0.1em] font-bold">
                        <th className="px-6 py-4">Collaborateur</th>
                        <th className="px-6 py-4">Arrivée</th>
                        <th className="px-6 py-4">Sortie</th>
                        <th className="px-6 py-4">Statut</th>
                        <th className="px-6 py-4">Source PresenceSheque</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-slate-800/50">
                      {attendance.length > 0 ? attendance.map((rec, i) => (
                        <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                          <td className="px-6 py-4 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-700 to-slate-800 flex items-center justify-center font-bold text-xs">
                              {rec.profiles?.full_name?.charAt(0) || 'U'}
                            </div>
                            <span className="font-bold text-white">{rec.profiles?.full_name}</span>
                          </td>
                          <td className="px-6 py-4 text-slate-300 font-medium">
                            {new Date(rec.check_in).toLocaleTimeString()}
                          </td>
                          <td className="px-6 py-4 text-slate-500">
                            {rec.check_out ? new Date(rec.check_out).toLocaleTimeString() : '—'}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-md text-[10px] font-extrabold uppercase ${rec.status === 'present' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                              {rec.status === 'late' ? 'Retard' : 'Présent'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-slate-500 text-xs bg-slate-800/30 px-2 py-1 rounded w-fit">
                              <ExternalLink size={12} /> Sync: Auto
                            </div>
                          </td>
                        </tr>
                      )) : (
                        <tr><td colSpan={5} className="p-10 text-center text-slate-600 font-bold italic">Aucun pointage aujourd'hui</td></tr>
                      )}
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
               className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {employees.map((emp, i) => (
                <div key={i} className="glass-card p-6 border-slate-800 group hover:border-blue-700 transition-all flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-xl font-bold text-white shadow-xl shadow-blue-500/10">
                    {emp.full_name?.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-white font-extrabold">{emp.full_name}</h3>
                    <p className="text-blue-400 text-[10px] uppercase font-bold tracking-widest">{emp.role}</p>
                    <p className="text-slate-500 text-xs mt-1">{emp.email}</p>
                  </div>
                </div>
              ))}
              <button className="glass-card p-6 border-dashed border-slate-700 flex flex-col items-center justify-center gap-3 text-slate-500 hover:text-blue-400 hover:border-blue-500/50 transition-all">
                <Plus size={32} />
                <span className="font-bold text-xs uppercase tracking-widest">Nouveau Profil</span>
              </button>
            </motion.div>
          ) : (
            <motion.div 
               key="settings"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="max-w-2xl mx-auto space-y-8 py-10"
            >
              <div className="glass-card p-10 border-slate-800 space-y-8 bg-blue-600/5">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-extrabold text-white">Config Presence Sheque</h2>
                  <p className="text-slate-500 text-sm">Liez vos pointeuses biométriques via API Rest.</p>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">URL EndPoint API</label>
                    <input 
                      type="text" 
                      value={presenceApi}
                      onChange={(e) => setPresenceApi(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Clé d'API (Secret Key)</label>
                    <input 
                      type="password" 
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500" 
                    />
                  </div>
                  
                  <div className="flex gap-4 p-4 bg-blue-500/10 rounded-xl border border-blue-500/20 items-start">
                    <Info className="text-blue-500 shrink-0" size={20} />
                    <p className="text-[11px] text-blue-300 leading-relaxed italic">
                      Les logs de synchronisation indiquent que le dernier scan a été effectué il y a 8 minutes. 
                      Tous les pointages sont automatiquement réconciliés avec les profils employés Supabase.
                    </p>
                  </div>

                  <button className="w-full btn-primary justify-center py-4">TESTER & VALIDER LA CONNEXION</button>
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

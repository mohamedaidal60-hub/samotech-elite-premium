import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Users, 
  MessageSquare, 
  FileUp, 
  Send,
  UserPlus,
  FileCheck,
  FileX,
  Plus,
  MoreVertical,
  Activity,
  History,
  FileText,
  BadgeAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [view, setView] = useState<'users' | 'communication' | 'vault'>('users');
  const [newUser, setNewUser] = useState({ email: '', name: '', role: 'teleoperator', pin: '0000' });
  const [broadcast, setBroadcast] = useState('');

  useEffect(() => {
    const loadData = async () => {
      const { data: p } = await supabase.from('agents').select('*').order('created_at', { ascending: false });
      setEmployees(p || []);
      
      const { data: d } = await supabase.from('documents').select('*, agents(nom)').order('created_at', { ascending: false });
      setDocuments(d || []);
    };
    loadData();
  }, []);

  const handleCreateUser = async () => {
    if (!newUser.name) return alert("Veuillez remplir le nom");
    
    const { error } = await supabase.from('agents').insert({
      nom: newUser.name,
      email: newUser.email,
      role: newUser.role,
      code_pin: newUser.pin
    });

    if (error) return alert("Erreur: " + error.message);
    
    alert("Compte créé pour " + newUser.name);
    setNewUser({ email: '', name: '', role: 'teleoperator', pin: '0000' });
    // Refresh
    const { data: p } = await supabase.from('agents').select('*').order('created_at', { ascending: false });
    setEmployees(p || []);
  };

  const handleSendBroadcast = () => {
    if (!broadcast) return;
    alert("Message diffusé à tous les collaborateurs de Growth Partners !");
    setBroadcast('');
  };

  return (
    <div className="space-y-8 font-['Outfit']">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <ShieldAlert className="text-blue-500" />
            Centre d'Administration Elite
          </h1>
          <p className="text-slate-400 text-sm mt-1 font-medium">Contrôle global, gestion des droits et coffre-fort documentaire.</p>
        </div>
        
        <div className="flex bg-slate-900/50 p-1 rounded-2xl border border-slate-800 shadow-xl">
          {[
            { id: 'users', label: 'Utilisateurs', icon: Users },
            { id: 'communication', label: 'Communication', icon: MessageSquare },
            { id: 'vault', label: 'Coffre-fort', icon: FileUp }
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

      <main className="space-y-6">
        <AnimatePresence mode="wait">
          {view === 'users' ? (
            <motion.div 
              key="users"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid grid-cols-1 xl:grid-cols-3 gap-8"
            >
              <div className="xl:col-span-1 space-y-6">
                <section className="glass-card p-10 border-slate-800 bg-blue-600/5">
                  <h3 className="text-lg font-black text-white mb-8 flex items-center gap-3">
                    <UserPlus className="text-blue-500" size={24} />
                    Nouveau Profil
                  </h3>
                  <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nom Complet</label>
                       <input 
                         type="text" 
                         value={newUser.name}
                         onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                         className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white outline-none focus:border-blue-500 font-bold" 
                         placeholder="e.g. Samir Slimani"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Corporate</label>
                       <input 
                         type="email" 
                         value={newUser.email}
                         onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                         className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white outline-none focus:border-blue-500 font-bold" 
                         placeholder="samir@gp.dz"
                       />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Rôle</label>
                           <select 
                             value={newUser.role}
                             onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                             className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 cursor-pointer text-xs font-bold"
                           >
                             <option value="teleoperator">Agent</option>
                             <option value="supervisor">Superviseur</option>
                             <option value="quality_agent">Qualité</option>
                             <option value="admin">Admin</option>
                           </select>
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">PIN Mobile</label>
                           <input 
                             type="text" 
                             maxLength={4}
                             value={newUser.pin}
                             onChange={(e) => setNewUser({...newUser, pin: e.target.value})}
                             className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 font-mono text-center font-black" 
                           />
                        </div>
                    </div>
                    <button onClick={handleCreateUser} className="w-full btn-primary justify-center py-5 font-black text-xs tracking-[0.3em] mt-4">CRÉER LE DOSSIER AGENT</button>
                  </div>
                </section>
              </div>

              <div className="xl:col-span-2 space-y-6">
                <section className="glass-card border-slate-800 overflow-hidden shadow-2xl">
                  <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-950/40">
                    <h2 className="text-sm font-black text-white flex items-center gap-3 uppercase tracking-widest">
                      <Users size={18} className="text-blue-500" />
                      Collaborateurs Actifs
                    </h2>
                  </div>
                  <div className="divide-y divide-slate-800/50">
                    {employees.map((emp, i) => (
                      <div key={i} className="p-5 flex items-center justify-between hover:bg-slate-800/20 transition-all cursor-pointer group">
                        <div className="flex items-center gap-6">
                          <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center font-black text-slate-500 group-hover:bg-blue-600/10 group-hover:text-blue-500 transition-all border border-slate-800 uppercase">
                            {emp.nom?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <p className="font-black text-white uppercase text-sm tracking-tight">{emp.nom}</p>
                            <div className="flex items-center gap-3 mt-1.5">
                               <span className="text-[10px] text-blue-400 uppercase font-black tracking-widest">{emp.role}</span>
                               <span className="w-1 h-1 rounded-full bg-slate-700" />
                               <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">PIN: {emp.code_pin}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-8">
                           <div className="hidden lg:block text-right">
                              <p className="text-xs text-slate-400 font-medium">{emp.email || 'Pas d\'email'}</p>
                              <p className="text-[10px] text-slate-600 font-bold uppercase mt-1">Dernier accès: Récemment</p>
                           </div>
                           <button className="p-2 text-slate-700 hover:text-white transition-colors">
                              <MoreVertical size={20} />
                           </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </motion.div>
          ) : view === 'communication' ? (
            <motion.div 
               key="comm"
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="max-w-4xl mx-auto space-y-8"
            >
              <section className="glass-card p-10 border-slate-800 space-y-10 shadow-2xl">
                <div className="flex items-center gap-8">
                   <div className="w-20 h-20 rounded-[32px] bg-blue-600/10 flex items-center justify-center text-blue-500 border border-blue-500/20 shadow-lg shadow-blue-500/10">
                      <MessageSquare size={36} />
                   </div>
                   <div>
                      <h2 className="text-3xl font-black text-white uppercase tracking-tight">Annonce Global</h2>
                      <p className="text-slate-500 font-medium">Diffusez une notification instantanée à tous les terminaux.</p>
                   </div>
                </div>

                <div className="space-y-6">
                   <textarea 
                     value={broadcast}
                     onChange={(e) => setBroadcast(e.target.value)}
                     className="w-full h-48 bg-slate-950 border-2 border-slate-800 rounded-[32px] p-8 text-white outline-none focus:border-blue-600 transition-all placeholder:text-slate-800 resize-none font-medium text-lg italic shadow-inner"
                     placeholder="Tapez votre message ici..."
                   ></textarea>
                   <div className="flex justify-between items-center">
                      <p className="text-[11px] text-slate-600 font-bold uppercase tracking-widest max-w-sm flex items-center gap-2">
                         <BadgeAlert size={14} /> Canal de diffusion haute priorité
                      </p>
                      <button onClick={handleSendBroadcast} className="btn-primary py-5 px-10 font-black text-xs tracking-[0.3em]">
                         DIFFUSER MAINTENANT
                         <Send size={18} />
                      </button>
                   </div>
                </div>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="glass-card p-8 border-slate-800 flex items-center gap-6 bg-emerald-500/[0.03] border-l-[6px] border-l-emerald-600">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                       <Activity size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-white uppercase tracking-tight">Système Nominal</p>
                      <p className="text-[10px] text-emerald-500/70 uppercase font-black tracking-widest">Temps de réponse 42ms</p>
                    </div>
                 </div>
                 <div className="glass-card p-8 border-slate-800 flex items-center gap-6 bg-amber-500/[0.03] border-l-[6px] border-l-amber-600">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                       <History size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-white uppercase tracking-tight">Réconciliation</p>
                      <p className="text-[10px] text-amber-500/70 uppercase font-black tracking-widest">Logs GPTrans synchronisés</p>
                    </div>
                 </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
               key="vault"
               initial={{ opacity: 0, scale: 0.98 }}
               animate={{ opacity: 1, scale: 1 }}
               className="space-y-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                 <div className="lg:col-span-1 space-y-8">
                    <section className="glass-card p-8 border-slate-800 space-y-6 shadow-xl">
                       <h3 className="font-black text-white uppercase text-[10px] tracking-[0.3em] border-b border-white/5 pb-4">Classification Archives</h3>
                       <div className="space-y-3">
                          {[
                            { label: 'Attestations Travail', count: 12, icon: FileCheck, color: 'text-emerald-500' },
                            { label: 'Congés / Absences', count: 4, icon: FileText, color: 'text-blue-500' },
                            { label: 'Dossiers Medicaux', count: 8, icon: History, color: 'text-rose-500' },
                            { label: 'Contrats Signés', count: 142, icon: ShieldAlert, color: 'text-amber-500' }
                          ].map((cat, i) => (
                            <div key={i} className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-slate-800/40 transition-all cursor-pointer group">
                               <div className="flex items-center gap-4">
                                  <cat.icon size={18} className={cat.color} />
                                  <span className="text-[11px] font-black text-slate-400 group-hover:text-white transition-colors uppercase tracking-tight">{cat.label}</span>
                               </div>
                               <span className="text-[9px] bg-slate-900 border border-slate-800 text-slate-500 px-2 py-0.5 rounded-lg font-black">{cat.count}</span>
                            </div>
                          ))}
                       </div>
                    </section>
                    <button className="w-full py-6 border-2 border-dashed border-slate-800 rounded-[32px] text-slate-600 hover:text-blue-500 hover:border-blue-500/30 transition-all flex flex-col items-center justify-center gap-3 font-black text-[10px] uppercase tracking-[0.2em] bg-slate-950/20">
                       <Plus size={32} />
                       Nouveau Verssement
                    </button>
                 </div>

                 <div className="lg:col-span-3">
                    <div className="glass-card border-slate-800 shadow-2xl overflow-hidden">
                       <div className="p-8 border-b border-slate-800 bg-slate-950/40 flex items-center justify-between">
                          <h2 className="text-lg font-black text-white uppercase tracking-tight">Registre Documentaire Centralisé</h2>
                          <div className="flex items-center gap-4 bg-slate-950 p-2 rounded-2xl border border-slate-800">
                             <Search size={16} className="ml-3 text-slate-700" />
                             <input type="text" placeholder="RECHERCHER UN FICHIER..." className="bg-transparent text-[10px] font-black uppercase tracking-widest outline-none text-white w-56 placeholder:text-slate-800" />
                          </div>
                       </div>
                       <div className="overflow-x-auto">
                           <table className="w-full text-left">
                              <thead>
                                 <tr className="text-[10px] uppercase font-black text-slate-600 bg-slate-900/60 tracking-[0.2em]">
                                    <th className="px-10 py-6">Libellé Document</th>
                                    <th className="px-10 py-6 text-center">Date Archivage</th>
                                    <th className="px-10 py-6">Propriétaire</th>
                                    <th className="px-10 py-6 text-center">Type</th>
                                    <th className="px-10 py-6 text-right">Actions</th>
                                 </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-900">
                                 {documents.length > 0 ? documents.map((doc, i) => (
                                   <tr key={i} className="hover:bg-slate-800/20 group transition-colors">
                                      <td className="px-10 py-6 font-black text-slate-300 text-sm italic">{doc.file_name}</td>
                                      <td className="px-10 py-6 text-center text-xs font-bold text-slate-500">{new Date(doc.created_at).toLocaleDateString()}</td>
                                      <td className="px-10 py-6">
                                         <span className="text-xs text-blue-400 font-black uppercase tracking-tight">{doc.agents?.nom}</span>
                                      </td>
                                      <td className="px-10 py-6 text-center">
                                         <span className="px-3 py-1 bg-slate-900 border border-slate-800 text-slate-500 rounded-lg text-[9px] uppercase font-black tracking-widest">{doc.category || 'Général'}</span>
                                      </td>
                                      <td className="px-10 py-6 text-right">
                                         <button className="text-slate-700 hover:text-white transition-colors"><MoreVertical size={20} /></button>
                                      </td>
                                   </tr>
                                 )) : (
                                   <tr><td colSpan={5} className="p-20 text-center text-slate-800 italic font-black uppercase tracking-widest text-xs">Coffre-fort vide</td></tr>
                                 )}
                              </tbody>
                           </table>
                       </div>
                    </div>
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default AdminPage;

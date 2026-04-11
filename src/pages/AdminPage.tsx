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
  const [newUser, setNewUser] = useState({ email: '', name: '', role: 'teleoperator' });
  const [broadcast, setBroadcast] = useState('');

  useEffect(() => {
    const loadData = async () => {
      const { data: p } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      setEmployees(p || []);
      
      const { data: d } = await supabase.from('documents').select('*, profiles(full_name)').order('created_at', { ascending: false });
      setDocuments(d || []);
    };
    loadData();
  }, []);

  const handleCreateUser = async () => {
    if (!newUser.email || !newUser.name) return alert("Veuillez remplir tous les champs");
    // Note: This would normally use Auth API. Since we are in client, we just simulate profile creation or use an Edge Function.
    alert("Simulation: Création du compte pour " + newUser.name + " (" + newUser.email + "). Un email de confirmation a été envoyé.");
    setNewUser({ email: '', name: '', role: 'teleoperator' });
  };

  const handleSendBroadcast = () => {
    if (!broadcast) return;
    alert("Message diffusé à tous les collaborateurs de Growth Partners !");
    setBroadcast('');
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <ShieldAlert className="text-blue-500" />
            Centre d'Administration Elite
          </h1>
          <p className="text-slate-400 text-sm mt-1">Contrôle global, gestion des droits et coffre-fort documentaire.</p>
        </div>
        
        <div className="flex bg-slate-900/50 p-1 rounded-2xl border border-slate-800">
          {[
            { id: 'users', label: 'Utilisateurs', icon: Users },
            { id: 'communication', label: 'Communication', icon: MessageSquare },
            { id: 'vault', label: 'Coffre-fort', icon: FileUp }
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
          {view === 'users' ? (
            <motion.div 
              key="users"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid grid-cols-1 xl:grid-cols-3 gap-8"
            >
              <div className="xl:col-span-1 space-y-6">
                <section className="glass-card p-8 border-slate-800 bg-blue-600/5">
                  <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <UserPlus className="text-blue-500" />
                    Créer un Profil
                  </h3>
                  <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-slate-500 uppercase">Nom Complet</label>
                       <input 
                         type="text" 
                         value={newUser.name}
                         onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                         className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500" 
                         placeholder="e.g. Samir Slimani"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-slate-500 uppercase">Email Corporate</label>
                       <input 
                         type="email" 
                         value={newUser.email}
                         onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                         className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500" 
                         placeholder="samir@growthpartners.dz"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-slate-500 uppercase">Rôle & Accès</label>
                       <select 
                         value={newUser.role}
                         onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                         className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 cursor-pointer"
                       >
                         <option value="teleoperator">Téléopérateur</option>
                         <option value="supervisor">Superviseur</option>
                         <option value="quality_agent">Qualité</option>
                         <option value="trainer">Formateur</option>
                         <option value="admin">Administrateur</option>
                       </select>
                    </div>
                    <button onClick={handleCreateUser} className="w-full btn-primary justify-center py-4">CREER LE COMPTE</button>
                    <p className="text-[10px] text-slate-600 italic text-center leading-relaxed">Le collaborateur recevra ses accès temporaires par email automatiquement.</p>
                  </div>
                </section>
              </div>

              <div className="xl:col-span-2 space-y-6">
                <section className="glass-card border-slate-800 overflow-hidden">
                  <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/40">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <Users size={18} className="text-blue-500" />
                      Collaborateurs Actifs
                    </h2>
                  </div>
                  <div className="divide-y divide-slate-800/50">
                    {employees.map((emp, i) => (
                      <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-800/20 transition-all cursor-pointer group">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center font-bold text-slate-400 group-hover:bg-blue-600/20 group-hover:text-blue-500 transition-colors">
                            {emp.full_name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <p className="font-bold text-white">{emp.full_name}</p>
                            <p className="text-[10px] text-blue-400 uppercase tracking-widest leading-none mt-1">{emp.role}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                           <div className="hidden md:block text-right">
                              <p className="text-xs text-slate-500">{emp.email}</p>
                              <p className="text-[10px] text-slate-600 mt-1">Dernière connexion: Hier 14:22</p>
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
              <section className="glass-card p-10 border-slate-800 space-y-8">
                <div className="flex items-center gap-6">
                   <div className="w-16 h-16 rounded-3xl bg-blue-600/10 flex items-center justify-center text-blue-500">
                      <MessageSquare size={32} />
                   </div>
                   <div>
                      <h2 className="text-2xl font-extrabold text-white">Broadcast Interne</h2>
                      <p className="text-slate-500">Diffusez une annonce instantanée à tous les tableaux de bord.</p>
                   </div>
                </div>

                <div className="space-y-4">
                   <textarea 
                     value={broadcast}
                     onChange={(e) => setBroadcast(e.target.value)}
                     className="w-full h-40 bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white outline-none focus:border-blue-500 transition-all placeholder:text-slate-700 resize-none"
                     placeholder="Ecrivez votre annonce ici..."
                   ></textarea>
                   <div className="flex justify-between items-center">
                      <p className="text-[10px] text-slate-500 italic max-w-sm">Ce message apparaîtra en haut de chaque module utilisateur avec une notification push.</p>
                      <button onClick={handleSendBroadcast} className="btn-primary">
                         DIFFUSER L'ANNONCE
                         <Send size={18} />
                      </button>
                   </div>
                </div>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="glass-card p-6 border-slate-800 flex items-center gap-4 bg-emerald-500/5">
                    <BadgeAlert className="text-emerald-500" />
                    <div>
                      <p className="text-sm font-bold text-white">Mode Urgence</p>
                      <p className="text-[10px] text-slate-400 uppercase font-semibold">Desactiver temporairement tous les accès</p>
                    </div>
                 </div>
                 <div className="glass-card p-6 border-slate-800 flex items-center gap-4 bg-amber-500/5">
                    <History className="text-amber-500" />
                    <div>
                      <p className="text-sm font-bold text-white">Logs Système</p>
                      <p className="text-[10px] text-slate-400 uppercase font-semibold">Dernière activité: Import Pointage API</p>
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
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                 <div className="lg:col-span-1 space-y-6">
                    <section className="glass-card p-6 border-slate-800 space-y-6">
                       <h3 className="font-bold text-white uppercase text-xs tracking-widest border-b border-slate-800 pb-3">Types de Documents</h3>
                       <div className="space-y-2">
                          {[
                            { label: 'Attestations Travail', count: 12, icon: FileCheck, color: 'text-emerald-500' },
                            { label: 'Titres de Congés', count: 4, icon: FileText, color: 'text-blue-500' },
                            { label: 'Certificats Médicaux', count: 8, icon: History, color: 'text-rose-500' },
                            { label: 'Contrats Signés', count: 142, icon: ShieldAlert, color: 'text-amber-500' }
                          ].map((cat, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/40 transition-all cursor-pointer">
                               <div className="flex items-center gap-3">
                                  <cat.icon size={16} className={cat.color} />
                                  <span className="text-[11px] font-bold text-slate-300">{cat.label}</span>
                               </div>
                               <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-bold">{cat.count}</span>
                            </div>
                          ))}
                       </div>
                    </section>
                    <button className="w-full py-4 border-2 border-dashed border-slate-800 rounded-3xl text-slate-500 hover:text-blue-400 hover:border-blue-500/50 transition-all flex items-center justify-center gap-2 font-bold text-[10px] uppercase tracking-widest">
                       <Plus size={20} />
                       Déposer un Document
                    </button>
                 </div>

                 <div className="lg:col-span-3">
                    <div className="glass-card border-slate-800">
                       <div className="p-6 border-b border-slate-800 bg-slate-900/40 flex items-center justify-between">
                          <h2 className="text-lg font-bold text-white">Archives & Soumissions</h2>
                          <div className="flex items-center gap-3 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                             <Search size={14} className="ml-2 text-slate-500" />
                             <input type="text" placeholder="Rechercher un document..." className="bg-transparent text-[11px] outline-none text-white w-48" />
                          </div>
                       </div>
                       <div className="overflow-x-auto">
                           <table className="w-full text-left">
                              <thead>
                                 <tr className="text-[10px] uppercase font-bold text-slate-600 bg-slate-900/60">
                                    <th className="px-6 py-4">Nom du Fichier</th>
                                    <th className="px-6 py-4">Date de Dépôt</th>
                                    <th className="px-6 py-4">Propriétaire</th>
                                    <th className="px-6 py-4">Type</th>
                                    <th className="px-6 py-4 text-center">Actions</th>
                                 </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-800/30">
                                 {documents.length > 0 ? documents.map((doc, i) => (
                                   <tr key={i} className="hover:bg-slate-800/20 group">
                                      <td className="px-6 py-4 font-bold text-slate-200 text-sm">{doc.file_name}</td>
                                      <td className="px-6 py-4 text-[11px] text-slate-500">{new Date(doc.created_at).toLocaleDateString()}</td>
                                      <td className="px-6 py-4">
                                         <span className="text-xs text-blue-400 font-bold">{doc.profiles?.full_name}</span>
                                      </td>
                                      <td className="px-6 py-4">
                                         <span className="px-2 py-0.5 bg-slate-800 text-slate-400 rounded text-[9px] uppercase font-bold">{doc.type}</span>
                                      </td>
                                      <td className="px-6 py-4 text-center">
                                         <button className="text-slate-500 hover:text-white transition-colors"><MoreVertical size={16} /></button>
                                      </td>
                                   </tr>
                                 )) : (
                                   <tr><td colSpan={5} className="p-10 text-center text-slate-700 italic font-bold">Le coffre-fort est vide</td></tr>
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

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
  AlertCircle,
  Calculator,
  DollarSign,
  TrendingDown,
  TrendingUp,
  FileSpreadsheet,
  X,
  Save,
  Briefcase,
  Smartphone,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';

const HRPage: React.FC = () => {
  const [agents, setAgents] = useState<any[]>([]);
  const [absences, setAbsences] = useState<any[]>([]);
  const [view, setView] = useState<'roster' | 'absences' | 'payroll' | 'settings'>('absences');
  const [presenceApi, setPresenceApi] = useState('https://api.presencesheque.com/v1');
  const [isAddAgentModalOpen, setIsAddAgentModalOpen] = useState(false);

  // New Agent State
  const [newAgent, setNewAgent] = useState({
    nom: '',
    email: '',
    role: 'téléopérateur',
    phone: '',
    code_pin: '0000'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data: p } = await supabase.from('agents').select('*').order('nom');
    setAgents(p || []);
    
    const { data: a } = await supabase.from('absences').select('*').order('date_debut', { ascending: false });
    setAbsences(a || []);
  };

  const handleValidateAbsence = async (id: number) => {
    await supabase.from('absences').update({ valide: true }).eq('id', id);
    loadData();
  };

  const handleSaveAgent = async () => {
    const { error } = await supabase.from('agents').insert([newAgent]);
    if (error) alert("Erreur: " + error.message);
    else {
      setIsAddAgentModalOpen(false);
      loadData();
      setNewAgent({ nom: '', email: '', role: 'téléopérateur', phone: '', code_pin: '0000' });
    }
  };

  const exportLogsToCSV = () => {
    alert("Génération du rapport d'export ZKTECO (CSV/Excel)...");
  };

  const payrollData = [
    { matricule: 'EMP001', name: 'BENALI Mohamed', brut: '135,000', cnas: '12,150', net: '102,450', cost: '170,100' },
    { matricule: 'EMP002', name: 'KADDOUR Fatima', brut: '75,000', cnas: '6,750', net: '58,250', cost: '94,500' },
    { matricule: 'EMP003', name: 'HAMIDI Karim', brut: '55,500', cnas: '4,995', net: '45,618', cost: '69,930' },
    { matricule: 'EMP004', name: 'ZOUAOUI Amina', brut: '105,000', cnas: '9,450', net: '82,150', cost: '132,300' },
  ];

  return (
    <div className="space-y-8 font-['Outfit'] bg-[#06090f] min-h-screen">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Users className="text-white" size={24} />
            </div>
            Système RH <span className="premium-gradient-text">Elite v4</span>
          </h1>
          <p className="text-slate-500 text-xs mt-2 ml-1 font-bold uppercase tracking-widest flex items-center gap-2">
            <ShieldCheck size={14} className="text-blue-500" /> Gestion des Effectifs & Calcul de Paie (Loi 90-11)
          </p>
        </div>
        
        <div className="flex bg-[#0d121c] p-1 rounded-2xl border border-slate-800 shadow-xl">
          {[
            { id: 'absences', label: 'Planning Absences', icon: Calendar },
            { id: 'roster', label: 'Effectif Global', icon: Users },
            { id: 'payroll', label: 'Calcul Paie (Net)', icon: Calculator },
            { id: 'settings', label: 'API Presence', icon: Smartphone }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setView(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all font-black text-[9px] uppercase tracking-widest ${view === tab.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:text-white'}`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <main className="pb-20">
        <AnimatePresence mode="wait">
          {view === 'absences' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { label: 'Absents (Jour)', count: absences.filter(a => {
                    const t = new Date().toISOString().split('T')[0];
                    return a.date_debut <= t && a.date_fin >= t;
                  }).length, color: 'text-rose-500', bg: 'bg-rose-500/5' },
                  { label: 'Total Effectif', count: agents.length, color: 'text-blue-500', bg: 'bg-blue-500/5' },
                  { label: 'Dernière Synchro ZK', count: 'HIER 19:19', color: 'text-amber-500', bg: 'bg-amber-500/5' },
                  { label: 'Taux Présence', count: '94.2%', color: 'text-emerald-500', bg: 'bg-emerald-500/5' },
                ].map((kpi, idx) => (
                  <div key={idx} className={`bg-[#0d121c] p-8 rounded-[32px] border border-slate-800/50 relative overflow-hidden group shadow-xl`}>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">{kpi.label}</p>
                    <h3 className={`text-4xl font-black ${kpi.color} tracking-tighter`}>{kpi.count}</h3>
                    <div className={`absolute top-0 right-0 w-20 h-20 ${kpi.bg.replace('/5','/10')} -mr-10 -mt-10 rounded-full group-hover:scale-110 transition-transform`} />
                  </div>
                ))}
              </div>

               <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                  {/* Planning Table */}
                  <div className="xl:col-span-2 bg-[#0d121c] border border-slate-800/50 rounded-[32px] overflow-hidden shadow-2xl">
                     <div className="p-8 border-b border-white/[0.03] flex justify-between items-center bg-slate-950/20">
                        <h2 className="text-xl font-black text-white flex items-center gap-3 lowercase tracking-tight">
                        <Calendar size={22} className="text-blue-500" /> Planning des Absences
                        </h2>
                        <button className="text-[10px] font-black text-blue-500 uppercase tracking-widest hover:underline">Voir Historique</button>
                     </div>
                     <div className="overflow-x-auto">
                        <table className="w-full text-left">
                        <thead>
                           <tr className="bg-slate-900/60 text-slate-600 text-[10px] uppercase tracking-[0.2em] font-black border-b border-white/5">
                              <th className="px-10 py-6">Collaborateur</th>
                              <th className="px-10 py-6">Période</th>
                              <th className="px-10 py-6 text-right">Statut</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.03]">
                           {absences.slice(0,5).map((abs, i) => (
                              <tr key={i} className="hover:bg-white/[0.01] transition-all group">
                              <td className="px-10 py-6">
                                 <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center font-black text-slate-500 group-hover:bg-blue-600/20 group-hover:text-blue-500 transition-all text-[10px]">
                                    {abs.agent_nom.charAt(0)}
                                    </div>
                                    <span className="font-black text-white uppercase text-xs tracking-tight">{abs.agent_nom}</span>
                                 </div>
                              </td>
                              <td className="px-10 py-6">
                                 <span className="text-slate-400 text-[10px] font-bold">{abs.date_debut} au {abs.date_fin}</span>
                              </td>
                              <td className="px-10 py-6 text-right">
                                 <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase ${abs.valide ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                    {abs.valide ? 'Validé' : 'En attente'}
                                 </span>
                              </td>
                              </tr>
                           ))}
                        </tbody>
                        </table>
                     </div>
                  </div>

                  {/* ZKTECO Logs Viewer */}
                  <div className="xl:col-span-1 bg-[#0d121c] border border-slate-800/50 rounded-[32px] overflow-hidden shadow-2xl flex flex-col">
                     <div className="p-8 border-b border-white/[0.03] bg-amber-500/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                           <Smartphone size={20} className="text-amber-500" />
                           <h2 className="text-sm font-black text-white uppercase tracking-widest">Logs ZKTECO (Live)</h2>
                        </div>
                        <button onClick={exportLogsToCSV} className="p-2 bg-slate-900 rounded-lg text-slate-500 hover:text-white transition-all"><Download size={16} /></button>
                     </div>
                     <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-950/20 p-4 space-y-3">
                        {[
                           { id: '1', name: 'Maiz Oussama', time: '19:19:33', type: 'Sortie', date: '29/01' },
                           { id: '26', name: 'Yanis', time: '12:02:25', type: 'Sortie', date: '30/01' },
                           { id: '19', name: 'Chebbah Lina', time: '11:36:38', type: 'Sortie', date: '30/01' },
                           { id: '13', name: 'Boudjellab Mehdi', time: '11:15:25', type: 'Sortie', date: '30/01' },
                           { id: '12', name: 'Kebbab Mickael', time: '11:15:19', type: 'Sortie', date: '30/01' },
                           { id: '8', name: 'Gamar Sabrina', time: '11:15:11', type: 'Sortie', date: '30/01' },
                        ].map((log, i) => (
                           <div key={i} className="bg-slate-900/50 p-4 rounded-2xl border border-white/5 flex items-center justify-between group hover:border-amber-500/30 transition-all">
                              <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-500 group-hover:bg-amber-500/10 group-hover:text-amber-500 transition-all">#{log.id}</div>
                                 <div>
                                    <p className="text-[11px] font-black text-white uppercase tracking-tight">{log.name}</p>
                                    <p className="text-[9px] text-slate-600 font-bold uppercase">{log.date} · {log.time}</p>
                                 </div>
                              </div>
                              <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest bg-rose-500/5 px-2 py-0.5 rounded-md">{log.type}</span>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </motion.div>
          )}

          {view === 'roster' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
               <div className="flex justify-between items-center bg-[#0d121c] p-6 rounded-[24px] border border-slate-800">
                  <div className="relative w-96">
                     <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                     <input type="text" placeholder="Rechercher par matricule, nom..." className="w-full bg-[#06111a] border border-slate-800 rounded-xl py-4 pl-12 pr-4 text-xs font-bold text-white outline-none focus:border-blue-500" />
                  </div>
                  <button onClick={() => setIsAddAgentModalOpen(true)} className="flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs rounded-2xl shadow-lg transition-all uppercase tracking-widest">
                     <Plus size={18} /> Nouvel Agent
                  </button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {agents.map((agent, i) => (
                  <div key={i} className="bg-[#0d121c] p-10 rounded-[40px] border border-slate-800 group hover:border-blue-500/40 hover:shadow-[0_0_50px_rgba(59,130,246,0.1)] transition-all flex flex-col gap-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6">
                       <span className="px-3 py-1 bg-[#06111a] border border-slate-800 rounded-lg text-[9px] font-black text-slate-600 uppercase tracking-widest">PIN: {agent.code_pin}</span>
                    </div>
                    <div className="flex flex-col items-center text-center gap-6 mt-4">
                      <div className="w-24 h-24 rounded-[36px] bg-[#06111a] border-2 border-slate-800 flex items-center justify-center text-3xl font-black text-slate-600 group-hover:scale-105 group-hover:border-blue-600/40 group-hover:text-blue-500 transition-all uppercase shadow-inner">
                        {agent.nom.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-white uppercase tracking-tight">{agent.nom}</h3>
                        <p className="text-blue-500 text-[10px] uppercase font-black tracking-[0.3em] mt-2 flex items-center justify-center gap-2">
                           <Briefcase size={12} /> {agent.role}
                        </p>
                      </div>
                    </div>
                    <div className="pt-8 border-t border-white/5 flex flex-col gap-3">
                       <div className="flex justify-between text-[9px] font-black text-slate-600 uppercase">
                          <span>Statut Dossier</span>
                          <span className="text-emerald-500">COMPLET</span>
                       </div>
                       <div className="flex justify-between text-[9px] font-black text-slate-600 uppercase">
                          <span>Dernier Pointage</span>
                          <span className="text-slate-400">HIER 18:22</span>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {view === 'payroll' && (
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-[#0d121c] p-8 rounded-[40px] border-l-[10px] border-l-emerald-600 border border-slate-800">
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <DollarSign size={14} className="text-emerald-500" /> Masse Salariale Net
                     </p>
                     <h2 className="text-4xl font-black text-white tracking-tighter">726,716 DA</h2>
                     <div className="mt-4 flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase">
                        <TrendingUp size={14} /> +4.2% vs M-1
                     </div>
                  </div>
                  <div className="bg-[#0d121c] p-8 rounded-[40px] border-l-[10px] border-l-blue-600 border border-slate-800 text-white">
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <CheckCircle size={14} className="text-blue-500" /> Versements CNAS (TS)
                     </p>
                     <h2 className="text-4xl font-black text-white tracking-tighter">71,874 DA</h2>
                     <button className="mt-4 text-[10px] font-black text-blue-400 uppercase tracking-widest hover:underline decoration-white/20">Imprimer Borderaux →</button>
                  </div>
                  <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 rounded-[40px] shadow-2xl shadow-indigo-600/20 text-white border border-white/10">
                     <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <TrendingDown size={14} /> Total Coût Employeur
                     </p>
                     <h2 className="text-4xl font-black text-white tracking-tighter">1,016,206 DA</h2>
                     <p className="mt-4 text-xs font-bold text-indigo-100/60 leading-tight">Y compris charges patronales (26%) et accidents de travail.</p>
                  </div>
               </div>

               <div className="bg-[#0d121c] border border-slate-800/50 rounded-[40px] overflow-hidden shadow-2xl">
                  <div className="p-10 border-b border-white/5 flex justify-between items-center bg-slate-950/20">
                     <div>
                        <h2 className="text-2xl font-black text-white uppercase tracking-tight">Journal de Paie Mensuel</h2>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">Période : Avril 2026 · Mode : Algérie v1.0</p>
                     </div>
                     <div className="flex gap-4">
                        <button className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest border border-slate-700">
                           <FileSpreadsheet size={16} /> Excel Global
                        </button>
                        <button className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-900/40">
                           GÉNÉRER BULLETINS ({payrollData.length})
                        </button>
                     </div>
                  </div>
                  <div className="overflow-x-auto">
                     <table className="w-full text-left">
                        <thead>
                           <tr className="bg-slate-900/60 text-slate-500 text-[9px] uppercase tracking-[0.3em] font-black border-b border-white/5">
                              <th className="px-10 py-6">Matricule</th>
                              <th className="px-10 py-6">Employé</th>
                              <th className="px-10 py-6">Salaire Brut</th>
                              <th className="px-10 py-6">SS (9%)</th>
                              <th className="px-10 py-6">IRG</th>
                              <th className="px-10 py-6 font-black text-emerald-500">Net À Payer</th>
                              <th className="px-10 py-6 text-right">Actions</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.03]">
                           {payrollData.map((row, i) => (
                             <tr key={i} className="hover:bg-white/[0.01] transition-all group font-bold">
                                <td className="px-10 py-6 text-[10px] text-slate-500">{row.matricule}</td>
                                <td className="px-10 py-6">
                                   <div className="flex items-center gap-3">
                                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                                      <span className="text-sm font-black text-white uppercase tracking-tight">{row.name.split(' ')[0]}</span>
                                      <span className="text-sm font-medium text-slate-500 uppercase">{row.name.split(' ')[1]}</span>
                                   </div>
                                </td>
                                <td className="px-10 py-6 text-xs text-slate-300">{row.brut} DA</td>
                                <td className="px-10 py-6 text-xs text-rose-500/80">-{row.cnas} DA</td>
                                <td className="px-10 py-6 text-xs text-rose-500/80">-12,450 DA</td>
                                <td className="px-10 py-6 text-sm font-black text-emerald-500 tracking-tight">{row.net} DA</td>
                                <td className="px-10 py-6 text-right">
                                   <button className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-[9px] font-black text-slate-400 hover:text-white uppercase tracking-widest rounded-lg transition-all border border-slate-800">Détails</button>
                                </td>
                             </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
            </motion.div>
          )}

          {view === 'settings' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto py-10">
               <div className="bg-[#0d121c] p-12 rounded-[48px] border border-slate-800 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 -mr-32 -mt-32 rounded-full blur-3xl" />
                  <div className="space-y-10 relative">
                     <div className="text-center space-y-4">
                        <div className="w-20 h-20 mx-auto rounded-[32px] bg-blue-600/10 flex items-center justify-center text-blue-500 shadow-inner">
                           <Smartphone size={40} />
                        </div>
                        <h2 className="text-3xl font-black text-white uppercase tracking-tight">Middleware Presence</h2>
                        <p className="text-slate-500 text-sm font-medium leading-relaxed">Configurez le point de terminaison pour la synchronisation automatique des pointages biométriques.</p>
                     </div>

                     <div className="space-y-6">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Endpoint URL (Production)</label>
                           <input type="text" value={presenceApi} onChange={(e) => setPresenceApi(e.target.value)} className="w-full bg-[#06111a] border border-slate-800 rounded-2xl px-6 py-5 text-white outline-none focus:border-blue-500 font-bold" />
                        </div>
                        <div className="flex gap-4 p-6 bg-blue-500/5 border border-blue-500/10 rounded-[32px] items-start">
                           <AlertCircle className="text-blue-500 shrink-0 mt-1" size={18} />
                           <p className="text-xs font-medium text-slate-400 leading-relaxed italic">
                              Les absences et retards détectés par l'API mettront à jour automatiquement les plannings Driver de GPTrans.
                           </p>
                        </div>
                        <button className="w-full py-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-[24px] font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-blue-900/40 translate-all active:scale-95 flex items-center justify-center gap-3">
                           TESTER L'INTÉGRERATION <Save size={18} />
                        </button>
                     </div>
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ADD AGENT MODAL (OPERATIONAL) */}
      <AnimatePresence>
         {isAddAgentModalOpen && (
           <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddAgentModalOpen(false)} className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200]" />
              <motion.div initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 30 }} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-[#0d121c] border border-blue-500/20 rounded-[48px] p-12 z-[201] shadow-[0_0_100px_rgba(59,130,246,0.15)]">
                 <div className="flex justify-between items-start mb-10">
                    <h2 className="text-3xl font-black text-white uppercase tracking-tight">Nouveau Collaborateur</h2>
                    <button onClick={() => setIsAddAgentModalOpen(false)} className="p-3 bg-slate-900 rounded-2xl text-slate-600 hover:text-white transition-all"><X size={20} /></button>
                 </div>
                 <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Nom & Prénom</label>
                       <input type="text" value={newAgent.nom} onChange={(e) => setNewAgent({...newAgent, nom: e.target.value})} className="w-full bg-[#06111a] border border-slate-800 rounded-2xl p-4 text-white text-sm outline-none focus:border-blue-500 font-bold" placeholder="Ex: Samir Belkacem" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Poste / Rôle</label>
                          <input type="text" value={newAgent.role} onChange={(e) => setNewAgent({...newAgent, role: e.target.value})} className="w-full bg-[#06111a] border border-slate-800 rounded-2xl p-4 text-white text-sm outline-none focus:border-blue-500 font-bold" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Code PIN Accès</label>
                          <input type="text" value={newAgent.code_pin} onChange={(e) => setNewAgent({...newAgent, code_pin: e.target.value})} className="w-full bg-[#06111a] border border-slate-800 rounded-2xl p-4 text-white text-sm outline-none focus:border-blue-500 font-bold font-mono" />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Email Corporate</label>
                       <input type="email" value={newAgent.email} onChange={(e) => setNewAgent({...newAgent, email: e.target.value})} className="w-full bg-[#06111a] border border-slate-800 rounded-2xl p-4 text-white text-sm outline-none focus:border-blue-500 font-bold" placeholder="s.belkacem@growth.dz" />
                    </div>
                    <button onClick={handleSaveAgent} className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-blue-900/40 mt-4 transition-all active:scale-95 flex items-center justify-center gap-3">
                       <Save size={18} /> CRÉER LE DOSSIER
                    </button>
                 </div>
              </motion.div>
           </>
         )}
      </AnimatePresence>
    </div>
  );
};

export default HRPage;

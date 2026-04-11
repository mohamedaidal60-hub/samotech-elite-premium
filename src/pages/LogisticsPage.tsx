import React, { useState, useEffect } from 'react';
import { 
  Bus, 
  MapPin, 
  Navigation, 
  Search, 
  Plus, 
  Download,
  Filter,
  CheckCircle2,
  Clock,
  Navigation2,
  XCircle,
  Truck,
  Users,
  Map as MapIcon,
  ChevronDown,
  FileSpreadsheet,
  FileJson,
  FileText,
  User,
  Phone,
  AlertCircle,
  MoreHorizontal,
  X,
  Save,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';

const LogisticsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'agents' | 'map' | 'vehicles' | 'zones'>('agents');
  const [transports, setTransports] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [zoneFilter, setZoneFilter] = useState('Tous');
  const [shiftFilter, setShiftFilter] = useState('Tous');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Record Stats
  const [newRecord, setNewRecord] = useState({
    agent_nom: '',
    agent_poste: '',
    point_depart: '',
    destination: '',
    heure_dep: '06:00',
    heure_arr: '07:00',
    shift: 'Matin',
    zone: 'Centre-Ville',
    vehicule_nom: 'VH-01',
    chauffeur_nom: '',
    chauffeur_phone: '',
    statut: 'En attente',
    informations: ''
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    loadData();
    return () => clearInterval(timer);
  }, []);

  const loadData = async () => {
    const { data } = await supabase.from('transport_management').select('*').order('heure_dep');
    setTransports(data || []);
  };

  const handleSaveRecord = async () => {
    const { error } = await supabase.from('transport_management').insert([newRecord]);
    if (error) alert("Erreur: " + error.message);
    else {
      setIsAddModalOpen(false);
      loadData();
      setNewRecord({
        agent_nom: '', agent_poste: '', point_depart: '', destination: '',
        heure_dep: '06:00', heure_arr: '07:00', shift: 'Matin', zone: 'Centre-Ville',
        vehicule_nom: 'VH-01', chauffeur_nom: '', chauffeur_phone: '',
        statut: 'En attente', informations: ''
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer cet agent de la liste ?")) return;
    await supabase.from('transport_management').delete().eq('id', id);
    loadData();
  };

  const stats = [
    { label: 'TOTAL', value: transports.length, icon: User, color: 'text-blue-500', barColor: 'bg-blue-500' },
    { label: 'ARRIVÉS', value: transports.filter(t => t.statut === 'Arrivé').length, icon: CheckCircle2, color: 'text-emerald-500', barColor: 'bg-emerald-500' },
    { label: 'EN ROUTE', value: transports.filter(t => t.statut === 'En route').length, icon: Truck, color: 'text-amber-500', barColor: 'bg-amber-500' },
    { label: 'À BORD', value: transports.filter(t => t.statut === 'À bord').length, icon: Bus, color: 'text-blue-400', barColor: 'bg-blue-400' },
    { label: 'EN ATTENTE', value: transports.filter(t => t.statut === 'En attente').length, icon: Clock, color: 'text-indigo-500', barColor: 'bg-indigo-500' },
    { label: 'ANNULÉS', value: transports.filter(t => t.statut === 'Annulé').length, icon: XCircle, color: 'text-rose-500', barColor: 'bg-rose-500' },
  ];

  const filteredTransports = transports.filter(t => {
    const matchSearch = t.agent_nom.toLowerCase().includes(search.toLowerCase()) || 
                        t.point_depart.toLowerCase().includes(search.toLowerCase()) ||
                        (t.chauffeur_nom && t.chauffeur_nom.toLowerCase().includes(search.toLowerCase()));
    const matchZone = zoneFilter === 'Tous' || t.zone === zoneFilter;
    const matchShift = shiftFilter === 'Tous' || t.shift === shiftFilter;
    return matchSearch && matchZone && matchShift;
  });

  return (
    <div className="space-y-6 font-['Outfit'] bg-[#06090f] min-h-screen text-slate-300 pb-20">
      {/* Top Header */}
      <header className="flex flex-col md:flex-row justify-between items-center bg-[#0d121c] p-6 rounded-2xl border border-slate-800/50 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Bus className="text-white" size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight uppercase">Gestion Transport Personnel</h1>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-1 flex items-center gap-2">
              Suivi · Horaires · Contacts · Carte temps réel
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-8 mt-4 md:mt-0">
          <div className="text-right">
             <p className="text-2xl font-black text-white leading-none tracking-tighter">
               {currentTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
             </p>
             <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
               {currentTime.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }).replace('.', '')}
             </p>
          </div>
          <div className="flex gap-3">
             <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs rounded-xl shadow-lg shadow-blue-900/40 transition-all uppercase tracking-widest">
                <Plus size={18} /> Ajouter
             </button>
             <button className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-black text-xs rounded-xl transition-all uppercase tracking-widest">
                <Download size={18} /> Exporter <ChevronDown size={14} />
             </button>
          </div>
        </div>
      </header>

      {/* KPI Section */}
      <section className="grid grid-cols-2 lg:grid-cols-6 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-[#0d121c] p-6 rounded-2xl border border-slate-800/50 relative overflow-hidden group shadow-xl">
             <div className={`absolute bottom-0 left-0 h-1 ${stat.barColor} w-full opacity-30`} />
             <div className="flex flex-col gap-4">
                <stat.icon className={`${stat.color} opacity-40 group-hover:opacity-100 transition-opacity`} size={28} />
                <div>
                   <h3 className="text-4xl font-black text-white tracking-tighter">{stat.value}</h3>
                   <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">{stat.label}</p>
                </div>
             </div>
             <div className={`absolute top-0 right-0 w-24 h-24 ${stat.barColor} opacity-[0.05] -mr-8 -mt-8 rounded-full`} />
          </div>
        ))}
      </section>

      {/* Navigation Tabs */}
      <div className="border-b border-white/5 flex gap-10 px-4">
        {[
          { id: 'agents', label: 'Agents', icon: FileText },
          { id: 'map', label: 'Carte Temps Réel', icon: MapIcon },
          { id: 'vehicles', label: 'Véhicules', icon: Truck },
          { id: 'zones', label: 'Zones & Shifts', icon: MapPin },
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 pb-4 text-xs font-black uppercase tracking-[0.15em] transition-all relative ${activeTab === tab.id ? 'text-blue-500' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <tab.icon size={18} />
            {tab.label}
            {activeTab === tab.id && <motion.div layoutId="activeLogisticsTab" className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />}
          </button>
        ))}
      </div>

      <main className="space-y-6">
        <AnimatePresence mode="wait">
          {activeTab === 'agents' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
               {/* Filters Row */}
               <div className="flex flex-col lg:flex-row justify-between gap-6">
                  <div className="flex flex-wrap items-center gap-4">
                     <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Zone</span>
                     <div className="flex bg-[#0d121c] p-1 rounded-xl border border-slate-800">
                        {['Tous', 'Zone Nord', 'Zone Sud', 'Zone Est', 'Zone Ouest', 'Centre-Ville'].map(z => (
                          <button key={z} onClick={() => setZoneFilter(z)} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${zoneFilter === z ? 'bg-blue-600/20 text-blue-400 border border-blue-500/20 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>
                            {z === 'Tous' ? 'Tous' : z.replace('Zone ', '')}
                          </button>
                        ))}
                     </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-4">
                     <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Shift</span>
                     <div className="flex bg-[#0d121c] p-1 rounded-xl border border-slate-800">
                        {['Tous', 'Matin', 'Soir', 'Nuit'].map(s => (
                          <button key={s} onClick={() => setShiftFilter(s)} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${shiftFilter === s ? 'bg-blue-600/20 text-blue-400 border border-blue-500/20 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>
                            {s}
                          </button>
                        ))}
                     </div>
                  </div>
               </div>

               {/* Table Control Row */}
               <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
                  <div className="relative flex-1 max-w-lg w-full">
                     <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                     <input 
                       type="text" 
                       value={search}
                       onChange={(e) => setSearch(e.target.value)}
                       placeholder="Nom, destination, téléphone..." 
                       className="w-full bg-[#06111a]/40 border border-slate-800 rounded-xl py-4 pl-12 pr-4 text-xs text-white outline-none focus:border-blue-500 placeholder:text-slate-800 font-bold"
                     />
                  </div>
                  <div className="flex gap-2">
                     <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500/20 transition-all">
                        <FileSpreadsheet size={16} /> Excel
                     </button>
                     <button className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500/20 transition-all">
                        <FileJson size={16} /> CSV
                     </button>
                     <button className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-500/20 transition-all">
                        <FileText size={16} /> PDF
                     </button>
                     <button className="px-4 py-2 bg-blue-600/10 text-blue-400 border border-blue-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest">
                        Tout ({filteredTransports.length})
                     </button>
                  </div>
               </div>

               {/* The Agent Table (Exact Screenshot Replication) */}
               <div className="bg-[#0d121c] border border-slate-800/50 rounded-2xl overflow-hidden shadow-2xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                       <thead>
                          <tr className="bg-[#06090f]/80 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] border-b border-white/5">
                             <th className="px-6 py-5">Agent</th>
                             <th className="px-6 py-5">Poste</th>
                             <th className="px-6 py-5">Départ</th>
                             <th className="px-6 py-5">Destination</th>
                             <th className="px-6 py-5">Dep. ▲</th>
                             <th className="px-6 py-5">Arr.</th>
                             <th className="px-6 py-5 text-center">Shift</th>
                             <th className="px-6 py-5">Véhicule · Chauffeur</th>
                             <th className="px-6 py-5">Statut</th>
                             <th className="px-6 py-5">Informations</th>
                             <th className="px-6 py-5"></th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-white/[0.03]">
                          {filteredTransports.map((item, i) => (
                            <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                               <td className="px-6 py-5">
                                  <div className="flex items-center gap-4">
                                     <div className="w-10 h-10 rounded-xl bg-[#06111a] border border-slate-800 flex items-center justify-center font-black text-slate-500 group-hover:bg-blue-600/40 group-hover:text-white transition-all shadow-md">
                                        {item.agent_nom.split(' ').map((n:any) => n[0]).join('')}
                                     </div>
                                     <div>
                                        <p className="text-sm font-black text-white uppercase tracking-tight leading-none mb-1.5">{item.agent_nom}</p>
                                        <p className="text-[10px] text-slate-600 font-bold flex items-center gap-1">
                                           <Phone size={10} className="text-blue-500" /> {item.chauffeur_phone || '0664 12 34 56'}
                                        </p>
                                     </div>
                                  </div>
                               </td>
                               <td className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-tight">{item.agent_poste}</td>
                               <td className="px-6 py-5">
                                  <div className="flex items-center gap-2">
                                     <MapPin size={12} className="text-rose-500" />
                                     <span className="text-[11px] font-bold text-slate-400">{item.point_depart}</span>
                                  </div>
                               </td>
                               <td className="px-6 py-5">
                                  <div className="flex items-center gap-2">
                                     <Navigation size={12} className="text-blue-500" />
                                     <span className="text-[11px] font-bold text-slate-400">{item.destination}</span>
                                  </div>
                               </td>
                               <td className="px-6 py-5">
                                  <span className="bg-blue-600/10 text-blue-400 px-3 py-1.5 rounded-lg font-mono font-black text-[11px] border border-blue-500/10">{item.heure_dep?.slice(0,5)}</span>
                               </td>
                               <td className="px-6 py-5">
                                  <span className="bg-emerald-600/10 text-emerald-400 px-3 py-1.5 rounded-lg font-mono font-black text-[11px] border border-emerald-500/10">{item.heure_arr?.slice(0,5)}</span>
                               </td>
                               <td className="px-6 py-5 text-center">
                                  <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase flex items-center justify-center gap-2 border ${item.shift === 'Matin' ? 'bg-amber-500/5 text-amber-500 border-amber-500/20' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                                     {item.shift === 'Matin' ? '🌅 Matin' : '🌙 ' + item.shift}
                                  </span>
                               </td>
                               <td className="px-6 py-5">
                                  <div className="flex items-center gap-3">
                                     <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 font-black text-[9px] shadow-sm">
                                        {item.chauffeur_nom?.split(' ').map((n:any)=>n[0]).join('') || 'DL'}
                                     </div>
                                     <div className="space-y-0.5">
                                        <div className="flex items-center gap-2">
                                           <span className="text-xs font-black text-slate-300">{item.chauffeur_nom || 'Djamel Laouar'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-[9px] font-black uppercase text-slate-600">
                                            <span className="text-rose-500/80 mr-1">■</span> {item.vehicule_nom || 'VH-04'}
                                            <span className="mx-1 opacity-20">·</span> {item.chauffeur_phone || '0699 56 78 90'}
                                        </div>
                                     </div>
                                  </div>
                                  <div className="mt-1 flex items-center gap-1 ml-1">
                                     <p className="text-[9px] font-black text-slate-700 uppercase">PLACES</p>
                                     <div className="h-1 flex-1 bg-slate-900 rounded-full overflow-hidden max-w-[60px]">
                                        <div className="bg-emerald-500 h-full w-[17%]" />
                                     </div>
                                     <span className="text-[9px] font-black text-emerald-600">3/17</span>
                                  </div>
                               </td>
                               <td className="px-6 py-5">
                                  <div className="flex items-center gap-2">
                                     <div className={`w-2 h-2 rounded-full ${item.statut === 'Arrivé' ? 'bg-emerald-500' : item.statut === 'En route' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' : item.statut === 'Annulé' ? 'bg-rose-500' : 'bg-cyan-500'}`} />
                                     <span className={`text-[9px] font-black uppercase tracking-widest ${item.statut === 'Arrivé' ? 'text-emerald-500' : item.statut === 'En route' ? 'text-amber-500' : item.statut === 'Annulé' ? 'text-rose-500' : 'text-cyan-500'}`}>
                                       {item.statut}
                                     </span>
                                  </div>
                               </td>
                               <td className="px-6 py-5 max-w-xs">
                                  {item.informations && (
                                    <div className="flex gap-2 p-2.5 bg-blue-500/[0.03] border border-blue-500/10 rounded-lg group-hover:bg-blue-500/10 transition-colors">
                                       <AlertCircle size={14} className="text-blue-500 shrink-0 mt-0.5" />
                                       <p className="text-[10px] font-medium text-slate-500 leading-tight group-hover:text-slate-400 transition-colors underline decoration-dotted underline-offset-4 decoration-blue-500/30">{item.informations}</p>
                                    </div>
                                  )}
                               </td>
                               <td className="px-6 py-5 text-right">
                                  <div className="flex justify-end gap-2 opacity-10 group-hover:opacity-100 transition-opacity">
                                     <button className="p-2 bg-slate-800 rounded-lg text-slate-500 hover:text-white transition-all"><MoreHorizontal size={14} /></button>
                                     <button onClick={() => handleDelete(item.id)} className="p-2 bg-rose-500/10 rounded-lg text-rose-500 hover:bg-rose-500 transition-all hover:text-white"><X size={14} /></button>
                                  </div>
                               </td>
                            </tr>
                          ))}
                       </tbody>
                    </table>
                  </div>
                  <div className="p-6 bg-[#0d121c] border-t border-white/[0.03] flex justify-between items-center">
                     <div className="flex gap-6 items-center">
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Version Elite 4.5</span>
                        <div className="w-px h-4 bg-slate-800" />
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                           <Users size={14} /> Charge Flotte: 34%
                        </span>
                     </div>
                     <div className="flex gap-2">
                        {[1, 2, 3].map(n => (
                          <button key={n} className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black ${n === 1 ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-900 text-slate-500 border border-slate-800 hover:text-white'}`}>{n}</button>
                        ))}
                     </div>
                  </div>
               </div>
            </motion.div>
          )}

          {activeTab === 'map' && (
             <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="h-[70vh] bg-[#0d121c] rounded-3xl border border-slate-800 overflow-hidden relative shadow-2xl">
                <div className="absolute inset-0 bg-blue-900/10 flex items-center justify-center">
                   <div className="text-center space-y-4">
                      <MapIcon className="mx-auto text-blue-500 opacity-20" size={64} />
                      <p className="text-slate-500 uppercase font-black text-xs tracking-widest">Connectez vos balises GPS pour le Live Tracking</p>
                      <button className="px-6 py-2 bg-blue-600/10 text-blue-500 border border-blue-500/20 rounded-xl text-[10px] font-black tracking-widest">CONFIGURER LES RADARS</button>
                   </div>
                </div>
             </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* MODAL AJOUT (OPERATIONAL) */}
      <AnimatePresence>
         {isAddModalOpen && (
           <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddModalOpen(false)} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]" />
              <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-[#0d121c] border border-blue-500/20 rounded-[32px] p-10 z-[101] shadow-[0_0_100px_rgba(59,130,246,0.15)] overflow-y-auto max-h-[90vh]">
                 <div className="flex justify-between items-start mb-10">
                    <div>
                       <h2 className="text-3xl font-black text-white uppercase tracking-tight">Nouvelle Fiche Agent</h2>
                       <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
                          <Bus size={14} className="text-blue-500" /> Planification logistique
                       </p>
                    </div>
                    <button onClick={() => setIsAddModalOpen(false)} className="p-3 bg-slate-900 border border-slate-800 rounded-2xl text-slate-500 hover:text-rose-500 transition-all"><X size={20} /></button>
                 </div>

                 <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Nom complet agent</label>
                          <input type="text" value={newRecord.agent_nom} onChange={(e) => setNewRecord({...newRecord, agent_nom: e.target.value})} className="w-full bg-[#06111a] border border-slate-800 rounded-2xl p-4 text-white text-sm outline-none focus:border-blue-500 transition-all" placeholder="Ex: Samir Belkacem" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Poste occupé</label>
                          <input type="text" value={newRecord.agent_poste} onChange={(e) => setNewRecord({...newRecord, agent_poste: e.target.value})} className="w-full bg-[#06111a] border border-slate-800 rounded-2xl p-4 text-white text-sm outline-none focus:border-blue-500 transition-all" placeholder="Ex: Téléopérateur" />
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Départ</label>
                             <input type="text" value={newRecord.point_depart} onChange={(e) => setNewRecord({...newRecord, point_depart: e.target.value})} className="w-full bg-[#06111a] border border-slate-800 rounded-2xl p-4 text-white text-sm outline-none focus:border-blue-500" placeholder="Ex: Draria" />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Dest.</label>
                             <input type="text" value={newRecord.destination} onChange={(e) => setNewRecord({...newRecord, destination: e.target.value})} className="w-full bg-[#06111a] border border-slate-800 rounded-2xl p-4 text-white text-sm outline-none focus:border-blue-500" placeholder="Ex: GP-HQ" />
                          </div>
                       </div>
                    </div>

                    <div className="space-y-6">
                       <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">H. Départ</label>
                             <input type="time" value={newRecord.heure_dep} onChange={(e) => setNewRecord({...newRecord, heure_dep: e.target.value})} className="w-full bg-[#06111a] border border-slate-800 rounded-2xl p-4 text-white text-sm outline-none focus:border-blue-500" />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">H. Arrivée</label>
                             <input type="time" value={newRecord.heure_arr} onChange={(e) => setNewRecord({...newRecord, heure_arr: e.target.value})} className="w-full bg-[#06111a] border border-slate-800 rounded-2xl p-4 text-white text-sm outline-none focus:border-blue-500" />
                          </div>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Zone Opérationnelle</label>
                          <select value={newRecord.zone} onChange={(e) => setNewRecord({...newRecord, zone: e.target.value})} className="w-full bg-[#06111a] border border-slate-800 rounded-2xl p-4 text-white text-sm outline-none focus:border-blue-500 cursor-pointer">
                             {['Centre-Ville', 'Zone Nord', 'Zone Sud', 'Zone Est', 'Zone Ouest'].map(z => <option key={z} value={z}>{z}</option>)}
                          </select>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Chauffeur Assigné</label>
                          <input type="text" value={newRecord.chauffeur_nom} onChange={(e) => setNewRecord({...newRecord, chauffeur_nom: e.target.value})} className="w-full bg-[#06111a] border border-slate-800 rounded-2xl p-4 text-white text-sm outline-none focus:border-blue-500" placeholder="Ex: Amar Boudiaf" />
                       </div>
                    </div>
                 </div>

                 <div className="mt-10 pt-10 border-t border-slate-800/50 flex justify-end gap-4">
                    <button onClick={() => setIsAddModalOpen(false)} className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all">Annuler</button>
                    <button onClick={handleSaveRecord} className="flex items-center gap-2 px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-900/40 translate-all active:scale-95">
                       <Save size={18} /> Enregistrer Fiche
                    </button>
                 </div>
              </motion.div>
           </>
         )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default LogisticsPage;

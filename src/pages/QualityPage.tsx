import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Search, 
  CheckCircle, 
  XCircle, 
  Play, 
  FileText, 
  Filter,
  Activity,
  User,
  Clock,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';

const QualityPage: React.FC = () => {
  const [calls, setCalls] = useState<any[]>([]);
  const [selectedCall, setSelectedCall] = useState<any>(null);
  const [filter, setFilter] = useState('pending');

  useEffect(() => {
    const loadCalls = async () => {
      let query = supabase.from('calls').select('*, agents(nom)').order('created_at', { ascending: false });
      if (filter !== 'all') {
        query = query.eq('quality_status', filter);
      }
      const { data } = await query;
      setCalls(data || []);
    };
    loadCalls();
  }, [filter]);

  const handleAudit = async (status: 'validated' | 'rejected') => {
    if (!selectedCall) return;
    const { error } = await supabase.from('calls').update({ quality_status: status }).eq('id', selectedCall.id);
    if (error) alert(error.message);
    else {
      alert(`Appel ${status === 'validated' ? 'vaildé' : 'rejeté'} avec succès.`);
      setCalls(calls.map(c => c.id === selectedCall.id ? { ...c, quality_status: status } : c));
      setSelectedCall(null);
    }
  };

  return (
    <div className="space-y-8 font-['Outfit']">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-slate-800/50">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <ShieldCheck className="text-blue-500" />
            Audit Qualité & Validation
          </h1>
          <p className="text-slate-400 text-sm mt-1 font-medium">Évaluation des enregistrements, conformité et validation des ventes.</p>
        </div>
        
        <div className="flex bg-slate-900/50 p-1 rounded-2xl border border-slate-800 shadow-xl">
          {[
            { id: 'pending', label: 'En attente', count: calls.filter(c => c.quality_status === 'pending').length },
            { id: 'validated', label: 'Validés', count: calls.filter(c => c.quality_status === 'validated').length },
            { id: 'all', label: 'Tout l\'historique', count: null }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all font-bold text-[10px] uppercase tracking-widest ${filter === tab.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:text-white'}`}
            >
              {tab.label}
              {tab.count !== null && <span className="ml-2 text-[10px] bg-slate-800/50 px-1.5 py-0.5 rounded font-bold">{tab.count}</span>}
            </button>
          ))}
        </div>
      </header>

      <main className="grid grid-cols-1 xl:grid-cols-4 gap-8 h-[calc(100vh-280px)]">
        {/* Calls List */}
        <section className="xl:col-span-1 glass-card border-slate-800 flex flex-col overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-slate-800 bg-slate-950/40">
            <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800 shadow-inner">
               <Search size={14} className="text-slate-600 ml-1" />
               <input type="text" placeholder="RECHERCHER AGENT/CLIENT..." className="bg-transparent text-[10px] text-white outline-none w-full font-black uppercase tracking-widest" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/50 custom-scrollbar">
            {calls.length > 0 ? calls.map((call) => (
              <div 
                key={call.id} 
                onClick={() => setSelectedCall(call)}
                className={`p-5 hover:bg-slate-800/30 transition-all cursor-pointer group ${selectedCall?.id === call.id ? 'bg-blue-600/10 border-l-4 border-blue-500' : ''}`}
              >
                <div className="flex justify-between items-start mb-1">
                   <p className="text-sm font-black text-white group-hover:text-blue-400 transition-colors truncate uppercase tracking-tight">{call.agents?.nom}</p>
                   <span className="text-[10px] text-slate-600 font-bold">{new Date(call.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{call.customer_phone}</p>
                <div className="flex items-center gap-2 mt-4">
                   {call.is_sale && <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded text-[9px] font-black uppercase tracking-widest border border-emerald-500/20">VENTE</span>}
                   <span className="px-2 py-0.5 bg-slate-800/50 text-slate-500 rounded text-[9px] font-black uppercase tracking-widest border border-slate-800">{call.classification}</span>
                </div>
              </div>
            )) : (
              <div className="p-20 text-center text-slate-800 italic font-black uppercase tracking-widest text-xs">Aucun appel à auditer</div>
            )}
          </div>
        </section>

        {/* Audit Panel */}
        <section className="xl:col-span-3">
          <AnimatePresence mode="wait">
            {selectedCall ? (
              <motion.div 
                key={selectedCall.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full flex flex-col gap-6"
              >
                <div className="glass-card p-10 border-slate-800 flex-1 flex flex-col relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 right-0 p-8">
                     <div className="flex flex-col items-end gap-1">
                        <p className="text-[10px] text-slate-600 uppercase font-black tracking-[0.2em] leading-none">ID Dossier</p>
                        <p className="text-xs text-slate-500 font-mono font-bold uppercase">APP-{selectedCall.id.substring(0,8).toUpperCase()}</p>
                     </div>
                  </div>

                  <div className="space-y-12 flex-1">
                    <div className="flex items-center gap-8">
                       <div className="w-20 h-20 rounded-[32px] bg-blue-600/10 flex items-center justify-center text-blue-500 border border-blue-500/20 shadow-lg shadow-blue-500/10">
                          <User size={40} />
                       </div>
                       <div>
                          <h2 className="text-3xl font-black text-white uppercase tracking-tight">{selectedCall.agents?.nom}</h2>
                          <div className="flex items-center gap-4 mt-2">
                             <span className="text-blue-400 text-sm font-black font-mono tracking-tight">{selectedCall.customer_phone}</span>
                             <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                             <span className="text-slate-600 text-[10px] font-black uppercase tracking-[0.2em]">{new Date(selectedCall.created_at).toLocaleString()}</span>
                          </div>
                       </div>
                    </div>

                    <div className="space-y-4">
                       <div className="flex items-center gap-3 text-slate-600 uppercase text-[10px] font-black tracking-[0.3em] ml-2">
                          <FileText size={16} /> Transcription Intégrale (Audit IA)
                       </div>
                       <div className="glass-card bg-[#06090f]/60 p-10 border-slate-800 leading-[2.2em] text-slate-300 font-medium italic relative group text-lg shadow-inner">
                          {selectedCall.transcription}
                          <div className="absolute top-6 right-8 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button className="w-12 h-12 bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-600/30 flex items-center justify-center active:scale-90 transition-all">
                                <Play size={24} fill="white" />
                             </button>
                          </div>
                          <div className="absolute bottom-6 right-8 text-[9px] font-black text-slate-700 bg-slate-900 border border-slate-800 px-3 py-1 rounded-full uppercase tracking-widest">Sentiment: Positif</div>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                       <div className="glass-card p-6 border-slate-800 flex items-center gap-5 bg-blue-600/[0.03] border-l-[6px] border-l-blue-600 shadow-lg">
                          <Activity className="text-blue-500" size={24} />
                          <div>
                            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Confiance IA</p>
                            <p className="text-lg font-black text-white uppercase tracking-tight">94% — Conforme</p>
                          </div>
                       </div>
                       <div className="glass-card p-6 border-slate-800 flex items-center gap-5 bg-slate-900/40 shadow-lg">
                          <Clock className="text-slate-500" size={24} />
                          <div>
                            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Durée Totale</p>
                            <p className="text-lg font-black text-white uppercase tracking-tight">04:22 MIN</p>
                          </div>
                       </div>
                       <div className="glass-card p-6 border-slate-800 flex items-center gap-5 bg-slate-900/40 shadow-lg">
                          <MessageSquare className="text-slate-500" size={24} />
                          <div>
                            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Analyise Voix</p>
                            <p className="text-lg font-black text-white uppercase tracking-tight">Pitch Stable</p>
                          </div>
                       </div>
                    </div>
                  </div>

                  <div className="mt-12 pt-10 border-t border-slate-800/50 flex justify-between items-center">
                    <div className="flex items-center gap-4 text-slate-600 font-black text-xs uppercase tracking-widest">
                       <AlertCircle size={20} className="text-amber-500" /> 
                       Rapport requis avant archivage.
                    </div>
                    <div className="flex gap-4">
                       <button onClick={() => handleAudit('rejected')} className="px-8 py-4 rounded-2xl border-2 border-rose-500/30 text-rose-500 flex items-center gap-3 font-black text-xs uppercase tracking-[0.2em] hover:bg-rose-500/10 transition-all active:scale-95">
                          <XCircle size={18} />
                          Rejeter
                       </button>
                       <button onClick={() => handleAudit('validated')} className="px-10 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex items-center gap-3 font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-emerald-900/20 hover:scale-105 transition-all active:scale-95">
                          <CheckCircle size={18} />
                          Valider Vente
                       </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-center p-20 glass-card border-slate-800 border-dashed bg-slate-950/20"
              >
                <div className="w-28 h-28 rounded-[40px] bg-slate-900 border-2 border-slate-800 flex items-center justify-center text-slate-800 mb-8 shadow-2xl">
                   <ShieldCheck size={56} />
                </div>
                <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter">Prêt pour l'Audit Qualité</h3>
                <p className="text-slate-500 max-w-sm font-medium text-sm leading-relaxed italic">Sélectionnez une session d'appel pour analyser la transcription et valider la conformité des échanges commerciaux.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>
    </div>
  );
};

export default QualityPage;

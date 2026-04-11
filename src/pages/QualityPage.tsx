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
      let query = supabase.from('calls').select('*, profiles(full_name)').order('created_at', { ascending: false });
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
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-slate-800/50">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <ShieldCheck className="text-blue-500" />
            Audit Qualité & Validation
          </h1>
          <p className="text-slate-400 text-sm mt-1">Évaluation des enregistrements, conformité et validation des ventes.</p>
        </div>
        
        <div className="flex bg-slate-900/50 p-1 rounded-2xl border border-slate-800">
          {[
            { id: 'pending', label: 'En attente', count: calls.filter(c => c.quality_status === 'pending').length },
            { id: 'validated', label: 'Validés', count: calls.filter(c => c.quality_status === 'validated').length },
            { id: 'all', label: 'Tout l\'historique', count: null }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all font-bold text-xs uppercase tracking-widest ${filter === tab.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white'}`}
            >
              {tab.label}
              {tab.count !== null && <span className="ml-2 text-[10px] bg-slate-800/50 px-1.5 py-0.5 rounded font-bold">{tab.count}</span>}
            </button>
          ))}
        </div>
      </header>

      <main className="grid grid-cols-1 xl:grid-cols-4 gap-8 h-[calc(100vh-280px)]">
        {/* Calls List */}
        <section className="xl:col-span-1 glass-card border-slate-800 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-800 bg-slate-900/40">
            <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
               <Search size={14} className="text-slate-600 ml-1" />
               <input type="text" placeholder="Rechercher agent/client..." className="bg-transparent text-xs text-white outline-none w-full" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/50 custom-scrollbar">
            {calls.length > 0 ? calls.map((call) => (
              <div 
                key={call.id} 
                onClick={() => setSelectedCall(call)}
                className={`p-4 hover:bg-slate-800/30 transition-all cursor-pointer group ${selectedCall?.id === call.id ? 'bg-blue-600/10 border-l-4 border-blue-500' : ''}`}
              >
                <div className="flex justify-between items-start mb-1">
                   <p className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors truncate">{call.profiles?.full_name}</p>
                   <span className="text-[10px] text-slate-500">{new Date(call.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{call.customer_phone}</p>
                <div className="flex items-center gap-2 mt-3">
                   {call.is_sale && <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-500 rounded text-[9px] font-extrabold tracking-widest">VENTE</span>}
                   <span className="px-1.5 py-0.5 bg-slate-800 text-slate-500 rounded text-[9px] font-bold uppercase">{call.classification}</span>
                </div>
              </div>
            )) : (
              <div className="p-10 text-center text-slate-700 italic font-bold">Aucun appel à auditer</div>
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
                <div className="glass-card p-10 border-slate-800 flex-1 flex flex-col relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8">
                     <div className="flex flex-col items-end gap-1">
                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest leading-none">ID Dossier</p>
                        <p className="text-xs text-slate-400 font-mono">APP-{selectedCall.id.substring(0,8).toUpperCase()}</p>
                     </div>
                  </div>

                  <div className="space-y-10 flex-1">
                    <div className="flex items-center gap-6">
                       <div className="w-16 h-16 rounded-3xl bg-blue-600/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
                          <User size={32} />
                       </div>
                       <div>
                          <h2 className="text-2xl font-extrabold text-white">{selectedCall.profiles?.full_name}</h2>
                          <div className="flex items-center gap-3 mt-1">
                             <span className="text-blue-400 text-xs font-bold font-mono">{selectedCall.customer_phone}</span>
                             <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                             <span className="text-slate-500 text-xs font-medium uppercase">{new Date(selectedCall.created_at).toLocaleString()}</span>
                          </div>
                       </div>
                    </div>

                    <div className="space-y-4">
                       <div className="flex items-center gap-2 text-slate-500 uppercase text-[10px] font-extrabold tracking-widest">
                          <FileText size={14} /> Transcription de l'Appel (Audit IA)
                       </div>
                       <div className="glass-card bg-slate-950/40 p-10 border-slate-800 leading-[2em] text-slate-300 font-medium italic relative group">
                          {selectedCall.transcription}
                          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button className="p-2 bg-blue-500 text-white rounded-lg shadow-lg">
                                <Play size={16} fill="white" />
                             </button>
                          </div>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                       <div className="glass-card p-4 border-slate-800 flex items-center gap-3 bg-blue-600/5">
                          <Activity className="text-blue-500" size={18} />
                          <div>
                            <p className="text-[10px] text-slate-500 uppercase font-bold">Confiance IA</p>
                            <p className="text-sm font-extrabold text-white">94% — Conforme</p>
                          </div>
                       </div>
                       <div className="glass-card p-4 border-slate-800 flex items-center gap-3">
                          <Clock className="text-slate-500" size={18} />
                          <div>
                            <p className="text-[10px] text-slate-500 uppercase font-bold">Durée</p>
                            <p className="text-sm font-extrabold text-white">04:22 min</p>
                          </div>
                       </div>
                       <div className="glass-card p-4 border-slate-800 flex items-center gap-3">
                          <MessageSquare className="text-slate-500" size={18} />
                          <div>
                            <p className="text-[10px] text-slate-500 uppercase font-bold">Ambiance</p>
                            <p className="text-sm font-extrabold text-white">Positive / Vente Calme</p>
                          </div>
                       </div>
                    </div>
                  </div>

                  <div className="mt-10 pt-10 border-t border-slate-800/50 flex justify-between items-center">
                    <div className="flex items-center gap-4 text-slate-500 font-bold text-xs">
                       <AlertCircle size={16} /> Rapport d'audit requis avant archivage final.
                    </div>
                    <div className="flex gap-4">
                       <button onClick={() => handleAudit('rejected')} className="px-6 py-3 rounded-xl border border-rose-500/40 text-rose-500 flex items-center gap-2 font-bold text-sm uppercase hover:bg-rose-500/10 transition-all">
                          <XCircle size={18} />
                          Rejeter l'Appel
                       </button>
                       <button onClick={() => handleAudit('validated')} className="px-8 py-3 rounded-xl bg-emerald-600 text-white flex items-center gap-2 font-bold text-sm uppercase shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all">
                          <CheckCircle size={18} />
                          Valider la Vente
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
                className="h-full flex flex-col items-center justify-center text-center p-10 glass-card border-slate-800 border-dashed"
              >
                <div className="w-24 h-24 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-700 mb-6">
                   <ShieldCheck size={48} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Sélectionnez un appel pour audit</h3>
                <p className="text-slate-500 max-w-sm">Consultez les transcriptions générées par l'IA et validez la conformité des échanges avec les clients.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>
    </div>
  );
};

export default QualityPage;

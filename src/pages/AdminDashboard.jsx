import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Building2, Download, Trash2, ShieldCheck, LogOut, Search, Filter, Calendar } from 'lucide-react';
import sql from '../lib/db';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessType, setAccessType] = useState(null); // 'partners' or 'candidates'
  const [password, setPassword] = useState('');
  const [partners, setPartners] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const PASSWORDS = {
    partners: 'PARTNER2026',
    candidates: 'CANDIDATE2026'
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, accessType]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (accessType === 'partners') {
        const data = await sql`SELECT * FROM partners ORDER BY created_at DESC`;
        setPartners(data);
      } else if (accessType === 'candidates') {
        const data = await sql`SELECT * FROM candidates ORDER BY created_at DESC`;
        setCandidates(data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === PASSWORDS.partners) {
      setAccessType('partners');
      setIsAuthenticated(true);
    } else if (password === PASSWORDS.candidates) {
      setAccessType('candidates');
      setIsAuthenticated(true);
    } else {
      alert("Mot de passe incorrect");
    }
  };

  const deleteItem = async (id) => {
    if (!window.confirm("Supprimer définitivement cet élément ?")) return;
    try {
      if (accessType === 'partners') {
        await sql`DELETE FROM partners WHERE id = ${id}`;
        setPartners(partners.filter(p => p.id !== id));
      } else {
        await sql`DELETE FROM candidates WHERE id = ${id}`;
        setCandidates(candidates.filter(c => c.id !== id));
      }
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4 font-['Outfit']">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-[#111] p-10 rounded-[40px] border border-white/5 w-full max-w-md shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-emerald-600 to-blue-600"></div>
          
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-blue-600/10 rounded-3xl flex items-center justify-center mx-auto border border-blue-500/20">
              <ShieldCheck className="text-blue-500" size={40} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-widest">Zone Restreinte</h2>
              <p className="text-slate-500 text-sm mt-2">Veuillez entrer votre code d'accès pour continuer.</p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <input 
                type="password" 
                placeholder="PASSWORD" 
                className="w-full bg-black/50 border border-white/10 rounded-2xl py-4 px-6 text-center text-white tracking-[0.5em] font-black outline-none focus:border-blue-500 transition-all"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl tracking-[0.2em] text-xs transition-all shadow-lg shadow-blue-900/40">
                DÉVERROUILLER L'ACCÈS
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-['Outfit']">
      {/* Top Navbar */}
      <nav className="border-b border-white/5 bg-black/40 backdrop-blur-xl fixed top-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-2 rounded-xl">
              {accessType === 'partners' ? <Building2 size={24} /> : <Users size={24} />}
            </div>
            <div>
              <h1 className="font-black text-lg tracking-tight uppercase">
                GP Admin • {accessType === 'partners' ? 'Partenariats' : 'Recrutement'}
              </h1>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Session Sécurisée</span>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="flex items-center gap-2 bg-white/5 hover:bg-red-500/10 hover:text-red-500 px-4 py-2 rounded-xl transition-all border border-white/5 text-xs font-bold"
          >
            <LogOut size={16} /> DÉCONNEXION
          </button>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        {/* Statistics or Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-[#111] p-6 rounded-3xl border border-white/5">
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Total {accessType}</p>
             <h3 className="text-4xl font-black text-blue-500 tracking-tighter">{accessType === 'partners' ? partners.length : candidates.length}</h3>
          </div>
          <div className="md:col-span-2 bg-[#111] p-6 rounded-3xl border border-white/5 flex items-center">
             <div className="relative w-full">
               <Search className="absolute left-4 top-3.5 text-slate-600" size={20} />
               <input 
                 type="text" 
                 placeholder="RECHERCHER DANS LA BASE..." 
                 className="w-full bg-black/50 border border-white/5 rounded-2xl py-3.5 pl-12 pr-6 outline-none focus:border-blue-500/50 text-xs font-black tracking-widest"
                 onChange={e => setSearchTerm(e.target.value)}
                />
             </div>
          </div>
        </div>

        <div className="bg-[#0c0c0c] rounded-[40px] border border-white/5 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                  {accessType === 'partners' ? (
                    <>
                      <th className="px-8 py-6">Entité / Société</th>
                      <th className="px-8 py-6">Contact Key</th>
                      <th className="px-8 py-6">Services / Langues</th>
                      <th className="px-8 py-6 text-center">Volume</th>
                      <th className="px-8 py-6 text-right">Actions</th>
                    </>
                  ) : (
                    <>
                      <th className="px-8 py-6">Portrait</th>
                      <th className="px-8 py-6">Candidat</th>
                      <th className="px-8 py-6">Évaluation / Score</th>
                      <th className="px-8 py-6">Date Postulation</th>
                      <th className="px-8 py-6 text-right">Actions</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {accessType === 'partners' ? (
                  partners.filter(p => JSON.stringify(p).toLowerCase().includes(searchTerm.toLowerCase())).map(p => (
                    <tr key={p.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-8 py-8">
                        <div className="font-black text-white text-lg tracking-tight uppercase">{p.entite}</div>
                        <div className="text-[10px] text-blue-500 font-bold uppercase tracking-widest mt-1">N° REF: {p.id}</div>
                      </td>
                      <td className="px-8 py-8">
                        <div className="text-sm font-bold text-slate-200">{p.prenom} {p.nom}</div>
                        <div className="text-xs text-slate-500 mt-1">{p.mail}</div>
                        <div className="text-xs text-slate-600 font-medium">{p.telephone}</div>
                      </td>
                      <td className="px-8 py-8">
                        <div className="flex flex-wrap gap-2">
                          {p.services.map(s => <span key={s} className="bg-blue-600/10 text-blue-400 text-[9px] px-2 py-1 rounded-md font-black uppercase">{s}</span>)}
                          {p.langues.map(l => <span key={l} className="bg-slate-800 text-slate-400 text-[9px] px-2 py-1 rounded-md font-black uppercase">{l}</span>)}
                        </div>
                      </td>
                      <td className="px-8 py-8 text-center">
                        <div className="text-xl font-black text-white">{p.positions}</div>
                        <div className="text-[9px] text-slate-600 font-bold uppercase tracking-tighter">Positions</div>
                      </td>
                      <td className="px-8 py-8 text-right">
                        <button onClick={() => deleteItem(p.id)} className="p-3 text-slate-700 hover:text-red-500 transition-colors">
                          <Trash2 size={20} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  candidates.filter(c => JSON.stringify(c).toLowerCase().includes(searchTerm.toLowerCase())).map(c => (
                    <tr key={c.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-8 py-8">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white/10 shadow-xl group-hover:scale-105 transition-transform">
                          <img src={c.selfie || 'https://via.placeholder.com/150'} alt="Selfie" className="w-full h-full object-cover" />
                        </div>
                      </td>
                      <td className="px-8 py-8">
                        <div className="font-black text-white text-lg tracking-tight uppercase">{c.prenom} {c.nom}</div>
                        <div className="text-xs text-slate-500 mt-1">{c.mail}</div>
                        <div className="flex items-center gap-2 mt-2">
                           {c.langues.map(l => <span key={l} className="text-[9px] text-slate-500 font-bold uppercase">{l}</span>)}
                        </div>
                      </td>
                      <td className="px-8 py-8">
                        <div className="flex items-center gap-4">
                           <div className={`text-2xl font-black ${c.test_score >= 80 ? 'text-emerald-500' : 'text-rose-500'}`}>{c.test_score}%</div>
                           <div className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg ${c.test_score >= 80 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                             {c.test_score >= 80 ? 'Elite' : 'Refusé'}
                           </div>
                        </div>
                      </td>
                      <td className="px-8 py-8">
                        <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
                          <Calendar size={14} />
                          {new Date(c.created_at).toLocaleDateString('fr-FR')}
                        </div>
                      </td>
                      <td className="px-8 py-8 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            className="bg-blue-600 hover:bg-blue-500 p-3 rounded-xl transition-all shadow-lg shadow-blue-900/40"
                            onClick={() => alert(`Transcription IA: ${c.ai_transcription || 'Non disponible'}`)}
                          >
                            <Download size={20} />
                          </button>
                          <button onClick={() => deleteItem(c.id)} className="p-3 text-slate-700 hover:text-red-500 transition-colors">
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            
            {((accessType === 'partners' ? partners.length : candidates.length)) === 0 && !loading && (
              <div className="p-20 text-center space-y-4">
                <Search className="mx-auto text-slate-800" size={48} />
                <p className="text-slate-600 font-black uppercase tracking-widest text-xs">Aucune donnée trouvée</p>
              </div>
            )}
            
            {loading && (
              <div className="p-20 text-center">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="mt-4 text-slate-500 font-bold uppercase tracking-widest text-[10px]">Chargement des données chiffrées...</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

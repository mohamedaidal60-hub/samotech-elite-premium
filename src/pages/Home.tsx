import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  TrendingUp, 
  PhoneCall, 
  Truck, 
  ShieldCheck, 
  Activity,
  ArrowUpRight,
  Clock,
  Briefcase
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const stats = [
    { label: 'Effectif Total', value: '142', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10', path: '/admin' },
    { label: 'Production / Jour', value: '2.8k', icon: PhoneCall, color: 'text-emerald-500', bg: 'bg-emerald-500/10', path: '/production' },
    { label: 'Taux Qualité', value: '96.4%', icon: ShieldCheck, color: 'text-purple-500', bg: 'bg-purple-500/10', path: '/quality' },
    { label: 'Flotte Active', value: '18', icon: Truck, color: 'text-amber-500', bg: 'bg-amber-500/10', path: '/logistics' },
  ];

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-10"
    >
      {/* Welcome Section */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-slate-800/50">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">
            Bonjour, <span className="premium-gradient-text">{user?.name}</span>
          </h1>
          <p className="text-slate-400 mt-2 flex items-center gap-2">
            <Activity size={16} className="text-blue-500" />
            Voici l'état actuel de SamoTech Partners Call Centers.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="glass-card px-4 py-2 flex items-center gap-2 border-slate-800">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Système Opérationnel</span>
          </div>
        </div>
      </section>

      {/* KPI Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div 
            key={idx}
            variants={item}
            onClick={() => navigate(stat.path)}
            className="glass-card p-6 border-slate-800/50 hover:border-slate-700 transition-all group group-stat"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} transition-transform group-hover:scale-110`}>
                <stat.icon size={24} />
              </div>
              <span className="text-slate-500 hover:text-white cursor-pointer transition-colors">
                <ArrowUpRight size={18} />
              </span>
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-3xl font-bold mt-1 text-white">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Feed */}
        <section className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Activity className="text-blue-500" size={20} />
              Activités de Production
            </h2>
            <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">Voir tout</button>
          </div>
          
          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <motion.div 
                key={i}
                variants={item}
                className="glass-card p-5 border-slate-800/30 flex items-center gap-4 hover:bg-slate-800/20 transition-all"
              >
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                  <PhoneCall size={20} className="text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">Vente Enregistrée — Campagne Telecom</p>
                  <p className="text-xs text-slate-500 mt-1">Par Agent: Sarah L. • ID Appel: #8291</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-1 rounded-full font-bold uppercase">En Vérification</span>
                  <p className="text-[10px] text-slate-600 mt-2">Il y a 2 min</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Info Cards */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Clock className="text-cyan-500" size={20} />
            Pointage Aujourd'hui
          </h2>
          <div className="glass-card p-6 border-slate-800/50 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-2xl font-bold text-white">92%</p>
                <p className="text-xs text-slate-500 uppercase font-semibold">Présence</p>
              </div>
              <div className="w-12 h-12 rounded-full border-4 border-slate-800 border-t-cyan-500 flex items-center justify-center">
                <Users size={18} className="text-cyan-500" />
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Présents</span>
                <span className="text-white font-bold">131</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-cyan-500 h-full w-[92%] rounded-full shadow-[0_0_10px_rgba(6,182,212,0.4)]" />
              </div>
              <div className="flex justify-between text-xs pt-1">
                <span className="text-slate-400">Retards</span>
                <span className="text-amber-500 font-bold">8</span>
              </div>
            </div>

            <button 
              onClick={() => navigate('/hr')}
              className="w-full py-3 bg-slate-800/50 hover:bg-slate-800 rounded-xl text-sm font-bold text-white transition-all border border-slate-700/50"
            >
              Accéder au module Pointage
            </button>
          </div>

          <div className="glass-card p-6 border-slate-800 bg-gradient-to-br from-blue-600/10 to-transparent">
            <Briefcase className="text-blue-400 mb-4" size={24} />
            <h3 className="text-white font-bold mb-2">Centre d'aide Administration</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Accédez aux documents officiels, certificats de travail et titres de congés directement dans votre espace Admin.
            </p>
            <button 
              onClick={() => alert("Initialisation du Chat Sécurisé Elite...")}
              className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors"
            >
              Démarrer le chat interne →
            </button>
          </div>
        </section>
      </div>

      {/* KPI Navigation Logic */}
      <style>{`
        .group-stat { cursor: pointer; transition: transform 0.2s; }
        .group-stat:active { transform: scale(0.98); }
      `}</style>
    </motion.div>
  );
};

export default Home;

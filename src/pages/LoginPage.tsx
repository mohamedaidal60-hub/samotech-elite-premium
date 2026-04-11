import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ShieldCheck, Mail, Lock, ArrowRight, Loader2, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Identifiants invalides');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#06090f] overflow-hidden relative font-['Outfit']">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], rotate: [0, -45, 0] }}
          transition={{ duration: 25, repeat: Infinity, delay: 2 }}
          className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-cyan-600/10 rounded-full blur-[120px]" 
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg p-1 space-y-8 z-10"
      >
        <div className="glass-card p-10 border-slate-800 shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-slate-900/40 border-2 relative overflow-hidden group">
          {/* Top accent */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600" />
          
          <div className="flex flex-col items-center gap-6 mb-12">
            <div className="w-20 h-20 rounded-[24px] bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shadow-2xl shadow-blue-500/20 group-hover:rotate-[360deg] transition-all duration-1000">
               <ShieldCheck className="text-white" size={40} />
            </div>
            <div className="text-center">
              <h1 className="text-4xl font-black tracking-tight text-white mb-2">GROWTH <span className="text-cyan-400">PARTNERS</span></h1>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-[0.3em]">Access Elite Portal</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-5">
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Adresse Email Corporate"
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                  required
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mot de Passe Sécurisé"
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                  required
                />
              </div>
            </div>

            <AnimatePresence>
               {error && (
                 <motion.div 
                   initial={{ opacity: 0, height: 0 }}
                   animate={{ opacity: 1, height: 'auto' }}
                   className="bg-rose-500/10 border border-rose-500/20 text-rose-500 p-4 rounded-xl text-xs font-bold flex items-center gap-3"
                 >
                   <Info size={16} /> {error}
                 </motion.div>
               )}
            </AnimatePresence>

            <button 
              disabled={isLoading}
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-blue-900/20 transition-all active:scale-95 flex items-center justify-center gap-3 relative overflow-hidden group/btn"
            >
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
              {isLoading ? <Loader2 className="animate-spin" size={24} /> : (
                <>
                  CONNEXION <ArrowRight size={22} className="group-hover/btn:translate-x-2 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 text-center text-slate-600 text-[10px] font-bold uppercase tracking-[0.2em] space-y-2">
            <p>© 2026 GROWTH PARTNERS GROUP</p>
            <p className="text-slate-800">Elite Global Operations Hub</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;

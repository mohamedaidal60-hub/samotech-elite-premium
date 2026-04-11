import React, { useState } from 'react';
import { Settings, Shield, Globe, Key, Save, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const SettingsPage: React.FC = () => {
  const [roles, setRoles] = useState([
    { name: 'super_admin', permissions: ['all'] },
    { name: 'admin', permissions: ['hr', 'production', 'logistics', 'quality'] },
    { name: 'teleoperator', permissions: ['calls'] },
    { name: 'quality_agent', permissions: ['audit', 'history'] },
  ]);

  const allPermissions = ['hr', 'production', 'logistics', 'quality', 'audit', 'history', 'calls', 'admin_panel'];

  return (
    <div className="space-y-8 pb-12">
      <header>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Settings className="text-blue-500" />
          Paramètres Super Admin
        </h1>
        <p className="text-slate-400 text-sm mt-1">Configuration critique des rôles, permissions et APIs tierces.</p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Roles & Permissions */}
        <section className="glass-card p-8 border-slate-800">
           <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Shield className="text-blue-500" />
              Matrice de Permissions
           </h3>
           <div className="space-y-6">
              {roles.map((role) => (
                <div key={role.name} className="p-5 bg-slate-900/60 rounded-2xl border border-slate-800">
                   <p className="font-extrabold text-blue-400 uppercase text-xs tracking-widest mb-4">{role.name}</p>
                   <div className="grid grid-cols-2 gap-3">
                      {allPermissions.map((perm) => (
                        <label key={perm} className="flex items-center gap-3 group cursor-pointer">
                           <input 
                             type="checkbox" 
                             checked={role.permissions.includes(perm) || role.permissions.includes('all')}
                             disabled={role.permissions.includes('all')}
                             className="w-5 h-5 rounded-md bg-slate-800 border-slate-700 text-blue-500 focus:ring-blue-500/20"
                           />
                           <span className="text-xs text-slate-400 group-hover:text-white transition-colors capitalize">{perm.replace('_', ' ')}</span>
                        </label>
                      ))}
                   </div>
                </div>
              ))}
           </div>
           <button className="mt-8 btn-primary w-full justify-center py-4">
              <Save size={18} /> ENREGISTRER LA MATRICE
           </button>
        </section>

        {/* API Config */}
        <div className="space-y-8">
           <section className="glass-card p-8 border-slate-800 bg-amber-500/5 border-amber-500/20">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                 <Key className="text-amber-500" />
                 Clés d'API Centralisées
              </h3>
              <div className="space-y-6">
                 <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Supabase Key (Secret)</label>
                    <input type="password" value="****************************************" readOnly className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-400 font-mono text-xs mt-2" />
                 </div>
                 <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Presence Sheque SID</label>
                    <input type="text" value="growth-partners-prod-822" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white font-mono text-xs mt-2" />
                 </div>
                 <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex gap-3">
                    <AlertTriangle className="text-amber-500 shrink-0" />
                    <p className="text-[10px] text-amber-200 italic leading-relaxed">
                       Toute modification ici affecte l'intégrité de l'authentification et du suivi GPS. Soyez extrêmement prudent.
                    </p>
                 </div>
                 <button className="btn-primary w-full justify-center bg-amber-600 hover:bg-amber-500 shadow-amber-500/10 border-none">
                    MODIFIER LES CONFIGURATIONS
                 </button>
              </div>
           </section>

           <section className="glass-card p-8 border-slate-800 group hover:border-blue-500/40 transition-all">
              <div className="flex items-center gap-4 mb-4">
                 <Globe className="text-blue-500" />
                 <h3 className="font-bold text-white">Monitoring Global</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">Le Super Admin a accès à 100% des données sans restriction RLS. Tous les outils de debug sont activés dans cette session.</p>
           </section>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

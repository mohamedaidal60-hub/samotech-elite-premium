import React, { useState, useEffect } from 'react';
import { 
  Navigation, 
  MapPin, 
  Slash, 
  Activity, 
  ShieldAlert,
  User,
  Truck,
  Power,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';

const DriverPortal: React.FC = () => {
  const [absents, setAbsents] = useState<any[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [name, setName] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [coords, setCoords] = useState<{lat: number, lon: number} | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  useEffect(() => {
    loadAbsents();
    const interval = setInterval(loadAbsents, 60000);
    return () => clearInterval(interval);
  }, []);

  const loadAbsents = async () => {
    const today = new Date().toISOString().split('T')[0];
    const { data } = await supabase
      .from('absences')
      .select('*')
      .lte('date_debut', today)
      .gte('date_fin', today)
      .order('agent_nom');
    setAbsents(data || []);
  };

  const handleStart = () => {
    if (!name || !vehicle) return alert("Saisissez votre nom et matricule véhicule");
    if (!navigator.geolocation) return alert("GPS non disponible sur cet appareil");

    const chauffeurId = name.toLowerCase().replace(/\s+/g, '_') + '_' + Date.now().toString(36);
    setIsFollowing(true);

    const id = navigator.geolocation.watchPosition(async (pos) => {
      const { latitude, longitude, speed } = pos.coords;
      setCoords({ lat: latitude, lon: longitude });
      setLastUpdate(new Date().toLocaleTimeString('fr-FR'));

      await supabase.from('positions_gps').insert({
        chauffeur_id: chauffeurId,
        chauffeur_nom: name,
        vehicule: vehicle,
        latitude,
        longitude,
        vitesse: speed ? speed * 3.6 : 0,
        statut: 'en_route'
      });
    }, (err) => {
      alert("Erreur GPS: " + err.message);
      handleStop();
    }, {
      enableHighAccuracy: true,
      maximumAge: 5000,
      timeout: 15000
    });

    setWatchId(id);
  };

  const handleStop = () => {
    if (watchId !== null) navigator.geolocation.clearWatch(watchId);
    setIsFollowing(false);
    setWatchId(null);
    setCoords(null);
    setLastUpdate('');
  };

  return (
    <div className="max-w-xl mx-auto space-y-8 p-4 font-['Outfit'] pb-20">
      <header className="text-center space-y-2 py-4">
         <h1 className="text-2xl font-black text-white tracking-tighter">GP<span className="text-cyan-400">TRANS</span> DRIVER</h1>
         <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Module de Suivi Logistique</p>
      </header>

      <section className="space-y-4">
         {absents.length > 0 ? (
           <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="glass-card p-6 border-rose-500/50 bg-rose-500/5 space-y-4">
              <div className="flex items-center gap-3 text-rose-500">
                 <ShieldAlert size={28} />
                 <h2 className="text-lg font-black uppercase tracking-tight">ALERTE ABSENCES ({absents.length})</h2>
              </div>
              <p className="text-xs font-bold text-rose-300/70 border-b border-rose-500/20 pb-3">Ne pas passer chez les agents suivants aujourd'hui :</p>
              <div className="space-y-3 pt-1">
                 {absents.map((a, i) => (
                   <div key={i} className="flex justify-between items-center p-3 bg-rose-500/10 rounded-xl border border-rose-500/10">
                      <div>
                         <p className="text-xs font-black text-white uppercase">{a.agent_nom}</p>
                         <p className="text-[9px] font-bold text-rose-300 mt-1 uppercase tracking-widest">Jusqu'au {a.date_fin}</p>
                      </div>
                      <Slash size={14} className="text-rose-500/40" />
                   </div>
                 ))}
              </div>
           </motion.div>
         ) : (
           <div className="glass-card p-4 border-emerald-500/40 bg-emerald-500/5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                 <CheckCircle2 size={24} />
              </div>
              <div>
                 <p className="text-xs font-black text-white uppercase tracking-tight">Tournée Normale</p>
                 <p className="text-[10px] text-emerald-500/70 font-bold uppercase tracking-widest">Aucune absence déclarée aujourd'hui.</p>
              </div>
           </div>
         )}
      </section>

      <AnimatePresence mode="wait">
        {!isFollowing ? (
          <motion.section 
            key="setup"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass-card p-8 border-slate-800 space-y-8"
          >
            <div className="space-y-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nom du Chauffeur</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700" size={18} />
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Karim Slimani" 
                      className="w-full bg-slate-950 border border-slate-800 py-4 pl-12 pr-4 rounded-xl text-white outline-none focus:border-blue-500 placeholder:text-slate-900 font-bold" 
                    />
                  </div>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Matricule / Véhicule</label>
                  <div className="relative">
                    <Truck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700" size={18} />
                    <input 
                      type="text" 
                      value={vehicle}
                      onChange={(e) => setVehicle(e.target.value)}
                      placeholder="Ex: Renault Master - 123456" 
                      className="w-full bg-slate-950 border border-slate-800 py-4 pl-12 pr-4 rounded-xl text-white outline-none focus:border-blue-500 placeholder:text-slate-900 font-bold" 
                    />
                  </div>
               </div>
               <button onClick={handleStart} className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white font-black text-[11px] uppercase tracking-[0.3em] rounded-2xl shadow-xl shadow-blue-900/40 flex items-center justify-center gap-3 active:scale-95 transition-all">
                  <Power size={20} /> DÉMARRER LA MISSION
               </button>
            </div>
          </motion.section>
        ) : (
          <motion.section 
            key="active"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-card p-10 border-blue-500/40 bg-blue-500/[0.03] space-y-10 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-pulse" />
            
            <div className="space-y-6">
               <div className="w-24 h-24 mx-auto rounded-full bg-blue-600/10 flex items-center justify-center relative">
                  <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute inset-0 bg-blue-600/20 rounded-full" />
                  <MapPin className="text-blue-500" size={48} />
               </div>
               
               <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 text-emerald-500 rounded-full text-[10px] font-black tracking-widest uppercase">
                     <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                     Tracking Satellite Actif
                  </div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight mt-4">{name}</h3>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{vehicle}</p>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-y border-white/5 py-8">
               <div className="space-y-1">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Coordonnées</p>
                  <p className="text-xs font-black text-blue-400 font-mono italic">
                    {coords ? `${coords.lat.toFixed(4)}, ${coords.lon.toFixed(4)}` : 'Wait GPS...'}
                  </p>
               </div>
               <div className="space-y-1 border-l border-white/5">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Mise à jour</p>
                  <p className="text-xs font-black text-white font-mono flex items-center justify-center gap-2">
                     <Clock size={14} className="text-slate-700" /> {lastUpdate || '---'}
                  </p>
               </div>
            </div>

            <button onClick={handleStop} className="w-full py-5 border-2 border-rose-500/40 text-rose-500 hover:bg-rose-500/10 font-black text-[11px] uppercase tracking-[0.3em] rounded-2xl active:scale-95 transition-all">
               ARRÊTER LE SUIVI
            </button>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DriverPortal;

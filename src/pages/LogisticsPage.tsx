import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { 
  Truck, 
  Map as MapIcon, 
  Navigation, 
  Users, 
  Plus, 
  Info,
  Car,
  Activity,
  History as HistoryIcon,
  Download,
  Calendar,
  Layers,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';

// Distance calculation using Haversine formula
const dist = (a: [number, number], b: [number, number]) => {
  const R = 6371; // Earth radius in km
  const t = (x: number) => x * Math.PI / 180;
  const dLat = t(b[0] - a[0]);
  const dLon = t(b[1] - a[1]);
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(t(a[0])) * Math.cos(t(b[0])) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
};

const LogisticsPage: React.FC = () => {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [positions, setPositions] = useState<any[]>([]);
  const [historyDocs, setHistoryDocs] = useState<any[]>([]);
  const [view, setView] = useState<'map' | 'fleet' | 'audit'>('map');
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data: v } = await supabase.from('vehicles').select('*');
      setVehicles(v || []);

      const { data: p } = await supabase.from('positions_gps').select('*').order('updated_at', { ascending: false });
      setPositions(p || []);
    };
    fetchData();

    const channel = supabase.channel('gps-live')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'positions_gps' }, (payload) => {
        setPositions(prev => [payload.new, ...prev.filter(p => p.driver_id !== payload.new.driver_id)]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const getVehicleIcon = (name: string, color: string = '#3b82f6') => {
    return L.divIcon({
      className: 'custom-div-icon',
      html: `
        <div class="gps-marker-container">
           <div class="marker-shadow-pulse" style="background: ${color}"></div>
           <div class="gps-marker" style="background: ${color}">
              <span class="marker-initial">${name.charAt(0).toUpperCase()}</span>
           </div>
        </div>
      `,
      iconSize: [42, 42],
      iconAnchor: [21, 21]
    });
  };

  const calculateTotalDistance = () => {
    // This is a simplified Mock distance from history
    return (positions.length * 12.4).toFixed(1);
  };

  return (
    <div className="space-y-8 min-h-[calc(100vh-160px)] flex flex-col font-['Outfit']">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4 border-b border-slate-800/50">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-blue-600/20 text-blue-500 border border-blue-500/20">
               <Truck size={32} />
            </div>
            FLOTTE & <span className="premium-gradient-text uppercase">Logistique GPTrans</span>
          </h1>
          <p className="text-slate-500 text-sm mt-2 ml-1 flex items-center gap-2 font-medium tracking-wide">
             <Activity size={16} className="text-emerald-500 animate-pulse" />
             Suivi Satellite Temps Réel — {positions.length} actifs en mission
          </p>
        </div>
        
        <div className="flex bg-slate-900 border border-slate-800 p-1.5 rounded-2xl shadow-xl">
          {[
            { id: 'map', label: 'Dashboard Carte', icon: MapIcon },
            { id: 'fleet', label: 'Gestion Flotte', icon: Users },
            { id: 'audit', label: 'Audit Trajets', icon: HistoryIcon }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setView(tab.id as any)}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all font-black text-[10px] uppercase tracking-[0.2em] ${view === tab.id ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]' : 'text-slate-500 hover:text-white'}`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          {view === 'map' ? (
            <motion.div 
              key="map-view"
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
              className="flex-1 min-h-[650px] relative rounded-[32px] overflow-hidden border-2 border-slate-800/80 shadow-[0_0_40px_rgba(0,0,0,0.5)]"
            >
              <MapContainer 
                center={[36.7538, 3.0588]} 
                zoom={12} 
                className="w-full h-full z-10"
                style={{ background: '#06090f' }}
              >
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                  attribution='&copy; Growth Partners ERP'
                />
                {positions.map((pos) => (
                  <Marker 
                    key={pos.id} 
                    position={[pos.latitude, pos.longitude]}
                    icon={getVehicleIcon(pos.driver_id || 'U', pos.speed > 5 ? '#3b82f6' : '#94a3b8')}
                  >
                    <Popup className="premium-popup">
                      <div className="p-4 space-y-3 min-w-[200px]">
                        <div className="flex justify-between items-start">
                           <h4 className="font-black text-slate-900 uppercase text-xs tracking-wider">ID CHAUFFEUR: {pos.driver_id}</h4>
                           <span className="bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded text-[8px] font-black uppercase">En Mouvement</span>
                        </div>
                        <div className="h-px bg-slate-100" />
                        <div className="grid grid-cols-2 gap-2">
                           <div>
                              <p className="text-[8px] text-slate-400 font-bold uppercase">Vitesse</p>
                              <p className="text-sm font-black text-slate-800 tracking-tight">{Math.round(pos.speed || 0)} KM/H</p>
                           </div>
                           <div className="text-right">
                              <p className="text-[8px] text-slate-400 font-bold uppercase">Signal</p>
                              <p className="text-sm font-black text-blue-600 tracking-tight">EXCELLENT</p>
                           </div>
                        </div>
                        <p className="text-[9px] text-slate-400 italic">Dernière MaJ: {format(new Date(pos.updated_at), 'HH:mm:ss')}</p>
                      </div>
                    </Popup>
                    <Tooltip direction="top" offset={[0, -20]} opacity={1} permanent={false}>
                        <span className="font-bold text-[10px] uppercase">{pos.driver_id}</span>
                    </Tooltip>
                  </Marker>
                ))}
              </MapContainer>

              {/* Advanced OSD */}
              <div className="absolute top-8 left-8 z-[1000] pointer-events-none space-y-4">
                 <div className="glass-card p-6 border-slate-700/50 pointer-events-auto bg-[#0d121c]/90 min-w-[280px] shadow-2xl">
                    <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-6 flex items-center justify-between">
                       Stats Opérationnelles
                       <Layers size={14} />
                    </h3>
                    <div className="grid grid-cols-2 gap-6">
                       <div>
                          <p className="text-2xl font-black text-white tracking-tighter">{positions.length}</p>
                          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Bus en Transit</p>
                       </div>
                       <div className="text-right">
                          <p className="text-2xl font-black text-emerald-400 tracking-tighter">{calculateTotalDistance()} KM</p>
                          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Distance Totale</p>
                       </div>
                    </div>
                    <div className="mt-8 pt-6 border-t border-slate-800 space-y-4">
                       <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                          <span className="text-slate-500">Kpi Occupation</span>
                          <span className="text-white">88%</span>
                       </div>
                       <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-600 w-[88%] shadow-[0_0_10px_rgba(59,130,246,0.6)]" />
                       </div>
                    </div>
                 </div>
              </div>

              {/* Real-time Ticker Dashboard */}
              <div className="absolute bottom-8 right-8 z-[1000] pointer-events-none">
                 <div className="glass-card p-4 border-slate-700/50 pointer-events-auto bg-slate-950/80 min-w-[320px] backdrop-blur-3xl border-l-[6px] border-blue-600">
                    <span className="flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4">
                       <Navigation size={14} className="text-blue-500" />
                       Journal de bord Flux Live
                    </span>
                    <div className="space-y-3 max-h-40 overflow-hidden">
                       {positions.map((p, i) => (
                         <div key={i} className="flex items-center justify-between gap-4 py-2 border-b border-white/5 opacity-80 hover:opacity-100 transition-opacity">
                            <span className="text-[11px] font-black text-white uppercase">{p.driver_id}</span>
                            <span className="text-[10px] text-slate-500 font-mono tracking-tighter">Lat: {p.latitude.toFixed(3)} Lon: {p.longitude.toFixed(3)}</span>
                            <span className="text-[10px] font-black text-blue-400">{Math.round(p.speed)} KMH</span>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
            </motion.div>
          ) : view === 'fleet' ? (
            <motion.div 
               key="fleet"
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
            >
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="glass-card p-10 border-slate-800 group hover:border-blue-600/50 transition-all relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-8 opacity-5 transition-opacity group-hover:opacity-10">
                      <Truck size={120} />
                   </div>
                   <div className="flex justify-between items-start mb-10">
                      <div className="w-16 h-16 rounded-3xl bg-blue-600/5 flex items-center justify-center text-blue-500 border border-blue-500/10 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                         <Truck size={32} />
                      </div>
                      <div className="text-right">
                         <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">Actif</span>
                         <p className="text-[10px] text-slate-600 mt-2 font-bold uppercase">ID Bus: GP-TRANS-00{i}</p>
                      </div>
                   </div>
                   <h3 className="text-2xl font-black text-white uppercase tracking-tight">Mega Trans Continental</h3>
                   <div className="mt-8 space-y-4">
                      <div className="flex justify-between text-xs font-bold uppercase">
                         <span className="text-slate-500 tracking-widest">Chauffeur Titulaire</span>
                         <span className="text-white">Hakim Benallal</span>
                      </div>
                      <div className="flex justify-between text-xs font-bold uppercase">
                         <span className="text-slate-500 tracking-widest">Capacité Véhicule</span>
                         <span className="text-white">42 PLACES</span>
                      </div>
                      <div className="flex justify-between text-xs font-bold uppercase">
                         <span className="text-slate-500 tracking-widest">Prochaine Vidance</span>
                         <span className="text-blue-400">DANS 4,200 KM</span>
                      </div>
                   </div>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="audit"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card border-slate-800 overflow-hidden"
            >
              <div className="p-10 border-b border-slate-800 flex justify-between items-center bg-slate-950/40">
                 <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-slate-500 border border-slate-800">
                       <HistoryIcon size={28} />
                    </div>
                    <div>
                       <h2 className="text-2xl font-black text-white uppercase">Journal Historique des Trajets</h2>
                       <p className="text-slate-500 text-xs font-medium mt-1">Audit complet des itinéraires, vitesses moyennes et consommation estimée.</p>
                    </div>
                 </div>
                 <button className="flex items-center gap-3 px-6 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-500/10 transition-all">
                    <Download size={18} /> EXPORT ANALYTIQUE EXCEL
                 </button>
              </div>
              
              <div className="p-10 flex gap-6 border-b border-slate-900">
                  <div className="flex-1 relative group">
                     <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600" size={20} />
                     <input type="text" placeholder="RECHERCHE PAR CHAUFFEUR OU MATRICULE..." className="w-full bg-slate-950 border border-slate-800 rounded-3xl py-5 pl-16 pr-6 text-white text-xs font-black uppercase tracking-widest outline-none focus:border-blue-500 transition-all" />
                  </div>
                  <div className="w-64 relative">
                     <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600" size={20} />
                     <input type="date" className="w-full bg-slate-950 border border-slate-800 rounded-3xl py-5 pl-16 pr-6 text-white text-xs font-black uppercase outline-none" />
                  </div>
              </div>

              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="bg-slate-900/50 text-slate-500 text-[10px] uppercase font-black tracking-[0.2em]">
                          <th className="px-10 py-6">Mission / Chauffeur</th>
                          <th className="px-10 py-6 text-center">Départ</th>
                          <th className="px-10 py-6 text-center">Distance</th>
                          <th className="px-10 py-6 text-center">Vitesse Moy.</th>
                          <th className="px-10 py-6 text-right">Statut</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900">
                       {[1, 2, 3, 4, 5].map((i) => (
                         <tr key={i} className="hover:bg-slate-800/20 transition-all cursor-pointer">
                            <td className="px-10 py-6">
                               <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-[10px] font-black text-slate-400">GP</div>
                                  <div>
                                     <p className="font-black text-white uppercase text-sm">Trajet Sector North #{2992 + i}</p>
                                     <p className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">Driver: Karim Ouali</p>
                                  </div>
                               </div>
                            </td>
                            <td className="px-10 py-6 text-center text-xs font-black text-slate-400">06:15 AM</td>
                            <td className="px-10 py-6 text-center text-xs font-black text-blue-500">114.2 KM</td>
                            <td className="px-10 py-6 text-center text-xs font-black text-slate-400">62 KM/H</td>
                            <td className="px-10 py-6 text-right">
                               <span className="px-3 py-1.5 bg-blue-500/10 text-blue-500 text-[9px] font-black uppercase tracking-widest rounded-lg border border-blue-500/20 whitespace-nowrap">COMPLÉTÉ SANS ALERTES</span>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <style>{`
        .gps-marker-container {
           position: relative;
           display: flex;
           items-center: center;
           justify-content: center;
        }
        .gps-marker {
           width: 38px;
           height: 38px;
           border: 4px solid #fff;
           border-radius: 50% 50% 50% 0;
           transform: rotate(-45deg);
           display: flex;
           align-items: center;
           justify-content: center;
           box-shadow: 0 4px 15px rgba(0,0,0,0.6);
           z-index: 20;
        }
        .marker-initial {
           color: #fff;
           font-weight: 900;
           font-size: 14px;
           transform: rotate(45deg);
           font-family: 'Outfit';
        }
        .marker-shadow-pulse {
           position: absolute;
           width: 100%;
           height: 100%;
           border-radius: 50%;
           z-index: 10;
           animation: gps-pulse 2.5s infinite;
        }
        @keyframes gps-pulse {
           0% { transform: scale(1); opacity: 0.8; }
           100% { transform: scale(3.5); opacity: 0; }
        }
        .premium-popup .leaflet-popup-content-wrapper {
           background: #fff;
           border-radius: 20px;
           padding: 4px;
           box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        }
        .premium-popup .leaflet-popup-tip {
           display: none;
        }
        .custom-scrollbar::-webkit-scrollbar {
           width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
           background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
           background: rgba(255, 255, 255, 0.05);
           border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default LogisticsPage;

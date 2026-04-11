import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
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
  History
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';

// Fix for default marker icons in Leaflet + React
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const LogisticsPage: React.FC = () => {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [positions, setPositions] = useState<any[]>([]);
  const [view, setView] = useState<'map' | 'fleet' | 'routes'>('map');

  useEffect(() => {
    const fetchData = async () => {
      const { data: v } = await supabase.from('vehicles').select('*');
      setVehicles(v || []);

      const { data: p } = await supabase.from('gps_positions').select('*').order('updated_at', { ascending: false });
      setPositions(p || []);
    };
    fetchData();

    // Subscribe to real-time updates
    const channel = supabase.channel('gps-live')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'gps_positions' }, (payload) => {
        setPositions(prev => [payload.new, ...prev.filter(p => p.driver_id !== payload.new.driver_id)]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getVehicleIcon = (type: string, name: string) => {
    return L.divIcon({
      className: 'custom-div-icon',
      html: `
        <div class="gps-marker">
          <div class="marker-dot"></div>
          <div class="marker-label">${name.charAt(0)}</div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });
  };

  return (
    <div className="space-y-8 min-h-[calc(100vh-160px)] flex flex-col">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Truck className="text-blue-500" />
            Flotte & Logistique Transport
          </h1>
          <p className="text-slate-400 text-sm mt-1">Suivi en temps réel des chauffeurs et gestion de la flotte.</p>
        </div>
        
        <div className="flex bg-slate-900/50 p-1 rounded-2xl border border-slate-800">
          {[
            { id: 'map', label: 'Suivi Carte', icon: MapIcon },
            { id: 'fleet', label: 'Flotte', icon: Users },
            { id: 'routes', label: 'Historique', icon: Activity }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setView(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all font-bold text-xs uppercase tracking-widest ${view === tab.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white'}`}
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
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="flex-1 min-h-[600px] relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl"
            >
              <MapContainer 
                center={[36.7538, 3.0588]} 
                zoom={11} 
                className="w-full h-full"
                style={{ background: '#0a0f1a' }}
              >
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                  attribution='&copy; OpenStreetMap &copy; CARTO'
                />
                {positions.map((pos) => (
                  <Marker 
                    key={pos.id} 
                    position={[pos.latitude, pos.longitude]}
                    icon={getVehicleIcon(pos.vehicle_type, pos.driver_id)}
                  >
                    <Popup className="premium-popup">
                      <div className="p-2 space-y-2">
                        <p className="font-bold text-slate-900">ID Chauffeur: {pos.driver_id}</p>
                        <p className="text-xs text-slate-600 flex items-center gap-1">
                          <Navigation size={12} />
                          Vitesse: {Math.round(pos.speed || 0)} km/h
                        </p>
                        <p className="text-[10px] text-slate-400">MàJ: {new Date(pos.updated_at).toLocaleTimeString()}</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>

              {/* Stats Overlay */}
              <div className="absolute top-6 right-6 w-72 space-y-4 z-[1000] pointer-events-none">
                <div className="glass-card p-5 border-slate-700/50 pointer-events-auto">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Statut de la Flotte</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-300">Actifs</span>
                      <span className="text-emerald-400 font-bold">{positions.length}</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full w-[80%] rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-300">En retard (Pointage)</span>
                      <span className="text-amber-500 font-bold">3</span>
                    </div>
                  </div>
                </div>
                
                <div className="glass-card p-5 border-slate-700/50 pointer-events-auto">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Derniers Pings</h3>
                  <div className="space-y-3 max-h-48 overflow-y-auto custom-scrollbar">
                    {positions.slice(0, 5).map((p, i) => (
                      <div key={i} className="flex items-center gap-3 p-2 hover:bg-slate-800/50 rounded-lg transition-colors cursor-pointer">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.8)]" />
                        <div className="flex-1 font-bold text-xs truncate">ID: {p.driver_id}</div>
                        <div className="text-[10px] text-slate-500">{new Date(p.updated_at).toLocaleTimeString()}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : view === 'fleet' ? (
            <motion.div 
              key="fleet-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="glass-card p-6 border-slate-800 group hover:border-blue-500/50 transition-all">
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-4 rounded-2xl bg-blue-600/10 text-blue-500 border border-blue-500/20 group-hover:scale-110 transition-transform">
                      <Truck size={32} />
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase ${i % 2 === 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                      {i % 2 === 0 ? 'Disponible' : 'En Route'}
                    </span>
                  </div>
                  <h3 className="text-white font-bold text-lg">Bus {300 + i} — Grand Format</h3>
                  <p className="text-slate-500 text-xs mt-1 uppercase tracking-wider font-semibold">Matricule: 0021-322-16</p>
                  
                  <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <Users size={16} className="text-slate-500" />
                       <span className="text-xs font-bold text-slate-300">Chauffeur: Benali H.</span>
                    </div>
                    <button className="text-blue-500 p-2 hover:bg-blue-500/10 rounded-lg transition-colors">
                      <Info size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
               key="routes-view"
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }}
               className="glass-card p-10 border-slate-800 text-center"
            >
              <History size={48} className="text-slate-700 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white">Historique des Trajets</h2>
              <p className="text-slate-500 mt-2">Le module d'analyse des trajets et de consommation est en cours de déploiement.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <style>{`
        .gps-marker {
          width: 40px;
          height: 40px;
          background: #3b82f6;
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 4px 15px rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .marker-dot {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: rgba(59, 130, 246, 0.4);
          animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        .marker-label {
          color: white;
          font-weight: 800;
          font-size: 16px;
          z-index: 10;
        }
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        .premium-popup .leaflet-popup-content-wrapper {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          padding: 8px;
        }
      `}</style>
    </div>
  );
};

export default LogisticsPage;

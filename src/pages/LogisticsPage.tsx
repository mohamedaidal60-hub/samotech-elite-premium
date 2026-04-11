import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Truck, Navigation, Users, PlusCircle } from 'lucide-react';
import L from 'leaflet';

// Leaflet icon fix
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const LocationMarker = ({ position, name }: { position: [number, number], name: string }) => {
  return (
    <Marker position={position}>
      <Popup>
        <b>{name}</b><br />En route vers: Centre d'appel GP
      </Popup>
    </Marker>
  );
};

const LogisticsPage: React.FC = () => {
  const [vehicles, setVehicles] = useState([
    { id: 1, name: 'Bus Sétra A1', driver: 'Mourad', pos: [36.7538, 3.0588] as [number, number], status: 'en_route', capacity: '50 pl' },
    { id: 2, name: 'Kangoo G1', driver: 'Amine', pos: [36.73, 3.08] as [number, number], status: 'en_route', capacity: '5 pl' },
    { id: 3, name: 'Master L2', driver: 'Karim', pos: [36.76, 3.04] as [number, number], status: 'arreté', capacity: '15 pl' },
  ]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '24px' }}>Logistique & Transport</h1>
        <button className="btn-primary"><PlusCircle size={18} /> Planifier trajet</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '20px', height: '600px' }}>
        <div className="premium-card" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--border)' }}>
          <MapContainer center={[36.75, 3.05]} zoom={12} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {vehicles.map(v => (
              <LocationMarker key={v.id} position={v.pos} name={v.name} />
            ))}
          </MapContainer>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div className="premium-card">
            <h3 style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Truck size={20} /> Flotte Active
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {vehicles.map(v => (
                <div key={v.id} style={{ padding: '12px', border: '1px solid var(--border)', borderRadius: '12px', background: 'rgba(255,255,255,0.02)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span style={{ fontWeight: '600' }}>{v.name}</span>
                    <span className="badge-blue" style={{ fontSize: '10px' }}>{v.capacity}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Chauffeur: {v.driver}</div>
                  <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px' }}>
                     <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: v.status === 'en_route' ? 'var(--success)' : 'var(--error)' }} />
                     {v.status === 'en_route' ? 'En circulation' : 'À l\'arrêt'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="premium-card">
             <h3 style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Users size={20} /> Covoiturage
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              3 équipes ont activé le covoiturage pour ce soir.
            </p>
            <button className="btn-primary" style={{ width: '100%', marginTop: '15px', background: 'var(--bg-main)', border: '1px solid var(--border)' }}>
              Voir les lignes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogisticsPage;

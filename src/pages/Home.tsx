import React from 'react';
import { 
  Users, 
  TrendingUp, 
  PhoneCall, 
  Truck, 
  CheckCircle2, 
  Clock,
  Circle
} from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard: React.FC = () => {
  const kpis = [
    { label: 'Effectif Total', value: '124', sub: '+4 ce mois', icon: Users, color: '#3b82f6' },
    { label: 'Ventes du jour', value: '18', sub: 'Objectif: 25', icon: TrendingUp, color: '#10b981' },
    { label: 'Appels en cours', value: '42', sub: '95% de productivité', icon: PhoneCall, color: '#06b6d4' },
    { label: 'Véhicules actifs', value: '8/12', sub: '2 en maintenance', icon: Truck, color: '#f59e0b' },
  ];

  const recentSales = [
    { agent: 'Sarah Toumi', client: 'Orange FR', time: '14:20', status: 'validated' },
    { agent: 'Mehdi Ben', client: 'EDF GDF', time: '14:15', status: 'pending' },
    { agent: 'Yassine K.', client: 'SFR Pro', time: '13:55', status: 'validated' },
    { agent: 'Linda S.', client: 'Canal+', time: '13:40', status: 'validated' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      {/* KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
        {kpis.map((kpi, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="premium-card"
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}
          >
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                {kpi.label}
              </p>
              <h3 style={{ fontSize: '28px', color: 'white' }}>{kpi.value}</h3>
              <p style={{ color: 'var(--text-dim)', fontSize: '12px', marginTop: '4px' }}>{kpi.sub}</p>
            </div>
            <div style={{ padding: '10px', borderRadius: '12px', backgroundColor: `${kpi.color}15`, color: kpi.color }}>
              <kpi.icon size={24} />
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        {/* Real-time Status */}
        <div className="premium-card glass-morphism">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Clock size={20} className="pulse" style={{ color: 'var(--accent-secondary)' }} />
              Activités en Direct
            </h3>
            <button className="small" style={{ fontSize: '12px', color: 'var(--accent-primary)', background: 'none', border: 'none', cursor: 'pointer' }}>Voir tout</button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {recentSales.map((sale, i) => (
              <div key={i} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                padding: '12px',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.02)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                   <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: sale.status === 'validated' ? 'var(--success)' : 'var(--warning)' }} />
                   <div>
                     <div style={{ fontWeight: '600', fontSize: '14px' }}>{sale.agent}</div>
                     <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Vente: {sale.client}</div>
                   </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>{sale.time}</div>
                  <div className={`badge ${sale.status === 'validated' ? 'badge-success' : 'badge-error'}`} style={{ marginTop: '4px' }}>
                    {sale.status === 'validated' ? 'Confirmé' : 'En attente'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Presence / Logistics Quick View */}
        <div className="premium-card">
          <h3 style={{ marginBottom: '20px' }}>Logistique</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                <span>Taux de présence</span>
                <span>92%</span>
              </div>
              <div style={{ height: '6px', width: '100%', backgroundColor: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '92%', backgroundColor: 'var(--success)' }} />
              </div>
            </div>
            
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                <span>Véhicules en route</span>
                <span>8/12</span>
              </div>
              <div style={{ height: '6px', width: '100%', backgroundColor: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '66%', backgroundColor: 'var(--accent-primary)' }} />
              </div>
            </div>

            <div style={{ marginTop: '10px', padding: '15px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.05)', border: '1px dashed var(--accent-primary)' }}>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '5px' }}>Notifications</p>
              <p style={{ fontSize: '13px' }}>2 nouveaux certificats médicaux à valider.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

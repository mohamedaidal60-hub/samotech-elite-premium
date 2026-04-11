import React, { useState } from 'react';
import { 
  Clock, 
  Calendar, 
  UserCheck, 
  Upload, 
  FileText, 
  AlertCircle,
  Plus
} from 'lucide-react';

const HRPage: React.FC = () => {
  const [employees, setEmployees] = useState([
    { id: 1, name: 'Amel Mansouri', role: 'Téléopérateur', status: 'present', checkIn: '08:55', checkOut: '-' },
    { id: 2, name: 'Tarek Belkacem', role: 'Superviseur', status: 'absent', checkIn: '-', checkOut: '-' },
    { id: 3, name: 'Imane Sassi', role: 'Formatrice', status: 'present', checkIn: '09:02', checkOut: '-' },
    { id: 4, name: 'Fayçal Dali', role: 'Qualité', status: 'present', checkIn: '08:45', checkOut: '-' },
  ]);

  const [certificates, setCertificates] = useState([
    { id: 101, name: 'Certificat_Medical_Faycal.pdf', employee: 'Fayçal Dali', date: '10/04/2026', type: 'Sickness' },
    { id: 102, name: 'Titre_Conge_Amel.jpg', employee: 'Amel Mansouri', date: '08/04/2026', type: 'Leave' },
  ]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '24px' }}>RH & Gestion du Personnel</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-primary" style={{ background: 'var(--success)' }}><Clock size={18} /> Pointer l'arrivée</button>
          <button className="btn-primary"><Plus size={18} /> Nouvel Employé</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 400px', gap: '20px' }}>
        {/* Presence / Attendance List */}
        <div className="premium-card">
           <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
             <UserCheck size={20} /> Pointage du Jour
           </h3>
           <table style={{ width: '100%', borderCollapse: 'collapse' }}>
             <thead>
               <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)', fontSize: '12px', color: 'var(--text-dim)' }}>
                 <th style={{ padding: '12px' }}>EMPLOYÉ</th>
                 <th style={{ padding: '12px' }}>FONCTION</th>
                 <th style={{ padding: '12px' }}>ARRIVÉE</th>
                 <th style={{ padding: '12px' }}>SORTIE</th>
                 <th style={{ padding: '12px' }}>STATUT</th>
               </tr>
             </thead>
             <tbody>
               {employees.map(emp => (
                 <tr key={emp.id} style={{ borderBottom: '1px solid #1e2d42', fontSize: '14px' }}>
                   <td style={{ padding: '12px', fontWeight: 'bold' }}>{emp.name}</td>
                   <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{emp.role}</td>
                   <td style={{ padding: '12px' }}>{emp.checkIn}</td>
                   <td style={{ padding: '12px' }}>{emp.checkOut}</td>
                   <td style={{ padding: '12px' }}>
                     <span className={emp.status === 'present' ? 'badge-success' : 'badge-error'} style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '11px' }}>
                       {emp.status.toUpperCase()}
                     </span>
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
        </div>

        {/* Documents / Certificates */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
           <div className="premium-card glass-morphism">
              <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Upload size={18} /> Déposer un Document
              </h3>
              <div style={{ 
                border: '2px dashed var(--border)', 
                borderRadius: '12px', 
                padding: '30px', 
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'border-color 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
              onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                <div style={{ color: 'var(--text-dim)', fontSize: '13px' }}>
                  Glissez un fichier ici ou <span style={{ color: 'var(--accent-secondary)', fontWeight: 'bold' }}>Parcourir</span>
                </div>
                <div style={{ marginTop: '5px', fontSize: '10px', color: 'var(--text-dim)' }}>PDF, JPG (Max 5MB)</div>
              </div>
           </div>

           <div className="premium-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FileText size={18} /> Documents Récents
                </h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {certificates.map(cert => (
                  <div key={cert.id} style={{ padding: '12px', border: '1px solid var(--border)', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <div style={{ color: 'var(--accent-secondary)' }}><FileText size={20} /></div>
                      <div>
                        <div style={{ fontWeight: '600', fontSize: '13px' }}>{cert.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>{cert.employee} • {cert.date}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="btn-primary" style={{ width: '100%', marginTop: '20px', background: 'none', border: '1px solid var(--border)', color: 'white' }}>
                 Toutes les archives
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default HRPage;

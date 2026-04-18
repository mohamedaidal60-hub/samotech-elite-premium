import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Headphones, PhoneOutgoing, CalendarCheck, HelpCircle } from 'lucide-react';

const inboundServices = [
  { id: 'sav', title: 'SAV H24 7/7', icon: <Headphones size={32} />, desc: 'Service après-vente disponible sans interruption.' },
  { id: 'helpdesk', title: 'Help Desk 24/7', icon: <HelpCircle size={32} />, desc: 'Assistance technique dédiée et support client continu.' },
  { id: 'standard', title: 'Standard Téléphonique', icon: <Headphones size={32} />, desc: 'Réception d\'appels et orientation professionnelle.' }
];

const outboundServices = [
  { id: 'televente', title: 'Télévente', icon: <PhoneOutgoing size={32} />, desc: 'Vente directe par téléphone avec des opérateurs qualifiés.' },
  { id: 'prospection', title: 'Téléprospection', icon: <PhoneOutgoing size={32} />, desc: 'Recherche de nouveaux prospects et leads.' },
  { id: 'rdv', title: 'Prise de RDV', icon: <CalendarCheck size={32} />, desc: 'Planification d\'agendas pour vos commerciaux.' }
];

function ServiceModal({ service, onClose }) {
  if (!service) return null;

  // Simulate premium image with large logo on the wall
  const bgImage = "https://images.unsplash.com/photo-1593642532744-d377ab507dc8?auto=format&fit=crop&q=80&w=1200";

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div 
        className="modal-content"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}><X size={24}/></button>
        <div className="modal-header-image" style={{ backgroundImage: `url(${bgImage})` }}>
          <h2 className="modal-title">{service.title}</h2>
          {/* Giant watermark placeholder */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.1, fontSize: '10rem', color: 'white', whiteSpace: 'nowrap' }}>
            GROWTH PARTNERS
          </div>
        </div>
        <div className="modal-body">
          <p style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>{service.desc}</p>
          <p>
            Plongez au cœur d'un centre d'appels de plus de 1000 positions. Nos téléopérateurs spécialisés 
            traitent vos requêtes dans toutes les langues (Français, Anglais, Arabe, etc.). L'excellence et 
            le premium sont au centre de notre stratégie. 
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <img src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=400" alt="Bureau" style={{flex: 1, borderRadius: '10px', objectFit: 'cover', height: '200px'}} />
            <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=400" alt="Tech" style={{flex: 1, borderRadius: '10px', objectFit: 'cover', height: '200px'}} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function Home() {
  const [selectedService, setSelectedService] = useState(null);

  return (
    <div>
      <section className="hero">
        <div className="container hero-content">
          <h1 className="hero-title">L'Excellence du Centre d'Appels International</h1>
          <p className="hero-subtitle">
            Multilingue, moderne et premium. Vos opérations de réception et d'émission gérées par plus de 1000 experts connectés H24.
          </p>
          <div className="flex gap-4" style={{ justifyContent: 'center' }}>
            <button className="btn-primary" onClick={() => document.getElementById('reception').scrollIntoView({behavior: 'smooth'})}>Découvrir nos services</button>
            <a href="/partenariat" style={{ display: 'inline-block', padding: '0.75rem 1.5rem', borderRadius: '8px', border: '2px solid var(--color-primary)', color: 'var(--color-primary)', fontWeight: '600' }}>Devenir Partenaire</a>
          </div>
        </div>
      </section>

      <section className="services-section" id="reception">
        <div className="container">
          <h2 className="section-title">Réception d'Appel (Inbound)</h2>
          <div className="grid">
            {inboundServices.map(service => (
              <div key={service.id} className="premium-card service-card" onClick={() => setSelectedService(service)}>
                <div className="service-icon">{service.icon}</div>
                <h3>{service.title}</h3>
                <p style={{ color: 'var(--color-text-muted)' }}>{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="services-section" style={{ background: 'var(--color-gray)' }}>
        <div className="container">
          <h2 className="section-title">Émission d'Appel (Outbound)</h2>
          <div className="grid">
            {outboundServices.map(service => (
              <div key={service.id} className="premium-card service-card" onClick={() => setSelectedService(service)}>
                <div className="service-icon">{service.icon}</div>
                <h3>{service.title}</h3>
                <p style={{ color: 'var(--color-text-muted)' }}>{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selectedService && (
          <ServiceModal service={selectedService} onClose={() => setSelectedService(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

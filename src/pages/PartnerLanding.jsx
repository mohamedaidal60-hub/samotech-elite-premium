import React, { useState } from 'react';
import { motion } from 'framer-motion';
import sql from '../lib/db';

export default function PartnerLanding() {
  const [formData, setFormData] = useState({
    prenom: '', nom: '', entite: '', services: [], langues: [],
    positions: '', mail: '', telephone: '', message: ''
  });
  const [loading, setLoading] = useState(false);

  const availableServices = ['SAV H24 7/7', 'Help Desk 24/7', 'Standard', 'Télévente', 'Téléprospection', 'Prise de RDV'];
  const availableLanguages = ['Français', 'Anglais', 'Arabe'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // SAVE TO NEON (Replacement for localStorage)
      await sql`
        INSERT INTO partners (prenom, nom, entite, services, langues, positions, mail, telephone, message)
        VALUES (
          ${formData.prenom}, 
          ${formData.nom}, 
          ${formData.entite}, 
          ${formData.services}, 
          ${formData.langues}, 
          ${parseInt(formData.positions)}, 
          ${formData.mail}, 
          ${formData.telephone}, 
          ${formData.message}
        )
      `;
      
      // WhatsApp Fix (Direct redirect with encoding)
      const text = `Nouveau Partenariat:%0AEntité: ${formData.entite}%0AContact: ${formData.prenom} ${formData.nom}%0AEmail: ${formData.mail}%0ATél: ${formData.telephone}%0AServices: ${formData.services.join(', ')}%0ALangues: ${formData.langues.join(', ')}%0APositions: ${formData.positions}%0AMessage: ${formData.message}`;
      window.open(`https://wa.me/213799909096?text=${text}`, '_blank');
      
      alert("Demande envoyée avec succès et transmise vers WhatsApp !");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'envoi vers la base de données.");
    } finally {
      setLoading(false);
    }
  };

  const toggleArray = (field, value) => {
    setFormData(prev => {
      const arr = prev[field];
      if (arr.includes(value)) return { ...prev, [field]: arr.filter(x => x !== value) };
      return { ...prev, [field]: [...arr, value] };
    });
  };

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh' }} className="container">
      <motion.div initial={{opacity:0}} animate={{opacity:1}} className="premium-card" style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem' }}>
        <h2 className="section-title" style={{ marginBottom: '2rem' }}>Devenir Partenaire</h2>
        <form onSubmit={handleSubmit}>
          <div className="flex gap-4">
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Prénom de l'interlocuteur</label>
              <input required type="text" className="form-control" onChange={e => setFormData({...formData, prenom: e.target.value})} />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Nom de l'interlocuteur</label>
              <input required type="text" className="form-control" onChange={e => setFormData({...formData, nom: e.target.value})} />
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Nom de l'entité représentée</label>
            <input required type="text" className="form-control" onChange={e => setFormData({...formData, entite: e.target.value})} />
          </div>

          <div className="form-group">
            <label className="form-label">Service(s) demandé(s)</label>
            <div className="flex gap-4" style={{ flexWrap: 'wrap' }}>
              {availableServices.map(s => (
                <label key={s} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input type="checkbox" onChange={() => toggleArray('services', s)} /> {s}
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Langue(s) exigée(s)</label>
            <div className="flex gap-4" style={{ flexWrap: 'wrap' }}>
              {availableLanguages.map(l => (
                <label key={l} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input type="checkbox" onChange={() => toggleArray('langues', l)} /> {l}
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Nombre de positions souhaité</label>
            <input required type="number" min="1" className="form-control" onChange={e => setFormData({...formData, positions: e.target.value})} />
          </div>

          <div className="flex gap-4">
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Email</label>
              <input required type="email" className="form-control" onChange={e => setFormData({...formData, mail: e.target.value})} />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Téléphone</label>
              <input required type="tel" className="form-control" onChange={e => setFormData({...formData, telephone: e.target.value})} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Message (optionnel)</label>
            <textarea className="form-control" rows="4" onChange={e => setFormData({...formData, message: e.target.value})}></textarea>
          </div>

          <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', marginTop: '1rem', fontSize: '1.2rem' }}>
            {loading ? 'Chargement...' : 'Envoyer la demande'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

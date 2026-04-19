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
      // Save to Neon Database
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

      // WhatsApp redirect logic
      // Using international format without + or spaces for wa.me
      const whatsappNumber = '213799909096';
      const text = `*Nouveau Partenariat (Growth Partners)*\n\n` +
                   `• *Entité:* ${formData.entite}\n` +
                   `• *Contact:* ${formData.prenom} ${formData.nom}\n` +
                   `• *Email:* ${formData.mail}\n` +
                   `• *Tél:* ${formData.telephone}\n` +
                   `• *Services:* ${formData.services.join(', ')}\n` +
                   `• *Langues:* ${formData.langues.join(', ')}\n` +
                   `• *Positions:* ${formData.positions}\n` +
                   `• *Message:* ${formData.message || 'N/A'}`;
      
      const encodedText = encodeURIComponent(text);
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedText}`;
      
      // Using window.location.href or window.open after short delay to avoid popup blockers
      // but direct open is better if still in the event loop.
      window.open(whatsappUrl, '_blank');
      
      alert("Demande enregistrée et transmise vers WhatsApp !");
    } catch (error) {
      console.error('Error saving partner:', error);
      alert("Erreur lors de l'envoi. Veuillez réessayer.");
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
    <div style={{ paddingTop: '100px', minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)', color: 'white' }} className="container px-4">
      <motion.div 
        initial={{opacity:0, y: 20}} 
        animate={{opacity:1, y: 0}} 
        className="premium-card" 
        style={{ 
          maxWidth: '800px', 
          margin: '0 auto', 
          padding: '2.5rem',
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }}
      >
        <h2 className="section-title text-center" style={{ marginBottom: '2.5rem', fontSize: '2.5rem', fontWeight: '800', background: 'linear-gradient(to right, #fff, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Devenir Partenaire
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group">
              <label className="form-label block text-sm font-medium mb-2 text-blue-300">Prénom</label>
              <input required type="text" className="form-control w-full bg-black/40 border-slate-700 text-white rounded-xl py-3 focus:ring-2 focus:ring-blue-500 transition-all" onChange={e => setFormData({...formData, prenom: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label block text-sm font-medium mb-2 text-blue-300">Nom</label>
              <input required type="text" className="form-control w-full bg-black/40 border-slate-700 text-white rounded-xl py-3 focus:ring-2 focus:ring-blue-500 transition-all" onChange={e => setFormData({...formData, nom: e.target.value})} />
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label block text-sm font-medium mb-2 text-blue-300">Nom de l'entité représentée</label>
            <input required type="text" className="form-control w-full bg-black/40 border-slate-700 text-white rounded-xl py-3 focus:ring-2 focus:ring-blue-500 transition-all" onChange={e => setFormData({...formData, entite: e.target.value})} />
          </div>

          <div className="form-group">
            <label className="form-label block text-sm font-medium mb-4 text-blue-300">Service(s) demandé(s)</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {availableServices.map(s => (
                <button 
                  key={s} 
                  type="button"
                  onClick={() => toggleArray('services', s)}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-300 ${formData.services.includes(s) ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label block text-sm font-medium mb-4 text-blue-300">Langue(s) exigée(s)</label>
            <div className="flex flex-wrap gap-3">
              {availableLanguages.map(l => (
                <button 
                  key={l} 
                  type="button"
                  onClick={() => toggleArray('langues', l)}
                  className={`py-2 px-6 rounded-full text-sm font-medium transition-all ${formData.langues.includes(l) ? 'bg-blue-600 text-white' : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700'}`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label block text-sm font-medium mb-2 text-blue-300">Nombre de positions souhaité</label>
            <input required type="number" min="1" className="form-control w-full bg-black/40 border-slate-700 text-white rounded-xl py-3" onChange={e => setFormData({...formData, positions: e.target.value})} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group">
              <label className="form-label block text-sm font-medium mb-2 text-blue-300">Email Professionnel</label>
              <input required type="email" className="form-control w-full bg-black/40 border-slate-700 text-white rounded-xl py-3" onChange={e => setFormData({...formData, mail: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label block text-sm font-medium mb-2 text-blue-300">Téléphone (WhatsApp)</label>
              <input required type="tel" className="form-control w-full bg-black/40 border-slate-700 text-white rounded-xl py-3" onChange={e => setFormData({...formData, telephone: e.target.value})} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label block text-sm font-medium mb-2 text-blue-300">Message (spécifications techniques)</label>
            <textarea className="form-control w-full bg-black/40 border-slate-700 text-white rounded-xl py-3" rows="3" onChange={e => setFormData({...formData, message: e.target.value})} placeholder="Détaillez votre projet..."></textarea>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all transform active:scale-95 ${loading ? 'bg-slate-700 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-xl shadow-blue-500/20'}`}
          >
            {loading ? 'Envoi en cours...' : 'Envoyer la demande de partenariat'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}


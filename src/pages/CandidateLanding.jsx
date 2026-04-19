import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mic, Camera, MapPin, CheckCircle, Send, User, Mail, Phone, ChevronRight } from 'lucide-react';
import sql from '../lib/db';

export default function CandidateLanding() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ nom: '', prenom: '', mail: '', telephone: '', adresse: '', langues: [] });
  const [selfie, setSelfie] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingResult, setRecordingResult] = useState('');
  const [loading, setLoading] = useState(false);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const availableLanguages = ['Français', 'Anglais', 'Arabe', 'Espagnol'];

  const toggleLanguage = (l) => {
    setFormData(prev => {
      const arr = prev.langues;
      if (arr.includes(l)) return { ...prev, langues: arr.filter(x => x !== l) };
      return { ...prev, langues: [...arr, l] };
    });
  };

  const autoLocate = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setFormData({ ...formData, adresse: `Lat: ${position.coords.latitude}, Lng: ${position.coords.longitude}` });
      });
    }
  };

  const simulateAIChat = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      setRecordingResult("Transcription de l'IA: Candidat motivé avec une formation en relation client. Maîtrise des outils CRM et excellente élocution. Prêt à intégrer une équipe dynamique.");
    }, 3000);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      console.error(err);
    }
  };

  const takeSelfie = () => {
    if (videoRef.current && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0, 320, 240);
      const dataUrl = canvasRef.current.toDataURL('image/png');
      setSelfie(dataUrl);
      const stream = videoRef.current.srcObject;
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
    }
  };

  const submitCandidate = async () => {
    setLoading(true);
    const scoreTest = Math.floor(Math.random() * 40) + 60; // Random score 60-100
    
    try {
      // Save to Neon
      await sql`
        INSERT INTO candidates (prenom, nom, mail, telephone, adresse, langues, ai_transcription, selfie, test_score)
        VALUES (
          ${formData.prenom},
          ${formData.nom},
          ${formData.mail},
          ${formData.telephone},
          ${formData.adresse},
          ${formData.langues},
          ${recordingResult},
          ${selfie},
          ${scoreTest}
        )
      `;

      // WhatsApp Logic
      const whatsappNumber = '33745200376';
      const text = `*Nouvelle Candidature (Growth Partners)*\n\n` +
                   `• *Candidat:* ${formData.prenom} ${formData.nom}\n` +
                   `• *Email:* ${formData.mail}\n` +
                   `• *Tél:* ${formData.telephone}\n` +
                   `• *Langues:* ${formData.langues.join(', ')}\n` +
                   `• *Score Test:* ${scoreTest}%\n` +
                   `• *Message IA:* ${recordingResult.substring(0, 100)}...`;

      const encodedText = encodeURIComponent(text);
      window.open(`https://wa.me/${whatsappNumber}?text=${encodedText}`, '_blank');

      alert("Candidature envoyée avec succès! " + (scoreTest >= 80 ? "Vous avez réussi le test avec " + scoreTest + "% ! Vous allez être redirigé vers l'agenda." : "Votre score au test est de " + scoreTest + "%. Un recruteur vous contactera."));
      
      if (scoreTest >= 80) window.location.href = "https://calendly.com/";
      else setStep(1);

    } catch (error) {
      console.error('Error saving candidate:', error);
      alert("Erreur lors de l'envoi. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)', color: 'white' }} className="container px-4">
      <motion.div 
        initial={{y: 20, opacity:0}} 
        animate={{y:0, opacity:1}} 
        className="premium-card" 
        style={{ 
          maxWidth: '800px', 
          margin: '0 auto', 
          padding: '2.5rem',
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(12px)',
          borderRadius: '30px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              Devenir Collaborateur Elite
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <User className="absolute left-3 top-3.5 text-slate-500" size={20} />
                <input type="text" placeholder="Prénom" className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-10 focus:ring-2 focus:ring-blue-500 outline-none transition-all" onChange={e => setFormData({...formData, prenom:e.target.value})} />
              </div>
              <div className="relative">
                <User className="absolute left-3 top-3.5 text-slate-500" size={20} />
                <input type="text" placeholder="Nom" className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-10 focus:ring-2 focus:ring-blue-500 outline-none transition-all" onChange={e => setFormData({...formData, nom:e.target.value})} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 text-slate-500" size={20} />
                <input type="email" placeholder="Email" className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-10 focus:ring-2 focus:ring-blue-500 outline-none transition-all" onChange={e => setFormData({...formData, mail:e.target.value})} />
              </div>
              <div className="relative">
                <Phone className="absolute left-3 top-3.5 text-slate-500" size={20} />
                <input type="tel" placeholder="Téléphone" className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-10 focus:ring-2 focus:ring-blue-500 outline-none transition-all" onChange={e => setFormData({...formData, telephone:e.target.value})} />
              </div>
            </div>

            <div className="flex gap-4" style={{ alignItems: 'center' }}>
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-3.5 text-slate-500" size={20} />
                <input type="text" placeholder="Adresse" className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-10 focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={formData.adresse} onChange={e => setFormData({...formData, adresse:e.target.value})} />
              </div>
              <button className="bg-blue-600 hover:bg-blue-500 p-3 rounded-xl transition-all shadow-lg shadow-blue-500/20" onClick={autoLocate}><MapPin size={24} /></button>
            </div>
            
            <div className="pt-4">
              <h3 className="text-sm font-semibold text-slate-400 mb-4 uppercase tracking-wider">Langues Maîtrisées</h3>
              <div className="flex flex-wrap gap-4">
                {availableLanguages.map(l => (
                  <label key={l} className="flex items-center space-x-2 cursor-pointer group">
                    <input type="checkbox" className="w-5 h-5 rounded border-slate-700 bg-slate-800 checked:bg-blue-600 transition-all" onChange={() => toggleLanguage(l)} /> 
                    <span className="text-slate-300 group-hover:text-white transition-colors">{l}</span>
                  </label>
                ))}
              </div>
            </div>

            <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-blue-900/30 transition-all transform hover:scale-[1.02]" onClick={() => setStep(2)}>
              Suivant: Entretien IA <ChevronRight size={20} />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">Entretien Assisté par IA</h2>
              <p className="text-slate-400 max-w-md mx-auto">Parlez naturellement. L'IA va analyser vos compétences, vos diplômes et vos expériences passées.</p>
            </div>
            
            <div className="flex justify-center">
              <button 
                className={`w-32 h-32 rounded-full flex items-center justify-center transition-all ${isRecording ? 'bg-red-500 animate-pulse scale-110 shadow-2xl shadow-red-500/50' : 'bg-blue-600 hover:bg-blue-500 shadow-xl shadow-blue-500/20'}`} 
                onClick={simulateAIChat}
              >
                <Mic size={48} />
              </button>
            </div>
            
            {recordingResult && (
              <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="bg-slate-900/80 border border-slate-700 p-6 rounded-2xl text-left">
                <div className="text-blue-400 text-xs font-bold mb-2 uppercase tracking-tight">Transcription de l'analyse IA</div>
                <p className="text-slate-200 italic">"{recordingResult}"</p>
              </motion.div>
            )}

            <div className="flex gap-4 pt-4">
              <button className="flex-1 bg-slate-800 hover:bg-slate-700 py-4 rounded-xl font-bold transition-all" onClick={() => setStep(1)}>Retour</button>
              {recordingResult && (
                <button className="flex-2 bg-blue-600 hover:bg-blue-500 py-4 px-8 rounded-xl font-bold transition-all" onClick={() => { setStep(3); startCamera(); }}>
                  Suivant: Selfie Photo
                </button>
              )}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-emerald-400">Dernière Étape</h2>
              <p className="text-slate-400">Un selfie est nécessaire pour votre dossier agent et la génération automatique de votre badge.</p>
            </div>
            
            <div className="relative inline-block overflow-hidden rounded-3xl border-4 border-slate-800 shadow-2xl">
              {!selfie ? (
                <div className="relative">
                  <video ref={videoRef} autoPlay className="w-[320px] h-[240px] object-cover bg-black"></video>
                  <div className="absolute inset-0 border-2 border-dashed border-white/20 pointer-events-none m-4 rounded-2xl"></div>
                </div>
              ) : (
                <motion.div initial={{scale:0.95}} animate={{scale:1}}>
                  <img src={selfie} alt="Selfie" className="w-[320px] h-[240px] object-cover" />
                  <div className="absolute top-4 right-4 bg-emerald-500 p-2 rounded-full shadow-lg">
                    <CheckCircle size={20} />
                  </div>
                </motion.div>
              )}
            </div>

            <div className="flex justify-center gap-4">
              {!selfie ? (
                <button className="bg-white text-slate-900 py-3 px-8 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-100 transition-all" onClick={takeSelfie}>
                  <Camera size={20} /> Capturer le Selfie
                </button>
              ) : (
                <button className="bg-slate-800 text-white py-3 px-8 rounded-xl font-bold hover:bg-slate-700 transition-all" onClick={() => setSelfie(null)}>
                  Reprendre la photo
                </button>
              )}
            </div>
            
            <canvas ref={canvasRef} width="320" height="240" style={{ display: 'none' }}></canvas>

            <div className="pt-8 border-t border-slate-800">
              <p className="text-xs text-red-400 mb-6 font-medium italic">
                * En cliquant sur "Envoyer", vous confirmez l'exactitude des informations fournies et la validité de votre identité.
              </p>
              <button 
                disabled={!selfie || loading} 
                onClick={submitCandidate}
                className={`w-full py-5 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 transition-all ${!selfie || loading ? 'bg-slate-800 text-slate-500 grayscale' : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-900/20 active:scale-95'}`}
              >
                {loading ? 'Traitement en cours...' : (
                  <>
                    <Send size={24} /> Passer le Test & Soumettre
                  </>
                )}
              </button>
            </div>
          </div>
        )}

      </motion.div>
    </div>
  );
}

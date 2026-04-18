import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mic, Camera, MapPin, CheckCircle } from 'lucide-react';

export default function CandidateLanding() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ nom: '', prenom: '', mail: '', telephone: '', adresse: '', langues: [] });
  const [diplomas, setDiplomas] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [selfie, setSelfie] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingResult, setRecordingResult] = useState('');
  
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
      setRecordingResult("Transcription de l'IA: J'ai un master en informatique obtenu en 2020... J'ai travaillé 3 ans comme développeur front-end.");
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
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  const submitCandidate = () => {
    const scoreTest = Math.floor(Math.random() * 40) + 60; // Random score 60-100
    const candidateData = {
      ...formData,
      selfie,
      aiTranscription: recordingResult,
      testScore: scoreTest,
      id: Date.now(),
      date: new Date().toISOString()
    };
    const candidates = JSON.parse(localStorage.getItem('gp_candidates') || '[]');
    candidates.push(candidateData);
    localStorage.setItem('gp_candidates', JSON.stringify(candidates));

    alert("Candidature envoyée avec succès! " + (scoreTest >= 80 ? "Vous avez réussi le test avec " + scoreTest + "% ! Vous allez être redirigé vers l'agenda." : "Votre score au test est de " + scoreTest + "%. Veuillez réessayer dans 24h."));
    if (scoreTest >= 80) window.location.href = "https://calendly.com/"; // Redirect example
    else setStep(1);
  };

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh' }} className="container">
      <motion.div initial={{y: 20, opacity:0}} animate={{y:0, opacity:1}} className="premium-card" style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem' }}>
        
        {step === 1 && (
          <div>
            <h2 className="section-title">Informations de base</h2>
            <div className="flex gap-4 mt-4">
              <input type="text" placeholder="Prénom" className="form-control" onChange={e => setFormData({...formData, prenom:e.target.value})} />
              <input type="text" placeholder="Nom" className="form-control" onChange={e => setFormData({...formData, nom:e.target.value})} />
            </div>
            <div className="flex gap-4 mt-4">
              <input type="email" placeholder="Email" className="form-control" onChange={e => setFormData({...formData, mail:e.target.value})} />
              <input type="tel" placeholder="Téléphone" className="form-control" onChange={e => setFormData({...formData, telephone:e.target.value})} />
            </div>
            <div className="flex gap-4 mt-4" style={{ alignItems: 'center' }}>
              <input type="text" placeholder="Adresse" className="form-control" value={formData.adresse} onChange={e => setFormData({...formData, adresse:e.target.value})} />
              <button className="btn-primary" onClick={autoLocate} style={{ padding: '0.75rem' }}><MapPin size={24} /></button>
            </div>
            
            <h3 className="mt-4 mb-4">Langues Parlées</h3>
            <div className="flex gap-4">
              {availableLanguages.map(l => (
                <label key={l}><input type="checkbox" onChange={() => toggleLanguage(l)} /> {l}</label>
              ))}
            </div>

            <button className="btn-primary mt-4" onClick={() => setStep(2)}>Suivant (Entretien IA)</button>
          </div>
        )}

        {step === 2 && (
          <div className="recording-container">
            <h2 className="section-title">Entretien par IA</h2>
            <p className="mb-4 text-center">Un assistant IA va maintenant vous poser des questions. Cliquez sur le micro pour enregistrer vos réponses (Diplômes, Expériences, Certificats, Loisirs).</p>
            
            <button className={`mic-btn ${isRecording ? 'recording' : ''}`} onClick={simulateAIChat}>
              <Mic size={40} />
            </button>
            
            {recordingResult && (
              <div className="mt-4" style={{ background: 'var(--color-gray)', padding: '1rem', borderRadius: '10px', textAlign: 'left' }}>
                <strong>Transcription générée:</strong> <br/>
                {recordingResult}
              </div>
            )}

            <div className="mt-8 flex gap-4 justify-center">
              <button className="btn-primary" onClick={() => setStep(1)} style={{ background: 'grey' }}>Retour</button>
              {recordingResult && <button className="btn-primary" onClick={() => { setStep(3); startCamera(); }}>Suivant (Selfie)</button>}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center">
            <h2 className="section-title">Dernière étape: Selfie</h2>
            <p className="mb-4">Votre photo sera attachée en haut à gauche du CV généré.</p>
            
            {!selfie ? (
              <>
                <video ref={videoRef} autoPlay style={{ width: '320px', height: '240px', background: '#000', margin: '0 auto' }}></video>
                <div className="mt-4">
                  <button className="btn-primary" onClick={takeSelfie}><Camera className="mr-2" /> Prendre la photo</button>
                </div>
              </>
            ) : (
              <div>
                <img src={selfie} alt="Selfie" style={{ width: '320px', borderRadius: '10px' }} />
                <p className="mt-4 text-success flex justify-center gap-2" style={{ color: 'green' }}><CheckCircle /> Selfie capturé</p>
              </div>
            )}
            
            <canvas ref={canvasRef} width="320" height="240" style={{ display: 'none' }}></canvas>

            <div className="mt-8">
              <p className="mb-4" style={{ fontSize: '0.9rem', color: 'red' }}>Note: Le CV formaté généré par l'IA ne vous est pas fourni gratuitement. Vous devez payer si vous souhaitez le télécharger après envoi.</p>
              <button className="btn-primary" disabled={!selfie} onClick={submitCandidate}>Passer le Test & Envoyer Candidature</button>
            </div>
          </div>
        )}

      </motion.div>
    </div>
  );
}

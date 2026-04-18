import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import WhatsAppBubble from './components/WhatsAppBubble';
import Home from './pages/Home';
import PartnerLanding from './pages/PartnerLanding';
import CandidateLanding from './pages/CandidateLanding';
import AdminDashboard from './pages/AdminDashboard';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/partenariat" element={<PartnerLanding />} />
          <Route path="/candidat" element={<CandidateLanding />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
        <WhatsAppBubble />
      </div>
    </BrowserRouter>
  );
}

export default App;

import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppBubble() {
  const handleClick = () => {
    window.open('https://wa.me/213799909096', '_blank');
  };

  return (
    <div className="whatsapp-bubble" onClick={handleClick} style={{ cursor: 'pointer' }}>
      <MessageCircle size={32} />
    </div>
  );
}

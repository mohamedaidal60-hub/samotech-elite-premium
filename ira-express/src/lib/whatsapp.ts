const WHATSAPP_NUMBER = "213697216081";

export const sendWhatsAppMessage = (message: string) => {
  const encoded = encodeURIComponent(message);
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`, "_blank");
};

export const buildOrderMessage = (
  service: string,
  name: string,
  phone: string,
  address: string,
  items: string,
  quantity: number
) => {
  return `🚀 *Nouvelle Commande IRA EXPRESS*
━━━━━━━━━━━━━━━━━━
📦 *Service:* ${service}
👤 *Nom:* ${name}
📱 *Téléphone:* ${phone}
📍 *Adresse:* ${address}
🛒 *Articles:* ${items}
🔢 *Quantité:* ${quantity}
━━━━━━━━━━━━━━━━━━
_Merci de votre confiance !_`;
};

export const openWhatsAppChat = () => {
  window.open(`https://wa.me/${WHATSAPP_NUMBER}`, "_blank");
};

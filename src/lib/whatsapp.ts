export const WHATSAPP_NUMBER = "213563946389";

export interface LeadPayload {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service: string;
  budget?: string;
  timeline?: string;
  description?: string;
  language?: string;
}

export const buildWhatsAppMessage = (lead: LeadPayload): string => {
  const lines = [
    "🚀 *Nouvelle demande SamoTech*",
    "",
    `👤 ${lead.name}`,
    `✉️ ${lead.email}`,
  ];
  if (lead.phone) lines.push(`📱 ${lead.phone}`);
  if (lead.company) lines.push(`🏢 ${lead.company}`);
  lines.push("", `🎯 Service : ${lead.service}`);
  if (lead.budget) lines.push(`💰 Budget : ${lead.budget}`);
  if (lead.timeline) lines.push(`⏱️ Délai : ${lead.timeline}`);
  if (lead.language) lines.push(`🌐 Langue : ${lead.language.toUpperCase()}`);
  if (lead.description) {
    lines.push("", "📝 *Détails :*", lead.description);
  }
  return lines.join("\n");
};

export const buildWhatsAppUrl = (lead: LeadPayload): string => {
  const text = encodeURIComponent(buildWhatsAppMessage(lead));
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
};

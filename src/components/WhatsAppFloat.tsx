import { useEffect, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { WHATSAPP_NUMBER } from "@/lib/whatsapp";

const WhatsAppFloat = () => {
  const { t, language } = useLanguage();
  const [bubbleOpen, setBubbleOpen] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShown(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const greetings: Record<string, string> = {
    fr: "Bonjour 👋 Une question ? Discutons sur WhatsApp.",
    en: "Hi 👋 Got a question? Let's chat on WhatsApp.",
    ar: "مرحبًا 👋 لديك سؤال؟ لنتحدث عبر واتساب.",
  };

  const defaultMsg = encodeURIComponent(
    language === "ar"
      ? "مرحبًا SamoTech، أرغب في معرفة المزيد عن خدماتكم."
      : language === "en"
      ? "Hi SamoTech, I'd like to know more about your services."
      : "Bonjour SamoTech, j'aimerais en savoir plus sur vos services."
  );
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${defaultMsg}`;

  if (!shown) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3" dir="ltr">
      {bubbleOpen && (
        <div className="glass-card-glow max-w-[260px] p-4 rounded-2xl rounded-br-sm animate-scroll-fade visible shadow-elegant">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="text-xs font-bold gradient-text">SamoTech Support</div>
            <button
              onClick={() => setBubbleOpen(false)}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Close"
            >
              <X size={14} />
            </button>
          </div>
          <p className="text-sm text-foreground mb-3">{greetings[language] ?? greetings.fr}</p>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center bg-[#25D366] hover:bg-[#1ebe5a] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
          >
            {t("whatsapp.float")}
          </a>
        </div>
      )}

      <button
        onClick={() => setBubbleOpen((v) => !v)}
        className="relative bg-[#25D366] hover:bg-[#1ebe5a] text-white w-14 h-14 rounded-full shadow-elegant flex items-center justify-center transition-all hover:scale-110 animate-pulse-gold"
        aria-label={t("whatsapp.float")}
        style={{ boxShadow: "0 8px 30px rgba(37, 211, 102, 0.45)" }}
      >
        <MessageCircle size={26} fill="white" />
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#25D366]" />
        </span>
      </button>
    </div>
  );
};

export default WhatsAppFloat;

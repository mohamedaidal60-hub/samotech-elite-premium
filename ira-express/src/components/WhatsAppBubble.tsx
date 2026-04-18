import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { openWhatsAppChat } from "@/lib/whatsapp";

const WhatsAppBubble = () => (
  <motion.button
    onClick={openWhatsAppChat}
    className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-[#25D366] text-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ delay: 1, type: "spring" }}
    whileHover={{ rotate: 15 }}
    aria-label="Contacter via WhatsApp"
  >
    <MessageCircle className="w-8 h-8" />
  </motion.button>
);

export default WhatsAppBubble;

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Sparkles, User, Bot, Loader2, Minimize2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Chatbot = () => {
  const { t, dir } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState([
    { 
      role: "bot", 
      text: "Bonjour ! Je suis l'intelligence artificielle de SamoTech. Je peux vous aider à choisir un pack ou répondre à vos questions sur le marketing digital. Que souhaitez-vous faire ?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { 
      role: "user", 
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Dynamic Logic
    setTimeout(() => {
      let response = "";
      const lowInput = input.toLowerCase();

      if (lowInput.includes("pack") || lowInput.includes("prix") || lowInput.includes("offre")) {
        response = "Nous avons plusieurs offres d'élite : le Pack SamoTech (le plus complet), le Pack Visibilité, et le Pack SamoTech UGC. Lequel correspond le mieux à vos objectifs actuels ?";
      } else if (lowInput.includes("pub") || lowInput.includes("meta") || lowInput.includes("facebook")) {
        response = "Nos experts Meta Ads gèrent des budgets de plusieurs millions de DZD. Nous optimisons chaque centime pour un ROI maximal. Souhaitez-vous une analyse de vos campagnes actuelles ?";
      } else if (lowInput.includes("site") || lowInput.includes("dev") || lowInput.includes("web")) {
        response = "Nous développons des plateformes robustes (Vite, React, Next.js) connectées à des bases de données ultra-rapides. Vous avez besoin d'une vitrine ou d'un ERP complet ?";
      } else if (lowInput.includes("merci") || lowInput.includes("ok")) {
        response = "C'est un plaisir ! Je reste à votre disposition. Voulez-vous que je vous mette en relation avec un de nos conseillers humains ?";
      } else {
        response = "C'est une excellente question. Chez SamoTech, nous abordons chaque projet avec une approche personnalisée. Pouvez-vous me dire quel est votre secteur d'activité ?";
      }

      setMessages(prev => [...prev, { 
        role: "bot", 
        text: response,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className={`fixed bottom-6 ${dir === 'rtl' ? 'left-6' : 'right-6'} z-[60]`}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 50, scale: 0.9, filter: "blur(10px)" }}
            className="mb-4 w-[350px] sm:w-[420px] h-[600px] glass-card rounded-[2.5rem] border-white/10 shadow-2xl overflow-hidden flex flex-col backdrop-blur-3xl"
          >
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-primary/20 to-secondary/20 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl gradient-bg flex items-center justify-center shadow-glow">
                    <Sparkles size={24} className="text-white animate-pulse" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-4 border-[#020617]" />
                </div>
                <div>
                  <h3 className="text-white font-black text-base">SamoBot AI</h3>
                  <p className="text-[10px] text-primary font-bold uppercase tracking-widest">Expert Digital Élite</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setIsOpen(false)} className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground transition-colors">
                  <Minimize2 size={18} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div 
              ref={scrollRef}
              className="flex-grow overflow-y-auto p-6 space-y-6 scroll-smooth bg-white/[0.01]"
            >
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${msg.role === 'bot' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'}`}>
                      {msg.role === 'bot' ? <Bot size={16} /> : <User size={16} />}
                    </div>
                    <div>
                      <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'bot' ? 'bg-white/5 border border-white/10 rounded-tl-none' : 'gradient-bg text-white rounded-tr-none shadow-glow'}`}>
                        {msg.text}
                      </div>
                      <div className={`text-[10px] mt-1 text-muted-foreground font-medium ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                        {msg.time}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none">
                    <Loader2 size={16} className="text-primary animate-spin" />
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-5 bg-white/[0.02] border-t border-white/5">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Écrivez ici..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-5 pr-14 text-sm focus:outline-none focus:border-primary/50 transition-all focus:bg-white/10"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <button 
                  type="submit"
                  disabled={!input.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-white shadow-glow disabled:opacity-50 disabled:grayscale transition-all hover:scale-110 active:scale-95"
                >
                  <Send size={18} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-18 h-18 rounded-[2rem] gradient-bg flex items-center justify-center shadow-glow text-white border border-white/20 relative z-10"
      >
        <div className="w-16 h-16 rounded-[1.8rem] flex items-center justify-center">
          {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
        </div>
        {!isOpen && (
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full border-4 border-[#020617] flex items-center justify-center text-[10px] font-black"
          >
            1
          </motion.div>
        )}
      </motion.button>
    </div>
  );
};

export default Chatbot;

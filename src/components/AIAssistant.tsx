import { useState, useRef, useEffect } from "react";
import { Bot, User, Send, RotateCcw, CheckCircle2, Edit3, MessageCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { insertLead } from "@/lib/api";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Msg {
  role: "assistant" | "user";
  content: string;
}

const openers: Record<string, string> = {
  fr: "Bonjour ! Je suis l'assistant SamoTech 🚀. Je vais vous poser quelques questions simples pour bien cadrer votre projet. Pour commencer : quel est votre prénom et que faites-vous (entreprise / activité) ?",
  en: "Hello! I'm the SamoTech AI assistant 🚀. I'll ask you a few simple questions to scope your project. To start: what's your first name and what do you do (business / activity)?",
  ar: "مرحبًا! أنا مساعد SamoTech الذكي 🚀. سأطرح عليك بعض الأسئلة البسيطة لتأطير مشروعك. للبدء: ما اسمك وما طبيعة نشاطك (شركة / مجال)؟",
};

const AIAssistant = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Msg[]>([{ role: "assistant", content: openers[language] }]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [phase, setPhase] = useState<"chat" | "review">("chat");
  const [summary, setSummary] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: "",
    budget: "",
    timeline: "",
    project_summary: "",
  });
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);

  // Re-set opener if language changes mid-chat
  useEffect(() => {
    if (messages.length === 1) {
      setMessages([{ role: "assistant", content: openers[language] }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  const send = async () => {
    if (!input.trim() || thinking) return;
    const userMsg: Msg = { role: "user", content: input.trim() };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setThinking(true);

    try {
      // Local state machine for AI assistant mock
      let reply = "";
      let finished = false;
      let extracted = null;
      
      const step = messages.filter(m => m.role === "assistant").length;

      if (step === 1) {
        reply = language === "ar" 
          ? "سررت بلقائك! ما نوع الخدمة التي تبحث عنها (موقع ويب، تطبيق، إعلانات...) وما هي ميزانيتك التقريبية؟" 
          : language === "en"
          ? "Nice to meet you! What kind of service are you looking for (website, app, ads...) and what is your approximate budget?"
          : "Enchanté ! Quel type de service cherchez-vous (site web, application, publicité...) et quel est votre budget approximatif ?";
      } else if (step === 2) {
        reply = language === "ar"
          ? "ممتاز. هل لديك إطار زمني محدد لإنجاز هذا المشروع؟"
          : language === "en"
          ? "Perfect. Do you have a specific timeline for this project?"
          : "Parfait. Avez-vous une idée du délai souhaité pour la réalisation de ce projet ?";
      } else {
        reply = language === "ar"
          ? "شكرًا لك! لقد جمعت المعلومات. يرجى مراجعتها أدناه."
          : language === "en"
          ? "Thank you! I have gathered the information. Please review it below."
          : "Merci ! J'ai bien noté toutes les informations. Voici un résumé à vérifier.";
        finished = true;
        extracted = {
          name: messages[1]?.content.split(" ")[0] || "Client",
          email: "",
          phone: "",
          company: "",
          service: "À définir",
          budget: "À définir",
          timeline: "À définir",
          project_summary: messages.map(m => m.content).join("\n"),
        };
      }

      setTimeout(() => {
        setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
        if (finished && extracted) {
          setSummary((s) => ({ ...s, ...extracted }));
          setPhase("review");
        }
        setThinking(false);
      }, 1000);

    } catch (err) {
      console.error(err);
      toast({
        title: t("contact.error.title"),
        description: t("contact.error.desc"),
        variant: "destructive",
      });
      setThinking(false);
    }
  };

  const restart = () => {
    setMessages([{ role: "assistant", content: openers[language] }]);
    setPhase("chat");
    setSummary({ name: "", email: "", phone: "", company: "", service: "", budget: "", timeline: "", project_summary: "" });
  };

  const validate = async () => {
    if (!summary.name || !summary.email) {
      toast({ title: t("contact.error.title"), description: t("common.required"), variant: "destructive" });
      return;
    }
    try {
      await insertLead({
        name: summary.name,
        email: summary.email,
        phone: summary.phone || null,
        company: summary.company || null,
        service: summary.service || "AI Assistant",
        budget: summary.budget || null,
        timeline: summary.timeline || null,
        project_summary: summary.project_summary || null,
        ai_transcript: messages,
        raw_message: summary.project_summary || null,
        language,
        source: "ai-assistant",
      });
    } catch (err) {
      toast({ title: t("contact.error.title"), description: t("contact.error.desc"), variant: "destructive" });
      return;
    }
    toast({ title: t("contact.success.title"), description: t("contact.success.desc") });
    const url = buildWhatsAppUrl({
      ...summary,
      description: summary.project_summary,
      language,
    });
    window.open(url, "_blank");
    restart();
  };

  if (phase === "review") {
    const fields: Array<{ key: keyof typeof summary; label: string; type?: string; textarea?: boolean }> = [
      { key: "name", label: t("contact.name.label") + " *" },
      { key: "email", label: t("contact.email.label") + " *", type: "email" },
      { key: "phone", label: t("contact.phone.label") },
      { key: "company", label: t("contact.company.label") },
      { key: "service", label: t("contact.service.label") },
      { key: "budget", label: t("contact.budget.label") },
      { key: "timeline", label: t("contact.timeline.label") },
      { key: "project_summary", label: t("contact.description.label"), textarea: true },
    ];

    return (
      <div className="max-w-2xl mx-auto animate-scroll-fade">
        <div className="glass-card-glow rounded-2xl p-6 sm:p-10">
          <div className="flex items-center gap-3 mb-2">
            <Edit3 size={20} className="text-accent" />
            <h3 className="text-xl font-bold">{t("ai.transcript")}</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-6">{t("ai.transcript.subtitle")}</p>

          <div className="space-y-4">
            {fields.map((f) => (
              <div key={f.key}>
                <label className="text-sm font-medium mb-1.5 block">{f.label}</label>
                {f.textarea ? (
                  <Textarea
                    value={summary[f.key]}
                    onChange={(e) => setSummary({ ...summary, [f.key]: e.target.value })}
                    className="min-h-[100px]"
                  />
                ) : (
                  <Input
                    type={f.type ?? "text"}
                    value={summary[f.key]}
                    onChange={(e) => setSummary({ ...summary, [f.key]: e.target.value })}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <button
              onClick={validate}
              className="gradient-bg flex-1 px-6 py-3 rounded-xl text-sm font-semibold text-primary-foreground flex items-center justify-center gap-2 hover:opacity-90 transition-all"
            >
              <CheckCircle2 size={16} /> {t("ai.validate")}
            </button>
            <button
              onClick={restart}
              className="glass-card px-6 py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:scale-105 transition-all"
            >
              <RotateCcw size={16} /> {t("ai.restart")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-scroll-fade">
      <div className="glass-card-glow rounded-2xl overflow-hidden flex flex-col" style={{ height: "560px" }}>
        <div className="flex items-center gap-3 p-4 border-b border-border/40 bg-gradient-to-r from-primary/10 to-secondary/10">
          <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center animate-pulse-glow">
            <Bot size={18} className="text-primary-foreground" />
          </div>
          <div>
            <div className="font-bold text-sm">{t("ai.title")}</div>
            <div className="text-xs text-muted-foreground">{t("ai.subtitle")}</div>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              {m.role === "assistant" && (
                <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center shrink-0">
                  <Bot size={14} className="text-primary-foreground" />
                </div>
              )}
              <div
                className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm whitespace-pre-wrap ${
                  m.role === "user"
                    ? "gradient-bg-soft text-primary-foreground rounded-br-sm"
                    : "glass-card rounded-bl-sm"
                }`}
              >
                {m.content}
              </div>
              {m.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <User size={14} />
                </div>
              )}
            </div>
          ))}
          {thinking && (
            <div className="flex gap-2 justify-start">
              <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center shrink-0">
                <Bot size={14} className="text-primary-foreground" />
              </div>
              <div className="glass-card px-4 py-2.5 rounded-2xl rounded-bl-sm text-sm">
                <span className="inline-flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.15s" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.3s" }} />
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="p-3 border-t border-border/40 flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), send())}
            placeholder={t("ai.placeholder")}
            disabled={thinking}
          />
          <button
            onClick={send}
            disabled={thinking || !input.trim()}
            className="gradient-bg p-2.5 rounded-lg text-primary-foreground hover:opacity-90 transition-all disabled:opacity-40"
            aria-label={t("ai.send")}
          >
            <Send size={16} />
          </button>
        </div>
      </div>

      <div className="text-center mt-4">
        <button onClick={restart} className="text-xs text-muted-foreground hover:text-primary inline-flex items-center gap-1">
          <RotateCcw size={12} /> {t("ai.restart")}
        </button>
      </div>
    </div>
  );
};

export default AIAssistant;

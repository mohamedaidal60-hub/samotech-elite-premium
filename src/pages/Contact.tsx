import { useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, ChevronRight, Send, Bot, FormInput, MessageCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { insertLead } from "@/lib/api";
import { buildWhatsAppUrl, WHATSAPP_NUMBER } from "@/lib/whatsapp";
import AIAssistant from "@/components/AIAssistant";
import { z } from "zod";

const serviceOptionsByLang = {
  fr: [
    "Publicité — Stratégie & production",
    "Publicité — Production créative",
    "Publicité — Génération de leads",
    "Application web ou mobile sur mesure",
    "Site vitrine",
    "E-commerce sur mesure",
    "Système interne (ERP / CRM)",
    "Automatisation de processus",
    "Infrastructure (hébergement, domaine, email)",
  ],
  en: [
    "Advertising — Strategy & production",
    "Advertising — Creative production",
    "Advertising — Lead generation",
    "Custom web or mobile application",
    "Showcase website",
    "Custom e-commerce platform",
    "Internal system (ERP / CRM)",
    "Process automation",
    "Infrastructure (hosting, domain, email)",
  ],
  ar: [
    "الإعلانات — الاستراتيجية والإنتاج",
    "الإعلانات — الإنتاج الإبداعي",
    "الإعلانات — توليد العملاء المحتملين",
    "تطبيق ويب أو موبايل مخصص",
    "موقع تعريفي",
    "متجر إلكتروني مخصص",
    "نظام داخلي (ERP / CRM)",
    "أتمتة العمليات",
    "البنية التحتية (استضافة، نطاق، بريد)",
  ],
};

const budgetOptions = ["< 500 000 DZD", "500 000 – 1 500 000 DZD", "1 500 000 – 5 000 000 DZD", "5 000 000 DZD+"];
const timelineOptions = {
  fr: ["Urgent", "1–2 semaines", "1 mois", "2–3 mois", "Flexible"],
  en: ["Urgent", "1–2 weeks", "1 month", "2–3 months", "Flexible"],
  ar: ["عاجل", "1–2 أسبوع", "شهر", "2–3 أشهر", "مرن"],
};

const leadSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(40).optional(),
  company: z.string().trim().max(120).optional(),
});

const Contact = () => {
  const ref = useScrollReveal<HTMLElement>();
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const [mode, setMode] = useState<"form" | "ai">("form");
  const [step, setStep] = useState(0);
  const [services, setServices] = useState<string[]>([]);
  const [details, setDetails] = useState({ budget: "", timeline: "", description: "" });
  const [info, setInfo] = useState({ name: "", email: "", phone: "", company: "" });
  const [submitting, setSubmitting] = useState(false);

  const serviceOptions = serviceOptionsByLang[language];
  const timelines = timelineOptions[language];

  const toggleService = (s: string) =>
    setServices((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  const handleSubmit = async () => {
    const parsed = leadSchema.safeParse(info);
    if (!parsed.success) {
      toast({ title: t("contact.error.title"), description: t("common.required"), variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      await insertLead({
        name: info.name,
        email: info.email,
        phone: info.phone || null,
        company: info.company || null,
        service: services.join(" | "),
        budget: details.budget || null,
        timeline: details.timeline || null,
        project_summary: details.description || null,
        raw_message: details.description || null,
        language,
        source: "website-form",
      });
      setSubmitting(false);
    } catch (err) {
      setSubmitting(false);
      toast({ title: t("contact.error.title"), description: t("contact.error.desc"), variant: "destructive" });
      return;
    }
    toast({ title: t("contact.success.title"), description: t("contact.success.desc") });

    // Open WhatsApp prefilled
    const url = buildWhatsAppUrl({
      name: info.name,
      email: info.email,
      phone: info.phone,
      company: info.company,
      service: services.join(" | "),
      budget: details.budget,
      timeline: details.timeline,
      description: details.description,
      language,
    });
    window.open(url, "_blank");

    // reset
    setStep(0);
    setServices([]);
    setDetails({ budget: "", timeline: "", description: "" });
    setInfo({ name: "", email: "", phone: "", company: "" });
  };

  const canNext =
    step === 0
      ? services.length > 0
      : step === 1
      ? !!details.budget && !!details.timeline
      : !!info.name && !!info.email;

  return (
    <main ref={ref} className="pt-24 pb-16 min-h-screen cosmic-bg">
      <div className="container mx-auto px-6">
        <div className="text-center mb-10 animate-scroll-fade">
          <h1 className="text-4xl md:text-6xl font-black mb-4">
            {t("contact.title")} <span className="gradient-text">{t("contact.title.highlight")}</span>
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto">
            {t("contact.subtitle")}
          </p>
        </div>

        {/* Mode toggle */}
        <div className="flex justify-center gap-2 mb-8 animate-scroll-fade">
          <button
            onClick={() => setMode("form")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              mode === "form" ? "gradient-bg text-primary-foreground" : "glass-card text-foreground"
            }`}
          >
            <FormInput size={16} />
            {t("contact.form.toggle")}
          </button>
          <button
            onClick={() => setMode("ai")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              mode === "ai" ? "gradient-bg text-primary-foreground" : "glass-card text-foreground"
            }`}
          >
            <Bot size={16} />
            {t("contact.ai.toggle")}
          </button>
        </div>

        {mode === "ai" ? (
          <AIAssistant />
        ) : (
          <div className="max-w-2xl mx-auto animate-scroll-fade">
            <div className="flex items-center gap-2 mb-8 justify-center">
              {[t("contact.step.service"), t("contact.step.details"), t("contact.step.info")].map((label, i) => (
                <div key={label} className="flex items-center gap-2">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      i <= step ? "gradient-bg text-primary-foreground shadow-lg" : "glass-card text-muted-foreground"
                    }`}
                  >
                    {i + 1}
                  </div>
                  <span className={`text-sm hidden sm:block ${i <= step ? "text-foreground" : "text-muted-foreground"}`}>
                    {label}
                  </span>
                  {i < 2 && <div className={`w-6 sm:w-10 h-0.5 ${i < step ? "gradient-bg" : "bg-border"}`} />}
                </div>
              ))}
            </div>

            <div className="glass-card-glow rounded-2xl p-6 sm:p-10">
              {step === 0 && (
                <div>
                  <h3 className="text-xl font-bold mb-6 text-foreground">{t("contact.service.label")}</h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {serviceOptions.map((s) => (
                      <label
                        key={s}
                        className={`flex items-start gap-3 glass-card p-4 rounded-xl cursor-pointer transition-all hover:scale-[1.02] ${
                          services.includes(s) ? "border-primary/50 bg-primary/5" : ""
                        }`}
                      >
                        <Checkbox checked={services.includes(s)} onCheckedChange={() => toggleService(s)} />
                        <span className="text-sm text-foreground">{s}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold mb-2 text-foreground">{t("contact.step.details")}</h3>
                  <div>
                    <Label className="mb-2 block">{t("contact.budget.label")}</Label>
                    <Select value={details.budget} onValueChange={(v) => setDetails({ ...details, budget: v })}>
                      <SelectTrigger><SelectValue placeholder={t("contact.budget.placeholder")} /></SelectTrigger>
                      <SelectContent>
                        {budgetOptions.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="mb-2 block">{t("contact.timeline.label")}</Label>
                    <Select value={details.timeline} onValueChange={(v) => setDetails({ ...details, timeline: v })}>
                      <SelectTrigger><SelectValue placeholder={t("contact.timeline.placeholder")} /></SelectTrigger>
                      <SelectContent>
                        {timelines.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="mb-2 block">{t("contact.description.label")}</Label>
                    <Textarea
                      value={details.description}
                      onChange={(e) => setDetails({ ...details, description: e.target.value })}
                      placeholder={t("contact.description.placeholder")}
                      className="min-h-[120px]"
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-5">
                  <h3 className="text-xl font-bold mb-2 text-foreground">{t("contact.step.info")}</h3>
                  <div>
                    <Label className="mb-2 block">{t("contact.name.label")} *</Label>
                    <Input value={info.name} onChange={(e) => setInfo({ ...info, name: e.target.value })} />
                  </div>
                  <div>
                    <Label className="mb-2 block">{t("contact.email.label")} *</Label>
                    <Input type="email" value={info.email} onChange={(e) => setInfo({ ...info, email: e.target.value })} />
                  </div>
                  <div>
                    <Label className="mb-2 block">{t("contact.phone.label")}</Label>
                    <Input type="tel" value={info.phone} onChange={(e) => setInfo({ ...info, phone: e.target.value })} />
                  </div>
                  <div>
                    <Label className="mb-2 block">{t("contact.company.label")}</Label>
                    <Input value={info.company} onChange={(e) => setInfo({ ...info, company: e.target.value })} />
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center mt-10 gap-3">
                {step > 0 ? (
                  <button onClick={() => setStep(step - 1)} className="glass-card px-5 py-3 rounded-xl text-sm font-medium flex items-center gap-2 hover:scale-105 transition-all">
                    <ChevronLeft size={16} /> {t("common.back")}
                  </button>
                ) : <div />}

                {step < 2 ? (
                  <button
                    onClick={() => canNext && setStep(step + 1)}
                    disabled={!canNext}
                    className="gradient-bg px-6 py-3 rounded-xl text-sm font-semibold text-primary-foreground flex items-center gap-2 hover:opacity-90 transition-all disabled:opacity-40"
                  >
                    {t("common.next")} <ChevronRight size={16} />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={!canNext || submitting}
                    className="gradient-bg px-6 py-3 rounded-xl text-sm font-semibold text-primary-foreground flex items-center gap-2 hover:opacity-90 transition-all disabled:opacity-40"
                  >
                    {submitting ? t("common.loading") : t("common.submit")} <Send size={16} />
                  </button>
                )}
              </div>
            </div>

            <div className="text-center mt-6">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
              >
                <MessageCircle size={14} /> +213 5 63 94 63 89
              </a>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Contact;

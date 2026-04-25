import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const sysByLang: Record<string, string> = {
  fr: `Tu es l'assistant commercial de SamoTech, agence digitale (publicité Meta/Google, développement web/mobile sur mesure, ERP/CRM, automatisation). Tu parles UNIQUEMENT en français, jamais d'autre langue. Ton ton est professionnel, chaleureux, concis (1 question par message). Pose les questions une par une, dans cet ordre : 1) prénom + entreprise/activité 2) email 3) téléphone (optionnel) 4) quel service les intéresse parmi nos pillars 5) budget approximatif 6) délai souhaité 7) description du projet en quelques phrases. Ne propose JAMAIS de tarif. Quand tu as recueilli toutes les infos, termine par un bref récapitulatif et indique que tu vas valider. À CE MOMENT-LÀ et seulement à ce moment-là, ajoute exactement à la fin de ta réponse le marqueur <<<DONE>>> suivi d'un JSON strictement valide entre balises <<<JSON>>>...<<<END>>> avec les clés: name, email, phone, company, service, budget, timeline, project_summary.`,
  en: `You are SamoTech's sales AI assistant (digital agency: Meta/Google ads, custom web/mobile, ERP/CRM, automation). Speak ONLY in English, never switch language. Tone: professional, warm, concise (1 question per message). Ask one question at a time in this order: 1) first name + company/activity 2) email 3) phone (optional) 4) which service among our pillars 5) approximate budget 6) desired timeline 7) brief project description. Never quote a price. When you have all info, give a short recap and say you will validate. ONLY THEN, append exactly to the end of your reply the marker <<<DONE>>> followed by a strictly valid JSON between tags <<<JSON>>>...<<<END>>> with keys: name, email, phone, company, service, budget, timeline, project_summary.`,
  ar: `أنت المساعد التجاري لـ SamoTech (وكالة رقمية: إعلانات ميتا/جوجل، تطوير ويب/موبايل مخصص، ERP/CRM، أتمتة). تحدّث بالعربية الفصحى الواضحة فقط، لا تخلط أبدًا مع لغة أخرى. النبرة: احترافية، ودودة، موجزة (سؤال واحد لكل رسالة). اطرح الأسئلة واحدًا تلو الآخر بهذا الترتيب: 1) الاسم + الشركة/النشاط 2) البريد الإلكتروني 3) الهاتف (اختياري) 4) الخدمة المطلوبة من بين خدماتنا 5) الميزانية التقديرية 6) المدة المطلوبة 7) وصف موجز للمشروع. لا تذكر أبدًا أسعارًا. عندما تجمع كل المعلومات، قدّم ملخصًا موجزًا وأخبر العميل أنك ستؤكد. عندئذٍ فقط، أضف في نهاية ردك بالضبط العلامة <<<DONE>>> ثم JSON صالح بين الوسمين <<<JSON>>>...<<<END>>> بالمفاتيح: name, email, phone, company, service, budget, timeline, project_summary.`,
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { messages, language } = await req.json();
    const lang = ["fr", "en", "ar"].includes(language) ? language : "fr";
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "system", content: sysByLang[lang] }, ...messages],
      }),
    });

    if (response.status === 429) {
      return new Response(JSON.stringify({ error: "Rate limited" }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (response.status === 402) {
      return new Response(JSON.stringify({ error: "Credits exhausted" }), {
        status: 402,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!response.ok) {
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content ?? "";

    let reply = raw;
    let summary: Record<string, string> | null = null;
    let finished = false;

    if (raw.includes("<<<DONE>>>")) {
      finished = true;
      reply = raw.split("<<<DONE>>>")[0].trim();
      const jsonMatch = raw.match(/<<<JSON>>>([\s\S]*?)<<<END>>>/);
      if (jsonMatch) {
        try {
          summary = JSON.parse(jsonMatch[1].trim());
        } catch (e) {
          console.error("JSON parse failed:", e);
          finished = false;
        }
      }
    }

    return new Response(JSON.stringify({ reply, finished, summary }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ai-assistant error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

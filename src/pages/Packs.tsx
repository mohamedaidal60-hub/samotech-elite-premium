import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Check, 
  Sparkles, 
  Zap, 
  Globe, 
  Users, 
  Camera, 
  Layout, 
  Settings,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";

const Packs = () => {
  const { t, dir } = useLanguage();

  const packs = [
    {
      id: "samotech",
      title: t("pack.samotech.title"),
      desc: t("pack.samotech.desc"),
      icon: Sparkles,
      color: "from-primary to-secondary",
      features: [
        t("pack.features.meta"),
        t("pack.features.followers"),
        t("pack.features.likes"),
        t("pack.features.logo"),
        t("pack.features.poster"),
        t("pack.features.video"),
        t("pack.features.sponsoring")
      ],
      popular: true
    },
    {
      id: "visibility",
      title: t("pack.visibility.title"),
      desc: t("pack.visibility.desc"),
      icon: Zap,
      color: "from-blue-500 to-cyan-500",
      features: [
        t("pack.features.followers"),
        t("pack.features.likes"),
        t("pack.features.sponsoring"),
        "Gestion d'audience avancée",
        "3 Vidéos publicitaires"
      ]
    },
    {
      id: "growth",
      title: t("pack.growth.title"),
      desc: t("pack.growth.desc"),
      icon: Users,
      color: "from-pink-500 to-rose-500",
      features: [
        t("pack.features.ugc"),
        t("pack.features.us_account"),
        "Scripts de vente psychologiques",
        "Étude de marché concurrentielle",
        "Accompagnement Scale"
      ]
    },
    {
      id: "corporate",
      title: t("pack.corporate.title"),
      desc: t("pack.corporate.desc"),
      icon: Globe,
      color: "from-indigo-500 to-purple-500",
      features: [
        t("pack.features.website"),
        t("pack.features.seo"),
        t("pack.samotech.title") + " Inclus",
        "Maintenance annuelle offerte",
        "Emails professionnels illimités"
      ]
    },
    {
      id: "automation",
      title: "Pack Automation & Workflow",
      desc: "Optimisez votre temps et vos profits grâce à la technologie.",
      icon: Settings,
      color: "from-orange-500 to-amber-500",
      features: [
        "Audit de processus internes",
        "Intégration d'outils (CRM, Slack)",
        "Automatisation de facturation",
        "Bot de qualification client",
        "Formation d'équipe"
      ]
    },
    {
      id: "branding",
      title: "Pack Branding Prestige",
      desc: "Donnez une âme et une voix à votre marque.",
      icon: Layout,
      color: "from-teal-500 to-emerald-500",
      features: [
        "Charte graphique complète",
        "Storytelling & Brand Voice",
        "Stratégie de contenu annuelle",
        "Pack de 20 templates Canva",
        "Direction artistique shooting"
      ]
    }
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 cosmic-bg">
      <div className="container mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black mb-6"
          >
            {t("nav.packs")}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            Des solutions calibrées pour chaque étape de votre croissance. Choisissez l'excellence.
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packs.map((pack, idx) => (
            <motion.div
              key={pack.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group relative h-full"
            >
              <div className={`h-full glass-card-glow p-8 rounded-[2.5rem] border-white/5 flex flex-col hover:border-primary/40 transition-all duration-500 ${pack.popular ? 'ring-2 ring-primary/50' : ''}`}>
                
                {pack.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 gradient-bg px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-glow">
                    Le plus populaire
                  </div>
                )}

                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${pack.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                  <pack.icon size={28} className="text-white" />
                </div>

                <h3 className="text-2xl font-black mb-4 group-hover:text-primary transition-colors">{pack.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-8">
                  {pack.desc}
                </p>

                <div className="space-y-4 mb-10 flex-grow">
                  {pack.features.map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-3 text-sm">
                      <div className="mt-1 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <Check size={12} />
                      </div>
                      <span className="text-foreground/80">{feature}</span>
                    </div>
                  ))}
                </div>

                <Link
                  to="/register"
                  className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                    pack.popular 
                    ? 'gradient-bg text-white shadow-glow hover:opacity-90' 
                    : 'bg-white/5 hover:bg-white/10 text-foreground border border-white/10'
                  }`}
                >
                  Choisir ce pack
                  <ArrowRight size={18} className={`transition-transform group-hover:translate-x-1 ${dir === 'rtl' ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Packs;

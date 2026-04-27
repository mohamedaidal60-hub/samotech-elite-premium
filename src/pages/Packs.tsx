import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Check, ArrowRight, Star, Zap, Shield, Rocket } from "lucide-react";
import { Link } from "react-router-dom";

const Packs = () => {
  const { t, dir } = useLanguage();

  const packs = [
    {
      id: "samotech-pack",
      title: t("pack.samotech.title"),
      desc: t("pack.samotech.desc"),
      icon: Star,
      popular: true,
      category: "marketing",
      features: [
        t("pack.features.meta"),
        t("pack.features.followers"),
        t("pack.features.likes"),
        t("pack.features.logo"),
        t("pack.features.poster"),
        t("pack.features.video"),
        t("pack.features.sponsoring"),
      ]
    },
    {
      id: "visibility-pack",
      title: "Pack Visibilité",
      desc: "Maximisez votre portée sur les réseaux sociaux avec une stratégie de sponsoring agressive.",
      icon: Zap,
      category: "marketing",
      features: [
        "10 jours de Sponsoring intensif",
        "Gestion complète des audiences",
        "3 Vidéos publicitaires créatives",
        "Rapport hebdomadaire de performance",
        "Support prioritaire 24/7",
      ]
    },
    {
      id: "growth-pack",
      title: "Pack Growth & UGC",
      desc: "Utilisez la puissance des créateurs de contenu pour booster votre crédibilité.",
      icon: Rocket,
      category: "marketing",
      features: [
        "Shooting avec mannequins (F/H)",
        "3 Vidéos UGC authentiques",
        "Scripts publicitaires basés sur étude de marché",
        "Compte publicitaire Américain Officiel (Anti-ban)",
        "Sponsoring optimisé pour conversion",
      ]
    },
    {
      id: "corporate-pack",
      title: "Pack Corporate Elite",
      desc: "Une solution complète incluant développement et marketing pour les entreprises.",
      icon: Shield,
      category: "development",
      features: [
        "Site Web Vitrine Premium ou E-commerce",
        "Optimisation SEO complète",
        "Pack Samotech inclus",
        "Maintenance technique 1 an",
        "Audit de sécurité mensuel",
      ]
    }
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 cosmic-bg">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <h1 className="text-4xl md:text-6xl font-black mb-6">
            Choisissez votre <span className="gradient-text">Propulseur de Croissance</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Des solutions clés en main adaptées à chaque étape de votre développement. Aucun frais caché, que des résultats.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {packs.map((pack, idx) => (
            <motion.div
              key={pack.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`relative glass-card p-8 rounded-3xl border border-white/5 flex flex-col group hover:border-primary/30 transition-all duration-500 ${pack.popular ? 'ring-2 ring-primary/50' : ''}`}
            >
              {pack.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 gradient-bg px-4 py-1 rounded-full text-xs font-bold text-primary-foreground uppercase tracking-widest shadow-glow">
                  Plus Populaire
                </div>
              )}

              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform duration-500">
                  <pack.icon size={28} className="text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{pack.title}</h3>
                  <span className="text-xs uppercase tracking-widest text-primary/80 font-bold">{pack.category}</span>
                </div>
              </div>

              <p className="text-muted-foreground mb-8 line-clamp-2">
                {pack.desc}
              </p>

              <ul className="space-y-4 mb-10 flex-grow">
                {pack.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-3 text-sm">
                    <div className="mt-1 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Check size={12} className="text-primary" />
                    </div>
                    <span className="text-foreground/90">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                to={`/register?pack=${pack.id}`}
                className={`flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-bold transition-all duration-300 ${pack.popular ? 'gradient-bg text-primary-foreground shadow-glow hover:opacity-90' : 'glass-card-glow hover:bg-white/5'}`}
              >
                Choisir ce Pack
                <ArrowRight size={18} className={`${dir === 'rtl' ? 'rotate-180' : ''}`} />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Packs;

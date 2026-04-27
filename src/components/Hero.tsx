import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, ShieldCheck, Zap } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import DynamicGridBackground from "./backgrounds/DynamicGridBackground";

const Hero = () => {
  const { t, dir } = useLanguage();
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-[#020617]">
      {/* Immersive Background */}
      <DynamicGridBackground />
      
      {/* Floating Elements (Vertecho Style) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          style={{ y: y1 }}
          className="absolute top-1/4 left-10 w-64 h-64 bg-primary/20 blur-[120px] rounded-full animate-pulse" 
        />
        <motion.div 
          style={{ y: useTransform(scrollY, [0, 500], [0, -150]) }}
          className="absolute bottom-1/4 right-10 w-96 h-96 bg-secondary/10 blur-[140px] rounded-full" 
        />
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        {/* Premium Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border-white/10 mb-8 shadow-glow"
        >
          <Sparkles size={14} className="text-primary animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/80">
            {t("hero.badge")}
          </span>
        </motion.div>

        {/* Main Title - Impactful Typography */}
        <div className="mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] text-white"
          >
            {t("hero.title.top")} <br />
            <span className="gradient-text">{t("hero.title.highlight")}</span> <br />
            {t("hero.title.bottom")}
          </motion.h1>
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto mb-12 leading-relaxed"
        >
          {t("hero.subtitle")}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-5"
        >
          <Link
            to="/packs"
            className="group relative px-8 py-5 rounded-2xl bg-white text-black font-black transition-all hover:scale-105 active:scale-95 shadow-2xl flex items-center gap-3 overflow-hidden"
          >
            <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-10 transition-opacity" />
            {t("hero.cta.start")}
            <ArrowRight size={20} className={`transition-transform group-hover:translate-x-1 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
          </Link>
          
          <Link
            to="/contact"
            className="px-8 py-5 rounded-2xl glass-card border-white/10 font-bold hover:bg-white/5 transition-all"
          >
            {t("hero.cta.learn")}
          </Link>
        </motion.div>

        {/* Social Proof / Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-24 flex flex-wrap justify-center gap-10 opacity-40 grayscale hover:grayscale-0 transition-all"
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            <ShieldCheck size={20} /> PARTENAIRE META
          </div>
          <div className="flex items-center gap-2 font-bold text-sm">
            <Zap size={20} /> GOOGLE ADS CERTIFIED
          </div>
          <div className="flex items-center gap-2 font-bold text-sm">
            PROPRIÉTÉ DE SAMOTECH GROUP
          </div>
        </motion.div>
      </div>

      {/* Background Decor (Grid Lines) */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>
    </section>
  );
};

export default Hero;

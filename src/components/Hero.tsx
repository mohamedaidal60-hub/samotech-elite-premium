import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, ShieldCheck, Zap } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import heroBg from "@/assets/hero-bg.png";

const Hero = () => {
  const { t, dir } = useLanguage();
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-black">
      
      {/* Immersive Image Background with Parallax */}
      <motion.div 
        style={{ y: useTransform(scrollY, [0, 1000], [0, 300]) }}
        className="absolute inset-0 z-0"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black z-10" />
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img 
          src={heroBg} 
          alt="SamoTech Future" 
          className="w-full h-full object-cover scale-110"
        />
      </motion.div>
      
      <div className="container mx-auto px-6 relative z-20">
        <div className="flex flex-col items-center text-center">
          
          {/* Elite Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full glass-card border-white/20 mb-10 shadow-glow"
          >
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_#863bff]" />
            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-white">
              {t("hero.badge")}
            </span>
          </motion.div>

          {/* Main Title - Massive & Impactful */}
          <div className="relative mb-12">
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-6xl md:text-[9rem] font-black tracking-tighter leading-[0.85] text-white"
            >
              {t("hero.title.top")} <br />
              <span className="gradient-text italic px-4">{t("hero.title.highlight")}</span> <br />
              {t("hero.title.bottom")}
            </motion.h1>
            
            {/* Decorative Glow */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/20 blur-[80px] -z-10 rounded-full" />
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-secondary/20 blur-[80px] -z-10 rounded-full" />
          </div>

          {/* Subtitle with Glass Box */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-4xl glass-card border-white/5 p-8 md:p-12 rounded-[3rem] backdrop-blur-2xl shadow-premium mb-12"
          >
            <p className="text-white/80 text-lg md:text-2xl leading-relaxed font-medium">
              {t("hero.subtitle")}
            </p>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link
              to="/packs"
              className="group relative px-10 py-6 rounded-2xl bg-white text-black font-black text-lg transition-all hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(255,255,255,0.2)] flex items-center gap-3"
            >
              {t("hero.cta.start")}
              <ArrowRight size={22} className={`transition-transform group-hover:translate-x-1 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
            </Link>
            
            <Link
              to="/contact"
              className="px-10 py-6 rounded-2xl glass-card border-white/20 text-white font-bold text-lg hover:bg-white/10 transition-all backdrop-blur-md"
            >
              {t("hero.cta.learn")}
            </Link>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-20 flex flex-wrap justify-center gap-12"
          >
            <div className="flex items-center gap-3 font-black text-xs tracking-widest text-white">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center"><ShieldCheck size={16} /></div>
              PARTENAIRE META
            </div>
            <div className="flex items-center gap-3 font-black text-xs tracking-widest text-white">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center"><Zap size={16} /></div>
              GOOGLE ADS ELITE
            </div>
          </motion.div>
        </div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 z-10 opacity-30 pointer-events-none mix-blend-overlay">
        <div className="h-full w-full bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>
    </section>
  );
};

export default Hero;

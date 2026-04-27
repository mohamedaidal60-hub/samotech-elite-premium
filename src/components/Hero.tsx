import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowRight, Sparkles, ChevronDown } from "lucide-react";
import { useRef } from "react";

const Hero = () => {
  const { t, dir } = useLanguage();
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-12 cosmic-bg"
    >
      {/* Dynamic Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-primary/10 blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [0, -90, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-secondary/10 blur-[100px]" 
        />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-flex items-center gap-2 glass-card px-5 py-2.5 rounded-full text-xs font-bold tracking-[0.2em] uppercase text-primary mb-10 border-primary/20 shadow-glow">
              <Sparkles size={14} className="animate-pulse" />
              {t("hero.badge")}
            </span>
          </motion.div>

          <motion.h1 
            style={{ y: y1 }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black leading-[0.9] tracking-tight mb-10"
          >
            <span className="block">{t("hero.title1")}</span>
            <span className="gradient-text drop-shadow-[0_0_30px_hsla(var(--primary),0.3)]">
              {t("hero.title2")}
            </span>
            <span className="block mt-4">{t("hero.title3")} <span className="text-foreground/40">{t("hero.title4")}</span></span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-lg md:text-2xl text-muted-foreground/80 max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            {t("hero.subtitle")}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link
              to="/packs"
              className="group relative px-10 py-5 rounded-2xl overflow-hidden shadow-premium hover:shadow-glow transition-all duration-500 hover:scale-105"
            >
              <div className="absolute inset-0 gradient-bg transition-transform duration-500 group-hover:scale-110" />
              <div className="relative flex items-center gap-3 text-lg font-bold text-primary-foreground">
                {t("hero.cta.start")}
                <ArrowRight size={22} className={`transition-transform duration-500 ${dir === 'rtl' ? 'group-hover:-translate-x-2 rotate-180' : 'group-hover:translate-x-2'}`} />
              </div>
            </Link>
            
            <Link
              to="/workflow"
              className="glass-card-glow px-10 py-5 rounded-2xl text-lg font-bold text-foreground hover:scale-105 transition-all duration-500 border-white/5"
            >
              {t("hero.cta.learn")}
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Floating UI Elements Decor */}
      <div className="absolute inset-0 pointer-events-none hidden lg:block">
        <motion.div 
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] left-[5%] glass-card p-6 rounded-3xl border-primary/20 rotate-[-10deg] shadow-glow"
        >
          <div className="w-12 h-1 bg-primary rounded-full mb-3" />
          <div className="w-24 h-1 bg-muted rounded-full mb-3" />
          <div className="w-16 h-1 bg-muted rounded-full" />
        </motion.div>

        <motion.div 
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[25%] right-[8%] glass-card p-6 rounded-3xl border-secondary/20 rotate-[12deg] shadow-glow"
        >
          <div className="flex gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
            <div className="w-3 h-3 rounded-full bg-green-500/50" />
          </div>
          <div className="w-32 h-20 rounded-xl bg-secondary/5 border border-secondary/10 flex items-center justify-center">
            <Sparkles size={24} className="text-secondary" />
          </div>
        </motion.div>
      </div>

      <motion.div 
        style={{ opacity }}
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Scroll</span>
        <ChevronDown size={20} />
      </motion.div>
    </section>
  );
};

export default Hero;

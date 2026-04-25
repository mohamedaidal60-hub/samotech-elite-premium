import { Link } from "react-router-dom";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import ParallaxBackground from "@/components/backgrounds/ParallaxBackground";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowRight, Sparkles, Megaphone, Code, Settings, Workflow } from "lucide-react";

const Hero = () => {
  const ref = useScrollReveal<HTMLDivElement>();
  const { t } = useLanguage();

  const services = [
    { icon: Megaphone, label: t("nav.advertisement") },
    { icon: Code, label: t("nav.development") },
    { icon: Settings, label: t("nav.automation") },
    { icon: Workflow, label: t("nav.workflow") }
  ];

  return (
    <section ref={ref} className="relative min-h-screen flex items-center overflow-hidden pt-24 pb-12 cosmic-bg">
      <ParallaxBackground />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column: Text Content */}
          <div className="text-left max-w-2xl">
            <div className="animate-scroll-fade">
              <span className="inline-flex items-center gap-2 glass-card px-4 py-2 text-xs font-medium tracking-widest uppercase text-foreground/80 mb-6">
                <Sparkles size={13} className="text-accent" />
                {t("hero.badge")}
              </span>
            </div>

            <h1 className="animate-scroll-fade text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-6" style={{ transitionDelay: "0.1s" }}>
              {t("hero.title1")}{" "}
              <span className="gradient-text">{t("hero.title2")}</span>
              <br />
              {t("hero.title3")} <span className="gradient-text">{t("hero.title4")}</span>
            </h1>

            <p className="animate-scroll-fade text-lg md:text-xl text-muted-foreground mb-8" style={{ transitionDelay: "0.2s" }}>
              {t("hero.subtitle")}
            </p>

            <div className="animate-scroll-fade flex flex-wrap gap-3 mb-10" style={{ transitionDelay: "0.3s" }}>
              {services.map((S, idx) => (
                <div key={idx} className="flex items-center gap-2 glass-card px-4 py-2 rounded-full text-sm font-medium">
                  <S.icon size={16} className="text-primary" />
                  <span>{S.label}</span>
                </div>
              ))}
            </div>

            <div className="animate-scroll-fade flex flex-col sm:flex-row gap-4" style={{ transitionDelay: "0.4s" }}>
              <Link
                to="/contact"
                className="gradient-bg px-8 py-4 rounded-xl text-base font-semibold text-primary-foreground hover:opacity-90 transition-all hover:scale-105 inline-flex items-center justify-center gap-2 group"
              >
                {t("hero.cta.start")}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/workflow"
                className="glass-card-glow px-8 py-4 rounded-xl text-base font-semibold text-foreground hover:scale-105 transition-all text-center"
              >
                {t("hero.cta.learn")}
              </Link>
            </div>
          </div>

          {/* Right Column: Image/Visual */}
          <div className="animate-scroll-fade relative hidden lg:block" style={{ transitionDelay: "0.3s" }}>
            <div className="relative rounded-3xl overflow-hidden glass-card-glow p-2 shadow-elegant animate-float">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-accent/20 z-10 pointer-events-none rounded-3xl" />
              <img 
                src="/hero_img.png" 
                alt="SamoTech Workflow & Tech" 
                className="w-full h-auto rounded-2xl object-cover relative z-0"
              />
              
              {/* Floating elements overlaying image */}
              <div className="absolute -left-6 top-10 glass-card p-4 rounded-xl z-20 flex items-center gap-3 animate-float-slow">
                <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center">
                  <Workflow size={20} className="text-primary-foreground" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-semibold">Workflow</div>
                  <div className="text-sm font-bold">100% Automatisé</div>
                </div>
              </div>
              
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;

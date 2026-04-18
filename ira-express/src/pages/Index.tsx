import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Flame, Heart, Package, ArrowRight, Zap, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import ServiceCarousel from "@/components/ServiceCarousel";
import logoIra from "@/assets/logo-ira-express.png";
import heroBg from "@/assets/hero-bg.jpg";
import carouselGaz1 from "@/assets/carousel-gaz-1.jpg";
import carouselGaz2 from "@/assets/carousel-gaz-2.jpg";
import carouselPharma1 from "@/assets/carousel-pharma-1.jpg";
import carouselPharma2 from "@/assets/carousel-pharma-2.jpg";
import carouselColis1 from "@/assets/carousel-colis-1.jpg";
import carouselColis2 from "@/assets/carousel-colis-2.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.15, duration: 0.6 } }),
};

const services = [
  {
    icon: Flame,
    title: "IRA Gaz",
    desc: "Livraison de butane à domicile au même prix que le dépôt. Fini les longues files d'attente !",
    images: [
      { src: carouselGaz1, alt: "Livraison de gaz" },
      { src: carouselGaz2, alt: "Stock de butane" },
    ],
    link: "/gaz",
    gradient: "from-accent to-destructive",
  },
  {
    icon: Heart,
    title: "IRA Pharma",
    desc: "Vos médicaments livrés chez vous en toute sécurité. Service agréé par le Ministère de l'Intérieur.",
    images: [
      { src: carouselPharma1, alt: "Livraison pharma" },
      { src: carouselPharma2, alt: "Remise médicaments" },
    ],
    link: "/pharma",
    gradient: "from-secondary to-primary",
  },
  {
    icon: Package,
    title: "IRA Colis",
    desc: "Colis & nourriture livrés express. Rapide, fiable et professionnel.",
    images: [
      { src: carouselColis1, alt: "Livraison colis" },
      { src: carouselColis2, alt: "Colis et nourriture" },
    ],
    link: "/colis",
    gradient: "from-primary to-secondary",
  },
];

const features = [
  { icon: Zap, title: "Livraison Rapide", desc: "En moins de 30 minutes dans votre zone" },
  { icon: Shield, title: "Service Sécurisé", desc: "Vos commandes sont protégées et suivies" },
  { icon: Clock, title: "Disponible 24/7", desc: "Commander à tout moment, nous sommes là" },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background pt-16">
      {/* HERO */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
        </div>
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <motion.img
            src={logoIra}
            alt="IRA EXPRESS"
            className="w-32 h-32 mx-auto mb-8 drop-shadow-2xl"
            initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
          />
          <motion.h1
            className="text-4xl md:text-7xl font-display font-black tracking-tight mb-4"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <span className="text-gradient-brand">IRA EXPRESS</span>
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-body mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            La super-app de livraison du Niger — Gaz, Pharmacie, Colis & Nourriture
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            {services.map((s) => (
              <Link key={s.link} to={s.link}>
                <Button size="lg" className={`bg-gradient-to-r ${s.gradient} text-white font-bold w-full sm:w-auto`}>
                  <s.icon className="mr-2 h-5 w-5" />
                  {s.title}
                </Button>
              </Link>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={i}
              className="text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i}
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                <f.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-display font-bold text-lg text-foreground mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      {services.map((s, i) => (
        <section key={s.link} className={`py-20 px-6 ${i % 2 === 1 ? "bg-card/50" : ""}`}>
          <div className="max-w-6xl mx-auto">
            <motion.div
              className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? "md:flex-row-reverse" : ""}`}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.div className={i % 2 === 1 ? "md:order-2" : ""} variants={fadeUp} custom={0}>
                <ServiceCarousel images={s.images} />
              </motion.div>
              <motion.div className={i % 2 === 1 ? "md:order-1" : ""} variants={fadeUp} custom={1}>
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${s.gradient} text-white text-sm font-bold mb-4`}>
                  <s.icon className="w-4 h-4" />
                  {s.title}
                </div>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">{s.title}</h2>
                <p className="text-muted-foreground text-lg mb-6 leading-relaxed">{s.desc}</p>
                <Link to={s.link}>
                  <Button size="lg" className={`bg-gradient-to-r ${s.gradient} text-white font-bold`}>
                    Commander maintenant <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>
      ))}

      {/* FOOTER */}
      <footer className="py-12 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto text-center">
          <img src={logoIra} alt="IRA EXPRESS" className="h-12 mx-auto mb-4" />
          <p className="text-gradient-brand text-2xl font-display font-black mb-2">IRA EXPRESS</p>
          <p className="text-muted-foreground text-sm">© 2026 IRA EXPRESS — La super-app de livraison du Niger</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

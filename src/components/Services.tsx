import { motion } from "framer-motion";
import { Megaphone, Code, Settings, Workflow, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const Services = () => {
  const { t, dir } = useLanguage();

  const services = [
    {
      icon: Megaphone,
      title: t("nav.advertisement"),
      desc: "Stratégies publicitaires hautes performances sur Meta, Google et TikTok. On ne fait pas que des likes, on fait des ventes.",
      link: "/advertisement",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Code,
      title: t("nav.development"),
      desc: "Applications web et mobiles sur mesure, ERP, CRM et plateformes e-commerce. La technologie devient votre plus grand atout.",
      link: "/development",
      color: "from-purple-500 to-indigo-500"
    },
    {
      icon: Settings,
      title: t("nav.automation"),
      desc: "Libérez votre temps en automatisant vos tâches répétitives. On construit vos workflows pour que vous puissiez vous concentrer sur l'essentiel.",
      link: "/automation",
      color: "from-pink-500 to-rose-500"
    },
    {
      icon: Workflow,
      title: "Workflows & Process",
      desc: "Optimisation de votre tunnel de vente et de votre organisation interne. Une structure solide pour une croissance infinie.",
      link: "/dashboard",
      color: "from-orange-500 to-amber-500"
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl md:text-5xl font-black mb-6">Nos <span className="gradient-text">Piliers d'Expertise</span></h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Chaque service est conçu pour s'intégrer parfaitement à votre stratégie globale.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((s, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group relative h-full"
            >
              <Link to={s.link} className="block h-full animate-reveal" style={{ animationDelay: `${idx * 0.15}s` }}>
                <div className="glass-card-glow p-8 rounded-[3rem] border-white/10 h-full flex flex-col group-hover:border-primary/50 transition-all duration-700 hover-tilt group-hover:shadow-[0_0_50px_-12px_rgba(134,63,255,0.3)] bg-black/20">
                  <div className={`w-16 h-16 rounded-[1.5rem] bg-gradient-to-br ${s.color} flex items-center justify-center mb-8 shadow-2xl group-hover:scale-125 group-hover:rotate-6 transition-all duration-700`}>
                    <s.icon size={32} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-black mb-4 group-hover:text-primary transition-colors text-white">{s.title}</h3>
                  <p className="text-base text-white/60 leading-relaxed mb-8 flex-grow">
                    {s.desc}
                  </p>
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary">
                    En savoir plus
                    <ArrowRight size={14} className={`transition-transform group-hover:translate-x-1 ${dir === 'rtl' ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;

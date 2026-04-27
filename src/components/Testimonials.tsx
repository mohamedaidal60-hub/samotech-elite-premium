import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Karim B.",
    role: "CEO, E-shop Alger",
    text: "Le Pack Samotech a transformé notre présence sur Facebook. On a doublé nos ventes en un mois grâce au sponsoring ciblé.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Karim"
  },
  {
    name: "Sarah L.",
    role: "Marketing Director, DzDev",
    text: "Une équipe très pro. Le développement de notre ERP sur mesure a été fluide et le résultat dépasse nos attentes.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
  },
  {
    name: "Mehdi R.",
    role: "Propriétaire, Café Chic",
    text: "Leur assistant IA nous fait gagner 2h par jour sur la gestion des réservations. Indispensable !",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mehdi"
  }
];

const Testimonials = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-white/[0.02]">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-1 text-yellow-500 mb-4">
            {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
          </div>
          <h2 className="text-3xl md:text-5xl font-black mb-6">Ce que disent <span className="gradient-text">nos clients</span></h2>
          <p className="text-muted-foreground">Des résultats concrets pour des entrepreneurs ambitieux.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card p-10 rounded-[2.5rem] relative group border-white/5"
            >
              <Quote className="absolute top-6 right-6 text-primary/10 group-hover:text-primary/30 transition-colors" size={40} />
              
              <div className="flex items-center gap-4 mb-6">
                <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full border-2 border-primary/20 p-0.5" />
                <div>
                  <h4 className="font-bold text-foreground">{t.name}</h4>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">{t.role}</p>
                </div>
              </div>

              <p className="text-muted-foreground italic leading-relaxed text-sm">
                "{t.text}"
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

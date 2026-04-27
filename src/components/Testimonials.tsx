import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";

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
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () => setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="py-32 relative overflow-hidden bg-black/40">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-black mb-6"
          >
            Ils nous font <span className="gradient-text">confiance</span>
          </motion.h2>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -50, scale: 0.9 }}
              transition={{ duration: 0.6, ease: "circOut" }}
              className="glass-card-glow p-10 md:p-20 rounded-[3rem] border-white/10 relative text-center"
            >
              <Quote className="absolute top-10 left-10 text-primary/20" size={60} />
              
              <div className="inline-flex items-center gap-1 text-yellow-500 mb-8">
                {[...Array(5)].map((_, i) => <Star key={i} size={20} fill="currentColor" />)}
              </div>

              <p className="text-xl md:text-3xl text-white/90 font-medium leading-relaxed italic mb-12">
                "{testimonials[index].text}"
              </p>

              <div className="flex flex-col items-center">
                <img 
                  src={testimonials[index].avatar} 
                  alt={testimonials[index].name} 
                  className="w-16 h-16 rounded-full border-2 border-primary mb-4" 
                />
                <h4 className="text-xl font-bold">{testimonials[index].name}</h4>
                <p className="text-xs uppercase tracking-widest text-primary font-black">{testimonials[index].role}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="absolute top-1/2 -translate-y-1/2 -left-6 md:-left-12">
            <button onClick={prev} className="w-12 h-12 rounded-full glass-card border-white/20 flex items-center justify-center hover:bg-white/10 transition-all">
              <ChevronLeft size={24} />
            </button>
          </div>
          <div className="absolute top-1/2 -translate-y-1/2 -right-6 md:-right-12">
            <button onClick={next} className="w-12 h-12 rounded-full glass-card border-white/20 flex items-center justify-center hover:bg-white/10 transition-all">
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Indicators */}
          <div className="flex justify-center gap-3 mt-10">
            {testimonials.map((_, i) => (
              <button 
                key={i} 
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition-all duration-500 ${i === index ? 'w-8 bg-primary' : 'w-2 bg-white/20'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

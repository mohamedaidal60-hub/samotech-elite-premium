import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import ServiceCarousel from "@/components/ServiceCarousel";
import OrderForm from "@/components/OrderForm";
import carouselPharma1 from "@/assets/carousel-pharma-1.jpg";
import carouselPharma2 from "@/assets/carousel-pharma-2.jpg";

const images = [
  { src: carouselPharma1, alt: "Livraison de médicaments" },
  { src: carouselPharma2, alt: "Remise de médicaments" },
];

const PharmaPage = () => (
  <div className="min-h-screen bg-background pt-16">
    <section className="py-16 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-secondary to-primary text-white font-bold mb-6">
            <Heart className="w-5 h-5" />
            IRA Pharma
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-black text-foreground mb-4">
            Vos <span className="text-secondary">Médicaments</span> Livrés
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
            Plus besoin de parcourir des kilomètres pour vos médicaments. 
            Service agréé par le Ministère de l'Intérieur du Niger.
          </p>
        </motion.div>

        <motion.div className="mb-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <ServiceCarousel images={images} />
        </motion.div>

        <motion.div
          className="bg-card rounded-2xl border border-border p-8 shadow-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-2xl font-display font-bold text-foreground mb-6">Commander vos médicaments</h2>
          <OrderForm
            serviceType="pharma"
            serviceLabel="IRA Pharma — Médicaments"
            itemsPlaceholder="Liste des médicaments nécessaires"
          />
        </motion.div>
      </div>
    </section>
  </div>
);

export default PharmaPage;

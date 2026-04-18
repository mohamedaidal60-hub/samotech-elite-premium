import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import ServiceCarousel from "@/components/ServiceCarousel";
import OrderForm from "@/components/OrderForm";
import carouselGaz1 from "@/assets/carousel-gaz-1.jpg";
import carouselGaz2 from "@/assets/carousel-gaz-2.jpg";

const images = [
  { src: carouselGaz1, alt: "Livraison de gaz butane" },
  { src: carouselGaz2, alt: "Stock de bouteilles de butane" },
];

const GazPage = () => (
  <div className="min-h-screen bg-background pt-16">
    <section className="py-16 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-accent to-destructive text-white font-bold mb-6">
            <Flame className="w-5 h-5" />
            IRA Gaz
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-black text-foreground mb-4">
            Livraison de <span className="text-accent">Butane</span> à Domicile
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
            Commandez votre bouteille de gaz butane et recevez-la chez vous au même prix que le dépôt. 
            Nous récupérons la consigne au même prix !
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
          <h2 className="text-2xl font-display font-bold text-foreground mb-6">Passer une commande</h2>
          <OrderForm
            serviceType="gaz"
            serviceLabel="IRA Gaz — Butane"
            itemsPlaceholder="Type de bouteille (ex: 6kg, 12kg...)"
          />
        </motion.div>
      </div>
    </section>
  </div>
);

export default GazPage;

import { motion } from "framer-motion";
import { Package } from "lucide-react";
import ServiceCarousel from "@/components/ServiceCarousel";
import OrderForm from "@/components/OrderForm";
import carouselColis1 from "@/assets/carousel-colis-1.jpg";
import carouselColis2 from "@/assets/carousel-colis-2.jpg";

const images = [
  { src: carouselColis1, alt: "Livraison express" },
  { src: carouselColis2, alt: "Colis et nourriture" },
];

const ColisPage = () => (
  <div className="min-h-screen bg-background pt-16">
    <section className="py-16 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-bold mb-6">
            <Package className="w-5 h-5" />
            IRA Colis
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-black text-foreground mb-4">
            Colis & <span className="text-primary">Nourriture</span> Express
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
            Envoyez ou recevez colis et repas partout dans la ville. 
            Service rapide, fiable et professionnel.
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
          <h2 className="text-2xl font-display font-bold text-foreground mb-6">Envoyer un colis ou commander</h2>
          <OrderForm
            serviceType="colis"
            serviceLabel="IRA Colis — Express"
            itemsPlaceholder="Description du colis ou commande de nourriture"
          />
        </motion.div>
      </div>
    </section>
  </div>
);

export default ColisPage;

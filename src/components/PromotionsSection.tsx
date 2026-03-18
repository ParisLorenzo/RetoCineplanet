import { motion } from "framer-motion";
import { Ticket, Gift, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";

const promos = [
  {
    icon: Ticket,
    title: "2x1 Martes",
    description: "Todos los martes, lleva dos entradas por el precio de una.",
    color: "from-primary/20 to-primary/5",
    borderColor: "border-primary/30",
  },
  {
    icon: Gift,
    title: "Combo Familiar",
    description: "Popcorn grande + 4 bebidas a precio especial.",
    color: "from-neon-yellow/20 to-neon-yellow/5",
    borderColor: "border-neon-yellow/30",
  },
  {
    icon: Percent,
    title: "Descuento Estudiante",
    description: "30% de descuento presentando tu carnet vigente.",
    color: "from-secondary/20 to-secondary/5",
    borderColor: "border-secondary/30",
  },
];

const PromotionsSection = () => {
  return (
    <section className="py-16 section-dark">
      <div className="container mx-auto px-4">
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-10">
          Promociones
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {promos.map((promo, i) => (
            <motion.div
              key={promo.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-xl border ${promo.borderColor} bg-gradient-to-br ${promo.color} p-6 space-y-3`}
            >
              <promo.icon className="h-8 w-8 text-foreground" />
              <h3 className="font-display text-xl font-semibold">{promo.title}</h3>
              <p className="text-muted-foreground font-body text-sm">{promo.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromotionsSection;

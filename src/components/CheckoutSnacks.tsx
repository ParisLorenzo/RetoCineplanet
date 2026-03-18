import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Minus, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import canchitaImg from "@/assets/canchita.png";

export interface SnackOrder {
  name: string;
  qty: number;
  priceNum: number;
}

const CHECKOUT_SNACKS = [
  { name: "Popcorn Clásico", priceNum: 12.9, image: "https://images.unsplash.com/photo-1585647347483-22b66260dfff?w=300&h=300&fit=crop", tag: null },
  { name: "Combo Pareja", priceNum: 34.9, image: "https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=300&h=300&fit=crop", tag: "Más vendido" },
  { name: "Gaseosa Grande", priceNum: 8.9, image: "https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=300&h=300&fit=crop", tag: null },
  { name: "Nachos Supreme", priceNum: 15.9, image: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=300&h=300&fit=crop", tag: null },
  { name: "Combo Familiar", priceNum: 45.9, image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=300&h=300&fit=crop", tag: "Combo pareja" },
  { name: "Hot Dog Cósmico", priceNum: 10.9, image: "https://images.unsplash.com/photo-1612392062126-1803e5069a10?w=300&h=300&fit=crop", tag: null },
];

interface Props {
  snacks: Record<string, SnackOrder>;
  onUpdateSnacks: (snacks: Record<string, SnackOrder>) => void;
}

const CheckoutSnacks = ({ snacks, onUpdateSnacks }: Props) => {
  const updateQty = (name: string, priceNum: number, delta: number) => {
    const next = { ...snacks };
    const current = next[name]?.qty || 0;
    const val = current + delta;
    if (val <= 0) delete next[name];
    else next[name] = { name, qty: val, priceNum };
    onUpdateSnacks(next);
  };

  const snacksTotal = Object.values(snacks).reduce((s, item) => s + item.qty * item.priceNum, 0);

  return (
    <div className="space-y-5">
      {/* Canchita suggestion */}
      <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/10 border border-primary/20">
        <img src={canchitaImg} alt="Canchita" className="h-12 w-12 object-contain" />
        <p className="text-sm font-body text-foreground">
          <span className="font-semibold">¡Hola!</span> No olvides llevar tus snacks favoritos
        </p>
      </div>

      <h2 className="font-display text-xl font-semibold">¿Quieres agregar snacks?</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {CHECKOUT_SNACKS.map((snack) => {
          const qty = snacks[snack.name]?.qty || 0;
          return (
            <motion.div
              key={snack.name}
              whileHover={{ scale: 1.01 }}
              className="flex items-center gap-3 glass-panel rounded-xl p-3 relative overflow-hidden"
            >
              {snack.tag && (
                <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-accent text-accent-foreground text-[10px] font-display font-bold uppercase flex items-center gap-1">
                  <Star size={10} /> {snack.tag}
                </span>
              )}
              <img src={snack.image} alt={snack.name} className="h-16 w-16 rounded-lg object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-display text-sm font-semibold truncate">{snack.name}</p>
                <p className="text-price font-display font-bold text-sm">S/ {snack.priceNum.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {qty === 0 ? (
                  <Button variant="default" size="icon" className="h-8 w-8 rounded-full" onClick={() => updateQty(snack.name, snack.priceNum, 1)}>
                    <Plus size={14} />
                  </Button>
                ) : (
                  <>
                    <button onClick={() => updateQty(snack.name, snack.priceNum, -1)} className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-foreground hover:bg-muted/80 transition-colors">
                      <Minus size={14} />
                    </button>
                    <span className="font-display text-sm font-semibold w-4 text-center">{qty}</span>
                    <button onClick={() => updateQty(snack.name, snack.priceNum, 1)} className="h-7 w-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground hover:bg-primary/80 transition-colors">
                      <Plus size={14} />
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {snacksTotal > 0 && (
        <div className="flex justify-between pt-3 border-t border-border/40">
          <span className="text-muted-foreground font-body">Subtotal snacks</span>
          <span className="font-display font-bold text-price tabular-nums">S/ {snacksTotal.toFixed(2)}</span>
        </div>
      )}
    </div>
  );
};

export default CheckoutSnacks;

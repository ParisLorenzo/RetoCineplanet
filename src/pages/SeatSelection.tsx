import { useState } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const ROWS = ["A", "B", "C", "D", "E", "F", "G", "H"];
const COLS = 12;

const unavailable = new Set(["A-3", "A-4", "B-7", "C-2", "D-8", "D-9", "E-5", "F-1", "G-10", "H-6"]);

const SeatSelection = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggleSeat = (id: string) => {
    if (unavailable.has(id)) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const totalPrice = selected.size * 18.9;

  return (
    <div className="min-h-screen bg-background">
      <div className="starfield" />
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">Selecciona tus Asientos</h1>
          <p className="text-muted-foreground font-body mb-8">Película #{movieId}</p>

          {/* Screen */}
          <div className="mb-10 text-center">
            <div className="mx-auto w-3/4 h-2 rounded-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-60 mb-2" />
            <span className="font-display text-xs uppercase tracking-widest text-muted-foreground">Pantalla</span>
          </div>

          {/* Seat Grid */}
          <div className="flex flex-col items-center gap-2 mb-10">
            {ROWS.map((row) => (
              <div key={row} className="flex items-center gap-1.5">
                <span className="w-5 text-xs text-muted-foreground font-display">{row}</span>
                {Array.from({ length: COLS }, (_, i) => {
                  const id = `${row}-${i + 1}`;
                  const isUnavailable = unavailable.has(id);
                  const isSelected = selected.has(id);
                  return (
                    <motion.button
                      key={id}
                      whileHover={!isUnavailable ? { scale: 1.15 } : undefined}
                      whileTap={!isUnavailable ? { scale: 0.95 } : undefined}
                      onClick={() => toggleSeat(id)}
                      disabled={isUnavailable}
                      className={`h-7 w-7 md:h-8 md:w-8 rounded-md transition-all duration-200 border ${
                        isUnavailable
                          ? "bg-muted/20 border-transparent cursor-not-allowed"
                          : isSelected
                          ? "bg-primary/80 border-primary shadow-[0_0_8px_hsl(var(--primary)/0.5)]"
                          : "bg-secondary/20 border-secondary/40 hover:bg-secondary/30 cursor-pointer"
                      }`}
                    />
                  );
                })}
                <span className="w-5 text-xs text-muted-foreground font-display">{row}</span>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex justify-center gap-6 mb-10 text-xs font-display uppercase tracking-wider text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-sm bg-secondary/20 border border-secondary/40" />
              Disponible
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-sm bg-primary/80 border border-primary shadow-[0_0_6px_hsl(var(--primary)/0.4)]" />
              Seleccionado
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-sm bg-muted/20" />
              No disponible
            </div>
          </div>

          {/* Summary panel */}
          {selected.size > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel rounded-xl p-6 space-y-4"
            >
              <h3 className="font-display text-lg font-semibold">Resumen</h3>
              <div className="flex flex-wrap gap-2">
                {Array.from(selected).sort().map((seat) => (
                  <span key={seat} className="px-2 py-1 rounded-full bg-primary/20 text-primary font-display text-xs font-semibold">
                    {seat}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border/40">
                <span className="text-muted-foreground font-body">Total</span>
                <span className="font-display text-2xl font-bold text-price tabular-nums">
                  S/ {totalPrice.toFixed(2)}
                </span>
              </div>
              <Button
                variant="hero"
                size="lg"
                className="w-full"
                onClick={() => navigate(`/checkout/${movieId}`)}
              >
                Continuar
              </Button>
            </motion.div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SeatSelection;

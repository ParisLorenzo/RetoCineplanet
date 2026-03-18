import { motion } from "framer-motion";
import { Plus, Minus, RotateCcw, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface SnackItemProps {
  name: string;
  price: string;
  priceNum: number;
  image: string;
  description: string;
  details: string;
  calories: string;
  qty: number;
  onChangeQty: (delta: number) => void;
}

const SnackCard = ({
  name,
  price,
  image,
  description,
  details,
  calories,
  qty,
  onChangeQty,
}: SnackItemProps) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="perspective-[800px] h-full">
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ type: "spring", duration: 0.6, bounce: 0.1 }}
        className="relative w-full h-full"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* FRONT */}
        <div
          className="absolute inset-0 rounded-2xl bg-card border border-border/50 overflow-hidden shadow-lg flex flex-col"
          style={{ backfaceVisibility: "hidden" }}
        >
          {/* Imagen */}
          <div className="h-48 overflow-hidden bg-muted/30 relative">
            <img
              src={image}
              alt={name}
              className="h-full w-full object-cover"
              loading="lazy"
            />

            <button
              onClick={() => setFlipped(true)}
              className="absolute top-2 right-2 h-7 w-7 rounded-full bg-background/70 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <Info size={14} />
            </button>
          </div>

          {/* Info */}
          <div className="p-4 flex flex-col justify-between flex-1">
            <div>
              <h3 className="font-display text-base font-semibold">
                {name}
              </h3>
              <p className="text-xs text-muted-foreground font-body">
                {description}
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 mt-2">
              <span className="font-display text-lg font-bold text-price">
                {price}
              </span>

              {qty === 0 ? (
                <Button
                  variant="default"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={() => onChangeQty(1)}
                >
                  <Plus size={16} />
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onChangeQty(-1)}
                    className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-foreground hover:bg-muted/80 transition-colors"
                  >
                    <Minus size={14} />
                  </button>

                  <span className="font-display text-sm font-semibold w-4 text-center">
                    {qty}
                  </span>

                  <button
                    onClick={() => onChangeQty(1)}
                    className="h-7 w-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground hover:bg-primary/80 transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* BACK */}
        <div
          className="absolute inset-0 rounded-2xl bg-card border border-border/50 overflow-hidden shadow-lg p-5 flex flex-col justify-between"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="space-y-3">
            <h3 className="font-display text-lg font-bold">{name}</h3>
            <p className="text-sm text-muted-foreground font-body">
              {details}
            </p>

            <div className="text-xs text-muted-foreground font-body space-y-1">
              <p>{calories}</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-border/40">
            <span className="font-display text-lg font-bold text-price">
              {price}
            </span>

            <button
              onClick={() => setFlipped(false)}
              className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-foreground hover:bg-muted/80 transition-colors"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SnackCard;
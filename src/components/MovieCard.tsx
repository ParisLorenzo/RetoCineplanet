import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Film, Plus, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

interface MovieCardProps {
  title: string;
  poster: string;
  duration: string;
  genre: string;
  rating?: string;
  format?: string;
  id?: string;
}

const MovieCard = ({ title, poster, duration, genre, rating, format, id = "1" }: MovieCardProps) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", duration: 0.4, bounce: 0.1 }}
      className="group relative rounded-xl bg-card overflow-hidden shadow-[0_0_0_1px_hsl(var(--border)),0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)] hover:shadow-[inset_0_0_10px_2px_hsl(var(--primary)/0.15),0_0_0_1px_hsl(var(--primary)/0.3),0_4px_6px_-1px_rgba(0,0,0,0.1)] transition-shadow duration-300"
    >
      <div className="relative aspect-[2/3] overflow-hidden">
        {/* Loading skeleton */}
        {!imgLoaded && !imgError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <Skeleton className="h-full w-full absolute inset-0" />
            <div className="relative z-10 flex flex-col items-center gap-2">
              <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              <span className="text-xs text-muted-foreground font-body">Cargando...</span>
            </div>
          </div>
        )}
        <img
          src={poster}
          alt={title}
          className={`h-full w-full object-cover transition-all duration-500 group-hover:scale-105 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgError(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
        {rating && (
          <span className="absolute top-3 right-3 rounded-full bg-neon-yellow px-2 py-0.5 font-display text-xs font-bold text-accent-foreground">
            {rating}
          </span>
        )}
        {format && (
          <span className="absolute top-3 left-3 rounded-full bg-destructive px-2 py-0.5 font-display text-xs font-bold text-destructive-foreground">
            {format}
          </span>
        )}

        {/* Hover overlay with buttons */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Link to={`/pelicula/${id}?section=showtimes`}>
            <Button className="rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg font-display text-sm px-6">
              <ShoppingCart size={16} className="mr-1.5" /> Comprar
            </Button>
          </Link>
          <Link to={`/pelicula/${id}`}>
            <Button variant="outline" size="sm" className="rounded-full border-foreground/30 text-foreground backdrop-blur-sm">
              <Plus size={14} className="mr-1" /> Ver Detalles
            </Button>
          </Link>
        </div>
      </div>

      <div className="p-4 space-y-1.5">
        <h3 className="font-display text-base font-semibold text-foreground leading-tight line-clamp-2">
          {title}
        </h3>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{genre}</span>
          <span>·</span>
          <span>{duration}</span>
          {rating && (
            <>
              <span>·</span>
              <span>+{Math.floor(parseFloat(rating) + 4)}</span>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MovieCard;

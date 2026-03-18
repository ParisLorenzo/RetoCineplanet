import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";

interface FeaturedMovie {
  id: string;
  title: string;
  subtitle: string;
  genre: string;
  poster: string;
}

const HeroSection = () => {
  const [featuredMovies, setFeaturedMovies] = useState<FeaturedMovie[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const fetchFeaturedMovies = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "premieres"));

        const data = querySnapshot.docs
          .map((doc) => {
            const raw = doc.data();

            const formats = Array.isArray(raw.format)
              ? raw.format
              : raw.format
                ? [raw.format]
                : [];

            return {
              id: doc.id,
              title: raw.title || "",
              subtitle: raw.subtitle || raw.description || "",
              genre: `${raw.genre || ""} • ${formats[0] || ""} • ${raw.duration || ""}`,
              poster: raw.backdrop || raw.image || "",
              status: raw.status || "",
              featured: raw.featured === true || raw.featured === "true",
            };
          })
          .filter((movie) => movie.status === "cartelera" && movie.featured);

        setFeaturedMovies(data);
      } catch (error) {
        console.error("Error fetching featured movies:", error);
      }
    };

    fetchFeaturedMovies();
  }, []);

  const next = useCallback(() => {
    setCurrent((prev) =>
      featuredMovies.length ? (prev + 1) % featuredMovies.length : 0
    );
  }, [featuredMovies.length]);

  const prev = useCallback(() => {
    setCurrent((prev) =>
      featuredMovies.length
        ? (prev - 1 + featuredMovies.length) % featuredMovies.length
        : 0
    );
  }, [featuredMovies.length]);

  useEffect(() => {
    if (!featuredMovies.length) return;

    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next, featuredMovies.length]);

  useEffect(() => {
    if (current >= featuredMovies.length && featuredMovies.length > 0) {
      setCurrent(0);
    }
  }, [featuredMovies, current]);

  if (!featuredMovies.length) {
    return (
      <section className="relative min-h-[92vh] flex items-end overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />
        <div className="relative z-10 container mx-auto px-4 pb-20 pt-32">
          <div className="max-w-2xl space-y-5">
            <p className="font-display text-sm uppercase tracking-[0.2em] text-neon-yellow">
              En cartelera ahora
            </p>
            <h1 className="font-display text-5xl md:text-7xl font-bold text-foreground leading-[1.05]">
              Cineplanet
            </h1>
            <p className="text-lg text-muted-foreground max-w-md font-body">
              Cargando películas destacadas...
            </p>
          </div>
        </div>
      </section>
    );
  }

  const movie = featuredMovies[current];

  return (
    <section className="relative min-h-[92vh] flex items-end overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={movie.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <img
            src={movie.poster}
            alt={movie.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/30 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <button
        onClick={prev}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full border border-border/60 bg-background/40 backdrop-blur flex items-center justify-center text-foreground hover:bg-primary/20 hover:border-primary/50 transition-all"
      >
        <ChevronLeft size={22} />
      </button>

      <button
        onClick={next}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full border border-border/60 bg-background/40 backdrop-blur flex items-center justify-center text-foreground hover:bg-primary/20 hover:border-primary/50 transition-all"
      >
        <ChevronRight size={22} />
      </button>

      <div className="relative z-10 container mx-auto px-4 pb-20 pt-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={movie.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="max-w-2xl space-y-5"
          >
            <p className="font-display text-sm uppercase tracking-[0.2em] text-neon-yellow">
              En cartelera ahora
            </p>

            <h1 className="font-display text-5xl md:text-7xl font-bold text-foreground leading-[1.05]">
              {movie.title.split(" ").map((word, i, arr) => (
                <span key={i}>
                  {i === arr.length - 1 ? (
                    <span className="text-glow-blue text-primary">{word}</span>
                  ) : (
                    word
                  )}{" "}
                </span>
              ))}
            </h1>

            <p className="text-lg text-muted-foreground max-w-md font-body">
              {movie.subtitle}
            </p>

            <p className="font-display text-xs uppercase tracking-widest text-muted-foreground">
              {movie.genre}
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link to={`/pelicula/${movie.id}`}>
                <Button variant="hero" size="xl">
                  Comprar Entradas
                </Button>
              </Link>
              <Link to="/cartelera">
                <Button variant="hero-secondary" size="xl">
                  Ver Cartelera
                </Button>
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-center mt-10">
          <div className="flex gap-2">
            {featuredMovies.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === current
                    ? "w-8 bg-primary shadow-[0_0_8px_hsl(var(--primary)/0.5)]"
                    : "w-2 bg-muted-foreground/40 hover:bg-muted-foreground/60"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
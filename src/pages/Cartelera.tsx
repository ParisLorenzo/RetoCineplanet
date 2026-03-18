import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ChevronDown, SlidersHorizontal } from "lucide-react";
import Navbar from "@/components/Navbar";
import MovieCard from "@/components/MovieCard";
import Footer from "@/components/Footer";
import canchitaImg from "@/assets/canchita.png";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";

const GENRES = ["Todos", "Sci-Fi", "Thriller", "Drama", "Acción"];
const FORMATS = ["Todos", "2D", "3D", "XTREAM"];
const DAYS = ["Hoy", "Mañana"];
const CINES = [
  "Todos",
  "Cineplanet San Miguel",
  "Cineplanet Salaverry",
  "Cineplanet Primavera",
  "Cineplanet Alcazar",
];

interface DropdownFilterProps {
  label: string;
  subtitle: string;
  items: string[];
  value: string;
  onChange: (v: string) => void;
}

const DropdownFilter = ({
  label,
  subtitle,
  items,
  value,
  onChange,
}: DropdownFilterProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative flex-1 min-w-[140px]">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-4 py-3 flex items-center justify-between gap-2 hover:bg-muted/30 transition-colors rounded-xl"
      >
        <div>
          <p className="font-display text-sm font-bold">{label}</p>
          <p className="text-xs text-muted-foreground font-body truncate">
            {value === "Todos" ? subtitle : value}
          </p>
        </div>
        <ChevronDown
          size={16}
          className={`text-muted-foreground transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute top-full left-0 right-0 mt-1 rounded-xl bg-card border border-border shadow-xl z-[60] overflow-hidden"
          >
            {items.map((item) => (
              <button
                key={item}
                onClick={() => {
                  onChange(item);
                  setOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-sm font-body transition-colors ${
                  value === item
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
              >
                {item}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Cartelera = () => {
  const [genre, setGenre] = useState("Todos");
  const [format, setFormat] = useState("Todos");
  const [day, setDay] = useState("Hoy");
  const [cine, setCine] = useState("Todos");
  const [search, setSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [movies, setMovies] = useState<any[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "premieres"));

        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title || "",
          poster: doc.data().image || "",
          duration: doc.data().duration || "",
          genre: doc.data().genre || "",
          rating: doc.data().rating || "",
          format: Array.isArray(doc.data().format)
            ? doc.data().format
            : doc.data().format
              ? [doc.data().format]
              : [],
          cine: Array.isArray(doc.data().cine) ? doc.data().cine : [],
          description: doc.data().description || "",
        }));

        setMovies(data);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchMovies();
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const suggestions = useMemo(() => {
    if (!search.trim()) return [];
    return movies
      .filter((m) => m.title.toLowerCase().includes(search.toLowerCase()))
      .slice(0, 5);
  }, [search, movies]);

  const filtered = useMemo(() => {
    return movies.filter((m) => {
      if (genre !== "Todos" && m.genre !== genre) return false;
      if (format !== "Todos" && !m.format.includes(format)) return false;
      if (cine !== "Todos" && !m.cine.includes(cine)) return false;
      if (search.trim() && !m.title.toLowerCase().includes(search.toLowerCase()))
        return false;
      return true;
    });
  }, [movies, genre, format, cine, search]);

  const hasActiveFilters =
    genre !== "Todos" || format !== "Todos" || cine !== "Todos" || day !== "Hoy";

  const resetFilters = () => {
    setGenre("Todos");
    setFormat("Todos");
    setDay("Hoy");
    setCine("Todos");
    setSearch("");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="starfield" />
      <Navbar />

      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-2">
            Cartelera
          </h1>
          <p className="text-muted-foreground font-body mb-8">
            Películas en cartelera ahora mismo
          </p>

          <div ref={searchRef} className="relative mb-6 max-w-lg">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Buscar película..."
              className="w-full h-12 rounded-xl bg-input pl-11 pr-10 font-body text-sm shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] focus:shadow-[0_0_0_2px_hsl(var(--primary)/0.8)] focus:outline-none transition-shadow"
            />

            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X size={16} />
              </button>
            )}

            <AnimatePresence>
              {showSuggestions && suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="absolute top-full left-0 right-0 mt-1 rounded-xl bg-card border border-border shadow-xl z-50 overflow-hidden"
                >
                  {suggestions.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => {
                        setSearch(m.title);
                        setShowSuggestions(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/50 transition-colors"
                    >
                      <img
                        src={m.poster}
                        alt={m.title}
                        className="h-12 w-8 rounded object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-display text-sm font-semibold truncate">
                          {m.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {m.genre} · {m.format.join(" / ")} · {m.duration}
                        </p>
                      </div>
                      <span className="text-xs text-primary font-display font-semibold shrink-0">
                        ★ {m.rating}
                      </span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="glass-panel rounded-2xl p-2 mb-10 flex flex-col sm:flex-row items-stretch gap-0 divide-y sm:divide-y-0 sm:divide-x divide-border/40 relative z-[50]">
            <DropdownFilter
              label="Por película"
              subtitle="Qué quieres ver"
              items={GENRES}
              value={genre}
              onChange={setGenre}
            />
            <DropdownFilter
              label="Por cine"
              subtitle="Elige tu Cineplanet"
              items={CINES}
              value={cine}
              onChange={setCine}
            />
            <DropdownFilter
              label="Por formato"
              subtitle="Cómo lo quieres ver"
              items={FORMATS}
              value={format}
              onChange={setFormat}
            />
            <DropdownFilter
              label="Por fecha"
              subtitle="Elige un día"
              items={DAYS}
              value={day}
              onChange={setDay}
            />

            <div className="flex items-center justify-center px-3 py-2">
              <button
                onClick={resetFilters}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-display text-xs uppercase tracking-wider transition-all ${
                  hasActiveFilters
                    ? "bg-primary text-primary-foreground shadow-[0_0_8px_hsl(var(--primary)/0.4)]"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <SlidersHorizontal size={14} />
                Filtrar
              </button>
            </div>
          </div>

          <motion.div
            layout
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
          >
            {filtered.map((movie) => (
              <motion.div
                key={movie.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <MovieCard {...movie} format={movie.format?.[0] || ""} />
              </motion.div>
            ))}
          </motion.div>

          {filtered.length === 0 && (
            <div className="text-center py-16 space-y-4">
              <img
                src={canchitaImg}
                alt="Canchita"
                className="h-24 w-24 mx-auto opacity-60"
              />
              <p className="text-muted-foreground font-body">
                No hay películas con esos filtros. ¡Intenta otra búsqueda!
              </p>
              <button
                onClick={resetFilters}
                className="text-primary font-display text-sm font-semibold hover:underline"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Cartelera;
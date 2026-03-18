import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { MapPin, Play, X, AlertCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";

interface MovieData {
  title: string;
  poster: string;
  backdrop: string;
  duration: string;
  genre: string;
  rating: string;
  format: string[];
  year: string;
  director: string;
  cast: string;
  synopsis: string;
  language: string[];
  trailerYoutubeId: string;
  cine: string[];
  gallery: string[];
}

const CINEMAS = [
  { name: "Cineplanet San Miguel", address: "Av. La Marina 2000" },
  { name: "Cineplanet Salaverry", address: "Av. Salaverry 2370" },
  { name: "Cineplanet Primavera", address: "Av. Angamos Este 2681" },
  { name: "Cineplanet Alcazar", address: "Av. Santa Cruz 814" },
];

const SHOWTIMES = ["14:30", "16:45", "19:00", "21:15", "23:30"];

const MovieDetail = () => {
  const { movieId } = useParams();
  const [searchParams] = useSearchParams();

  const [movie, setMovie] = useState<MovieData | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedCinema, setSelectedCinema] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [errors, setErrors] = useState<{ cinema?: boolean; time?: boolean }>({});

  const topRef = useRef<HTMLDivElement>(null);
  const showtimesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMovie = async () => {
      if (!movieId) {
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, "premieres", movieId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();

          setMovie({
            title: data.title || "",
            poster: data.image || "",
            backdrop: data.backdrop || data.image || "",
            duration: data.duration || "",
            genre: data.genre || "",
            rating: data.rating || "",
            format: Array.isArray(data.format)
              ? data.format
              : data.format
                ? [data.format]
                : [],
            year: data.year || "2026",
            director: data.director || "Próximamente",
            cast: data.cast || "Próximamente",
            synopsis: data.description || "Sinopsis próximamente.",
            language: Array.isArray(data.language)
              ? data.language
              : data.language
                ? [data.language]
                : [],
            trailerYoutubeId: data.trailerYoutubeId || "zSWdZVtXT7E",
            cine: Array.isArray(data.cine) ? data.cine : [],
            gallery: Array.isArray(data.gallery) ? data.gallery : [],
          });
        } else {
          setMovie(null);
        }
      } catch (error) {
        console.error("Error fetching movie detail:", error);
        setMovie(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [movieId]);

  useEffect(() => {
    if (searchParams.get("section") === "showtimes" && showtimesRef.current) {
      setTimeout(() => {
        showtimesRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 500);
    }
  }, [searchParams, movie]);

  const handleCinemaSelect = (i: number) => {
    setSelectedCinema(i);
    setSelectedTime(null);
    setErrors({});
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleContinue = () => {
    const newErrors: { cinema?: boolean; time?: boolean } = {};
    if (selectedCinema === null) newErrors.cinema = true;
    if (!selectedTime) newErrors.time = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="starfield" />
        <Navbar />
        <div className="pt-32 flex items-center justify-center">
          <p className="text-muted-foreground">Cargando película...</p>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-background">
        <div className="starfield" />
        <Navbar />
        <div className="pt-32 flex items-center justify-center">
          <p className="text-muted-foreground">Película no encontrada</p>
        </div>
      </div>
    );
  }

  const availableCinemas = CINEMAS.filter((cinema) =>
    movie.cine.includes(cinema.name)
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="starfield" />
      <Navbar />

      <div ref={topRef} className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <img
          src={movie.backdrop}
          alt={movie.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />
      </div>

      <div className="container mx-auto px-4 -mt-40 relative z-10 pb-16">
        <div className="flex flex-col md:flex-row gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-56 md:w-72 shrink-0 mx-auto md:mx-0"
          >
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-full h-[420px] md:h-[520px] object-cover rounded-xl shadow-2xl border border-border/40"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex-1 space-y-4"
          >
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <h1 className="font-display text-3xl md:text-5xl font-bold">
                  {movie.title}
                </h1>
                <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-muted-foreground font-body">
                  <span>{movie.year}</span>
                  <span>|</span>
                  <span>{movie.duration}</span>
                  <span>|</span>
                  <span>{movie.language.length > 0 ? movie.language.join(" / ") : "Español"}</span>
                </div>
              </div>

              <div className="h-16 w-16 rounded-full border-2 border-neon-yellow flex items-center justify-center shrink-0">
                <span className="font-display text-xl font-bold text-neon-yellow">
                  {movie.rating}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full bg-primary/20 text-primary font-display text-xs font-semibold uppercase">
                {movie.genre}
              </span>

              {movie.format.map((item) => (
                <span
                  key={item}
                  className="px-3 py-1 rounded-full bg-secondary/20 text-secondary font-display text-xs font-semibold uppercase"
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground font-body">
                <span className="font-semibold text-foreground">Dir:</span>{" "}
                {movie.director}
              </p>
              <p className="text-sm text-muted-foreground font-body">
                <span className="font-semibold text-foreground">Cast:</span>{" "}
                {movie.cast}
              </p>
            </div>

            <p className="text-muted-foreground font-body leading-relaxed">
              {movie.synopsis}
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-12 space-y-4"
        >
          <h2 className="font-display text-2xl font-bold">Trailer</h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2">
              {!showTrailer ? (
                <button
                  onClick={() => setShowTrailer(true)}
                  className="relative w-full aspect-video rounded-2xl overflow-hidden group cursor-pointer"
                >
                  <img
                    src={movie.backdrop}
                    alt="Trailer thumbnail"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-background/50 flex items-center justify-center group-hover:bg-background/30 transition-colors">
                    <div className="h-16 w-16 rounded-full bg-primary/90 flex items-center justify-center shadow-[0_0_20px_hsl(var(--primary)/0.5)] group-hover:scale-110 transition-transform">
                      <Play size={28} className="text-primary-foreground ml-1" />
                    </div>
                  </div>
                </button>
              ) : (
                /* Trailer - se ahorra espacio en el firebase agregnado solo el codigo */
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden">
                  <iframe
                    src={`https://www.youtube.com/embed/${movie.trailerYoutubeId}?autoplay=1&rel=0`}
                    title={`${movie.title} trailer`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                  <button
                    onClick={() => setShowTrailer(false)}
                    className="absolute top-3 right-3 h-8 w-8 rounded-full bg-background/80 flex items-center justify-center text-foreground hover:bg-background transition-colors z-10"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {movie.gallery.slice(0, 6).map((img, index) => (
                <div
                  key={index}
                  className="rounded-xl overflow-hidden border border-border/40"
                >
                  <img
                    src={img}
                    alt={`${movie.title} galería ${index + 1}`}
                    className="w-full h-32 md:h-36 object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          ref={showtimesRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-12 space-y-6"
        >
          <h2 className="font-display text-2xl font-bold">
            Selecciona Cine y Horario
          </h2>

          {errors.cinema && (
            <p className="text-sm text-destructive font-body flex items-center gap-1.5">
              <AlertCircle size={14} /> Selecciona un cine para continuar
            </p>
          )}

          <div className="space-y-4">
            {availableCinemas.map((cinema, i) => (
              <div
                key={cinema.name}
                className={`glass-panel rounded-xl p-5 transition-all cursor-pointer ${
                  selectedCinema === i
                    ? "border-primary/60 shadow-[0_0_12px_hsl(var(--primary)/0.2)]"
                    : "hover:border-primary/30"
                }`}
                onClick={() => handleCinemaSelect(i)}
              >
                <div className="flex items-center gap-3 mb-3">
                  <MapPin size={18} className="text-primary" />
                  <div>
                    <h3 className="font-display font-semibold">{cinema.name}</h3>
                    <p className="text-xs text-muted-foreground font-body">
                      {cinema.address}
                    </p>
                  </div>
                </div>

                {selectedCinema === i && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-3 pt-3 border-t border-border/40 space-y-2"
                  >
                    <div className="flex flex-wrap gap-2">
                      {SHOWTIMES.map((time) => (
                        <button
                          key={time}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTime(time);
                            setErrors({});
                          }}
                          className={`px-4 py-2 rounded-lg font-display text-sm transition-all ${
                            selectedTime === time
                              ? "bg-primary text-primary-foreground shadow-[0_0_8px_hsl(var(--primary)/0.4)]"
                              : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>

                    {errors.time && selectedCinema === i && (
                      <p className="text-sm text-destructive font-body flex items-center gap-1.5">
                        <AlertCircle size={14} /> Selecciona un horario
                      </p>
                    )}
                  </motion.div>
                )}
              </div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center"
          >
            {selectedCinema !== null && selectedTime ? (
              <Link to={`/seats/${movieId}`}>
                <Button variant="hero" size="xl">
                  Seleccionar Asientos
                </Button>
              </Link>
            ) : (
              <Button variant="hero" size="xl" onClick={handleContinue}>
                Seleccionar Asientos
              </Button>
            )}
          </motion.div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default MovieDetail;
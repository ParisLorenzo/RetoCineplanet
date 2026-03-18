import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import MovieSection from "@/components/MovieSection";
import PromotionsSection from "@/components/PromotionsSection";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import canchitaImg from "@/assets/canchita.png";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";

const Index = () => {
  const [carteleraMovies, setCarteleraMovies] = useState<any[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<any[]>([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "premieres"));

        const data = querySnapshot.docs.map((doc) => {
          const raw = doc.data();

          const formats = Array.isArray(raw.format)
            ? raw.format
            : raw.format
              ? [raw.format]
              : [];

          return {
            id: doc.id,
            title: raw.title || "",
            poster: raw.image || "",
            duration: raw.duration || "",
            genre: raw.genre || "",
            rating: raw.rating || "—",
            format: formats[0] || "",
            status: raw.status || "cartelera",
          };
        });

        setCarteleraMovies(data.filter((movie) => movie.status === "cartelera"));
        setUpcomingMovies(data.filter((movie) => movie.status === "upcoming"));
      } catch (error) {
        console.error("Error fetching home movies:", error);
      }
    };

    fetchMovies();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="starfield" />
      <Navbar />
      <HeroSection />

      <MovieSection
        title="En Cartelera"
        subtitle="Películas que no te puedes perder"
        movies={carteleraMovies}
      />

      <MovieSection
        title="Próximos Estrenos"
        subtitle="Muy pronto en tu pantalla"
        movies={upcomingMovies}
      />

      <PromotionsSection />

      <section className="py-16 section-dark">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <img
              src={canchitaImg}
              alt="Canchita"
              className="h-20 w-20 object-contain animate-float"
            />
            <div className="text-left">
              <h2 className="font-display text-3xl md:text-4xl font-bold">
                Dulcería
              </h2>
              <p className="text-muted-foreground font-body text-sm mt-1">
                Encuentra tus snacks favoritos para la función
              </p>
            </div>
          </div>
          <Link to="/dulceria">
            <Button variant="hero" size="lg">
              Ver Dulcería
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
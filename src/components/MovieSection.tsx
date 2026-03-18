import { motion } from "framer-motion";
import MovieCard from "@/components/MovieCard";

interface MovieItem {
  id: string;
  title: string;
  poster: string;
  duration: string;
  genre: string;
  rating?: string;
  format?: string;
}

interface MovieSectionProps {
  title: string;
  subtitle?: string;
  movies?: MovieItem[];
  dark?: boolean;
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, duration: 0.4, bounce: 0.1 },
  },
};

const MovieSection = ({
  title,
  subtitle,
  movies = [],
  dark = true,
}: MovieSectionProps) => {
  if (!movies.length) return null;

  return (
    <section className={`py-16 ${dark ? "section-dark" : "section-light"}`}>
      <div className="container mx-auto px-4">
        <div className="mb-10">
          <h2 className="font-display text-3xl md:text-4xl font-bold">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-2 text-muted-foreground font-body">{subtitle}</p>
          )}
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {movies.map((movie) => (
            <motion.div key={movie.id} variants={item}>
              <MovieCard {...movie} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default MovieSection;
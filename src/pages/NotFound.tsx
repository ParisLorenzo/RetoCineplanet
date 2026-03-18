import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import canchitaImg from "@/assets/canchita.png";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-6 px-4">
        <img src={canchitaImg} alt="Canchita" className="h-32 w-32 mx-auto" />
        <h1 className="font-display text-6xl font-bold text-primary">404</h1>
        <p className="text-xl text-muted-foreground font-body">¡Ups! Esta página no existe</p>
        <p className="text-sm text-muted-foreground font-body">Parece que te perdiste en el cine</p>
        <Link to="/" className="inline-block px-6 py-3 rounded-xl bg-primary text-primary-foreground font-display font-semibold hover:bg-primary/90 transition-colors">
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

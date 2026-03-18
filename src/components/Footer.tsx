import { motion } from "framer-motion";

const Footer = () => (
  <footer className="section-dark border-t border-border/40 py-4">
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
        </div>
        <p className="text-sm text-muted-foreground font-body">
          © 2026 Cineplanet. Reto Cine Paris Lorenzo
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;

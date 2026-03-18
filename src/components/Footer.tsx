import { motion } from "framer-motion";

const Footer = () => (
  <footer className="section-dark border-t border-border/40 py-12">
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
            <span className="font-display text-xs font-bold text-primary-foreground">CP</span>
          </div>
          <span className="font-display text-lg font-bold tracking-tight">CINEPLANET</span>
        </div>
        <p className="text-sm text-muted-foreground font-body">
          © 2026 Cineplanet. Tu cine cósmico.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;

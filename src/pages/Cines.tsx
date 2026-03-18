import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock, Phone, Film } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const CINES = [
  { id: 1, name: "Cineplanet San Miguel", address: "Av. La Marina 2000, San Miguel", phone: "(01) 611-1234", hours: "11:00 - 23:30", lat: -12.0769, lng: -77.0856 },
  { id: 2, name: "Cineplanet Salaverry", address: "Av. Salaverry 2370, Jesús María", phone: "(01) 611-5678", hours: "11:00 - 00:00", lat: -12.0882, lng: -77.0453 },
  { id: 3, name: "Cineplanet Primavera", address: "Av. Angamos Este 2681, Surquillo", phone: "(01) 611-9012", hours: "11:00 - 23:00", lat: -12.1105, lng: -77.0006 },
  { id: 4, name: "Cineplanet Centro Cívico", address: "Av. Garcilaso de la Vega 1337, Cercado de Lima", phone: "(01) 611-3456", hours: "10:00 - 23:30", lat: -12.0568, lng: -77.0375 },
  { id: 5, name: "Cineplanet Mall del Sur", address: "Av. Pedro Miotta 1410, San Juan de Miraflores", phone: "(01) 611-7890", hours: "11:00 - 23:00", lat: -12.1573, lng: -76.9713 },
  { id: 6, name: "Cineplanet Alcázar", address: "Av. Petit Thouars 4550, Miraflores", phone: "(01) 611-2345", hours: "11:00 - 00:00", lat: -12.1216, lng: -77.0296 },
];

const getMapUrl = (cine: typeof CINES[0] | null) => {
  if (!cine) return "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62435.78!2d-77.05!3d-12.1!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105c8b5d35296ad%3A0x15f0bda5ccbd31eb!2sLima!5e0!3m2!1ses!2spe!4v1";
  return `https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3000!2d${cine.lng}!3d${cine.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2z!5e0!3m2!1ses!2spe!4v1`;
};

const Cines = () => {
  const [selected, setSelected] = useState<number | null>(null);
  const selectedCine = CINES.find(c => c.id === selected) || null;

  return (
    <div className="min-h-screen bg-background">
      <div className="starfield" />
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-2">Cines</h1>
          <p className="text-muted-foreground font-body mb-10">Encuentra tu cine más cercano</p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Map */}
            <div className="rounded-xl overflow-hidden border border-border/40 h-[350px] sm:h-[400px] lg:h-auto lg:min-h-[500px] relative order-2 lg:order-1">
              <iframe
                key={selected}
                title="Mapa de cines"
                src={getMapUrl(selectedCine)}
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              {selectedCine && (
                <div className="absolute bottom-4 left-4 right-4 glass-panel rounded-xl p-3 flex items-center gap-3">
                  <MapPin size={18} className="text-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-sm font-semibold truncate">{selectedCine.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{selectedCine.address}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Cinema list */}
            <div className="space-y-3 order-1 lg:order-2">
              {CINES.map((cine) => (
                <motion.div
                  key={cine.id}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => setSelected(selected === cine.id ? null : cine.id)}
                  className={`glass-panel rounded-xl p-5 cursor-pointer transition-all ${
                    selected === cine.id
                      ? "border-primary/60 shadow-[0_0_12px_hsl(var(--primary)/0.2)] ring-1 ring-primary/30"
                      : "hover:border-primary/30"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      selected === cine.id ? "bg-primary text-primary-foreground" : "bg-primary/20 text-primary"
                    }`}>
                      <MapPin size={18} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display font-semibold text-foreground">{cine.name}</h3>
                      <p className="text-sm text-muted-foreground font-body mt-1">{cine.address}</p>

                      <AnimatePresence>
                        {selected === cine.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-3 pt-3 border-t border-border/40 space-y-2 overflow-hidden"
                          >
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Phone size={14} />
                              <span>{cine.phone}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock size={14} />
                              <span>{cine.hours}</span>
                            </div>
                            <Link to="/cartelera">
                              <Button variant="outline" size="sm" className="mt-2 gap-2">
                                <Film size={14} />
                                Ver cartelera en este cine
                              </Button>
                            </Link>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cines;

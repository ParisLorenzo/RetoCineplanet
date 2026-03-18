import { Link, useLocation } from "react-router-dom";
import { Menu, X, Sun, Moon, User } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "@/hooks/use-theme";
import CineLogo from "@/assets/CineLogo.png";
import CineLogoColor from "@/assets/CineLogoColor.png";

const navLinks = [
  { label: "Cartelera", path: "/cartelera" },
  { label: "Cines", path: "/cines" },
  { label: "Dulcería", path: "/dulceria" },
];

const Navbar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-[9999] glass-panel border-b border-border/40">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <img
            src={theme === "dark" ? CineLogo : CineLogoColor}
            alt="Cineplanet"
            className="h-10 w-auto object-contain transition-all duration-300"
          />
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`relative px-4 py-2 font-display text-sm uppercase tracking-wider transition-colors duration-200 ${
                location.pathname === link.path
                  ? "text-neon-yellow"
                  : "text-muted-foreground hover:text-foreground"
              } after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:h-0.5 after:bg-neon-yellow after:transition-all after:duration-300 ${
                location.pathname === link.path
                  ? "after:w-full"
                  : "after:w-0 hover:after:w-full"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="h-9 w-9 rounded-full border border-border/60 bg-background/40 backdrop-blur flex items-center justify-center text-foreground hover:bg-primary/20 hover:border-primary/50 transition-all"
            aria-label="Cambiar tema"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {user ? (
            <button
              onClick={() => {
                localStorage.removeItem("user");
                window.location.reload();
              }}
              className="h-9 px-4 rounded-full border border-border/60 bg-background/40 backdrop-blur flex items-center gap-2 text-foreground hover:bg-primary/20 hover:border-primary/50 transition-all font-display text-xs uppercase tracking-wider"
            >
              <User size={16} />
              <span className="hidden sm:inline">{user.name}</span>
            </button>
          ) : (
            <Link to="/login">
              <button className="h-9 px-4 rounded-full border border-border/60 bg-background/40 backdrop-blur flex items-center gap-2 text-foreground hover:bg-primary/20 hover:border-primary/50 transition-all font-display text-xs uppercase tracking-wider">
                <User size={16} />
                <span className="hidden sm:inline">Ingresar</span>
              </button>
            </Link>
          )}

          <button
            className="md:hidden text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden glass-panel border-t border-border/40 animate-fade-in">
          <div className="flex flex-col gap-1 p-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={`px-4 py-3 rounded-lg font-display text-sm uppercase tracking-wider transition-colors ${
                  location.pathname === link.path
                    ? "text-neon-yellow bg-muted"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Shield } from "lucide-react";
import logoIra from "@/assets/logo-ira-express.png";

const links = [
  { to: "/", label: "Accueil" },
  { to: "/gaz", label: "IRA Gaz" },
  { to: "/pharma", label: "IRA Pharma" },
  { to: "/colis", label: "IRA Colis" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={logoIra} alt="IRA EXPRESS" className="h-10 w-10 object-contain" />
          <span className="font-display font-bold text-lg text-gradient-brand">IRA EXPRESS</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`text-sm font-body transition-colors ${
                location.pathname === l.to ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link to="/admin" className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-primary">
            <Shield className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <Link to="/admin" className="p-2 text-muted-foreground">
             <Shield className="w-4 h-4" />
          </Link>
          <button className="text-foreground" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-background border-b border-border"
          >
            <div className="flex flex-col px-4 py-4 gap-3">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className={`text-sm font-body py-2 ${
                    location.pathname === l.to ? "text-primary font-semibold" : "text-muted-foreground"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
              <hr className="border-border" />
              <Link
                to="/admin"
                onClick={() => setOpen(false)}
                className="text-sm font-body py-2 text-muted-foreground flex items-center gap-2"
              >
                <Shield className="w-4 h-4" /> Administration
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

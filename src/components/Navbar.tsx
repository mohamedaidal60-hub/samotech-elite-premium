import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Sun, Moon, Globe } from "lucide-react";
import logo from "@/assets/samotech-logo.png";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  const navLinks = [
    { to: "/", label: t("nav.home") },
    { to: "/advertisement", label: t("nav.advertisement") },
    { to: "/development", label: t("nav.development") },
    { to: "/automation", label: t("nav.automation") },
    { to: "/workflow", label: t("nav.workflow") },
    { to: "/contact", label: t("nav.contact") },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const isActive = (to: string) =>
    to === "/" ? location.pathname === "/" : location.pathname === to;

  const langLabels: Record<string, string> = { fr: "FR", en: "EN", ar: "AR" };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? "glass-card border-b border-border/40 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <img
            src={logo}
            alt="SamoTech"
            className="h-9 w-9 object-contain transition-transform group-hover:scale-110"
          />
          <span className="text-lg sm:text-xl font-bold gradient-text whitespace-nowrap">
            SamoTech
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium transition-colors hover:text-primary relative ${
                isActive(link.to) ? "text-primary" : "text-foreground/80"
              }`}
            >
              {link.label}
              {isActive(link.to) && (
                <span className="absolute -bottom-1.5 left-0 right-0 h-0.5 gradient-bg rounded-full" />
              )}
            </Link>
          ))}
        </div>

        {/* Right cluster */}
        <div className="flex items-center gap-2">
          {/* Language */}
          <DropdownMenu>
            <DropdownMenuTrigger
              className="glass-card px-2.5 py-2 rounded-lg flex items-center gap-1.5 text-xs font-semibold hover:scale-105 transition-all"
              aria-label="Change language"
            >
              <Globe size={15} className="text-primary" />
              <span>{langLabels[language]}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass-card">
              <DropdownMenuItem onClick={() => setLanguage("fr")}>🇫🇷 Français</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("en")}>🇬🇧 English</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("ar")}>🇸🇦 العربية</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme */}
          <button
            onClick={toggleTheme}
            aria-label={theme === "dark" ? t("theme.toggle.light") : t("theme.toggle.dark")}
            className="glass-card p-2 rounded-lg hover:scale-105 transition-all"
          >
            {theme === "dark" ? (
              <Sun size={16} className="text-accent" />
            ) : (
              <Moon size={16} className="text-primary" />
            )}
          </button>

          {/* CTA desktop */}
          <Link
            to="/contact"
            className="hidden md:inline-flex gradient-bg px-4 py-2 rounded-lg text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity ml-1"
          >
            {t("nav.quote")}
          </Link>

          {/* Hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden glass-card p-2 rounded-lg"
            aria-label="Menu"
            aria-expanded={open}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ${
          open ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="glass-card border-t border-border/40 px-6 py-5 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`block py-3 px-3 rounded-lg text-base font-medium transition-colors ${
                isActive(link.to)
                  ? "text-primary bg-primary/10"
                  : "text-foreground/80 hover:bg-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/contact"
            className="block gradient-bg px-4 py-3 rounded-lg text-sm font-semibold text-primary-foreground text-center mt-3"
          >
            {t("nav.quote")}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

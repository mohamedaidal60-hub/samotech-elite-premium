import { Link } from "react-router-dom";
import logo from "@/assets/samotech-logo.png";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();
  return (
    <footer className="border-t border-border/40 py-12 mt-16 relative">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src={logo} alt="SamoTech" className="h-9 w-9 object-contain" />
            <div>
              <div className="text-lg font-bold gradient-text">SamoTech</div>
              <div className="text-xs text-muted-foreground">{t("footer.tagline")}</div>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">{t("nav.home")}</Link>
            <Link to="/advertisement" className="hover:text-primary transition-colors">{t("nav.advertisement")}</Link>
            <Link to="/development" className="hover:text-primary transition-colors">{t("nav.development")}</Link>
            <Link to="/automation" className="hover:text-primary transition-colors">{t("nav.automation")}</Link>
            <Link to="/workflow" className="hover:text-primary transition-colors">{t("nav.workflow")}</Link>
            <Link to="/contact" className="hover:text-primary transition-colors">{t("nav.contact")}</Link>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 SamoTech. {t("footer.rights")}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

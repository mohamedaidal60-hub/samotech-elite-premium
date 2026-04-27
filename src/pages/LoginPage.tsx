import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Mail, Lock, ArrowRight, LogIn } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const LoginPage = () => {
  const { t, dir } = useLanguage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        toast.success("Connexion réussie !");
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast.error(error.message || "Email ou mot de passe incorrect");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 flex items-center justify-center cosmic-bg relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-secondary/10 blur-[100px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md px-6 relative z-10"
      >
        <div className="glass-card p-10 rounded-[2.5rem] border-white/5 shadow-premium">
          <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-6 shadow-glow">
              <LogIn size={32} className="text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-black mb-3">Bon retour !</h1>
            <p className="text-muted-foreground">Accédez à votre espace client SamoTech</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
              <input
                type="email"
                placeholder="Email"
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-primary/50 transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
              <input
                type="password"
                placeholder="Mot de passe"
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-primary/50 transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="text-right">
              <button type="button" className="text-xs text-primary font-bold hover:underline">
                Mot de passe oublié ?
              </button>
            </div>

            <button
              disabled={loading}
              className="w-full gradient-bg py-5 rounded-2xl font-black text-primary-foreground shadow-glow hover:opacity-90 transition-all flex items-center justify-center gap-3 group"
            >
              {loading ? "Connexion..." : "Se connecter"}
              <ArrowRight size={20} className={`transition-transform group-hover:translate-x-1 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
            </button>
          </form>

          <div className="mt-10 text-center text-sm text-muted-foreground border-t border-white/5 pt-8">
            Nouveau chez SamoTech ?{" "}
            <Link to="/register" className="text-primary font-bold hover:underline">
              Créer un compte
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;

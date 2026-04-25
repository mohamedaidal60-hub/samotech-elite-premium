import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin, isAuthenticated } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Lock, Mail, Shield } from "lucide-react";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("samotechgpt@gmail.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/admin");
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginAdmin(email, password);
      navigate("/admin");
    } catch (error: any) {
      toast({ title: "Connexion impossible", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center cosmic-bg pt-24 pb-12 px-6">
      <div className="glass-card-glow w-full max-w-md p-8 rounded-2xl">
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto rounded-2xl gradient-bg flex items-center justify-center mb-4 animate-pulse-glow">
            <Shield size={26} className="text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold gradient-text">SamoTech Admin</h1>
          <p className="text-sm text-muted-foreground mt-1">Espace réservé administrateur</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <Label className="mb-2 block">Email</Label>
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-9" required />
            </div>
          </div>
          <div>
            <Label className="mb-2 block">Mot de passe</Label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-9" required />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full gradient-bg py-3 rounded-xl text-sm font-semibold text-primary-foreground hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Connexion…" : "Se connecter"}
          </button>
        </form>

        <p className="text-xs text-muted-foreground text-center mt-6">
          Compte par défaut : samotechgpt@gmail.com — pensez à changer le mot de passe sur Vercel.
        </p>
      </div>
    </main>
  );
};

export default AdminLogin;

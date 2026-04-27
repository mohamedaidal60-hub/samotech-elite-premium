import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  LayoutDashboard, 
  Package, 
  FileText, 
  Upload, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  FileUp,
  Download,
  Percent
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const ClientDashboard = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }
      setUser(user);
      fetchOrders(user.id);
    };

    checkUser();
  }, []);

  const fetchOrders = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          packs (name, category)
        `)
        .eq("client_id", userId);

      if (error) throw error;
      setOrders(data || []);
    } catch (error: any) {
      toast.error("Erreur lors de la récupération des commandes");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle2 className="text-green-500" size={18} />;
      case "in_progress": return <Clock className="text-blue-500 animate-pulse" size={18} />;
      case "pending_payment": return <AlertCircle className="text-yellow-500" size={18} />;
      default: return <Clock className="text-muted-foreground" size={18} />;
    }
  };

  const getStatusLabel = (status: string) => {
    return t(`dashboard.status.${status}` as any) || status;
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center cosmic-bg">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
      />
    </div>
  );

  return (
    <div className="min-h-screen pt-28 pb-12 cosmic-bg">
      <div className="container mx-auto px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-3xl md:text-4xl font-black mb-2">
              {t("dashboard.welcome")} <span className="gradient-text">{user?.user_metadata?.full_name || "Client"}</span>
            </h1>
            <p className="text-muted-foreground">Suivez l'évolution de vos projets en temps réel.</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => navigate("/packs")}
              className="gradient-bg px-6 py-3 rounded-xl font-bold text-primary-foreground shadow-glow hover:scale-105 transition-all"
            >
              Nouveau Projet
            </button>
          </div>
        </div>

        {/* Stats / Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="glass-card p-6 rounded-3xl border-white/5 flex items-center gap-5">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Package size={24} />
            </div>
            <div>
              <div className="text-2xl font-black">{orders.length}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Projets Actifs</div>
            </div>
          </div>
          <div className="glass-card p-6 rounded-3xl border-white/5 flex items-center gap-5">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
              <Clock size={24} />
            </div>
            <div>
              <div className="text-2xl font-black">
                {orders.filter(o => o.status === 'in_progress').length}
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-widest font-bold">En Cours</div>
            </div>
          </div>
          <div className="glass-card p-6 rounded-3xl border-white/5 flex items-center gap-5">
            <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <div className="text-2xl font-black">
                {orders.filter(o => o.status === 'completed').length}
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Livrables</div>
            </div>
          </div>
        </div>

        {/* Orders Table/List */}
        <div className="glass-card rounded-[2.5rem] border-white/5 overflow-hidden shadow-premium">
          <div className="px-8 py-6 border-b border-white/5 bg-white/5">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <LayoutDashboard size={20} className="text-primary" />
              {t("dashboard.my_orders")}
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs uppercase tracking-widest text-muted-foreground bg-white/[0.02]">
                  <th className="px-8 py-4 font-bold">Projet / Pack</th>
                  <th className="px-8 py-4 font-bold">Status</th>
                  <th className="px-8 py-4 font-bold">Avancement</th>
                  <th className="px-8 py-4 font-bold">Documents</th>
                  <th className="px-8 py-4 font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center text-muted-foreground">
                      Aucune commande pour le moment.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="px-8 py-6">
                        <div className="font-bold text-foreground group-hover:text-primary transition-colors">
                          {order.packs?.name || order.custom_product_name || "Commande Personnalisée"}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">{order.packs?.category || "Service"}</div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          {getStatusIcon(order.status)}
                          {getStatusLabel(order.status)}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="w-32">
                          <div className="flex justify-between text-[10px] font-bold mb-1 uppercase tracking-tighter">
                            <span>Progression</span>
                            <span>{order.progress_percent}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${order.progress_percent}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className="h-full gradient-bg" 
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex gap-3">
                          <button 
                            title={t("dashboard.upload.specs")}
                            className="p-2 rounded-lg bg-white/5 hover:bg-primary/20 text-muted-foreground hover:text-primary transition-all"
                          >
                            <FileUp size={18} />
                          </button>
                          <button 
                            title={t("dashboard.upload.receipt")}
                            className="p-2 rounded-lg bg-white/5 hover:bg-secondary/20 text-muted-foreground hover:text-secondary transition-all"
                          >
                            <Upload size={18} />
                          </button>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button className="text-xs font-bold bg-white/5 px-4 py-2 rounded-full hover:bg-white/10 transition-all border border-white/5">
                          Détails
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ClientDashboard;

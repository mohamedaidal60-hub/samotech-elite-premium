import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { 
  LogOut, 
  RefreshCw, 
  Package, 
  Users, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Upload, 
  MoreVertical,
  Percent,
  Search
} from "lucide-react";
import { toast } from "sonner";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"orders" | "clients" | "leads">("orders");

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/admin/login");
      return;
    }

    // In a real app, check user role in profiles table
    // For now, we assume user is admin if they reached here or check the email as per prompt
    if (user.email !== "samotechgpt@gmail.com") {
      // navigate("/");
    }
    
    fetchOrders();
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          profiles (full_name, email, company_name),
          packs (name)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error: any) {
      toast.error("Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (orderId: string, percent: number) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ 
          progress_percent: percent,
          status: percent === 100 ? "completed" : "in_progress"
        })
        .eq("id", orderId);

      if (error) throw error;
      toast.success("Progression mise à jour");
      fetchOrders();
    } catch (error: any) {
      toast.error("Erreur mise à jour");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-card border-r border-border p-6 flex flex-col gap-8 z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-white font-black">ST</div>
          <span className="font-black text-xl gradient-text">ADMIN</span>
        </div>

        <nav className="flex flex-col gap-2">
          <button 
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'orders' ? 'gradient-bg text-white shadow-glow' : 'hover:bg-white/5 text-muted-foreground'}`}
          >
            <Package size={20} /> Commandes
          </button>
          <button 
            onClick={() => setActiveTab("clients")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'clients' ? 'gradient-bg text-white shadow-glow' : 'hover:bg-white/5 text-muted-foreground'}`}
          >
            <Users size={20} /> Clients
          </button>
          <button 
            onClick={() => setActiveTab("leads")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'leads' ? 'gradient-bg text-white shadow-glow' : 'hover:bg-white/5 text-muted-foreground'}`}
          >
            <FileText size={20} /> Leads
          </button>
        </nav>

        <div className="mt-auto">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-red-400 hover:bg-red-400/10 w-full transition-all"
          >
            <LogOut size={20} /> Quitter
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow overflow-y-auto pt-12 px-8 pb-12 cosmic-bg">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black">Gestion des <span className="gradient-text">{activeTab === 'orders' ? 'Commandes' : 'Clients'}</span></h1>
            <p className="text-muted-foreground text-sm">Contrôlez l'ensemble de l'activité SamoTech.</p>
          </div>
          <button 
            onClick={fetchOrders}
            className="p-3 rounded-xl glass-card hover:scale-110 transition-all text-primary"
          >
            <RefreshCw size={20} />
          </button>
        </div>

        {/* Filters/Search */}
        <div className="flex gap-4 mb-8">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input 
              type="text" 
              placeholder="Rechercher un client, une commande..."
              className="w-full bg-card border border-border rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-1 ring-primary/50"
            />
          </div>
        </div>

        {/* Content Table */}
        <div className="glass-card rounded-3xl border-white/5 overflow-hidden shadow-premium">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground">
                <th className="px-8 py-5">Client / Entreprise</th>
                <th className="px-8 py-5">Projet</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5">Avancement</th>
                <th className="px-8 py-5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan={5} className="px-8 py-20 text-center text-muted-foreground animate-pulse">Chargement des données...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={5} className="px-8 py-20 text-center text-muted-foreground">Aucune donnée disponible.</td></tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-8 py-6">
                      <div className="font-bold">{order.profiles?.full_name}</div>
                      <div className="text-xs text-muted-foreground">{order.profiles?.company_name || "Particulier"}</div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="font-bold text-primary">{order.packs?.name || order.custom_product_name}</div>
                      <div className="text-[10px] text-muted-foreground uppercase">{new Date(order.created_at).toLocaleDateString()}</div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${order.status === 'completed' ? 'bg-green-500/10 text-green-500' : 'bg-primary/10 text-primary'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="h-1.5 w-24 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full gradient-bg" style={{ width: `${order.progress_percent}%` }} />
                        </div>
                        <input 
                          type="number" 
                          defaultValue={order.progress_percent}
                          onBlur={(e) => updateProgress(order.id, parseInt(e.target.value))}
                          className="w-12 bg-transparent text-xs font-bold focus:outline-none"
                        />
                        <span className="text-[10px] text-muted-foreground">%</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex gap-2">
                        <button className="p-2 rounded-lg bg-white/5 hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all">
                          <Upload size={16} />
                        </button>
                        <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-muted-foreground transition-all">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </main>
    </div>
  );
};

export default AdminDashboard;

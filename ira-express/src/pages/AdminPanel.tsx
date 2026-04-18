import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Flame, Heart, Package, RefreshCw, Loader2, 
  ShoppingBag, Clock, CheckCircle2, LayoutDashboard,
  ShieldCheck, LogOut, Search, MapPin, Phone
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";

type ServiceType = "gaz" | "pharma" | "colis";
type OrderStatus = "pending" | "confirmed" | "delivering" | "delivered" | "cancelled";

interface Order {
  id: string;
  service_type: ServiceType;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  items: any;
  quantity: number;
  status: OrderStatus;
  notes: string | null;
  created_at: string;
}

const statusColors: Record<OrderStatus, string> = {
  pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  confirmed: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  delivering: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  delivered: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  cancelled: "bg-rose-500/10 text-rose-500 border-rose-500/20",
};

const statusLabels: Record<OrderStatus, string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  delivering: "En livraison",
  delivered: "Livrée",
  cancelled: "Annulée",
};

const AdminPanel = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<ServiceType>("gaz");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("Erreur de chargement");
        console.error(error);
      } else {
        setOrders((data as Order[]) || []);
      }
    } catch (e) {
      console.error(e);
      toast.error("Erreur système");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) fetchOrders();
  }, [isLoggedIn]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin" || password === "ira-express-2026") {
      setIsLoggedIn(true);
      toast.success("Connecté");
    } else {
      toast.error("Mot de passe incorrect");
    }
  };

  const updateStatus = async (id: string, status: OrderStatus) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) {
      toast.error("Erreur de mise à jour");
    } else {
      toast.success(`Statut mis à jour`);
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    }
  };

  const filtered = orders.filter((o) => {
    const matchesService = o.service_type === tab;
    const matchesSearch = o.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         o.customer_phone.includes(searchTerm);
    return matchesService && matchesSearch;
  });

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === "pending").length,
    delivered: orders.filter(o => o.status === "delivered").length,
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0b] px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md p-8 bg-[#151517] border border-[#27272a] rounded-3xl shadow-2xl"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20">
              <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-display font-black text-white">Administration</h1>
            <p className="text-zinc-400 text-sm mt-2">Connectez-vous pour gérer les commandes</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <Input 
                type="password" 
                placeholder="Mot de passe" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 rounded-xl bg-[#0a0a0b] border-[#27272a] text-white focus:ring-primary"
                autoFocus
              />
            </div>
            <Button type="submit" className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold transition-all shadow-lg shadow-primary/20">
              Accéder au Panel
            </Button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <LayoutDashboard className="w-6 h-6 text-primary" />
              <h1 className="text-3xl font-display font-black tracking-tight">Dashboard Elite</h1>
            </div>
            <p className="text-zinc-400">Gestion de la logistique IRA EXPRESS</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={fetchOrders} disabled={loading} className="rounded-xl border-[#27272a] bg-[#151517] hover:bg-[#27272a]">
              {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <RefreshCw className="mr-2 h-4 w-4" />}
              Actualiser
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setIsLoggedIn(false)} className="rounded-xl text-zinc-400 hover:text-white">
              <LogOut className="mr-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* STATS OVERVIEW */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            { label: "Total", value: stats.total, icon: ShoppingBag, color: "text-blue-400" },
            { label: "En cours", value: stats.pending, icon: Clock, color: "text-amber-400" },
            { label: "Livrées", value: stats.delivered, icon: CheckCircle2, color: "text-emerald-400" },
          ].map((s, i) => (
            <Card key={i} className="bg-[#151517] border-[#27272a] rounded-2xl overflow-hidden shadow-card">
              <CardContent className="p-6 flex items-center gap-4">
                <div className={`p-3 rounded-xl bg-background/50 ${s.color}`}>
                  <s.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">{s.label}</p>
                  <p className="text-2xl font-display font-black text-white">{s.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CONTENT */}
        <div className="bg-[#151517] border border-[#27272a] rounded-3xl shadow-xl overflow-hidden">
          <div className="p-6 border-b border-[#27272a] flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Tabs value={tab} onValueChange={(v) => setTab(v as ServiceType)} className="w-full sm:w-auto">
                <TabsList className="bg-[#0a0a0b] border border-[#27272a] p-1 h-11">
                  <TabsTrigger value="gaz" className="rounded-lg gap-2 text-xs px-4">
                    <Flame className="w-3.5 h-3.5" /> Gaz
                  </TabsTrigger>
                  <TabsTrigger value="pharma" className="rounded-lg gap-2 text-xs px-4">
                    <Heart className="w-3.5 h-3.5" /> Pharma
                  </TabsTrigger>
                  <TabsTrigger value="colis" className="rounded-lg gap-2 text-xs px-4">
                    <Package className="w-3.5 h-3.5" /> Colis
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <div className="relative w-full lg:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <Input 
                placeholder="Rechercher un client..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11 bg-[#0a0a0b] border-[#27272a] rounded-xl text-sm"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-[#0f0f11]">
                <TableRow className="border-[#27272a] hover:bg-transparent">
                  <TableHead className="py-4 text-zinc-400 font-bold text-xs uppercase tracking-widest">Date</TableHead>
                  <TableHead className="py-4 text-zinc-400 font-bold text-xs uppercase tracking-widest">Client</TableHead>
                  <TableHead className="py-4 text-zinc-400 font-bold text-xs uppercase tracking-widest">Contact</TableHead>
                  <TableHead className="py-4 text-zinc-400 font-bold text-xs uppercase tracking-widest">Adresse</TableHead>
                  <TableHead className="py-4 text-zinc-400 font-bold text-xs uppercase tracking-widest">Détails</TableHead>
                  <TableHead className="py-4 text-zinc-400 font-bold text-xs uppercase tracking-widest">Statut</TableHead>
                  <TableHead className="py-4 text-zinc-400 font-bold text-xs uppercase tracking-widest text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence mode="popLayout">
                  {loading ? (
                    <TableRow className="hover:bg-transparent">
                      <TableCell colSpan={7} className="py-20 text-center">
                        <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto opacity-40" />
                        <p className="mt-4 text-zinc-500 font-medium">Récupération des données...</p>
                      </TableCell>
                    </TableRow>
                  ) : filtered.length === 0 ? (
                    <TableRow className="hover:bg-transparent">
                      <TableCell colSpan={7} className="py-24 text-center">
                        <p className="text-zinc-500">Aucune commande trouvée</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((order, i) => (
                      <motion.tr 
                        key={order.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className="border-[#27272a] group hover:bg-[#1c1c1f]"
                      >
                        <TableCell className="text-xs text-zinc-500">
                          {format(new Date(order.created_at), "dd/MM/yy HH:mm", { locale: fr })}
                        </TableCell>
                        <TableCell className="font-bold text-white uppercase italic tracking-tight">{order.customer_name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-xs text-zinc-400">
                            <Phone className="w-3 h-3" /> {order.customer_phone}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-xs text-zinc-400 max-w-[200px] truncate">
                            <MapPin className="w-3 h-3 text-primary" /> {order.customer_address}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-xs font-bold bg-[#0a0a0b] px-2 py-1 rounded-lg border border-[#27272a]">
                            {order.quantity} units
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`${statusColors[order.status]} text-[10px] uppercase font-black tracking-widest px-2 py-0.5 rounded-full border`}>
                            {statusLabels[order.status]}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Select value={order.status} onValueChange={(v) => updateStatus(order.id, v as OrderStatus)}>
                            <SelectTrigger className="w-[140px] h-9 bg-[#0a0a0b] border-[#27272a] rounded-lg text-xs ml-auto">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-[#151517] border-[#27272a] text-white">
                              {(Object.keys(statusLabels) as OrderStatus[]).map((s) => (
                                <SelectItem key={s} value={s} className="text-xs focus:bg-primary/20">
                                  {statusLabels[s]}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;

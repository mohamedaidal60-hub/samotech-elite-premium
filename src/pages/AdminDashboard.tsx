import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchLeads, updateLeadStatus, deleteLead, logoutAdmin, changeAdminPassword, isAuthenticated, Lead } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { LogOut, RefreshCw, Trash2, Mail, Phone, Building2, Calendar, MessageCircle } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import logo from "@/assets/samotech-logo.png";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "new" | "contacted" | "won" | "lost">("all");
  const [pwOpen, setPwOpen] = useState(false);
  const [newPw, setNewPw] = useState("");

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/admin/login");
      return;
    }
    load();
  }, [navigate]);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchLeads();
      setLeads(data);
    } catch (error: any) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
      if (error.message === "Non autorisé") {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await updateLeadStatus(id, status);
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    } catch (error: any) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    }
  };

  const removeLead = async (id: string) => {
    if (!confirm("Supprimer ce lead ?")) return;
    try {
      await deleteLead(id);
      setLeads((prev) => prev.filter((l) => l.id !== id));
    } catch (error: any) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    }
  };

  const logout = () => {
    logoutAdmin();
    navigate("/admin/login");
  };

  const changePassword = async () => {
    if (newPw.length < 8) {
      toast({ title: "Mot de passe trop court", description: "Minimum 8 caractères.", variant: "destructive" });
      return;
    }
    try {
      const res = await changeAdminPassword(newPw);
      toast({ title: "Information", description: res.message });
      setNewPw("");
      setPwOpen(false);
    } catch (error: any) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    }
  };

  const filtered = filter === "all" ? leads : leads.filter((l) => l.status === filter);

  const stats = {
    total: leads.length,
    new: leads.filter((l) => l.status === "new").length,
    contacted: leads.filter((l) => l.status === "contacted").length,
    won: leads.filter((l) => l.status === "won").length,
  };

  return (
    <main className="min-h-screen pt-24 pb-12 px-4 sm:px-6 cosmic-bg">
      <div className="container mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <img src={logo} alt="SamoTech" className="w-8 h-8 object-contain" />
            <h1 className="text-2xl sm:text-3xl font-black gradient-text">Panel Admin SamoTech</h1>
          </div>
          <div className="flex gap-2">
            <button onClick={load} className="glass-card px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:scale-105 transition-all">
              <RefreshCw size={14} /> Rafraîchir
            </button>
            <button onClick={() => setPwOpen((v) => !v)} className="glass-card px-4 py-2 rounded-lg text-sm">
              Changer mot de passe
            </button>
            <button onClick={logout} className="gradient-bg px-4 py-2 rounded-lg text-sm font-semibold text-primary-foreground flex items-center gap-2">
              <LogOut size={14} /> Déconnexion
            </button>
          </div>
        </div>

        {pwOpen && (
          <div className="glass-card-glow p-5 rounded-xl mb-6 max-w-md flex gap-2">
            <input
              type="password"
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              placeholder="Nouveau mot de passe (min 8)"
              className="flex-1 bg-muted px-3 py-2 rounded-lg text-sm border border-border"
            />
            <button onClick={changePassword} className="gradient-bg px-4 py-2 rounded-lg text-sm font-semibold text-primary-foreground">
              Valider
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Total", value: stats.total, color: "text-primary" },
            { label: "Nouveaux", value: stats.new, color: "text-accent" },
            { label: "Contactés", value: stats.contacted, color: "text-secondary" },
            { label: "Gagnés", value: stats.won, color: "text-green-400" },
          ].map((s) => (
            <div key={s.label} className="glass-card-glow p-4 rounded-xl">
              <div className="text-xs text-muted-foreground">{s.label}</div>
              <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(["all", "new", "contacted", "won", "lost"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium ${
                filter === f ? "gradient-bg text-primary-foreground" : "glass-card text-foreground"
              }`}
            >
              {f === "all" ? "Tous" : f}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Chargement…</div>
        ) : filtered.length === 0 ? (
          <div className="glass-card p-10 rounded-xl text-center text-muted-foreground">
            Aucun lead pour ce filtre.
          </div>
        ) : (
          <div className="grid gap-4">
            {filtered.map((l) => (
              <div key={l.id} className="glass-card-glow p-5 rounded-xl">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="font-bold text-lg">{l.name}</div>
                    <div className="text-xs text-muted-foreground flex flex-wrap gap-x-4 gap-y-1 mt-1">
                      <span className="flex items-center gap-1"><Mail size={12} /> {l.email}</span>
                      {l.phone && <span className="flex items-center gap-1"><Phone size={12} /> {l.phone}</span>}
                      {l.company && <span className="flex items-center gap-1"><Building2 size={12} /> {l.company}</span>}
                      <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(l.created_at).toLocaleString()}</span>
                      <span className="uppercase text-[10px] px-1.5 py-0.5 rounded bg-muted">{l.language}</span>
                      <span className="uppercase text-[10px] px-1.5 py-0.5 rounded bg-muted">{l.source}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={buildWhatsAppUrl({
                        name: l.name, email: l.email, phone: l.phone ?? undefined, company: l.company ?? undefined,
                        service: l.service, budget: l.budget ?? undefined, timeline: l.timeline ?? undefined,
                        description: l.project_summary ?? undefined, language: l.language,
                      })}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#25D366] text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5"
                    >
                      <MessageCircle size={12} /> WhatsApp
                    </a>
                    <select
                      value={l.status}
                      onChange={(e) => updateStatus(l.id, e.target.value)}
                      className="bg-muted border border-border px-2 py-1.5 rounded-lg text-xs"
                    >
                      <option value="new">new</option>
                      <option value="contacted">contacted</option>
                      <option value="won">won</option>
                      <option value="lost">lost</option>
                    </select>
                    <button onClick={() => removeLead(l.id)} className="glass-card p-1.5 rounded-lg text-destructive hover:scale-105">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <div className="grid sm:grid-cols-3 gap-3 text-sm mb-2">
                  <div><span className="text-muted-foreground">Service :</span> {l.service}</div>
                  <div><span className="text-muted-foreground">Budget :</span> {l.budget || "—"}</div>
                  <div><span className="text-muted-foreground">Délai :</span> {l.timeline || "—"}</div>
                </div>
                {l.project_summary && (
                  <p className="text-sm bg-muted/30 p-3 rounded-lg whitespace-pre-wrap">{l.project_summary}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default AdminDashboard;

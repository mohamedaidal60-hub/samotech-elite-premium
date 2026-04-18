import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { sendWhatsAppMessage, buildOrderMessage } from "@/lib/whatsapp";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";

interface OrderFormProps {
  serviceType: "gaz" | "pharma" | "colis";
  serviceLabel: string;
  itemsPlaceholder: string;
}

const OrderForm = ({ serviceType, serviceLabel, itemsPlaceholder }: OrderFormProps) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    items: "",
    quantity: 1,
    notes: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.from("orders").insert({
        service_type: serviceType,
        customer_name: form.name,
        customer_phone: form.phone,
        customer_address: form.address,
        items: form.items ? [{ description: form.items }] : [],
        quantity: Number(form.quantity) || 1,
        notes: form.notes || null,
      });
      if (error) throw error;

      const message = buildOrderMessage(
        serviceLabel,
        form.name,
        form.phone,
        form.address,
        form.items || "Non spécifié",
        Number(form.quantity) || 1
      );
      sendWhatsAppMessage(message);

      toast.success("Commande envoyée avec succès !");
      setForm({ name: "", phone: "", address: "", items: "", quantity: 1, notes: "" });
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de l'envoi de la commande");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto">
      <Input name="name" placeholder="Votre nom complet *" value={form.name} onChange={handleChange} required maxLength={100} />
      <Input name="phone" placeholder="Numéro de téléphone *" value={form.phone} onChange={handleChange} required maxLength={20} />
      <Input name="address" placeholder="Adresse de livraison *" value={form.address} onChange={handleChange} required maxLength={255} />
      <Input name="items" placeholder={itemsPlaceholder} value={form.items} onChange={handleChange} maxLength={500} />
      <Input name="quantity" type="number" min={1} max={50} placeholder="Quantité" value={form.quantity} onChange={handleChange} />
      <Textarea name="notes" placeholder="Notes supplémentaires (optionnel)" value={form.notes} onChange={handleChange} maxLength={500} />
      <Button type="submit" className="w-full bg-gradient-primary text-primary-foreground font-bold text-lg h-12" disabled={loading}>
        {loading ? <Loader2 className="animate-spin mr-2" /> : <Send className="mr-2" />}
        {loading ? "Envoi en cours..." : "Commander via WhatsApp"}
      </Button>
    </form>
  );
};

export default OrderForm;

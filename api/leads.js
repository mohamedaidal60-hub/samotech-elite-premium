import { getDb } from "./db.js";

export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();

  const sql = getDb();

  try {
    if (req.method === "POST") {
      const { name, email, phone, company, service, budget, timeline, project_summary, raw_message, ai_transcript, language, source } = req.body;
      if (!name || !email || !service) {
        return res.status(400).json({ error: "name, email et service sont requis." });
      }
      const result = await sql`
        INSERT INTO leads (name, email, phone, company, service, budget, timeline, project_summary, raw_message, ai_transcript, language, source)
        VALUES (${name}, ${email}, ${phone || null}, ${company || null}, ${service}, ${budget || null}, ${timeline || null}, ${project_summary || null}, ${raw_message || null}, ${ai_transcript ? JSON.stringify(ai_transcript) : null}, ${language || 'fr'}, ${source || 'website-form'})
        RETURNING *
      `;
      return res.status(201).json({ data: result[0] });
    }

    if (req.method === "GET") {
      // Auth check for listing
      const auth = req.headers.authorization;
      if (!auth || auth !== `Bearer ${process.env.JWT_SECRET}`) {
        return res.status(401).json({ error: "Non autorisé" });
      }
      const leads = await sql`SELECT * FROM leads ORDER BY created_at DESC`;
      return res.status(200).json({ data: leads });
    }

    if (req.method === "PUT") {
      const auth = req.headers.authorization;
      if (!auth || auth !== `Bearer ${process.env.JWT_SECRET}`) {
        return res.status(401).json({ error: "Non autorisé" });
      }
      const { id, status } = req.body;
      if (!id || !status) return res.status(400).json({ error: "id et status requis" });
      await sql`UPDATE leads SET status = ${status}, updated_at = NOW() WHERE id = ${id}`;
      return res.status(200).json({ success: true });
    }

    if (req.method === "DELETE") {
      const auth = req.headers.authorization;
      if (!auth || auth !== `Bearer ${process.env.JWT_SECRET}`) {
        return res.status(401).json({ error: "Non autorisé" });
      }
      const { id } = req.body;
      if (!id) return res.status(400).json({ error: "id requis" });
      await sql`DELETE FROM leads WHERE id = ${id}`;
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: "Méthode non supportée" });
  } catch (err) {
    console.error("leads API error:", err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}

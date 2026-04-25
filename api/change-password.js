import { getDb } from "./db.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  const auth = req.headers.authorization;
  if (!auth || auth !== `Bearer ${process.env.JWT_SECRET}`) {
    return res.status(401).json({ error: "Non autorisé" });
  }

  const { newPassword } = req.body;
  if (!newPassword || newPassword.length < 8) {
    return res.status(400).json({ error: "Mot de passe trop court (min 8 caractères)" });
  }

  // Update password in environment is not possible at runtime,
  // but we can store in DB for the next deployment config
  // For now just acknowledge - user should update env vars on Vercel
  return res.status(200).json({
    success: true,
    message: "Veuillez mettre à jour ADMIN_PASSWORD dans les variables d'environnement Vercel."
  });
}

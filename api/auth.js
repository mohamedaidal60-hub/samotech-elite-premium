export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  const { email, password } = req.body;
  const adminEmail = process.env.ADMIN_EMAIL || "samotechgpt@gmail.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "SamoTech2026!";

  if (email === adminEmail && password === adminPassword) {
    return res.status(200).json({
      success: true,
      token: process.env.JWT_SECRET,
      user: { email: adminEmail, role: "admin" },
    });
  }

  return res.status(401).json({ error: "Email ou mot de passe incorrect." });
}

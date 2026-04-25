// API client replacing Supabase — calls Vercel serverless functions backed by Neon DB

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  service: string;
  budget: string | null;
  timeline: string | null;
  project_summary: string | null;
  raw_message: string | null;
  ai_transcript: unknown;
  language: string;
  source: string;
  status: string;
  created_at: string;
  updated_at: string;
}

function getToken(): string | null {
  return localStorage.getItem("samotech_admin_token");
}

export function setToken(token: string) {
  localStorage.setItem("samotech_admin_token", token);
}

export function clearToken() {
  localStorage.removeItem("samotech_admin_token");
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

async function apiFetch(path: string, options: RequestInit = {}) {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Erreur API");
  return json;
}

// ─── Auth ───
export async function loginAdmin(email: string, password: string) {
  const res = await apiFetch("/api/auth", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  if (res.token) setToken(res.token);
  return res;
}

export async function logoutAdmin() {
  clearToken();
}

export async function changeAdminPassword(newPassword: string) {
  return apiFetch("/api/change-password", {
    method: "POST",
    body: JSON.stringify({ newPassword }),
  });
}

// ─── Leads ───
export async function insertLead(lead: Partial<Lead>) {
  return apiFetch("/api/leads", {
    method: "POST",
    body: JSON.stringify(lead),
  });
}

export async function fetchLeads(): Promise<Lead[]> {
  const res = await apiFetch("/api/leads", { method: "GET" });
  return res.data || [];
}

export async function updateLeadStatus(id: string, status: string) {
  return apiFetch("/api/leads", {
    method: "PUT",
    body: JSON.stringify({ id, status }),
  });
}

export async function deleteLead(id: string) {
  return apiFetch("/api/leads", {
    method: "DELETE",
    body: JSON.stringify({ id }),
  });
}

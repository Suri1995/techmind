export type LeadPayload = {
  source: "hero" | "goals-popup" | "contact";
  name: string;
  business: string;
  email: string;
  phone: string;
  service: string;
  budget: string;
  start: string;
  website: string;
  message: string;
};

export async function submitLead(payload: LeadPayload) {
  const res = await fetch("/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const j = await res.json().catch(() => ({}));
    throw new Error(j.error ?? "Something went wrong. Please try again.");
  }
}
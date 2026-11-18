import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { Resend } from "resend";
import { z } from "zod";
import { buildLeadEmail } from "@/lib/leadEmail";

export const runtime = "nodejs";

const optionalText = (max: number) => z.string().trim().max(max).optional().default("");

const schema = z.object({
  source: z.enum(["hero", "goals-popup", "contact"]),
  name: z.string().trim().min(1, "Name is required").max(100),
  business: z.string().trim().min(1, "Business is required").max(150),
  email: z.union([z.literal(""), z.email().max(200)]).optional().default(""),
  phone: z
    .string()
    .trim()
    .max(30)
    .refine((v) => v.replace(/\D/g, "").length >= 8, "Invalid phone number"),
  service: z.string().trim().min(1, "Service is required").max(150),
  budget: optionalText(60),
  start: optionalText(60),
  website: optionalText(300),
  message: optionalText(600),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid data." },
      { status: 400 },
    );
  }
  const d = parsed.data;

  /* 1. Save to Neon */
  const sql = neon(process.env.DATABASE_URL!);
  let id: number;
  try {
    const rows = await sql`
      insert into leads (source, name, business, email, phone, service, budget, start_timeline, website, message)
      values (${d.source}, ${d.name}, ${d.business}, ${d.email || null}, ${d.phone}, ${d.service},
              ${d.budget || null}, ${d.start || null}, ${d.website || null}, ${d.message || null})
      returning id`;
    id = rows[0].id as number;
  } catch (err) {
    console.error("DB insert failed:", err);
    return NextResponse.json(
      { error: "Could not save your enquiry. Please try again." },
      { status: 500 },
    );
  }

  /* 2. Email the team (a failure here must not lose the lead; it is already saved) */
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { html, text } = buildLeadEmail(d, id);

    const { error } = await resend.emails.send({
      from: process.env.LEAD_FROM_EMAIL!,
      to: process.env.LEAD_TO_EMAIL!.split(",").map((s) => s.trim()),
      replyTo: d.email || undefined,
      subject: `New lead: ${d.name} (${d.business}) - ${d.service}`,
      html,
      text,
    });
    if (error) throw error;
    await sql`update leads set email_sent = true where id = ${id}`;
  } catch (err) {
    console.error("Resend failed:", err);
  }

  return NextResponse.json({ ok: true });
}
/**
 * Premium lead-notification email for Tech.Mind.
 * Location: src/lib/leadEmail.ts
 *
 * Table-based layout with inline styles so it renders the same in
 * Gmail, Outlook, Apple Mail and on phones. No remote images needed.
 */

export type LeadEmailData = {
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

/* brand colours */
const INK = "#0f172a";
const SLATE = "#64748b";
const LINE = "#e2e8f0";
const TEAL = "#14b8a6";
const TEAL_DEEP = "#0b7a72";
const TEAL_SOFT = "#e6f7f5";
const WA_GREEN = "#16a34a";

const SOURCE_LABEL: Record<LeadEmailData["source"], string> = {
  hero: "Home page form",
  "goals-popup": "Learn More popup",
  contact: "Contact page",
};

const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

function whatsappNumber(phone: string) {
  let digits = phone.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
  if (digits.length === 10) digits = "91" + digits; // assume India for bare 10-digit numbers
  return digits;
}

function safeUrl(raw: string) {
  const v = raw.trim();
  if (!v) return "";
  return /^https?:\/\//i.test(v) ? v : `https://${v}`;
}

function button(href: string, label: string, bg: string, color: string, border?: string) {
  return `<a href="${esc(href)}" target="_blank" style="display:inline-block;margin:0 8px 8px 0;padding:13px 22px;border-radius:12px;background:${bg};color:${color};font-size:14px;font-weight:600;line-height:1;text-decoration:none;${
    border ? `border:1.5px solid ${border};` : ""
  }">${label}</a>`;
}

function detailRow(label: string, valueHtml: string, first = false) {
  return `
    <tr>
      <td style="padding:14px 20px;${first ? "" : `border-top:1px solid ${LINE};`}">
        <div style="font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:${SLATE};">${label}</div>
        <div style="margin-top:4px;font-size:15px;line-height:1.5;color:${INK};font-weight:500;">${valueHtml}</div>
      </td>
    </tr>`;
}

export function buildLeadEmail(d: LeadEmailData, id: number) {
  const received = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  });
  const source = SOURCE_LABEL[d.source];
  const waNumber = whatsappNumber(d.phone);
  const telHref = `tel:+${waNumber}`;
  const site = safeUrl(d.website);

  /* detail rows (only the ones with a value) */
  const rows: string[] = [];
  rows.push(
    detailRow(
      "Phone / WhatsApp",
      `<a href="${esc(telHref)}" style="color:${INK};text-decoration:none;">${esc(d.phone)}</a>`,
      true,
    ),
  );
  if (d.email) {
    rows.push(
      detailRow("Email", `<a href="mailto:${esc(d.email)}" style="color:${TEAL_DEEP};text-decoration:none;">${esc(d.email)}</a>`),
    );
  }
  rows.push(detailRow("Service", esc(d.service)));
  if (d.budget) rows.push(detailRow("Monthly budget", esc(d.budget)));
  if (d.start) rows.push(detailRow("Expected start", esc(d.start)));
  if (site) {
    rows.push(
      detailRow("Website / profile", `<a href="${esc(site)}" style="color:${TEAL_DEEP};text-decoration:none;word-break:break-all;">${esc(d.website)}</a>`),
    );
  }

  const messageBlock = d.message
    ? `
    <tr>
      <td style="padding:0 32px 28px;">
        <div style="font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:${SLATE};margin-bottom:10px;">Their message</div>
        <div style="background:#f0fdfa;border-left:3px solid ${TEAL};border-radius:4px 12px 12px 4px;padding:16px 18px;font-size:15px;line-height:1.65;color:${INK};">
          ${esc(d.message).replace(/\r?\n/g, "<br>")}
        </div>
      </td>
    </tr>`
    : "";

  const buttons = [
    button(telHref, "Call now", INK, "#ffffff"),
    button(`https://wa.me/${waNumber}`, "WhatsApp", WA_GREEN, "#ffffff"),
    d.email ? button(`mailto:${d.email}`, "Reply by email", "#ffffff", TEAL_DEEP, TEAL_DEEP) : "",
  ].join("");

  const preheader = `${d.name} from ${d.business} is interested in ${d.service}.`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light only">
<title>New lead from ${esc(d.name)}</title>
</head>
<body style="margin:0;padding:0;background:#eef2f6;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${esc(preheader)}</div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef2f6;">
    <tr>
      <td align="center" style="padding:32px 12px;">

        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#ffffff;border-radius:20px;overflow:hidden;font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">

          <!-- header -->
          <tr>
            <td style="background:${INK};padding:26px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-size:20px;font-weight:700;letter-spacing:-0.01em;color:#ffffff;">
                    Tech<span style="color:${TEAL};">.</span>Mind
                  </td>
                  <td align="right">
                    <span style="display:inline-block;padding:7px 14px;border-radius:999px;background:${TEAL};color:#042f2e;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;">New lead</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr><td style="height:4px;line-height:4px;font-size:0;background:${TEAL};">&nbsp;</td></tr>

          <!-- hero -->
          <tr>
            <td style="padding:34px 32px 8px;">
              <div style="font-size:12px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:${TEAL_DEEP};">
                Lead #${id} &nbsp;&middot;&nbsp; ${esc(source)}
              </div>
              <div style="margin-top:12px;font-size:30px;line-height:1.2;font-weight:700;letter-spacing:-0.02em;color:${INK};">
                ${esc(d.name)}
              </div>
              <div style="margin-top:6px;font-size:16px;line-height:1.4;color:${SLATE};">
                ${esc(d.business)}
              </div>
              <div style="margin-top:16px;">
                <span style="display:inline-block;padding:8px 14px;border-radius:999px;background:${TEAL_SOFT};color:${TEAL_DEEP};font-size:13px;font-weight:600;">${esc(d.service)}</span>
              </div>
            </td>
          </tr>

          <!-- actions -->
          <tr>
            <td style="padding:22px 32px 20px;">
              ${buttons}
            </td>
          </tr>

          <!-- details card -->
          <tr>
            <td style="padding:0 32px 26px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid ${LINE};border-radius:14px;">
                ${rows.join("")}
              </table>
            </td>
          </tr>

          ${messageBlock}

          <!-- footer -->
          <tr>
            <td style="background:#f8fafc;border-top:1px solid ${LINE};padding:20px 32px;">
              <div style="font-size:12px;line-height:1.7;color:${SLATE};">
                Received ${esc(received)} IST via ${esc(source)}.<br>
                ${
                  d.email
                    ? "Hit <b>Reply</b> on this email to write straight to the customer."
                    : "No email was given, so reach out by phone or WhatsApp."
                }<br>
                Saved to your database as lead #${id}.
              </div>
            </td>
          </tr>

        </table>

        <div style="margin-top:18px;font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:11px;color:#94a3b8;">
          Tech.Mind Digital Marketing Agency &middot; Hyderabad
        </div>

      </td>
    </tr>
  </table>
</body>
</html>`;

  /* plain-text fallback (improves deliverability and works in text-only clients) */
  const text = [
    `NEW LEAD #${id} (${source})`,
    "",
    `Name: ${d.name}`,
    `Business: ${d.business}`,
    `Phone: ${d.phone}`,
    d.email && `Email: ${d.email}`,
    `Service: ${d.service}`,
    d.budget && `Budget: ${d.budget}`,
    d.start && `Start: ${d.start}`,
    d.website && `Website: ${d.website}`,
    d.message && `\nMessage:\n${d.message}`,
    "",
    `WhatsApp: https://wa.me/${waNumber}`,
    `Received: ${received} IST`,
  ]
    .filter(Boolean)
    .join("\n");

  return { html, text };
}
import { siteConfig } from "@/lib/site-config";

export interface LeadData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  projectType?: string;
  location?: string;
  material?: string;
  projectSize?: string;
  message?: string;
  enquiryType: string;
  source?: string;
  productId?: string;
  productName?: string;
  productSlug?: string;
  status: 'new' | 'contacted' | 'qualified' | 'closed';
  createdAt: string;
  /** Customer-facing reference, e.g. SPB-2026-01234 */
  refId?: string;
}

export const submitLead = async (lead: Omit<LeadData, 'status' | 'createdAt' | 'id'>) => {
  const response = await fetch('/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(lead),
  });

  return response.json();
};

export class LeadDeliveryError extends Error {}

// ---- Email via Resend (https://resend.com) ----------------------------------
// RESEND_API_KEY         API key from the Resend dashboard (required in production)
// LEAD_NOTIFICATION_EMAIL Inbox(es) that receive enquiries, comma-separated
// LEAD_FROM_EMAIL        Sender, e.g. "Spacesio Beryl <enquiries@spacesioberyl.com>".
//                        Must be on a domain verified in Resend. Until then,
//                        "onboarding@resend.dev" can only send to your own Resend login email.
// LEAD_SEND_CONFIRMATION "true" to also email the customer a confirmation
//                        (needs a verified domain in LEAD_FROM_EMAIL).

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const fieldRows = (lead: LeadData): [string, string | undefined][] => [
  ["Reference", lead.refId],
  ["Enquiry type", lead.enquiryType],
  ["Name", lead.name],
  ["Email", lead.email],
  ["Phone", lead.phone],
  ["Company", lead.company],
  ["Project type", lead.projectType],
  ["Location", lead.location],
  ["Material", lead.material],
  ["Project size", lead.projectSize],
  ["Product", lead.productName ? `${lead.productName}${lead.productSlug ? ` (${lead.productSlug})` : ""}` : undefined],
  ["Submitted from", lead.source],
  ["Received", new Date(lead.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) + " IST"],
];

function internalEmail(lead: LeadData) {
  const rows = fieldRows(lead).filter(([, v]) => v);
  const text = [
    `New ${lead.enquiryType} from ${lead.name}`,
    "",
    ...rows.map(([k, v]) => `${k}: ${v}`),
    "",
    "Message:",
    lead.message || "(no message)",
    "",
    "Reply to this email to respond to the customer directly.",
  ].join("\n");

  const html = `<!doctype html><html><body style="margin:0;padding:24px;background:#f5f5f5;font-family:Helvetica,Arial,sans-serif;color:#111">
  <table role="presentation" width="100%" style="max-width:600px;margin:0 auto;background:#fff;border:1px solid #e5e5e5">
    <tr><td style="background:#000;color:#fff;padding:20px 28px;font-size:12px;letter-spacing:3px;text-transform:uppercase">${escapeHtml(siteConfig.name)} · New enquiry</td></tr>
    <tr><td style="padding:28px">
      <h1 style="margin:0 0 20px;font-size:22px;font-weight:600">${escapeHtml(lead.enquiryType)} from ${escapeHtml(lead.name)}</h1>
      <table role="presentation" width="100%" style="border-collapse:collapse;font-size:14px">
        ${rows
          .map(
            ([k, v]) =>
              `<tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#555;width:140px;vertical-align:top">${escapeHtml(k)}</td><td style="padding:8px 0;border-bottom:1px solid #eee">${escapeHtml(v!)}</td></tr>`
          )
          .join("")}
      </table>
      <h2 style="margin:24px 0 8px;font-size:14px;text-transform:uppercase;letter-spacing:2px">Message</h2>
      <p style="margin:0;font-size:15px;line-height:1.6;white-space:pre-wrap">${escapeHtml(lead.message || "(no message)")}</p>
      <p style="margin:28px 0 0;font-size:12px;color:#777">Reply to this email to respond to ${escapeHtml(lead.name)} directly.</p>
    </td></tr>
  </table></body></html>`;

  return { text, html };
}

function confirmationEmail(lead: LeadData) {
  const { phone, email } = siteConfig.contact;
  const text = [
    `Dear ${lead.name},`,
    "",
    `Thank you for contacting ${siteConfig.name}. We've received your ${lead.enquiryType.toLowerCase()} and our team will get back to you within one business day.`,
    "",
    lead.refId ? `Your reference: ${lead.refId}` : "",
    "",
    `If it's urgent, call us on ${phone} or email ${email}.`,
    "",
    `— ${siteConfig.name}`,
  ].join("\n");

  const html = `<!doctype html><html><body style="margin:0;padding:24px;background:#f5f5f5;font-family:Helvetica,Arial,sans-serif;color:#111">
  <table role="presentation" width="100%" style="max-width:600px;margin:0 auto;background:#fff;border:1px solid #e5e5e5">
    <tr><td style="background:#000;color:#fff;padding:20px 28px;font-size:12px;letter-spacing:3px;text-transform:uppercase">${escapeHtml(siteConfig.name)}</td></tr>
    <tr><td style="padding:28px;font-size:15px;line-height:1.7">
      <p style="margin:0 0 16px">Dear ${escapeHtml(lead.name)},</p>
      <p style="margin:0 0 16px">Thank you for contacting ${escapeHtml(siteConfig.name)}. We've received your ${escapeHtml(lead.enquiryType.toLowerCase())} and our team will get back to you within one business day.</p>
      ${lead.refId ? `<p style="margin:0 0 16px">Your reference: <strong>${escapeHtml(lead.refId)}</strong></p>` : ""}
      <p style="margin:0 0 16px">If it's urgent, call us on ${escapeHtml(phone)} or email ${escapeHtml(email)}.</p>
      <p style="margin:24px 0 0">— ${escapeHtml(siteConfig.name)}</p>
    </td></tr>
  </table></body></html>`;

  return { text, html };
}

async function sendEmail(payload: Record<string, unknown>) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new LeadDeliveryError(`Resend responded ${res.status}: ${detail.slice(0, 300)}`);
  }
}

export const leadNotificationService = {
  /**
   * Emails the enquiry to the team. Throws LeadDeliveryError if it could not
   * be delivered, so the API can tell the visitor instead of silently losing it.
   */
  notifyNewLead: async (lead: LeadData) => {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      if (process.env.NODE_ENV === "production") {
        throw new LeadDeliveryError("RESEND_API_KEY is not configured; enquiry could not be delivered.");
      }
      // Local development: print the enquiry instead of emailing it.
      console.info("[LeadService] RESEND_API_KEY not set — enquiry (dev only):\n" + internalEmail(lead).text);
      return;
    }

    const to = (process.env.LEAD_NOTIFICATION_EMAIL || siteConfig.contact.email)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const from = process.env.LEAD_FROM_EMAIL || `${siteConfig.name} <onboarding@resend.dev>`;
    const { text, html } = internalEmail(lead);

    await sendEmail({
      from,
      to,
      reply_to: lead.email,
      subject: `New ${lead.enquiryType}: ${lead.name}${lead.refId ? ` [${lead.refId}]` : ""}`,
      text,
      html,
    });

    // The customer confirmation is a nice-to-have: never fail the enquiry over it.
    if (process.env.LEAD_SEND_CONFIRMATION === "true") {
      try {
        const confirmation = confirmationEmail(lead);
        await sendEmail({
          from,
          to: [lead.email],
          reply_to: siteConfig.contact.email,
          subject: `We've received your enquiry${lead.refId ? ` (${lead.refId})` : ""} – ${siteConfig.name}`,
          ...confirmation,
        });
      } catch (err) {
        console.error("[LeadService] confirmation email failed", err);
      }
    }
  },
};

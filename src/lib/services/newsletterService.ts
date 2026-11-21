import { siteConfig } from "@/lib/site-config";

// ---- Newsletter via Resend Contacts (https://resend.com/docs/api-reference/contacts) --
// RESEND_API_KEY            Same key used for enquiry emails
// RESEND_SEGMENT_ID         Optional: segment subscribers are added to
// NEWSLETTER_SEND_WELCOME   "true" to email new subscribers a welcome note
//                           (needs a verified sender in LEAD_FROM_EMAIL)

export class NewsletterError extends Error {}

export type SubscribeResult = "subscribed" | "already_subscribed";

async function resend(path: string, body: unknown) {
  return fetch(`https://api.resend.com${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
    signal: AbortSignal.timeout(10000),
  });
}

function welcomeEmail() {
  const { phone, email } = siteConfig.contact;
  const text = [
    `Welcome to ${siteConfig.name}.`,
    "",
    "Thank you for subscribing. We'll write occasionally with new materials, finished projects and design notes — never more than we'd want to read ourselves.",
    "",
    `Questions about a project? Call ${phone} or email ${email}.`,
    "",
    "You can unsubscribe at any time by replying to this email.",
    "",
    `— ${siteConfig.name}`,
  ].join("\n");

  const html = `<!doctype html><html><body style="margin:0;padding:24px;background:#f5f5f5;font-family:Helvetica,Arial,sans-serif;color:#111">
  <table role="presentation" width="100%" style="max-width:600px;margin:0 auto;background:#fff;border:1px solid #e5e5e5">
    <tr><td style="background:#000;color:#fff;padding:20px 28px;font-size:12px;letter-spacing:3px;text-transform:uppercase">${siteConfig.name}</td></tr>
    <tr><td style="padding:28px;font-size:15px;line-height:1.7">
      <h1 style="margin:0 0 16px;font-size:22px;font-weight:600">Welcome.</h1>
      <p style="margin:0 0 16px">Thank you for subscribing. We'll write occasionally with new materials, finished projects and design notes — never more than we'd want to read ourselves.</p>
      <p style="margin:0 0 16px">Questions about a project? Call ${phone} or email ${email}.</p>
      <p style="margin:24px 0 0;font-size:12px;color:#777">You can unsubscribe at any time by replying to this email.</p>
    </td></tr>
  </table></body></html>`;

  return { text, html };
}

export const newsletterService = {
  /** Adds the email to Resend contacts. Throws NewsletterError on failure. */
  subscribe: async (email: string): Promise<SubscribeResult> => {
    const apiKey = process.env.RESEND_API_KEY;
    const segmentId = process.env.RESEND_SEGMENT_ID;

    if (!apiKey) {
      if (process.env.NODE_ENV === "production") {
        throw new NewsletterError("RESEND_API_KEY not configured.");
      }
      console.info(`[Newsletter] Resend not configured — would subscribe ${email} (dev only)`);
      return "subscribed";
    }

    const res = await resend("/contacts", {
      email,
      unsubscribed: false,
      ...(segmentId && { segments: [{ id: segmentId }] }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      // Existing contacts are not an error for the visitor.
      if (res.status === 409 || /already exists/i.test(detail)) return "already_subscribed";
      throw new NewsletterError(`Resend responded ${res.status}: ${detail.slice(0, 300)}`);
    }

    if (process.env.NEWSLETTER_SEND_WELCOME === "true") {
      try {
        const from = process.env.LEAD_FROM_EMAIL || `${siteConfig.name} <onboarding@resend.dev>`;
        const r = await resend("/emails", {
          from,
          to: [email],
          reply_to: siteConfig.contact.email,
          subject: `Welcome to ${siteConfig.name}`,
          ...welcomeEmail(),
        });
        if (!r.ok) console.error("[Newsletter] welcome email failed", r.status, await r.text().catch(() => ""));
      } catch (err) {
        console.error("[Newsletter] welcome email failed", err);
      }
    }

    return "subscribed";
  },
};

import { siteConfig } from "@/lib/site-config";

/** wa.me deep link that opens a chat with the business, optionally pre-filled. */
export function buildWhatsAppUrl(message?: string) {
  const base = `https://wa.me/${siteConfig.contact.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

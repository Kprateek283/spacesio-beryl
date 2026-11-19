import { NextResponse } from 'next/server';
import * as z from 'zod';
import { getProductBySlug } from '@/lib/api/products';
import { leadNotificationService, LeadData } from '@/lib/services/leadService';
import { getClientIp, rateLimit, RateLimitResult } from '@/lib/rate-limit';
import { siteConfig } from '@/lib/site-config';

// Length caps stop oversized payloads from being stored or emailed.
const short = (max = 200) => z.string().trim().max(max).optional();
const leadSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(120),
  email: z.string().trim().email("Invalid email address").max(254),
  phone: short(40),
  company: short(160),
  projectType: short(80),
  location: short(160),
  material: short(160),
  projectSize: short(80),
  message: short(5000),
  enquiryType: z.string().trim().min(1, "Enquiry type is required").max(80),
  source: short(200),
  productId: short(120),
  productName: short(200),
  productSlug: short(200),
  honeypot: z.string().max(500).optional(),
});

const MAX_BODY_BYTES = 16 * 1024;

// A real customer sends one or two enquiries; these limits only bite on abuse.
const IP_RULES = [
  { name: 'burst', limit: 3, windowSeconds: 10 * 60 }, // 3 per 10 minutes
  { name: 'daily', limit: 15, windowSeconds: 24 * 60 * 60 }, // 15 per day
];
const EMAIL_RULES = [{ name: 'daily', limit: 5, windowSeconds: 24 * 60 * 60 }];

function tooManyRequests(result: RateLimitResult) {
  const minutes = Math.max(1, Math.ceil(result.retryAfter / 60));
  const wait = minutes >= 60 ? `${Math.ceil(minutes / 60)} hour${minutes >= 120 ? 's' : ''}` : `${minutes} minute${minutes > 1 ? 's' : ''}`;
  return NextResponse.json(
    {
      success: false,
      error: `You've sent several enquiries in a short time. Please try again in ${wait}, or contact us directly by phone or email.`,
    },
    {
      status: 429,
      headers: {
        'Retry-After': String(result.retryAfter),
        'X-RateLimit-Limit': String(result.limit),
        'X-RateLimit-Remaining': '0',
      },
    }
  );
}

export async function POST(req: Request) {
  try {
    // 1. Rate limit by client IP (before doing any other work)
    // If the host doesn't expose the client IP, skip this check rather than
    // putting every visitor into one shared "unknown" bucket.
    const ip = getClientIp(req.headers);
    if (ip !== 'unknown') {
      const ipResult = await rateLimit('leads-ip', ip, IP_RULES);
      if (!ipResult.success) return tooManyRequests(ipResult);
    }

    // 2. Reject oversized bodies
    const declaredLength = Number(req.headers.get('content-length') || 0);
    if (declaredLength > MAX_BODY_BYTES) {
      return NextResponse.json({ success: false, error: 'Enquiry is too large' }, { status: 413 });
    }
    const raw = await req.text();
    if (raw.length > MAX_BODY_BYTES) {
      return NextResponse.json({ success: false, error: 'Enquiry is too large' }, { status: 413 });
    }
    let body: unknown;
    try {
      body = JSON.parse(raw);
    } catch {
      return NextResponse.json({ success: false, error: 'Invalid data format' }, { status: 400 });
    }

    // 3. Zod Validation
    const parsed = leadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Invalid data format' }, { status: 400 });
    }
    const data = parsed.data;

    // Also limit per email address, so rotating IPs can't flood one inbox entry.
    const emailResult = await rateLimit('leads-email', data.email, EMAIL_RULES);
    if (!emailResult.success) return tooManyRequests(emailResult);

    // 4. Honeypot check (Spam Protection)
    if (data.honeypot && data.honeypot.length > 0) {
      // Silently accept but ignore (bot behavior)
      return NextResponse.json({ success: true, id: `bot-${Date.now()}` });
    }

    // 5. Server-side Context Validation
    // Never trust client-submitted product info without verifying if productSlug exists
    if (data.productSlug) {
      const product = await getProductBySlug(data.productSlug);
      if (!product) {
        return NextResponse.json({ success: false, error: 'Invalid product reference' }, { status: 400 });
      }
      // Force sanitize the names to match the database strictly
      data.productName = product.name;
      data.productId = product.id;
    }

    // 6. Construct Lead object (reference ID first so it appears in the email)
    const refId = `SPB-${new Date().getFullYear()}-${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`;
    const lead: LeadData = {
      ...data,
      refId,
      status: 'new',
      createdAt: new Date().toISOString(),
    };

    // 7. Deliver. If this fails, say so honestly instead of showing a fake success.
    try {
      await leadNotificationService.notifyNewLead(lead);
    } catch (deliveryError) {
      console.error('[API Leads] delivery failed', deliveryError);
      return NextResponse.json(
        {
          success: false,
          error: `We couldn't send your enquiry right now. Please try again shortly, or reach us directly at ${siteConfig.contact.phone} or ${siteConfig.contact.email}.`,
        },
        { status: 502 }
      );
    }

    // 8. Respond with reference ID
    return NextResponse.json({ success: true, id: refId });
  } catch (error) {
    console.error('[API Leads Error]', error);
    return NextResponse.json({ success: false, error: 'Failed to process enquiry' }, { status: 500 });
  }
}

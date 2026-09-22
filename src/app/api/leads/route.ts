import { NextResponse } from 'next/server';
import * as z from 'zod';
import { getProductBySlug } from '@/lib/api/products';
import { leadNotificationService, LeadData } from '@/lib/services/leadService';

const leadSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  company: z.string().optional(),
  projectType: z.string().optional(),
  location: z.string().optional(),
  material: z.string().optional(),
  projectSize: z.string().optional(),
  message: z.string().optional(),
  enquiryType: z.string().min(1, "Enquiry type is required"),
  source: z.string().optional(),
  productId: z.string().optional(),
  productName: z.string().optional(),
  productSlug: z.string().optional(),
  honeypot: z.string().optional(),
});

// In-memory, single-instance rate limiting. This is NOT sufficient protection
// in production: it resets on every serverless cold start, doesn't share
// state across instances, and `x-forwarded-for` is client-suppliable so it
// can be trivially bypassed by rotating the header. Replace with a real
// shared store (e.g. Upstash Redis) keyed off a trusted IP source before
// relying on this endpoint's rate limiting in production.
const RATE_LIMIT_WINDOW_MS = 5000;
const rateLimit = new Map<string, number>();

function pruneStaleRateLimitEntries(now: number) {
  // Bound the map's memory growth — entries are otherwise never evicted.
  if (rateLimit.size < 500) return;
  rateLimit.forEach((lastRequest, key) => {
    if (now - lastRequest > RATE_LIMIT_WINDOW_MS) rateLimit.delete(key);
  });
}

export async function POST(req: Request) {
  try {
    // 1. Rate Limiting (Basic)
    const ip = req.headers.get('x-forwarded-for') || 'anonymous';
    const now = Date.now();
    pruneStaleRateLimitEntries(now);
    const lastRequest = rateLimit.get(ip);
    if (lastRequest && now - lastRequest < RATE_LIMIT_WINDOW_MS) {
      return NextResponse.json({ success: false, error: 'Too many requests. Please wait a moment.' }, { status: 429 });
    }
    rateLimit.set(ip, now);

    // 2. Parse payload
    const body = await req.json();

    // 3. Zod Validation
    const parsed = leadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Invalid data format' }, { status: 400 });
    }
    const data = parsed.data;

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

    // 6. Construct Lead object
    const lead: LeadData = {
      ...data,
      status: 'new',
      createdAt: new Date().toISOString(),
    };

    // 7. Store / Notify via LeadService
    await leadNotificationService.notifyNewLead(lead);

    // 8. Respond with reference ID
    const refId = `SPB-${new Date().getFullYear()}-${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`;
    
    return NextResponse.json({ success: true, id: refId });
  } catch (error) {
    console.error('[API Leads Error]', error);
    return NextResponse.json({ success: false, error: 'Failed to process enquiry' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import * as z from 'zod';
import { getClientIp, rateLimit, RateLimitResult } from '@/lib/rate-limit';
import { newsletterService } from '@/lib/services/newsletterService';

const MAX_BODY_BYTES = 2 * 1024;

const schema = z.object({
  email: z.string().trim().toLowerCase().email('Please enter a valid email address.').max(254),
  // Hidden field; real visitors leave it empty.
  company_website: z.string().max(200).optional(),
});

const IP_RULES = [
  { name: 'burst', limit: 5, windowSeconds: 10 * 60 },
  { name: 'daily', limit: 20, windowSeconds: 24 * 60 * 60 },
];
const EMAIL_RULES = [{ name: 'daily', limit: 3, windowSeconds: 24 * 60 * 60 }];

function tooMany(result: RateLimitResult) {
  return NextResponse.json(
    { success: false, error: 'Too many attempts. Please try again a little later.' },
    { status: 429, headers: { 'Retry-After': String(result.retryAfter) } }
  );
}

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req.headers);
    if (ip !== 'unknown') {
      const ipResult = await rateLimit('newsletter-ip', ip, IP_RULES);
      if (!ipResult.success) return tooMany(ipResult);
    }

    const raw = await req.text();
    if (raw.length > MAX_BODY_BYTES) {
      return NextResponse.json({ success: false, error: 'Request too large' }, { status: 413 });
    }
    let body: unknown;
    try {
      body = JSON.parse(raw);
    } catch {
      return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
    }

    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    // Bots fill every field: pretend it worked, do nothing.
    if (parsed.data.company_website) {
      return NextResponse.json({ success: true, status: 'subscribed' });
    }

    const emailResult = await rateLimit('newsletter-email', parsed.data.email, EMAIL_RULES);
    if (!emailResult.success) return tooMany(emailResult);

    try {
      const status = await newsletterService.subscribe(parsed.data.email);
      return NextResponse.json({ success: true, status });
    } catch (err) {
      console.error('[API Newsletter] subscribe failed', err);
      return NextResponse.json(
        { success: false, error: "We couldn't subscribe you right now. Please try again shortly." },
        { status: 502 }
      );
    }
  } catch (error) {
    console.error('[API Newsletter Error]', error);
    return NextResponse.json({ success: false, error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}

# Production setup

Everything you need to configure outside the code to run spacesioberyl.com in production: environment variables, email (Resend), rate limiting (Upstash), Google Search Console and analytics.

The site is hosted on **Vercel**. The canonical address is **`https://www.spacesioberyl.com`**; `spacesioberyl.com` redirects to it.

---

## 1. Environment variables

Set these in **Vercel → Project → Settings → Environment Variables** (Production, and Preview if you want previews to behave the same). Redeploy after changing them. A copy of the list lives in [`.env.example`](../.env.example).

| Variable | Required | Example | What it does |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | **Yes** | `https://www.spacesioberyl.com` | Base URL for the sitemap, robots.txt, canonical links and structured data |
| `RESEND_API_KEY` | **Yes** | `re_xxxxxxxx` | Sends enquiry emails and adds newsletter subscribers |
| `LEAD_FROM_EMAIL` | **Yes** | `Spacesio Beryl <enquiries@spacesioberyl.com>` | Sender address. Must be on a domain verified in Resend |
| `LEAD_NOTIFICATION_EMAIL` | No | `info@spacesioberyl.com` | Inbox(es) that receive enquiries, comma-separated. Defaults to the contact email in `src/lib/site-config.ts` |
| `LEAD_SEND_CONFIRMATION` | No | `true` | Also email the customer a "we've received your enquiry" confirmation |
| `RESEND_SEGMENT_ID` | No | `78261eea-...` | Resend segment that footer newsletter sign-ups are also added to |
| `NEWSLETTER_SEND_WELCOME` | No | `true` | Email new subscribers a short welcome note |
| `UPSTASH_REDIS_REST_URL` | Recommended | `https://xxx.upstash.io` | Shared store for rate limiting the enquiry and newsletter forms |
| `UPSTASH_REDIS_REST_TOKEN` | Recommended | `AXXXX...` | Token for the above |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | No | `abc123...` | Only if you verify Search Console with the "HTML tag" method |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | No | `G-XXXXXXX` | Google Analytics 4. Loaded only after a visitor accepts analytics cookies |

> **Without `RESEND_API_KEY` in production**, enquiries and newsletter sign-ups fail with an error shown to the visitor, so set it before deploying. Without Upstash, rate limiting is in-memory only (works, but weaker).

---

## 2. Resend (enquiry emails + newsletter)

[Resend](https://resend.com) sends the emails. The free tier covers 3,000 emails/month; check resend.com/pricing for current contact limits.

### 2.1 Create the account and verify your domain
1. Sign up at **resend.com**.
2. Go to **Domains → Add Domain** and enter `spacesioberyl.com`.
3. Resend shows several DNS records (SPF `TXT`, DKIM `TXT`/`CNAME`, and an `MX` record for the bounce subdomain). Add each one where your domain's DNS is managed (your registrar, or **Vercel → Domains** if Vercel manages DNS). Copy names and values exactly.
4. Back in Resend, click **Verify DNS Records**. It usually takes a few minutes, occasionally up to a few hours.

Until the domain is verified, Resend only lets you send *to your own Resend login email* from `onboarding@resend.dev`. That's fine for a first test but not for real customers.

### 2.2 Create an API key
1. **API Keys → Create API Key**.
2. Name: `spacesioberyl-production`. Permission: **Full access** (needed to add newsletter contacts). Domain: `spacesioberyl.com`.
3. Copy the key (starts with `re_`); it's shown once. Set it as `RESEND_API_KEY` in Vercel.

### 2.3 Set the sender
Set `LEAD_FROM_EMAIL` in Vercel, e.g.:

```
Spacesio Beryl <enquiries@spacesioberyl.com>
```

The address doesn't need a real mailbox; replies go to the customer (for enquiries) or to `info@spacesioberyl.com` (for confirmations and welcome emails) via the `Reply-To` header.

### 2.4 Newsletter contacts (optional segment)
Footer sign-ups are added to **Audience → Contacts** with just `RESEND_API_KEY`; no extra setup is needed.
1. Optional, to keep subscribers grouped: **Audience → Segments → Create segment**, name it `Newsletter`.
2. Copy its **ID** and set it as `RESEND_SEGMENT_ID` in Vercel.
3. To email subscribers later: **Broadcasts → Create**, choose the `Newsletter` segment (or all contacts). Resend adds unsubscribe links automatically.

### 2.5 Test it
After redeploying:
1. Submit the form on `/contact`. You should get an email at `LEAD_NOTIFICATION_EMAIL` with subject `New General Enquiry: <name> [SPB-2026-xxxxx]`. Hitting **Reply** answers the customer directly.
2. Subscribe in the footer. The address should appear under **Audience → Contacts** (and in the `Newsletter` segment if `RESEND_SEGMENT_ID` is set).
3. If something fails, check **Resend → Logs** and **Vercel → Project → Logs** (search for `[LeadService]`, `[API Leads]` or `[Newsletter]`).

### What each email looks like

| Email | Sent to | When | Toggle |
|---|---|---|---|
| New enquiry | `LEAD_NOTIFICATION_EMAIL` | Every contact/enquiry form submission | Always on |
| Enquiry confirmation | The customer | Same time | `LEAD_SEND_CONFIRMATION=true` |
| Newsletter welcome | The new subscriber | On sign-up | `NEWSLETTER_SEND_WELCOME=true` |

---

## 3. Upstash Redis (rate limiting)

The enquiry and newsletter forms are rate limited. Vercel runs many short-lived server instances, so counts must live in a shared store.

1. Sign up at **upstash.com** → **Create Database** (Redis, region **Mumbai / ap-south-1**, free tier).
2. On the database page, open the **REST API** section and copy `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` into Vercel.

Without these the limiter still works, but only within each server instance, so it's much weaker in production.

Current limits:

| Form | Per IP | Per email address | Max request size |
|---|---|---|---|
| Enquiry (`/api/leads`) | 3 / 10 min, 15 / day | 5 / day | 16 KB |
| Newsletter (`/api/newsletter`) | 5 / 10 min, 20 / day | 3 / day | 2 KB |

Change them at the top of `src/app/api/leads/route.ts` and `src/app/api/newsletter/route.ts`.

---

## 4. Google Search Console

Two ways to verify ownership:

**A. Domain property via DNS (recommended).** Covers `www` and non-`www`, and needs no deploy.
1. Search Console → **Add property → Domain** → `spacesioberyl.com`.
2. Add the `google-site-verification=…` value as a **TXT** record on `@` in your DNS.
3. Click **Verify**.

**B. URL-prefix property via HTML file.** Already in the repo at `public/googlec1388093690dd47a.html`, for the property `https://www.spacesioberyl.com/`. It works once this code is deployed. Don't delete the file, or verification is lost.

Then:
1. **Sitemaps** → submit `sitemap.xml`.
2. **URL Inspection** (top search bar) → `https://www.spacesioberyl.com/` → **Request indexing**. Repeat for `/collection`, `/about`, `/contact`.

---

## 5. Google Analytics (optional)

1. Create a GA4 property at analytics.google.com and copy the **Measurement ID** (`G-…`).
2. Set `NEXT_PUBLIC_GA_MEASUREMENT_ID` in Vercel and redeploy.

GA loads only for visitors who accept analytics cookies in the consent banner. Custom events (`whatsapp_click`, `contact_form_submit`, `newsletter_subscribe`, …) are listed in `src/lib/analytics.ts`.

---

## 6. Pre-launch checklist

- [ ] `NEXT_PUBLIC_SITE_URL` set to `https://www.spacesioberyl.com`
- [ ] Resend domain verified, `RESEND_API_KEY` and `LEAD_FROM_EMAIL` set (`RESEND_SEGMENT_ID` optional)
- [ ] Test enquiry received; reply reaches the customer
- [ ] Test newsletter sign-up appears in Resend → Audience → Contacts
- [ ] Upstash keys set
- [ ] Search Console verified, sitemap submitted
- [ ] WhatsApp number `+91 93184 07041` is on WhatsApp (ideally WhatsApp Business)
- [ ] Privacy Policy and Terms reviewed by someone familiar with Indian law

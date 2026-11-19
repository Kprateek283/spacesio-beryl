# Site features and where they live

A map of the production features on spacesioberyl.com: what each does and which files to change. For setup (env vars, Resend, Upstash, Search Console) see [SETUP.md](./SETUP.md).

---

## Site-wide settings

**`src/lib/site-config.ts`** is the single place for the brand name, site URL, homepage title, description, navigation, social links and contact details (phone, WhatsApp number, email, address, opening hours). Most of the site reads from here, including the contact page, footer, legal pages, emails and Google's structured data.

---

## SEO

| What | Where |
|---|---|
| Default title, description, Open Graph / Twitter cards, robots rules, Search Console tag | `src/app/(site)/layout.tsx` (`metadata`) |
| Homepage title and structured data (Organization + local business: address, phone, hours, Instagram) | `src/app/(site)/page.tsx` |
| Per-page titles and canonical URLs | each `page.tsx` under `src/app/(site)/` |
| Sitemap / robots.txt | `src/app/sitemap.ts`, `src/app/robots.ts` |
| Search Console verification file | `public/googlec1388093690dd47a.html` (don't delete) |

Page titles are written without the brand; the layout's title template appends `| Spacesio Beryl` automatically.

---

## Homepage hero

**`src/components/sections/HeroSection.tsx`**

- One screen tall. While it's at the top of the page it captures wheel, touch and arrow-key input, and each gesture plays one fixed ~1.1s transition (crossfade + text slide), so it runs smoothly regardless of input.
- After slide 5 the next scroll releases control and glides to the content below; scrolling back to the very top hands control back to the hero.
- Slide numbers (bottom right) are clickable.
- A transition waits for its photo to be loaded and decoded (up to 4s) so it never fades into an empty frame.
- Respects "reduce motion" (simple fades only).
- Slides are the `slides` array at the top of the file.

Related: smooth scrolling is configured in `src/hooks/useLenis.ts` (`lerp: 0.1`).

---

## Navigation

| What | Where |
|---|---|
| Header (desktop links, theme toggle, Contact button) | `src/components/layout/Navbar.tsx` |
| Phone/tablet menu (below 1024px): full-screen black overlay with links, WhatsApp, phone and email | `src/components/layout/MobileMenu.tsx` |

The menu locks page scroll while open, closes on Escape, a link tap or route change, and keeps keyboard focus inside.

The logo is always black and yellow. On dark backgrounds it gets a thin white outline via the `logo-outline` utility in `src/app/globals.css`.

---

## Contact / enquiry form

| What | Where |
|---|---|
| Form UI | `src/components/contact/ContactForm.tsx` |
| API endpoint | `src/app/api/leads/route.ts` |
| Email delivery (Resend) | `src/lib/services/leadService.ts` |

Flow: rate limit by IP → size check → validation (length caps on every field) → honeypot → rate limit by email → product check → email to the team (and optional confirmation to the customer) → reference ID `SPB-YYYY-NNNNN` shown to the visitor.

If email delivery fails, the visitor sees an honest error with the phone number and email. Without `RESEND_API_KEY` (local development, and **temporarily in production until Resend is set up**), enquiries are written to the server log instead of emailed. See the "Temporary mode" note in SETUP.md.

---

## Newsletter

| What | Where |
|---|---|
| Footer form (loading / success / error states, consent note) | `src/components/layout/NewsletterForm.tsx` |
| API endpoint | `src/app/api/newsletter/route.ts` |
| Resend audience + welcome email | `src/lib/services/newsletterService.ts` |

Existing subscribers see "You're already on the list" rather than an error.

**Currently hidden** from the footer until Resend is set up (see the "Temporary mode" note in SETUP.md).

---

## Rate limiting

**`src/lib/rate-limit.ts`**: fixed-window limiter backed by Upstash Redis (REST API), falling back to in-memory when not configured. IPs and emails are hashed before storage. If Redis is unreachable it lets requests through (and logs), so an outage never blocks real customers. If the host doesn't expose a client IP, the per-IP check is skipped rather than lumping all visitors together.

---

## WhatsApp

| What | Where |
|---|---|
| Floating button on every page | `src/components/ui/WhatsAppButton.tsx` (mounted in the root layout) |
| Link builder | `src/lib/whatsapp.ts` |
| Number | `siteConfig.contact.whatsapp` (digits only, with country code) |

The pre-filled message mentions the page the visitor is on. Also linked from the contact page, footer and mobile menu.

---

## Cookie consent

| What | Where |
|---|---|
| Banner + preferences panel | `src/components/consent/CookieConsent.tsx` |
| Consent storage (`sb_consent` cookie, 6 months) | `src/lib/consent.ts` |
| Loads Google Analytics only after opt-in | `src/components/consent/ConsentScripts.tsx` |
| Footer "Cookie Settings" link | `src/components/consent/CookieSettingsButton.tsx` |

Categories: Strictly necessary (always on), Analytics, Marketing. `trackEvent()` in `src/lib/analytics.ts` does nothing unless analytics consent is given. To re-ask everyone (e.g. after adding a new tracking tool), bump `CONSENT_VERSION` in `src/lib/consent.ts`.

---

## Legal pages

`/privacy` and `/terms`, built with the shared `src/components/legal/LegalPage.tsx` (pure black & white, 20% side margins on desktop). Content is in `src/app/(site)/privacy/page.tsx` and `src/app/(site)/terms/page.tsx`. Update the "Last updated" date when you change them.

These are templates, not legal advice. Have them reviewed, especially before adding payments or new tracking.

---

## Theme and colours

`src/app/globals.css`: light mode is warm ivory; dark mode is pure black (`--background: 0 0% 0%`) with 6% grey panels and 20% grey hairlines. Tailwind uses class-based dark mode (`darkMode: "class"` in `tailwind.config.ts`), driven by `next-themes`.

---

## Images and performance

- Source photos are capped at 2560px wide and compressed (total went from 20.4 MB to 5.2 MB). Keep new uploads under ~500 KB and 2560px wide.
- `sharp` is installed so Next.js image optimisation is fast in production.
- `next.config.mjs` caps generated sizes at 2560px and caches optimised images for 31 days.

---

## Tests

```bash
npx jest
```

| File | Covers |
|---|---|
| `__tests__/lead-api.test.ts` | Enquiry API: validation, honeypot, product checks, rate limits, size limits, delivery failure |
| `__tests__/lead-service.test.ts` | Resend payloads, HTML escaping, confirmation emails, missing-key behaviour |
| `__tests__/newsletter.test.ts` | Newsletter API and service: validation, honeypot, duplicates, failures, rate limits, welcome email |

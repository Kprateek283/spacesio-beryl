"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";

type Status = "idle" | "loading" | "success" | "error";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    setMessage("");

    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, company_website: form.get("company_website") || "" }),
      });
      const result = await res.json().catch(() => ({}));
      if (res.ok && result.success) {
        setStatus("success");
        setMessage(
          result.status === "already_subscribed"
            ? "You're already on the list. Thank you."
            : "Thank you for subscribing."
        );
        setEmail("");
        trackEvent("newsletter_subscribe");
      } else {
        setStatus("error");
        setMessage(result.error || "We couldn't subscribe you right now. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("We couldn't subscribe you right now. Please try again.");
    }
  };

  return (
    <div>
      <form onSubmit={onSubmit} className="relative flex items-center" noValidate={false}>
        {/* Honeypot: hidden from people, filled in by bots */}
        <input
          type="text"
          name="company_website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute left-[-9999px] w-px h-px opacity-0"
        />
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          inputMode="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status !== "loading") setStatus("idle");
          }}
          placeholder="Enter your email"
          aria-label="Email address for newsletter"
          aria-invalid={status === "error"}
          aria-describedby="newsletter-status"
          disabled={status === "loading"}
          className="w-full bg-neutral-900 border border-neutral-800 text-white text-base lg:text-sm rounded-full pl-5 pr-14 py-3 outline-none focus:border-neutral-500 transition-colors disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          aria-label="Subscribe to newsletter"
          className="absolute right-1.5 top-1/2 -translate-y-1/2 w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:bg-neutral-200 transition-colors disabled:cursor-wait"
        >
          {status === "loading" ? (
            <span className="w-4 h-4 rounded-full border-2 border-black/20 border-t-black animate-spin" aria-hidden="true" />
          ) : status === "success" ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          )}
        </button>
      </form>

      <p
        id="newsletter-status"
        role="status"
        aria-live="polite"
        className={`mt-3 min-h-[1.25rem] text-xs ${status === "error" ? "text-red-400" : "text-white"}`}
      >
        {message}
      </p>
      <p className="text-[11px] leading-relaxed text-neutral-500">
        By subscribing you agree to receive occasional emails from us. See our{" "}
        <Link href="/privacy" className="underline underline-offset-2 hover:text-white">
          Privacy Policy
        </Link>
        . Unsubscribe anytime.
      </p>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { CONSENT_CHANGE_EVENT, ConsentState, readConsent } from "@/lib/consent";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

/**
 * Loads third-party tracking only after the visitor has opted in.
 * Set NEXT_PUBLIC_GA_MEASUREMENT_ID (e.g. G-XXXXXXX) to enable Google Analytics.
 * Nothing is loaded, and no analytics cookies are set, until "Analytics" is accepted.
 */
export function ConsentScripts() {
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    let loaded = readConsent()?.analytics ?? false;
    setAnalytics(loaded);
    const onChange = (e: Event) => {
      const state = (e as CustomEvent<ConsentState>).detail;
      if (state.analytics) {
        loaded = true;
        setAnalytics(true);
      } else if (loaded) {
        // Scripts can't be un-run, so a full reload is the reliable way to
        // stop tracking after consent is withdrawn.
        window.location.reload();
      }
    };
    window.addEventListener(CONSENT_CHANGE_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_CHANGE_EVENT, onChange);
  }, []);

  if (!GA_ID || !analytics) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}', { anonymize_ip: true });`}
      </Script>
    </>
  );
}

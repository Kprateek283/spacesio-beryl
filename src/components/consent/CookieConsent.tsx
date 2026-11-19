"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  CONSENT_OPEN_EVENT,
  ConsentState,
  readConsent,
  saveConsent,
} from "@/lib/consent";

const categories = [
  {
    key: "necessary" as const,
    title: "Strictly necessary",
    description:
      "Required for the website to work, such as remembering your theme and this cookie choice. These cannot be switched off.",
    locked: true,
  },
  {
    key: "analytics" as const,
    title: "Analytics",
    description:
      "Help us understand which pages and materials visitors find useful, so we can improve the site. Data is aggregated and anonymous.",
    locked: false,
  },
  {
    key: "marketing" as const,
    title: "Marketing",
    description:
      "Used to measure our campaigns and show you relevant Spacesio Beryl content on other platforms.",
    locked: false,
  },
];

function Toggle({
  checked,
  disabled,
  onChange,
  labelledBy,
}: {
  checked: boolean;
  disabled?: boolean;
  onChange?: (value: boolean) => void;
  labelledBy: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-labelledby={labelledBy}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border border-white transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-60 ${
        checked ? "bg-white" : "bg-black"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full transition-transform duration-300 ${
          checked ? "translate-x-[22px] bg-black" : "translate-x-[3px] bg-white"
        }`}
      />
    </button>
  );
}

export function CookieConsent() {
  const [open, setOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [prefs, setPrefs] = useState({ analytics: false, marketing: false });
  const reduceMotion = useReducedMotion();
  const idPrefix = useId();

  useEffect(() => {
    const existing = readConsent();
    if (existing) {
      setPrefs({ analytics: existing.analytics, marketing: existing.marketing });
    } else {
      // Small delay so the banner doesn't compete with the hero intro.
      const t = window.setTimeout(() => setOpen(true), 1200);
      return () => window.clearTimeout(t);
    }
  }, []);

  useEffect(() => {
    const handleOpen = () => {
      const existing: ConsentState | null = readConsent();
      if (existing) setPrefs({ analytics: existing.analytics, marketing: existing.marketing });
      setShowDetails(true);
      setOpen(true);
    };
    window.addEventListener(CONSENT_OPEN_EVENT, handleOpen);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, handleOpen);
  }, []);

  const commit = (choice: { analytics: boolean; marketing: boolean }) => {
    saveConsent(choice);
    setPrefs(choice);
    setOpen(false);
    setShowDetails(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="false"
          aria-labelledby={`${idPrefix}-title`}
          aria-describedby={`${idPrefix}-desc`}
          data-lenis-prevent
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed z-[100] bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:w-[440px] max-h-[calc(100vh-2rem)] overflow-y-auto bg-black text-white border border-white/20 shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
        >
          <div className="p-6 md:p-8">
            <div className="text-[10px] font-medium tracking-[0.3em] uppercase mb-4">Privacy</div>
            <h2 id={`${idPrefix}-title`} className="font-serif text-2xl md:text-3xl leading-tight mb-3">
              Your space, your choice.
            </h2>
            <p id={`${idPrefix}-desc`} className="text-sm font-light leading-relaxed">
              We use essential cookies to run this site and, with your permission, analytics and marketing cookies to
              improve your experience. Read our{" "}
              <Link href="/privacy" className="underline underline-offset-4 hover:no-underline">
                Privacy Policy
              </Link>
              .
            </p>

            <AnimatePresence initial={false}>
              {showDetails && (
                <motion.ul
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden mt-6 border-t border-white/20"
                >
                  {categories.map((cat) => {
                    const labelId = `${idPrefix}-${cat.key}`;
                    const checked = cat.locked ? true : prefs[cat.key as "analytics" | "marketing"];
                    return (
                      <li key={cat.key} className="flex items-start justify-between gap-6 py-5 border-b border-white/20">
                        <div>
                          <div id={labelId} className="text-sm font-medium mb-1">
                            {cat.title}
                            {cat.locked && <span className="ml-2 text-[10px] tracking-widest uppercase">Always on</span>}
                          </div>
                          <p className="text-xs font-light leading-relaxed">{cat.description}</p>
                        </div>
                        <Toggle
                          checked={checked}
                          disabled={cat.locked}
                          labelledBy={labelId}
                          onChange={(value) => setPrefs((p) => ({ ...p, [cat.key]: value }))}
                        />
                      </li>
                    );
                  })}
                </motion.ul>
              )}
            </AnimatePresence>

            <div className="mt-6 flex flex-col gap-3">
              {showDetails ? (
                <>
                  <button
                    type="button"
                    onClick={() => commit(prefs)}
                    className="w-full py-3 bg-white text-black text-xs font-medium tracking-[0.15em] uppercase border border-white hover:bg-black hover:text-white transition-colors duration-300"
                  >
                    Save preferences
                  </button>
                  <button
                    type="button"
                    onClick={() => commit({ analytics: true, marketing: true })}
                    className="w-full py-3 bg-black text-white text-xs font-medium tracking-[0.15em] uppercase border border-white hover:bg-white hover:text-black transition-colors duration-300"
                  >
                    Accept all
                  </button>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => commit({ analytics: false, marketing: false })}
                      className="py-3 bg-black text-white text-xs font-medium tracking-[0.15em] uppercase border border-white hover:bg-white hover:text-black transition-colors duration-300"
                    >
                      Reject all
                    </button>
                    <button
                      type="button"
                      onClick={() => commit({ analytics: true, marketing: true })}
                      className="py-3 bg-white text-black text-xs font-medium tracking-[0.15em] uppercase border border-white hover:bg-black hover:text-white transition-colors duration-300"
                    >
                      Accept all
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowDetails(true)}
                    className="py-2 text-xs font-medium tracking-[0.15em] uppercase underline underline-offset-4 hover:no-underline"
                  >
                    Customize
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

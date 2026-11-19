"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { siteConfig } from "@/lib/site-config";
import { trackEvent } from "@/lib/analytics";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

/**
 * Floating "Chat on WhatsApp" button. The pre-filled message mentions the page
 * the visitor is on (e.g. a specific product), so the team has context.
 * Shown on every page; it is mounted once in the root layout so it persists
 * across navigation.
 */
export function WhatsAppButton() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const reduceMotion = useReducedMotion();

  // Short entrance delay so it doesn't compete with the page's intro animation.
  useEffect(() => {
    const t = window.setTimeout(() => setVisible(true), 800);
    return () => window.clearTimeout(t);
  }, []);

  const handleClick = () => {
    trackEvent("whatsapp_click", { page: pathname });
  };

  const message = () => {
    if (typeof document === "undefined") return `Hi ${siteConfig.name}, I'd like to know more.`;
    const pageTitle = document.title.split(" | ")[0];
    const onPage = isHome ? "" : ` I'm looking at "${pageTitle}" (${window.location.href}).`;
    return `Hi ${siteConfig.name}, I'd like to know more.${onPage}`;
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          href={buildWhatsAppUrl()}
          onClick={(e) => {
            // Build the message at click time so it reflects the current page.
            e.currentTarget.href = buildWhatsAppUrl(message());
            handleClick();
          }}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with us on WhatsApp"
          onMouseEnter={() => setExpanded(true)}
          onMouseLeave={() => setExpanded(false)}
          onFocus={() => setExpanded(true)}
          onBlur={() => setExpanded(false)}
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.6, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.6, y: 16 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed z-[90] bottom-5 right-5 md:bottom-8 md:right-8 flex items-center h-14 rounded-full bg-black text-white border border-white/20 shadow-[0_12px_40px_rgba(0,0,0,0.35)] overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black dark:focus-visible:outline-white"
        >
          <span className="relative flex items-center justify-center w-14 h-14 shrink-0">
            <WhatsAppIcon className="w-6 h-6" />
            {/* Small online dot in WhatsApp green */}
            <span className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-[#25D366] ring-2 ring-black" />
          </span>
          <motion.span
            initial={false}
            animate={{ width: expanded ? "auto" : 0, opacity: expanded ? 1 : 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="hidden md:block whitespace-nowrap text-xs font-medium tracking-[0.15em] uppercase"
          >
            <span className="pr-6">Chat on WhatsApp</span>
          </motion.span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}

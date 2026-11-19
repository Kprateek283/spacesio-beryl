"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { siteConfig } from "@/lib/site-config";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { getLenis } from "@/hooks/useLenis";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  pathname: string;
}

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Full-screen navigation for phones and tablets (below the lg breakpoint).
 * Locks page scroll while open, closes on Escape / link tap, and keeps
 * keyboard focus inside the dialog.
 */
export function MobileMenu({ open, onClose, pathname }: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const links = [...siteConfig.navigation, { name: "Contact", href: "/contact" }];

  // Lock scrolling (Lenis + native) while the menu is open.
  useEffect(() => {
    if (!open) return;
    const lenis = getLenis();
    const wasStopped = lenis?.isStopped ?? false;
    lenis?.stop();
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
      // Don't restart Lenis if something else (e.g. the hero) had it stopped.
      if (!wasStopped) lenis?.start();
    };
  }, [open]);

  // Escape to close + simple focus trap.
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const focusables = () =>
      Array.from(panel?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? []);
    focusables()[0]?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusables();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          data-lenis-prevent
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.25 } }}
          transition={{ duration: reduceMotion ? 0.15 : 0.4, ease }}
          className="fixed inset-0 z-[100] flex flex-col bg-black text-white overflow-y-auto lg:hidden"
          style={{ paddingTop: "calc(env(safe-area-inset-top) + 104px)", paddingBottom: "calc(env(safe-area-inset-bottom) + 32px)" }}
        >
          <nav className="flex-1 px-6 sm:px-12">
            <ul className="flex flex-col">
              {links.map((item, i) => (
                <li key={item.href} className="overflow-hidden border-b border-white/15">
                  <motion.div
                    initial={reduceMotion ? { opacity: 0 } : { y: "100%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.15 } }}
                    transition={{ duration: 0.6, ease, delay: reduceMotion ? 0 : 0.08 + i * 0.06 }}
                  >
                    <Link
                      href={item.href}
                      onClick={onClose}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      className="group flex items-center justify-between py-5 font-serif uppercase text-[clamp(2.25rem,9vw,4rem)] leading-none tracking-tight"
                    >
                      <span className={isActive(item.href) ? "" : "opacity-60 group-hover:opacity-100 transition-opacity"}>
                        {item.name}
                      </span>
                      <span className="text-xs font-sans tracking-[0.3em] opacity-50">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>
          </nav>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.4 }}
            className="px-6 sm:px-12 pt-10 flex flex-col gap-5 text-sm"
          >
            <a
              href={buildWhatsAppUrl(`Hi ${siteConfig.name}, I'd like to know more.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 min-h-[52px] border border-white text-xs font-medium tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-colors"
            >
              <WhatsAppIcon className="w-4 h-4" />
              Chat on WhatsApp
            </a>
            <div className="flex flex-col gap-1 font-light">
              <a href={siteConfig.contact.phoneHref} className="py-2">{siteConfig.contact.phone}</a>
              <a href={`mailto:${siteConfig.contact.email}`} className="py-2">{siteConfig.contact.email}</a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import ButtonWithIcon from "@/components/ui/button-with-icon";
import { MobileMenu } from "@/components/layout/MobileMenu";

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // Close the menu whenever the route changes.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Close it if the screen grows past the breakpoint where the full nav shows.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => mq.matches && setMenuOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      const threshold = isHome ? window.innerHeight * 0.8 : 50;

      setIsScrolled(window.scrollY > threshold);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isHome]);

  const isTransparent = !isScrolled;
  const useLightNavbar = isHome && isTransparent;

  return (
    <>
    <header
      className={cn(
        "fixed top-0 left-0 w-full px-[clamp(24px,5vw,96px)] pt-5 pb-3 md:pt-6 md:pb-4 transition-all duration-500",
        // Above the open mobile menu (and floating buttons) so the close button stays reachable.
        menuOpen ? "z-[110]" : "z-50",
        menuOpen
          ? "bg-transparent border-b border-transparent text-white"
          : isScrolled
            ? "border-b border-border/30 bg-background/25 text-foreground backdrop-blur-xl"
            : "bg-transparent",
        !menuOpen && (useLightNavbar ? "text-white" : "text-foreground")
      )}
    >
      <nav className="flex w-full items-center justify-between">
        {/* Logo */}
        <Link href="/" aria-label={`${siteConfig.name} home`} className="flex items-center min-h-[44px] -my-1">
          <Image
            src="/assets/icons/logo.png"
            alt={siteConfig.name}
            width={160}
            height={40}
            // Logo always keeps its black & yellow colours; on dark backgrounds it
            // gets a thin white outline (same treatment as the footer logo).
            className={cn(
              "h-8 w-auto object-contain transition-all duration-300 md:h-10 dark:logo-outline",
              menuOpen && "logo-outline"
            )}
            priority
          />
        </Link>

        {/* Navigation */}
        <div className="hidden items-center gap-8 text-base font-medium uppercase tracking-widest lg:flex">
          {siteConfig.navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="transition-opacity duration-300 hover:opacity-70"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 sm:gap-4 text-sm font-bold uppercase tracking-widest md:text-base">
          <ThemeToggle className="w-11 h-11 lg:w-10 lg:h-10" />

          {/* On phones the Contact link lives in the menu, to keep the header uncluttered. */}
          <ButtonWithIcon
            href="/contact"
            text="Contact"
            className={cn(
              "hidden sm:inline-flex transition-all duration-300",
              menuOpen
                ? "border-white/80 hover:border-white hover:bg-white hover:text-black"
                : isScrolled || !isHome
                  ? "border-foreground/80 hover:border-foreground hover:bg-foreground hover:text-background"
                  : "border-white/80 hover:border-white hover:bg-white hover:text-black"
            )}
          />

          {/* Menu button: phones & tablets only */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="lg:hidden relative w-11 h-11 rounded-full border border-current/30 flex items-center justify-center hover:border-current/60 transition-colors"
          >
            <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
            <span
              aria-hidden="true"
              className={cn(
                "absolute h-[1.5px] w-5 bg-current transition-transform duration-300 ease-out",
                menuOpen ? "rotate-45" : "-translate-y-[4px]"
              )}
            />
            <span
              aria-hidden="true"
              className={cn(
                "absolute h-[1.5px] w-5 bg-current transition-transform duration-300 ease-out",
                menuOpen ? "-rotate-45" : "translate-y-[4px]"
              )}
            />
          </button>
        </div>
      </nav>
    </header>
    <MobileMenu open={menuOpen} onClose={closeMenu} pathname={pathname} />
    </>
  );
}
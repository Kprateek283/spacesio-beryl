"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import ButtonWithIcon from "@/components/ui/button-with-icon";

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      const threshold = isHome ? window.innerHeight * 3.8 : 50;

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
    <header
      className={cn(
        "fixed top-0 left-0 z-50 w-full px-[clamp(24px,5vw,80px)] py-3 transition-all duration-500",
        isScrolled
          ? "border-b border-border/30 bg-background/25 text-foreground backdrop-blur-xl"
          : "bg-transparent",
        useLightNavbar ? "text-white" : "text-foreground"
      )}
    >
      <nav className="mx-auto flex w-full max-w-[1600px] items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/assets/icons/logo.png"
            alt={siteConfig.name}
            width={160}
            height={40}
            className="h-8 w-auto object-contain transition-all duration-300 md:h-10"
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
        <div className="flex items-center gap-4 text-sm font-bold uppercase tracking-widest md:text-base">
          <ThemeToggle />

          <ButtonWithIcon
            href="/contact"
            text="Contact"
            className={cn(
              "transition-all duration-300",
              isScrolled || !isHome
                ? "border-foreground/80 hover:border-foreground hover:bg-foreground hover:text-background"
                : "border-white/80 hover:border-white hover:bg-white hover:text-black"
            )}
          />
        </div>
      </nav>
    </header>
  );
}
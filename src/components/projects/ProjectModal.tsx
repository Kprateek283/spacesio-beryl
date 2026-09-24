"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { getLenis } from "@/hooks/useLenis";

export function ProjectModal({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const close = () => router.back();

  useEffect(() => {
    const lenis = getLenis();
    lenis?.stop();
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      lenis?.start();
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[60] bg-background overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <button
        type="button"
        onClick={close}
        aria-label="Close project"
        className="fixed top-6 right-6 md:top-10 md:right-10 z-[70] w-11 h-11 flex items-center justify-center rounded-full bg-background/90 backdrop-blur border border-border hover:bg-accent hover:text-accent-foreground hover:border-accent transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
      {children}
    </motion.div>
  );
}

"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motionTokens } from "./motion";

gsap.registerPlugin(ScrollTrigger);

interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}

export function FadeIn({
  children,
  className = "",
  delay = 0,
  y = motionTokens.distance.base,
}: FadeInProps) {
  const el = useRef<HTMLDivElement>(null);
  const preferReducedMotion = typeof window !== 'undefined' ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : false;

  useEffect(() => {
    if (!el.current || preferReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.current,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration: motionTokens.duration.base,
          ease: motionTokens.ease.smooth,
          delay,
          scrollTrigger: {
            trigger: el.current,
            start: "top 90%",
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [delay, y, preferReducedMotion]);

  if (preferReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={el} className={className} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}

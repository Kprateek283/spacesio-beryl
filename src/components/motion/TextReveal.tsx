"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motionTokens } from "./motion";

gsap.registerPlugin(ScrollTrigger);

interface TextRevealProps {
  children: React.ReactNode;
  as?: React.ElementType;
  className?: string;
  delay?: number;
}

export function TextReveal({
  children,
  as: Component = "span",
  className = "",
  delay = 0,
}: TextRevealProps) {
  const el = useRef<HTMLElement>(null);
  const preferReducedMotion = typeof window !== 'undefined' ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : false;

  useEffect(() => {
    if (!el.current || preferReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.current,
        { y: "100%", opacity: 0 },
        {
          y: "0%",
          opacity: 1,
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
  }, [delay, preferReducedMotion]);

  if (preferReducedMotion) {
    return <Component className={className}>{children}</Component>;
  }

  return (
    <span className="inline-block overflow-hidden align-bottom">
      <Component ref={el} className={`inline-block ${className}`}>
        {children}
      </Component>
    </span>
  );
}

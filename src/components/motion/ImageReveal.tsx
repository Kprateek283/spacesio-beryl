"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motionTokens } from "./motion";

gsap.registerPlugin(ScrollTrigger);

interface ImageRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
}

export function ImageReveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
}: ImageRevealProps) {
  const container = useRef<HTMLDivElement>(null);
  const preferReducedMotion = typeof window !== 'undefined' ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : false;

  useEffect(() => {
    if (!container.current || preferReducedMotion) return;

    let clipStart = "inset(100% 0 0 0)";
    if (direction === "down") clipStart = "inset(0 0 100% 0)";
    if (direction === "left") clipStart = "inset(0 0 0 100%)";
    if (direction === "right") clipStart = "inset(0 100% 0 0)";

    const ctx = gsap.context(() => {
      // Reveal the container using clip-path inset
      gsap.fromTo(
        container.current,
        { clipPath: clipStart },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: motionTokens.duration.slow,
          ease: motionTokens.ease.inOut,
          delay,
          scrollTrigger: {
            trigger: container.current,
            start: "top 85%",
          },
        }
      );

      // Subtle scale down effect for the image inside
      const img = container.current?.querySelector("img");
      if (img) {
        gsap.fromTo(
          img,
          { scale: 1.1 },
          {
            scale: 1,
            duration: motionTokens.duration.slow,
            ease: motionTokens.ease.inOut,
            delay,
            scrollTrigger: {
              trigger: container.current,
              start: "top 85%",
            },
          }
        );
      }
    }, container);

    return () => ctx.revert();
  }, [delay, direction, preferReducedMotion]);

  if (preferReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={container} className={`overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

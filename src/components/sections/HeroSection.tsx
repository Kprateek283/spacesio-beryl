"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import FoldText from "@/components/reactbits/FoldText";
import { Magnetic } from "@/components/ui/magnetic";
import { getLenis } from "@/hooks/useLenis";

const slides = [
  {
    image: "/assets/images/landing/hero.jpg",
    titleLines: ["Spacesio", "Beryl"],
    subtitle: "Create your own space with Spacesio."
  },
  {
    image: "/assets/images/landing/material-wood.jpg",
    titleLines: ["Premium", "Flooring"],
    subtitle: "Engineered Wood, Hardwood & Resilient Surfaces."
  },
  {
    image: "/assets/images/landing/material-wall.jpg",
    titleLines: ["Luxury", "Wallpapers"],
    subtitle: "Textured, Minimal & Hand-crafted Wall Coverings."
  },
  {
    image: "/assets/images/landing/blinds.jpg",
    titleLines: ["Elegant", "blinds"],
    subtitle: "Light Filtering & Motorized Window Treatments."
  },
  {
    image: "/assets/images/landing/deck.jpg",
    titleLines: ["Exterior", "Decks"],
    subtitle: "Durable IPE Wood & Weather-resistant Surfaces."
  }
];

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  // Only slide 1's image loads eagerly. The rest mount once the browser is
  // idle so they don't compete with the LCP image for bandwidth on first load.
  const [mountedCount, setMountedCount] = useState(1);

  useEffect(() => {
    const hasIdleCallback = typeof window.requestIdleCallback === "function";
    const idleId = hasIdleCallback
      ? window.requestIdleCallback(() => setMountedCount(slides.length))
      : window.setTimeout(() => setMountedCount(slides.length), 300);

    return () => {
      if (hasIdleCallback) window.cancelIdleCallback(idleId as number);
      else window.clearTimeout(idleId as number);
    };
  }, []);

  useEffect(() => {
    // Wait until every slide's image is mounted so the timeline can safely
    // address images[0..4] without any being undefined.
    if (mountedCount < slides.length) return;

    gsap.registerPlugin(ScrollTrigger);

    // If users prefer reduced motion, don't run the heavy scrub animations
    const preferReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (preferReducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        }
      });

      // There are 5 slides, so we have 4 transitions.
      
      const images = gsap.utils.toArray<HTMLElement>(".hero-bg-image");
      const textBlocks = gsap.utils.toArray<HTMLElement>(".hero-text-block");
      const indicators = gsap.utils.toArray<HTMLElement>(".hero-indicator");

      // Explicitly initialize state via GSAP to avoid React inline transform parsing bugs
      gsap.set(textBlocks.slice(1), { y: 50, opacity: 0 });
      gsap.set(textBlocks[0], { y: 0, opacity: 1 });
      gsap.set(images.slice(1), { opacity: 0 });
      gsap.set(images[0], { opacity: 1 });
      gsap.set(indicators.slice(1), { opacity: 0.3 });
      gsap.set(indicators[0], { opacity: 1 });

      // Slide 1 is visible by default. We animate from slide 1 to 5.
      for (let i = 0; i < slides.length - 1; i++) {
        const nextIdx = i + 1;
        
        // Add a small pause where the current slide stays fully visible.
        tl.to({}, { duration: 0.2 });

        // Crossfade to the next slide background image
        tl.to(images[i], { opacity: 0, duration: 1, ease: "power1.inOut" }, `trans-${i}`)
          .to(images[nextIdx], { opacity: 1, duration: 1, ease: "power1.inOut" }, `trans-${i}`)
          
          // Animate text out (move up and fade out) over 0.6 seconds
          .to(textBlocks[i], { y: -50, opacity: 0, duration: 0.6, ease: "power2.inOut" }, `trans-${i}`)
          
          // Animate next text in (move up from below and fade in). Uses .to instead of .fromTo to fix scrub jumping.
          .to(textBlocks[nextIdx], { y: 0, opacity: 1, duration: 0.6, ease: "power2.inOut" }, `trans-${i}+=0.4`)
          
          // Update indicators
          .to(indicators[i], { opacity: 0.3, duration: 0.5 }, `trans-${i}`)
          .to(indicators[nextIdx], { opacity: 1, duration: 0.5 }, `trans-${i}`);
      }
      
      // Final pause at the end
      tl.to({}, { duration: 0.2 });

    }, containerRef);

    // Snap to the nearest complete slide once scrolling settles. Done via
    // Lenis's own scrollTo (rather than GSAP's built-in ScrollTrigger `snap`)
    // because ScrollTrigger's snap sets native scroll directly, which fights
    // Lenis's own residual momentum and can overshoot past the intended slide.
    const lenis = getLenis();
    let settleTimer: ReturnType<typeof setTimeout> | undefined;

    const handleScroll = () => {
      clearTimeout(settleTimer);
      settleTimer = setTimeout(() => {
        const container = containerRef.current;
        if (!container) return;

        const vh = window.innerHeight;
        const top = container.offsetTop;
        const current = window.scrollY;
        const maxScroll = top + vh * (slides.length - 1);
        if (current < top || current > maxScroll) return;

        const idx = Math.round((current - top) / vh);
        const target = top + idx * vh;
        if (Math.abs(current - target) > 2) {
          lenis?.scrollTo(target, { duration: 0.6 });
        }
      }, 120);
    };

    lenis?.on("scroll", handleScroll);

    return () => {
      ctx.revert();
      lenis?.off("scroll", handleScroll);
      clearTimeout(settleTimer);
    };
  }, [mountedCount]);

  return (
    <section ref={containerRef} className="relative w-full h-[500vh] bg-background">
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        
        {/* Background Images */}
        <div className="absolute inset-0 z-0 bg-black">
          {slides.slice(0, mountedCount).map((slide, idx) => (
            <Image
              key={`bg-${idx}`}
              src={slide.image}
              alt={slide.titleLines.join(' ')}
              fill
              priority={idx === 0}
              quality={65}
              className={`hero-bg-image object-cover object-center transition-transform duration-[10s] ease-linear scale-105`}
              style={{ opacity: idx === 0 ? 1 : 0 }}
              sizes="100vw"
            />
          ))}
          {/* Global Gradient Overlay to ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent pointer-events-none"></div>
        </div>

        {/* Content Container */}
        <div className="absolute inset-0 z-10 w-full max-w-[1600px] mx-auto px-[clamp(24px,5vw,80px)] flex flex-col justify-end pb-24 md:pb-32 pointer-events-none">
          
          {/* Absolute container to hold the overlapping text blocks */}
          <div className="relative w-full h-[40vh] md:h-[50vh] flex flex-col justify-end">
            {slides.map((slide, idx) => (
              <div 
                key={`text-${idx}`}
                className="hero-text-block absolute bottom-0 left-0 max-w-6xl opacity-0"
                style={{ willChange: 'transform, opacity' }}
              >
                {idx === 0 ? (
                  <h1 className="mb-6 md:mb-8 font-serif font-bold uppercase tracking-[0.015em] leading-[1.1]">
                    <FoldText
                      text={"Spacesio\nBeryl"}
                      splitBy="char"
                      hinge="top"
                      trigger="mount"
                      duration={0.65}
                      stagger={0}
                      ease="power3.out"
                      perspective={700}
                      creaseShading={0.55}
                      fontSize="clamp(3.5rem,8vw,9rem)"
                      fontWeight="inherit"
                      letterSpacing="0.015em"
                      wordSpacing="0.12em"
                      color="#ffffff"
                    />
                  </h1>
                ) : (
                  <h1 className="text-white font-serif font-bold text-[clamp(3.5rem,8vw,9rem)] leading-[1.1] tracking-[0.015em] uppercase mb-6 md:mb-8">
                    {slide.titleLines.map((line, lineIdx) => (
                      <span key={line}>
                        {lineIdx > 0 && <br />}
                        {line}
                      </span>
                    ))}
                  </h1>
                )}
                
                <p className="text-white/80 text-sm md:text-base font-sans font-light tracking-[0.1em] uppercase mb-10 drop-shadow-md">
                  {slide.subtitle}
                </p>
              </div>
            ))}
          </div>

          {/* Static Elements (Always visible) */}
          <div className="mt-8 pointer-events-auto">
            <Magnetic intensity={0.3}>
              <Link href="/collection" className="inline-flex items-center justify-center px-[28px] py-[13px] border border-white/55 bg-transparent text-white text-[13.5px] font-sans font-medium tracking-[0.08em] uppercase transition-all duration-200 hover:bg-white hover:text-black z-20 relative group hover:border-white">
                Explore Collection
              </Link>
            </Magnetic>
          </div>

          {/* Indicators */}
          <div className="absolute bottom-8 right-6 md:right-12 flex gap-4 text-white font-serif text-lg md:text-xl mix-blend-difference pointer-events-auto">
            {slides.map((_, idx) => (
              <span 
                key={`ind-${idx}`} 
                className="hero-indicator drop-shadow-md"
                style={{ opacity: idx === 0 ? 1 : 0.3 }}
              >
                0{idx + 1}
              </span>
            ))}
          </div>
          
        </div>
      </div>
    </section>
  );
}

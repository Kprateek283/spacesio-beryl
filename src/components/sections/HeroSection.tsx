"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { Observer } from "gsap/Observer";
import FoldText from "@/components/reactbits/FoldText";
import { Magnetic } from "@/components/ui/magnetic";
import BoxLoader from "@/components/ui/box-loader";
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

const LAST = slides.length - 1;
// A new slide change needs a pause of this long in wheel/touch input, so one
// trackpad flick (with its long inertia tail) only ever advances one slide.
const GESTURE_GAP_MS = 160;
const textShadow = "[text-shadow:0_2px_24px_rgba(0,0,0,0.35)]";

/**
 * Full-screen hero slideshow. While the hero is at the top of the page it
 * captures wheel / touch / keyboard input and plays a fixed-duration
 * transition per gesture (smooth regardless of input jitter). After the last
 * slide, control is handed back to normal scrolling; scrolling back to the
 * very top hands control back to the hero.
 */
export function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);
  // Only slide 1's image loads eagerly. The rest mount once the browser is
  // idle so they don't compete with the LCP image for bandwidth on first load.
  const [mountedCount, setMountedCount] = useState(1);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [loaderGone, setLoaderGone] = useState(false);
  const [active, setActive] = useState(0);

  const indexRef = useRef(0);
  const animatingRef = useRef(false);
  const goToRef = useRef<(next: number) => void>(() => {});

  // Slides 2-5 mount only after the first photo has loaded AND the browser is
  // idle, so they never compete with it for bandwidth or CPU (LCP). If a
  // visitor changes slide before then, goTo mounts them on demand and waits
  // for the photo to be ready.
  useEffect(() => {
    if (!heroLoaded) return;
    const hasIdleCallback = typeof window.requestIdleCallback === "function";
    const idleId = hasIdleCallback
      ? window.requestIdleCallback(() => setMountedCount(slides.length), { timeout: 600 })
      : window.setTimeout(() => setMountedCount(slides.length), 300);

    return () => {
      if (hasIdleCallback) window.cancelIdleCallback(idleId as number);
      else window.clearTimeout(idleId as number);
    };
  }, [heroLoaded]);

  // Remove the loader from the DOM once it has faded out, so its infinite
  // CSS animations stop running.
  useEffect(() => {
    if (!heroLoaded) return;
    const t = window.setTimeout(() => setLoaderGone(true), 800);
    return () => window.clearTimeout(t);
  }, [heroLoaded]);

  // Decode the other slides ahead of time so no image is decoded mid-transition.
  useEffect(() => {
    if (mountedCount < slides.length || !heroLoaded) return;
    const imgs = containerRef.current?.querySelectorAll<HTMLImageElement>(".hero-bg-image");
    imgs?.forEach((img) => {
      const decode = () => img.decode?.().catch(() => {});
      if (img.complete) decode();
      else img.addEventListener("load", decode, { once: true });
    });
  }, [mountedCount, heroLoaded]);

  const goTo = useCallback((next: number) => goToRef.current(next), []);

  useEffect(() => {
    gsap.registerPlugin(Observer);
    const container = containerRef.current;
    if (!container) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lenis = getLenis();
    const q = gsap.utils.selector(container);
    const imageAt = (i: number) => q(`.hero-bg-image[data-slide="${i}"]`)[0] as HTMLElement | undefined;
    const textAt = (i: number) => q(`.hero-text-block[data-slide="${i}"]`)[0] as HTMLElement | undefined;
    const indicatorAt = (i: number) => q(`.hero-indicator[data-slide="${i}"]`)[0] as HTMLElement | undefined;

    let currentTl: gsap.core.Timeline | null = null;
    let disposed = false;

    const isReady = (img: HTMLElement) =>
      (img as HTMLImageElement).complete && (img as HTMLImageElement).naturalWidth > 0;

    // Resolves once the image has loaded and decoded, or after `timeoutMs`
    // (so a slow network can never freeze the slideshow).
    const whenReady = (img: HTMLElement, timeoutMs: number) =>
      new Promise<void>((resolve) => {
        const el = img as HTMLImageElement;
        const done = () => {
          window.clearTimeout(timer);
          if (el.decode) el.decode().catch(() => {}).finally(resolve);
          else resolve();
        };
        const timer = window.setTimeout(resolve, timeoutMs);
        if (isReady(el)) done();
        else {
          el.addEventListener("load", done, { once: true });
          el.addEventListener("error", () => resolve(), { once: true });
        }
      });

    goToRef.current = (next: number) => {
      const current = indexRef.current;
      if (next === current || next < 0 || next > LAST || animatingRef.current) return;

      const fromImg = imageAt(current);
      const toImg = imageAt(next);
      if (!toImg || !fromImg) {
        // Images for later slides haven't mounted yet; mount them now and
        // retry once they're in the DOM.
        setMountedCount(slides.length);
        animatingRef.current = true;
        window.setTimeout(() => {
          animatingRef.current = false;
          if (!disposed) goToRef.current(next);
        }, 50);
        return;
      }

      // Never fade into an empty frame: if the next photo is still
      // downloading, hold input and start the transition once it's ready.
      if (!isReady(toImg)) {
        animatingRef.current = true;
        whenReady(toImg, 4000).then(() => {
          animatingRef.current = false;
          if (!disposed) goToRef.current(next);
        });
        return;
      }

      const dir = next > current ? 1 : -1;
      animatingRef.current = true;
      indexRef.current = next;
      setActive(next);

      const fromText = textAt(current);
      const toText = textAt(next);
      const fade = reduceMotion ? 0.3 : 1;
      const move = reduceMotion ? 0 : 48;

      // Slow "settle" zoom runs outside the timeline so it doesn't extend the
      // input lock: the next slide can be requested as soon as the crossfade
      // and text are done (~1.1s).
      gsap.killTweensOf(toImg, "scale");
      if (!reduceMotion) {
        gsap.fromTo(toImg, { scale: 1.08 }, { scale: 1, duration: 1.8, ease: "power2.out" });
      }

      currentTl?.kill();
      currentTl = gsap.timeline({
        defaults: { ease: "power3.inOut" },
        onComplete: () => {
          gsap.set(fromImg, { opacity: 0, zIndex: 0 });
          gsap.set(toImg, { zIndex: 1 });
          animatingRef.current = false;
        },
      });

      // Incoming image fades in *on top of* the outgoing one, so there is no
      // dip to black halfway through the crossfade.
      currentTl
        .set(fromImg, { zIndex: 1 })
        .set(toImg, { zIndex: 2, opacity: 0 })
        .to(toImg, { opacity: 1, duration: fade, ease: "power2.inOut" }, 0);

      if (fromText) {
        currentTl.to(fromText, { y: -move * dir, opacity: 0, duration: reduceMotion ? 0.2 : 0.55, ease: "power2.in" }, 0);
      }
      if (toText) {
        currentTl.fromTo(
          toText,
          { y: move * dir, opacity: 0 },
          { y: 0, opacity: 1, duration: reduceMotion ? 0.3 : 0.75, ease: "power3.out" },
          reduceMotion ? 0.1 : 0.35
        );
      }

      const fromInd = indicatorAt(current);
      const toInd = indicatorAt(next);
      if (fromInd) currentTl.to(fromInd, { opacity: 0.55, duration: 0.4 }, 0);
      if (toInd) currentTl.to(toInd, { opacity: 1, duration: 0.4 }, 0);
    };

    // ---- Input handling -------------------------------------------------
    let lastInput = 0;
    let engaged = false;

    const isAtTop = () => window.scrollY <= 2;

    const release = (scrollPast: boolean) => {
      if (!engaged) return;
      engaged = false;
      observer.disable();
      lenis?.start();
      if (scrollPast) {
        lenis?.scrollTo(container.offsetTop + container.offsetHeight, { duration: 1.1 });
      }
    };

    const engage = () => {
      if (engaged || !isAtTop()) return;
      engaged = true;
      // Any still-running inertia counts as the same gesture.
      lastInput = performance.now();
      lenis?.stop();
      observer.enable();
    };

    const step = (dir: 1 | -1) => {
      const now = performance.now();
      const gap = now - lastInput;
      lastInput = now;
      if (!engaged || animatingRef.current || gap < GESTURE_GAP_MS) return;

      const next = indexRef.current + dir;
      if (next > LAST) release(true);
      else if (next >= 0) goToRef.current(next);
    };

    // wheelSpeed -1 makes wheel-down and swipe-up both arrive as onUp.
    const observer = Observer.create({
      target: window,
      type: "wheel,touch",
      wheelSpeed: -1,
      tolerance: 10,
      preventDefault: true,
      ignore: "[data-lenis-prevent]",
      onUp: () => step(1),
      onDown: () => step(-1),
    });
    observer.disable();

    const onKeyDown = (e: KeyboardEvent) => {
      if (!engaged) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable='true']")) return;
      if (["ArrowDown", "PageDown", " "].includes(e.key)) {
        e.preventDefault();
        if (animatingRef.current) return;
        if (indexRef.current === LAST) release(true);
        else goToRef.current(indexRef.current + 1);
      } else if (["ArrowUp", "PageUp"].includes(e.key)) {
        e.preventDefault();
        if (!animatingRef.current) goToRef.current(indexRef.current - 1);
      }
    };

    // Re-engage once the page has settled back at the very top; release if the
    // page is scrolled by other means (scrollbar drag, focus moving, links).
    let settleTimer: ReturnType<typeof setTimeout> | undefined;
    const onScroll = () => {
      clearTimeout(settleTimer);
      if (engaged && !isAtTop()) {
        release(false);
        return;
      }
      if (!engaged && isAtTop()) {
        settleTimer = setTimeout(engage, 120);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("scroll", onScroll, { passive: true });
    engage();

    return () => {
      clearTimeout(settleTimer);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", onScroll);
      disposed = true;
      observer.kill();
      currentTl?.kill();
      if (engaged) lenis?.start();
      animatingRef.current = false;
    };
  }, []);

  return (
    <section
      ref={containerRef}
      aria-roledescription="carousel"
      aria-label="Spacesio Beryl highlights"
      className="relative w-full h-[100svh] overflow-hidden bg-black"
    >
      {/* Background Images */}
      <div className="absolute inset-0 z-0">
        {slides.slice(0, mountedCount).map((slide, idx) => (
          <Image
            key={`bg-${idx}`}
            data-slide={idx}
            src={slide.image}
            alt={slide.titleLines.join(' ')}
            fill
            priority={idx === 0}
            quality={65}
            className="hero-bg-image object-cover object-center [will-change:opacity,transform] [backface-visibility:hidden]"
            style={{ opacity: idx === 0 ? 1 : 0, zIndex: idx === 0 ? 1 : 0 }}
            sizes="100vw"
            onLoad={idx === 0 ? () => setHeroLoaded(true) : undefined}
          />
        ))}
        {/* Global Gradient Overlay to ensure text readability */}
        <div className="absolute inset-0 z-[3] bg-gradient-to-r from-black/80 via-black/20 to-transparent pointer-events-none"></div>
      </div>

      {/* Loading overlay, shown until the first hero image has downloaded */}
      {!loaderGone && (
        <div
          aria-hidden={heroLoaded}
          className={`absolute inset-0 z-30 flex flex-col items-center justify-center gap-6 bg-black transition-opacity duration-700 ease-out ${
            heroLoaded ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <BoxLoader />
          <span className="font-serif text-white/80 text-xs md:text-sm tracking-[0.35em] uppercase">
            Spacesio
          </span>
        </div>
      )}

      {/* Content Container */}
      <div className="absolute inset-0 z-10 w-full pl-[clamp(28px,8vw,176px)] pr-[clamp(24px,5vw,96px)] flex flex-col justify-end pb-24 md:pb-32 2xl:pb-40 pointer-events-none">

        {/* Absolute container to hold the overlapping text blocks */}
        <div className="relative w-full h-[40vh] md:h-[50vh] 2xl:h-[56vh] flex flex-col justify-end">
          {slides.map((slide, idx) => (
            <div
              key={`text-${idx}`}
              data-slide={idx}
              aria-hidden={idx !== active}
              className="hero-text-block absolute bottom-0 left-0 max-w-6xl 2xl:max-w-[100rem] [will-change:transform,opacity]"
              style={{ opacity: idx === 0 ? 1 : 0 }}
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
                    fontSize="clamp(3.5rem,8vw,13rem)"
                    fontWeight="inherit"
                    letterSpacing="0.015em"
                    wordSpacing="0.12em"
                    color="#ffffff"
                  />
                </h1>
              ) : (
                <h2 className="text-white font-serif font-bold text-[clamp(3.5rem,8vw,13rem)] leading-[1.1] tracking-[0.015em] uppercase mb-6 md:mb-8">
                  {slide.titleLines.map((line, lineIdx) => (
                    <span key={line}>
                      {lineIdx > 0 && <br />}
                      {line}
                    </span>
                  ))}
                </h2>
              )}

              <p className={`text-white/85 text-sm md:text-base 2xl:text-xl font-sans font-light tracking-[0.1em] uppercase mb-10 2xl:mb-12 ${textShadow}`}>
                {slide.subtitle}
              </p>
            </div>
          ))}
        </div>

        {/* Static Elements (Always visible) */}
        <div className="mt-8 pointer-events-auto">
          <Magnetic intensity={0.3}>
            <Link href="/collection" className="inline-flex items-center justify-center px-[28px] py-[13px] 2xl:px-10 2xl:py-[18px] border border-white/55 bg-transparent text-white text-[13.5px] 2xl:text-base font-sans font-medium tracking-[0.08em] uppercase transition-all duration-200 hover:bg-white hover:text-black z-20 relative group hover:border-white">
              Explore Collection
            </Link>
          </Magnetic>
        </div>

      </div>

      {/* Indicators (clickable). Positioned to sit just left of the global
          floating WhatsApp button and vertically centred with it. */}
      <div className="absolute z-10 bottom-[34px] md:bottom-[46px] right-[92px] md:right-[120px] flex gap-3 md:gap-4 text-white font-serif text-lg md:text-xl pointer-events-auto">
        {slides.map((slide, idx) => (
          <button
            key={`ind-${idx}`}
            type="button"
            data-slide={idx}
            onClick={() => goTo(idx)}
            aria-label={`Show slide ${idx + 1}: ${slide.titleLines.join(" ")}`}
            aria-current={idx === active ? "true" : undefined}
            className="hero-indicator relative after:absolute after:-inset-x-1.5 after:-inset-y-2 after:content-[''] [text-shadow:0_1px_3px_rgba(0,0,0,0.6),0_2px_16px_rgba(0,0,0,0.45)] hover:!opacity-100"
            style={{ opacity: idx === 0 ? 1 : 0.55 }}
          >
            0{idx + 1}
          </button>
        ))}
      </div>
      {/* Scroll hint */}
      <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center text-white/75 text-xs tracking-widest uppercase pointer-events-none ${textShadow}`}>
        <span className="mb-3">Scroll to explore</span>
        <Image
          src="/assets/icons/scrolldown.svg"
          alt=""
          width={24}
          height={24}
          className="animate-bounce brightness-0 invert opacity-75"
        />
      </div>
    </section>
  );
}

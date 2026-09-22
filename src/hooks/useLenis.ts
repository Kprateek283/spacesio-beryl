import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

let lenisInstance: Lenis | null = null;
let tickerUpdate: ((time: number) => void) | null = null;

// Created lazily on first access rather than only inside useLenis's effect,
// because child components can mount (and run their effects) before the
// SmoothScroll wrapper that calls useLenis(), which would otherwise see a
// null instance and silently no-op.
function ensureLenis(): Lenis | null {
  if (typeof window === 'undefined') return null;
  if (lenisInstance) return lenisInstance;

  gsap.registerPlugin(ScrollTrigger);

  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    touchMultiplier: 2,
  });
  lenisInstance = lenis;

  // Keep ScrollTrigger's scrub position in lockstep with Lenis instead of
  // relying on native scroll events, which lag a frame behind Lenis's
  // virtual scroll and cause scrubbed animations to stutter/freeze.
  lenis.on('scroll', ScrollTrigger.update);

  // Drive Lenis from GSAP's ticker so both run on the same rAF tick.
  tickerUpdate = (time: number) => {
    lenis.raf(time * 1000);
  };
  gsap.ticker.add(tickerUpdate);
  gsap.ticker.lagSmoothing(0);

  return lenis;
}

// Exposed so components (e.g. HeroSection) can drive scroll through the same
// Lenis instance instead of fighting it with native window.scrollTo calls.
export function getLenis() {
  return ensureLenis();
}

export function useLenis() {
  const pathname = usePathname();

  useEffect(() => {
    ensureLenis();
    return () => {
      if (tickerUpdate) gsap.ticker.remove(tickerUpdate);
      lenisInstance?.destroy();
      lenisInstance = null;
      tickerUpdate = null;
    };
  }, []);

  // Ensure scroll resets instantly on route change
  useEffect(() => {
    if (lenisInstance) {
      lenisInstance.scrollTo(0, { immediate: true });
    }
  }, [pathname]);
}

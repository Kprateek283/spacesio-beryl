import { useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

export function useGsap() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    // Any global GSAP configuration can go here
    // But specific animations should remain in component-level hooks
    
    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);
}

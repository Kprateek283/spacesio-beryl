"use client";

import React, { useRef, useLayoutEffect, useState, useCallback, useMemo } from 'react';
import Image, { getImageProps } from 'next/image';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import FlowArt, { FlowSection } from '../ui/story-scroll';
import { materialColors } from '@/lib/colors';
import { cn } from '@/lib/utils';

function CategoryCarousel({ images, title }: { images: string[], title: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevSlide = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  return (
    <div className="w-full lg:w-[40%] h-[50vh] lg:h-[75vh] relative rounded-xl lg:rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] group mt-8 lg:mt-0">
      {images.map((src, idx) => (
        <Image
          key={src}
          src={src}
          alt={`${title} finish ${idx + 1}`}
          fill
          sizes="(max-width: 1024px) 100vw, 40vw"
          className={cn(
            "object-cover transition-all duration-700 ease-in-out",
            idx === currentIndex ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
          )}
        />
      ))}

      {images.length > 1 && (
        <div className="absolute bottom-4 right-4 flex gap-2 z-10 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <button 
            onClick={prevSlide}
            className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/70 transition-colors border border-white/20"
            aria-label="Previous image"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={nextSlide}
            className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/70 transition-colors border border-white/20"
            aria-label="Next image"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
      
      {/* Optional Indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {images.map((_, idx) => (
            <div 
              key={idx} 
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                idx === currentIndex ? "w-6 bg-white" : "w-1.5 bg-white/50"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const categories = [
  {
    num: "01",
    title: "WOOD",
    desc: "Discover the timeless elegance of nature. Our wood collection brings warmth, acoustic harmony, and unparalleled durability to any architectural space.",
    list: ["Engineered Wood", "Hardwood", "Parquet", "Bamboo", "IPE", "Decking"],
    images: [
      "/assets/images/landing/material-wood.jpg",
      "/assets/images/landing/project-1.jpg",
      "/assets/images/landing/deck.jpg"
    ],
    link: "/collection/flooring",
    bg: materialColors.wood.bg,
    text: materialColors.wood.text
  },
  {
    num: "02",
    title: "SOFT",
    desc: "Acoustic comfort meets high-end design. Step into luxurious textures designed for modern hospitality and premium corporate environments.",
    list: ["Carpet Tiles", "Wall-to-Wall Carpet"],
    images: [
      "/assets/images/landing/material-soft.jpg",
      "/assets/images/landing/hero.jpg"
    ],
    link: "/collection/flooring",
    bg: materialColors.soft.bg,
    text: materialColors.soft.text
  },
  {
    num: "03",
    title: "RESILIENT",
    desc: "Engineered for high performance. Waterproof, scratch-resistant, and visually indistinguishable from natural materials.",
    list: ["SPC", "LVT", "Vinyl", "Homogeneous", "Healthcare", "Sports"],
    images: [
      "/assets/images/landing/material-resilient.jpg",
      "/assets/images/landing/solutions.jpg"
    ],
    link: "/collection/flooring",
    bg: materialColors.resilient.bg, 
    text: materialColors.resilient.text
  },
  {
    num: "04",
    title: "WALLS",
    desc: "Elevate your vertical spaces. From architectural wood slats to premium acoustic paneling and bespoke wallpapers.",
    list: ["Wallpaper", "Window Blinds", "Acoustic Panels"],
    images: [
      "/assets/images/landing/material-wall.jpg",
      "/assets/images/landing/blinds.jpg",
      "/assets/images/landing/wall-bg.jpg"
    ],
    link: "/collection",
    bg: materialColors.walls.bg,
    text: materialColors.walls.text
  },
];

export function MaterialsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const blindsContainerRef = useRef<HTMLDivElement>(null);
  const interiorRef = useRef<HTMLDivElement>(null);

  // Generate optimized background URL instead of downloading 5MB raw image
  const { props: { src: optimizedWoodBg } } = useMemo(() => getImageProps({
    src: "/assets/images/landing/material-wood.jpg",
    alt: "",
    width: 1920,
    height: 1080,
    quality: 60
  }), []);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const preferReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (preferReducedMotion || window.innerWidth < 768) return;

    const ctx = gsap.context(() => {
      gsap.set(".blind-slat", { 
        transformOrigin: "top center",
        transformPerspective: 1000 
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".master-sequence-trigger",
          start: "top top",
          end: "+=200%", 
          scrub: true,
          pin: true,
          refreshPriority: 10,
        }
      });

      tl.fromTo(interiorRef.current, 
        { scale: 1 },
        { scale: 1.1, ease: "none", duration: 2 },
        0
      );

      tl.to(".blind-slat", {
        rotateX: -85,
        stagger: 0.03,
        ease: "power2.inOut",
        duration: 1
      }, 0);

      tl.to(blindsContainerRef.current, {
        yPercent: -100,
        ease: "power3.inOut",
        duration: 1
      }, 0.8);

      gsap.set(".reveal-text-line", { opacity: 0, y: 30 });
      tl.to(".reveal-text-line", {
        opacity: 1,
        y: 0,
        stagger: 0.15,
        ease: "power3.out",
        duration: 0.6
      }, 1);

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="w-full flex flex-col relative z-10">
      
      {/* INTRO SEQUENCE */}
      <section className="w-full bg-background relative z-10 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
        <div className="master-sequence-trigger w-full h-screen relative bg-black overflow-hidden z-20">
          
          <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden bg-black">
            <div ref={interiorRef} className="absolute inset-0 z-0">
              <Image
                src="/assets/images/landing/interior-reveal.jpg"
                alt="Premium Architectural Interior"
                fill
                quality={60}
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-black/40" />
            </div>
            
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none text-center">
              <div className="overflow-hidden">
                <div className="reveal-text-line font-serif font-bold text-[clamp(3.5rem,10vw,10rem)] text-white leading-none tracking-[0.1em] md:tracking-[0.15em] uppercase drop-shadow-2xl">
                  Step Inside
                </div>
              </div>
              <div className="overflow-hidden mt-4 md:mt-8">
                <div className="reveal-text-line text-lg md:text-3xl font-medium text-white/90 tracking-[0.4em] md:tracking-[0.8em] uppercase drop-shadow-xl">
                  The Collection
                </div>
              </div>
            </div>
          </div>

          <div ref={blindsContainerRef} className="absolute inset-y-0 -left-[5vw] w-[110vw] z-10 flex flex-col justify-between pb-2 overflow-hidden">
            <div className="absolute left-[15%] md:left-[20%] top-0 bottom-0 w-[4px] md:w-[6px] bg-gradient-to-b from-[#1a110a] to-[#050505] z-20 shadow-[2px_0_4px_rgba(0,0,0,0.9)] opacity-95 rounded-full" />
            <div className="absolute right-[15%] md:right-[20%] top-0 bottom-0 w-[4px] md:w-[6px] bg-gradient-to-b from-[#1a110a] to-[#050505] z-20 shadow-[2px_0_4px_rgba(0,0,0,0.9)] opacity-95 rounded-full" />

            {Array.from({ length: 22 }).map((_, i) => (
              <div 
                key={i} 
                className="blind-slat w-full h-[4vh] bg-[#1a110a] border-b border-black shadow-[0_15px_30px_rgba(0,0,0,0.9)] relative overflow-hidden flex-shrink-0"
              >
                <div 
                  className="absolute inset-0 opacity-40 mix-blend-overlay"
                  style={{ 
                    backgroundImage: `url('${optimizedWoodBg}')`,
                    backgroundSize: "cover",
                    backgroundPosition: `0 -${i * 4}vh`,
                  }}
                />
                <div 
                  className="absolute inset-0"
                  style={{ 
                    backgroundImage: "linear-gradient(to bottom, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.02) 20%, rgba(0,0,0,0.4) 80%, rgba(0,0,0,0.8) 100%)" 
                  }}
                />
              </div>
            ))}

            <div className="blind-slat w-full h-[8vh] bg-[#1a110a] border-t border-white/5 border-b-[6px] border-b-black shadow-[0_30px_50px_rgba(0,0,0,1)] relative overflow-hidden flex-shrink-0 rounded-b-lg z-30">
              <div 
                className="absolute inset-0 opacity-50 mix-blend-overlay"
                style={{ 
                  backgroundImage: `url('${optimizedWoodBg}')`,
                  backgroundSize: "cover",
                  backgroundPosition: "bottom",
                }}
              />
              <div 
                className="absolute inset-0"
                style={{ 
                  backgroundImage: "linear-gradient(to bottom, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 15%, rgba(0,0,0,0.5) 85%, rgba(0,0,0,0.9) 100%)" 
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* FLOW ART MATERIALS - Vertical Stack Layout */}
      <div className="relative z-20 bg-[#050505]">
        <FlowArt aria-label="Spacesio Materials Collection">
          {categories.map((cat) => (
            <FlowSection 
              key={cat.num}
              aria-label={cat.title} 
              style={{ backgroundColor: cat.bg, color: cat.text }}
            >
              <div className="flex flex-col lg:flex-row items-center justify-between h-full w-full gap-8 lg:gap-16 pt-8 pb-12 lg:py-0">
                
                {/* Left Side: Typography */}
                <div className="flex-1 flex flex-col justify-center h-full w-full lg:w-[50%] max-w-2xl lg:py-12">
                  <div className="flex flex-col gap-6 md:gap-8">
                    {/* Top Left: Number and category */}
                    <p className="text-sm md:text-base font-bold uppercase tracking-[0.3em] opacity-80">
                      {cat.num} — {cat.title}
                    </p>
                    
                    {/* Heading */}
                    <h2 
                      className="text-[clamp(4rem,8vw,10rem)] font-bold leading-[0.85] uppercase tracking-tighter"
                    >
                      {cat.title}
                    </h2>

                    {/* Paragraph */}
                    <p className="text-[clamp(1.125rem,1.5vw,1.5rem)] font-medium leading-relaxed opacity-90 max-w-[45ch]">
                      {cat.desc}
                    </p>
                  </div>

                  {/* Finishes at the bottom */}
                  <div className="mt-12 md:mt-16">
                    <p className="mb-6 text-sm font-bold uppercase tracking-widest opacity-60">Finishes</p>
                    <ul className="grid grid-cols-2 gap-y-4 gap-x-6">
                      {cat.list.map((item, i) => (
                        <li key={i} className="text-sm md:text-base font-bold uppercase tracking-widest border-l-2 border-current pl-4">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Right Side: Image Carousel */}
                <CategoryCarousel images={cat.images} title={cat.title} />

              </div>
            </FlowSection>
          ))}
        </FlowArt>
      </div>
    </div>
  );
}

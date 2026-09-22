"use client";

import React, { useRef, useState, useLayoutEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Plus } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const FAQ_ITEMS = [
  {
    q: "Who is Spacesio Beryl?",
    a: "Spacesio Beryl is a premium interior supply house dedicated to curating and supplying exceptional flooring, luxury wallpapers, and window blinds for residential and commercial environments.",
  },
  {
    q: "What does Spacesio Beryl do?",
    a: "We meticulously source, evaluate, and supply high-quality interior finishes—including engineered wood, SPC flooring, premium wallpapers, and window treatments—providing a cohesive aesthetic for any project.",
  },
  {
    q: "Who do you work with?",
    a: "We collaborate closely with architects, interior designers, developers, and discerning private clients across the residential, commercial, and hospitality sectors.",
  },
  {
    q: "How can I learn more about Spacesio Beryl?",
    a: "You can explore our curated flooring, wall, and window collections directly on our website. For detailed technical specifications or bespoke inquiries, our team is always available.",
  },
  {
    q: "Can I discuss a project with the Spacesio Beryl team?",
    a: "Yes. Our team is available for dedicated consultations to discuss your specific interior requirements, finish specifications, and overall project goals.",
  },
];

export function AboutContent() {
  const container = useRef<HTMLDivElement>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useLayoutEffect(() => {
    const preferReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (preferReducedMotion) return;

    const ctx = gsap.context(() => {
      const fadeElements = gsap.utils.toArray<HTMLElement>(".reveal-up");
      fadeElements.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 15 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              once: true,
            },
          }
        );
      });

      const imageElements = gsap.utils.toArray<HTMLElement>(".reveal-image");
      imageElements.forEach((el) => {
        const img = el.querySelector("img");
        gsap.fromTo(
          el,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 1.0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              once: true,
            },
          }
        );
        if (img) {
          gsap.fromTo(
            img,
            { scale: 1.02 },
            {
              scale: 1,
              duration: 1.2,
              ease: "power2.out",
              scrollTrigger: {
                trigger: el,
                start: "top 85%",
                once: true,
              },
            }
          );
        }
      });

      const staggerContainers = gsap.utils.toArray<HTMLElement>(".stagger-group");
      staggerContainers.forEach((group) => {
        const items = group.querySelectorAll(".stagger-item");
        gsap.fromTo(
          items,
          { opacity: 0, y: 15 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            stagger: 0.15,
            scrollTrigger: {
              trigger: group,
              start: "top 90%",
              once: true,
            },
          }
        );
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={container} className="pt-32 pb-24 min-h-screen bg-background">
      
      {/* 01 — WHO WE ARE */}
      <section className="max-w-[1600px] mx-auto px-6 md:px-12 mb-16 md:mb-32 reveal-up">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-center lg:items-start">
          <div className="w-full lg:w-[45%] flex flex-col gap-8 order-2 lg:order-1">
             <div className="text-xs tracking-widest uppercase text-muted-foreground font-medium mb-2">
                01 — Who We Are
             </div>
             <h1 className="font-serif text-[clamp(3.5rem,6vw,6rem)] leading-[0.9] tracking-tight uppercase text-foreground">
                Finishes<br />With Purpose.
             </h1>
             <div className="text-lg md:text-xl font-light leading-relaxed tracking-wide text-foreground/80 mt-4 max-w-lg">
                Spacesio Beryl is a premium interior supply house specializing in curated flooring, luxury wallpapers, and elegant window blinds. We partner with architects, designers, and visionaries to provide exceptional finishing touches for spaces that demand lasting quality.
             </div>
          </div>
          <div className="w-full lg:w-[55%] order-1 lg:order-2">
             <div className="relative w-full aspect-[16/10] bg-muted overflow-hidden reveal-image">
                <Image
                   src="/assets/images/landing/interior-reveal.jpg"
                   alt="Spacesio Beryl Architectural Interior"
                   fill
                   sizes="(max-width: 1024px) 100vw, 55vw"
                   className="object-cover"
                   priority
                />
             </div>
          </div>
        </div>
      </section>

      {/* 02 — WHAT WE DO */}
      <section className="max-w-[1600px] mx-auto px-6 md:px-12 mb-16 md:mb-32 reveal-up">
        <h2 className="text-xs font-medium tracking-widest uppercase text-muted-foreground border-b border-border pb-4 mb-12">
          02 — What We Do
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
          <div>
            <h3 className="text-2xl md:text-3xl font-light leading-snug tracking-wide text-foreground mb-6">
              We source and supply premium flooring, wallpapers, and window blinds for the world&apos;s most considered interiors.
            </h3>
          </div>
          <div className="flex flex-col gap-6 text-base md:text-lg font-light leading-relaxed tracking-wide text-foreground/70">
            <p>
              Rather than overwhelming our clients with infinite choices, we do the rigorous work of curation. We travel globally to identify interior elements that meet our exacting standards for aesthetic brilliance, structural integrity, and sustainable sourcing.
            </p>
            <p>
              From natural wood and high-performance SPC flooring to textured wallpapers and elegant window treatments, we provide a unified palette that helps professionals and individuals elevate their residential, commercial, and hospitality environments.
            </p>
          </div>
        </div>
      </section>

      {/* 03 — OUR APPROACH */}
      <section className="max-w-[1600px] mx-auto px-6 md:px-12 mb-16 md:mb-32">
        <h2 className="text-xs font-medium tracking-widest uppercase text-muted-foreground border-b border-border pb-4 mb-16 reveal-up">
          03 — Our Approach
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-16 stagger-group">
          {[
            { title: "Curation", desc: "We believe in selecting with intention rather than offering unnecessary abundance. Every product earns its place in our collection." },
            { title: "Design", desc: "Every choice should contribute to the character and function of the space, enhancing the interior without overpowering it." },
            { title: "Quality", desc: "Our flooring and wall coverings must meet exceptionally high standards of aesthetics, performance, and day-to-day reliability." },
            { title: "Longevity", desc: "We value solutions designed to remain relevant and perform beautifully over time, resisting both physical wear and fleeting trends." },
          ].map((item, i) => (
            <div key={i} className="flex flex-col gap-4 border-t border-border/50 pt-6 stagger-item">
              <span className="font-serif text-3xl text-muted-foreground">0{i + 1}</span>
              <h3 className="text-sm font-medium tracking-widest uppercase text-foreground">{item.title}</h3>
              <p className="text-foreground/70 font-light leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 04 — OUR PHILOSOPHY */}
      <section className="max-w-[1600px] mx-auto px-6 md:px-12 mb-16 md:mb-32 text-center reveal-up">
        <h2 className="font-serif text-[clamp(3rem,6vw,6rem)] leading-tight uppercase max-w-4xl mx-auto mb-8 text-foreground">
          Every detail<br/>should serve<br/>the space.
        </h2>
        <p className="text-lg md:text-xl font-light leading-relaxed tracking-wide text-foreground/70 max-w-2xl mx-auto">
          We don&apos;t believe in elements that demand attention. We believe in finishes that create atmosphere.
        </p>
      </section>

      {/* 05 — FAQ */}
      <section className="max-w-[800px] mx-auto px-6 md:px-12 mb-16 md:mb-32 reveal-up">
        <h2 className="text-xs font-medium tracking-widest uppercase text-muted-foreground border-b border-border pb-4 mb-12 text-center">
          05 — Frequently Asked Questions
        </h2>
        <div className="flex flex-col border-t border-border">
          {FAQ_ITEMS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="border-b border-border">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full py-6 flex justify-between items-center text-left focus:outline-none group bg-transparent border-none"
                  aria-expanded={isOpen}
                >
                  <span className="text-lg md:text-xl font-light pr-8 group-hover:text-foreground/70 transition-colors text-foreground">
                    {faq.q}
                  </span>
                  <Plus
                    className={`shrink-0 w-5 h-5 text-muted-foreground transition-transform duration-300 ease-out ${
                      isOpen ? "rotate-45" : "rotate-0"
                    }`}
                  />
                </button>
                <div
                  className="overflow-hidden transition-all duration-300 ease-out"
                  style={{
                    maxHeight: isOpen ? "200px" : "0",
                    opacity: isOpen ? 1 : 0,
                  }}
                  aria-hidden={!isOpen}
                >
                  <p className="pb-8 text-foreground/70 font-light leading-relaxed text-sm md:text-base pr-12">
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}

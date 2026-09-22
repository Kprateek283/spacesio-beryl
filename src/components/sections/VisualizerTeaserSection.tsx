import Image from "next/image";
import Link from "next/link";
import { TextReveal } from "@/components/motion/TextReveal";
import { FadeIn } from "@/components/motion/FadeIn";
import { ImageReveal } from "@/components/motion/ImageReveal";

export function VisualizerTeaserSection() {
  return (
    <section className="w-full py-24 md:py-32 px-6 md:px-12 bg-muted text-foreground overflow-hidden">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
        
        <div className="flex flex-col items-start z-10">
          <h2 className="font-serif text-[clamp(3rem,6vw,6rem)] leading-[0.9] tracking-tight uppercase mb-8">
            <TextReveal delay={0}>See it</TextReveal><br/>
            <TextReveal delay={0.1}>In your space.</TextReveal>
          </h2>
          <FadeIn delay={0.2}>
            <p className="text-lg md:text-xl text-foreground/70 font-light tracking-wide max-w-md mb-12">
              Explore materials in an interactive environment and find the combination that fits your space.
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <Link href="/visualizer" className="inline-flex items-center gap-4 text-sm font-medium tracking-widest uppercase group">
              <span className="border-b border-foreground/30 pb-1 group-hover:border-foreground transition-colors duration-300">
                Explore the Visualizer
              </span>
              <span className="text-xl group-hover:translate-x-2 transition-transform duration-300">→</span>
            </Link>
          </FadeIn>
        </div>

        {/* Placeholder for future Three.js canvas */}
        <ImageReveal direction="left" className="w-full h-full">
          <div className="relative w-full aspect-square md:aspect-[4/5] bg-background">
            <Image
              src="/assets/images/landing/visualizer-teaser.jpg"
              alt="Spacesio Beryl 3D Visualizer Preview"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
            {/* Mock UI overlay for the teaser */}
            <div className="absolute inset-0 border-[20px] md:border-[40px] border-background mix-blend-overlay opacity-50 pointer-events-none" />
            <div className="absolute bottom-6 right-6 md:bottom-12 md:right-12 bg-background/80 backdrop-blur-sm p-4 text-xs tracking-widest uppercase flex flex-col gap-2 pointer-events-none">
              <span>Material: Oak Natural</span>
              <span>Pattern: Chevron</span>
              <span>Wall: Warm Stone</span>
            </div>
          </div>
        </ImageReveal>

      </div>
    </section>
  );
}

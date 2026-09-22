import Link from "next/link";
import { TextReveal } from "@/components/motion/TextReveal";
import { FadeIn } from "@/components/motion/FadeIn";

export function FinalCTASection() {
  return (
    <section className="w-full py-32 md:py-48 px-6 md:px-12 bg-background flex flex-col items-center justify-center text-center">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        <FadeIn>
          <p className="text-muted-foreground text-sm tracking-widest uppercase mb-8">
            Every surface has a story.
          </p>
        </FadeIn>
        <h2 className="font-serif text-[clamp(3rem,7vw,8rem)] leading-[0.9] tracking-tight uppercase mb-16">
          <TextReveal delay={0.1}>Ready to</TextReveal><br/>
          <TextReveal delay={0.2}>Define your space?</TextReveal>
        </h2>
        
        <FadeIn delay={0.3} className="flex justify-center mt-8">
          <Link 
            href="/contact" 
            className="group bg-foreground text-background px-10 py-5 text-sm md:text-base font-bold tracking-[0.2em] uppercase hover:opacity-80 transition-opacity duration-300"
          >
            Request a Consultation <span className="inline-block transition-transform duration-300 group-hover:translate-x-2">→</span>
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}

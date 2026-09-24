import Image from 'next/image';
import dynamic from 'next/dynamic';
import { HeroSection } from "@/components/sections/HeroSection";

// Dynamically import below-the-fold sections to reduce initial JS payload
const MaterialsSection = dynamic(() => import("@/components/sections/MaterialsSection").then(mod => mod.MaterialsSection));
// const VisualizerTeaserSection = dynamic(() => import("@/components/sections/VisualizerTeaserSection").then(mod => mod.VisualizerTeaserSection));
const FinalCTASection = dynamic(() => import("@/components/sections/FinalCTASection").then(mod => mod.FinalCTASection));

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://spacesioberyl.com/#organization",
        "name": "Spacesio Beryl",
        "url": "https://spacesioberyl.com",
        "logo": "https://spacesioberyl.com/assets/icons/logo.png",
        "description": "Premium architectural surfaces, flooring, and wall coverings for luxury spaces.",
      },
      {
        "@type": "WebSite",
        "@id": "https://spacesioberyl.com/#website",
        "url": "https://spacesioberyl.com",
        "name": "Spacesio Beryl",
        "publisher": {
          "@id": "https://spacesioberyl.com/#organization"
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroSection />
      <MaterialsSection />
      {/* <VisualizerTeaserSection /> */}
      <FinalCTASection />
      
      {/* Global Homepage Scroll Hint */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center text-white/70 text-xs tracking-widest uppercase z-50 mix-blend-difference pointer-events-none">
        <span className="mb-3">Scroll to explore</span>
        <Image 
          src="/assets/icons/scrolldown.svg" 
          alt="Scroll down" 
          width={24} 
          height={24} 
          className="animate-bounce brightness-0 invert opacity-70"
        />
      </div>
    </>
  );
}

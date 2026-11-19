import dynamic from 'next/dynamic';
import type { Metadata } from "next";
import { HeroSection } from "@/components/sections/HeroSection";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: { absolute: siteConfig.title },
  alternates: { canonical: "/" },
};

// Dynamically import below-the-fold sections to reduce initial JS payload
const MaterialsSection = dynamic(() => import("@/components/sections/MaterialsSection").then(mod => mod.MaterialsSection));
// const VisualizerTeaserSection = dynamic(() => import("@/components/sections/VisualizerTeaserSection").then(mod => mod.VisualizerTeaserSection));
const FinalCTASection = dynamic(() => import("@/components/sections/FinalCTASection").then(mod => mod.FinalCTASection));

export default function Home() {
  const url = siteConfig.url;
  const sameAs = Object.values(siteConfig.socialLinks).filter(
    (link) => !link.includes("placeholder")
  );
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "HomeAndConstructionBusiness"],
        "@id": `${url}/#organization`,
        name: siteConfig.name,
        alternateName: ["Spacesio", "SpacesioBeryl"],
        url,
        logo: `${url}/assets/icons/logo.png`,
        image: `${url}/assets/images/landing/hero.jpg`,
        description: siteConfig.description,
        email: siteConfig.contact.email,
        telephone: siteConfig.contact.phoneHref.replace("tel:", ""),
        address: {
          "@type": "PostalAddress",
          streetAddress: siteConfig.contact.address.street,
          addressLocality: siteConfig.contact.address.locality,
          addressRegion: siteConfig.contact.address.region,
          postalCode: siteConfig.contact.address.postalCode,
          addressCountry: siteConfig.contact.address.country,
        },
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "09:00",
          closes: "18:00",
        },
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer service",
          telephone: siteConfig.contact.phoneHref.replace("tel:", ""),
          email: siteConfig.contact.email,
          areaServed: "IN",
          availableLanguage: ["English", "Hindi"],
        },
        ...(sameAs.length > 0 && { sameAs }),
      },
      {
        "@type": "WebSite",
        "@id": `${url}/#website`,
        url,
        name: siteConfig.name,
        alternateName: "Spacesio",
        publisher: { "@id": `${url}/#organization` },
      },
    ],
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
      
    </>
  );
}

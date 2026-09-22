import { Suspense } from "react";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactInfo } from "@/components/contact/ContactInfo";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Spacesio Beryl",
  description: "Tell us about your project, material requirements or space.",
};

export default function ContactPage() {
  return (
    <div className="pt-32 pb-24 min-h-screen bg-background">
      
      {/* Hero */}
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 mb-24 md:mb-32">
        <h1 className="font-serif text-[clamp(4rem,8vw,8rem)] leading-[0.9] tracking-tight uppercase max-w-5xl mb-6">
          Let&apos;s define<br/>your space.
        </h1>
        <p className="text-muted-foreground tracking-widest font-light uppercase text-sm max-w-xl">
          Tell us about your project, material requirements or space.
        </p>
      </div>

      {/* Content */}
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          
          <div className="lg:col-span-4 order-2 lg:order-1">
            <ContactInfo />
          </div>

          <div className="lg:col-span-8 order-1 lg:order-2">
            <h2 className="text-sm font-medium tracking-widest uppercase text-muted-foreground border-b border-border pb-4 mb-12">
              Send an Inquiry
            </h2>
            <Suspense fallback={<div className="h-96 flex items-center text-xs tracking-widest uppercase text-muted-foreground">Loading form...</div>}>
              <ContactForm />
            </Suspense>
          </div>

        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 md:px-12 mt-32 flex flex-col gap-4">
        <div className="w-full aspect-[21/9] bg-muted border border-border overflow-hidden">
          <iframe
            title="Spacesio Beryl office location — Chauhan Tower, Madhu Vihar, New Delhi"
            src="https://maps.google.com/maps?q=Chauhan+Tower,+A-25,+Vihar+Road,+Madhu+Vihar,+I.P.+Extension,+New+Delhi+110092&z=16&output=embed"
            className="w-full h-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <a
          href="https://www.google.com/maps/search/?api=1&query=Chauhan+Tower,+A-25,+Vihar+Road,+Madhu+Vihar,+I.P.+Extension,+New+Delhi+110092"
          target="_blank"
          rel="noopener noreferrer"
          className="self-start text-xs font-medium tracking-widest uppercase border-b border-transparent hover:border-foreground transition-colors"
        >
          View on Google Maps →
        </a>
      </div>

    </div>
  );
}

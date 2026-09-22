import Link from "next/link";
import { Metadata } from "next";
import { getFaqs } from "@/lib/api/faqs";
import { Faq } from "@/data/faqs";

export const metadata: Metadata = {
  title: "FAQ | Spacesio Beryl",
  description: "Answers to common questions about ordering, samples, installation, and more.",
};

function groupByCategory(faqs: Faq[]): [string, Faq[]][] {
  const groups = new Map<string, Faq[]>();
  for (const faq of faqs) {
    const key = faq.category || "General";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(faq);
  }
  return Array.from(groups.entries());
}

export default async function FaqPage() {
  const faqs = await getFaqs();
  const groups = groupByCategory(faqs);

  return (
    <div className="pt-32 pb-24 min-h-screen bg-background">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 mb-16 md:mb-24 text-center md:text-left">
        <div className="text-xs tracking-widest uppercase text-muted-foreground font-medium mb-6">
          Support
        </div>
        <h1 className="font-serif text-[clamp(3rem,6vw,6rem)] leading-none tracking-tight uppercase max-w-4xl">
          Frequently Asked Questions
        </h1>
      </div>

      <div className="max-w-4xl mx-auto px-6 md:px-12 flex flex-col gap-16">
        {groups.map(([category, items]) => (
          <div key={category} className="flex flex-col gap-2">
            <h2 className="text-sm font-medium tracking-widest uppercase text-muted-foreground border-b border-border pb-4 mb-4">
              {category}
            </h2>
            {items.map((item) => (
              <details key={item.id} className="group border-b border-border py-6">
                <summary className="flex items-center justify-between gap-6 cursor-pointer list-none font-serif text-xl md:text-2xl leading-snug">
                  {item.question}
                  <span className="shrink-0 text-2xl font-light text-muted-foreground transition-transform duration-300 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-4 text-foreground/70 font-light leading-relaxed max-w-2xl">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        ))}
      </div>

      <div className="max-w-[1600px] mx-auto px-6 md:px-12 mt-24 md:mt-32 text-center flex flex-col items-center gap-8">
        <h2 className="font-serif text-3xl md:text-5xl uppercase tracking-tight">
          Still have questions?
        </h2>
        <Link
          href="/contact"
          className="bg-foreground text-background px-12 py-5 text-sm font-medium tracking-widest uppercase hover:bg-accent transition-colors"
        >
          Get in Touch →
        </Link>
      </div>
    </div>
  );
}
